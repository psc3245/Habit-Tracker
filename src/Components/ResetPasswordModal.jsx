import { useState, useEffect } from "react";
import * as UserHelper from "../Helpers/UserHelper.js";

export default function ResetPasswordModal({ user, onClose }) {
  const [confirm, setConfirm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const resetPassword = () => {};

  useEffect(() => {
    setPasswordsMatch(newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  return createPortal(
    <div>
      <form onSubmit={resetPassword}>
        <div>
          <label> Old Password </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
          />
        </div>
        <div>
          <label> New Password </label>
          <input type="password"
          value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }} />
            {passwordsMatch && (<p>New Passwords Must Match!</p>)}
        </div>
        <div>
          <label> Confirm New Password </label>
          <input type="password" 
          value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}/>
            {passwordsMatch && (<p>New Passwords Must Match!</p>)}
        </div>
        <input type="checkbox" />
        <p> I Ackowledge that this action will irreversibly change my password.</p>
        <button
          type="submit"
          onClick={() => {
            UserHelper.resetPassword(user.id, oldPassword, newPassword);
          }}
          disabled={!passwordsMatch}
        >
          {confirm ? "RESET PASSWORD" : "YES I'M SURE"}
        </button>
      </form>
    </div>,
    document.body,
  );
}
