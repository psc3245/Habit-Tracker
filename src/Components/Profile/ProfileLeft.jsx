import "../../Style/Profile.css";
import UserInfoUpdate from "../UserInfoUpdate.jsx";

export default function ProfileLeft({ user, setUser, onLogout }) {
  if (!user) return null;

  return (
    <div className="profile-container">
      <h2>Profile Page for {user.username}</h2>
      <UserInfoUpdate user={user} setUser={setUser}/>
    </div>
  );
}
