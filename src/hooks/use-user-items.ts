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
import { db } from "@/lib/firebase";

export type UserItem = {
  id: string;
  title: string;
  done: boolean;
  createdBy: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

export function useUserItems(uid: string | undefined) {
  const canQuery = Boolean(uid && db);
  const [items, setItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(canQuery);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid || !db) {
      return;
    }

    const itemsQuery = query(
      collection(db, "items"),
      where("createdBy", "==", uid),
    );

    const unsubscribe = onSnapshot(
      itemsQuery,
      (snapshot) => {
        const nextItems = snapshot.docs.map((doc) => {
          const data = doc.data() as Partial<UserItem>;
          return {
            id: doc.id,
            title: data.title ?? "",
            done: data.done ?? false,
            createdBy: data.createdBy ?? "",
            createdAt: data.createdAt ?? null,
            updatedAt: data.updatedAt ?? null,
          };
        });

        setItems(nextItems);
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
          setError("Impossible de charger les items.");
        }
      },
    );

    return () => unsubscribe();
  }, [uid]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const timeA = a.createdAt?.seconds ?? 0;
      const timeB = b.createdAt?.seconds ?? 0;
      return timeB - timeA;
    });
  }, [items]);

  if (!canQuery) {
    return { items: [], loading: false, error: null };
  }

  return { items: sortedItems, loading, error };
}
