import { useState, useEffect } from 'react';
import { X, Plus, ChevronDown } from 'lucide-react';
import { trainingCategories } from '../../data/mock';
import type { Accordion } from '../../types';

interface Props {
  accordion?: Accordion | null;
  onSave: (data: { title: string; categoryId: string; description: string }) => void;
  onClose: () => void;
}

export default function ModalAccordion({ accordion, onSave, onClose }: Props) {
  const isEdit = !!accordion;

  const [title, setTitle] = useState(accordion?.title ?? '');
  const [categoryId, setCategoryId] = useState(accordion?.categoryId ?? '');
  const [description, setDescription] = useState(accordion?.description ?? '');

  useEffect(() => {
    if (accordion) {
      setTitle(accordion.title);
      setCategoryId(accordion.categoryId);
      setDescription(accordion.description);
    }
  }, [accordion]);

  const handleSave = () => {
    if (!title.trim() || !categoryId) return;
    onSave({ title: title.trim(), categoryId, description: description.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] w-[486px] p-[21px] flex flex-col gap-4 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
        >
          <X size={14} className="text-gray-600" />
        </button>

        {/* Title */}
        <p className="font-medium text-[16px] text-[#0f172a] leading-[22.8px]">
          {isEdit ? 'Editar Accordion' : 'Novo Accordion'}
        </p>

        {/* Fields */}
        <div className="flex flex-col gap-[10px] w-full">
          {/* Título */}
          <div className="flex flex-col gap-1">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 40))}
              placeholder="Título do acordeão"
              className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] h-12 px-[13px] text-[14px] text-[#0f172a] placeholder:text-[rgba(15,23,42,0.5)] outline-none focus:border-[#4f46e5] transition-colors w-full"
            />
            <p className="text-[#8e8e8e] text-[12px] pl-2">{title.length}/40 caracteres</p>
          </div>

          {/* Categoria */}
          <div className="relative">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="appearance-none w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] h-12 pl-[13px] pr-10 text-[14px] outline-none focus:border-[#4f46e5] transition-colors cursor-pointer"
              style={{ color: categoryId ? '#0f172a' : 'rgba(15,23,42,0.5)' }}
            >
              <option value="" disabled>Selecione uma categoria</option>
              {trainingCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-1">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 80))}
              placeholder="Descrição curta"
              rows={4}
              className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] px-[13px] py-[9px] text-[14px] text-[#0f172a] placeholder:text-[rgba(15,23,42,0.5)] outline-none focus:border-[#4f46e5] transition-colors w-full resize-none leading-[20px]"
            />
            <p className="text-[#8e8e8e] text-[12px] pl-2">{description.length}/80 caracteres</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-[42px] bg-[#fffbfb] border border-[#cfcaca] rounded-[14px] text-[#464646] font-medium text-[14px] hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !categoryId}
            className="flex-1 h-[42px] bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-50 disabled:cursor-not-allowed rounded-[14px] text-white font-medium text-[14px] flex items-center justify-center gap-2 transition-colors"
          >
            {!isEdit && <Plus size={15} />}
            {isEdit ? 'Salvar Accordion' : 'Criar Acordeão'}
          </button>
        </div>
      </div>
    </div>
  );
}
