import React, { useEffect, useRef } from "react";
import './Modal.css';
import useClickOutside from "../../hooks/useClickOutside";

const Modal = ({ children, onClose }) => {
  const modalRef = useRef();

  useClickOutside(modalRef, () => {
    onClose();
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} ref={modalRef}>
        <button className="modal-onClose" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
