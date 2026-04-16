"use client";

import { FirebaseError } from "firebase/app";
import {
  collection,
  onSnapshot,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { FESTIVAL_STANDS } from "@/lib/festival-stands";
import { db } from "@/lib/firebase";

export type PassportScan = {
  id: string;
  userId: string;
  standId: string;
  standName: string;
  scannedBy: string;
  scannedAt: Timestamp | null;
};

export function usePassportScans(uid: string | undefined) {
  const canQuery = Boolean(uid && db);
  const [scans, setScans] = useState<PassportScan[]>([]);
  const [loading, setLoading] = useState(canQuery);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid || !db) {
      return;
    }

    const scansQuery = query(
      collection(db, "passportScans"),
      where("userId", "==", uid),
    );

    const unsubscribe = onSnapshot(
      scansQuery,
      (snapshot) => {
        const nextScans = snapshot.docs.map((scanDoc) => {
          const data = scanDoc.data() as Partial<PassportScan>;
          return {
            id: scanDoc.id,
            userId: data.userId ?? "",
            standId: data.standId ?? "",
            standName: data.standName ?? "",
            scannedBy: data.scannedBy ?? "",
            scannedAt: data.scannedAt ?? null,
          };
        });

        setScans(nextScans);
        setLoading(false);
      },
      (nextError) => {
        setLoading(false);

        if (
          nextError instanceof FirebaseError &&
          nextError.code === "permission-denied"
        ) {
          setError(
            "Acces Firestore refuse. Publie les regles firestore avant de continuer.",
          );
        } else {
          setError("Impossible de charger le passeport evenement.");
        }
      },
    );

    return () => unsubscribe();
  }, [uid]);

  const visitedStandIds = useMemo(
    () =>
      new Set(
        scans
          .filter((scan) => scan.standId.trim().length > 0)
          .map((scan) => scan.standId),
      ),
    [scans],
  );

  const completion = useMemo(() => {
    const total = FESTIVAL_STANDS.length;
    const completed = FESTIVAL_STANDS.filter((stand) =>
      visitedStandIds.has(stand.id),
    ).length;
    const ratio = total === 0 ? 0 : completed / total;
    return { total, completed, ratio };
  }, [visitedStandIds]);

  if (!canQuery) {
    return {
      scans: [],
      visitedStandIds: new Set<string>(),
      completion: { total: FESTIVAL_STANDS.length, completed: 0, ratio: 0 },
      loading: false,
      error: null,
    };
  }

  return { scans, visitedStandIds, completion, loading, error };
}
