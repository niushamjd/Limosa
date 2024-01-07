import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Home from './components/Home';
import Signup from './components/SignUp';
import Login from './components/Login';
import logo from './assets/logo.png'; // Adjust the path to where your logo is saved.
import './style/App.css'; // Adjust the path if your App.css is in a different directory

function App() {
    return (
      <BrowserRouter>
        <Navbar  expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/home">
              <img
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="Limosa logo"
              />
              <span className="logo-text">Limosa</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/home" className="nav-link-text">Start Planning</Nav.Link>
                <Nav.Link as={Link} to="/community" className="nav-link-text">Community Trips</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link as={Link} to="/signup" className="nav-link-text">Sign Up</Nav.Link>
                <Nav.Link as={Link} to="/login" className="nav-link-text">Log In</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
  
        <Routes>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/community' element={<div>Community Trips</div>}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/login' element={<Login />}></Route>
          {/* Rest of your routes */}
        </Routes>
      </BrowserRouter>
    );
}

export default App;