import React, { useState } from 'react';
import { BookMarked, Plus, Trash2, Volume2, X } from 'lucide-react';
import { speakText } from '../utils/speech';

interface SupportNotebookModalProps {
  slowSpeech: boolean;
  notes: string[];
  onSaveNotes: (notes: string[]) => void;
  onClose: () => void;
}

const SOUND_PAIRS = [
  { pair: 'P / B', example: 'Pato · Barco' },
  { pair: 'F / V', example: 'Farol · Vela' },
  { pair: 'CH / J', example: 'Chave · Janela' },
  { pair: 'S / Z', example: 'Sol · Azul' },
];

const TIME_MARKERS = [
  { tense: 'Passado (Já aconteceu)', words: 'Ontem, antes, antigamente' },
  { tense: 'Presente (Acontece agora)', words: 'Hoje, agora, neste momento' },
  { tense: 'Futuro (Vai acontecer)', words: 'Amanhã, depois, mais tarde' },
];

export const SupportNotebookModal: React.FC<SupportNotebookModalProps> = ({
  slowSpeech,
  notes,
  onSaveNotes,
  onClose,
}) => {
  const [newNote, setNewNote] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newNote.trim();
    if (!trimmed) return;
    onSaveNotes([trimmed, ...notes]);
    setNewNote('');
  };

  const handleDeleteNote = (idx: number) => {
    onSaveNotes(notes.filter((_, i) => i !== idx));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notebook-title"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="surface-card bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 text-sky-700 font-semibold text-sm">
            <BookMarked className="w-4 h-4" />
            <span>Caderno de Apoio e Dicas Anti-Erros</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar caderno de apoio"
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h2
          id="notebook-title"
          className="text-xl font-bold text-slate-900 mb-2"
        >
          As Minhas Fichas de Ajuda
        </h2>
        <p className="text-xs text-slate-600 text-muted-adaptive mb-6">
          Consulta estas dicas sempre que tiveres dúvidas nos sons das letras ou
          nos tempos verbais.
        </p>

        {/* Close Consonants Section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            1. Sons Parecidos (Toca para ouvir)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SOUND_PAIRS.map((item) => (
              <button
                key={item.pair}
                type="button"
                onClick={() =>
                  speakText(`${item.pair}. ${item.example}`, slowSpeech)
                }
                className="surface-subtle bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-sm font-bold font-mono-tabular text-sky-700">
                    {item.pair}
                  </p>
                  <p className="text-xs text-slate-700">{item.example}</p>
                </div>
                <Volume2 className="w-4 h-4 text-sky-700 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Time Indicators Section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            2. Indicadores de Tempo
          </h3>
          <div className="space-y-2">
            {TIME_MARKERS.map((tm) => (
              <div
                key={tm.tense}
                className="surface-subtle bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <span className="font-bold text-slate-900">{tm.tense}</span>
                <span className="text-slate-600 text-muted-adaptive">
                  {tm.words}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Anti-Error Notes */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-2">
            3. As Minhas Palavras e Notas
          </h3>
          <form onSubmit={handleAddNote} className="flex gap-2 mb-3">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Escreve uma palavra ou regra para recordar..."
              className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-600"
            />
            <button
              type="submit"
              className="btn-primary-adaptive inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              Guardar
            </button>
          </form>

          {notes.length === 0 ? (
            <p className="text-xs text-slate-500 text-muted-adaptive">
              Ainda não tens notas guardadas. Adiciona palavras que queiras
              praticar!
            </p>
          ) : (
            <ul className="space-y-2">
              {notes.map((note, idx) => (
                <li
                  key={idx}
                  className="surface-subtle bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3 text-sm"
                >
                  <span className="text-slate-800">{note}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => speakText(note, slowSpeech)}
                      aria-label="Ouvir nota"
                      className="p-1.5 text-sky-700 hover:bg-sky-100 rounded-lg cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(idx)}
                      aria-label="Remover nota"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
