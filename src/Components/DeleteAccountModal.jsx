import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "../Style/ResetPasswordModal.css";

export default function DeleteAccountModal({ user, onClose, handleDeleteAccount, onLogout }) {
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  return createPortal(
    <div className="reset-modal-overlay">
      <div className="reset-modal-content">
        <form onSubmit={(e) => { e.preventDefault(); handleDeleteAccount(user.id, password); onLogout(); }} className="reset-form">
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="reset-acknowledge">
            <input
              type="checkbox"
              id="acknowledge"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            <label htmlFor="acknowledge">
              I acknowledge that this will irreversibly delete my account.
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button
              type="submit"
              className="btn-delete-acc"
              disabled={!confirmed || !password}
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}