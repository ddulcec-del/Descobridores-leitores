import React from 'react';
import {
  Award,
  BookOpen,
  Brain,
  Calculator,
  Compass,
  Eye,
  Heart,
  Lock,
  PenTool,
  Printer,
} from 'lucide-react';
import { getLevelInfo, LEVELS, MEDALS } from '../data/activitiesData';
import { ActivitySession, Medal, StudentProfile } from '../types';

interface CertificatesAndMedalsProps {
  profile: StudentProfile;
  sessions: ActivitySession[];
}

function renderMedalIcon(name: Medal['iconName']) {
  const cls = 'w-6 h-6';
  switch (name) {
    case 'compass':
      return <Compass className={cls} />;
    case 'book':
      return <BookOpen className={cls} />;
    case 'pen':
      return <PenTool className={cls} />;
    case 'calculator':
      return <Calculator className={cls} />;
    case 'eye':
      return <Eye className={cls} />;
    case 'brain':
      return <Brain className={cls} />;
    case 'heart':
      return <Heart className={cls} />;
    case 'award':
      return <Award className={cls} />;
  }
}

export const CertificatesAndMedals: React.FC<CertificatesAndMedalsProps> = ({
  profile,
  sessions,
}) => {
  const levelInfo = getLevelInfo(profile.xp);
  const todayStr = new Date().toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-8">
      {/* Level Progression */}
      <section className="surface-card bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 no-print">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-medium text-slate-500 text-muted-adaptive">
              Sistema de Experiência · A Grande Aventura
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Níveis e Medalhas dos Descobridores
            </h1>
          </div>
          <div className="text-right font-mono-tabular">
            <span className="text-2xl font-bold text-sky-700">
              {profile.xp} XP
            </span>
            <p className="text-xs text-slate-500 text-muted-adaptive">
              Nível {levelInfo.level} · {levelInfo.title}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {LEVELS.map((lvl) => {
            const reached = profile.xp >= lvl.minXp;
            const isCurrent = levelInfo.level === lvl.level;
            return (
              <div
                key={lvl.level}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-sky-50 border-sky-500 text-slate-900'
                    : reached
                    ? 'surface-subtle bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-white border-slate-200/70 text-slate-400'
                }`}
              >
                <p className="text-xs font-mono-tabular font-semibold mb-1">
                  Nível {lvl.level} · {lvl.minXp} XP
                </p>
                <p className="text-sm font-bold leading-snug">{lvl.title}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8 Local Medals Grid */}
      <section className="no-print">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Coleção de Medalhas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MEDALS.map((medal) => {
            const unlocked = medal.checkUnlocked(sessions, profile.xp);
            return (
              <div
                key={medal.id}
                className={`surface-card rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  unlocked
                    ? 'bg-white border-slate-200'
                    : 'bg-slate-50/70 border-slate-200/70 opacity-75'
                }`}
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      unlocked
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {unlocked ? (
                      renderMedalIcon(medal.iconName)
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {medal.title}
                  </h3>
                  <p className="text-xs text-slate-600 text-muted-adaptive leading-relaxed mb-4">
                    {medal.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-muted-adaptive">
                    {medal.criteriaText}
                  </span>
                  <span
                    className={`font-semibold ${
                      unlocked ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {unlocked ? 'Desbloqueada' : 'Por conquistar'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Virtual Printable Certificate */}
      <section className="surface-card bg-white border border-slate-200 rounded-2xl p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 no-print">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Certificado Virtual de Mérito
            </h2>
            <p className="text-sm text-slate-600 text-muted-adaptive">
              Reconhecimento oficial do teu esforço e dedicação nas atividades.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-primary-adaptive inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Printer className="w-4 h-4" />
            Imprimir Certificado
          </button>
        </div>

        <div className="border-2 border-slate-300 rounded-2xl p-8 sm:p-12 text-center bg-slate-50/40">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-700 mb-2">
            Agrupamento de Escolas de Paço de Arcos
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Certificado de Descobridor
          </h3>
          <p className="text-base text-slate-700 max-w-xl mx-auto mb-6">
            Certifica-se que o(a) aluno(a){' '}
            <strong className="text-slate-900">{profile.name}</strong>, do{' '}
            <strong className="text-slate-900">
              {profile.grade} · {profile.className}
            </strong>
            , alcançou o estatuto de{' '}
            <strong className="text-sky-700">
              Nível {levelInfo.level} — {levelInfo.title}
            </strong>{' '}
            com{' '}
            <span className="font-mono-tabular font-bold">
              {profile.xp} pontos XP
            </span>{' '}
            e{' '}
            <span className="font-mono-tabular font-bold">
              {sessions.length}
            </span>{' '}
            atividades educativas concluídas.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 pt-6 border-t border-slate-200 text-xs text-slate-500">
            <span>Data: {todayStr}</span>
            <span>·</span>
            <span>A Grande Aventura dos Descobridores de Paço de Arcos</span>
          </div>
        </div>
      </section>
    </div>
  );
};
