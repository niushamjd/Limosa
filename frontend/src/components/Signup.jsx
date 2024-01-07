import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../style/SignUp.css';
import user_icon from '../assets/person.png';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const navigate = useNavigate();
  const [action, setAction] = useState("Sign Up");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Boş alan kontrolü
    if (!name || !email || !password) {
      setError("All fields must be filled in");
      return; // Form gönderimini engelle
    }

    // Password strength requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }

    axios.post("http://localhost:3001/signup", { name, email, password })
      .then(res => {
        console.log(res);
        navigate('/login');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  }

  return (
    <form className="container-1" onSubmit={handleSubmit}>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Login" ? null : 
          <div className="input">
            <img src={user_icon} alt="" />
            <input type="text" placeholder="Name" autoComplete="off" onChange={(e) => setName(e.target.value)} />        
          </div>
        }    
        <div className="input">
          <img src={email_icon} alt="" />
          <input type="email" placeholder="Email" autoComplete="off" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
      {action === "Sign Up" ? null : <div className="forget-password">Forget Password? <span>Click Here!</span></div>}
    
      <div className="submit-container">
        <button type="submit" className={action === "Login" ? "submit gray" : "submit"}>Sign Up</button>
        <button type="submit" className={action === "Sign Up" ? "submit gray" : "submit"} onClick={handleLoginRedirect}>Login</button>
      </div>
    </form>
  );
}

export default Signup;
