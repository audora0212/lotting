// src/components/ConfirmationModal.js
import React from "react";
import styles from "@/styles/ConfirmationModal.module.scss";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p>{message}</p>
        <div className={styles.buttonContainer}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            예
          </button>
          <button onClick={onCancel} className={styles.cancelButton}>
            아니오
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
