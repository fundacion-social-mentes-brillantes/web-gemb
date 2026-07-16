import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Heart, Wallet, HeartPulse, Lock, LogOut, ArrowLeft, ArrowRight, ShieldCheck,
  Sparkles, CheckCircle2, Circle, Loader2, Users, Home, Volume2, PlayCircle,
  PenLine, Quote, ChevronRight, AlertCircle, Check
} from 'lucide-react';
import {
  GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import {
  PROCESS_KITS, PROCESS_KITS_BY_ID, KIT_ORDER, resolveText, getLessonCountForKit
} from '../processContentConfig';
import {
  getMyMember, createMyMember, getMyProgress, setLessonCompleted, saveToolResult,
  getMyJournal, saveJournalEntry, listMembers, setMemberStatus, setMemberKit, setMemberRole
} from '../services/processMembersService';
import BeliefScanner from './BeliefScanner';
import DesignedSlides from './DesignedSlides';
import { SCANNER_TOOL_ID } from '../beliefScannerConfig';

const ADMIN_EMAIL = 'fundacionsocial@gimnasioemocionalmb.com';
const CONTACT_ADMINS = 'Sebastián o Valeria';

// Normaliza el resultado de una herramienta para guardar en Firestore.
// Incluye el resumen (para que la coach lo vea) y completedAt solo al terminar.
const cleanToolResult = (result, completed) => ({
  ratings: result.ratings || {},
  total10: result.total10 || 0,
  totalHigh: result.totalHigh || 0,
  answered: result.answered || 0,
  sumScores: result.sumScores || 0,
  highBeliefs: (result.highBeliefs || []).map((b) => ({ id: b.id, score: b.score, text: b.text })),
  ...(completed ? { completedAt: new Date().toISOString() } : {})
});

const KIT_ICONS = { heart: Heart, wallet: Wallet, heartPulse: HeartPulse };

const PORTAL_STYLES = `
  .pp-fade { animation: pp-fade 0.4s cubic-bezier(0.22,1,0.36,1) both; }
  @keyframes pp-fade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  .pp-slide { animation: pp-slide 0.35s cubic-bezier(0.22,1,0.36,1) both; }
  @keyframes pp-slide { from { opacity: 0; transform: translateY(16px) scale(0.995); } to { opacity: 1; transform: none; } }

  /* Ambiente dorado en movimiento */
  @keyframes pp-drift-a { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(50px,-35px) scale(1.1); } }
  @keyframes pp-drift-b { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-60px,30px) scale(1.06); } }
  .pp-glow-a { animation: pp-drift-a 18s ease-in-out infinite; }
  .pp-glow-b { animation: pp-drift-b 24s ease-in-out infinite; }

  @keyframes pp-twinkle { 0%,100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.85; transform: scale(1.3); } }
  .pp-star {
    position: absolute; border-radius: 9999px; background: #E4C878;
    box-shadow: 0 0 8px rgba(228,200,120,0.8);
    animation: pp-twinkle var(--dur, 5s) ease-in-out infinite;
    animation-delay: var(--del, 0s);
  }

  @keyframes pp-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
  .pp-rise { animation: pp-rise 0.75s cubic-bezier(0.22,1,0.36,1) both; animation-delay: var(--d, 0s); }

  @keyframes pp-aurora { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
  .pp-aurora {
    background: linear-gradient(120deg, #191410, #2a1d0c, #12150f, #221809, #191410);
    background-size: 300% 300%;
    animation: pp-aurora 16s ease infinite;
  }

  .pp-shine { position: absolute; inset: 0; overflow: hidden; border-radius: inherit; pointer-events: none; }
  .pp-shine::after {
    content: ''; position: absolute; top: -10%; bottom: -10%; width: 34%;
    background: linear-gradient(105deg, transparent, rgba(255,244,214,0.22), transparent);
    transform: translateX(-160%) skewX(-18deg);
  }
  .group:hover .pp-shine::after { animation: pp-shine-sweep 0.9s ease; }
  @keyframes pp-shine-sweep { to { transform: translateX(340%) skewX(-18deg); } }

  @keyframes pp-breathe { 0%,100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.12); } }
  .pp-breathe { animation: pp-breathe 3.2s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .pp-fade, .pp-slide, .pp-rise { animation-duration: 0.01s !important; animation-delay: 0s !important; }
    .pp-glow-a, .pp-glow-b, .pp-star, .pp-aurora, .pp-breathe { animation: none !important; }
    .group:hover .pp-shine::after { animation: none !important; }
  }
`;

/* Posiciones fijas de las "estrellas" doradas del fondo (determinista). */
const PP_STARS = [
  { top: '8%', left: '12%', s: 3, del: '0s', dur: '5s' },
  { top: '16%', left: '78%', s: 2, del: '1.2s', dur: '6s' },
  { top: '24%', left: '38%', s: 2, del: '2.4s', dur: '7s' },
  { top: '32%', left: '90%', s: 3, del: '0.6s', dur: '5.5s' },
  { top: '41%', left: '6%', s: 2, del: '3s', dur: '6.5s' },
  { top: '52%', left: '68%', s: 3, del: '1.8s', dur: '5s' },
  { top: '60%', left: '22%', s: 2, del: '0.9s', dur: '7.5s' },
  { top: '68%', left: '84%', s: 2, del: '2.1s', dur: '6s' },
  { top: '75%', left: '46%', s: 3, del: '3.6s', dur: '5.5s' },
  { top: '84%', left: '10%', s: 2, del: '1.5s', dur: '6.8s' },
  { top: '88%', left: '70%', s: 2, del: '0.3s', dur: '5.2s' },
  { top: '12%', left: '55%', s: 2, del: '4.2s', dur: '7s' }
];

/* ── Piezas de UI ──────────────────────────────────────────────── */

const Shell = ({ children, dark = false }) => {
  if (!dark) {
    return <div className="min-h-[100dvh] bg-[#F2F0E9] text-[#1A1A1A]">{children}</div>;
  }

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-[#0D0B07] text-[#F3ECDD]">
      {/* Ambiente: brillos dorados que se mueven lento + estrellas que titilan */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="pp-glow-a absolute -left-40 top-[-10%] h-[34rem] w-[34rem] rounded-full bg-[#E4C878]/[0.09] blur-3xl"></div>
        <div className="pp-glow-b absolute -right-48 top-[38%] h-[30rem] w-[30rem] rounded-full bg-[#B8860B]/[0.10] blur-3xl"></div>
        <div className="pp-glow-a absolute bottom-[-14%] left-[28%] h-[26rem] w-[26rem] rounded-full bg-[#2E4036]/[0.22] blur-3xl"></div>
        {PP_STARS.map((star, i) => (
          <span
            key={i}
            className="pp-star"
            style={{ top: star.top, left: star.left, width: star.s, height: star.s, '--del': star.del, '--dur': star.dur }}
          ></span>
        ))}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
};

const CenteredCard = ({ children }) => (
  <div className="flex min-h-[100dvh] items-center justify-center p-5">
    <div className="pp-fade w-full max-w-md rounded-[2.25rem] border border-[#E4C878]/25 bg-white p-8 shadow-[0_0_60px_-12px_rgba(228,200,120,0.25),0_28px_70px_-40px_rgba(0,0,0,0.9)]">
      {children}
    </div>
  </div>
);

const PortalHeader = ({ member, isAdmin, view, onGoHome, onGoAdmin, onSignOut }) => (
  <header className="sticky top-0 z-30 border-b border-[#E4C878]/15 bg-[#0D0B07]/85 backdrop-blur-md">
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3.5">
      <button onClick={onGoHome} className="flex items-center gap-2.5">
        <img src="/logo-gemb.png" alt="GEMB" className="h-9 w-auto object-contain drop-shadow-[0_0_10px_rgba(228,200,120,0.35)]" />
        <span className="hidden font-heading text-sm font-bold text-[#E4C878] sm:block">Mi Proceso</span>
      </button>
      <div className="flex items-center gap-2">
        {isAdmin && (
          <>
            <button
              onClick={onGoHome}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition ${view !== 'admin' ? 'bg-[#E4C878] text-[#14110A]' : 'text-[#E4C878]/80 hover:bg-[#E4C878]/10'}`}
            >
              <Home size={14} /> Proceso
            </button>
            <button
              onClick={onGoAdmin}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition ${view === 'admin' ? 'bg-[#CC5833] text-white' : 'text-[#E4C878]/80 hover:bg-[#E4C878]/10'}`}
            >
              <Users size={14} /> Administración
            </button>
          </>
        )}
        <span className="hidden max-w-[160px] truncate rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-[#F3ECDD]/80 md:block">
          {member?.fullName || member?.email || 'Mi cuenta'}
        </span>
        <button onClick={onSignOut} className="inline-flex items-center gap-1.5 rounded-full border border-[#E4C878]/30 px-3 py-2 text-xs font-bold text-[#E4C878] transition hover:bg-[#E4C878]/10">
          <LogOut size={14} /> Salir
        </button>
      </div>
    </div>
  </header>
);

/* ── Formulario de perfil ──────────────────────────────────────── */

const ProfileForm = ({ defaultName, onSubmit, isSaving, error }) => {
  const [fullName, setFullName] = useState(defaultName || '');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [consent, setConsent] = useState({ privacyAccepted: false, sensitiveDataAccepted: false });
  const [localError, setLocalError] = useState('');

  const canSubmit = fullName.trim().length > 1 && phone.replace(/\D/g, '').length >= 8 &&
    gender && consent.privacyAccepted && consent.sensitiveDataAccepted && !isSaving;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) {
      setLocalError('Completa tu nombre, teléfono, género y las autorizaciones.');
      return;
    }
    setLocalError('');
    onSubmit({ fullName: fullName.trim(), phone: phone.trim(), gender, consent });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2E4036] text-white">
          <Sparkles size={22} />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#CC5833]">Tu espacio personal</p>
        <h1 className="font-heading text-2xl text-[#1A1A1A]">Completa tus datos</h1>
        <p className="mt-2 text-sm text-[#1A1A1A]/65">Esto hace que tu proceso sea tuyo y personalizado.</p>
      </div>

      <label className="block text-sm font-semibold text-[#2E4036]">
        Nombre completo
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#1A1A1A] outline-none focus:border-[#CC5833] focus:ring-4 focus:ring-[#CC5833]/10" placeholder="Tu nombre" />
      </label>

      <label className="block text-sm font-semibold text-[#2E4036]">
        Teléfono / WhatsApp
        <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#1A1A1A] outline-none focus:border-[#CC5833] focus:ring-4 focus:ring-[#CC5833]/10" placeholder="+57 300 000 0000" />
      </label>

      <div className="text-sm font-semibold text-[#2E4036]">
        <span id="genero-label">Género</span>
        <div role="radiogroup" aria-labelledby="genero-label" className="mt-2 grid grid-cols-2 gap-3">
          {[['masculino', 'Masculino'], ['femenino', 'Femenino']].map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={gender === value}
              onClick={() => setGender(value)}
              className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${gender === value ? 'border-[#CC5833] bg-[#CC5833] text-white' : 'border-gray-200 bg-white text-[#2E4036] hover:border-[#CC5833]/50'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs font-normal text-gray-500">Con esto te mostramos la versión de tu kit que corresponde.</p>
      </div>

      <div className="space-y-2.5 rounded-2xl border border-[#2E4036]/10 bg-[#F7F4ED] p-4 text-sm text-[#1A1A1A]/75">
        <label className="flex items-start gap-3">
          <input type="checkbox" checked={consent.privacyAccepted} onChange={(e) => setConsent((c) => ({ ...c, privacyAccepted: e.target.checked }))} className="mt-1 h-4 w-4 accent-[#CC5833]" />
          <span>
            Acepto la{' '}
            <a href="/politica-de-privacidad" target="_blank" rel="noopener noreferrer" className="underline decoration-[#CC5833]/40 underline-offset-2 hover:text-[#CC5833]">
              política de tratamiento de datos personales
            </a>
            .
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input type="checkbox" checked={consent.sensitiveDataAccepted} onChange={(e) => setConsent((c) => ({ ...c, sensitiveDataAccepted: e.target.checked }))} className="mt-1 h-4 w-4 accent-[#CC5833]" />
          <span>Autorizo el tratamiento de mi información dentro de mi proceso, de forma confidencial.</span>
        </label>
      </div>

      {(localError || error) && (
        <div className="flex items-start gap-2 rounded-2xl border border-[#CC5833]/25 bg-[#FFF3EE] px-4 py-3 text-sm text-[#7A3A25]">
          <AlertCircle size={16} className="mt-0.5 shrink-0" /> <p>{localError || error}</p>
        </div>
      )}

      <button type="submit" disabled={!canSubmit} className={`w-full rounded-full px-6 py-4 font-bold transition ${canSubmit ? 'bg-[#CC5833] text-white btn-magnetic' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}>
        {isSaving ? <Loader2 size={18} className="mx-auto animate-spin" /> : 'Entrar a mi proceso'}
      </button>
      {!canSubmit && !isSaving && (
        <p className="text-center text-xs text-gray-500">
          Para continuar: nombre, teléfono (mín. 8 dígitos), género y las dos autorizaciones.
        </p>
      )}
    </form>
  );
};

/* ── Bloques de lección ────────────────────────────────────────── */

const LessonBlock = ({ block, gender, journalDraft, onJournalChange, onJournalBlur, onJournalToggle }) => {
  const title = resolveText(block.title, gender);
  const text = resolveText(block.text, gender);

  switch (block.type) {
    case 'portada':
      return (
        <div className="rounded-[2rem] bg-gradient-to-br from-[#2E4036] to-[#1A1A1A] p-10 text-center text-white">
          <Sparkles size={30} className="mx-auto mb-4 text-[#E2C17D]" />
          <h2 className="font-heading text-3xl">{title}</h2>
          {block.subtitle && <p className="mt-3 text-sm text-white/70">{block.subtitle}</p>}
        </div>
      );
    case 'texto':
      return (
        <div>
          {title && <h2 className="mb-3 font-heading text-2xl text-[#2E4036]">{title}</h2>}
          <p className="text-lg leading-relaxed text-[#1A1A1A]/80">{text}</p>
        </div>
      );
    case 'cita':
      return (
        <blockquote className="border-l-4 border-[#E2C17D] pl-6">
          <Quote size={32} className="mb-3 text-[#E2C17D]" />
          <p className="font-serif text-2xl italic leading-snug text-[#2E4036]">{text}</p>
          {block.author && <footer className="mt-3 text-sm font-semibold text-[#CC5833]">— {block.author}</footer>}
        </blockquote>
      );
    case 'lista':
      return (
        <div>
          {title && <h2 className="mb-4 font-heading text-2xl text-[#2E4036]">{title}</h2>}
          <ul className="space-y-3">
            {(block.items || []).map((item) => (
              <li key={item} className="flex items-start gap-3 text-lg text-[#1A1A1A]/80">
                <ChevronRight size={20} className="mt-1 shrink-0 text-[#CC5833]" /> {resolveText(item, gender)}
              </li>
            ))}
          </ul>
        </div>
      );
    case 'imagen':
      return block.src ? (
        <figure>
          <img src={block.src} alt={block.alt || ''} className="w-full rounded-[1.5rem] object-cover" />
          {block.caption && <figcaption className="mt-2 text-center text-sm text-gray-500">{block.caption}</figcaption>}
        </figure>
      ) : (
        <div className="flex h-48 items-center justify-center rounded-[1.5rem] border border-dashed border-[#2E4036]/20 bg-[#F7F4ED] text-sm text-gray-400">
          Imagen próximamente
        </div>
      );
    case 'audio':
      return (
        <div className="rounded-[1.5rem] border border-[#2E4036]/10 bg-white p-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2E4036]/10 text-[#2E4036]"><Volume2 size={20} /></div>
            <p className="font-heading text-lg text-[#2E4036]">{title || 'Audio'}</p>
          </div>
          {block.src ? <audio controls src={block.src} className="w-full" /> : <p className="text-sm text-gray-400">Audio próximamente.</p>}
        </div>
      );
    case 'video':
      return (
        <div className="rounded-[1.5rem] border border-[#2E4036]/10 bg-white p-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#CC5833]/10 text-[#CC5833]"><PlayCircle size={20} /></div>
            <p className="font-heading text-lg text-[#2E4036]">{title || 'Video'}</p>
          </div>
          {block.url ? (
            <div className="relative w-full overflow-hidden rounded-2xl" style={{ paddingTop: '56.25%' }}>
              <iframe title={title || 'Video'} src={block.url} className="absolute inset-0 h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          ) : <p className="text-sm text-gray-400">Video próximamente.</p>}
        </div>
      );
    case 'escritura':
      return (
        <div className="rounded-[1.5rem] border border-[#2E4036]/10 bg-white p-6">
          <div className="mb-3 flex items-center gap-2 text-[#2E4036]">
            <PenLine size={18} /> <p className="font-heading text-lg">Tu espacio para escribir</p>
          </div>
          <p className="mb-3 text-[#1A1A1A]/75">{resolveText(block.prompt, gender)}</p>
          <textarea
            value={journalDraft[block.id] || ''}
            onChange={(e) => onJournalChange(block.id, e.target.value)}
            onBlur={() => onJournalBlur(block.id)}
            rows={5}
            placeholder={block.placeholder || 'Escribe aquí…'}
            className="w-full resize-y rounded-2xl border border-gray-200 bg-[#FCFCFA] px-4 py-3 text-[#1A1A1A] outline-none focus:border-[#CC5833] focus:ring-4 focus:ring-[#CC5833]/10"
          />
          <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400"><Lock size={11} /> Privado: solo tú puedes ver lo que escribes aquí.</p>
        </div>
      );
    case 'checklist': {
      const checked = Array.isArray(journalDraft[block.id]) ? journalDraft[block.id] : [];
      return (
        <div className="rounded-[1.5rem] border border-[#2E4036]/10 bg-white p-6">
          {title && <p className="mb-4 font-heading text-lg text-[#2E4036]">{title}</p>}
          <div className="space-y-2.5">
            {(block.items || []).map((item) => {
              const isOn = checked.includes(item);
              return (
                <button key={item} type="button" aria-pressed={isOn} onClick={() => onJournalToggle(block.id, item)} className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 p-3 text-left transition hover:border-[#2E4036]/30">
                  {isOn ? <CheckCircle2 size={20} className="shrink-0 text-[#2E4036]" /> : <Circle size={20} className="shrink-0 text-gray-300" />}
                  <span className={`text-[#1A1A1A]/80 ${isOn ? 'line-through opacity-60' : ''}`}>{resolveText(item, gender)}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    case 'cierre':
      return (
        <div className="rounded-[2rem] bg-gradient-to-br from-[#CC5833] to-[#8a3a20] p-10 text-center text-white">
          <CheckCircle2 size={34} className="mx-auto mb-4" />
          <h2 className="font-heading text-3xl">{title}</h2>
          {text && <p className="mt-3 text-white/85">{text}</p>}
        </div>
      );
    default:
      return null;
  }
};

/* ── Visor de lección (diapositivas) ───────────────────────────── */

const LessonViewer = ({ lesson, gender, journalDraft, onJournalChange, onJournalBlur, onJournalToggle, isCompleted, onComplete, onBack, isSaving }) => {
  const [index, setIndex] = useState(0);
  const blocks = lesson.blocks || [];
  const total = blocks.length;
  const block = blocks[index];
  const isLast = index === total - 1;
  const progress = Math.round(((index + 1) / total) * 100);

  const handleFinish = async () => {
    await onComplete();
    onBack();
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-6">
      <button onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#E4C878] transition hover:text-[#F5E5B8]">
        <ArrowLeft size={16} /> Volver a las lecciones
      </button>

      <div className="mb-2 flex items-center justify-between text-xs text-[#F3ECDD]/55">
        <span className="font-mono">{resolveText(lesson.title, gender)}</span>
        <span>{index + 1} / {total}</span>
      </div>
      <div className="mb-7 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-[#C9A24B] to-[#F5E5B8] transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div key={index} className="pp-slide min-h-[220px] rounded-[2rem] border border-[#E4C878]/20 bg-white p-6 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.8)] md:p-9">
        <LessonBlock block={block} gender={gender} journalDraft={journalDraft} onJournalChange={onJournalChange} onJournalBlur={onJournalBlur} onJournalToggle={onJournalToggle} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 font-bold transition ${index === 0 ? 'cursor-not-allowed border-white/10 text-white/25' : 'border-[#E4C878]/40 text-[#E4C878] hover:bg-[#E4C878]/10'}`}
        >
          <ArrowLeft size={16} /> Atrás
        </button>

        {isLast ? (
          <button
            onClick={handleFinish}
            disabled={isSaving}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold ${isCompleted ? 'bg-[#2E4036] text-white' : 'bg-[#E4C878] text-[#14110A] hover:bg-[#efd693]'} disabled:opacity-60`}
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
            {isCompleted ? 'Completada ✓ · volver' : 'Marcar como completada'}
          </button>
        ) : (
          <button onClick={() => setIndex((i) => Math.min(total - 1, i + 1))} className="inline-flex items-center gap-2 rounded-full bg-[#E4C878] px-6 py-3 font-bold text-[#14110A] btn-magnetic transition hover:bg-[#efd693]">
            Siguiente <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Administración de miembros ────────────────────────────────── */

const AdminMembers = ({ isSuperAdmin }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setMembers(await listMembers());
    } catch (err) {
      setError(err?.message || 'No pudimos cargar los miembros.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const patch = async (uid, fn) => {
    setBusyId(uid);
    try {
      await fn();
      setMembers((current) => current.map((m) => (m.id === uid ? { ...m, ...(m._next || {}) } : m)));
      await load();
    } catch (err) {
      setError(err?.message || 'No se pudo actualizar.');
    } finally {
      setBusyId('');
    }
  };

  const pending = members.filter((m) => (m.status || 'pending') === 'pending' && m.role === 'client');
  const others = members.filter((m) => !pending.includes(m));

  const MemberCard = ({ member }) => {
    const kits = member.kits || {};
    const [detail, setDetail] = useState(undefined);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const loadDetail = async () => {
      if (detail !== undefined) { setDetail(undefined); return; }
      setLoadingDetail(true);
      try {
        setDetail(await getMyProgress(member.id));
      } catch {
        setDetail('error');
      } finally {
        setLoadingDetail(false);
      }
    };

    const scanner = detail && detail !== 'error' ? detail.toolResults?.[SCANNER_TOOL_ID] : null;

    return (
      <div className="rounded-[1.5rem] border border-[#2E4036]/10 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-heading text-lg text-[#1A1A1A]">{member.fullName || 'Sin nombre'}</p>
            <p className="text-sm text-gray-500">{member.email}</p>
            <p className="text-sm text-gray-500">{member.phone || 'Sin teléfono'} · {member.gender || 'sin género'}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${member.status === 'active' ? 'bg-[#2E4036] text-white' : member.status === 'blocked' ? 'bg-[#CC5833] text-white' : 'bg-[#F0E4C8] text-[#8A6D1F]'}`}>
              {member.status === 'active' ? 'Activo' : member.status === 'blocked' ? 'Bloqueado' : 'Pendiente'}
            </span>
            {member.role !== 'client' && <span className="rounded-full bg-[#7FA9D8]/20 px-3 py-1 text-xs font-bold text-[#3D6681]">{member.role}</span>}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {KIT_ORDER.map((kitId) => {
            const enabled = Boolean(kits[kitId]);
            return (
              <button
                key={kitId}
                disabled={busyId === member.id}
                onClick={() => patch(member.id, () => setMemberKit(member.id, kitId, !enabled))}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${enabled ? 'bg-[#2E4036] text-white' : 'border border-gray-200 text-gray-500 hover:border-[#2E4036]/40'}`}
              >
                {enabled ? <Check size={11} className="mr-1 inline" /> : <Lock size={11} className="mr-1 inline" />}
                {PROCESS_KITS_BY_ID[kitId]?.title || kitId}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
          {member.status !== 'active' && (
            <button disabled={busyId === member.id} onClick={() => patch(member.id, () => setMemberStatus(member.id, 'active'))} className="rounded-full bg-[#2E4036] px-4 py-2 text-xs font-bold text-white disabled:opacity-60">
              Aprobar acceso
            </button>
          )}
          {member.status !== 'blocked' && (
            <button disabled={busyId === member.id} onClick={() => patch(member.id, () => setMemberStatus(member.id, 'blocked'))} className="rounded-full border border-[#CC5833]/30 px-4 py-2 text-xs font-bold text-[#CC5833] disabled:opacity-60">
              Bloquear
            </button>
          )}
          {member.status === 'blocked' && (
            <button disabled={busyId === member.id} onClick={() => patch(member.id, () => setMemberStatus(member.id, 'pending'))} className="rounded-full border border-gray-300 px-4 py-2 text-xs font-bold text-gray-600 disabled:opacity-60">
              Volver a pendiente
            </button>
          )}
          {isSuperAdmin && member.email !== ADMIN_EMAIL && (
            <select
              value={member.role || 'client'}
              disabled={busyId === member.id}
              onChange={(e) => patch(member.id, () => setMemberRole(member.id, e.target.value))}
              className="rounded-full border border-gray-200 px-3 py-2 text-xs font-bold text-[#2E4036] outline-none"
            >
              <option value="client">Cliente</option>
              <option value="admin">Admin / Coach</option>
              <option value="superadmin">Super-admin</option>
            </select>
          )}
          <button onClick={loadDetail} className="rounded-full border border-[#2E4036]/15 px-4 py-2 text-xs font-bold text-[#2E4036] hover:bg-[#F7F4ED]">
            {detail !== undefined ? 'Ocultar resultados' : 'Ver resultados'}
          </button>
        </div>

        {loadingDetail && <p className="mt-3 flex items-center gap-2 text-xs text-gray-500"><Loader2 size={14} className="animate-spin" /> Cargando…</p>}

        {detail !== undefined && !loadingDetail && (
          <div className="mt-3 rounded-2xl border border-[#2E4036]/10 bg-[#F7F4ED] p-4">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#CC5833]">Escáner de creencias (Kit Financiero)</p>
            {detail === 'error' ? (
              <p className="text-sm text-[#7A3A25]">No pudimos cargar los resultados. Intenta de nuevo.</p>
            ) : scanner ? (
              <>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span><strong className="font-heading text-lg text-[#2E4036]">{scanner.totalHigh ?? 0}</strong> creencias fuertes (8–10)</span>
                  <span><strong className="font-heading text-lg text-[#2E4036]">{scanner.total10 ?? 0}</strong> marcó 10</span>
                  <span><strong className="font-heading text-lg text-[#2E4036]">{scanner.answered ?? 0}</strong>/65 respondidas</span>
                </div>
                {Array.isArray(scanner.highBeliefs) && scanner.highBeliefs.length > 0 && (
                  <ul className="mt-3 space-y-1.5 text-sm text-[#1A1A1A]/75">
                    {scanner.highBeliefs.map((b) => (
                      <li key={b.id} className="flex gap-2">
                        <span className="shrink-0 font-bold text-[#CC5833]">{b.score}</span> {b.text}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">Aún no ha realizado el escáner de creencias.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#CC5833]">Administración</p>
          <h1 className="font-heading text-2xl text-[#1A1A1A]">Miembros del proceso</h1>
        </div>
        <button onClick={load} className="rounded-full border border-[#2E4036]/15 px-4 py-2 text-sm font-bold text-[#2E4036] hover:bg-white">Actualizar</button>
      </div>

      {error && <div className="mb-4 flex gap-2 rounded-2xl border border-[#CC5833]/25 bg-[#FFF3EE] p-4 text-sm text-[#7A3A25]"><AlertCircle size={16} /> {error}</div>}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500"><Loader2 size={16} className="animate-spin" /> Cargando…</div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <p className="mb-3 font-heading text-lg text-[#CC5833]">Solicitudes pendientes ({pending.length})</p>
              <div className="space-y-3">{pending.map((m) => <MemberCard key={m.id} member={m} />)}</div>
            </div>
          )}
          <div>
            <p className="mb-3 font-heading text-lg text-[#2E4036]">Todos los miembros ({others.length})</p>
            <div className="space-y-3">
              {others.map((m) => <MemberCard key={m.id} member={m} />)}
              {!others.length && <p className="text-sm text-gray-500">Aún no hay miembros aprobados.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Portal (kits + lecciones) ─────────────────────────────────── */

const PortalContent = ({ member, isAdmin, gender, progress, journalDraft, onJournalChange, onJournalBlur, onJournalToggle, onComplete, onSaveToolProgress, onCompleteTool, savingLesson }) => {
  const [selectedKitId, setSelectedKitId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const completed = progress.completedLessons || [];

  const kit = selectedKitId ? PROCESS_KITS_BY_ID[selectedKitId] : null;
  const lesson = useMemo(() => {
    if (!kit || !selectedLessonId) return null;
    for (const module of kit.modules || []) {
      const found = (module.lessons || []).find((l) => l.id === selectedLessonId);
      if (found) return found;
    }
    return null;
  }, [kit, selectedLessonId]);

  // Herramienta de diapositivas diseñadas (PDF de la diseñadora).
  if (lesson && lesson.tool === 'slides') {
    return (
      <DesignedSlides
        title={lesson.subtitle ? `${lesson.title} · ${lesson.subtitle}` : lesson.title}
        slides={lesson.slides || []}
        isCompleted={completed.includes(lesson.id)}
        onComplete={() => onComplete(lesson.id)}
        onBack={() => setSelectedLessonId(null)}
        isSaving={savingLesson}
      />
    );
  }

  // Herramienta especial: Escáner de Creencias Limitantes.
  if (lesson && lesson.tool === 'escaner-creencias') {
    const toolData = progress.toolResults?.[lesson.id];
    return (
      <BeliefScanner
        initialRatings={toolData?.ratings || {}}
        savedResult={toolData?.completedAt ? toolData : null}
        onSaveProgress={(result) => onSaveToolProgress(lesson.id, result)}
        onComplete={(result) => onCompleteTool(lesson.id, result)}
        onBack={() => setSelectedLessonId(null)}
      />
    );
  }

  if (lesson) {
    return (
      <LessonViewer
        lesson={lesson}
        gender={gender}
        journalDraft={journalDraft}
        onJournalChange={onJournalChange}
        onJournalBlur={onJournalBlur}
        onJournalToggle={onJournalToggle}
        isCompleted={completed.includes(lesson.id)}
        onComplete={() => onComplete(lesson.id)}
        onBack={() => setSelectedLessonId(null)}
        isSaving={savingLesson}
      />
    );
  }

  if (kit) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-6">
        <button onClick={() => setSelectedKitId(null)} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#E4C878] transition hover:text-[#F5E5B8]">
          <ArrowLeft size={16} /> Volver a mis kits
        </button>
        <div className="pp-rise">
          <h1 className="font-heading text-3xl text-[#F3ECDD] md:text-4xl">{kit.title}</h1>
          <p className="mt-1 font-serif italic text-[#E4C878]/80">{kit.subtitle}</p>
          <div className="mt-4 h-px w-24 bg-gradient-to-r from-[#E4C878] to-transparent"></div>
        </div>

        <div className="mt-7 space-y-7">
          {(kit.modules || []).map((module) => (
            <div key={module.id}>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-[#E4C878]/70">{module.title}</p>
              <div className="space-y-3">
                {(module.lessons || []).map((l, lessonIndex) => {
                  const done = completed.includes(l.id);
                  const isAssignment = Boolean(l.assignmentOf);
                  return (
                    <button
                      key={l.id}
                      onClick={() => setSelectedLessonId(l.id)}
                      style={{ '--d': `${0.1 + lessonIndex * 0.09}s` }}
                      className={`pp-rise group flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left backdrop-blur transition duration-300 hover:-translate-y-0.5 ${
                        isAssignment
                          ? 'ml-3 border-dashed border-[#E4C878]/40 bg-[#E4C878]/[0.06] hover:border-[#E4C878]/80 hover:bg-[#E4C878]/[0.10] sm:ml-6'
                          : 'border-white/10 bg-white/[0.05] hover:border-[#E4C878]/50 hover:bg-white/[0.08] hover:shadow-[0_12px_36px_-16px_rgba(228,200,120,0.35)]'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {done ? <CheckCircle2 size={22} className="shrink-0 text-[#E4C878]" /> : <Circle size={22} className="shrink-0 text-white/25" />}
                        <span>
                          {isAssignment && (
                            <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-[#E4C878]">
                              Asignación · {l.assignmentOf}
                            </span>
                          )}
                          <span className="font-heading text-[#F3ECDD]">{resolveText(l.title, gender)}</span>
                          {l.subtitle && !isAssignment && <span className="block text-xs text-[#F3ECDD]/50">{l.subtitle}</span>}
                        </span>
                      </span>
                      <ChevronRight size={18} className="shrink-0 text-[#E4C878]/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#E4C878]" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Home: grid de kits
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
  const firstName = (member?.fullName || '').split(' ')[0];

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <div className="pp-rise pp-aurora relative mb-9 overflow-hidden rounded-[2rem] border border-[#E4C878]/25 p-8 text-[#F3ECDD] shadow-[0_0_70px_-20px_rgba(228,200,120,0.35)] md:p-10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#E4C878]/[0.16] blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#CC5833]/[0.10] blur-3xl"></div>
        <div className="relative">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[#E4C878]">
            <Sparkles size={14} className="pp-breathe" /> Bienvenido a tu proceso
          </p>
          <h1 className="mt-3 font-heading text-3xl md:text-5xl">
            {timeGreeting}{firstName ? ',' : ''}{' '}
            {firstName ? <span className="bg-gradient-to-r from-[#E4C878] via-[#F5E5B8] to-[#C9A24B] bg-clip-text text-transparent">{firstName}</span> : ''} 👋
          </h1>
          <p className="mt-4 max-w-xl font-serif text-lg italic text-[#F3ECDD]/75">
            Este es tu espacio privado y seguro. Avanza a tu ritmo, con tu coach. Lo que escribas aquí es solo tuyo.
          </p>
          <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#E4C878] to-transparent"></div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {PROCESS_KITS.map((k, kitIndex) => {
          const Icon = KIT_ICONS[k.icon] || Heart;
          const enabled = isAdmin || Boolean(member?.kits?.[k.id]);
          const lessons = getLessonCountForKit(k);
          const doneCount = (progress.completedLessons || []).filter((id) =>
            (k.modules || []).some((m) => (m.lessons || []).some((l) => l.id === id))
          ).length;
          const pct = lessons ? (doneCount / lessons) * 100 : 0;
          const riseDelay = { '--d': `${0.15 + kitIndex * 0.13}s` };

          // Tarjeta premium con imagen de fondo (cuando el kit tiene `image`).
          if (enabled && k.image) {
            return (
              <div key={k.id} className="pp-rise group relative flex min-h-[320px] flex-col overflow-hidden rounded-[2rem] border border-[#E4C878]/25 shadow-lg transition duration-300 hover:-translate-y-1.5 hover:border-[#E4C878]/60 hover:shadow-[0_20px_60px_-20px_rgba(228,200,120,0.4)]" style={riseDelay}>
                <img src={k.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/70"></div>
                <div className="pp-shine"></div>
                <div className="relative flex flex-1 flex-col p-6 text-white [text-shadow:_0_1px_10px_rgba(0,0,0,0.7)]">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E4C878] text-[#14110A] shadow-[0_0_24px_rgba(228,200,120,0.45)] transition-transform duration-300 group-hover:scale-110">
                    <Icon size={26} />
                  </div>
                  <h2 className="font-heading text-xl">{k.title}</h2>
                  <p className="mt-1 text-sm text-white/85">{k.description}</p>
                  <div className="mt-auto pt-4">
                    <div className="text-xs text-white/60">{doneCount} / {lessons} lecciones</div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#C9A24B] to-[#F5E5B8] transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                    <button onClick={() => setSelectedKitId(k.id)} className="mt-5 w-full rounded-full bg-[#E4C878] px-5 py-3 text-sm font-bold text-[#14110A] btn-magnetic transition hover:bg-[#efd693]">
                      {doneCount > 0 ? 'Continuar' : 'Comenzar'}
                    </button>
                    {isAdmin && !member?.kits?.[k.id] && (
                      <p className="mt-2 text-[11px] text-white/50">(Vista de admin: lo ves desbloqueado)</p>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={k.id} className={`pp-rise group relative overflow-hidden rounded-[2rem] border p-6 transition duration-300 ${enabled ? 'border-[#E4C878]/20 bg-white/[0.05] backdrop-blur hover:-translate-y-1.5 hover:border-[#E4C878]/50' : 'border-white/10 bg-white/[0.03]'}`} style={riseDelay}>
              {k.image && (
                <>
                  <img src={k.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 saturate-50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/75 to-black/60"></div>
                </>
              )}
              <div className="relative">
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${enabled ? 'bg-[#E4C878] text-[#14110A]' : 'bg-white/10 text-[#E4C878]/50'}`}>
                  <Icon size={26} />
                </div>
                <h2 className="font-heading text-xl text-[#F3ECDD]">{k.title}</h2>
                <p className="mt-1 text-sm text-[#F3ECDD]/60">{k.description}</p>

                {enabled ? (
                  <>
                    <div className="mt-4 text-xs text-[#F3ECDD]/50">{doneCount} / {lessons} lecciones</div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#C9A24B] to-[#F5E5B8] transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                    <button onClick={() => setSelectedKitId(k.id)} className="mt-5 w-full rounded-full bg-[#E4C878] px-5 py-3 text-sm font-bold text-[#14110A] btn-magnetic transition hover:bg-[#efd693]">
                      {doneCount > 0 ? 'Continuar' : 'Comenzar'}
                    </button>
                  </>
                ) : (
                  <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[#F3ECDD]/55">
                    <Lock size={16} className="text-[#E4C878]/60" /> Disponible más adelante · habla con tu coach
                  </div>
                )}
                {isAdmin && !member?.kits?.[k.id] && (
                  <p className="mt-2 text-[11px] text-[#F3ECDD]/40">(Vista de admin: lo ves desbloqueado)</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ── Componente raíz ───────────────────────────────────────────── */

export default function ProcessPortal({ GlobalStyles }) {
  const [authLoading, setAuthLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [member, setMember] = useState(null);
  const [memberLoading, setMemberLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [view, setView] = useState('home');
  const [homeKey, setHomeKey] = useState(0);
  const [signingIn, setSigningIn] = useState(false);
  const [progress, setProgress] = useState({ completedLessons: [] });
  const [journalDraft, setJournalDraft] = useState({});
  const [savingLesson, setSavingLesson] = useState(false);
  const journalTimersRef = useRef({});

  const isSuperAdminEmail = authUser?.email?.toLowerCase() === ADMIN_EMAIL;
  const effectiveRole = isSuperAdminEmail ? 'superadmin' : (member?.role || 'client');
  const isAdmin = effectiveRole === 'admin' || effectiveRole === 'superadmin';
  const effectiveStatus = isAdmin ? 'active' : (member?.status || 'pending');
  const needsProfile = Boolean(authUser) && !isSuperAdminEmail && !member;
  const gender = member?.gender || 'masculino';

  const loadMember = useCallback(async (uid) => {
    setMemberLoading(true);
    try {
      // Cargamos SIEMPRE el avance y el diario antes de mostrar el portal,
      // así al refrescar las respuestas ya están listas (sin carreras de carga).
      const [found, prog, journal] = await Promise.all([
        getMyMember(uid),
        getMyProgress(uid).catch(() => ({ completedLessons: [] })),
        getMyJournal(uid).catch(() => ({}))
      ]);
      setMember(found);
      setProgress(prog || { completedLessons: [] });
      setJournalDraft(journal || {});
    } catch {
      setMember(null);
    } finally {
      setMemberLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!auth || !db) {
      setAuthError('El acceso a procesos no está configurado todavía.');
      setAuthLoading(false);
      return undefined;
    }
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user && !user.isAnonymous) {
        setAuthUser(user);
        await loadMember(user.uid);
      } else {
        setAuthUser(null);
        setMember(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, [loadMember]);

  const handleSignIn = async () => {
    if (signingIn) return;
    setAuthError('');
    setSigningIn(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      if (auth.currentUser?.isAnonymous) await signOut(auth);
      await signInWithPopup(auth, provider);
    } catch (err) {
      setAuthError(err?.message || 'No pudimos iniciar sesión con Google.');
    } finally {
      setSigningIn(false);
    }
  };

  const goHome = () => {
    setView('home');
    setHomeKey((k) => k + 1);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setView('home');
  };

  const handleProfileSubmit = async ({ fullName, phone, gender: g, consent }) => {
    if (!authUser) return;
    setSavingProfile(true);
    setProfileError('');
    try {
      await createMyMember({ uid: authUser.uid, email: authUser.email, fullName, phone, gender: g, consent });
      await loadMember(authUser.uid);
    } catch (err) {
      setProfileError(err?.message || 'No pudimos guardar tus datos. Intenta de nuevo.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleJournalChange = (blockId, value) => {
    setJournalDraft((current) => ({ ...current, [blockId]: value }));
    // Autoguardado con debounce: lo escrito no se pierde aunque no haya "blur".
    if (typeof value === 'string' && authUser) {
      if (journalTimersRef.current[blockId]) window.clearTimeout(journalTimersRef.current[blockId]);
      journalTimersRef.current[blockId] = window.setTimeout(() => {
        saveJournalEntry(authUser.uid, blockId, value).catch(() => {});
      }, 900);
    }
  };

  const handleJournalBlur = async (blockId, explicitValue) => {
    if (!authUser) return;
    const value = explicitValue !== undefined ? explicitValue : journalDraft[blockId];
    if (value === undefined) return;
    if (journalTimersRef.current[blockId]) window.clearTimeout(journalTimersRef.current[blockId]);
    try {
      await saveJournalEntry(authUser.uid, blockId, value);
    } catch {
      // se reintenta al próximo cambio; no bloqueamos la experiencia
    }
  };

  // Checklist: usa actualización funcional para no perder toques rápidos.
  const handleJournalToggle = (blockId, item) => {
    setJournalDraft((current) => {
      const arr = Array.isArray(current[blockId]) ? current[blockId] : [];
      const next = arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
      if (authUser) saveJournalEntry(authUser.uid, blockId, next).catch(() => {});
      return { ...current, [blockId]: next };
    });
  };

  const handleCompleteLesson = async (lessonId) => {
    if (!authUser) return;
    setSavingLesson(true);
    try {
      const next = await setLessonCompleted(authUser.uid, lessonId, progress.completedLessons);
      setProgress((current) => ({ ...current, completedLessons: next }));
    } catch {
      // silencioso; el avance se puede reintentar
    } finally {
      setSavingLesson(false);
    }
  };

  // Guardado parcial de una herramienta (ej. escáner de creencias):
  // guarda respuestas + resumen (sin completedAt) para que la coach vea
  // totales consistentes con las respuestas actuales. El efecto de red
  // va FUERA del updater de estado (updater puro).
  const handleSaveToolProgress = (toolId, result) => {
    if (!authUser) return Promise.resolve();
    const clean = cleanToolResult(result, false);
    setProgress((current) => ({
      ...current,
      toolResults: { ...(current.toolResults || {}), [toolId]: { ...(current.toolResults?.[toolId] || {}), ...clean } }
    }));
    return saveToolResult(authUser.uid, toolId, clean, progress.completedLessons || []);
  };

  // Al terminar: guarda el resultado con completedAt y marca la lección.
  const handleCompleteTool = (toolId, result) => {
    if (!authUser) return Promise.resolve();
    const clean = cleanToolResult(result, true);
    const nextCompleted = Array.from(new Set([...(progress.completedLessons || []), toolId]));
    setProgress((current) => ({
      ...current,
      completedLessons: Array.from(new Set([...(current.completedLessons || []), toolId])),
      toolResults: { ...(current.toolResults || {}), [toolId]: { ...(current.toolResults?.[toolId] || {}), ...clean } }
    }));
    return saveToolResult(authUser.uid, toolId, clean, nextCompleted);
  };

  const frame = (content, dark = true) => (
    <Shell dark={dark}>
      {GlobalStyles ? <GlobalStyles /> : null}
      <style dangerouslySetInnerHTML={{ __html: PORTAL_STYLES }} />
      <div className="noise-overlay"></div>
      {content}
    </Shell>
  );

  if (authLoading || memberLoading) {
    return frame(
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-full border border-[#E4C878]/25 bg-black/40 px-6 py-3.5 backdrop-blur">
          <Loader2 size={18} className="animate-spin text-[#E4C878]" />
          <span className="font-mono text-sm text-[#E4C878]">Cargando tu proceso…</span>
        </div>
      </div>
    );
  }

  // No autenticado → landing
  if (!authUser) {
    return frame(
      <CenteredCard>
        <a href="/" className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#2E4036]/60 hover:text-[#2E4036]">
          <ArrowLeft size={14} /> Volver a GEMB
        </a>
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2E4036] text-white"><ShieldCheck size={26} /></div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#CC5833]">Área privada</p>
        <h1 className="font-heading text-3xl text-[#1A1A1A]">Continúa con tu proceso</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/65">
          Ingresa con tu cuenta de Google para entrar a tu espacio personal, seguro y privado. El acceso lo habilita tu coach.
        </p>
        {authError && <div className="mt-4 flex gap-2 rounded-2xl border border-[#CC5833]/25 bg-[#FFF3EE] p-3 text-sm text-[#7A3A25]"><AlertCircle size={16} /> {authError}</div>}
        <button onClick={handleSignIn} disabled={!auth || signingIn} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#CC5833] px-6 py-4 font-bold text-white btn-magnetic disabled:cursor-not-allowed disabled:bg-gray-300">
          {signingIn ? <><Loader2 size={18} className="animate-spin" /> Abriendo Google…</> : 'Ingresar con Google'}
        </button>
      </CenteredCard>
    );
  }

  // Autenticado pero sin perfil → completar datos
  if (needsProfile) {
    return frame(<CenteredCard><ProfileForm defaultName={authUser.displayName} onSubmit={handleProfileSubmit} isSaving={savingProfile} error={profileError} /></CenteredCard>);
  }

  // En revisión
  if (effectiveStatus === 'pending') {
    return frame(
      <CenteredCard>
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0E4C8] text-[#8A6D1F]"><ShieldCheck size={26} /></div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#CC5833]">Acceso en revisión</p>
        <h1 className="font-heading text-2xl text-[#1A1A1A]">Tu acceso está en revisión</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/70">
          Ya recibimos tu registro, <strong>{(member?.fullName || '').split(' ')[0] || ''}</strong>. Para habilitar tu proceso, escribe a <strong>{CONTACT_ADMINS}</strong> y con gusto activamos tu espacio.
        </p>
        <div className="mt-5 rounded-2xl bg-[#F7F4ED] p-4 text-sm text-[#2E4036]">
          <p className="font-semibold">Mientras tanto:</p>
          <p className="mt-1 text-[#1A1A1A]/70">Puedes tener a la mano un cuaderno para tu proceso. Te avisaremos apenas quede habilitado.</p>
        </div>
        <button onClick={handleSignOut} className="mt-6 w-full rounded-full border border-[#2E4036]/20 px-6 py-3 font-bold text-[#2E4036] hover:bg-white">Salir</button>
      </CenteredCard>
    );
  }

  // Bloqueado
  if (effectiveStatus === 'blocked') {
    return frame(
      <CenteredCard>
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#CC5833] text-white"><Lock size={26} /></div>
        <h1 className="font-heading text-2xl text-[#1A1A1A]">Tu acceso está inactivo</h1>
        <p className="mt-3 text-sm text-[#1A1A1A]/70">Escribe a {CONTACT_ADMINS} para reactivar tu proceso.</p>
        <button onClick={handleSignOut} className="mt-6 w-full rounded-full border border-[#2E4036]/20 px-6 py-3 font-bold text-[#2E4036] hover:bg-white">Salir</button>
      </CenteredCard>
    );
  }

  // Activo → portal
  return frame(
    <>
      <PortalHeader
        member={member}
        isAdmin={isAdmin}
        view={view}
        onGoHome={goHome}
        onGoAdmin={() => setView('admin')}
        onSignOut={handleSignOut}
      />
      {view === 'admin' && isAdmin ? (
        <AdminMembers isSuperAdmin={effectiveRole === 'superadmin'} />
      ) : (
        <PortalContent
          key={homeKey}
          member={member}
          isAdmin={isAdmin}
          gender={gender}
          progress={progress}
          journalDraft={journalDraft}
          onJournalChange={handleJournalChange}
          onJournalBlur={handleJournalBlur}
          onJournalToggle={handleJournalToggle}
          onComplete={handleCompleteLesson}
          onSaveToolProgress={handleSaveToolProgress}
          onCompleteTool={handleCompleteTool}
          savingLesson={savingLesson}
        />
      )}
    </>,
    !(view === 'admin' && isAdmin)
  );
}
