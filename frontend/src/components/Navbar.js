import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa"; // Import Icons
import { AuthContext } from "../context/AuthContext";
import PostForm from "./PostForm"; // Import PostForm component
import "../CSS/Navbar.css"; // Import CSS file

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showPostForm, setShowPostForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // For responsive menu

  return (
    <>
      <nav className="navbar">
        {/* Left Side - Hamburger Icon */}
        <div className="nav-left" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars className="menu-icon" />
        </div>

        {/* Center - User Name */}
        <div className="nav-center">
          {user ? <span className="username">{user.username}</span> : null}
        </div>

        {/* Right Side - Post & Logout */}
        <div className={`nav-right ${menuOpen ? "open" : ""}`}>
          {user ? (
            <>
              <button
                className="post-button"
                onClick={() => setShowPostForm(!showPostForm)}
              >
                Post
              </button>
              <button className="logout-button" onClick={logout}>
                <FaSignOutAlt className="logout-icon" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">
                Login
              </Link>
              <Link to="/register" className="register-link">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Show Post Form when 'Post' button is clicked */}
      {showPostForm && <PostForm />}
    </>
  );
};

export default Navbar;
