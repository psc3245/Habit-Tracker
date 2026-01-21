import { useEffect, useState } from "react";
import "../../Style/LoginSignUp.css";

const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;

export default function SignUpMenu() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [dob, setDob] = useState("");
  const [user, setUser] = useState(null); // track logged-in user

  useEffect(() => {
    if (month && day && year) {
      const m = month.toString().padStart(2, "0");
      const d = day.toString().padStart(2, "0");
      setDob(`${year}-${m}-${d}`);
    }
  }, [month, day, year]);

  const onSignUpRequest = async ({ username, email, password, dob }) => {
    try {
      const res = await fetch(`${backend_base_url}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, pass: password, dob }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Signup failed");
      }

      const user = await res.json();
      setUser(user);
      console.log("Signed up user:", user);
      return user;
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !password || !dob) return;

    onSignUpRequest({
      username: username.trim(),
      password,
      email,
      dob,
    });

    setUsername("");
    setPassword("");
    setEmail("");
    setMonth("");
    setDay("");
    setYear("");
    setDob("");
  };

  const handleCancel = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setMonth("");
    setDay("");
    setYear("");
    setDob("");
  };

  return (
    <div className="login-container">
      {user ? (
        <p>Welcome, {user.username}!</p>
      ) : (
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="username-signup">Username</label>
            <input
              id="username-signup"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password-signup">Password</label>
            <input
              id="password-signup"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group dob-group">
            <label>Date of Birth</label>
            <div className="dob-row">
              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Month</option>
                {[
                  "January","February","March","April","May","June",
                  "July","August","September","October","November","December"
                ].map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>

              <select value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>

              <input
                type="number"
                value={year}
                placeholder="YYYY"
                onChange={(e) => {
                  let val = e.target.value.slice(0, 4);
                  setYear(val);
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn-login">Sign Up</button>
          {/* <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button> */}
        </form>
      )}
    </div>
  );
}
