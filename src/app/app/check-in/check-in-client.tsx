"use client";

import { FirebaseError } from "firebase/app";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { MobileBurgerMenu } from "@/components/mobile-burger-menu";
import { FESTIVAL_STANDS, getStandById } from "@/lib/festival-stands";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";

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

type HistoryStatus = "valid" | "refused";

type ScanHistoryEntry = {
  id: string;
  name: string;
  activity: string;
  status: HistoryStatus;
  time: string;
  code: string;
};

const seedHistory: ScanHistoryEntry[] = [
  {
    id: "lea-aubry",
    name: "Lea Aubry",
    activity: "Yoga & mobilite",
    status: "valid",
    time: "16h41",
    code: "LA-2201",
  },
  {
    id: "theo-hamdi",
    name: "Theo Hamdi",
    activity: "Badminton decouverte",
    status: "valid",
    time: "16h38",
    code: "TH-0847",
  },
  {
    id: "pass-inconnu",
    name: "Pass inconnu",
    activity: "Pass non reconnu",
    status: "refused",
    time: "16h35",
    code: "MA-3302",
  },
  {
    id: "fatou-aw",
    name: "Fatou Aw",
    activity: "Boxe initiation",
    status: "valid",
    time: "16h29",
    code: "FA-1193",
  },
];

const knownProfiles: Record<string, { name: string; activity: string }> = {
  "LA-2201": { name: "Lea Aubry", activity: "Yoga & mobilite" },
  "TH-0847": { name: "Theo Hamdi", activity: "Badminton decouverte" },
  "FA-1193": { name: "Fatou Aw", activity: "Boxe initiation" },
  "AM-0561": { name: "Amara Mbaye", activity: "Natation libre" },
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

  // Accept manual pass code or direct UID.
  if (!value.includes(" ") && value.length >= 4) {
    return value;
  }

  return "";
}

function formatCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}h${minutes}`;
}

function maskUid(uid: string) {
  if (uid.length <= 8) {
    return uid;
  }
  return `${uid.slice(0, 4)}...${uid.slice(-4)}`;
}

function MobileMenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m12.5 4.5-5.5 5.5 5.5 5.5" />
      <path d="M7 10h8" />
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9.9 1.8 4.7 9h3.4l-1 7.2L13.3 9H9.9l0-7.2Z" />
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="9" cy="9" r="6.4" />
      <path d="m6.2 9.2 1.8 1.8 3.8-3.9" />
    </svg>
  );
}

function WarningBadgeIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="9" cy="9" r="6.4" />
      <path d="M9 5.3v4.2" />
      <circle cx="9" cy="11.9" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [history, setHistory] = useState<ScanHistoryEntry[]>(seedHistory);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const detectorRef = useRef<BarcodeDetectorInstance | null>(null);
  const detectBusyRef = useRef(false);

  const selectedStand = getStandById(standId);

  const todayScans = useMemo(() => {
    const validated = history.filter((entry) => entry.status === "valid").length;
    return 443 + validated;
  }, [history]);

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

  function pushHistory(entry: Omit<ScanHistoryEntry, "id">) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setHistory((current) => [{ id, ...entry }, ...current].slice(0, 8));
  }

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

  async function validateParticipant(userIdToValidate: string) {
    if (!selectedStand) {
      setStatusMessage("Aucun stand actif selectionne.");
      return;
    }

    const fallbackActivity = selectedStand.name;
    const known = knownProfiles[userIdToValidate.toUpperCase()];
    const displayName = known?.name ?? `Participant ${maskUid(userIdToValidate)}`;
    const displayActivity = known?.activity ?? fallbackActivity;

    if (userIdToValidate.toUpperCase() === "MA-3302") {
      pushHistory({
        name: "Pass inconnu",
        activity: "Pass non reconnu",
        status: "refused",
        time: formatCurrentTime(),
        code: userIdToValidate,
      });
      setStatusMessage("Pass non reconnu.");
      return;
    }

    if (!db || !user) {
      setStatusMessage("Connexion requise pour valider le check-in.");
      pushHistory({
        name: displayName,
        activity: displayActivity,
        status: "refused",
        time: formatCurrentTime(),
        code: userIdToValidate,
      });
      return;
    }

    if (userIdToValidate === user.uid) {
      setStatusMessage(
        "Un participant ne peut pas se valider lui-meme. Utilise un compte animateur stand.",
      );
      pushHistory({
        name: displayName,
        activity: displayActivity,
        status: "refused",
        time: formatCurrentTime(),
        code: userIdToValidate,
      });
      return;
    }

    setSaving(true);
    try {
      const scanId = `${userIdToValidate}__${selectedStand.id}`;
      const scanRef = doc(db, "passportScans", scanId);
      const existingScan = await getDoc(scanRef);

      if (existingScan.exists()) {
        setStatusMessage(`Participation deja validee pour le stand \"${selectedStand.name}\".`);
        pushHistory({
          name: displayName,
          activity: displayActivity,
          status: "valid",
          time: formatCurrentTime(),
          code: userIdToValidate,
        });
        return;
      }

      await setDoc(scanRef, {
        userId: userIdToValidate,
        standId: selectedStand.id,
        standName: selectedStand.name,
        scannedBy: user.uid,
        scannedByEmail: user.email ?? null,
        scannedAt: serverTimestamp(),
      });

      setStatusMessage(`Check-in valide: ${selectedStand.name} pour ${displayName}.`);
      pushHistory({
        name: displayName,
        activity: displayActivity,
        status: "valid",
        time: formatCurrentTime(),
        code: userIdToValidate,
      });
    } catch (error) {
      setStatusMessage(getFirestoreMessage(error));
      pushHistory({
        name: displayName,
        activity: displayActivity,
        status: "refused",
        time: formatCurrentTime(),
        code: userIdToValidate,
      });
    } finally {
      setSaving(false);
    }
  }

  async function startScanner() {
    const windowWithBarcode = window as WindowWithBarcodeDetector;
    const navigatorWithMedia = navigator as NavigatorWithMediaDevices;

    if (!windowWithBarcode.BarcodeDetector) {
      setScannerError(
        "Scanner QR non supporte sur ce navigateur. Utilise Chrome mobile ou colle un code manuellement.",
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
            setScannerError("QR detecte mais format invalide.");
            return;
          }

          stopScanner();
          setTargetUserId(scannedUserId);
          setStatusMessage(`Code detecte: ${maskUid(scannedUserId)}.`);
          await validateParticipant(scannedUserId);
        } catch {
          // Ignore transient detect errors while camera is active.
        } finally {
          detectBusyRef.current = false;
        }
      }, 420);
    } catch {
      stopScanner();
      setScannerError(
        "Impossible d'activer la camera. Verifie les permissions navigateur.",
      );
    }
  }

  async function handleScanButton() {
    if (scanning) {
      stopScanner();
      return;
    }
    await startScanner();
  }

  async function handleManualValidate() {
    const parsedUserId = extractUserId(scanInput);
    if (!parsedUserId) {
      setScannerError("Format invalide. Ex: LA-2201 ou /check-in?user=...");
      return;
    }

    setTargetUserId(parsedUserId);
    setScannerError(null);
    await validateParticipant(parsedUserId);
    setScanInput("");
  }

  async function handleSignOut() {
    if (auth) {
      await signOut(auth);
    }
    stopScanner();
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <header className="border-b border-[rgba(255,255,255,0.08)] bg-[#1A1A1A]">
        <div className="mx-auto w-full max-w-[1240px] px-4 lg:px-8">
          <div className="flex h-[84px] items-center justify-between">
            <div className="w-8 lg:hidden" />
            <Link href="/" className="inline-flex">
              <Image src="/figma-logo.svg" alt="Logo Solimouv" width={150} height={50} priority />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((state) => !state)}
              className="inline-flex h-8 w-8 items-center justify-center text-white"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
            >
              <MobileMenuIcon />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.08)] py-3">
            <Link href="/organisateur" className="inline-flex items-center gap-3 text-white hover:opacity-90">
              <BackIcon />
              <span>
                <span className="block text-[16px] font-bold leading-[19.2px]">Scan de Pass&apos;Sport</span>
                <span className="block text-[11px] leading-[16.5px] text-[rgba(255,255,255,0.45)]">
                  {todayScans} scans aujourd&apos;hui
                </span>
              </span>
            </Link>
            <button
              type="button"
              aria-label="Mode lampe"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.45)]"
            >
              <LightningIcon />
            </button>
          </div>
        </div>
      </header>

      <MobileBurgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        organizerHref="/organisateur"
        isAuthenticated={Boolean(user)}
        onSignOut={user ? handleSignOut : undefined}
      />

      <main className="mx-auto w-full max-w-[1240px] pb-6 lg:px-8 lg:pt-4">
        <section className="border-b border-[rgba(255,255,255,0.08)] bg-black lg:rounded-[16px] lg:border lg:border-[rgba(255,255,255,0.08)]">
          <div className="relative mx-auto mt-9 h-[240px] w-[240px] overflow-hidden rounded-[4px] bg-[rgba(0,0,0,0.5)]">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover opacity-75"
              muted
              playsInline
              autoPlay
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:80px_80px]" />
            <div className={`absolute left-[6px] right-[6px] h-[2px] rounded bg-[#0558F6] ${scanning ? "animate-pulse" : "opacity-60"}`} style={{ top: "22px", boxShadow: "0 0 8px #0558F6" }} />
          </div>

          <div className="pointer-events-none absolute left-1/2 mt-[-240px] h-[240px] w-[240px] -translate-x-1/2">
            <span className="absolute left-0 top-0 h-9 w-9 rounded-tl-[4px] border-l-[3px] border-t-[3px] border-[#0558F6]" />
            <span className="absolute right-0 top-0 h-9 w-9 rounded-tr-[4px] border-r-[3px] border-t-[3px] border-[#0558F6]" />
            <span className="absolute bottom-0 left-0 h-9 w-9 rounded-bl-[4px] border-b-[3px] border-l-[3px] border-[#0558F6]" />
            <span className="absolute bottom-0 right-0 h-9 w-9 rounded-br-[4px] border-b-[3px] border-r-[3px] border-[#0558F6]" />
          </div>

          <p className="mt-5 text-center text-[22px] leading-[21px] text-[rgba(255,255,255,0.7)]">
            Positionne le QR code dans le cadre
          </p>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => {
                void handleScanButton();
              }}
              disabled={saving}
              className="inline-flex h-[72px] w-[72px] items-center justify-center rounded-[36px] border-4 border-[rgba(255,255,255,0.15)] bg-[#0558F6] shadow-[0px_0px_24px_0px_rgba(5,88,246,0.5)]"
            >
              <span className="inline-flex h-[56px] w-[56px] items-center justify-center rounded-[28px] bg-[rgba(255,255,255,0.1)]">
                <span className={`h-5 w-5 rounded-[10px] ${scanning ? "bg-[#80B1FF]" : "bg-white"}`} />
              </span>
            </button>
          </div>

          <p className="mt-4 pb-7 text-center text-[11px] text-[rgba(255,255,255,0.2)]">
            {scanning ? "Scan en cours..." : "Appuie pour simuler un scan"}
          </p>
        </section>

        <section className="border-b border-[rgba(255,255,255,0.08)] px-5 py-4">
          <p className="text-[12px] font-medium leading-[18px] text-[rgba(255,255,255,0.45)]">SAISIE MANUELLE</p>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={scanInput}
              onChange={(event) => setScanInput(event.target.value)}
              placeholder="ex. LA-2201"
              className="h-11 min-w-0 flex-1 rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-3 text-[14px] text-white outline-none placeholder:text-[rgba(255,255,255,0.5)] focus:border-[rgba(5,88,246,0.45)]"
            />
            <button
              type="button"
              onClick={() => {
                void handleManualValidate();
              }}
              disabled={saving}
              className="h-11 rounded-[10px] bg-[rgba(255,255,255,0.06)] px-5 text-[13px] font-semibold text-[rgba(255,255,255,0.45)] disabled:opacity-60"
            >
              {saving ? "..." : "Valider"}
            </button>
          </div>

          <p className="mt-2 text-[11px] text-[rgba(255,255,255,0.2)]">
            Essaie : LA-2201 · TH-0847 · FA-1193 · AM-0561
          </p>

          <div className="mt-3">
            <label htmlFor="stand" className="text-[10px] uppercase tracking-[0.07em] text-[rgba(255,255,255,0.3)]">
              Stand actif
            </label>
            <select
              id="stand"
              className="mt-1 h-10 w-full rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-3 text-[13px] text-white outline-none"
              value={standId}
              onChange={(event) => setStandId(event.target.value)}
            >
              {FESTIVAL_STANDS.map((stand) => (
                <option key={stand.id} value={stand.id}>
                  {stand.name} - {stand.location}
                </option>
              ))}
            </select>
          </div>

          {targetUserId ? (
            <p className="mt-2 text-[11px] text-[rgba(255,255,255,0.4)]">Code detecte: {maskUid(targetUserId)}</p>
          ) : null}

          {scannerError ? (
            <p className="mt-2 text-[11px] text-[#FF5C29]">{scannerError}</p>
          ) : null}

          {statusMessage ? (
            <p className="mt-1 text-[11px] text-[rgba(255,255,255,0.5)]">{statusMessage}</p>
          ) : null}

          {!scannerSupported ? (
            <p className="mt-2 text-[11px] text-[rgba(255,223,60,0.9)]">
              La camera n&apos;est pas disponible ici. Utilise la saisie manuelle.
            </p>
          ) : null}
        </section>

        <section className="px-5 py-4">
          <p className="text-[12px] font-medium leading-[18px] text-[rgba(255,255,255,0.45)]">HISTORIQUE · {Math.min(history.length, 8)} scans</p>
          <ul className="mt-3 space-y-2">
            {history.map((entry) => {
              const valid = entry.status === "valid";
              return (
                <li
                  key={entry.id}
                  className={`rounded-[12px] border bg-[#1A1A1A] p-[13px] ${
                    valid ? "border-[rgba(5,173,86,0.2)]" : "border-[rgba(255,92,41,0.2)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-[18px] ${
                        valid ? "bg-[rgba(5,173,86,0.18)] text-[#05AD56]" : "bg-[rgba(255,92,41,0.18)] text-[#FF5C29]"
                      }`}
                    >
                      {valid ? <CheckBadgeIcon /> : <WarningBadgeIcon />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-white">{entry.name}</p>
                      <p className="truncate text-[11px] text-[rgba(255,255,255,0.45)]">{entry.activity}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] font-semibold ${valid ? "text-[#05AD56]" : "text-[#FF5C29]"}`}>
                        {valid ? "VALIDE" : "REFUSE"}
                      </p>
                      <p className="text-[10px] text-[rgba(255,255,255,0.2)]">{entry.time}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}

