import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaSignOutAlt, FaUserCircle, FaPlus, FaTimes } from "react-icons/fa"; 
import { AuthContext } from "../context/AuthContext";
import PostForm from "./PostForm"; 
import "../CSS/Navbar.css"; 

const Navbar = ({ fetchPosts,  ref, setref }) => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="nav-left" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars className="menu-icon" />
        </div>

        <div className="nav-center">
          {user ? <span className="username">{user.username}</span> : "Social Media"}
        </div>

        <div className={`nav-right ${menuOpen ? "open" : ""}`}>
          {user ? (
            <div className="profile-dropdown" ref={dropdownRef}>
              <FaUserCircle
                className="nav-profile-icon"
                onClick={() => setDropdownOpen((prev) => !prev)}
              />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setIsModalOpen(true);
                      setDropdownOpen(false);
                    }}
                  >
                    <FaPlus className="dropdwon-icon" /> Create Post
                  </button>
                  <button className="dropdown-item" onClick={logout}>
                    <FaSignOutAlt className="dropdwon-icon" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="auth-button" onClick={() => setLoginModalOpen(true)}>Login</button>
            </>
          )}
        </div>
      </nav>

      {/* Create Post Modal */}
      <PostForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} fetchPosts={fetchPosts}  ref={ref} setref={setref} />

      {/* Login & Register Modal */}
      {loginModalOpen && (
        <div className="auth-modal">
          <div className="auth-modal-content">
            <span className="close-modal" onClick={() => setLoginModalOpen(false)}>
              <FaTimes />
            </span>
            <h2 className="welcome">Welcome Back!</h2>
            <p>Please login or register to continue.</p>
            <Link to="/login" className="modal-btn">Login</Link>
            <Link to="/register" className="modal-btn">Register</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
