import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
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

const ENNEA_TYPE_NAMES = {
  1: 'El Perfeccionista',
  2: 'El Ayudador',
  3: 'El Triunfador',
  4: 'El Individualista',
  5: 'El Investigador',
  6: 'El Leal',
  7: 'El Entusiasta',
  8: 'El Líder',
  9: 'El Conciliador'
};

const getEneagramType = (response) => {
  const result = response.result || {};
  const type = result.dominantType ?? result.suggestedType ?? null;
  if (!type) return null;

  return {
    type,
    name: ENNEA_TYPE_NAMES[type] || result.suggestedLabel || '',
    center: result.dominantCenter?.label || ''
  };
};

const getAnswerStats = (response) => {
  const answers = Array.isArray(response.answers) ? response.answers : [];
  const counts = {};

  answers.forEach((item) => {
    const label = item.label || '—';
    counts[label] = (counts[label] || 0) + 1;
  });

  return { total: answers.length, counts };
};

const getAnswerChipClass = (label) => {
  const value = String(label || '').toLowerCase();
  if (value === 'mucho') return 'bg-[#2E4036] text-white';
  if (value === 'poco') return 'bg-[#F0E4C8] text-[#8A6D1F]';
  if (value === 'nada') return 'bg-gray-100 text-gray-500';
  if (value === 'si' || value === 'sí') return 'bg-[#CC5833] text-white';
  if (value === 'no') return 'bg-[#2E4036]/10 text-[#2E4036]';
  return 'bg-gray-100 text-gray-600';
};

const isResponseCompleted = (response) => {
  if (response.completedAt) return true;
  const main = getMainResult(response);
  return main !== 'Sin completar' && main !== 'Sin resultado';
};

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

const StatTile = ({ label, value, tone = 'default' }) => {
  const toneClass =
    tone === 'alert'
      ? 'border-[#CC5833]/25 bg-[#FFF3EE]'
      : tone === 'good'
        ? 'border-[#2E4036]/15 bg-[#F4F7F5]'
        : 'border-[#2E4036]/10 bg-white';

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="font-heading text-3xl text-[#1A1A1A]">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
};

const AnalyticsPanel = ({ analytics }) => {
  if (!analytics || !analytics.total) return null;

  return (
    <section className="mb-5 rounded-[2rem] border border-[#2E4036]/10 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <BarChart3 size={18} className="text-[#CC5833]" />
        <h2 className="font-heading text-xl text-[#1A1A1A]">Análisis</h2>
        <span className="text-xs text-gray-500">· {analytics.total} registros en la vista actual</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Registros" value={analytics.total} />
        <StatTile label="Completados" value={analytics.completed} tone="good" />
        <StatTile label="Alertas" value={analytics.alerts} tone={analytics.alerts ? 'alert' : 'default'} />
        <StatTile label="Contactados" value={analytics.contacted} />
      </div>

      {analytics.eneatypeTotal > 0 && (
        <div className="mt-5">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-[#2E4036]">
            Distribución de eneatipos ({analytics.eneatypeTotal})
          </p>
          <div className="space-y-2">
            {analytics.eneatypes.map((entry) => {
              const pct = analytics.eneatypeTotal ? (entry.count / analytics.eneatypeTotal) * 100 : 0;

              return (
                <div key={entry.type} className="grid grid-cols-[140px_1fr_36px] items-center gap-3">
                  <span className="truncate text-sm text-[#1A1A1A]">
                    <span className="font-heading">{entry.type}</span> · {ENNEA_TYPE_NAMES[entry.type]}
                  </span>
                  <div className="h-3 overflow-hidden rounded-full bg-[#F1EFE8]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#CC5833] to-[#2E4036]"
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    ></div>
                  </div>
                  <span className="text-right text-xs text-gray-500">{entry.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {Object.entries(analytics.byStatus).map(([status, count]) => (
          <span
            key={status}
            className="rounded-full border border-[#2E4036]/10 bg-[#F7F4ED] px-3 py-1.5 text-xs text-[#2E4036]"
          >
            {STATUS_LABELS[status] || status}: <strong>{count}</strong>
          </span>
        ))}
      </div>
    </section>
  );
};

const EneatypeAffinityBars = ({ affinityTable, dominantType }) => (
  <div className="space-y-2">
    {affinityTable.map((entry) => {
      const isDominant = Number(entry.type) === Number(dominantType);

      return (
        <div key={entry.type} className="grid grid-cols-[120px_1fr_44px] items-center gap-2">
          <span className="truncate text-xs text-[#1A1A1A]">
            <span className="font-heading text-sm">{entry.type}</span> {ENNEA_TYPE_NAMES[entry.type]}
          </span>
          <div className="h-3 overflow-hidden rounded-full border border-[#E8E2D8] bg-[#F1EFE8]">
            <div
              className={`h-full rounded-full ${
                isDominant
                  ? 'bg-gradient-to-r from-[#E86137] to-[#B64624]'
                  : 'bg-gradient-to-r from-[#2E4036] to-[#708979]'
              }`}
              style={{ width: `${Math.max(entry.affinity, 2)}%` }}
            ></div>
          </div>
          <span className="text-right text-xs text-gray-600">{Number(entry.affinity).toFixed(0)}%</span>
        </div>
      );
    })}
  </div>
);

const ResultDetail = ({ response }) => {
  const result = response.result || {};

  if (response.testType === 'initial-assessment') {
    if (result.yesCount === undefined) {
      return <p className="text-sm text-gray-500">Este test aún no fue completado.</p>;
    }

    const yes = result.yesCount ?? 0;
    const total = result.totalQuestions ?? (response.answers?.length || 0);
    const no = result.noCount ?? Math.max(total - yes, 0);
    const alert = Boolean(result.isAlert);

    return (
      <div className="space-y-4">
        <div className={`rounded-2xl border p-4 ${alert ? 'border-[#CC5833]/25 bg-[#FFF3EE]' : 'border-[#2E4036]/15 bg-[#F4F7F5]'}`}>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#2E4036]">Respuestas afirmativas</p>
              <p className="font-heading text-4xl text-[#1A1A1A]">
                {yes} <span className="text-lg text-gray-400">/ {total}</span>
              </p>
            </div>
            <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${alert ? 'bg-[#CC5833] text-white' : 'bg-[#2E4036] text-white'}`}>
              {alert ? 'Alerta' : 'Sin alerta'}
            </span>
          </div>
          <p className="mt-2 text-sm text-[#1A1A1A]/70">
            {alert
              ? 'Cuatro o más respuestas afirmativas: se sugiere acompañamiento cercano.'
              : 'Menos de cuatro respuestas afirmativas.'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#FFF3EE] p-3 text-center">
            <p className="font-heading text-2xl text-[#CC5833]">{yes}</p>
            <p className="text-xs text-gray-500">Sí</p>
          </div>
          <div className="rounded-2xl bg-[#F4F7F5] p-3 text-center">
            <p className="font-heading text-2xl text-[#2E4036]">{no}</p>
            <p className="text-xs text-gray-500">No</p>
          </div>
        </div>
      </div>
    );
  }

  const dominant = getEneagramType(response);
  if (!dominant) {
    return <p className="text-sm text-gray-500">Este test aún no fue completado.</p>;
  }

  const affinity = (Array.isArray(result.affinityTable) ? result.affinityTable : [])
    .filter((entry) => Number.isFinite(entry?.affinity))
    .slice()
    .sort((a, b) => b.affinity - a.affinity);
  const hasAffinity = affinity.length > 1;
  const dominantAffinity = affinity.find((entry) => Number(entry.type) === Number(dominant.type))?.affinity;
  const subtitle = result.dominantTypeSubtitle || result.subtitle || '';
  const triads = result.triads
    ? Object.values(result.triads).slice().sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    : [];
  const stats = getAnswerStats(response);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#2E4036]/12 bg-[#F4F7F5] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#2E4036]">
              {response.testType === 'enneagram-quick' ? 'Eneatipo sugerido' : 'Eneatipo dominante'}
            </p>
            <p className="font-heading text-2xl text-[#1A1A1A]">
              Eneatipo {dominant.type} · {dominant.name}
            </p>
            {subtitle && <p className="text-sm text-[#CC5833]">{subtitle}</p>}
          </div>
          {Number.isFinite(dominantAffinity) && (
            <div className="shrink-0 text-right">
              <p className="font-heading text-3xl text-[#1A1A1A]">{dominantAffinity.toFixed(0)}%</p>
              <p className="text-[11px] text-gray-500">Afinidad</p>
            </div>
          )}
        </div>
        {dominant.center && (
          <p className="mt-2 text-sm text-[#1A1A1A]/70">
            Centro dominante: <strong>{dominant.center}</strong>
          </p>
        )}
      </div>

      {(result.motivation || result.fear) && (
        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {result.motivation && (
            <div className="rounded-2xl border border-gray-100 p-3">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#2E4036]">Motivación</p>
              <p className="mt-1 text-[#1A1A1A]/80">{result.motivation}</p>
            </div>
          )}
          {result.fear && (
            <div className="rounded-2xl border border-gray-100 p-3">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#2E4036]">Miedo central</p>
              <p className="mt-1 text-[#1A1A1A]/80">{result.fear}</p>
            </div>
          )}
        </div>
      )}

      {hasAffinity && (
        <div className="rounded-2xl border border-gray-100 p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-[#2E4036]">Afinidad por eneatipo</p>
          <EneatypeAffinityBars affinityTable={affinity} dominantType={dominant.type} />
        </div>
      )}

      {triads.length > 0 && (
        <div className="rounded-2xl border border-gray-100 p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-[#2E4036]">Centros</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {triads.map((triad) => (
              <div key={triad.key} className="rounded-xl bg-[#F7F4ED] p-2">
                <p className="text-xs text-gray-500">{triad.label}</p>
                <p className="font-heading text-lg text-[#1A1A1A]">{Number(triad.score ?? 0).toFixed(0)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.total > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.counts).map(([label, count]) => (
            <span key={label} className={`rounded-full px-3 py-1 text-xs font-bold ${getAnswerChipClass(label)}`}>
              {label}: {count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const AnswerList = ({ response }) => {
  const answers = Array.isArray(response.answers) ? response.answers : [];
  const [filter, setFilter] = useState('all');

  if (!answers.length) {
    return <p className="text-sm text-gray-500">Sin respuestas guardadas.</p>;
  }

  const labels = [...new Set(answers.map((item) => item.label).filter(Boolean))];
  const visible = filter === 'all' ? answers : answers.filter((item) => item.label === filter);
  const isEneagram = response.testType !== 'initial-assessment';

  return (
    <div className="space-y-3">
      {labels.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-full px-3 py-1 text-xs font-bold ${filter === 'all' ? 'bg-[#2E4036] text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Todas ({answers.length})
          </button>
          {labels.map((label) => (
            <button
              key={label}
              onClick={() => setFilter(label)}
              className={`rounded-full px-3 py-1 text-xs font-bold ${filter === label ? 'bg-[#2E4036] text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {label} ({answers.filter((item) => item.label === label).length})
            </button>
          ))}
        </div>
      )}
      <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
        {visible.map((item, index) => (
          <div key={item.questionId || index} className="flex items-start gap-3 rounded-xl border border-gray-100 p-3">
            <span className="mt-0.5 shrink-0 font-mono text-[11px] text-gray-400">
              {item.order || item.questionId || index + 1}
            </span>
            <p className="flex-1 text-sm leading-snug text-[#1A1A1A]/80">{item.question}</p>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${getAnswerChipClass(item.label)}`}>
                {item.label || '—'}
              </span>
              {isEneagram && item.eneatype && (
                <span className="text-[10px] text-gray-400">Tipo {item.eneatype}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AdminPanel() {
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
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

  const analytics = useMemo(() => {
    const list = filteredResponses;
    const byStatus = {};
    const eneatypeCounts = {};
    let completed = 0;
    let alerts = 0;
    let contacted = 0;

    list.forEach((response) => {
      const status = normalizeStatus(response.followUp?.status);
      byStatus[status] = (byStatus[status] || 0) + 1;

      const done = isResponseCompleted(response);
      if (done) completed += 1;
      if (isAlertResponse(response)) alerts += 1;
      if (response.followUp?.contacted || status === 'contacted') contacted += 1;

      const enea = getEneagramType(response);
      if (enea && done) {
        eneatypeCounts[enea.type] = (eneatypeCounts[enea.type] || 0) + 1;
      }
    });

    const eneatypes = Object.entries(eneatypeCounts)
      .map(([type, count]) => ({ type: Number(type), count }))
      .sort((a, b) => b.count - a.count);
    const eneatypeTotal = eneatypes.reduce((sum, entry) => sum + entry.count, 0);

    return { total: list.length, completed, alerts, contacted, byStatus, eneatypes, eneatypeTotal };
  }, [filteredResponses]);

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
      setIsAuthorized(false);
      setResponses([]);

      if (!user || user.isAnonymous) {
        setAuthLoading(false);
        return;
      }

      setAuthUser(user);

      if (!isAllowedAdminUser(user)) {
        setAuthError(UNAUTHORIZED_ADMIN_MESSAGE);
        setAuthLoading(false);
        return;
      }

      setIsAuthorized(true);
      setAuthLoading(false);
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
          <p className="text-sm text-[#1A1A1A]/65 mb-2">{authUser.email || 'Sin email'}</p>
          <p className="font-mono text-xs text-[#2E4036] break-all mb-6">UID: {authUser.uid}</p>
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

        <AnalyticsPanel analytics={analytics} />

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
                  <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-[#2E4036]">
                    Resultado
                  </p>
                  <ResultDetail response={selectedResponse} />
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

                <details className="rounded-2xl border border-gray-200 p-4" open>
                  <summary className="cursor-pointer font-heading text-lg">
                    Respuestas ({selectedResponse.answers?.length || 0})
                  </summary>
                  <div className="mt-3">
                    <AnswerList key={selectedResponse.id} response={selectedResponse} />
                  </div>
                </details>

                <details className="rounded-2xl border border-gray-200 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-500">
                    Datos técnicos (JSON)
                  </summary>
                  <div className="mt-3 space-y-3">
                    <div>
                      <p className="mb-2 text-xs font-semibold text-gray-500">Resultado</p>
                      <JsonBlock value={selectedResponse.result} />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold text-gray-500">Respuestas</p>
                      <JsonBlock value={selectedResponse.answers} />
                    </div>
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
