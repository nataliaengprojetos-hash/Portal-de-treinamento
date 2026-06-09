import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import videoSrc from '../assets/Vídeo- Abertura de chamado de requisição e incidente - Servidor.mp4';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function VideoModal({ open, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (!open && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/85 z-[60] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 flex items-center gap-1.5 text-white/80 hover:text-white text-[14px] transition-colors"
        >
          <X size={16} />
          Fechar
        </button>
        <video
          ref={videoRef}
          src={videoSrc}
          controls
          autoPlay
          className="w-full rounded-xl shadow-2xl bg-black"
          style={{ maxHeight: '80vh' }}
        />
      </div>
    </div>
  );
}
