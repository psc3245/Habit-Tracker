import { useEffect, useState } from "react";
import "../../Style/LoginSignUp.css";

export function onSignUpRequest({ username, password, email, dob }) {}

export default function SignUpMenu() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  // MM-DD-YYYY
  const [dob, setDob] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (month && day && year) {
      setDob(`${month}-${day}-${year}`);
      console.log(`${month}-${day}-${year}`);
    }
  }, [month, day, year]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !password || !dob) return;

    if (username.trim()) {
      const signupData = {
        username: username.trim(),
        password: password,
        email: email,
        dob: dob,
      };

      onSignUpRequest(signupData);

      setUsername("");
      setPassword("");
      setEmail("");
      setMonth("");
      setDay("");
      setYear("");
      setDob("");
    }
  };

  const handleCancel = () => {
    setUsername("");
    setPassword("");
    setEmail("");
  };

  return (
    <div className="login-container">
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
            <select
              name="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((m, i) => (
                <option key={i + 1} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>

            <select
              name="day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="year"
              value={year}
              placeholder="YYYY"
              onChange={(e) => {
                let val = e.target.value;
                if (val.length > 4) val = val.slice(0, 4);
                setYear(val);
              }}
            />
          </div>
        </div>

        <button type="submit" className="btn-login">
          Sign Up
        </button>
      </form>
    </div>
  );
}
