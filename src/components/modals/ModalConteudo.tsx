import { useState, useEffect } from 'react';
import { X, Plus, Upload, Video, FileText, Clock, Layers } from 'lucide-react';
import type { ContentItem } from '../../types';

interface Props {
  content?: ContentItem | null;
  onSave: (data: Omit<ContentItem, 'id'>) => void;
  onClose: () => void;
}

type Tab = 'video' | 'manual';

export default function ModalConteudo({ content, onSave, onClose }: Props) {
  const isEdit = !!content;
  const [tab, setTab] = useState<Tab>(content?.type ?? 'video');
  const [title, setTitle] = useState(content?.title ?? '');
  const [description, setDescription] = useState(content?.description ?? '');
  const [duration, setDuration] = useState(content?.duration ?? '');
  const [pages, setPages] = useState(content?.pages ?? '');
  const [featured, setFeatured] = useState(content?.featured ?? false);
  const [videoFile, setVideoFile] = useState('');
  const [docFile, setDocFile] = useState('');

  useEffect(() => {
    if (content) {
      setTab(content.type);
      setTitle(content.title);
      setDescription(content.description);
      setDuration(content.duration ?? '');
      setPages(content.pages ?? '');
      setFeatured(content.featured ?? false);
    }
  }, [content]);

  const handleSave = () => {
    if (!title.trim()) return;
    const base = { title: title.trim(), description: description.trim(), type: tab };
    if (tab === 'video') {
      onSave({ ...base, duration: duration.trim(), featured });
    } else {
      onSave({ ...base, pages: pages.trim(), featured: false });
    }
  };

  const inputClass =
    'bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] h-12 px-[13px] text-[14px] text-[#0f172a] placeholder:text-[rgba(15,23,42,0.5)] outline-none focus:border-[#4f46e5] transition-colors w-full';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)] w-[486px] p-[21px] flex flex-col gap-4 relative max-h-[92vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors z-10"
        >
          <X size={14} className="text-gray-600" />
        </button>

        {/* Title */}
        <p className="font-medium text-[16px] text-[#0f172a]">
          {isEdit ? 'Editar Conteúdo' : 'Novo Conteúdo'}
        </p>

        {/* Tabs */}
        <div className="flex gap-3">
          <button
            onClick={() => setTab('video')}
            className={`flex-1 h-12 rounded-2xl border-2 flex items-center justify-center gap-2 text-[14px] font-medium transition-colors ${
              tab === 'video'
                ? 'bg-[#fff7ed] border-[#f97316] text-[#f97316]'
                : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-gray-300'
            }`}
          >
            <Video size={16} />
            Vídeo
          </button>
          <button
            onClick={() => setTab('manual')}
            className={`flex-1 h-12 rounded-2xl border-2 flex items-center justify-center gap-2 text-[14px] font-medium transition-colors ${
              tab === 'manual'
                ? 'bg-[#eff6ff] border-[#2563eb] text-[#2563eb]'
                : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-gray-300'
            }`}
          >
            <FileText size={16} />
            Manual
          </button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3">
          {/* Destaque — somente vídeo */}
          {tab === 'video' && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#4f46e5] cursor-pointer"
              />
              <span className="text-[14px] text-[#0f172a]">Colocar em destaque</span>
            </label>
          )}

          {/* Título */}
          <div className="flex flex-col gap-1">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 40))}
              placeholder="Título do conteúdo"
              className={inputClass}
            />
            <p className="text-[#8e8e8e] text-[12px] pl-2">Max. de 40 caracteres</p>
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-1">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 80))}
              placeholder="Descrição resumida"
              rows={3}
              className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] px-[13px] py-[9px] text-[14px] text-[#0f172a] placeholder:text-[rgba(15,23,42,0.5)] outline-none focus:border-[#4f46e5] transition-colors w-full resize-none leading-[20px]"
            />
            <p className="text-[#8e8e8e] text-[12px] pl-2">Max. de 80 caracteres</p>
          </div>

          {tab === 'video' ? (
            <>
              {/* Duração */}
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Duração (ex: 5 min)"
                className={inputClass}
              />

              {/* Upload vídeo */}
              <div className="flex flex-col gap-1">
                <p className="text-[#4f46e5] text-[13px] font-medium">Upload do vídeo</p>
                <label className="flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-[#e2e8f0] rounded-[14px] py-5 cursor-pointer hover:border-[#4f46e5] transition-colors">
                  <input
                    type="file"
                    accept=".mp4,.avi,.mpeg,.webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setVideoFile(file.name);
                    }}
                  />
                  <Upload size={20} className="text-[#94a3b8]" />
                  <p className={`text-[13px] font-medium ${videoFile ? 'text-[#0f172a]' : 'text-[#4f46e5]'}`}>
                    {videoFile || 'Clique para fazer upload'}
                  </p>
                  <p className="text-[12px] text-[#94a3b8]">MP4, AVI, MPEG, WebP</p>
                </label>
                <p className="text-[#94a3b8] text-[12px] pl-1">Tamanho máx. permitido de 50 MB</p>
              </div>
            </>
          ) : (
            <>
              {/* Páginas */}
              <input
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="Páginas (ex: 10 páginas)"
                className={inputClass}
              />

              {/* Upload documento */}
              <div className="flex flex-col gap-1">
                <p className="text-[#4f46e5] text-[13px] font-medium">Upload do documento</p>
                <label className="flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-[#e2e8f0] rounded-[14px] py-5 cursor-pointer hover:border-[#4f46e5] transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.docx,.pptx,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setDocFile(file.name);
                    }}
                  />
                  <Upload size={20} className="text-[#94a3b8]" />
                  <p className={`text-[13px] font-medium ${docFile ? 'text-[#0f172a]' : 'text-[#4f46e5]'}`}>
                    {docFile || 'Clique para fazer upload'}
                  </p>
                  <p className="text-[12px] text-[#94a3b8]">PDF, DOCX, PPTX, TXT</p>
                </label>
                <p className="text-[#94a3b8] text-[12px] pl-1">Tamanho máx. permitido de 10 MB</p>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={onClose}
            className="flex-1 h-[42px] bg-[#fffbfb] border border-[#cfcaca] rounded-[14px] text-[#464646] font-medium text-[14px] hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 h-[42px] bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-50 disabled:cursor-not-allowed rounded-[14px] text-white font-medium text-[14px] flex items-center justify-center gap-2 transition-colors"
          >
            {!isEdit && <Plus size={15} />}
            {isEdit ? 'Salvar Conteúdo' : 'Adicionar Conteúdo'}
          </button>
        </div>
      </div>
    </div>
  );
}
