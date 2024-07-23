import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
      <div className="footer">
      	
      	<p>&copy; {new Date().getFullYear()} ISINE Website. All rights reserved.</p>
        <ul>
          <li>
            <Link to="/paid">Home</Link>
          </li>
        </ul>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
