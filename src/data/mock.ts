import type { Accordion, TrainingCategory, FeaturedContent } from '../types';

export const featuredContent: FeaturedContent = {
  id: 'featured-1',
  title: 'Visão Geral da Aplicação',
  subtitle: 'Como preencher formulários',
  type: 'video',
  duration: '8 min',
  categoryId: 'cat-1',
};

export const trainingCategories: TrainingCategory[] = [
  { id: 'cat-1', name: 'Treinamentos Fornecedores', groups: ['Fornecedores', 'Servidores'] },
  { id: 'cat-2', name: 'Treinamentos Gestor', groups: ['Gestores', 'Servidores'] },
  { id: 'cat-3', name: 'Treinamentos ADM Aprovador', groups: ['ADM', 'Aprovadores'] },
  { id: 'cat-4', name: 'Treinamentos N1', groups: ['N1', 'Suporte'] },
  { id: 'cat-5', name: 'Treinamentos N2', groups: ['N2', 'Suporte Avançado'] },
];

export const accordions: Accordion[] = [
  {
    id: 'acc-1',
    title: 'Relatórios e Análises',
    categoryId: 'cat-1',
    description: 'Visualize dados e métricas do sistema',
    contents: [
      { id: 'c1-1', title: 'Visão Geral da Aplicação', description: 'Como preencher formulários', type: 'video', duration: '8 min', featured: true },
      { id: 'c1-2', title: 'Manual de Relatórios', description: 'Guia completo para geração', type: 'manual', pages: '12 páginas' },
    ],
  },
  {
    id: 'acc-2',
    title: 'Cadastro de Fornecedores',
    categoryId: 'cat-1',
    description: 'Passo a passo do cadastramento de fornecedores',
    contents: [
      { id: 'c2-1', title: 'Como Cadastrar um Fornecedor', description: 'Passo a passo do cadastramento', type: 'video', duration: '12 min' },
      { id: 'c2-2', title: 'Documentos Necessários', description: 'Lista de documentos para cadastro', type: 'manual', pages: '5 páginas' },
    ],
  },
  {
    id: 'acc-3',
    title: 'Aprovação de Solicitações',
    categoryId: 'cat-2',
    description: 'Como aprovar ou reprovar solicitações no sistema',
    contents: [
      { id: 'c3-1', title: 'Fluxo de Aprovação', description: 'Como aprovar ou reprovar solicitações', type: 'video', duration: '10 min' },
    ],
  },
  {
    id: 'acc-4',
    title: 'Gestão de Contratos',
    categoryId: 'cat-2',
    description: 'Monitoramento e controle de contratos ativos',
    contents: [
      { id: 'c4-1', title: 'Acompanhamento de Contratos', description: 'Monitoramento de contratos ativos', type: 'video', duration: '15 min' },
      { id: 'c4-2', title: 'Manual de Contratos', description: 'Guia de gestão contratual', type: 'manual', pages: '20 páginas' },
    ],
  },
  {
    id: 'acc-5',
    title: 'Administração do Sistema',
    categoryId: 'cat-3',
    description: 'Como gerenciar usuários e acessos',
    contents: [
      { id: 'c5-1', title: 'Perfis e Permissões', description: 'Como gerenciar usuários e acessos', type: 'video', duration: '20 min' },
    ],
  },
  {
    id: 'acc-6',
    title: 'Atendimento N1 — Suporte Básico',
    categoryId: 'cat-4',
    description: 'Como registrar e acompanhar chamados de suporte',
    contents: [
      { id: 'c6-1', title: 'Abertura de Chamados', description: 'Como registrar e acompanhar chamados', type: 'video', duration: '7 min' },
    ],
  },
  {
    id: 'acc-7',
    title: 'Atendimento N2 — Suporte Avançado',
    categoryId: 'cat-5',
    description: 'Técnicas de análise e resolução de problemas complexos',
    contents: [
      { id: 'c7-1', title: 'Diagnóstico de Problemas', description: 'Técnicas de análise e resolução', type: 'video', duration: '18 min' },
      { id: 'c7-2', title: 'Escalada de Chamados', description: 'Quando e como escalar para N3', type: 'manual', pages: '8 páginas' },
    ],
  },
  {
    id: 'acc-8',
    title: 'Configurações Avançadas',
    categoryId: 'cat-3',
    description: 'Como configurar parâmetros globais do sistema',
    contents: [
      { id: 'c8-1', title: 'Parâmetros do Sistema', description: 'Como configurar parâmetros globais', type: 'video', duration: '25 min' },
    ],
  },
];
