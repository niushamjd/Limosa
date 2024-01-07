import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../style/SignUp.css';
import user_icon from '../assets/person.png';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0); // Track login attempts

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields must be filled in");
      return;
    }

    // Increment the number of login attempts
    setAttempts(attempts + 1);

    axios.post("http://localhost:3001/login", { email, password })
      .then(res => {
        console.log(res);

        if (res.data.status === "ok") {
          navigate('/home');
        } else if (attempts >= 10) {
          setError("Account locked. Too many unsuccessful login attempts.");
          res.data.status = "locked";
          res.data.error = "Too many unsuccessful login attempts.";
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  const [action, setAction] = useState("Login");

  const handleSignUpRedirect = () => {
    navigate('/signup');
  }

  return (
    <form className="container-1" onSubmit={handleSubmit}>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={user_icon} alt="" />
          <input type="email" placeholder="Email" autoComplete="off" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
      <div className="submit-container">
        <button type="submit" className={action === "Login" ? "submit gray" : "submit"} onClick={handleSignUpRedirect}>Sign Up</button>
        <button type="submit" className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => { setAction("Login") }}>Login</button>
      </div>
    </form>
  );
}

export default Login;
