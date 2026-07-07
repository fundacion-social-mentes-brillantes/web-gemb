import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/* ═══════════════════════════════════════════════════════════════
   Acceso a datos del PORTAL DE PROCESO.

   Colecciones (ver firestore.rules):
   - processMembers/{uid}  → perfil, rol y estado de acceso, kits habilitados.
   - processProgress/{uid} → lecciones completadas (la coach puede verlo).
   - processJournals/{uid} → lo que la persona escribe (PRIVADO, solo ella).
   ═══════════════════════════════════════════════════════════════ */

export const PROCESS_MEMBERS_COLLECTION = 'processMembers';
export const PROCESS_PROGRESS_COLLECTION = 'processProgress';
export const PROCESS_JOURNALS_COLLECTION = 'processJournals';

export const KIT_IDS = ['emocional', 'financiero', 'salud'];
export const MEMBER_ROLES = ['client', 'admin', 'superadmin'];
export const MEMBER_STATUSES = ['pending', 'active', 'blocked'];

const ensureDb = () => {
  if (!db) {
    throw new Error('Firebase no esta configurado. Revisa las variables de entorno.');
  }
  return db;
};

const cleanText = (value) => String(value || '').trim();

const emptyKits = () => KIT_IDS.reduce((acc, id) => ({ ...acc, [id]: false }), {});

/* ── Miembro (perfil + acceso) ─────────────────────────────────── */

export const getMyMember = async (uid) => {
  const snapshot = await getDoc(doc(ensureDb(), PROCESS_MEMBERS_COLLECTION, uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const createMyMember = async ({ uid, email, fullName, phone, gender, consent }) => {
  await setDoc(doc(ensureDb(), PROCESS_MEMBERS_COLLECTION, uid), {
    uid,
    email: cleanText(email),
    fullName: cleanText(fullName),
    phone: cleanText(phone),
    gender, // 'masculino' | 'femenino'
    role: 'client',
    status: 'pending',
    kits: emptyKits(),
    consent: {
      privacyAccepted: Boolean(consent?.privacyAccepted),
      sensitiveDataAccepted: Boolean(consent?.sensitiveDataAccepted),
      acceptedAt: serverTimestamp()
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateMyProfile = async (uid, { fullName, phone, gender }) => {
  await updateDoc(doc(ensureDb(), PROCESS_MEMBERS_COLLECTION, uid), {
    fullName: cleanText(fullName),
    phone: cleanText(phone),
    gender,
    updatedAt: serverTimestamp()
  });
};

/* ── Avance (lecciones completadas) ───────────────────────────── */

export const getMyProgress = async (uid) => {
  const snapshot = await getDoc(doc(ensureDb(), PROCESS_PROGRESS_COLLECTION, uid));
  return snapshot.exists() ? snapshot.data() : { completedLessons: [] };
};

export const setLessonCompleted = async (uid, lessonId, completedLessons) => {
  const next = Array.from(new Set([...(completedLessons || []), lessonId]));
  await setDoc(
    doc(ensureDb(), PROCESS_PROGRESS_COLLECTION, uid),
    { uid, completedLessons: next, updatedAt: serverTimestamp() },
    { merge: true }
  );
  return next;
};

/* Resultados de herramientas (ej. escáner de creencias). Se guardan en
   processProgress para que la coach pueda verlos. La regla de Firestore
   solo exige que completedLessons sea lista, por eso la incluimos. */
export const saveToolResult = async (uid, toolId, resultData, completedLessons) => {
  await setDoc(
    doc(ensureDb(), PROCESS_PROGRESS_COLLECTION, uid),
    {
      uid,
      completedLessons: Array.isArray(completedLessons) ? completedLessons : [],
      toolResults: { [toolId]: resultData },
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
};

/* ── Diario privado (lo que la persona escribe) ───────────────── */

export const getMyJournal = async (uid) => {
  const snapshot = await getDoc(doc(ensureDb(), PROCESS_JOURNALS_COLLECTION, uid));
  return snapshot.exists() ? (snapshot.data().entries || {}) : {};
};

export const saveJournalEntry = async (uid, blockId, value) => {
  await setDoc(
    doc(ensureDb(), PROCESS_JOURNALS_COLLECTION, uid),
    { uid, entries: { [blockId]: value }, updatedAt: serverTimestamp() },
    { merge: true }
  );
};

/* ── Administración (aprobar, habilitar kits, roles) ──────────── */

export const listMembers = async () => {
  const membersQuery = query(
    collection(ensureDb(), PROCESS_MEMBERS_COLLECTION),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(membersQuery);
  return snapshot.docs.map((memberDoc) => ({ id: memberDoc.id, ...memberDoc.data() }));
};

export const setMemberStatus = async (uid, status) => {
  await updateDoc(doc(ensureDb(), PROCESS_MEMBERS_COLLECTION, uid), {
    status,
    updatedAt: serverTimestamp()
  });
};

export const setMemberKit = async (uid, kitId, enabled) => {
  await updateDoc(doc(ensureDb(), PROCESS_MEMBERS_COLLECTION, uid), {
    [`kits.${kitId}`]: Boolean(enabled),
    updatedAt: serverTimestamp()
  });
};

export const setMemberRole = async (uid, role) => {
  await updateDoc(doc(ensureDb(), PROCESS_MEMBERS_COLLECTION, uid), {
    role,
    updatedAt: serverTimestamp()
  });
};
