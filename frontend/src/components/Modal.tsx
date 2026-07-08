import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  headerClassName?: string;
  className?: string;
}

export default function Modal({ open, onClose, title, children, headerClassName, className }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl w-full ${className || 'max-w-md'} mx-4`}>
        <div className={`w-full flex items-center justify-between px-6 py-4 rounded-t-lg ${headerClassName || 'bg-blue-600 text-white'}`}>
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="hover:opacity-80">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
