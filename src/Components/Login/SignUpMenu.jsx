import { useState } from "react";
import "../../Style/LoginSignUp.css";

export function onSignUpRequest({username, password, email, dob}) {
    
}

export default function SignUpMenu() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  // MM-DD-YYYY
  const [dob, setDob] = useState("");
  var [month, day, year] = [0, 0, 0];


  const handleSubmit = (e) => {
    e.preventDefault();
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
              autoFocus
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
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="password-signup">Password</label>
            <input
              id="password-signup"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Date of Birth</label>
            <select name="month" id="month"
            type="number"
            value={month}
            onChange={(e) => {
                month = Number(e);
                setDob(month.toString() + "-" + day.toString() + "-" + year.toString());
            }}
            >
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
            </select>
            <select name="day" id="day"
            type="number"
            value={day}
            onChange={(e) => {
                day = Number(e);
                setDob(month.toString() + "-" + day.toString() + "-" + year.toString());
            }}
            >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
            </select>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => {
                  year = Number(e.value);
                  setDob(month.toString() + "-" + day.toString() + "-" + year.toString());
                  console.log(dob);
              }}
            />
          </div>
          <button type="submit" className="btn-login">
              Login
          </button>
      </form>
    </div>
  )

};