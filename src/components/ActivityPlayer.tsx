import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import {
  EMOTION_QUESTIONS,
  IMAGE_WORD_QUESTIONS,
  INTRUDER_QUESTIONS,
  MATH_QUESTIONS,
  MEMORY_SYMBOLS,
  POSITIVE_MESSAGES,
  RHYME_QUESTIONS,
  SEQUENCE_QUESTIONS,
  SPELL_WORD_QUESTIONS,
  SYLLABLE_QUESTIONS,
  SYNONYM_QUESTIONS,
} from '../data/activitiesData';
import { AccessibilitySettings, ActivityMeta } from '../types';
import { playGentleChime } from '../utils/sound';
import { speakText, stopSpeaking } from '../utils/speech';

interface ActivityPlayerProps {
  activity: ActivityMeta;
  a11y: AccessibilitySettings;
  onComplete: (score: number, maxScore: number, xpEarned: number) => void;
  onNextActivity?: () => void;
  onOpenNotebook: () => void;
  onBack: () => void;
}

interface MemoryCard {
  uid: number;
  id: string;
  emoji: string;
  label: string;
  flipped: boolean;
  matched: boolean;
}

export const ActivityPlayer: React.FC<ActivityPlayerProps> = ({
  activity,
  a11y,
  onComplete,
  onNextActivity,
  onOpenNotebook,
  onBack,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'try-again' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isFinished, setIsFinished] = useState(false);

  // Activity 4: Spell Word state
  const [typedLetters, setTypedLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<
    { char: string; used: boolean; idx: number }[]
  >([]);

  // Activity 6: Memory Visual state
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [selectedMemoryIndices, setSelectedMemoryIndices] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  const totalQuestions = useMemo(() => {
    switch (activity.id) {
      case 'caca-silabas':
        return SYLLABLE_QUESTIONS.length;
      case 'rimas-magicas':
        return RHYME_QUESTIONS.length;
      case 'associacao-imagem-palavra':
        return IMAGE_WORD_QUESTIONS.length;
      case 'descobre-palavra':
        return SPELL_WORD_QUESTIONS.length;
      case 'sinonimos-antonimos':
        return SYNONYM_QUESTIONS.length;
      case 'memoria-visual':
        return MEMORY_SYMBOLS.length;
      case 'caca-intruso':
        return INTRUDER_QUESTIONS.length;
      case 'problemas-matematicos':
        return MATH_QUESTIONS.length;
      case 'sequencias-logicas':
        return SEQUENCE_QUESTIONS.length;
      case 'emocoes-expressoes':
        return EMOTION_QUESTIONS.length;
      default:
        return 4;
    }
  }, [activity.id]);

  // Initialize Activity 4 letters when stepIndex changes
  useEffect(() => {
    if (activity.id === 'descobre-palavra' && !isFinished) {
      const currentQ = SPELL_WORD_QUESTIONS[stepIndex];
      if (currentQ) {
        const chars = currentQ.word.split('');
        const shuffled = [...chars]
          .sort(() => Math.random() - 0.5)
          .map((char, idx) => ({ char, used: false, idx }));
        setAvailableLetters(shuffled);
        setTypedLetters([]);
      }
    }
  }, [activity.id, stepIndex, isFinished]);

  // Initialize Activity 6 memory cards
  const initMemoryGame = () => {
    const doubled = [...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((item, idx) => ({
        uid: idx,
        id: item.id,
        emoji: item.emoji,
        label: item.label,
        flipped: false,
        matched: false,
      }));
    setMemoryCards(doubled);
    setSelectedMemoryIndices([]);
    setMemoryMoves(0);
    setScore(0);
    setIsFinished(false);
    setFeedback({ type: null, message: '' });
  };

  useEffect(() => {
    if (activity.id === 'memoria-visual') {
      initMemoryGame();
    }
    return () => {
      stopSpeaking();
    };
  }, [activity.id]);

  // Auto-read instructions if voiceEnabled is on
  useEffect(() => {
    if (a11y.voiceEnabled) {
      speakText(
        `${activity.title}. ${activity.shortDesc}`,
        a11y.slowSpeech
      );
    }
  }, [activity.id, a11y.voiceEnabled, a11y.slowSpeech]);

  const handleRestart = () => {
    stopSpeaking();
    setStepIndex(0);
    setScore(0);
    setFeedback({ type: null, message: '' });
    setIsFinished(false);
    if (activity.id === 'memoria-visual') {
      initMemoryGame();
    }
  };

  const finishActivity = (finalScore: number) => {
    setIsFinished(true);
    onComplete(finalScore, totalQuestions, activity.xpReward);
    if (a11y.soundEffects && !a11y.focusMode) {
      playGentleChime('complete');
    }
    if (a11y.voiceEnabled) {
      speakText(
        `Parabéns! Concluíste ${activity.title} e ganhaste ${activity.xpReward} pontos de experiência.`,
        a11y.slowSpeech
      );
    }
  };

  const handleOptionAnswer = (isCorrect: boolean) => {
    if (feedback.type === 'success') return;

    if (isCorrect) {
      const nextScore = score + 1;
      setScore(nextScore);
      const praise =
        POSITIVE_MESSAGES[stepIndex % POSITIVE_MESSAGES.length];
      setFeedback({ type: 'success', message: praise });
      if (a11y.soundEffects && !a11y.focusMode) {
        playGentleChime('step');
      }
      if (a11y.voiceEnabled) {
        speakText(praise, a11y.slowSpeech);
      }

      setTimeout(() => {
        setFeedback({ type: null, message: '' });
        if (stepIndex + 1 < totalQuestions) {
          setStepIndex((prev) => prev + 1);
        } else {
          finishActivity(nextScore);
        }
      }, 1100);
    } else {
      const gentleMsg =
        'Quase! Observa com calma e experimenta outra opção.';
      setFeedback({ type: 'try-again', message: gentleMsg });
      if (a11y.voiceEnabled) {
        speakText(gentleMsg, a11y.slowSpeech);
      }
    }
  };

  // Activity 4: Letter click & Hint
  const handleSelectLetter = (itemIdx: number) => {
    if (feedback.type === 'success') return;
    const currentQ = SPELL_WORD_QUESTIONS[stepIndex];
    const chosen = availableLetters[itemIdx];
    if (!chosen || chosen.used) return;

    const nextTyped = [...typedLetters, chosen.char];
    const updatedAvail = availableLetters.map((item, i) =>
      i === itemIdx ? { ...item, used: true } : item
    );
    setTypedLetters(nextTyped);
    setAvailableLetters(updatedAvail);

    if (nextTyped.length === currentQ.word.length) {
      if (nextTyped.join('') === currentQ.word) {
        handleOptionAnswer(true);
      } else {
        setFeedback({
          type: 'try-again',
          message: 'Quase! Vamos organizar as letras novamente com calma.',
        });
        setTimeout(() => {
          setTypedLetters([]);
          setAvailableLetters(
            availableLetters.map((item) => ({ ...item, used: false }))
          );
          setFeedback({ type: null, message: '' });
        }, 1000);
      }
    }
  };

  const handleSpellHint = () => {
    const currentQ = SPELL_WORD_QUESTIONS[stepIndex];
    const nextPos = typedLetters.length;
    if (nextPos >= currentQ.word.length) return;
    const neededChar = currentQ.word[nextPos];
    const matchIdx = availableLetters.findIndex(
      (item) => !item.used && item.char === neededChar
    );
    if (matchIdx !== -1) {
      handleSelectLetter(matchIdx);
    }
  };

  // Activity 6: Memory Card click
  const handleMemoryCardClick = (idx: number) => {
    if (selectedMemoryIndices.length >= 2) return;
    const card = memoryCards[idx];
    if (!card || card.flipped || card.matched) return;

    const updated = memoryCards.map((c, i) =>
      i === idx ? { ...c, flipped: true } : c
    );
    setMemoryCards(updated);

    const nextSelected = [...selectedMemoryIndices, idx];
    setSelectedMemoryIndices(nextSelected);

    if (nextSelected.length === 2) {
      setMemoryMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextSelected;
      const firstCard = updated[firstIdx];
      const secondCard = updated[secondIdx];

      if (firstCard.id === secondCard.id) {
        const nextScore = score + 1;
        setScore(nextScore);
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, matched: true } : c
            )
          );
          setSelectedMemoryIndices([]);
          setFeedback({
            type: 'success',
            message: `Par encontrado: ${firstCard.label}!`,
          });
          if (nextScore === MEMORY_SYMBOLS.length) {
            setTimeout(() => {
              finishActivity(nextScore);
            }, 800);
          }
        }, 450);
      } else {
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, flipped: false } : c
            )
          );
          setSelectedMemoryIndices([]);
          setFeedback({
            type: 'try-again',
            message: 'Continua a procurar, estás a memorizar as posições!',
          });
        }, 900);
      }
    }
  };

  const progressPercent = Math.round(
    ((isFinished ? totalQuestions : stepIndex) / totalQuestions) * 100
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Top Activity Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar às Atividades
        </button>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenNotebook}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <BookMarked className="w-4 h-4 text-sky-700" />
            Caderno de Apoio
          </button>

          <button
            type="button"
            onClick={() =>
              speakText(
                `${activity.title}. ${activity.steps.join(' ')}`,
                a11y.slowSpeech
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-sky-900 bg-sky-100 hover:bg-sky-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            Ouvir Instruções
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            Jogar novamente
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="surface-card bg-white border border-slate-200 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div>
            <span className="text-xs font-medium text-slate-500 text-muted-adaptive">
              Atividade {activity.number} · {activity.area}
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              {activity.title}
            </h1>
          </div>
          <div className="text-right font-mono-tabular">
            <span className="text-sm font-semibold text-sky-700">
              {isFinished ? totalQuestions : stepIndex + 1} / {totalQuestions}
            </span>
            <p className="text-xs text-slate-500 text-muted-adaptive">
              +{activity.xpReward} XP
            </p>
          </div>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main 2-Zone Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Top Zone: Interactive Stage (8 cols) */}
        <div className="lg:col-span-8 surface-card bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 min-h-[380px] flex flex-col justify-between">
          {isFinished ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Missão Concluída!
              </h2>
              <p className="text-slate-600 text-muted-adaptive max-w-md mx-auto mb-6">
                Completaste <strong>{activity.title}</strong> com{' '}
                <span className="font-mono-tabular font-semibold">
                  {score}
                </span>{' '}
                de{' '}
                <span className="font-mono-tabular font-semibold">
                  {totalQuestions}
                </span>{' '}
                acertos e ganhaste{' '}
                <span className="font-mono-tabular font-semibold text-sky-700">
                  +{activity.xpReward} XP
                </span>
                !
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {onNextActivity && (
                  <button
                    type="button"
                    onClick={onNextActivity}
                    className="btn-primary-adaptive inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Próxima Atividade
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Jogar novamente
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  Todas as Atividades
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Render specific activity stage */}
              {activity.id === 'caca-silabas' && (() => {
                const q = SYLLABLE_QUESTIONS[stepIndex];
                return (
                  <div className="text-center">
                    <div className="text-6xl mb-4" aria-hidden="true">
                      {q.emoji}
                    </div>
                    <p className="text-sm text-slate-500 text-muted-adaptive mb-3">
                      Escolhe a sílaba que completa a palavra:
                    </p>
                    <div className="text-3xl sm:text-4xl font-bold tracking-wider text-slate-900 mb-8 font-mono-tabular">
                      {q.prefix}
                      <span className="inline-block min-w-[3.5rem] px-3 py-1 mx-1 border-2 border-dashed border-sky-500 rounded-xl bg-sky-50 text-sky-700">
                        {feedback.type === 'success' ? q.correct : '?'}
                      </span>
                      {q.suffix}
                    </div>
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleOptionAnswer(opt === q.correct)}
                          className="py-4 px-5 text-xl font-bold bg-slate-50 hover:bg-sky-50 text-slate-900 border-2 border-slate-200 hover:border-sky-500 rounded-2xl transition-all cursor-pointer font-mono-tabular"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {activity.id === 'rimas-magicas' && (() => {
                const q = RHYME_QUESTIONS[stepIndex];
                return (
                  <div className="text-center">
                    <div className="text-6xl mb-3" aria-hidden="true">
                      {q.emoji}
                    </div>
                    <p className="text-sm text-slate-500 text-muted-adaptive mb-2">
                      Qual destas palavras rima com:
                    </p>
                    <div className="text-3xl font-bold text-sky-700 mb-8">
                      {q.target}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleOptionAnswer(opt === q.correct)}
                          className="py-4 px-5 text-lg font-bold bg-slate-50 hover:bg-sky-50 text-slate-900 border-2 border-slate-200 hover:border-sky-500 rounded-2xl transition-all cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {activity.id === 'associacao-imagem-palavra' && (() => {
                const q = IMAGE_WORD_QUESTIONS[stepIndex];
                return (
                  <div className="text-center">
                    <div className="text-7xl mb-4" aria-hidden="true">
                      {q.emoji}
                    </div>
                    <p className="text-base text-slate-600 text-muted-adaptive mb-6 max-w-md mx-auto">
                      {q.hint}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleOptionAnswer(opt === q.correct)}
                          className="py-4 px-5 text-lg font-bold bg-slate-50 hover:bg-sky-50 text-slate-900 border-2 border-slate-200 hover:border-sky-500 rounded-2xl transition-all cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {activity.id === 'descobre-palavra' && (() => {
                const q = SPELL_WORD_QUESTIONS[stepIndex];
                return (
                  <div className="text-center">
                    <div className="text-6xl mb-3" aria-hidden="true">
                      {q.emoji}
                    </div>
                    <p className="text-base font-medium text-slate-700 mb-6">
                      Pista: {q.clue}
                    </p>

                    {/* Letter slots */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
                      {q.word.split('').map((_, idx) => (
                        <div
                          key={idx}
                          className="w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center text-2xl font-bold font-mono-tabular rounded-xl border-2 border-slate-300 bg-slate-50 text-slate-900"
                        >
                          {typedLetters[idx] || ''}
                        </div>
                      ))}
                    </div>

                    {/* Available letter tiles */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                      {availableLetters.map((item, idx) => (
                        <button
                          key={item.idx}
                          type="button"
                          disabled={item.used}
                          onClick={() => handleSelectLetter(idx)}
                          className={`w-12 h-12 sm:w-14 sm:h-14 text-xl font-bold font-mono-tabular rounded-xl border-2 transition-all ${
                            item.used
                              ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-default'
                              : 'bg-white hover:bg-sky-50 text-slate-900 border-slate-300 hover:border-sky-500 cursor-pointer'
                          }`}
                        >
                          {item.char}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleSpellHint}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Pedir Dica (Próxima Letra)
                    </button>
                  </div>
                );
              })()}

              {activity.id === 'sinonimos-antonimos' && (() => {
                const q = SYNONYM_QUESTIONS[stepIndex];
                return (
                  <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 mb-2">
                      Desafio de {q.mode}
                    </p>
                    <h3 className="text-3xl font-bold text-slate-900 mb-3">
                      {q.word}
                    </h3>
                    <p className="text-base text-slate-600 text-muted-adaptive max-w-md mx-auto mb-8">
                      “{q.context}”
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleOptionAnswer(opt === q.correct)}
                          className="py-4 px-5 text-lg font-bold bg-slate-50 hover:bg-sky-50 text-slate-900 border-2 border-slate-200 hover:border-sky-500 rounded-2xl transition-all cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {activity.id === 'memoria-visual' && (
                <div>
                  <div className="flex items-center justify-between text-sm text-slate-600 text-muted-adaptive mb-4">
                    <span>Encontra os 6 pares de símbolos</span>
                    <span className="font-mono-tabular">
                      Jogadas: {memoryMoves}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
                    {memoryCards.map((card, idx) => {
                      const isRevealed = card.flipped || card.matched;
                      return (
                        <button
                          key={card.uid}
                          type="button"
                          onClick={() => handleMemoryCardClick(idx)}
                          aria-label={
                            isRevealed ? card.label : `Carta ${idx + 1}`
                          }
                          className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                            card.matched
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                              : isRevealed
                              ? 'bg-sky-50 border-sky-500 text-slate-900'
                              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-500'
                          }`}
                        >
                          {isRevealed ? (
                            <>
                              <span className="text-3xl sm:text-4xl mb-1">
                                {card.emoji}
                              </span>
                              <span className="text-xs font-semibold">
                                {card.label}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold">?</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activity.id === 'caca-intruso' && (() => {
                const q = INTRUDER_QUESTIONS[stepIndex];
                return (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-slate-900 mb-6">
                      {q.categoryHint}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
                      {q.items.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => handleOptionAnswer(item.isIntruder)}
                          className="p-5 bg-slate-50 hover:bg-sky-50 border-2 border-slate-200 hover:border-sky-500 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <span className="text-5xl" aria-hidden="true">
                            {item.emoji}
                          </span>
                          <span className="text-base font-bold text-slate-900">
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {activity.id === 'problemas-matematicos' && (() => {
                const q = MATH_QUESTIONS[stepIndex];
                return (
                  <div className="text-center">
                    <p className="text-lg font-medium text-slate-900 max-w-xl mx-auto mb-6">
                      {q.story}
                    </p>

                    {/* Visual Concrete Representation (NEE PDF recommendation) */}
                    <div className="surface-subtle bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-8 inline-flex flex-wrap items-center justify-center gap-4">
                      <div className="flex flex-wrap gap-1.5 text-3xl">
                        {q.visualGroupA.map((icon, i) => (
                          <span key={i}>{icon}</span>
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-sky-700 font-mono-tabular px-2">
                        {q.operator}
                      </span>
                      <div className="flex flex-wrap gap-1.5 text-3xl">
                        {q.visualGroupB.map((icon, i) => (
                          <span
                            key={i}
                            className={
                              q.operator === '-' ? 'opacity-45 line-through' : ''
                            }
                          >
                            {icon}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleOptionAnswer(opt === q.correct)}
                          className="py-4 px-5 text-2xl font-bold font-mono-tabular bg-slate-50 hover:bg-sky-50 text-slate-900 border-2 border-slate-200 hover:border-sky-500 rounded-2xl transition-all cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {activity.id === 'sequencias-logicas' && (() => {
                const q = SEQUENCE_QUESTIONS[stepIndex];
                return (
                  <div className="text-center">
                    <p className="text-base font-semibold text-slate-700 mb-6">
                      {q.ruleHint}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                      {q.sequence.map((item, idx) => (
                        <div
                          key={idx}
                          className={`px-4 py-3 rounded-xl font-bold text-xl font-mono-tabular border-2 ${
                            item === '?'
                              ? 'border-dashed border-sky-500 bg-sky-50 text-sky-700 min-w-[3.5rem]'
                              : 'border-slate-200 bg-slate-50 text-slate-900'
                          }`}
                        >
                          {item === '?' && feedback.type === 'success'
                            ? q.correct
                            : item}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleOptionAnswer(opt === q.correct)}
                          className="py-4 px-4 text-lg font-bold font-mono-tabular bg-slate-50 hover:bg-sky-50 text-slate-900 border-2 border-slate-200 hover:border-sky-500 rounded-2xl transition-all cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {activity.id === 'emocoes-expressoes' && (() => {
                const q = EMOTION_QUESTIONS[stepIndex];
                return (
                  <div className="text-center">
                    <div className="text-6xl mb-2" aria-hidden="true">
                      {q.emoji}
                    </div>
                    <p className="text-sm font-semibold text-sky-700 mb-3">
                      Emoção: {q.emotionName}
                    </p>
                    <p className="text-lg font-medium text-slate-900 max-w-xl mx-auto mb-2">
                      {q.situation}
                    </p>
                    <p className="text-sm text-slate-600 text-muted-adaptive mb-6">
                      {q.question}
                    </p>
                    <div className="flex flex-col gap-3 max-w-xl mx-auto text-left">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleOptionAnswer(opt === q.correct)}
                          className="p-4 text-base font-medium bg-slate-50 hover:bg-sky-50 text-slate-900 border-2 border-slate-200 hover:border-sky-500 rounded-2xl transition-all cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Immediate Positive Feedback Banner */}
              {feedback.type && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`mt-6 p-4 rounded-xl text-center font-semibold text-sm ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}
                >
                  {feedback.message}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right / Bottom Zone: Step-by-Step Guide & NEE Support Deck (4 cols) */}
        <aside className="lg:col-span-4 surface-card bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3">
            Passo a Passo
          </h2>
          <ol className="space-y-3 text-sm text-slate-700 text-muted-adaptive mb-6">
            {activity.steps.map((step, i) => (
              <li
                key={i}
                className="surface-subtle bg-slate-50 border border-slate-200/80 rounded-xl p-3"
              >
                {step}
              </li>
            ))}
          </ol>

          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 text-muted-adaptive mb-1">
              Apoio Pedagógico Inclusivo
            </p>
            <p className="text-xs text-slate-600 text-muted-adaptive leading-relaxed">
              {activity.neeSupportNote}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
