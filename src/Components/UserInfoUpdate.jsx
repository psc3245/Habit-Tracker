import { useState } from "react";
import "../Style/UserInfoUpdate.css";

export default function RequiredUserUpdate({
  user,
  setUser,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [dob, setDob] = useState("");

  const handleSubmit = (userData) => {
  };

  useEffect(() => {
    if (month && day && year) {
      const m = month.toString().padStart(2, "0");
      const d = day.toString().padStart(2, "0");
      setDob(`${year}-${m}-${d}`);
    }
  }, [month, day, year]);

  return (
    <div>
      <form onSubmit={handleSubmit} className="user-update-form">
          <div className="form-group">
            <label htmlFor="firstName"></label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
          </div>

        <div className="form-group">
          <label htmlFor="lastName"></label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
        </div>


        <div className="form-group">
          <label htmlFor="username"></label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>


        <div className="form-group">
          <label htmlFor="email"></label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        <div className="form-group dob-group">
          <label>Date of Birth</label>
          <div className="dob-row">
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
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

            <select value={day} onChange={(e) => setDay(e.target.value)}>
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
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

        <div className="modal-actions">
          <button type="button" onClick={handleSubmit} className="btn-submit">
            Enter
          </button>
        </div>
      </form>
    </div>
  );
}
