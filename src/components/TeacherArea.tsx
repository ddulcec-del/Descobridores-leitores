import React from 'react';
import { Award, BookOpen, Download, RotateCcw } from 'lucide-react';
import {
  AREAS,
  getLevelInfo,
  MEDALS,
  NEE_GUIDE_SECTIONS,
} from '../data/activitiesData';
import { ActivitySession, StudentProfile } from '../types';
import { exportSessionsToCSV } from '../utils/storage';

interface TeacherAreaProps {
  profile: StudentProfile;
  sessions: ActivitySession[];
  onResetDemoData: () => void;
}

export const TeacherArea: React.FC<TeacherAreaProps> = ({
  profile,
  sessions,
  onResetDemoData,
}) => {
  const levelInfo = getLevelInfo(profile.xp);
  const unlockedMedals = MEDALS.filter((m) =>
    m.checkUnlocked(sessions, profile.xp)
  );

  const totalScore = sessions.reduce((acc, s) => acc + s.score, 0);
  const totalMax = sessions.reduce((acc, s) => acc + s.maxScore, 0);
  const accuracyPercent =
    totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header & CSV Export Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500 text-muted-adaptive">
            Agrupamento de Escolas de Paço de Arcos · Acompanhamento Pedagógico
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Área do Professor
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => exportSessionsToCSV(sessions)}
            className="btn-primary-adaptive inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            Exportar Resultados (CSV)
          </button>

          <button
            type="button"
            onClick={onResetDemoData}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            Repor Dados Iniciais
          </button>
        </div>
      </div>

      {/* 4-Column KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-card bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500 text-muted-adaptive">
            Aluno Selecionado
          </p>
          <p className="text-xl font-bold text-slate-900 mt-1 truncate">
            {profile.name}
          </p>
          <p className="text-xs text-slate-500 text-muted-adaptive mt-1">
            {profile.grade} · {profile.className}
          </p>
        </div>

        <div className="surface-card bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500 text-muted-adaptive">
            Pontuação Total (XP)
          </p>
          <p className="text-2xl font-bold text-sky-700 font-mono-tabular mt-1">
            {profile.xp} XP
          </p>
          <p className="text-xs text-slate-500 text-muted-adaptive mt-1">
            Nível {levelInfo.level}: {levelInfo.title}
          </p>
        </div>

        <div className="surface-card bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500 text-muted-adaptive">
            Atividades Realizadas
          </p>
          <p className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1">
            {sessions.length}
          </p>
          <p className="text-xs text-slate-500 text-muted-adaptive mt-1">
            Taxa de acerto global: {accuracyPercent}%
          </p>
        </div>

        <div className="surface-card bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500 text-muted-adaptive">
            Medalhas Conquistadas
          </p>
          <p className="text-2xl font-bold text-emerald-700 font-mono-tabular mt-1">
            {unlockedMedals.length} / {MEDALS.length}
          </p>
          <p className="text-xs text-slate-500 text-muted-adaptive mt-1">
            Guardado em Local Storage
          </p>
        </div>
      </div>

      {/* Progress by Curricular Area + Medals Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 surface-card bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Progresso por Área Curricular
          </h2>
          <div className="space-y-4">
            {AREAS.map((area) => {
              const areaSessions = sessions.filter((s) => s.area === area);
              const count = areaSessions.length;
              const areaScore = areaSessions.reduce(
                (sum, s) => sum + s.score,
                0
              );
              const areaMax = areaSessions.reduce(
                (sum, s) => sum + s.maxScore,
                0
              );
              const pct =
                areaMax > 0 ? Math.round((areaScore / areaMax) * 100) : 0;

              return (
                <div key={area}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-semibold text-slate-800">{area}</span>
                    <span className="text-xs text-slate-500 text-muted-adaptive font-mono-tabular">
                      {count} {count === 1 ? 'sessão' : 'sessões'} ·{' '}
                      {areaMax > 0 ? `${pct}% acerto` : 'Sem registos'}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-600 rounded-full transition-all duration-300"
                      style={{ width: `${areaMax > 0 ? pct : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 surface-card bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-sky-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Medalhas Desbloqueadas
            </h2>
          </div>
          {unlockedMedals.length === 0 ? (
            <p className="text-sm text-slate-500 text-muted-adaptive">
              Ainda não foram desbloqueadas medalhas nesta sessão.
            </p>
          ) : (
            <ul className="space-y-3">
              {unlockedMedals.map((medal) => (
                <li
                  key={medal.id}
                  className="surface-subtle bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {medal.title}
                    </p>
                    <p className="text-xs text-slate-500 text-muted-adaptive">
                      {medal.criteriaText}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700">
                    Conquistada
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Detailed Activity Log Table */}
      <div className="surface-card bg-white border border-slate-200 rounded-2xl p-6 overflow-hidden">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Registo Detalhado de Atividades
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 text-muted-adaptive">
                <th className="py-3 pr-4">Data e Hora</th>
                <th className="py-3 px-4">Aluno</th>
                <th className="py-3 px-4">Atividade</th>
                <th className="py-3 px-4">Área</th>
                <th className="py-3 px-4 text-right">Pontuação</th>
                <th className="py-3 pl-4 text-right">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td className="py-3 pr-4 text-slate-600 text-muted-adaptive font-mono-tabular whitespace-nowrap">
                    {new Date(session.timestamp).toLocaleString('pt-PT', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {session.studentName}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {session.activityTitle}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-muted-adaptive">
                    {session.area}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-tabular font-semibold text-slate-900">
                    {session.score} / {session.maxScore}
                  </td>
                  <td className="py-3 pl-4 text-right font-mono-tabular font-semibold text-sky-700">
                    +{session.xpEarned}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEE Pedagogical Reference Guide (from attached PDF) */}
      <div className="surface-card bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-sky-700" />
          <h2 className="text-lg font-bold text-slate-900">
            Guia de Intervenção Inclusiva (Dislexia, PHDA e PEA Nível 1)
          </h2>
        </div>
        <p className="text-sm text-slate-600 text-muted-adaptive mb-6">
          Orientações práticas aplicadas na plataforma com base nas estratégias
          de apoio às Necessidades Educativas Especiais (Ara Paula Portela
          Neves).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEE_GUIDE_SECTIONS.map((sec) => (
            <div
              key={sec.profile}
              className="surface-subtle bg-slate-50 border border-slate-200/80 rounded-xl p-5"
            >
              <h3 className="text-base font-bold text-slate-900 mb-3">
                {sec.profile}
              </h3>
              <ul className="space-y-2 text-xs text-slate-700 text-muted-adaptive leading-relaxed">
                {sec.strategies.map((strat, idx) => (
                  <li key={idx}>• {strat}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
