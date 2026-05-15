import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { auth, db } from '../lib/firebase';

export const TEST_RESPONSES_COLLECTION = 'testResponses';
export const TEST_VERSION = '2026-05-14';
export const CONSENT_TEXT_VERSION = '2026-05-14';

const TEST_TYPES = new Set([
  'initial-assessment',
  'enneagram-quick',
  'enneagram-full'
]);

const ensureDb = () => {
  if (!db) {
    throw new Error('Firebase no esta configurado. Revisa las variables de entorno.');
  }

  return db;
};

export const ensureAnonymousUser = async () => {
  if (!auth) {
    throw new Error('Firebase Auth no esta configurado. Revisa las variables de entorno.');
  }

  if (auth.currentUser) {
    return auth.currentUser;
  }

  const credential = await signInAnonymously(auth);
  return credential.user;
};

const cleanText = (value) => String(value || '').trim();

const normalizeContact = (contact = {}) => ({
  fullName: cleanText(contact.fullName),
  whatsapp: cleanText(contact.whatsapp),
  email: cleanText(contact.email),
  city: cleanText(contact.city)
});

export const getDefaultSource = () => {
  if (typeof window === 'undefined') {
    return {
      page: 'web-gemb',
      path: '',
      hash: '',
      referrer: '',
      utmSource: '',
      utmMedium: '',
      utmCampaign: ''
    };
  }

  const searchParams = new URLSearchParams(window.location.search);

  return {
    page: 'web-gemb',
    path: window.location.pathname,
    hash: window.location.hash,
    referrer: document.referrer || '',
    utmSource: searchParams.get('utm_source') || '',
    utmMedium: searchParams.get('utm_medium') || '',
    utmCampaign: searchParams.get('utm_campaign') || ''
  };
};

export const createTestLead = async ({ contact, consent, testType, source }) => {
  if (!TEST_TYPES.has(testType)) {
    throw new Error('Tipo de test no soportado.');
  }

  const user = await ensureAnonymousUser();
  const normalizedContact = normalizeContact(contact);

  const docRef = await addDoc(collection(ensureDb(), TEST_RESPONSES_COLLECTION), {
    testType,
    testVersion: TEST_VERSION,
    createdByUid: user.uid,
    contact: normalizedContact,
    consent: {
      privacyAccepted: Boolean(consent?.privacyAccepted),
      sensitiveDataAccepted: Boolean(consent?.sensitiveDataAccepted),
      acceptedAt: serverTimestamp(),
      consentTextVersion: CONSENT_TEXT_VERSION
    },
    answers: [],
    result: {},
    source: {
      ...getDefaultSource(),
      ...(source || {})
    },
    followUp: {
      status: 'in_progress',
      contacted: false,
      notes: ''
    },
    createdAt: serverTimestamp(),
    completedAt: null
  });

  return docRef.id;
};

export const completeTestResponse = async (responseId, { answers, result }) => {
  if (!responseId) {
    throw new Error('No se encontro el registro del test.');
  }

  await ensureAnonymousUser();

  await updateDoc(doc(ensureDb(), TEST_RESPONSES_COLLECTION, responseId), {
    answers: Array.isArray(answers) ? answers : [],
    result: result || {},
    completedAt: serverTimestamp(),
    'followUp.status': 'new'
  });
};

export const listTestResponses = async () => {
  const responsesQuery = query(
    collection(ensureDb(), TEST_RESPONSES_COLLECTION),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(responsesQuery);

  return snapshot.docs.map((responseDoc) => ({
    id: responseDoc.id,
    ...responseDoc.data()
  }));
};

export const updateTestResponseStatus = async (
  responseId,
  { status, notes, contacted }
) => {
  if (!responseId) {
    throw new Error('No se encontro el registro del test.');
  }

  const payload = {};

  if (status !== undefined) payload['followUp.status'] = status;
  if (notes !== undefined) payload['followUp.notes'] = notes;
  if (contacted !== undefined) payload['followUp.contacted'] = Boolean(contacted);

  await updateDoc(doc(ensureDb(), TEST_RESPONSES_COLLECTION, responseId), payload);
};
