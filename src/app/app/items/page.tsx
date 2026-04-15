"use client";

import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { FormEvent, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";
import { useUserItems } from "@/hooks/use-user-items";
import { db } from "@/lib/firebase";

export default function ItemsPage() {
  const { user, isConfigured } = useAuth();
  const { items, loading, error } = useUserItems(user?.uid);
  const [title, setTitle] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!db || !user || !title.trim()) {
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    try {
      await addDoc(collection(db, "items"), {
        title: title.trim(),
        done: false,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setTitle("");
      setStatusMessage("Item ajoute.");
    } catch (nextError) {
      setStatusMessage(getFirestoreMessage(nextError));
    } finally {
      setSaving(false);
    }
  }

  async function toggleDone(id: string, done: boolean) {
    if (!db) {
      return;
    }

    setBusyId(id);
    setStatusMessage(null);

    try {
      await updateDoc(doc(db, "items", id), {
        done,
        updatedAt: serverTimestamp(),
      });
    } catch (nextError) {
      setStatusMessage(getFirestoreMessage(nextError));
    } finally {
      setBusyId(null);
    }
  }

  async function removeItem(id: string) {
    if (!db) {
      return;
    }

    setBusyId(id);
    setStatusMessage(null);

    try {
      await deleteDoc(doc(db, "items", id));
    } catch (nextError) {
      setStatusMessage(getFirestoreMessage(nextError));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AppShell title="Items">
      {!isConfigured ? (
        <p className="rounded-xl border border-amber-200/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          Firebase non configure. Ajoute les variables env pour activer la data.
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-rose-200/30 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </p>
      ) : null}

      {statusMessage ? (
        <p className="rounded-xl border border-slate-200/20 bg-slate-300/10 px-4 py-3 text-sm text-slate-200">
          {statusMessage}
        </p>
      ) : null}

      <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          className="w-full rounded-lg border border-white/15 bg-slate-950/40 px-3 py-2 text-sm outline-none ring-cyan-300 transition focus:ring-2"
          type="text"
          placeholder="Nouvel item..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={120}
        />
        <button
          type="submit"
          disabled={!isConfigured || saving || !title.trim()}
          className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
        >
          {saving ? "Ajout..." : "Ajouter"}
        </button>
      </form>

      <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/40 p-4">
        {loading ? (
          <p className="text-sm text-slate-400">Chargement...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-400">Aucun item pour le moment.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => {
              const disabled = busyId === item.id || !isConfigured;
              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 rounded-lg border border-white/10 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={item.done}
                      disabled={disabled}
                      onChange={(event) => toggleDone(item.id, event.target.checked)}
                    />
                    <span
                      className={
                        item.done
                          ? "text-slate-400 line-through"
                          : "text-slate-100"
                      }
                    >
                      {item.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => removeItem(item.id)}
                    className="rounded-lg border border-rose-300/30 px-3 py-1 text-xs font-medium text-rose-200 transition hover:bg-rose-300/10 disabled:opacity-60"
                  >
                    Supprimer
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}

function getFirestoreMessage(error: unknown) {
  if (error instanceof FirebaseError && error.code === "permission-denied") {
    return "Firestore refuse l'action. Publie les regles firestore.rules.";
  }

  return "Erreur Firestore. Verifie la configuration du projet.";
}
