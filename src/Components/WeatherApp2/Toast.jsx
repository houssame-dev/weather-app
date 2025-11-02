import React, { useEffect } from "react";
import "./Toast.css";

export const Toast = ({ message, type = "error", onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div 
      className={`toast toast-${type}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        <button 
          className="toast-close" 
          onClick={onClose}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

