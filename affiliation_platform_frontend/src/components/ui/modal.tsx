import { IconX } from "@tabler/icons-react";
import * as React from "react";

interface ModalProps {
  children?: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-40 animate-fade-in   py-10">
      <div className="modal-container  ">
        <div className="modal-content bg-white shadow-md rounded-md relative animate-fade-in">
          <span
            className="close absolute top-5 right-5 cursor-pointer text-2xl "
            onClick={onClose}
          >
            <IconX />
          </span>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
