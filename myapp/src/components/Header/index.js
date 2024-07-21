import React, { useEffect, useState } from 'react';
import './style.css';
import {auth} from "../../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
function Header() {

  const [user,loading] = useState(auth);
  
  useEffect(()=>{
    if(user){
      navigate("/dashboard");
    }
  
  },{user,loading});

  function logoutFnc() {
    alert('Logout!');
  }
  return (
    <div className="navbar">
      <p className="logo">KuberTrack</p>
      {user && <p className="logo link" onClick={logoutFnc}>
        Logout
      </p>}
      
    </div>
  );
}

export default Header;
