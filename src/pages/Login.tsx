import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Gov.PE */}
      <header className="bg-[#0b3a6e] flex items-center px-8 py-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded flex items-center justify-center overflow-hidden">
            <div className="text-[10px] font-bold text-center leading-tight p-1">
              <span className="text-gray-700 block">GOVERNO</span>
              <div className="flex gap-0.5 justify-center">
                <span className="text-red-500 font-black text-sm">P</span>
                <span className="text-green-500 font-black text-sm">E</span>
                <span className="text-blue-500 font-black text-sm">R</span>
              </div>
              <div className="flex gap-0.5 justify-center">
                <span className="text-yellow-500 font-black text-sm">N</span>
                <span className="text-orange-500 font-black text-sm">A</span>
                <span className="text-purple-500 font-black text-sm">M</span>
              </div>
              <div className="flex gap-0.5 justify-center">
                <span className="text-blue-500 font-black text-sm">B</span>
                <span className="text-red-500 font-black text-sm">U</span>
                <span className="text-green-500 font-black text-sm">C</span>
                <span className="text-yellow-500 font-black text-sm">O</span>
              </div>
              <span className="text-gray-500 block text-[7px]">ESTADO DE MUDANÇA</span>
            </div>
          </div>
        </div>
        <h1 className="text-white text-xl font-normal tracking-wide">
          ACESSO <strong>GOV.PE</strong> (HOMOLOGAÇÃO)
        </h1>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center pt-16 bg-gray-50">
        <div className="bg-white rounded shadow-md w-[340px] overflow-hidden">
          {/* Blue top border */}
          <div className="h-1 bg-[#1a73d4]" />

          <div className="px-8 py-8 flex flex-col gap-4">
            <p className="text-center text-gray-600 text-sm mb-2">Entrar na sua conta</p>

            <button
              onClick={() => navigate('/portal')}
              className="w-full bg-[#1a73d4] hover:bg-[#1558b0] text-white font-medium py-2.5 px-4 rounded-full text-sm transition-colors"
            >
              Entrar com gov.br
            </button>

            <button
              onClick={() => navigate('/portal')}
              className="w-full bg-[#1a73d4] hover:bg-[#1558b0] text-white font-medium py-2.5 px-4 rounded-full text-sm transition-colors"
            >
              Entrar com expresso.pe
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
