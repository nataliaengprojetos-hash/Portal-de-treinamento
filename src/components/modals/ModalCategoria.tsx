import { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import type { TrainingCategory } from '../../types';

const ALL_GROUPS = ['Fornecedores', 'Servidores', 'Gestores', 'ADM', 'Aprovadores', 'N1', 'N2', 'Suporte', 'Suporte Avançado'];

interface Props {
  category?: TrainingCategory | null;
  onSave: (data: { name: string; groups: string[] }) => void;
  onClose: () => void;
}

export default function ModalCategoria({ category, onSave, onClose }: Props) {
  const isEdit = !!category;
  const [name, setName] = useState(category?.name ?? '');
  const [groups, setGroups] = useState<string[]>(category?.groups ?? []);
  const [groupInput, setGroupInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setGroups(category.groups);
    }
  }, [category]);

  const filtered = ALL_GROUPS.filter(
    (g) => g.toLowerCase().includes(groupInput.toLowerCase()) && !groups.includes(g)
  );

  const addGroup = (g: string) => {
    if (!groups.includes(g)) setGroups([...groups, g]);
    setGroupInput('');
    setShowDropdown(false);
  };

  const addCustomGroup = () => {
    const val = groupInput.trim();
    if (val && !groups.includes(val)) {
      setGroups([...groups, val]);
      setGroupInput('');
      setShowDropdown(false);
    }
  };

  const removeGroup = (g: string) => setGroups(groups.filter((x) => x !== g));

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), groups });
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
          {isEdit ? 'Editar Categoria' : 'Nova Categoria'}
        </p>

        {/* Fields */}
        <div className="flex flex-col gap-[10px]">
          {/* Nome */}
          <div className="flex flex-col gap-1">
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 60))}
              placeholder="Nome da categoria"
              className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] h-12 px-[13px] text-[14px] text-[#0f172a] placeholder:text-[rgba(15,23,42,0.5)] outline-none focus:border-[#4f46e5] transition-colors w-full"
            />
            <p className="text-[#8e8e8e] text-[12px] pl-2">{name.length}/60 caracteres</p>
          </div>

          {/* Grupos */}
          <div className="flex flex-col gap-2">
            <p className="text-[14px] text-[#0f172a] font-medium">Grupos de usuários e e-mails</p>

            {/* Tags selected */}
            {groups.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {groups.map((g) => (
                  <span key={g} className="flex items-center gap-1 bg-[#ede9fe] text-[#4f46e5] text-[12px] font-medium px-2 py-1 rounded-full">
                    {g}
                    <button onClick={() => removeGroup(g)} className="hover:text-[#4338ca]">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input + dropdown */}
            <div className="relative">
              <input
                ref={inputRef}
                value={groupInput}
                onChange={(e) => { setGroupInput(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomGroup(); } }}
                placeholder="Adicionar grupo ou e-mail..."
                className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] h-12 px-[13px] text-[14px] text-[#0f172a] placeholder:text-[rgba(15,23,42,0.5)] outline-none focus:border-[#4f46e5] transition-colors w-full"
              />

              {showDropdown && (filtered.length > 0 || groupInput.trim()) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e2e8f0] rounded-[14px] shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filtered.map((g) => (
                    <button
                      key={g}
                      onMouseDown={(e) => { e.preventDefault(); addGroup(g); }}
                      className="w-full text-left px-[13px] py-[10px] text-[14px] text-[#0f172a] hover:bg-[#f8fafc] transition-colors"
                    >
                      {g}
                    </button>
                  ))}
                  {groupInput.trim() && !ALL_GROUPS.includes(groupInput.trim()) && (
                    <button
                      onMouseDown={(e) => { e.preventDefault(); addCustomGroup(); }}
                      className="w-full text-left px-[13px] py-[10px] text-[14px] text-[#4f46e5] hover:bg-[#f8fafc] transition-colors flex items-center gap-2"
                    >
                      <Plus size={14} /> Adicionar "{groupInput.trim()}"
                    </button>
                  )}
                </div>
              )}
            </div>
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
            disabled={!name.trim()}
            className="flex-1 h-[42px] bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-50 disabled:cursor-not-allowed rounded-[14px] text-white font-medium text-[14px] flex items-center justify-center gap-2 transition-colors"
          >
            {!isEdit && <Plus size={15} />}
            {isEdit ? 'Salvar Categoria' : 'Criar Categoria'}
          </button>
        </div>
      </div>
    </div>
  );
}
