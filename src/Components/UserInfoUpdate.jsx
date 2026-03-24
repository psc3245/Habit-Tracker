import { useState, useEffect } from "react";
import "../Style/UserInfoUpdate.css";
import * as UserHelper from "../Helpers/UserHelper.js";

export default function UserInfoUpdate({ user, setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");

  const dob =
    month && day && year
      ? `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
      : "";

  const handleSubmit = () => {
    UserHelper.updateUser({
      userId: user.id,
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      dob: dob,
    });
  };

  useEffect(() => {
    setUsername(user.username);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    if (user.date_of_birth) {
      const [year, month, day] = user.date_of_birth.split("T")[0].split("-");
      setMonth(parseInt(month));
      setDay(parseInt(day));
      setYear(year);
    }
  }, [user]);

  const hasChanges = !UserHelper.compareNewAndOldInfo(user, {
    username,
    firstName,
    lastName,
    email,
    dob,
  });

  useEffect(() => {
    if (month && day && year) {
      const m = month.toString().padStart(2, "0");
      const d = day.toString().padStart(2, "0");
      // setDob(`${year}-${m}-${d}`);
    }
  }, [month, day, year]);

  const resetPassword = () => {};

  return (
    <div className="user-update-div">
      <form onSubmit={handleSubmit} className="user-update-form">
        <div className="form-group">
          <p className="user-update-form-label">
            <strong> Username </strong>
          </p>
          <input
            className="form-input"
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>

        <div className="form-group">
          <p className="user-update-form-label">
            <strong> Email </strong>
          </p>

          <input
            className="form-input"
            id="email"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        <div className="form-group">
          <p className="user-update-form-label">
            <strong> Name </strong>
          </p>
          <div className="dob-row">
            <input
              className="form-input"
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <input
              className="form-input"
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="form-group dob-group">
          <p className="user-update-form-label">
            <strong> Date of Birth </strong>
          </p>

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
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-submit"
            disabled={!hasChanges}
          >
            Save Changes
          </button>
        </div>
      </form>

      <button type="button" className="btn-reset" onClick={resetPassword}>
        {" "}
        <strong>RESET PASSWORD</strong>{" "}
      </button>
    </div>
  );
}
