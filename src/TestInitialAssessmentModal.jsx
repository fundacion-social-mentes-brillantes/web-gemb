import React, { useEffect, useMemo, useState } from 'react';
import { X, ArrowLeft, CheckCircle2, AlertTriangle, HeartHandshake } from 'lucide-react';
import { INITIAL_ASSESSMENT_QUESTIONS, INITIAL_ASSESSMENT_OPTIONS } from './initialAssessmentConfig';
import LeadCaptureForm from './components/LeadCaptureForm';
import { completeTestResponse, createTestLead } from './services/testResponsesService';

const ALERT_MESSAGE = "Si respondió afirmativamente a más de 3 preguntas, va en camino de tener serios problemas. Si contestó 4, usted necesita ayuda.";
const CLOSING_MESSAGE = "Podemos apoyarle, pero solo usted puede elegir.";

const calculateInitialAssessmentResult = (answerValues, totalQuestions) => {
  const yesCount = answerValues.filter((value) => value === 1).length;
  const noCount = answerValues.filter((value) => value === 0).length;

  return {
    yesCount,
    noCount,
    totalQuestions,
    isAlert: yesCount >= 4
  };
};

const buildInitialAnswersPayload = (answerValues) =>
  answerValues.map((value, index) => ({
    questionId: index + 1,
    question: INITIAL_ASSESSMENT_QUESTIONS[index],
    answer: value,
    label: value === 1 ? 'Si' : 'No'
  }));

export default function TestInitialAssessmentModal({
  isOpen,
  onClose,
  onOpenEnneagram,
  waNumber
}) {
  const [step, setStep] = useState('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [motion, setMotion] = useState('idle');
  const [responseId, setResponseId] = useState(null);
  const [isSavingCompletion, setIsSavingCompletion] = useState(false);
  const [completionError, setCompletionError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setStep('intro');
      setCurrentIndex(0);
      setAnswers([]);
      setIsTransitioning(false);
      setMotion('idle');
      setResponseId(null);
      setIsSavingCompletion(false);
      setCompletionError('');
    }
  }, [isOpen]);

  const totalQuestions = INITIAL_ASSESSMENT_QUESTIONS.length;
  const currentQuestion = INITIAL_ASSESSMENT_QUESTIONS[currentIndex];
  const progress = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const result = useMemo(() => {
    return calculateInitialAssessmentResult(answers, totalQuestions);
  }, [answers, totalQuestions]);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const goToEnneagram = () => {
    onClose();
    onOpenEnneagram();
  };

  const handleLeadSubmit = async ({ contact, consent }) => {
    const createdResponseId = await createTestLead({
      contact,
      consent,
      testType: 'initial-assessment'
    });

    setResponseId(createdResponseId);
    setStep('quiz');
  };

  const moveToQuestion = (nextIndex) => {
    setMotion('out');
    setIsTransitioning(true);

    window.setTimeout(() => {
      setCurrentIndex(nextIndex);
      setMotion('in');
      window.setTimeout(() => {
        setMotion('idle');
        setIsTransitioning(false);
      }, 180);
    }, 220);
  };

  const saveCompletedAssessment = async (answerValues, resultPayload) => {
    setIsSavingCompletion(true);
    setCompletionError('');

    try {
      await completeTestResponse(responseId, {
        answers: buildInitialAnswersPayload(answerValues),
        result: resultPayload
      });
    } catch (err) {
      setCompletionError(
        err?.message ||
          'No pudimos guardar el resultado. Puedes reintentar sin perder tus respuestas.'
      );
    } finally {
      setIsSavingCompletion(false);
    }
  };

  const handleAnswer = (value) => {
    if (isTransitioning) return;

    const updated = [...answers];
    updated[currentIndex] = value;
    setAnswers(updated);

    if (currentIndex < totalQuestions - 1) {
      moveToQuestion(currentIndex + 1);
      return;
    }

    const finalResult = calculateInitialAssessmentResult(updated, totalQuestions);
    setStep('result');
    saveCompletedAssessment(updated, finalResult);
  };

  const handleRestart = () => {
    setStep('intro');
    setCurrentIndex(0);
    setAnswers([]);
    setIsTransitioning(false);
    setMotion('idle');
    setResponseId(null);
    setIsSavingCompletion(false);
    setCompletionError('');
  };

  const retrySaveCompletedAssessment = () => {
    if (!responseId || answers.length < totalQuestions) return;
    saveCompletedAssessment(answers, result);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hola, respondí la Evaluación Inicial y tuve ${result.yesCount} respuestas afirmativas. Quiero recibir orientación.`
    );
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  const motionClass = motion === 'out'
    ? 'opacity-0 translate-y-4 md:translate-x-6'
    : motion === 'in'
      ? 'opacity-100 translate-y-0 md:translate-x-0'
      : 'opacity-100 translate-y-0';

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A1A1A]/88 backdrop-blur-md" onClick={handleClose}></div>

      <div className={`relative bg-[#F2F0E9] w-full ${step === 'result' ? 'max-w-4xl' : 'max-w-2xl'} rounded-[2.5rem] p-5 sm:p-8 md:p-10 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto`}>
        <button onClick={handleClose} aria-label="Cerrar" className="absolute top-6 right-6 text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors">
          <X size={24} />
        </button>

        {step === 'intro' && (
          <div className="space-y-8 animate-[fadeIn_0.35s_ease-out]">
            <div className="rounded-[2.25rem] overflow-hidden border border-white/60 shadow-[0_24px_60px_-36px_rgba(26,26,26,0.45)]">
              <div className="relative px-6 py-8 md:px-8 md:py-10 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.7),_transparent_35%),linear-gradient(135deg,#E9D7C6_0%,#F7EFE7_45%,#E8F0EB_100%)]">
                <div className="absolute inset-y-0 right-0 w-32 bg-[radial-gradient(circle,_rgba(204,88,51,0.18)_0%,_transparent_65%)]"></div>
                <div className="relative max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#2E4036]/10 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#2E4036] mb-5">
                    <span className="h-2 w-2 rounded-full bg-[#CC5833]"></span>
                    Valoraci&oacute;n inicial de tu proceso
                  </div>
                  <h2 className="font-heading text-3xl md:text-5xl text-[#1A1A1A] leading-tight">
                    Valoraci&oacute;n inicial de tu proceso
                  </h2>
                  <p className="font-serif italic text-lg md:text-2xl text-[#CC5833] mt-3">
                    37 preguntas rápidas para identificar señales de alerta emocional y relacional.
                  </p>
                  <p className="text-sm md:text-base text-[#1A1A1A]/72 leading-relaxed mt-5 max-w-xl">
                    Es una lectura breve, clara y humana. Responde una pregunta a la vez y al final ver&aacute;s un resultado orientativo con una salida directa para recibir apoyo.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-[1.3fr_0.9fr] gap-4">
              <div className="rounded-[2rem] bg-white border border-gray-200 p-6 shadow-sm">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#2E4036] mb-3">Cómo funciona</p>
                <ul className="space-y-3 text-sm text-[#1A1A1A]/80">
                  <li className="flex gap-3"><CheckCircle2 size={18} className="text-[#CC5833] shrink-0 mt-0.5" /> Una sola pregunta por pantalla para responder con calma.</li>
                  <li className="flex gap-3"><CheckCircle2 size={18} className="text-[#CC5833] shrink-0 mt-0.5" /> Respuestas simples: Sí o No.</li>
                  <li className="flex gap-3"><CheckCircle2 size={18} className="text-[#CC5833] shrink-0 mt-0.5" /> Resultado claro, prudente y con acompañamiento directo por WhatsApp.</li>
                </ul>
              </div>

              <div className="rounded-[2rem] bg-[#1A1A1A] text-[#F2F0E9] p-6 shadow-lg flex flex-col justify-between">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#E2C17D] mb-3">Opción secundaria</p>
                  <h3 className="font-heading text-2xl leading-tight">También quiero hacer el Mapa de Eneatipo</h3>
                  <p className="text-sm text-white/72 mt-3 leading-relaxed">
                    Si prefieres una lectura más amplia de personalidad, puedes ir directo al test de eneagrama que ya existe.
                  </p>
                </div>
                <button
                  onClick={goToEnneagram}
                  className="mt-6 px-5 py-3 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  También quiero hacer el Mapa de Eneatipo
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep('lead')}
                className="flex-1 bg-[#CC5833] text-white px-7 py-4 rounded-full font-bold btn-magnetic shadow-[0_0_20px_rgba(204,88,51,0.28)]"
              >
                Comenzar tu proceso
              </button>
              <button
                onClick={goToEnneagram}
                className="flex-1 px-7 py-4 rounded-full border border-[#2E4036]/20 text-[#2E4036] font-bold hover:bg-white transition-colors"
              >
                También quiero hacer el Mapa de Eneatipo
              </button>
            </div>
          </div>
        )}

        {step === 'lead' && (
          <LeadCaptureForm
            title="Tus datos antes de empezar"
            description="Guardaremos tus respuestas para que el equipo pueda revisar tu resultado y darte seguimiento por WhatsApp si lo solicitas."
            submitLabel="Guardar datos y comenzar"
            onSubmit={handleLeadSubmit}
          />
        )}

        {step === 'quiz' && (
          <div className="space-y-6 animate-[fadeIn_0.25s_ease-out]">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
                <span className="font-mono text-xs text-[#CC5833]">Pregunta {currentIndex + 1} de {totalQuestions}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-[#2E4036]/10 text-[#2E4036] font-semibold">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#2E4036]/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#CC5833] to-[#2E4036] transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className={`rounded-[2rem] bg-white border border-gray-200 p-6 md:p-8 shadow-sm transition-all duration-300 ease-out ${motionClass}`}>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#2E4036] mb-4">Valoraci&oacute;n inicial de tu proceso</p>
              <h3 className="font-heading text-[1.7rem] md:text-3xl leading-snug text-[#1A1A1A]">
                {currentQuestion}
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {INITIAL_ASSESSMENT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`rounded-[1.75rem] border px-5 py-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${option.value === 1 ? 'bg-[linear-gradient(135deg,#FFF6F0_0%,#FFFFFF_100%)] border-[#CC5833]/25 hover:border-[#CC5833]' : 'bg-white border-gray-200 hover:border-[#2E4036]/25'}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-heading text-2xl text-[#1A1A1A]">{option.label}</p>
                      <p className="text-sm text-gray-500 mt-1">{option.value === 1 ? 'Sí, esto me describe.' : 'No, esto no me describe.'}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold ${option.value === 1 ? 'bg-[#CC5833] text-white' : 'bg-[#2E4036]/10 text-[#2E4036]'}`}>
                      {option.value === 1 ? 'Sí' : 'No'}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[#2E4036]/10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                disabled={currentIndex === 0 || isTransitioning}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border ${currentIndex === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors'}`}
              >
                <ArrowLeft size={16} />
                Volver
              </button>
              <p className="text-xs text-gray-600 max-w-md sm:text-right">
                Responde con honestidad y según tu experiencia real, no según la imagen que te gustaría sostener.
              </p>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6 animate-[fadeIn_0.35s_ease-out]">
            <div className="text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#CC5833] mb-3">Resultado de tu proceso</p>
              <h2 className="font-heading text-3xl md:text-4xl text-[#1A1A1A]">Tu resultado</h2>
            </div>

            {(isSavingCompletion || completionError) && (
              <div className={`rounded-2xl border px-4 py-3 text-sm ${completionError ? 'border-[#CC5833]/25 bg-[#FFF3EE] text-[#7A3A25]' : 'border-[#2E4036]/15 bg-[#F4F7F5] text-[#2E4036]'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p>
                    {isSavingCompletion
                      ? 'Guardando tu resultado...'
                      : completionError}
                  </p>
                  {completionError && (
                    <button
                      onClick={retrySaveCompletedAssessment}
                      className="rounded-full bg-[#2E4036] px-4 py-2 text-xs font-bold text-white"
                    >
                      Reintentar guardado
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className={`rounded-[2.25rem] border p-6 md:p-8 shadow-sm ${result.isAlert ? 'bg-[linear-gradient(135deg,#FFF3EE_0%,#FFF9F6_55%,#FFFFFF_100%)] border-[#CC5833]/20' : 'bg-[linear-gradient(135deg,#F5F7F3_0%,#FCFCFA_60%,#FFFFFF_100%)] border-[#2E4036]/12'}`}>
              <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className={`h-14 w-14 rounded-[1.35rem] flex items-center justify-center shrink-0 ${result.isAlert ? 'bg-[#CC5833] text-white' : 'bg-[#2E4036] text-white'}`}>
                    {result.isAlert ? <AlertTriangle size={26} /> : <HeartHandshake size={26} />}
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl md:text-3xl text-[#1A1A1A]">
                      {result.isAlert ? 'Resultado de alerta' : 'Resultado orientativo'}
                    </h3>
                    <p className="text-sm md:text-base text-[#1A1A1A]/72 leading-relaxed mt-2 max-w-2xl">
                      {result.isAlert
                        ? 'Estas respuestas sugieren que conviene mirar tu situación con honestidad y abrir espacio para recibir orientación.'
                        : 'No superaste el umbral de alerta de esta lectura. El resultado es orientativo y, si lo deseas, tambi&eacute;n podemos ayudarte a mirar tu situaci&oacute;n con m&aacute;s claridad.'}
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.9rem] bg-white/80 border border-white/70 px-6 py-5 min-w-[220px] text-center shadow-sm">
                  <p className="font-heading text-5xl md:text-6xl text-[#1A1A1A]">{result.yesCount}</p>
                  <p className="text-sm uppercase tracking-[0.18em] text-[#2E4036] mt-2">respuestas afirmativas</p>
                  <p className="text-sm text-gray-500 mt-1">de {result.totalQuestions} preguntas</p>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] bg-white/88 border border-white/70 p-5 md:p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#2E4036] mb-3">Conteo final</p>
                <p className="font-heading text-2xl md:text-3xl text-[#1A1A1A]">
                  Respuestas afirmativas: {result.yesCount} de {result.totalQuestions}
                </p>

                <div className="mt-5 space-y-4 text-sm md:text-base leading-relaxed">
                  {result.isAlert ? (
                    <p className="text-[#7A3A25] font-medium">
                      {ALERT_MESSAGE}
                    </p>
                  ) : (
                    <p className="text-[#2E4036]/80">
                      No superó el umbral de alerta de este test. Es un resultado orientativo, prudente y no concluyente; si desea orientación, podemos acompañarle.
                    </p>
                  )}

                  <p className="font-serif italic text-lg text-[#1A1A1A]">
                    {CLOSING_MESSAGE}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
              <button
                onClick={handleWhatsApp}
                className="flex-1 bg-[#25D366] text-white px-6 py-4 rounded-full font-bold btn-magnetic shadow-[0_0_20px_rgba(37,211,102,0.3)]"
              >
                Recibir orientación por WhatsApp
              </button>
              <button
                onClick={goToEnneagram}
                className="flex-1 px-6 py-4 rounded-full border border-[#2E4036]/20 text-[#2E4036] font-bold hover:bg-white transition-colors"
              >
                Hacer también el Mapa de Eneatipo
              </button>
              <button
                onClick={handleRestart}
                className="flex-1 px-6 py-4 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors"
              >
                Volver a empezar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
