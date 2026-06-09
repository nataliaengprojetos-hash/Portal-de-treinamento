import { useState, useMemo } from 'react';
import {
  Search, Plus, ChevronLeft, ChevronRight, ChevronDown,
  Pencil, Trash2, ChevronUp, Play, Layers, Clock,
} from 'lucide-react';
import { accordions as initialAccordions, trainingCategories as initialCategories } from '../data/mock';
import type { Accordion, TrainingCategory, ContentItem } from '../types';
import ModalAccordion from '../components/modals/ModalAccordion';
import ModalConteudo from '../components/modals/ModalConteudo';
import ModalCategoria from '../components/modals/ModalCategoria';
import ModalConfirmarExclusao from '../components/modals/ModalConfirmarExclusao';

type AdminTab = 'accordions' | 'categorias';
const PAGE_SIZE = 7;

let nextId = 100;
const uid = () => String(++nextId);

export default function Admin() {
  const [tab, setTab] = useState<AdminTab>('accordions');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');

  // Data state
  const [accordionList, setAccordionList] = useState<Accordion[]>(initialAccordions);
  const [categoryList, setCategoryList] = useState<TrainingCategory[]>(initialCategories);

  // Modal state
  const [modalAccordion, setModalAccordion] = useState<{ open: boolean; item?: Accordion | null }>({ open: false });
  const [modalConteudo, setModalConteudo] = useState<{ open: boolean; accordionId: string; item?: ContentItem | null }>({ open: false, accordionId: '' });
  const [modalCategoria, setModalCategoria] = useState<{ open: boolean; item?: TrainingCategory | null }>({ open: false });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; type: 'accordion' | 'categoria' | 'conteudo'; id: string; parentId?: string } | null>(null);

  const toast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Filtered accordion list
  const filteredAccordions = useMemo(() => {
    let result = accordionList;
    if (filterCategoryId) result = result.filter((a) => a.categoryId === filterCategoryId);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    return result;
  }, [accordionList, filterCategoryId, searchQuery]);

  // Filtered category list
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categoryList;
    const q = searchQuery.toLowerCase();
    return categoryList.filter((c) => c.name.toLowerCase().includes(q));
  }, [categoryList, searchQuery]);

  const accordionTotalPages = Math.ceil(filteredAccordions.length / PAGE_SIZE);
  const pagedAccordions = filteredAccordions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const categoryTotalPages = Math.ceil(filteredCategories.length / PAGE_SIZE);
  const pagedCategories = filteredCategories.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalPages = tab === 'accordions' ? accordionTotalPages : categoryTotalPages;
  const paged = tab === 'accordions' ? pagedAccordions : pagedCategories;
  const filteredCount = tab === 'accordions' ? filteredAccordions.length : filteredCategories.length;

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Accordion CRUD
  const handleSaveAccordion = (data: { title: string; categoryId: string; description: string }) => {
    if (modalAccordion.item) {
      setAccordionList((list) => list.map((a) => a.id === modalAccordion.item!.id ? { ...a, ...data } : a));
      toast('Accordion atualizado com sucesso!');
    } else {
      setAccordionList((list) => [...list, { id: uid(), ...data, contents: [] }]);
      toast('Accordion criado com sucesso!');
    }
    setModalAccordion({ open: false });
  };

  const handleDeleteAccordion = (id: string) => {
    setAccordionList((list) => list.filter((a) => a.id !== id));
    setDeleteModal(null);
    toast('Accordion excluído com sucesso!');
  };

  // Conteudo CRUD
  const handleSaveConteudo = (data: Omit<ContentItem, 'id'>) => {
    const { accordionId, item } = modalConteudo;
    if (item) {
      setAccordionList((list) => list.map((a) =>
        a.id === accordionId
          ? { ...a, contents: a.contents.map((c) => c.id === item.id ? { ...c, ...data } : c) }
          : a
      ));
      toast('Conteúdo atualizado com sucesso!');
    } else {
      setAccordionList((list) => list.map((a) =>
        a.id === accordionId
          ? { ...a, contents: [...a.contents, { id: uid(), ...data }] }
          : a
      ));
      toast('Conteúdo adicionado com sucesso!');
    }
    setModalConteudo({ open: false, accordionId: '' });
  };

  const handleDeleteConteudo = (accordionId: string, contentId: string) => {
    setAccordionList((list) => list.map((a) =>
      a.id === accordionId ? { ...a, contents: a.contents.filter((c) => c.id !== contentId) } : a
    ));
    setDeleteModal(null);
    toast('Conteúdo excluído com sucesso!');
  };

  // Categoria CRUD
  const handleSaveCategoria = (data: { name: string; groups: string[] }) => {
    if (modalCategoria.item) {
      setCategoryList((list) => list.map((c) => c.id === modalCategoria.item!.id ? { ...c, ...data } : c));
      toast('Categoria atualizada com sucesso!');
    } else {
      setCategoryList((list) => [...list, { id: uid(), ...data }]);
      toast('Categoria criada com sucesso!');
    }
    setModalCategoria({ open: false });
  };

  const handleDeleteCategoria = (id: string) => {
    setCategoryList((list) => list.filter((c) => c.id !== id));
    setDeleteModal(null);
    toast('Categoria excluída com sucesso!');
  };

  const getCategoryName = (categoryId: string) =>
    categoryList.find((c) => c.id === categoryId)?.name ?? '';

  return (
    <div className="px-8 py-6 max-w-[1432px] mx-auto w-full flex flex-col gap-6">
      {/* Title */}
      <div className="text-center flex flex-col gap-1">
        <h1 className="text-[28px] font-medium text-[#0f172a] leading-9">
          Área Administrativa Portal de Treinamento
        </h1>
        <p className="text-[#64748b] text-[15px]">
          Gerencie categorias, acordeões e conteúdos do Portal de treinamento
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-white border border-[#dfdfdf] rounded-2xl flex gap-1 p-0.5 h-12">
          <button
            onClick={() => { setTab('accordions'); setPage(1); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-[14px] text-[14px] font-semibold transition-colors ${
              tab === 'accordions' ? 'bg-[#eef2ff] text-[#4f46e5]' : 'text-[#64748b] hover:bg-gray-50'
            }`}
          >
            Gerenciar Accordions
          </button>
          <button
            onClick={() => { setTab('categorias'); setPage(1); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-[14px] text-[14px] font-semibold transition-colors ${
              tab === 'categorias' ? 'bg-[#eef2ff] text-[#4f46e5]' : 'text-[#64748b] hover:bg-gray-50'
            }`}
          >
            Gerenciar Categorias
          </button>
        </div>
      </div>

      {/* Toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 shadow-lg z-50 text-sm font-medium">
          {successMsg}
        </div>
      )}

      {/* Content panel */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm p-5 flex flex-col gap-4">
        {/* Panel header */}
        <div className="flex flex-col gap-1">
          <h2 className="text-[#0f172a] font-medium text-[18px] leading-9">
            {tab === 'accordions' ? 'Gerenciar Accordions' : 'Gerenciar Categorias'}
          </h2>
          <p className="text-[#64748b] text-[14px]">
            {tab === 'accordions'
              ? 'Gerencie Accordions do Portal de Treinamento'
              : 'Gerencie as categorias do Portal de Treinamento'}
          </p>
        </div>

        {/* Search + action */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(15,23,42,0.5)]" />
            <input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder={tab === 'accordions' ? 'Buscar Accordions' : 'Buscar Categorias'}
              className="w-full pl-11 pr-4 h-11 border border-[#e2e8f0] rounded-2xl shadow-sm text-[15px] outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-colors"
            />
          </div>
          <button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium h-11 px-4 rounded-2xl text-[14px] transition-colors whitespace-nowrap">
            Pesquisar
          </button>
        </div>

        {/* Filter + add row */}
        <div className="flex items-center justify-between">
          {tab === 'accordions' ? (
            <div className="relative">
              <select
                value={filterCategoryId}
                onChange={(e) => { setFilterCategoryId(e.target.value); setPage(1); }}
                className="appearance-none bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] h-12 pl-3 pr-10 text-[14px] text-[rgba(15,23,42,0.8)] outline-none w-[280px] cursor-pointer"
              >
                <option value="">Selecione uma categoria</option>
                {categoryList.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          ) : (
            <div />
          )}

          <button
            onClick={() => tab === 'accordions' ? setModalAccordion({ open: true }) : setModalCategoria({ open: true })}
            className="flex items-center gap-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium h-[42px] px-4 rounded-[14px] text-[14px] transition-colors"
          >
            <Plus size={15} />
            Adicionar {tab === 'accordions' ? 'Accordion' : 'Categoria'}
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2 pt-1">
          {paged.length === 0 && (
            <p className="text-center text-[#64748b] py-8 text-sm">Nenhum item encontrado.</p>
          )}

          {tab === 'accordions' && (pagedAccordions as Accordion[]).map((acc) => (
            <div key={acc.id} className="border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden">
              {/* Accordion header row */}
              <div className="flex items-center justify-between px-5 py-4 bg-white">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Icon */}
                  <div className="bg-[#eff6ff] flex items-center justify-center rounded-[14px] size-[40px] shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  {/* Text */}
                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-[#2563eb] font-medium text-[12px] leading-4">
                      {getCategoryName(acc.categoryId)}
                    </span>
                    <span className="text-[#0f172a] font-semibold text-[15px] leading-[22px] truncate max-w-[480px]">
                      {acc.title}
                    </span>
                    <span className="text-[#64748b] font-normal text-[13px] leading-[18px] truncate max-w-[480px]">
                      {acc.description}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-5 shrink-0 ml-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setModalAccordion({ open: true, item: acc })}
                      className="text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
                      title="Editar"
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, type: 'accordion', id: acc.id })}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleAccordion(acc.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {openAccordions.has(acc.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Expanded contents */}
              {openAccordions.has(acc.id) && (
                <div className="border-t border-[#e2e8f0]">
                  {/* Section header */}
                  <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-[#e2e8f0]">
                    <span className="text-[#64748b] text-[13px] font-medium">Conteúdos</span>
                    <button
                      onClick={() => setModalConteudo({ open: true, accordionId: acc.id })}
                      className="flex items-center gap-1.5 text-[#4f46e5] hover:text-[#4338ca] text-[13px] font-medium transition-colors"
                    >
                      <Plus size={13} />
                      Adicionar Conteúdo
                    </button>
                  </div>

                  {acc.contents.length === 0 && (
                    <p className="text-[#64748b] text-[13px] px-5 py-4">Nenhum conteúdo adicionado.</p>
                  )}

                  <div className="divide-y divide-[#e2e8f0]">
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

                        {/* Actions */}
                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            onClick={() => setModalConteudo({ open: true, accordionId: acc.id, item })}
                            className="text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ open: true, type: 'conteudo', id: item.id, parentId: acc.id })}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {tab === 'categorias' && (pagedCategories as TrainingCategory[]).map((cat) => (
            <div key={cat.id} className="border border-[#e2e8f0] rounded-2xl shadow-sm bg-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                {/* Icon */}
                <div className="bg-[#f0fdf4] flex items-center justify-center rounded-[14px] size-[40px] shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                {/* Text */}
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[#0f172a] font-semibold text-[15px]">{cat.name}</span>
                  <div className="flex flex-wrap gap-1">
                    {cat.groups.map((g) => (
                      <span key={g} className="bg-[#ede9fe] text-[#4f46e5] text-[11px] font-medium px-2 py-0.5 rounded-full">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button
                  onClick={() => setModalCategoria({ open: true, item: cat })}
                  className="text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
                  title="Editar"
                >
                  <Pencil size={17} />
                </button>
                <button
                  onClick={() => setDeleteModal({ open: true, type: 'categoria', id: cat.id })}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-4 justify-end bg-white border border-[#e2e8f0] rounded-lg px-4 py-3 mt-2">
            <span className="text-[#393939] font-medium text-[14px]">Resultados por página</span>
            <div className="flex items-center gap-1 border-b-2 border-[#4f46e5] pb-0.5">
              <span className="text-[14px] text-black">{PAGE_SIZE}</span>
              <ChevronDown size={16} />
            </div>
            <span className="text-[#4b4b4b] text-[14px]">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredCount)} de {filteredCount}
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

      {/* Modals */}
      {modalAccordion.open && (
        <ModalAccordion
          accordion={modalAccordion.item}
          onSave={handleSaveAccordion}
          onClose={() => setModalAccordion({ open: false })}
        />
      )}

      {modalConteudo.open && (
        <ModalConteudo
          content={modalConteudo.item}
          onSave={handleSaveConteudo}
          onClose={() => setModalConteudo({ open: false, accordionId: '' })}
        />
      )}

      {modalCategoria.open && (
        <ModalCategoria
          category={modalCategoria.item}
          onSave={handleSaveCategoria}
          onClose={() => setModalCategoria({ open: false })}
        />
      )}

      {deleteModal?.open && (
        <ModalConfirmarExclusao
          title={
            deleteModal.type === 'accordion'
              ? 'Tem certeza que deseja excluir este accordion?'
              : deleteModal.type === 'categoria'
              ? 'Tem certeza que deseja excluir esta categoria?'
              : 'Tem certeza que deseja excluir este conteúdo?'
          }
          message={
            deleteModal.type === 'accordion'
              ? 'Ao confirmar, todos os vídeos e manuais associados a este conteúdo serão excluídos permanentemente.\nEsta ação não poderá ser desfeita.'
              : deleteModal.type === 'categoria'
              ? 'Ao confirmar, esta categoria será removida permanentemente.\nEsta ação não poderá ser desfeita.'
              : 'O conteúdo será removido permanentemente.\nEsta ação não poderá ser desfeita.'
          }
          confirmLabel={
            deleteModal.type === 'accordion'
              ? 'Excluir accordion'
              : deleteModal.type === 'categoria'
              ? 'Excluir categoria'
              : 'Excluir conteúdo'
          }
          onConfirm={() => {
            if (deleteModal.type === 'accordion') handleDeleteAccordion(deleteModal.id);
            else if (deleteModal.type === 'categoria') handleDeleteCategoria(deleteModal.id);
            else if (deleteModal.type === 'conteudo') handleDeleteConteudo(deleteModal.parentId!, deleteModal.id);
          }}
          onClose={() => setDeleteModal(null)}
        />
      )}
    </div>
  );
}
