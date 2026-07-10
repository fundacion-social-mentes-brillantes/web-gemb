import React, { useMemo, useRef, useState } from 'react';
import { Coins, TrendingUp, KeyRound, Sparkles, ArrowLeft, ArrowRight, CheckCircle2, RefreshCw, Lock } from 'lucide-react';
import {
  SCANNER_META, SCANNER_INSTRUCTIONS, BELIEF_GROUPS, ALL_BELIEFS, TOTAL_BELIEFS, HIGH_THRESHOLD
} from '../beliefScannerConfig';

/* ═══════════════════════════════════════════════════════════════
   Escáner de Creencias Limitantes hacia el Dinero.
   Identidad visual: negro + dorado (Kit Transformación Financiera).
   Guarda el avance para que la coach pueda ver el resultado.
   ═══════════════════════════════════════════════════════════════ */

const GOLD = '#E4C878';

const computeResult = (ratings) => {
  const entries = ALL_BELIEFS
    .map((b) => ({ ...b, score: ratings[b.id] }))
    .filter((b) => typeof b.score === 'number');

  const answered = entries.length;
  const total10 = entries.filter((b) => b.score === 10).length;
  const highBeliefs = entries
    .filter((b) => b.score >= HIGH_THRESHOLD)
    .sort((a, b) => b.score - a.score);
  const top5 = entries.slice().sort((a, b) => b.score - a.score).slice(0, 5);
  const sumScores = entries.reduce((sum, b) => sum + b.score, 0);

  return { answered, total10, totalHigh: highBeliefs.length, highBeliefs, top5, sumScores };
};

const RatingScale = ({ beliefId, value, onChange }) => (
  <div role="radiogroup" aria-label="Puntaje de 1 a 10" className="flex flex-wrap gap-1.5">
    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
      const selected = value === n;
      const isEdge = n === 1 || n === 10;
      return (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(beliefId, n)}
          className={`h-9 w-9 shrink-0 rounded-lg border text-sm font-bold transition ${
            selected
              ? 'border-[#E4C878] bg-[#E4C878] text-[#14110A] shadow-[0_0_16px_rgba(228,200,120,0.5)]'
              : isEdge
                ? 'border-[#E4C878]/45 bg-white/[0.04] text-[#E4C878] hover:bg-[#E4C878]/15'
                : 'border-white/12 bg-white/[0.03] text-white/45 hover:border-[#E4C878]/40 hover:text-white/80'
          }`}
        >
          {n}
        </button>
      );
    })}
  </div>
);

export default function BeliefScanner({ initialRatings, savedResult, onSaveProgress, onComplete, onBack }) {
  const [step, setStep] = useState(savedResult ? 'result' : 'intro');
  const [ratings, setRatings] = useState(initialRatings || {});
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error
  const saveTimer = useRef(null);
  const lastPayload = useRef(null);

  const result = useMemo(() => computeResult(ratings), [ratings]);
  const allAnswered = result.answered >= TOTAL_BELIEFS;

  const numberById = useMemo(() => {
    const map = {};
    let n = 0;
    BELIEF_GROUPS.forEach((group) => group.beliefs.forEach((b) => { n += 1; map[b.id] = n; }));
    return map;
  }, []);

  const track = (maybePromise) => {
    setSaveState('saving');
    Promise.resolve(maybePromise)
      .then(() => setSaveState('saved'))
      .catch(() => setSaveState('error'));
  };

  const handleRate = (beliefId, score) => {
    setRatings((current) => {
      const next = { ...current, [beliefId]: score };
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        const payload = { ratings: next, ...computeResult(next) };
        lastPayload.current = { payload, completed: false };
        track(onSaveProgress?.(payload));
      }, 900);
      return next;
    });
  };

  const handleFinish = () => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    const payload = { ratings, ...computeResult(ratings) };
    lastPayload.current = { payload, completed: true };
    track(onComplete?.(payload));
    setStep('result');
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const retrySave = () => {
    if (!lastPayload.current) return;
    const { payload, completed } = lastPayload.current;
    track(completed ? onComplete?.(payload) : onSaveProgress?.(payload));
  };

  const renderSaveBadge = () => {
    if (saveState === 'idle') return null;
    if (saveState === 'saving') return <span className="text-[11px] text-[#F3ECDD]/50">Guardando…</span>;
    if (saveState === 'saved') return <span className="text-[11px] text-[#E4C878]">✓ Guardado</span>;
    return (
      <span className="text-[11px] text-[#e79a86]">
        No se pudo guardar. <button type="button" onClick={retrySave} className="underline">Reintentar</button>
      </span>
    );
  };

  const wrap = (children) => (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <button onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#E4C878] hover:text-white">
        <ArrowLeft size={16} /> Volver a las herramientas
      </button>
      <div className="overflow-hidden rounded-[2rem] border border-[#E4C878]/20 bg-gradient-to-b from-[#1A160D] to-[#100D07] text-[#F3ECDD] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
        {children}
      </div>
    </div>
  );

  /* ── Intro ─────────────────────────────────────────────────── */
  if (step === 'intro') {
    return wrap(
      <div className="p-7 md:p-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4C878]/15 text-[#E4C878]"><Coins size={24} /></div>
          <div className="flex gap-2 text-[#E4C878]/60"><TrendingUp size={18} /><KeyRound size={18} /></div>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#E4C878]">{SCANNER_META.kicker}</p>
        <h1 className="mt-2 font-heading text-3xl leading-tight md:text-4xl" style={{ color: GOLD }}>{SCANNER_META.title}</h1>
        <p className="mt-3 text-[#F3ECDD]/75">{SCANNER_META.subtitle}</p>

        <div className="mt-7 space-y-3">
          {SCANNER_INSTRUCTIONS.map((ins, i) => (
            <div key={ins.title} className="rounded-2xl border border-[#E4C878]/12 bg-white/[0.03] p-4">
              <p className="flex items-center gap-2 font-heading text-[#E4C878]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E4C878]/15 text-xs">{i + 1}</span>
                {ins.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#F3ECDD]/70">{ins.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl border border-[#E4C878]/15 bg-black/20 px-5 py-4 text-xs">
          <span className="text-[#F3ECDD]/60">{SCANNER_META.scaleLow}</span>
          <span className="font-bold text-[#E4C878]">{SCANNER_META.scaleHigh}</span>
        </div>

        <button
          onClick={() => { setStep('quiz'); if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E4C878] px-7 py-4 font-bold text-[#14110A] transition hover:bg-[#efd693]"
        >
          {result.answered > 0 ? 'Continuar mi diagnóstico' : 'Comenzar mi diagnóstico'} <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  /* ── Cuestionario ──────────────────────────────────────────── */
  if (step === 'quiz') {
    const pct = Math.round((result.answered / TOTAL_BELIEFS) * 100);
    return wrap(
      <div>
        <div className="sticky top-0 z-10 border-b border-[#E4C878]/15 bg-[#14110A]/95 px-6 py-4 backdrop-blur">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-mono text-[#E4C878]">Respondidas: {result.answered} / {TOTAL_BELIEFS}</span>
            <span className="text-[#F3ECDD]/60">{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-[#E4C878] to-[#B8860B] transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-[#F3ECDD]/50">Marca <strong className="text-[#E4C878]">1</strong> si no te identificas, <strong className="text-[#E4C878]">10</strong> si te identificas por completo.</p>
        </div>

        <div className="space-y-8 p-6 md:p-8">
          {BELIEF_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#E4C878]/70">{group.title}</p>
              <div className="space-y-3">
                {group.beliefs.map((belief) => (
                  <div key={belief.id} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                    <p className="mb-3 flex gap-3 text-[15px] leading-snug text-[#F3ECDD]/90">
                      <span className="font-mono text-xs text-[#E4C878]/60">{numberById[belief.id]}</span>
                      {belief.text}
                    </p>
                    <RatingScale beliefId={belief.id} value={ratings[belief.id]} onChange={handleRate} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 border-t border-[#E4C878]/15 bg-[#14110A]/95 px-6 py-4 backdrop-blur">
          <div className="mb-2 flex min-h-[16px] items-center justify-center">{renderSaveBadge()}</div>
          {!allAnswered && (
            <p className="mb-3 text-center text-xs text-[#F3ECDD]/55">Te faltan {TOTAL_BELIEFS - result.answered} por responder. Puedes ver tus resultados con lo que llevas o completarlas todas.</p>
          )}
          <button
            onClick={handleFinish}
            disabled={result.answered === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E4C878] px-7 py-4 font-bold text-[#14110A] transition hover:bg-[#efd693] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Ver mis resultados <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  /* ── Resultados + Decodificación ───────────────────────────── */
  // Siempre se calcula desde las respuestas (así las decodificaciones
  // traen su texto desde la configuración).
  const shown = result;
  const strongWord = shown.totalHigh === 1 ? 'creencia te está frenando' : 'creencias te están frenando';
  return wrap(
    <div className="p-6 md:p-9">
      <div className="text-center">
        <Sparkles size={30} className="mx-auto text-[#E4C878]" />
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#E4C878]">Resultado de tu escáner</p>
        <h1 className="mt-1 font-heading text-2xl md:text-3xl" style={{ color: GOLD }}>Estas son tus creencias por transformar</h1>
      </div>

      {/* Número protagonista + explicación en palabras simples */}
      <div className="mt-6 rounded-[1.5rem] border border-[#E4C878]/30 bg-[#E4C878]/[0.06] p-6 text-center">
        <p className="font-heading text-6xl leading-none" style={{ color: GOLD }}>{shown.totalHigh}</p>
        <p className="mt-2 font-heading text-lg text-[#F3ECDD]">{strongWord}</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#F3ECDD]/70">
          Son las que marcaste <strong className="text-[#E4C878]">alto (8, 9 o 10)</strong>: las ideas que más influyen hoy en tu relación con el dinero. Abajo te mostramos cómo transformar cada una, y tu coach te acompaña a trabajarlas.
        </p>
      </div>

      {/* Datos secundarios, discretos */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-[#F3ECDD]/55">
        <span>Respondiste <strong className="text-[#E4C878]">{shown.answered} / {TOTAL_BELIEFS}</strong></span>
        <span>·</span>
        <span>Marcaste <strong className="text-[#E4C878]">10</strong> en <strong className="text-[#E4C878]">{shown.total10}</strong></span>
      </div>
      <div className="mt-3 flex min-h-[16px] justify-center">{renderSaveBadge()}</div>

      {shown.highBeliefs && shown.highBeliefs.length > 0 ? (
        <div className="mt-7">
          <div className="mb-2 flex items-center gap-2">
            <KeyRound size={18} className="text-[#E4C878]" />
            <h2 className="font-heading text-xl" style={{ color: GOLD }}>Decodificación de la creencia</h2>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-[#F3ECDD]/65">
            Para cada creencia que te frena, aquí tienes una versión nueva que te potencia. Léela, repítela y trabájala con tu coach.
          </p>
          <div className="space-y-4">
            {shown.highBeliefs.map((belief, i) => (
              <div key={belief.id} className="overflow-hidden rounded-2xl border border-[#E4C878]/20 bg-white/[0.02]">
                <div className="flex items-center justify-between border-b border-[#E4C878]/10 px-5 py-2.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#E4C878]/70">Decodificación {i + 1}</span>
                  <span className="rounded-full bg-[#E4C878]/15 px-2.5 py-1 text-[11px] font-bold text-[#E4C878]">Marcaste {belief.score}</span>
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#F3ECDD]/45">Creencia antigua</p>
                  <p className="mt-1 text-[#F3ECDD]/70 line-through decoration-[#CC5833]/50">{belief.text}</p>
                  <div className="my-3 flex items-center gap-2 text-[#E4C878]/70">
                    <div className="h-px flex-1 bg-[#E4C878]/20" /><ArrowRight size={14} /><div className="h-px flex-1 bg-[#E4C878]/20" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#E4C878]">Creencia decodificada</p>
                  <p className="mt-1 font-serif text-lg italic leading-snug text-[#F3ECDD]">{belief.decoded}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-7 rounded-2xl border border-[#E4C878]/15 bg-white/[0.03] p-6 text-center text-sm text-[#F3ECDD]/70">
          No marcaste creencias entre 8 y 10. Eso habla de una relación sana con el dinero. Si quieres, repite el diagnóstico con calma y total honestidad.
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button onClick={() => { setStep('quiz'); if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#E4C878]/30 px-6 py-3.5 font-bold text-[#E4C878] transition hover:bg-[#E4C878]/10">
          <RefreshCw size={16} /> Revisar mis respuestas
        </button>
        <button onClick={onBack} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#E4C878] px-6 py-3.5 font-bold text-[#14110A] transition hover:bg-[#efd693]">
          <CheckCircle2 size={16} /> Terminar
        </button>
      </div>

      <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-[#F3ECDD]/40">
        <Lock size={11} /> Tu diagnóstico se guarda de forma segura para tu proceso con tu coach.
      </p>
    </div>
  );
}
