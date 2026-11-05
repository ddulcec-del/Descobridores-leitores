import React, { useEffect, useState } from 'react';
import { Wind, X } from 'lucide-react';

interface CalmBreakModalProps {
  onClose: () => void;
}

type Phase = 'Inspira devagar...' | 'Segura o ar...' | 'Expira suavemente...';

const PHASES: { label: Phase; scale: string }[] = [
  { label: 'Inspira devagar...', scale: 'scale-125' },
  { label: 'Segura o ar...', scale: 'scale-125' },
  { label: 'Expira suavemente...', scale: 'scale-95' },
];

export const CalmBreakModal: React.FC<CalmBreakModalProps> = ({ onClose }) => {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhaseIdx((prev) => {
        const next = (prev + 1) % PHASES.length;
        if (next === 0) {
          setCycles((c) => c + 1);
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = PHASES[phaseIdx];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="calm-break-title"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="surface-card bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 sm:p-8 text-center">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 text-sky-700 font-semibold text-sm">
            <Wind className="w-4 h-4" />
            <span>Pausa de Calma e Concentração</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar pausa de calma"
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h2
          id="calm-break-title"
          className="text-xl font-bold text-slate-900 mb-2"
        >
          Vamos respirar juntos
        </h2>
        <p className="text-xs text-slate-600 text-muted-adaptive mb-8">
          Acompanha o círculo com calma. Podes fazer esta pausa sempre que
          precisares de descansar a mente.
        </p>

        <div className="h-44 flex items-center justify-center mb-6">
          <div
            className={`w-32 h-32 rounded-full bg-sky-100 border-4 border-sky-500 flex items-center justify-center transition-transform duration-[3800ms] ease-in-out ${current.scale}`}
          >
            <span className="text-xs font-bold text-sky-900 px-3 text-center">
              {current.label}
            </span>
          </div>
        </div>

        <p className="text-xs font-mono-tabular text-slate-500 text-muted-adaptive mb-6">
          Ciclos completos: {cycles}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="btn-primary-adaptive w-full py-3 px-5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors cursor-pointer"
        >
          Estou pronto para continuar
        </button>
      </div>
    </div>
  );
};
