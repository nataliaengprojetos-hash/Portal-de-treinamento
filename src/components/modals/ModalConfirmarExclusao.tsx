import { X } from 'lucide-react';

interface Props {
  title?: string;
  message?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ModalConfirmarExclusao({
  title = 'Tem certeza que deseja excluir este accordion?',
  message = 'Ao confirmar, todos os vídeos e manuais associados a este conteúdo serão excluídos permanentemente.\nEsta ação não poderá ser desfeita.',
  confirmLabel = 'Excluir accordion',
  onConfirm,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] w-[486px] p-[21px] flex flex-col gap-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
        >
          <X size={14} className="text-gray-600" />
        </button>

        {/* Title */}
        <p className="font-medium text-[16px] text-[#0f172a] leading-[22.8px] pr-8">
          {title}
        </p>

        {/* Message */}
        <p className="text-[14px] text-black leading-[20px] whitespace-pre-line">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-[42px] border border-[#cfcaca] bg-white rounded-[14px] text-[#464646] font-medium text-[14px] hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-[42px] bg-[#fd5353] hover:bg-[#e84444] rounded-[14px] text-white font-medium text-[14px] transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
