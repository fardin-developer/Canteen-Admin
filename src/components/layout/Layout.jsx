import Main from "./Main.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Sidebar from "./Sidebar.jsx";
import Login from "../../pages/login/Login.jsx";
import Signup from "../../pages/login/Signup.jsx";
import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import { Routes, Route, useNavigate } from "react-router-dom";

const Layout = () => {
  const isAuthenticated = useSelector(state => state.test.isAuthenticated);
  const test = useSelector(state => state.test.data);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(test)
    if (!isAuthenticated) {
      navigate("/login");
    }else{
      navigate("/payment/transactions");
    }
  }, [isAuthenticated,test]);

  return (
    <>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      ) : (
        <>
          <Sidebar />
          <div className="admin_body">
            <Navbar />
            <Main />
            <Footer />
          </div>
        </>
      )}
    </>
  );
};

export default Layout;