import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import * as UserHelper from "../Helpers/UserHelper.js";
import "../Style/ResetPasswordModal.css";

export default function ResetPasswordModal({ user, onClose, onSuccess }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    setPasswordsMatch(newPassword === confirmPassword && newPassword !== "");
  }, [newPassword, confirmPassword]);

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      await UserHelper.resetPassword(user.id, oldPassword, newPassword);
      onSuccess();
    } catch (err) {
      alert(err.message);
    }
  };

  return createPortal(
    <div className="reset-modal-overlay">
      <div className="reset-modal-content">
        <form onSubmit={resetPassword} className="reset-form">
          <div className="form-group">
            <label>Old Password</label>
            <input
              className="form-input"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              className="form-input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              className="form-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword && !passwordsMatch && (
              <p className="reset-error">Passwords must match!</p>
            )}
          </div>
          <div className="reset-acknowledge">
            <input
              type="checkbox"
              id="acknowledge"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            <label htmlFor="acknowledge">
              I acknowledge that this will irreversibly change my password.
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={!confirmed || !passwordsMatch}
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}