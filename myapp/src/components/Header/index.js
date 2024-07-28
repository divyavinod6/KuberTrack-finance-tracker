import React, { useEffect } from 'react';
import './style.css';
import {auth} from "../../firebase";
import {useNavigate} from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import {signOut} from 'firebase/auth';
import { toast } from 'react-toastify';
function Header() {

  const [user,loading] = useAuthState(auth);
  const navigate = useNavigate();
  
  useEffect(()=>{
    if(user){
      navigate("/dashboard");
    }
  
  },{user,loading});

  function logoutFnc() {
    try {
      signOut(auth)
        .then(()=>{
          toast.success("Logout Successfully");
          navigate("/");
          // sign out successful
      })
        .catch((error)=>{
        // error happened
        toast.error(error.message);
      });
     
    } catch (error) {
      toast.error(error.message)
      
    }
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
