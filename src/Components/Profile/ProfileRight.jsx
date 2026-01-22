import "../../Style/Profile.css";

export default function ProfileRight({ user, onLogout }) {
  if (!user) return null;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Date of Birth:</strong> {user.dob}</p>
      <button onClick={onLogout} className="btn-logout">Logout</button>
    </div>
  );
}
