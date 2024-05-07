import React, { useRef, useEffect, useContext, useCallback, useState } from "react";
import { Container, Row, Button } from "reactstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./header.css";
import { AuthContext } from "./../../context/AuthContext";
import heart from "../../assets/images/heartemoji.png";

const nav__links = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/featured",
    display: "Featured",
  },
  {
    path: "/new-itinerary",
    display: "New Itinerary",
  },
  {
    path:"/profile",
    display:"Profile"
  }
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const [friendRequests, setFriendRequests] = useState([]);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate('/home', { replace: true });  // Navigate to home page
    window.location.reload();  // Force a full page reload
    window.scrollTo(0, 0);
  };
  const fetchFriendRequests = useCallback(async () => {
    if (!user) return; // Add this line to safeguard against undefined user
  
    try {
      const response = await fetch(`http://localhost:4000/api/v1/users/${user._id}/friend-requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse.success) {
          setFriendRequests(jsonResponse.data);
        } else {
          throw new Error(jsonResponse.message);
        }
      } else {
        throw new Error('Failed to fetch friend requests');
      }
    } catch (error) {
      console.error('Error fetching friend requests: ' + error.message);
    }
  }, [user?._id]); // Note the use of optional chaining here
  

  useEffect(() => {
    let intervalId;
    if (user) {
      fetchFriendRequests(); // Fetch immediately when the component mounts or user logs in
      intervalId = setInterval(fetchFriendRequests, 3000); // Then every 3 seconds
    }

    return () => clearInterval(intervalId); // Clear the interval on component unmount or user logs out
  }, [user, fetchFriendRequests]);
  


  useEffect(() => {
    const handleScroll = () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add("sticky__header");
      } else {
        headerRef.current.classList.remove("sticky__header");
      }
    };
  
    window.addEventListener("scroll", handleScroll);
  
    // Return a function to remove the event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  


const toggleMenu = () => {
  menuRef.current.classList.toggle("show__menu");
};


  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between ">
            {/*=========logo */}
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <ul className="menu d-flex align-items-center gap-5">
              {nav__links.map((item, index) => (
  // Check if the user exists and if the item is "profile"
  !(!user && item.path === "/profile") && (
    <li className="nav__item" key={index}>
      <NavLink
        to={item.path}
        className={(navClass) =>
          navClass.isActive ? "active__link" : ""
        }
      >
        {item.display}
      </NavLink>
    </li>
  )
))}

              </ul>
            </div>
            <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-flex align-items-center gap-4">
                {user ? (
                  <>
                 <div>
  <h5 className="mb-0" style={{ margin: 0, padding: 0, display: 'inline-block' }}>{user.username}</h5>
  {user && friendRequests?.length > 0 && (
  <img
    src={heart}
    alt="Friend request"
    className="heart-icon"
    style={{ margin: 0, padding: 0, display: 'inline-block' }}
    onClick={() => navigate('/connect#friendRequestsSection')}
  />
)}

</div>
                    <Button className="btn btn-dark" onClick={logout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="btn secondary__btn">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button className="btn primary__btn">
                      <Link to="/register">Register</Link>
                    </Button>
                  </>
                )}
              </div>
              <span className="mobile__menu" onClick={toggleMenu}>
                <i class="ri-menu-line"></i>
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
