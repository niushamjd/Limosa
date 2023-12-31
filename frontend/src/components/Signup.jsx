import { useState } from "react";
import { Link } from "react-router-dom";
import Login from "./Login";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post("http://localhost:3001/signup", {name, email, password})
    .then(res => {
      console.log(res)
      navigate('/login')
    })
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              autoComplete="off"
              name="name" // Corrected the name attribute
              className="form-control rounded-0"
              onChange={(e) => setName(e.target.value) }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off" // Corrected attribute name
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value) }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value) }
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Sign Up
          </button>
          </form>
          <p>Already Have an Account</p>
          <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
            Login
          </Link>
        
      </div>
    </div>
  );
}

export default Signup;
