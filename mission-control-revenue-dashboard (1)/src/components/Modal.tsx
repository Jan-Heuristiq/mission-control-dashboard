import { FC, ReactNode } from 'react';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title: string;
};

export const Modal: FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" aria-modal={true} role="dialog" onClick={onClose}>
            <div className="bg-[#FFFEFB] rounded-xl shadow-lg p-6 border border-[#F5F4EF] w-full max-w-md" onClick={ev => ev.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-[#1A1A1A]">{title}</h3>
                    <button onClick={onClose} className="text-2xl text-[#929A8A] hover:text-[#1A1A1A]" aria-label="Close modal">×</button>
                </div>
                {children}
            </div>
        </div>
    );
};
