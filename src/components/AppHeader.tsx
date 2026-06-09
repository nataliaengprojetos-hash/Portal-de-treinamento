import { ChevronLeft, Globe, User } from 'lucide-react';
import logoPernambuco from '../assets/adm.png';
import { useNavigate } from 'react-router-dom';

interface AppHeaderProps {
  activeTab: string;
  onSidebarToggle: () => void;
}

export default function AppHeader({ activeTab, onSidebarToggle }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="shrink-0">
      {/* Top bar */}
      <div className="flex items-center justify-between h-[52px] bg-white border-b border-[#ededed] shadow-[0_2px_2px_rgba(0,0,0,0.25)] px-4">
        <button
          onClick={onSidebarToggle}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#f7f7f7] text-[#0074c8] text-sm h-full"
        >
          Central de Serviços Internos
        </button>
        <div className="flex items-center gap-3">
          <Globe size={24} className="text-gray-500" />
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={16} className="text-gray-600" />
          </div>
        </div>
      </div>

      {/* Logo bar */}
      <div className="bg-white px-4 py-2 h-[78px] flex items-center">
        <img
          src={logoPernambuco}
          alt="Secretaria de Administração - Governo de Pernambuco"
          className="h-[62px] w-auto cursor-pointer object-contain"
          onClick={() => navigate('/portal')}
        />
      </div>

      {/* Breadcrumb bar */}
      <div className="bg-white border border-[#d7d7d7] h-[54px] flex items-center px-4 justify-between">
        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-[18px]">
          <ChevronLeft size={18} />
          Portal de Treinamento
        </button>
        <div className="flex gap-4 text-sm text-gray-500">
          <button
            onClick={() => navigate('/portal')}
            className="hover:text-[#147bd1] transition-colors"
          >
            {activeTab}
          </button>
        </div>
      </div>
    </div>
  );
}
