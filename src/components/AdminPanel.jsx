import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Download,
  Loader2,
  LogOut,
  MessageCircle,
  RefreshCw,
  Save,
  ShieldCheck
} from 'lucide-react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  listTestResponses,
  updateTestResponseStatus
} from '../services/testResponsesService';

const TEST_TYPE_LABELS = {
  'initial-assessment': 'Valoracion inicial',
  'enneagram-quick': 'Eneagrama rapido',
  'enneagram-full': 'Eneagrama completo'
};

const STATUS_LABELS = {
  new: 'Nuevo',
  contacted: 'Contactado',
  scheduled: 'Agendado',
  in_process: 'En proceso',
  in_progress: 'En progreso',
  closed: 'Cerrado'
};

const FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'initial-assessment', label: 'Valoracion inicial' },
  { key: 'enneagram-quick', label: 'Eneagrama rapido' },
  { key: 'enneagram-full', label: 'Eneagrama completo' },
  { key: 'alerts', label: 'Alertas' },
  { key: 'new', label: 'Nuevos' },
  { key: 'contacted', label: 'Contactados' },
  { key: 'scheduled', label: 'Agendados' },
  { key: 'in_process', label: 'En proceso' },
  { key: 'closed', label: 'Cerrados' }
];

const ADMIN_EMAIL = 'fundacionsocial@gimnasioemocionalmb.com';
const UNAUTHORIZED_ADMIN_MESSAGE = 'Esta cuenta no está autorizada como administrador.';

const isAllowedAdminUser = (user) => {
  if (!user || user.isAnonymous) return false;

  return user.email?.toLowerCase() === ADMIN_EMAIL;
};

const toDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  if (typeof value.seconds === 'number') return new Date(value.seconds * 1000);
  return new Date(value);
};

const formatDate = (value) => {
  const date = toDate(value);
  if (!date || Number.isNaN(date.getTime())) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

const normalizeStatus = (status) => (status === 'in_progress' ? 'in_process' : status || 'new');

const getStatusLabel = (response) =>
  STATUS_LABELS[response.followUp?.status] ||
  STATUS_LABELS[normalizeStatus(response.followUp?.status)] ||
  'Nuevo';

const getMainResult = (response) => {
  const result = response.result || {};

  if (response.testType === 'initial-assessment') {
    if (result.yesCount === undefined) return 'Sin completar';
    return `${result.yesCount} si / ${result.totalQuestions || 0}`;
  }

  if (response.testType === 'enneagram-quick') {
    if (!result.suggestedType) return 'Sin completar';
    return `Eneatipo ${result.suggestedType} - ${result.suggestedLabel || ''}`;
  }

  if (response.testType === 'enneagram-full') {
    if (!result.dominantType) return 'Sin completar';
    return `Eneatipo ${result.dominantType} - ${result.dominantCenter?.label || ''}`;
  }

  return 'Sin resultado';
};

const isAlertResponse = (response) => Boolean(response.result?.isAlert);

const escapeCsv = (value) => {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
};

const getWhatsappUrl = (whatsapp) => {
  const digits = String(whatsapp || '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '';
};

const downloadCsv = (responses) => {
  const headers = [
    'fecha',
    'nombre',
    'whatsapp',
    'email',
    'ciudad',
    'tipo_test',
    'resultado_principal',
    'alerta',
    'estado',
    'notas'
  ];
  const rows = responses.map((response) => [
    formatDate(response.createdAt),
    response.contact?.fullName || '',
    response.contact?.whatsapp || '',
    response.contact?.email || '',
    response.contact?.city || '',
    TEST_TYPE_LABELS[response.testType] || response.testType || '',
    getMainResult(response),
    isAlertResponse(response) ? 'si' : 'no',
    getStatusLabel(response),
    response.followUp?.notes || ''
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `gemb-test-responses-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const JsonBlock = ({ value }) => (
  <pre className="max-h-72 overflow-auto rounded-2xl bg-[#1A1A1A] p-4 text-xs leading-relaxed text-[#F2F0E9]">
    {JSON.stringify(value || {}, null, 2)}
  </pre>
);

export default function AdminPanel() {
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [authFailureReason, setAuthFailureReason] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [responses, setResponses] = useState([]);
  const [responsesLoading, setResponsesLoading] = useState(false);
  const [responsesError, setResponsesError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState({
    status: 'new',
    contacted: false,
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const filteredResponses = useMemo(() => {
    return responses.filter((response) => {
      const status = normalizeStatus(response.followUp?.status);

      if (activeFilter === 'all') return true;
      if (activeFilter === 'alerts') return isAlertResponse(response);
      if (activeFilter === 'contacted') {
        return status === 'contacted' || response.followUp?.contacted === true;
      }
      if (['new', 'scheduled', 'in_process', 'closed'].includes(activeFilter)) {
        return status === activeFilter;
      }

      return response.testType === activeFilter;
    });
  }, [responses, activeFilter]);

  const selectedResponse = useMemo(
    () => filteredResponses.find((response) => response.id === selectedId) || filteredResponses[0] || null,
    [filteredResponses, selectedId]
  );

  useEffect(() => {
    if (!selectedResponse) return;

    setSelectedId(selectedResponse.id);
    setDraft({
      status: normalizeStatus(selectedResponse.followUp?.status),
      contacted: Boolean(selectedResponse.followUp?.contacted),
      notes: selectedResponse.followUp?.notes || ''
    });
  }, [selectedResponse]);

  const refreshResponses = async () => {
    setResponsesLoading(true);
    setResponsesError('');

    try {
      const items = await listTestResponses();
      setResponses(items);
      setSelectedId((currentId) =>
        items.some((item) => item.id === currentId) ? currentId : items[0]?.id || null
      );
    } catch (err) {
      setResponsesError(
        err?.message || 'No pudimos cargar las respuestas. Intenta de nuevo.'
      );
    } finally {
      setResponsesLoading(false);
    }
  };

  useEffect(() => {
    if (!auth || !db) {
      setAuthError('Firebase no esta configurado. Agrega las variables de entorno.');
      setAuthLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthLoading(true);
      setAuthUser(null);
      setAuthError('');
      setAuthFailureReason('');
      setIsAuthorized(false);
      setResponses([]);

      if (!user || user.isAnonymous) {
        setAuthLoading(false);
        return;
      }

      setAuthUser(user);

      if (!isAllowedAdminUser(user)) {
        setAuthError(UNAUTHORIZED_ADMIN_MESSAGE);
        setAuthFailureReason('email incorrecto');
        setAuthLoading(false);
        return;
      }

      try {
        const adminSnapshot = await getDoc(doc(db, 'adminUsers', user.uid));

        if (adminSnapshot.exists()) {
          setIsAuthorized(true);
        } else {
          setAuthError(UNAUTHORIZED_ADMIN_MESSAGE);
          setAuthFailureReason('documento admin no existe');
        }
      } catch (err) {
        setAuthError(err?.message || 'No pudimos validar el administrador.');
        setAuthFailureReason('error de permisos');
      } finally {
        setAuthLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      refreshResponses();
    }
  }, [isAuthorized]);

  const handleSignIn = async () => {
    setAuthError('');
    setAuthFailureReason('');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      if (auth.currentUser?.isAnonymous) {
        await signOut(auth);
      }

      await signInWithPopup(auth, provider);
    } catch (err) {
      setAuthError(err?.message || 'No pudimos iniciar sesion con Google.');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleSaveFollowUp = async () => {
    if (!selectedResponse) return;

    setIsSaving(true);
    setResponsesError('');

    try {
      await updateTestResponseStatus(selectedResponse.id, draft);
      setResponses((current) =>
        current.map((response) =>
          response.id === selectedResponse.id
            ? {
                ...response,
                followUp: {
                  ...(response.followUp || {}),
                  ...draft
                }
              }
            : response
        )
      );
    } catch (err) {
      setResponsesError(err?.message || 'No pudimos guardar las notas.');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[100dvh] bg-[#F2F0E9] flex items-center justify-center p-6 text-[#2E4036]">
        <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
          <Loader2 size={18} className="animate-spin" />
          <span className="font-mono text-sm">Validando acceso...</span>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-[100dvh] bg-[#F2F0E9] flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-[2.25rem] bg-white p-8 shadow-2xl border border-[#2E4036]/10">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2E4036] text-white">
            <ShieldCheck size={26} />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#CC5833] mb-2">
            Panel privado
          </p>
          <h1 className="font-heading text-3xl text-[#1A1A1A] mb-3">Admin GEMB</h1>
          <p className="text-sm leading-relaxed text-[#1A1A1A]/65 mb-6">
            Ingresa con Google. Solo las cuentas registradas en adminUsers pueden ver respuestas.
          </p>
          {authError && (
            <div className="mb-4 flex gap-3 rounded-2xl border border-[#CC5833]/25 bg-[#FFF3EE] p-4 text-sm text-[#7A3A25]">
              <AlertCircle size={18} className="shrink-0" />
              <p>{authError}</p>
            </div>
          )}
          <button
            onClick={handleSignIn}
            disabled={!auth}
            className="w-full rounded-full bg-[#CC5833] px-6 py-4 font-bold text-white btn-magnetic disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Iniciar sesion con Google
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-[100dvh] bg-[#F2F0E9] flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-[2.25rem] bg-white p-8 shadow-2xl border border-[#2E4036]/10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#CC5833] text-white">
            <AlertCircle size={26} />
          </div>
          <h1 className="font-heading text-3xl text-[#1A1A1A] mb-3">
            {UNAUTHORIZED_ADMIN_MESSAGE}
          </h1>
          <div className="mb-6 space-y-2 rounded-2xl bg-[#F7F4ED] p-4 text-sm">
            <p className="text-[#1A1A1A]/75">
              Email detectado: <span className="font-semibold">{authUser.email || 'Sin email'}</span>
            </p>
            <p className="font-mono text-xs text-[#2E4036] break-all">
              UID detectado: {authUser.uid}
            </p>
            <p className="text-[#7A3A25]">
              Raz&oacute;n del fallo: {authFailureReason || 'validacion no autorizada'}
            </p>
          </div>
          {authError && authError !== UNAUTHORIZED_ADMIN_MESSAGE && (
            <p className="text-sm text-[#7A3A25] mb-6">{authError}</p>
          )}
          <button
            onClick={handleSignOut}
            className="rounded-full border border-[#2E4036]/20 px-5 py-3 font-bold text-[#2E4036] hover:bg-[#F2F0E9]"
          >
            Salir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#F2F0E9] text-[#1A1A1A]">
      <header className="border-b border-[#2E4036]/10 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#CC5833]">
              Panel privado
            </p>
            <h1 className="font-heading text-3xl font-bold text-[#1A1A1A]">Resultados de tests</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#2E4036]/10 px-4 py-2 text-xs font-semibold text-[#2E4036]">
              {authUser.email}
            </span>
            <button
              onClick={refreshResponses}
              className="inline-flex items-center gap-2 rounded-full border border-[#2E4036]/15 px-4 py-2 text-sm font-bold text-[#2E4036] hover:bg-white"
            >
              <RefreshCw size={15} />
              Actualizar
            </button>
            <button
              onClick={() => downloadCsv(filteredResponses)}
              className="inline-flex items-center gap-2 rounded-full bg-[#2E4036] px-4 py-2 text-sm font-bold text-white"
            >
              <Download size={15} />
              Exportar CSV
            </button>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-[#CC5833]/25 px-4 py-2 text-sm font-bold text-[#CC5833] hover:bg-white"
            >
              <LogOut size={15} />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-5 flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                activeFilter === filter.key
                  ? 'bg-[#CC5833] text-white'
                  : 'bg-white text-[#2E4036] border border-[#2E4036]/10 hover:border-[#CC5833]/40'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {responsesError && (
          <div className="mb-5 flex gap-3 rounded-2xl border border-[#CC5833]/25 bg-[#FFF3EE] p-4 text-sm text-[#7A3A25]">
            <AlertCircle size={18} className="shrink-0" />
            <p>{responsesError}</p>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.95fr]">
          <section className="overflow-hidden rounded-[2rem] border border-[#2E4036]/10 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
              <div>
                <p className="font-heading text-xl text-[#1A1A1A]">Respuestas</p>
                <p className="text-xs text-gray-500">{filteredResponses.length} registros filtrados</p>
              </div>
              {responsesLoading && <Loader2 size={18} className="animate-spin text-[#2E4036]" />}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="bg-[#F7F4ED] text-xs uppercase tracking-[0.12em] text-[#2E4036]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Fecha</th>
                    <th className="px-4 py-3 font-semibold">Nombre</th>
                    <th className="px-4 py-3 font-semibold">WhatsApp</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Ciudad</th>
                    <th className="px-4 py-3 font-semibold">Tipo</th>
                    <th className="px-4 py-3 font-semibold">Resultado</th>
                    <th className="px-4 py-3 font-semibold">Alerta</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResponses.map((response) => {
                    const selected = selectedResponse?.id === response.id;

                    return (
                      <tr
                        key={response.id}
                        onClick={() => setSelectedId(response.id)}
                        className={`cursor-pointer border-t border-gray-100 transition hover:bg-[#F7F4ED] ${
                          selected ? 'bg-[#FFF3EE]' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-gray-600">{formatDate(response.createdAt)}</td>
                        <td className="px-4 py-3 font-semibold">{response.contact?.fullName || '-'}</td>
                        <td className="px-4 py-3">{response.contact?.whatsapp || '-'}</td>
                        <td className="px-4 py-3">{response.contact?.email || '-'}</td>
                        <td className="px-4 py-3">{response.contact?.city || '-'}</td>
                        <td className="px-4 py-3">{TEST_TYPE_LABELS[response.testType] || response.testType}</td>
                        <td className="px-4 py-3">{getMainResult(response)}</td>
                        <td className="px-4 py-3">{isAlertResponse(response) ? 'Si' : 'No'}</td>
                        <td className="px-4 py-3">{getStatusLabel(response)}</td>
                      </tr>
                    );
                  })}
                  {!filteredResponses.length && (
                    <tr>
                      <td colSpan="9" className="px-4 py-10 text-center text-sm text-gray-500">
                        No hay registros para este filtro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-[#2E4036]/10 bg-white p-5 shadow-sm">
            {selectedResponse ? (
              <div className="space-y-5">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#CC5833]">
                    Detalle
                  </p>
                  <h2 className="font-heading text-2xl text-[#1A1A1A]">
                    {selectedResponse.contact?.fullName || 'Sin nombre'}
                  </h2>
                  <p className="text-sm text-gray-500">{formatDate(selectedResponse.createdAt)}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-[#F7F4ED] p-3">
                    <p className="text-xs text-gray-500">WhatsApp</p>
                    <p className="font-semibold">{selectedResponse.contact?.whatsapp || '-'}</p>
                  </div>
                  <div className="rounded-2xl bg-[#F7F4ED] p-3">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-semibold break-all">{selectedResponse.contact?.email || '-'}</p>
                  </div>
                  <div className="rounded-2xl bg-[#F7F4ED] p-3">
                    <p className="text-xs text-gray-500">Ciudad</p>
                    <p className="font-semibold">{selectedResponse.contact?.city || '-'}</p>
                  </div>
                  <div className="rounded-2xl bg-[#F7F4ED] p-3">
                    <p className="text-xs text-gray-500">Tipo</p>
                    <p className="font-semibold">{TEST_TYPE_LABELS[selectedResponse.testType]}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#2E4036]/10 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#2E4036] mb-2">
                    Resultado principal
                  </p>
                  <p className="font-heading text-xl">{getMainResult(selectedResponse)}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Alerta: {isAlertResponse(selectedResponse) ? 'Si' : 'No'}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[#2E4036]">
                    Estado de seguimiento
                    <select
                      value={draft.status}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, status: event.target.value }))
                      }
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#1A1A1A] outline-none focus:border-[#CC5833] focus:ring-4 focus:ring-[#CC5833]/10"
                    >
                      <option value="new">new</option>
                      <option value="contacted">contacted</option>
                      <option value="scheduled">scheduled</option>
                      <option value="in_process">in_process</option>
                      <option value="closed">closed</option>
                    </select>
                  </label>

                  <label className="flex items-center gap-3 text-sm text-[#1A1A1A]/75">
                    <input
                      type="checkbox"
                      checked={draft.contacted}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, contacted: event.target.checked }))
                      }
                      className="h-4 w-4 accent-[#CC5833]"
                    />
                    Marcado como contactado
                  </label>

                  <label className="block text-sm font-semibold text-[#2E4036]">
                    Notas internas
                    <textarea
                      value={draft.notes}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, notes: event.target.value }))
                      }
                      rows={5}
                      className="mt-2 w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#1A1A1A] outline-none focus:border-[#CC5833] focus:ring-4 focus:ring-[#CC5833]/10"
                      placeholder="Notas de seguimiento..."
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={getWhatsappUrl(selectedResponse.contact?.whatsapp) || undefined}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-bold ${
                      getWhatsappUrl(selectedResponse.contact?.whatsapp)
                        ? 'bg-[#25D366] text-white'
                        : 'pointer-events-none bg-gray-200 text-gray-400'
                    }`}
                  >
                    <MessageCircle size={17} />
                    Abrir WhatsApp
                  </a>
                  <button
                    onClick={handleSaveFollowUp}
                    disabled={isSaving}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#2E4036] px-5 py-3 font-bold text-white disabled:opacity-60"
                  >
                    {isSaving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                    Guardar notas
                  </button>
                </div>

                <details className="rounded-2xl border border-gray-200 p-4">
                  <summary className="cursor-pointer font-heading text-lg">Respuestas</summary>
                  <div className="mt-3">
                    <JsonBlock value={selectedResponse.answers} />
                  </div>
                </details>

                <details className="rounded-2xl border border-gray-200 p-4">
                  <summary className="cursor-pointer font-heading text-lg">Resultado completo</summary>
                  <div className="mt-3">
                    <JsonBlock value={selectedResponse.result} />
                  </div>
                </details>
              </div>
            ) : (
              <div className="py-16 text-center text-sm text-gray-500">
                Selecciona una respuesta para ver el detalle.
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
