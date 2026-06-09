import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppHeader from './AppHeader';
import {
  LayoutGrid, ShoppingCart, FileText, BarChart2,
  Users, Settings, Bell, HelpCircle, Search, BookOpen,
} from 'lucide-react';

const sidebarIcons = [
  { icon: LayoutGrid },
  { icon: ShoppingCart },
  { icon: FileText },
  { icon: BarChart2 },
  { icon: Users },
  { icon: Settings },
  { icon: Bell },
  { icon: HelpCircle },
];

export default function AppLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab =
    location.pathname === '/admin' ? 'Área Administrativa' : 'Portal de Treinamento';

  const isPortal = location.pathname === '/portal';
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Icon strip */}
      <div className="flex flex-col bg-white border-r border-[#eee] w-[52px] shrink-0 z-20">
        {sidebarIcons.map(({ icon: Icon }, i) => (
          <button
            key={i}
            className="flex items-center justify-center h-12 w-full hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Icon size={20} />
          </button>
        ))}
      </div>

      {/* Expanded sidebar */}
      {sidebarExpanded && (
        <div className="w-[257px] shrink-0 border-r border-[#eee] bg-white flex flex-col">
          {/* Search */}
          <div className="px-4 py-3 border-b border-[#eee]">
            <div className="flex items-center gap-2 border border-[#dcdfe3] rounded px-2 py-1.5">
              <Search size={14} className="text-gray-400" />
              <input
                className="text-sm text-gray-400 outline-none w-full placeholder:text-gray-400 bg-transparent"
                placeholder="Pesquisar..."
              />
            </div>
          </div>

          {/* Nav items */}
          <nav className="py-2">
            <button
              onClick={() => navigate('/portal')}
              className={`w-full flex items-center px-4 py-2.5 text-sm transition-colors relative ${
                isPortal ? 'text-[#147bd1] font-medium' : 'text-gray-600 hover:bg-gray-50'
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
              className={`w-full flex items-center px-4 py-2.5 text-sm transition-colors relative ${
                isAdmin ? 'text-[#147bd1] font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {isAdmin && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#0b84d8] rounded-r" />
              )}
              <Settings size={16} className="mr-2 shrink-0" />
              <span className="text-left leading-tight">Área Administrativa Portal de Treinamento</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader
          activeTab={activeTab}
          onSidebarToggle={() => setSidebarExpanded((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
