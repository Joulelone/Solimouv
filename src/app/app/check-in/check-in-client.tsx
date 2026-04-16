"use client";

import { FirebaseError } from "firebase/app";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { FESTIVAL_STANDS, getStandById } from "@/lib/festival-stands";
import { db } from "@/lib/firebase";

type BarcodeDetectionResult = {
  rawValue?: string;
};

type BarcodeDetectorInstance = {
  detect: (input: ImageBitmapSource) => Promise<BarcodeDetectionResult[]>;
};

type BarcodeDetectorConstructor = new (options?: {
  formats?: string[];
}) => BarcodeDetectorInstance;

type WindowWithBarcodeDetector = Window & {
  BarcodeDetector?: BarcodeDetectorConstructor;
};

type NavigatorWithMediaDevices = Navigator & {
  mediaDevices?: {
    getUserMedia?: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
  };
};

function getFirestoreMessage(error: unknown) {
  if (error instanceof FirebaseError && error.code === "permission-denied") {
    return "Firestore refuse l'action. Mets a jour puis publie firestore.rules.";
  }

  return "Impossible de valider le check-in pour le moment.";
}

function extractUserId(rawValue: string) {
  const value = rawValue.trim();
  if (!value) {
    return "";
  }

  try {
    const parsed = new URL(value, "https://local.scan");
    const userFromQuery = parsed.searchParams.get("user")?.trim() ?? "";
    if (userFromQuery) {
      return userFromQuery;
    }
  } catch {
    // Fallback regex below for malformed URLs or raw UID content.
  }

  const fromRegex = /[?&]user=([^&]+)/.exec(value);
  if (fromRegex?.[1]) {
    return decodeURIComponent(fromRegex[1]).trim();
  }

  // Accept a direct UID pasted manually.
  if (!value.includes(" ") && value.length >= 8) {
    return value;
  }

  return "";
}

function maskUid(uid: string) {
  if (uid.length < 10) {
    return uid;
  }
  return `${uid.slice(0, 5)}...${uid.slice(-5)}`;
}

export function CheckInClient() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const initialStand = searchParams.get("stand");
  const initialTargetUserId = useMemo(
    () => searchParams.get("user")?.trim() ?? "",
    [searchParams],
  );

  const [standId, setStandId] = useState(
    initialStand && getStandById(initialStand)
      ? initialStand
      : FESTIVAL_STANDS[0]?.id ?? "",
  );
  const [targetUserId, setTargetUserId] = useState(initialTargetUserId);
  const [scanInput, setScanInput] = useState("");
  const [scannerSupported, setScannerSupported] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const detectorRef = useRef<BarcodeDetectorInstance | null>(null);
  const detectBusyRef = useRef(false);

  const selectedStand = getStandById(standId);

  useEffect(() => {
    setTargetUserId(initialTargetUserId);
  }, [initialTargetUserId]);

  useEffect(() => {
    const windowWithBarcode = window as WindowWithBarcodeDetector;
    const navigatorWithMedia = navigator as NavigatorWithMediaDevices;
    const hasDetector = typeof windowWithBarcode.BarcodeDetector !== "undefined";
    const hasCamera = Boolean(navigatorWithMedia.mediaDevices?.getUserMedia);
    setScannerSupported(hasDetector && hasCamera);
  }, []);

  function stopScanner() {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }

    detectBusyRef.current = false;
    setScanning(false);
  }

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  async function startScanner() {
    const windowWithBarcode = window as WindowWithBarcodeDetector;
    const navigatorWithMedia = navigator as NavigatorWithMediaDevices;

    if (!windowWithBarcode.BarcodeDetector) {
      setScannerError(
        "Scanner QR non supporte sur ce navigateur. Utilise Chrome mobile ou colle l'URL du QR.",
      );
      return;
    }

    if (!navigatorWithMedia.mediaDevices?.getUserMedia) {
      setScannerError("Camera indisponible sur cet appareil.");
      return;
    }

    try {
      setScannerError(null);
      detectorRef.current = new windowWithBarcode.BarcodeDetector({
        formats: ["qr_code"],
      });

      const stream = await navigatorWithMedia.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setScanning(true);
      intervalRef.current = window.setInterval(async () => {
        if (!videoRef.current || !detectorRef.current || detectBusyRef.current) {
          return;
        }

        detectBusyRef.current = true;
        try {
          const detections = await detectorRef.current.detect(videoRef.current);
          const rawValue = detections[0]?.rawValue ?? "";
          if (!rawValue) {
            return;
          }

          const scannedUserId = extractUserId(rawValue);
          if (!scannedUserId) {
            setScannerError(
              "QR detecte mais format invalide. Attendu: une URL /check-in?user=...",
            );
            return;
          }

          setTargetUserId(scannedUserId);
          setStatusMessage(`Participant scanne: ${maskUid(scannedUserId)}.`);
          setScannerError(null);
          stopScanner();
        } catch {
          // Ignore transient detect errors while camera is active.
        } finally {
          detectBusyRef.current = false;
        }
      }, 450);
    } catch {
      stopScanner();
      setScannerError(
        "Impossible d'activer la camera. Verifie les permissions navigateur.",
      );
    }
  }

  function handleLoadFromInput() {
    const parsedUserId = extractUserId(scanInput);
    if (!parsedUserId) {
      setScannerError(
        "Format invalide. Colle une URL /check-in?user=... ou un UID participant.",
      );
      return;
    }

    setTargetUserId(parsedUserId);
    setStatusMessage(`Participant charge: ${maskUid(parsedUserId)}.`);
    setScannerError(null);
    setScanInput("");
  }

  async function handleCheckIn() {
    if (!db || !user || !selectedStand || !targetUserId) {
      return;
    }

    if (targetUserId === user.uid) {
      setStatusMessage(
        "Un participant ne peut pas se valider lui-meme. Utilise un compte animateur stand.",
      );
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    try {
      const scanId = `${targetUserId}__${selectedStand.id}`;
      const scanRef = doc(db, "passportScans", scanId);
      const existingScan = await getDoc(scanRef);

      if (existingScan.exists()) {
        setStatusMessage(
          `Participation deja validee pour le stand "${selectedStand.name}".`,
        );
        return;
      }

      await setDoc(scanRef, {
        userId: targetUserId,
        standId: selectedStand.id,
        standName: selectedStand.name,
        scannedBy: user.uid,
        scannedByEmail: user.email ?? null,
        scannedAt: serverTimestamp(),
      });

      setStatusMessage(
        `Check-in valide: ${selectedStand.name} pour ${maskUid(targetUserId)}.`,
      );
    } catch (error) {
      setStatusMessage(getFirestoreMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <p className="text-sm text-slate-300">
        Espace organisateur: scanne le QR d&apos;un participant (ou colle son lien),
        choisis le stand, puis valide.
      </p>

      <section className="mt-4 rounded-xl border border-white/10 bg-slate-950/40 p-4">
        <h2 className="text-base font-semibold">Scanner un participant</h2>
        <p className="mt-2 text-sm text-slate-300">
          QR attendu: URL du type `/check-in?user=...`
        </p>

        {scannerSupported ? (
          <>
            <div className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-black/30">
              <video
                ref={videoRef}
                className="h-56 w-full object-cover sm:h-64"
                muted
                playsInline
                autoPlay
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={startScanner}
                disabled={scanning}
                className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60"
              >
                {scanning ? "Scan en cours..." : "Demarrer le scan QR"}
              </button>
              <button
                type="button"
                onClick={stopScanner}
                disabled={!scanning}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10 disabled:opacity-60"
              >
                Arreter
              </button>
            </div>
          </>
        ) : (
          <p className="mt-3 rounded-lg border border-amber-200/30 bg-amber-300/10 px-3 py-2 text-sm text-amber-100">
            Le scan camera n&apos;est pas supporte ici. Utilise un navigateur compatible
            ou colle l&apos;URL du QR.
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={scanInput}
            onChange={(event) => setScanInput(event.target.value)}
            placeholder="Coller URL /check-in?user=... ou UID participant"
            className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm outline-none ring-cyan-300 transition focus:ring-2"
          />
          <button
            type="button"
            onClick={handleLoadFromInput}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            Charger
          </button>
        </div>

        {scannerError ? (
          <p className="mt-3 rounded-lg border border-rose-200/30 bg-rose-300/10 px-3 py-2 text-sm text-rose-100">
            {scannerError}
          </p>
        ) : null}
      </section>

      <section className="mt-4 rounded-xl border border-white/10 bg-slate-950/40 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400">Participant</p>
        {targetUserId ? (
          <p className="mt-1 font-mono text-sm text-slate-200">{maskUid(targetUserId)}</p>
        ) : (
          <p className="mt-1 text-sm text-slate-400">Aucun participant selectionne.</p>
        )}

        <label htmlFor="stand" className="mt-4 block text-sm font-medium text-slate-200">
          Stand
        </label>
        <select
          id="stand"
          className="mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm outline-none ring-cyan-300 transition focus:ring-2"
          value={standId}
          onChange={(event) => setStandId(event.target.value)}
        >
          {FESTIVAL_STANDS.map((stand) => (
            <option key={stand.id} value={stand.id}>
              {stand.name} - {stand.location}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={saving || !selectedStand || !targetUserId}
          onClick={handleCheckIn}
          className="mt-4 w-full rounded-lg bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60"
        >
          {saving ? "Validation..." : "Valider la participation"}
        </button>
      </section>

      {statusMessage ? (
        <p className="mt-4 rounded-xl border border-slate-200/20 bg-slate-300/10 px-4 py-3 text-sm text-slate-100">
          {statusMessage}
        </p>
      ) : null}
    </>
  );
}
