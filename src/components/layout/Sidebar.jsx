import React, { useState, useEffect } from 'react';
import * as Icons from 'react-icons/tb';
import { Link, NavLink } from 'react-router-dom';
import navigation from '../../api/navigation.jsx';
import Logo from '../../images/common/logo.svg';

const Sidebar = () => {
  const [toggle, setToggle] = useState(null);
  const [sidebar, setSidebar] = useState(false);
  const [admin, setAdmin] = useState(false);

  const handleManu = (key) => {
    setToggle((prevToggle) => (prevToggle === key ? null : key));
  };

  const handleSidebar = () => {
    setSidebar(!sidebar);
  };

  const handleIsLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'admin') {
      setAdmin(true);
    }
  }, []);

  const filteredNavigation = admin
  ? navigation
  : navigation.filter(item => item.name !== 'Dashboard' && item.name !== 'Administration');


  return (
    <div className={`sidemenu ${sidebar ? 'active' : ''}`}>
      {/* Admin User */}
      <div className="sidebar_profile">
        <Link to="/" className="logo">
          <img src='/isineLogo.webp' alt="logo" />
        </Link>
        <h2 className="logo_text" style={{ marginRight: '0px', color: '#d4d4d4' }}>ISINE</h2>
        <Link className="navbar_icon menu_sidebar" onClick={handleSidebar}>
          <Icons.TbChevronsLeft className={`${sidebar ? 'active' : ''}`} />
        </Link>
      </div>
      {/* menu links */}
      <ul className="menu_main">
        {filteredNavigation.map((navigationItem, key) => (
          <li key={key}>
            {!navigationItem.subMenu ? (
              <NavLink
                to={`${navigationItem.url}`}
                className={`menu_link ${toggle === key ? 'active' : ''}`}
                onClick={() => handleManu(key)}
              >
                {navigationItem.icon}
                <span>{navigationItem.name}</span>
                {navigationItem.subMenu ? <Icons.TbChevronDown /> : ''}
              </NavLink>
            ) : (
              <div className="menu_link" onClick={() => handleManu(key)}>
                {navigationItem.icon}
                <span>{navigationItem.name}</span>
                {navigationItem.subMenu ? <Icons.TbChevronDown /> : ''}
              </div>
            )}
            {navigationItem.subMenu ? (
              <ul className={`sub_menu ${toggle === key ? 'active' : ''}`}>
                {navigationItem.subMenu.map((subNavigationItem, subKey) => (
                  <li key={subKey}>
                    <NavLink
                      to={`${navigationItem.url}${subNavigationItem.url}`}
                      className="menu_link"
                    >
                      {subNavigationItem.icon}
                      <span>{subNavigationItem.name}</span>
                      {subNavigationItem.subMenu ? <Icons.TbChevronDown /> : ''}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              ''
            )}
          </li>
        ))}
        <div
          className={`menu_link`}
          onClick={handleIsLogout}
        >
          <Icons.TbLogout className="menu_icon" />
          <span>Logout</span>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;
