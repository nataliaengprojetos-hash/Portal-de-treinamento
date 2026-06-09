import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid, BookOpen, Settings, Users, FileText,
  ShoppingCart, BarChart2, Bell, HelpCircle, Search,
} from 'lucide-react';

const sidebarIcons = [
  { icon: LayoutGrid, label: 'Home' },
  { icon: ShoppingCart, label: 'Compras' },
  { icon: FileText, label: 'Contratos' },
  { icon: BarChart2, label: 'Relatórios' },
  { icon: Users, label: 'Usuários' },
  { icon: Settings, label: 'Configurações' },
  { icon: Bell, label: 'Notificações' },
  { icon: HelpCircle, label: 'Ajuda' },
];

interface SidebarProps {
  expanded: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ expanded }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isPortal = location.pathname === '/portal';
  const isAdmin = location.pathname === '/admin';

  return (
    <aside
      className="flex flex-col bg-white border-r border-[#eee] h-full transition-all duration-200"
      style={{ width: expanded ? 257 : 52 }}
    >
      {/* Icon strip */}
      <div className="flex flex-col items-center py-2 border-r border-[#eee]">
        {sidebarIcons.map(({ icon: Icon, label }) => (
          <button
            key={label}
            title={label}
            className="flex items-center justify-center w-full h-12 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Icon size={20} />
          </button>
        ))}
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="absolute left-[52px] top-[130px] w-[257px] bg-white border border-[#eee] h-full z-10 shadow-sm">
          {/* Search */}
          <div className="px-4 py-3 border-b border-[#eee]">
            <div className="flex items-center gap-2 border border-[#dcdfe3] rounded px-2 py-1.5">
              <Search size={14} className="text-gray-400" />
              <input
                className="text-sm text-gray-400 outline-none w-full placeholder:text-gray-400"
                placeholder="Pesquisar..."
              />
            </div>
          </div>

          {/* Menu items */}
          <nav className="py-2">
            <button
              onClick={() => navigate('/portal')}
              className={`w-full flex items-center px-4 py-2 text-sm transition-colors relative ${
                isPortal
                  ? 'text-[#147bd1] font-medium'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {isPortal && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#0b84d8] rounded-r" />
              )}
              <BookOpen size={16} className="mr-2 shrink-0" />
              Portal de Treinamento
            </button>

            <button
              onClick={() => navigate('/admin')}
              className={`w-full flex items-center px-4 py-2 text-sm transition-colors relative ${
                isAdmin
                  ? 'text-[#147bd1] font-medium'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {isAdmin && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#0b84d8] rounded-r" />
              )}
              <Settings size={16} className="mr-2 shrink-0" />
              Área Administrativa Portal de Treinamento
            </button>
          </nav>
        </div>
      )}
    </aside>
  );
}
