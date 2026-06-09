import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'assistant',
  content:
    'Olá! 👋\n\nEstou aqui para ajudar você a utilizar o sistema com mais facilidade. Você pode fazer perguntas sobre funcionalidades, processos, formulários, cadastros e procedimentos.\n\nAlém disso, posso indicar documentos, manuais e vídeos relacionados ao assunto para que você encontre rapidamente a informação que precisa.',
};

const MOCK_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    // Pergunta: "Qual o passo a passo para abertura de chamado de um fluxo de aprovação?"
    keywords: ['passo a passo', 'passo', 'como abrir', 'como fazer', 'abertura de chamado'],
    response:
      'Para abrir um chamado com fluxo de aprovação, siga os passos abaixo:\n\n1. Acesse o sistema utilizando sua conta Gov.br ou Expresso (para servidores).\n2. Localize e selecione uma atividade que possua fluxo de aprovação.\n3. Informe o e-mail do gestor responsável pela aprovação da solicitação.\n4. Preencha os campos obrigatórios do formulário.\n5. Revise as informações fornecidas e envie a solicitação.\n6. Após o envio, o ticket será criado automaticamente e encaminhado para aprovação do gestor informado.\n\nPara mais detalhes, consulte os materiais abaixo:\n🎥 Vídeo: Abertura de Chamados com Fluxo de Aprovação\n📄 Manual: Fluxo de Aprovação – Passo a Passo\n\nPosso ajudar com mais alguma dúvida?',
  },
  {
    // Pergunta: "Quais atividades possuem fluxo de aprovação para abertura de chamado no Suporte Compras?"
    keywords: ['quais atividades', 'atividades possuem', 'quais', 'credencia pe', 'pe integrado', 'cadastro de usuário servidor'],
    response:
      'Atualmente, as seguintes atividades possuem fluxo de aprovação para abertura de chamados:\n\n• Credencia PE → Cadastro de Usuário\n• PE Integrado → Cadastro de Usuário Servidor\n\nAo selecionar uma dessas atividades, será necessário informar o e-mail do gestor responsável pela aprovação da solicitação. Após o envio do formulário, o chamado será encaminhado automaticamente para análise e aprovação.\n\nPara mais detalhes sobre o processo, consulte os materiais abaixo:\n🎥 Vídeo: Abertura de Chamados com Fluxo de Aprovação\n📄 Manual: Fluxo de Aprovação – Passo a Passo\n\nPosso ajudar com mais alguma dúvida?',
  },
  {
    // Pergunta: "Como acompanhar o status de uma solicitação?"
    keywords: ['acompanhar', 'acompanhamento', 'status', 'minhas solicitações', 'como acompanhar'],
    response:
      'Você pode acompanhar o status das suas solicitações diretamente pelo Suporte Compras.\n\nApós realizar o login no sistema, clique na opção "Minhas Solicitações", localizada no canto superior direito da tela inicial.\n\nNessa área, você poderá consultar todas as solicitações registradas, visualizar o status atual de cada uma e acompanhar sua evolução ao longo do fluxo de atendimento.\n\nCaso deseje mais informações, consulte os materiais abaixo:\n🎥 Vídeo: Acompanhamento de Solicitações\n📄 Manual: Consultando o Status de uma Solicitação\n\nPosso ajudar com mais alguma dúvida?',
  },
];

const DEFAULT_RESPONSE =
  'Desculpe, não encontrei informações específicas sobre esse assunto. Por favor, tente reformular sua pergunta ou consulte os materiais disponíveis no portal.\n\nPosso ajudar com mais alguma dúvida?';

function renderLine(line: string, j: number) {
  const videoMatch = line.match(/^(🎥\s*Vídeo:\s*)(.+)$/);
  const manualMatch = line.match(/^(📄\s*Manual:\s*)(.+)$/);

  if (videoMatch) {
    return (
      <p key={j}>
        <span>{videoMatch[1]}</span>
        <a href="#" className="text-[#2563eb] underline underline-offset-2 hover:text-[#1d4ed8]">
          {videoMatch[2]}
        </a>
      </p>
    );
  }

  if (manualMatch) {
    return (
      <p key={j}>
        <span>{manualMatch[1]}</span>
        <a href="#" className="text-[#2563eb] underline underline-offset-2 hover:text-[#1d4ed8]">
          {manualMatch[2]}
        </a>
      </p>
    );
  }

  return <p key={j}>{line}</p>;
}

function MessageBubble({ msg }: { msg: Message }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-[#4f46e5] text-white text-[14px] leading-[1.55] rounded-[20px] rounded-br-sm px-4 py-2.5 max-w-[85%]">
          {msg.content}
        </div>
      </div>
    );
  }

  const paragraphs = msg.content.split('\n\n');

  return (
    <div className="flex justify-start">
      <div className="bg-[#f0f4ff] text-[#1e293b] text-[14px] leading-[1.6] rounded-[16px] rounded-bl-sm px-4 py-3 max-w-[95%] space-y-2">
        {paragraphs.map((para, i) => {
          const lines = para.split('\n');
          return (
            <div key={i} className="space-y-0.5">
              {lines.map((line, j) => renderLine(line, j))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ChatAssistant({ open, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Limpa conversa após o painel fechar (aguarda animação)
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setMessages([INITIAL_MESSAGE]);
        setInput('');
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 350);
    }
  }, [open]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text };
    const q = text.toLowerCase();

    // Escolhe a resposta com maior número de keywords que batem
    let bestMatch = null;
    let bestScore = 0;
    for (const r of MOCK_RESPONSES) {
      const score = r.keywords.filter((k) => q.includes(k)).length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = r;
      }
    }

    const aiMsg: Message = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: bestMatch ? bestMatch.response : DEFAULT_RESPONSE,
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Side panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[380px] bg-white z-50 flex flex-col shadow-2xl border-l border-[#e2e8f0] transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-[#e2e8f0] shrink-0">
          <div className="w-[48px] h-[48px] rounded-full bg-[#4f46e5] flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#0f172a] font-semibold text-[15px] leading-tight">Assistente de dúvidas</p>
            <p className="text-[#6366f1] text-[12px] leading-snug mt-0.5">
              Encontre respostas, consulte materiais de apoio e receba orientações em tempo real.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-gray-100 transition-colors shrink-0 mt-0.5"
          >
            <X size={14} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 pb-3 pt-3 border-t border-[#e2e8f0] shrink-0">
          <div className="flex items-end gap-2 border border-[#e2e8f0] rounded-2xl px-4 py-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua dúvida"
              rows={3}
              className="flex-1 resize-none outline-none text-[14px] text-[#0f172a] placeholder:text-[#94a3b8] bg-transparent leading-relaxed max-h-[120px] overflow-y-auto"
            />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              input.trim()
                ? 'bg-[#4f46e5] hover:bg-[#4338ca] text-white'
                : 'bg-[#e2e8f0] text-[#94a3b8]'
            }`}
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-center text-[11px] text-[#94a3b8] mt-2">
          Respostas baseadas nos treinamentos carregados na aplicação
        </p>
      </div>
    </div>
    </>
  );
}
