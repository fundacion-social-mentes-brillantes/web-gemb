import React, { useEffect, useState } from 'react';
import { X, ScanLine, CheckCircle2, Activity, Check, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { FULL_STATEMENTS, FULL_POTENTIAL, TIEBREAKER_MARGIN_THRESHOLD, createTieBreakerQuestions } from './testConfig';

const LIKERT_OPTIONS = [
  { value: 0, label: 'Nada' },
  { value: 1, label: 'Poco' },
  { value: 2, label: 'Medio' },
  { value: 3, label: 'Bastante' },
  { value: 4, label: 'Mucho' }
];

export default function TestEnneagramModal({
  isOpen,
  onClose,
  quickGroups,
  quickMatrix,
  eneatypes,
  waNumber
}) {
  const [quickChoice, setQuickChoice] = useState({ first: null, second: null });
  const [step, setStep] = useState('choice');
  const [fullIndex, setFullIndex] = useState(0);
  const [fullAnswers, setFullAnswers] = useState([]);
  const [helperOpen, setHelperOpen] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState('');
  const [questionMotion, setQuestionMotion] = useState('idle');
  const [isTransitioningQuestion, setIsTransitioningQuestion] = useState(false);
  const [tieBreakerConfig, setTieBreakerConfig] = useState(null);
  const [tieBreakerIndex, setTieBreakerIndex] = useState(0);
  const [tieBreakerAnswers, setTieBreakerAnswers] = useState([]);

  useEffect(() => {
    if (!answerFeedback) return undefined;
    const timer = window.setTimeout(() => setAnswerFeedback(''), 1400);
    return () => window.clearTimeout(timer);
  }, [answerFeedback]);

  const resetModal = () => {
    setStep('choice');
    setQuickChoice({ first: null, second: null });
    setFullIndex(0);
    setFullAnswers([]);
    setHelperOpen(false);
    setAnswerFeedback('');
    setQuestionMotion('idle');
    setIsTransitioningQuestion(false);
    setTieBreakerConfig(null);
    setTieBreakerIndex(0);
    setTieBreakerAnswers([]);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  const quickResult = () => {
    if (!quickChoice.first || !quickChoice.second) return null;
    const code = `${quickChoice.first}${quickChoice.second}`;
    const combo = quickMatrix[code];
    if (!combo) return null;
    return { code, label: combo.label, note: combo.note, type: eneatypes[combo.typeId] };
  };

  const computeFullScores = (answers = fullAnswers) => {
    const totals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    answers.forEach((ans, idx) => {
      if (ans === undefined || ans === null) return;
      FULL_STATEMENTS[idx].targets.forEach(({ t, w }) => {
        totals[t] += ans * w;
      });
    });
    return totals;
  };

  const fullResult = () => {
    const totals = computeFullScores();
    const normalized = Object.entries(totals).map(([id, rawScore]) => {
      const maxPossible = FULL_POTENTIAL[id] || 1;
      const normalizedScore = maxPossible ? rawScore / maxPossible : 0;
      return { id, rawScore, maxPossible, normalizedScore };
    });

    const ranking = normalized.sort((a, b) => b.normalizedScore - a.normalizedScore);
    const [top, second] = ranking;
    const marginNormalized = top.normalizedScore - second.normalizedScore;
    const coverageNormalized = top.normalizedScore;

    let confidence = 'baja';
    if (coverageNormalized >= 0.7 && marginNormalized >= 0.1) confidence = 'alta';
    else if (coverageNormalized >= 0.55 && marginNormalized >= 0.06) confidence = 'media';

    return {
      ranking,
      top: { ...eneatypes[top.id], rawScore: top.rawScore, maxPossible: top.maxPossible, normalizedScore: top.normalizedScore },
      second: { ...eneatypes[second.id], rawScore: second.rawScore, maxPossible: second.maxPossible, normalizedScore: second.normalizedScore },
      marginNormalized,
      coverageNormalized,
      confidence
    };
  };

  const buildPresentationResult = () => {
    const base = fullResult();
    const tiePair = tieBreakerConfig?.pair;
    const tieQuestionsCompleted = tieBreakerConfig && tieBreakerAnswers.length === tieBreakerConfig.questions.length;
    const pairIds = tiePair ? tiePair.map((value) => Number(value)) : [];
    const votes = pairIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {});

    if (tieQuestionsCompleted) {
      tieBreakerAnswers.forEach((answer) => {
        if (votes[answer] !== undefined) votes[answer] += 1;
      });
    }

    const lowMargin = base.marginNormalized < TIEBREAKER_MARGIN_THRESHOLD;
    const firstVotes = votes[pairIds[0]] || 0;
    const secondVotes = votes[pairIds[1]] || 0;
    const decisiveByTieBreaker = tieQuestionsCompleted && Math.abs(firstVotes - secondVotes) >= 2
      ? (firstVotes > secondVotes ? pairIds[0] : pairIds[1])
      : null;

    let displayedTop = base.top;
    let displayedSecond = base.second;

    if (decisiveByTieBreaker && decisiveByTieBreaker === Number(base.second.id)) {
      displayedTop = base.second;
      displayedSecond = base.top;
    }

    return {
      ...base,
      displayedTop,
      displayedSecond,
      tieBreakerCompleted: tieQuestionsCompleted,
      tieBreakerWinner: decisiveByTieBreaker ? eneatypes[decisiveByTieBreaker] : null,
      isMixed: lowMargin && !decisiveByTieBreaker
    };
  };

  const maybeVibrate = () => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(20);
    }
  };

  const moveToQuestion = (nextIndex) => {
    setHelperOpen(false);
    setQuestionMotion('out');
    setIsTransitioningQuestion(true);

    window.setTimeout(() => {
      setFullIndex(nextIndex);
      setQuestionMotion('in');
      window.setTimeout(() => {
        setQuestionMotion('idle');
        setIsTransitioningQuestion(false);
      }, 220);
    }, 280);
  };

  const handleFullAnswer = (value) => {
    if (isTransitioningQuestion) return;

    const updated = [...fullAnswers];
    updated[fullIndex] = value;
    setFullAnswers(updated);
    setAnswerFeedback(`Respuesta guardada: ${LIKERT_OPTIONS.find((opt) => opt.value === value)?.label || value}`);
    maybeVibrate();

    if (fullIndex < FULL_STATEMENTS.length - 1) {
      moveToQuestion(fullIndex + 1);
      return;
    }

    const normalized = Object.entries(computeFullScores(updated)).map(([id, rawScore]) => {
      const maxPossible = FULL_POTENTIAL[id] || 1;
      const normalizedScore = maxPossible ? rawScore / maxPossible : 0;
      return { id, rawScore, maxPossible, normalizedScore };
    }).sort((a, b) => b.normalizedScore - a.normalizedScore);

    const [top, second] = normalized;
    if (top.normalizedScore - second.normalizedScore < TIEBREAKER_MARGIN_THRESHOLD) {
      setTieBreakerConfig({
        pair: [top.id, second.id],
        questions: createTieBreakerQuestions(top.id, second.id, eneatypes)
      });
      setTieBreakerIndex(0);
      setTieBreakerAnswers([]);
      setStep('full-tiebreak');
      setQuestionMotion('idle');
      setIsTransitioningQuestion(false);
      return;
    }

    setStep('full-result');
    setQuestionMotion('idle');
    setIsTransitioningQuestion(false);
  };

  const handleTieBreakerAnswer = (typeId) => {
    if (!tieBreakerConfig) return;
    const updated = [...tieBreakerAnswers, typeId];
    setTieBreakerAnswers(updated);
    setAnswerFeedback(`Respuesta guardada: te acercas mas a ${eneatypes[typeId].type}`);
    maybeVibrate();
    if (tieBreakerIndex < tieBreakerConfig.questions.length - 1) {
      setTieBreakerIndex((prev) => prev + 1);
      return;
    }
    setStep('full-result');
  };

  const progression = Math.round(((fullIndex + 1) / FULL_STATEMENTS.length) * 100);
  const currentStatement = FULL_STATEMENTS[fullIndex];
  const motionClass = questionMotion === 'out'
    ? 'opacity-0 translate-y-5 md:translate-x-6'
    : questionMotion === 'in'
      ? 'opacity-100 translate-y-0 md:translate-x-0'
      : 'opacity-100 translate-y-0';

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A1A1A]/90 backdrop-blur-md" onClick={handleClose}></div>
      <div className="relative bg-[#F2F0E9] w-full max-w-3xl rounded-[2.5rem] p-5 sm:p-8 md:p-12 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <button onClick={handleClose} className="absolute top-6 right-6 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors">
          <X size={24} />
        </button>

        {step === 'choice' && (
          <div className="space-y-8 animate-[fadeIn_0.4s_ease-out]">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <ScanLine size={48} className="text-[#CC5833]" />
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-[#1A1A1A] mb-3">Mapa de Eneatipo</h2>
              <p className="font-serif italic text-lg text-gray-600 max-w-2xl mx-auto">
                Elige como empezar: primero una hipotesis rapida o una lectura profunda con 36 afirmaciones.
              </p>
            </div>
          </div>
        )}

        {step === 'choice' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#CC5833]/10 flex items-center justify-center text-[#CC5833] font-bold">1</div>
                <div>
                  <p className="font-heading text-xl text-[#1A1A1A]">Hipotesis inicial de eneatipo</p>
                  <p className="text-sm text-gray-500">Test rapido · 2-3 minutos</p>
                </div>
              </div>
              <ul className="text-sm text-[#2E4036] space-y-2">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> Grupo 1 (A/B/C) + Grupo 2 (X/Y/Z).</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> Orientativo, no diagnostico definitivo.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> Sirve como punto de partida para pasar al test completo.</li>
              </ul>
              <button onClick={() => setStep('quick-first')} className="mt-auto bg-[#2E4036] text-white px-6 py-3 rounded-full font-bold btn-magnetic">
                Hacer test rapido
              </button>
            </div>

            <div className="bg-[#1A1A1A] text-[#F2F0E9] rounded-3xl p-6 shadow-lg flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold">2</div>
                <div>
                  <p className="font-heading text-xl">Lectura profunda</p>
                  <p className="text-sm text-gray-300">Test completo · 8-12 minutos</p>
                </div>
              </div>
              <ul className="text-sm text-gray-200 space-y-2">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#E2C17D] mt-0.5" /> 36 afirmaciones · escala Likert 0-4.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#E2C17D] mt-0.5" /> Puntua 9 eneatipos con ranking por score normalizado.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#E2C17D] mt-0.5" /> Lectura orientativa de autoconocimiento, no diagnostica.</li>
              </ul>
              <button onClick={() => setStep('full-intro')} className="mt-auto bg-[#CC5833] text-white px-6 py-3 rounded-full font-bold btn-magnetic">
                Hacer test completo
              </button>
            </div>
          </div>
        )}

        {step === 'quick-first' && (
          <div className="animate-[fadeIn_0.3s_ease-out] space-y-6">
            <p className="font-mono text-xs text-[#CC5833] uppercase tracking-[0.2em]">Test rapido · Paso 1 de 2</p>
            <h3 className="font-heading text-2xl text-[#1A1A1A]">Elige el parrafo que mejor describe tu estilo de base</h3>
            <div className="space-y-3">
              {quickGroups.first.map(opt => (
                <button key={opt.code} onClick={() => { setQuickChoice({ ...quickChoice, first: opt.code }); setStep('quick-second'); }} className="w-full text-left bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#2E4036] hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-9 h-9 rounded-xl bg-[#CC5833]/10 text-[#CC5833] font-bold flex items-center justify-center">{opt.code}</span>
                    <p className="font-heading text-lg text-[#1A1A1A]">{opt.title}</p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'quick-second' && (
          <div className="animate-[fadeIn_0.3s_ease-out] space-y-6">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="font-mono text-xs text-[#CC5833]">Test rapido · Paso 2 de 2</span>
              <span className="px-3 py-1 rounded-full bg-[#2E4036]/10 text-[#2E4036] font-semibold text-xs">Elegiste {quickChoice.first}</span>
            </div>
            <h3 className="font-heading text-2xl text-[#1A1A1A]">Ahora elige la opcion que describe como manejas tu mundo interno</h3>
            <div className="space-y-3">
              {quickGroups.second.map(opt => (
                <button key={opt.code} onClick={() => { setQuickChoice({ ...quickChoice, second: opt.code }); setStep('quick-result'); }} className="w-full text-left bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#2E4036] hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-9 h-9 rounded-xl bg-[#2E4036]/10 text-[#2E4036] font-bold flex items-center justify-center">{opt.code}</span>
                    <p className="font-heading text-lg text-[#1A1A1A]">{opt.title}</p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'quick-result' && quickResult() && (
          <div className="animate-[fadeIn_0.4s_ease-out] space-y-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
                <Activity className="text-[#00FF66]" size={22} />
              </div>
              <p className="font-mono text-[11px] text-[#CC5833] tracking-[0.2em]">Hipotesis inicial de eneatipo</p>
              <h3 className="font-heading text-3xl text-[#1A1A1A]">Combinacion {quickResult().code}</h3>
              <p className="text-[#CC5833] font-serif italic">{quickResult().note}</p>
            </div>
          </div>
        )}

        {step === 'quick-result' && quickResult() && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <p className="text-sm text-gray-500">Orientativo, no diagnostico definitivo. Usalo como punto de partida y valida con el test completo para una lectura mas profunda.</p>
            <div className="p-4 rounded-2xl bg-[#F2F0E9] border border-gray-200">
              <p className="font-mono text-xs text-[#2E4036] uppercase tracking-widest mb-1">Eneatipo sugerido</p>
              <h4 className="font-heading text-2xl text-[#1A1A1A]">{quickResult().type.type}</h4>
              <p className="text-[#CC5833] text-sm font-serif italic">{quickResult().type.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
              <div className="bg-white border border-gray-100 rounded-2xl p-3">
                <p className="font-mono text-xs text-[#2E4036] uppercase tracking-widest mb-1">Motivacion</p>
                <p>{quickResult().type.motivation}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-3">
                <p className="font-mono text-xs text-[#2E4036] uppercase tracking-widest mb-1">Miedo central</p>
                <p>{quickResult().type.fear}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setStep('full-intro')} className="flex-1 bg-[#CC5833] text-white px-6 py-4 rounded-full font-bold btn-magnetic">Pasar a lectura profunda</button>
              <button onClick={() => { setStep('choice'); setQuickChoice({ first: null, second: null }); }} className="flex-1 px-6 py-4 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors">Repetir test rapido</button>
            </div>
          </div>
        )}

        {step === 'full-intro' && (
          <div className="animate-[fadeIn_0.3s_ease-out] space-y-6">
            <p className="font-mono text-xs text-[#CC5833] uppercase tracking-[0.2em]">Test completo</p>
            <h3 className="font-heading text-2xl text-[#1A1A1A]">36 afirmaciones · escala 0 a 4</h3>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 text-sm text-[#2E4036]">
              <p>Responde segun lo que te describe la mayor parte de tu vida, no solo tu estado actual ni tu version ideal. Esta lectura es orientativa de autoconocimiento, no diagnostica.</p>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> 0 = Nada · 4 = Mucho.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> Foco en motivacion, miedo, defensa, punto ciego y patron relacional.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> Si el resultado queda muy cerca entre dos tipos, se activara un mini desempate.</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('full-quiz')} className="bg-[#2E4036] text-white px-8 py-4 rounded-full font-bold btn-magnetic">Iniciar lectura profunda</button>
              <button onClick={() => { setStep('choice'); }} className="px-6 py-4 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-100">Volver</button>
            </div>
          </div>
        )}

        {step === 'full-quiz' && (
          <div className="animate-[fadeIn_0.3s_ease-out] space-y-5 flex-1 flex flex-col">
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-3 text-sm text-gray-600">
                <span className="font-mono text-xs text-[#CC5833]">Afirmacion {fullIndex + 1} de {FULL_STATEMENTS.length}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-[#2E4036]/10 text-[#2E4036] font-semibold">{progression}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#2E4036]/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#CC5833] to-[#2E4036] transition-all duration-300" style={{ width: `${progression}%` }}></div>
              </div>
            </div>

            <div className={`rounded-[2rem] bg-white border border-gray-200 shadow-sm p-5 sm:p-6 transition-all duration-300 ease-out ${motionClass}`}>
              <h3 className="font-heading text-[1.55rem] sm:text-3xl text-[#1A1A1A] leading-snug">{currentStatement.text}</h3>
              <div className="mt-4">
                <button onClick={() => setHelperOpen((prev) => !prev)} className="inline-flex items-center gap-2 text-sm font-semibold text-[#2E4036] hover:text-[#1A1A1A] transition-colors">
                  <span>¿Que quiere decir esta afirmacion?</span>
                  {helperOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {helperOpen && (
                  <div className="mt-3 rounded-2xl bg-[#F2F0E9] border border-[#2E4036]/10 p-4 text-sm text-[#2E4036] leading-relaxed">
                    <p>{currentStatement.helper}</p>
                    {currentStatement.example && <p className="mt-2 text-[#1A1A1A]"><span className="font-semibold">Ejemplo:</span> {currentStatement.example}</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {LIKERT_OPTIONS.map(opt => {
                const isSelected = fullAnswers[fullIndex] === opt.value;
                return (
                  <button key={opt.value} onClick={() => handleFullAnswer(opt.value)} className={`rounded-[1.4rem] border px-4 py-4 text-left sm:text-center font-bold text-sm transition-all duration-200 ${isSelected ? 'bg-[#2E4036] text-white border-[#2E4036] shadow-[0_14px_30px_-18px_rgba(46,64,54,0.85)] scale-[1.01]' : 'bg-white border-gray-200 text-[#1A1A1A] hover:border-[#2E4036] hover:-translate-y-0.5'}`}>
                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isSelected ? 'border-white/30 bg-white/12' : 'border-[#2E4036]/20 bg-[#F2F0E9]'}`}>
                        {isSelected ? <Check size={16} /> : <span className="text-[11px] font-mono">{opt.value}</span>}
                      </div>
                      <div>
                        <div className="text-base sm:text-lg">{opt.label}</div>
                        <div className={`text-[11px] ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>{isSelected ? 'Seleccionada' : `Valor ${opt.value}`}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-2 space-y-4">
              <div className={`min-h-[2.5rem] rounded-2xl border px-4 py-3 text-sm transition-all ${answerFeedback ? 'border-[#2E4036]/15 bg-[#2E4036]/8 text-[#2E4036]' : 'border-transparent bg-transparent text-gray-400'}`}>
                {answerFeedback ? <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#2E4036]" /><span>{answerFeedback}</span></div> : <span>Toca una opcion para guardar y avanzar.</span>}
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 border-t border-[#2E4036]/10">
                <button disabled={fullIndex === 0 || isTransitioningQuestion} onClick={() => setFullIndex((prev) => Math.max(0, prev - 1))} className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border ${fullIndex === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors'}`}>
                  <ArrowLeft size={16} />
                  Volver
                </button>
                <p className="text-xs sm:text-right text-gray-600 leading-relaxed max-w-md">Lee cada frase desde tu motivacion habitual, no desde tu imagen ideal ni solo desde como te sientes hoy.</p>
              </div>
            </div>
          </div>
        )}

        {step === 'full-tiebreak' && tieBreakerConfig && (
          <div className="animate-[fadeIn_0.3s_ease-out] space-y-6 flex-1 flex flex-col">
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-3 text-sm text-gray-600">
                <span className="font-mono text-xs text-[#CC5833]">Desempate {tieBreakerIndex + 1} de {tieBreakerConfig.questions.length}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-[#CC5833]/10 text-[#CC5833] font-semibold">Resultado muy cercano</span>
              </div>
              <div className="rounded-3xl border border-[#CC5833]/20 bg-[#FFF7F1] p-4 text-sm text-[#7A3A25]">
                Tus respuestas activaron dos patrones muy cercanos: <span className="font-semibold">{eneatypes[tieBreakerConfig.pair[0]].type}</span> y <span className="font-semibold">{eneatypes[tieBreakerConfig.pair[1]].type}</span>. Esta mini fase contrasta motivacion y defensa para afinar la lectura sin vender una certeza falsa.
              </div>
            </div>
            <div className="rounded-[2rem] bg-white border border-gray-200 shadow-sm p-5 sm:p-6">
              <h3 className="font-heading text-2xl text-[#1A1A1A] leading-snug">{tieBreakerConfig.questions[tieBreakerIndex].prompt}</h3>
              <p className="mt-3 text-sm text-[#2E4036] leading-relaxed">{tieBreakerConfig.questions[tieBreakerIndex].helper}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {[tieBreakerConfig.questions[tieBreakerIndex].left, tieBreakerConfig.questions[tieBreakerIndex].right].map((option) => (
                <button key={`${tieBreakerConfig.questions[tieBreakerIndex].id}-${option.typeId}`} onClick={() => handleTieBreakerAnswer(option.typeId)} className="rounded-[1.6rem] border border-gray-200 bg-white p-5 text-left hover:border-[#2E4036] hover:-translate-y-0.5 transition-all shadow-sm">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="font-heading text-xl text-[#1A1A1A]">{option.title}</span>
                    <span className="px-3 py-1 rounded-full bg-[#F2F0E9] text-xs font-semibold text-[#2E4036]">Me describe mas</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{option.text}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'full-result' && (() => {
          const res = buildPresentationResult();
          const headerTitle = res.isMixed ? `Resultado mixto entre ${res.top.type} y ${res.second.type}` : res.tieBreakerWinner && res.tieBreakerWinner.id === res.displayedTop.id ? `Lectura ajustada: ${res.displayedTop.type}` : res.displayedTop.type;
          const prudenceCopy = res.isMixed ? 'Tus respuestas activaron dos patrones muy cercanos. Toma este resultado como una hipotesis dual para contrastar, no como una etiqueta cerrada.' : res.confidence === 'baja' ? 'La lectura apunta en esta direccion, pero el nivel de certeza sigue siendo prudente. Leela como orientacion, no como definicion cerrada.' : 'Lectura orientativa de autoconocimiento, no diagnostica.';
          return (
            <div className="animate-[fadeIn_0.4s_ease-out] space-y-6">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center"><Activity className="text-[#00FF66]" size={22} /></div>
                <p className="font-mono text-[11px] text-[#CC5833] tracking-[0.2em]">Lectura profunda</p>
                <h3 className="font-heading text-3xl text-[#1A1A1A]">{headerTitle}</h3>
                <p className="text-[#CC5833] font-serif italic">{res.displayedTop.subtitle}</p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600 mt-1">
                  <span className="px-3 py-1 rounded-full bg-[#2E4036]/10 text-[#2E4036] font-semibold">Confianza {res.confidence}</span>
                  {res.isMixed ? <span className="px-3 py-1 rounded-full bg-[#CC5833]/10 text-[#CC5833] font-semibold">Diferencia muy cercana</span> : <span className="px-3 py-1 rounded-full bg-[#CC5833]/10 text-[#CC5833] font-semibold">Margen {(res.marginNormalized * 100).toFixed(1)}%</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1 max-w-2xl">{prudenceCopy}</p>
              </div>

              {res.isMixed && <div className="bg-[#FFF7F1] border border-[#CC5833]/20 rounded-3xl p-5 space-y-2 text-sm text-[#7A3A25]"><p className="font-semibold">Resultado mixto entre {res.top.type} y {res.second.type}</p><p>Tus respuestas activaron dos patrones muy cercanos. El ranking no alcanza para presentarte un tipo principal definitivo con honestidad.</p></div>}

              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 text-sm text-[#1A1A1A]">
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#F2F0E9] rounded-2xl border border-gray-200"><p className="font-mono text-[11px] uppercase tracking-widest text-[#2E4036] mb-1">Motivacion</p><p>{res.displayedTop.motivation}</p></div>
                  <div className="p-3 bg-[#F2F0E9] rounded-2xl border border-gray-200"><p className="font-mono text-[11px] uppercase tracking-widest text-[#2E4036] mb-1">Miedo central</p><p>{res.displayedTop.fear}</p></div>
                  <div className="p-3 bg-[#F2F0E9] rounded-2xl border border-gray-200"><p className="font-mono text-[11px] uppercase tracking-widest text-[#2E4036] mb-1">Deseo central</p><p>{res.displayedTop.desire}</p></div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-2xl border border-gray-100"><p className="font-mono text-[11px] uppercase tracking-widest text-[#CC5833] mb-1">Defensa habitual</p><p>{res.displayedTop.defense}</p></div>
                  <div className="p-3 bg-white rounded-2xl border border-gray-100"><p className="font-mono text-[11px] uppercase tracking-widest text-[#CC5833] mb-1">Patron relacional</p><p>{res.displayedTop.relation}</p></div>
                </div>
              </div>

              <div className="bg-gray-100/70 border border-gray-200 rounded-3xl p-5 space-y-2 text-sm text-gray-700">
                {res.isMixed ? <p className="font-semibold text-[#1A1A1A]">Los dos patrones a contrastar son {res.top.type} y {res.second.type}.</p> : <p className="font-semibold text-[#1A1A1A]">Segundo eneatipo a contrastar: {res.displayedSecond.type}</p>}
                {res.confidence === 'baja' && <p className="text-[#CC5833] font-semibold">Nivel de certeza prudente: si algo no te cierra, repite el test desde tu motivacion real o profundiza en acompanamiento.</p>}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => { const sharedType = res.isMixed ? `resultado mixto entre ${res.top.type} y ${res.second.type}` : `resultado principal ${res.displayedTop.type}`; const text = encodeURIComponent(`Hice el test completo. Tengo ${sharedType} (confianza ${res.confidence}). Quiero orientacion y Sala de Reduccion del Ego.`); window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank'); handleClose(); }} className="flex-1 bg-[#25D366] text-white px-6 py-4 rounded-full font-bold btn-magnetic shadow-[0_0_20px_rgba(37,211,102,0.3)]">Compartir y ver siguiente paso</button>
                <button onClick={() => { resetModal(); }} className="flex-1 px-6 py-4 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-100">Repetir lectura</button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
