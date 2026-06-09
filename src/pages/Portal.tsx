import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Play, BookOpen, Clock, Sparkles, Layers } from 'lucide-react';
import { accordions, trainingCategories, featuredContent } from '../data/mock';
import type { Accordion } from '../types';
import ChatAssistant from '../components/ChatAssistant';
import VideoModal from '../components/VideoModal';
import pdfUrl from '../assets/1- Abertura de chamado de requisiço e incidente - Servidor.pdf?url';

const PAGE_SIZE = 5;

const ALL_GROUPS = ['Todos', ...Array.from(new Set(trainingCategories.flatMap((c) => c.groups)))];

export default function Portal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState('Todos');
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [chatOpen, setChatOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = accordions;

    if (activeGroup !== 'Todos') {
      const catIds = trainingCategories
        .filter((c) => c.groups.includes(activeGroup))
        .map((c) => c.id);
      result = result.filter((a) => catIds.includes(a.categoryId));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.contents.some((item) => item.title.toLowerCase().includes(q))
      );
    }

    return result;
  }, [activeGroup, searchQuery]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleGroupChange = (group: string) => {
    setActiveGroup(group);
    setPage(1);
  };

  const getCategoryName = (categoryId: string) =>
    trainingCategories.find((c) => c.id === categoryId)?.name ?? '';

  return (
    <div className="px-8 py-6 max-w-[1432px] mx-auto w-full flex flex-col gap-4">
      {/* Title */}
      <div className="text-center flex flex-col gap-1">
        <div className="flex items-center justify-center gap-2">
          <BookOpen size={24} className="text-[#0f172a]" />
          <h1 className="text-[28px] font-medium text-[#0f172a] leading-9">
            Portal de Treinamento
          </h1>
        </div>
        <p className="text-[#64748b] text-[15px]">
          Selecione uma categoria para ver o vídeo e o manual relacionados
        </p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(15,23,42,0.5)]" />
          <input
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Buscar categoria ou conteúdo..."
            className="w-full pl-11 pr-4 py-3 border border-[#e2e8f0] rounded-2xl shadow-sm text-[16px] outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-colors"
          />
        </div>
        <button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium px-4 py-2.5 rounded-2xl text-[14px] transition-colors whitespace-nowrap">
          Pesquisar
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-2">
        <button className="flex items-center justify-center w-8 h-8 border border-[#e2e8f0] rounded-full bg-white shadow-sm shrink-0">
          <ChevronLeft size={16} className="text-gray-500" />
        </button>

        <div className="flex-1 overflow-hidden">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {ALL_GROUPS.map((group) => (
              <button
                key={group}
                onClick={() => handleGroupChange(group)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[14px] font-medium border transition-colors ${
                  activeGroup === group
                    ? 'bg-[#4f46e5] text-white border-[#4f46e5]'
                    : 'bg-white text-[#475569] border-[#e2e8f0] hover:border-[#4f46e5] hover:text-[#4f46e5]'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        <button className="flex items-center justify-center w-8 h-8 border border-[#e2e8f0] rounded-full bg-white shadow-sm shrink-0">
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Featured content */}
      <div className="flex flex-col gap-2">
        <p className="text-[#636363] font-medium text-[14px]">Em destaque</p>
        <div className="w-[624px]">
          <div
            className="bg-white border border-[#e8e0dd] rounded-lg flex items-center gap-0 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setVideoOpen(true)}
          >
            <div className="bg-[#faece7] flex flex-col items-center justify-center gap-1 h-[136px] w-[132px] px-2 shrink-0">
              <div className="w-8 h-8 bg-[#f97316] rounded-full flex items-center justify-center">
                <Play size={14} className="text-white fill-white ml-0.5" />
              </div>
              <span className="text-[#f97316] font-bold text-[12px]">
                {featuredContent.duration}
              </span>
            </div>
            <div className="flex flex-col gap-1 py-2 px-3 flex-1">
              <span className="bg-[#fff7ed] text-[#f97316] font-medium text-[12px] px-2 py-0.5 rounded-full w-fit capitalize">
                {featuredContent.type === 'video' ? 'Vídeo' : 'Manual'}
              </span>
              <p className="text-[#0f172a] font-semibold text-[14px]">{featuredContent.title}</p>
              <p className="text-[#64748b] text-[12px]">{featuredContent.subtitle}</p>
              <div className="flex items-center gap-1 text-[#90a1b9] text-[12px]">
                <Clock size={11} />
                <span>{featuredContent.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordions */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm p-5 flex flex-col gap-4">
        <p className="text-[#0a0a0a] font-medium text-[16px]">Conteúdos</p>

        <div className="flex flex-col gap-2">
          {paged.length === 0 && (
            <p className="text-center text-[#64748b] py-8 text-sm">
              Nenhum conteúdo encontrado.
            </p>
          )}

          {paged.map((acc: Accordion) => (
            <div key={acc.id} className="border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden">
              {/* Header */}
              <button
                onClick={() => toggleAccordion(acc.id)}
                className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#eff6ff] flex items-center justify-center rounded-[14px] size-[40px] shrink-0">
                    <BarChart2Icon />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[#2563eb] font-medium text-[12px]">
                      {getCategoryName(acc.categoryId)}
                    </span>
                    <span className="text-[#0f172a] font-semibold text-[15px]">{acc.title}</span>
                    <span className="text-[#64748b] font-normal text-[13px]">{acc.description}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <div className="bg-[#f1f5f9] rounded-full px-2.5 py-0.5">
                    <span className="text-[#62748e] font-medium text-[12px]">
                      {acc.contents.length} {acc.contents.length === 1 ? 'conteúdo' : 'conteúdos'}
                    </span>
                  </div>
                  {openAccordions.has(acc.id)
                    ? <ChevronUp size={18} className="text-gray-500" />
                    : <ChevronDown size={18} className="text-gray-500" />
                  }
                </div>
              </button>

              {/* Body */}
              {openAccordions.has(acc.id) && (
                <div className="border-t border-[#e2e8f0] divide-y divide-[#e2e8f0]">
                  {acc.contents.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 px-5 py-4 bg-white hover:bg-gray-50 transition-colors">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.type === 'video' ? 'bg-[#fff7ed]' : 'bg-[#eff6ff]'}`}>
                        {item.type === 'video'
                          ? <Play size={14} className="text-[#f97316] fill-[#f97316] ml-0.5" />
                          : <Layers size={14} className="text-[#2563eb]" />
                        }
                      </div>

                      {/* Info */}
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="text-[#0f172a] font-semibold text-[14px] leading-snug">{item.title}</span>
                        <span className="text-[#64748b] text-[13px] leading-snug">{item.description}</span>
                        <div className="flex items-center gap-2 mt-1">
                          {item.type === 'video' ? (
                            <>
                              <span className="bg-[#fff7ed] text-[#f97316] font-medium text-[11px] px-2 py-0.5 rounded-full">Vídeo</span>
                              {item.duration && (
                                <span className="flex items-center gap-1 text-[#90a1b9] text-[12px]">
                                  <Clock size={11} />
                                  {item.duration}
                                </span>
                              )}
                            </>
                          ) : (
                            <>
                              <span className="bg-[#eff6ff] text-[#2563eb] font-medium text-[11px] px-2 py-0.5 rounded-full">Manual</span>
                              {item.pages && (
                                <span className="flex items-center gap-1 text-[#90a1b9] text-[12px]">
                                  <Layers size={11} />
                                  {item.pages} {item.pages === '1' ? 'página' : 'páginas'}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action button */}
                      {item.type === 'video' ? (
                        <button
                          onClick={() => setVideoOpen(true)}
                          className="shrink-0 border border-[#e2e8f0] rounded-full px-4 py-1.5 text-[13px] font-medium text-[#0f172a] hover:border-[#4f46e5] hover:text-[#4f46e5] transition-colors whitespace-nowrap"
                        >
                          Assistir →
                        </button>
                      ) : (
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 border border-[#e2e8f0] rounded-full px-4 py-1.5 text-[13px] font-medium text-[#0f172a] hover:border-[#4f46e5] hover:text-[#4f46e5] transition-colors whitespace-nowrap"
                        >
                          Ler →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-4 justify-end bg-white border border-[#e2e8f0] rounded-lg px-4 py-3">
            <span className="text-[#393939] font-medium text-[14px]">Resultados por página</span>
            <div className="flex items-center gap-1 border-b-2 border-[#4f46e5] pb-0.5">
              <span className="text-[14px] text-black">{PAGE_SIZE}</span>
              <ChevronDown size={16} />
            </div>
            <span className="text-[#4b4b4b] text-[14px]">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(6, totalPages) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`text-[14px] ${p === page ? 'font-bold text-[#4f46e5]' : 'font-normal text-[#4b4b4b]'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-8 right-8 bg-[#4f46e5] hover:bg-[#4338ca] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors z-50"
      >
        <Sparkles size={22} />
      </button>

      <ChatAssistant open={chatOpen} onClose={() => setChatOpen(false)} />
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </div>
  );
}

function BarChart2Icon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
