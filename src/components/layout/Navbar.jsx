import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import * as Icons from "react-icons/tb";
import Input from '../common/Input.jsx';
import Profile from '../common/Profile.jsx';
import gravatar from 'gravatar-url';


const Navbar = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    role:''
  });
  const navigate=useNavigate()

  useEffect(() => {
    const localStorageUser = JSON.parse(localStorage.getItem('user'));
    if (localStorageUser) {
      setUser({
        username: localStorageUser.name,
        email: localStorageUser.email || "", // Ensure email is an empty string if undefined
        role: localStorageUser.role || "", // Ensure email is an empty string if undefined
      });
    }
  }, []);

  // Generate Gravatar URL
  const profileImageUrl = user.email ? gravatar(user.email, {
    size: 80, // Size of the avatar
    default: 'retro' // Default avatar if none is found
  }) : ''; // Provide an empty string or a default image URL if email is not available

  return (
    <div className="navbar">
      <div className="navbar_wrapper">
        <div className="container">
          <div className="navbar_main">
            <div></div>
            {/* <Input
              icon={<Icons.TbSearch />}
              placeholder="Search..."
              className="navbar_search"
            /> */}
            <div className="navbar_icons">
              {/* <Link className="navbar_icon">
                <Icons.TbLayoutGrid />
              </Link> */}
              <Link className="navbar_icon" to="/sales">
                <Icons.TbChartLine />
              </Link>
              <Link className="navbar_icon">
                <Icons.TbMessage2 />
              </Link>
              <Link className="navbar_icon">
                <Icons.TbSunHigh />
              </Link>
              <Profile
                name={user.username}
                slogan={user.role}
                className="admin_profile"
                src={profileImageUrl}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
