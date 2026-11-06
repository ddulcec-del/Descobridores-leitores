import React, { useEffect, useState } from 'react';
import {
  BookMarked,
  CheckCircle2,
  Compass,
  Contrast,
  EyeOff,
  Music,
  Play,
  Ruler,
  Type,
  Volume2,
  VolumeX,
  Wind,
} from 'lucide-react';
import { ActivityPlayer } from './components/ActivityPlayer';
import { CalmBreakModal } from './components/CalmBreakModal';
import { CertificatesAndMedals } from './components/CertificatesAndMedals';
import { SupportNotebookModal } from './components/SupportNotebookModal';
import { TeacherArea } from './components/TeacherArea';
import {
  ACTIVITIES_META,
  AREAS,
  DAILY_MISSIONS,
  getLevelInfo,
  MEDALS,
} from './data/activitiesData';
import {
  AccessibilitySettings,
  ActivityMeta,
  ActivitySession,
  AreaKey,
  NavTab,
  StudentProfile,
} from './types';
import { speakText } from './utils/speech';
import {
  DEFAULT_PROFILE,
  INITIAL_SESSIONS,
  loadA11y,
  loadClaimedMissions,
  loadNotes,
  loadProfile,
  loadSessions,
  saveA11y,
  saveClaimedMissions,
  saveNotes,
  saveProfile,
  saveSessions,
} from './utils/storage';

import avatarCaravela from './assets/images/avatar_caravela_1793907459922.jpg';
import avatarFarol from './assets/images/avatar_farol_1793907460801.jpg';
import mascotNavegador from './assets/images/mascot_navegador_1793907459309.jpg';
import heroPacoArcos from './assets/images/hero_paco_arcos_1793907459731.jpg';

const AVATAR_OPTIONS: {
  id: StudentProfile['avatarId'];
  label: string;
  src: string;
}[] = [
  {
    id: 'caravela',
    label: 'Astrolábio e Caravela',
    src: avatarCaravela,
  },
  {
    id: 'farol',
    label: 'Farol do Bugio',
    src: avatarFarol,
  },
  {
    id: 'mascote',
    label: 'Coruja Navegadora',
    src: mascotNavegador,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('inicio');
  const [profile, setProfile] = useState<StudentProfile>(() => loadProfile());
  const [sessions, setSessions] = useState<ActivitySession[]>(() =>
    loadSessions()
  );
  const [a11y, setA11y] = useState<AccessibilitySettings>(() => loadA11y());
  const [claimedMissions, setClaimedMissions] = useState<string[]>(() =>
    loadClaimedMissions()
  );
  const [notes, setNotes] = useState<string[]>(() => loadNotes());

  const [showA11yBar, setShowA11yBar] = useState(false);
  const [showCalmBreak, setShowCalmBreak] = useState(false);
  const [showNotebook, setShowNotebook] = useState(false);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<
    'Todas' | AreaKey
  >('Todas');
  const [activeActivity, setActiveActivity] = useState<ActivityMeta | null>(
    null
  );
  const [rulerY, setRulerY] = useState<number>(240);
  const [heroImgError, setHeroImgError] = useState(false);

  // Sync accessibility classes to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('a11y-large-text', a11y.largeText);
    root.classList.toggle('a11y-high-contrast', a11y.highContrast);
    root.classList.toggle('a11y-focus-mode', a11y.focusMode);
    saveA11y(a11y);
  }, [a11y]);

  // Reading ruler pointer tracking
  useEffect(() => {
    if (!a11y.readingRuler) return;
    const handleMove = (e: PointerEvent) => {
      setRulerY(e.clientY);
    };
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [a11y.readingRuler]);

  const updateProfile = (next: StudentProfile) => {
    setProfile(next);
    saveProfile(next);
  };

  const handleActivityComplete = (
    score: number,
    maxScore: number,
    xpEarned: number
  ) => {
    if (!activeActivity) return;
    const newSession: ActivitySession = {
      id: `sess-${Date.now()}`,
      activityId: activeActivity.id,
      activityTitle: activeActivity.title,
      area: activeActivity.area,
      score,
      maxScore,
      xpEarned,
      timestamp: new Date().toISOString(),
      studentName: profile.name,
      grade: `${profile.grade} · ${profile.className}`,
    };

    const nextSessions = [newSession, ...sessions];
    setSessions(nextSessions);
    saveSessions(nextSessions);

    const nextProfile = { ...profile, xp: profile.xp + xpEarned };
    updateProfile(nextProfile);
  };

  const handleClaimMission = (missionId: string, xpReward: number) => {
    if (claimedMissions.includes(missionId)) return;
    const nextClaimed = [...claimedMissions, missionId];
    setClaimedMissions(nextClaimed);
    saveClaimedMissions(nextClaimed);
    updateProfile({ ...profile, xp: profile.xp + xpReward });
  };

  const handleResetDemoData = () => {
    setProfile(DEFAULT_PROFILE);
    saveProfile(DEFAULT_PROFILE);
    setSessions(INITIAL_SESSIONS);
    saveSessions(INITIAL_SESSIONS);
    setClaimedMissions([]);
    saveClaimedMissions([]);
  };

  const levelInfo = getLevelInfo(profile.xp);
  const unlockedMedalsCount = MEDALS.filter((m) =>
    m.checkUnlocked(sessions, profile.xp)
  ).length;

  const currentAvatarSrc =
    AVATAR_OPTIONS.find((a) => a.id === profile.avatarId)?.src ||
    AVATAR_OPTIONS[0].src;

  const filteredActivities =
    selectedAreaFilter === 'Todas'
      ? ACTIVITIES_META
      : ACTIVITIES_META.filter((a) => a.area === selectedAreaFilter);

  const toggleA11y = (key: keyof AccessibilitySettings) => {
    setA11y((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Optional Dyslexia Reading Ruler */}
      {a11y.readingRuler && (
        <div
          aria-hidden="true"
          className="fixed left-0 right-0 h-10 bg-amber-300/25 border-y-2 border-amber-500/70 pointer-events-none z-50 transition-transform duration-75"
          style={{ top: `${Math.max(0, rulerY - 20)}px` }}
        />
      )}

      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="surface-card bg-white border-b border-slate-200 sticky top-0 z-40 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => {
              setActiveActivity(null);
              setActiveTab('inicio');
            }}
            className="inline-flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-sky-600 shrink-0" aria-hidden="true" />
            <span>Descobridores de Paço de Arcos</span>
          </button>

          {/* Zone 2: 4 Single-line Navigation Links */}
          <nav
            aria-label="Navegação principal"
            className="hidden md:flex items-center gap-6 text-sm font-semibold"
          >
            {(
              [
                { id: 'inicio', label: 'Início' },
                { id: 'atividades', label: 'Atividades' },
                { id: 'conquistas', label: 'Conquistas' },
                { id: 'professor', label: 'Área do Professor' },
              ] as { id: NavTab; label: string }[]
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveActivity(null);
                  setActiveTab(item.id);
                }}
                className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === item.id
                    ? 'border-sky-600 text-sky-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action (Accessibility Controls) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowA11yBar((s) => !s)}
              aria-expanded={showA11yBar}
              className="btn-primary-adaptive px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Acessibilidade
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around border-t border-slate-100 px-2 py-2 text-xs font-semibold">
          {(
            [
              { id: 'inicio', label: 'Início' },
              { id: 'atividades', label: 'Atividades' },
              { id: 'conquistas', label: 'Conquistas' },
              { id: 'professor', label: 'Professor' },
            ] as { id: NavTab; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveActivity(null);
                setActiveTab(item.id);
              }}
              className={`px-2 py-1 rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === item.id
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Collapsible Inclusive Accessibility Toolbar (Etapa 4) */}
        {showA11yBar && (
          <div className="surface-subtle bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-600 text-muted-adaptive">
                Ferramentas de Inclusão (Dislexia · PHDA · PEA Nível 1):
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleA11y('voiceEnabled')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    a11y.voiceEnabled
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {a11y.voiceEnabled ? (
                    <Volume2 className="w-3.5 h-3.5" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5" />
                  )}
                  Leitor por Voz
                </button>

                <button
                  type="button"
                  onClick={() => toggleA11y('slowSpeech')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    a11y.slowSpeech
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Voz Pausada
                </button>

                <button
                  type="button"
                  onClick={() => toggleA11y('largeText')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    a11y.largeText
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  Aumentar Letra
                </button>

                <button
                  type="button"
                  onClick={() => toggleA11y('highContrast')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    a11y.highContrast
                      ? 'bg-amber-400 text-slate-950 border-amber-400'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Contrast className="w-3.5 h-3.5" />
                  Alto Contraste
                </button>

                <button
                  type="button"
                  onClick={() => toggleA11y('focusMode')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    a11y.focusMode
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  Modo Foco
                </button>

                <button
                  type="button"
                  onClick={() => toggleA11y('soundEffects')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    a11y.soundEffects
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  Sons Suaves
                </button>

                <button
                  type="button"
                  onClick={() => toggleA11y('readingRuler')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    a11y.readingRuler
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Régua de Leitura
                </button>

                <button
                  type="button"
                  onClick={() => setShowNotebook(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border bg-white text-slate-700 border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <BookMarked className="w-3.5 h-3.5 text-sky-700" />
                  Caderno de Apoio
                </button>

                <button
                  type="button"
                  onClick={() => setShowCalmBreak(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Wind className="w-3.5 h-3.5 text-emerald-700" />
                  Pausa Calma
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeActivity ? (
          <ActivityPlayer
            activity={activeActivity}
            a11y={a11y}
            onComplete={handleActivityComplete}
            onNextActivity={(() => {
              const idx = ACTIVITIES_META.findIndex(
                (a) => a.id === activeActivity.id
              );
              if (idx !== -1 && idx + 1 < ACTIVITIES_META.length) {
                return () => setActiveActivity(ACTIVITIES_META[idx + 1]);
              }
              return undefined;
            })()}
            onOpenNotebook={() => setShowNotebook(true)}
            onBack={() => setActiveActivity(null)}
          />
        ) : activeTab === 'inicio' ? (
          <div className="space-y-8">
            {/* 2-Column Hero Split (items-stretch) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div
                className={`${
                  a11y.focusMode ? 'lg:col-span-12' : 'lg:col-span-7'
                } surface-card bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={currentAvatarSrc}
                      alt={`Avatar de ${profile.name}`}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-medium text-slate-500 text-muted-adaptive">
                        Agrupamento de Escolas de Paço de Arcos · {profile.grade}
                      </p>
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        Olá, {profile.name}!
                      </h1>
                    </div>
                  </div>

                  <p className="text-base text-slate-600 text-muted-adaptive max-w-xl mb-6">
                    Bem-vindo à Grande Aventura dos Descobridores de Paço de
                    Arcos. Escolhe uma missão, avança ao teu ritmo e conquista
                    novas medalhas.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Level & XP Progress */}
                  <div className="surface-subtle bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className="text-slate-800">
                        Nível {levelInfo.level} · {levelInfo.title}
                      </span>
                      <span className="font-mono-tabular text-sky-700">
                        {profile.xp} / {levelInfo.maxXp} XP
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-600 rounded-full transition-all duration-300"
                        style={{ width: `${levelInfo.percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('atividades')}
                      className="btn-primary-adaptive inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Play className="w-4 h-4" />
                      Explorar as 10 Atividades
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        speakText(
                          `Olá ${profile.name}! Estás no nível ${levelInfo.level}, ${levelInfo.title}, com ${profile.xp} pontos de experiência.`,
                          a11y.slowSpeech
                        )
                      }
                      className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Volume2 className="w-4 h-4" />
                      Ouvir Resumo
                    </button>
                  </div>
                </div>
              </div>

              {/* Hero Illustration (Hidden in Focus Mode to reduce visual distractions) */}
              {!a11y.focusMode && (
                <div className="lg:col-span-5 surface-card bg-white border border-slate-200 rounded-2xl overflow-hidden min-h-[260px] flex items-center justify-center">
                  {!heroImgError ? (
                    <img
                      src={heroPacoArcos}
                      alt="Ilustração da costa de Paço de Arcos com caravela e Farol do Bugio"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="p-8 text-center">
                      <Compass className="w-12 h-12 text-sky-600 mx-auto mb-2" />
                      <p className="font-display font-bold text-slate-800">
                        Costa de Paço de Arcos
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Full-Width 4-Column KPI Strip */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="surface-card bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-xs font-medium text-slate-500 text-muted-adaptive">
                  Pontos de Experiência
                </p>
                <p className="text-2xl font-bold text-sky-700 font-mono-tabular mt-1">
                  {profile.xp} XP
                </p>
              </div>

              <div className="surface-card bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-xs font-medium text-slate-500 text-muted-adaptive">
                  Nível Atual
                </p>
                <p className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1">
                  Nível {levelInfo.level}
                </p>
              </div>

              <div className="surface-card bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-xs font-medium text-slate-500 text-muted-adaptive">
                  Atividades Concluídas
                </p>
                <p className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1">
                  {sessions.length}
                </p>
              </div>

              <div className="surface-card bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-xs font-medium text-slate-500 text-muted-adaptive">
                  Medalhas Locais
                </p>
                <p className="text-2xl font-bold text-emerald-700 font-mono-tabular mt-1">
                  {unlockedMedalsCount} / {MEDALS.length}
                </p>
              </div>
            </section>

            {/* Daily Missions & Mascot Guide + Student Profile */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Daily Missions */}
              <div className="lg:col-span-7 surface-card bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-5">
                  {!a11y.focusMode && (
                    <img
                      src={mascotNavegador}
                      alt="Mascote Coruja Navegadora"
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Missões Diárias do Navegador
                    </h2>
                    <p className="text-xs text-slate-600 text-muted-adaptive">
                      Completa pequenas metas para ganhar pontos XP extra.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {DAILY_MISSIONS.map((mission) => {
                    const matchingCount = mission.targetArea
                      ? sessions.filter((s) => s.area === mission.targetArea)
                          .length
                      : sessions.length;
                    const isCompleted = matchingCount >= mission.targetCount;
                    const isClaimed = claimedMissions.includes(mission.id);

                    return (
                      <div
                        key={mission.id}
                        className="surface-subtle bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {mission.title}
                          </p>
                          <p className="text-xs text-slate-600 text-muted-adaptive">
                            {mission.description} ·{' '}
                            <span className="font-mono-tabular font-semibold">
                              +{mission.xpReward} XP
                            </span>
                          </p>
                        </div>

                        {isClaimed ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="w-4 h-4" />
                            Recompensa Recebida
                          </span>
                        ) : isCompleted ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleClaimMission(mission.id, mission.xpReward)
                            }
                            className="btn-primary-adaptive px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
                          >
                            Receber +{mission.xpReward} XP
                          </button>
                        ) : (
                          <span className="text-xs font-mono-tabular font-semibold text-slate-500 text-muted-adaptive">
                            {Math.min(matchingCount, mission.targetCount)} /{' '}
                            {mission.targetCount}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Student Profile & Avatar Selector */}
              <div className="lg:col-span-5 surface-card bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Perfil e Avatar do Aluno
                </h2>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="student-name"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Nome do Aluno
                    </label>
                    <input
                      id="student-name"
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        updateProfile({ ...profile, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="student-grade"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Ano Escolar
                      </label>
                      <select
                        id="student-grade"
                        value={profile.grade}
                        onChange={(e) =>
                          updateProfile({
                            ...profile,
                            grade: e.target.value as StudentProfile['grade'],
                          })
                        }
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-600"
                      >
                        <option value="4.º Ano">4.º Ano</option>
                        <option value="5.º Ano">5.º Ano</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="student-class"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Turma
                      </label>
                      <input
                        id="student-class"
                        type="text"
                        value={profile.className}
                        onChange={(e) =>
                          updateProfile({
                            ...profile,
                            className: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-600"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-slate-700 mb-2">
                      Escolher Avatar
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      {AVATAR_OPTIONS.map((av) => {
                        const selected = profile.avatarId === av.id;
                        return (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() =>
                              updateProfile({ ...profile, avatarId: av.id })
                            }
                            className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                              selected
                                ? 'border-sky-600 bg-sky-50'
                                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <img
                              src={av.src}
                              alt={av.label}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight">
                              {av.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : activeTab === 'atividades' ? (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium text-slate-500 text-muted-adaptive">
                4.º e 5.º Ano · Aprendizagem Passo a Passo
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                As 10 Atividades dos Descobridores
              </h1>
            </div>

            {/* Interactive Segmented Filter Bar */}
            <div
              role="tablist"
              aria-label="Filtrar atividades por área"
              className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-xl w-fit"
            >
              {(['Todas', ...AREAS] as const).map((area) => {
                const active = selectedAreaFilter === area;
                return (
                  <button
                    key={area}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedAreaFilter(area)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>

            {/* Activities Grid (Zero-Pill Discipline) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredActivities.map((act) => {
                const completedCount = sessions.filter(
                  (s) => s.activityId === act.id
                ).length;

                return (
                  <article
                    key={act.id}
                    className="surface-card bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 text-muted-adaptive mb-2">
                        <span>
                          {String(act.number).padStart(2, '0')}. {act.area}
                        </span>
                        <span className="font-mono-tabular font-semibold text-sky-700">
                          +{act.xpReward} XP
                        </span>
                      </div>

                      <h2 className="text-lg font-bold text-slate-900 mb-2">
                        {act.title}
                      </h2>

                      <p className="text-sm text-slate-600 text-muted-adaptive leading-relaxed mb-6">
                        {act.shortDesc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-500 text-muted-adaptive font-mono-tabular">
                        {completedCount > 0
                          ? `Concluída ${completedCount}x`
                          : 'Por explorar'}
                      </span>

                      <button
                        type="button"
                        onClick={() => setActiveActivity(act)}
                        className="btn-primary-adaptive inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Iniciar
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : activeTab === 'conquistas' ? (
          <CertificatesAndMedals profile={profile} sessions={sessions} />
        ) : (
          <TeacherArea
            profile={profile}
            sessions={sessions}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 py-6 px-4 sm:px-6 text-center text-xs text-slate-500 text-muted-adaptive no-print">
        Agrupamento de Escolas de Paço de Arcos · Plataforma Educativa Inclusiva
        (4.º e 5.º Ano)
      </footer>

      {showCalmBreak && (
        <CalmBreakModal onClose={() => setShowCalmBreak(false)} />
      )}

      {showNotebook && (
        <SupportNotebookModal
          slowSpeech={a11y.slowSpeech}
          notes={notes}
          onSaveNotes={(next) => {
            setNotes(next);
            saveNotes(next);
          }}
          onClose={() => setShowNotebook(false)}
        />
      )}
    </div>
  );
}
