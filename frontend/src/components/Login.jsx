import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './SignUp.css'
import user_icon from '../assets/person.png'
import email_icon from '../assets/email.png'
import password_icon from '../assets/password.png'




function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault()

    if ( !email || !password) {
      setError("All fields must be filled in");
      return; // Form gönderimini engelle
    }
    axios.post("http://localhost:3001/login", { email, password})
    .then(res => {
      console.log(res)
      if(res.data.status==="ok"){
        navigate('/home')
      }
    })
    .catch(err => {
      console.log(err)
    })
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
    {action === "Login" ? null : 
      <div className="input">
        <img src={user_icon} alt="" />
        <input type="text" placeholder="Name"
        autoComplete="off"
        onChange={(e) => setName(e.target.value) }/>
      </div>
    }      
    <div className="input">
      <img src={email_icon} alt="" />
      <input type="email" placeholder="Email"
      autoComplete="off"
      onChange={(e) => setEmail(e.target.value)}
      />
    </div>
    <div className="input">
      <img src={password_icon} alt="" />
      <input type="password" placeholder="Password"
      onChange={(e) => setPassword(e.target.value) }/>
    </div>
    {error && <div className="error-message">{error}</div>} {/* Hata mesajını göster */}
  </div>
  {action === "Sign Up" ? null : <div className="forget-password">Forget Password? <span>Click Here!</span></div>}
  
  <div className="submit-container">
    <button type="submit" className={action === "Login" ? "submit gray":"submit"} onClick={handleSignUpRedirect}>Sign Up</button>
    <button type="submit" className={action === "Sign Up" ? "submit gray":"submit"} onClick={() => {setAction("Login")}}>Login</button>
  </div>
</form>
  );
}

export default Login;
