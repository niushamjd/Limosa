import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/SignUp';
import Login from './components/Login';
import Profile from './components/Profile';
import Interest from './components/Interest';
import EditProfile from './components/EditProfile';
import logo from './assets/logo.png';
import './style/App.css';
import TravelGroup from './components/TravelGroup';
import TravelPlan from './components/TravelPlan';
function App() {
    const [isSignedIn, setIsSignedIn] = useState(true);
    
    const [travelData, setTravelData] = useState(null);

    const sampleTravelData = {
      destination: "İstanbul",
      dateRange: ["2024-01-10T21:00:00.000Z", "2024-02-07T21:00:00.000Z"],
      peopleGroup: "Solo",
      budget: "Luxury"
  };
  const updateTravelData = () => {
    setTravelData(sampleTravelData);
};
    const handleLogout = () => {
        // Burada kullanıcıyı çıkış yapmış olarak işaretleyin
        // ve gerekirse diğer temizleme işlemlerini yapın (örneğin token'ı silme)
        setIsSignedIn(false);

        // Çıkış işleminden sonra ana sayfaya veya uygun bir sayfaya yönlendirme yapabilirsiniz
        // navigate('/home'); // Eğer `useNavigate` hook'unu kullanıyorsanız
    };

    return (
      <BrowserRouter>
        <Navbar expand="lg">
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
                {/* Giriş yapıldıysa profil ve çıkış butonlarını göster */}
                {isSignedIn ? (
                  <>
                    <Nav.Link as={Link} to="/profile" className="nav-link-text">Profile</Nav.Link>
                    <Nav.Link as={Link} to="/" onClick={handleLogout} className="nav-link-text">Logout</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/signup" className="nav-link-text">Sign In</Nav.Link>
                    <Nav.Link as={Link} to="/login" className="nav-link-text">Log In</Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
  
        <Routes>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/community' element={<div>Community Trips</div>}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/profile' element={<Profile />}></Route>
          <Route path='/interest' element={<Interest />}></Route>
          <Route path='/editprofile' element={<EditProfile />}></Route>
          <Route path='/TravelGroup' element={<TravelGroup />}></Route>
          <Route path='/TravelPlan' element={<TravelPlan data={travelData} />} />
          {/* Rest of your routes */}
        </Routes>
      </BrowserRouter>
    );
}

export default App;
