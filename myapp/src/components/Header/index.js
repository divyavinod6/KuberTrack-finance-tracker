import React, { useEffect } from 'react';
import './style.css';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import userImg from '../../assets/user.svg';

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('User in Header:', user); // debiggin the user object
    if (user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  function logoutFnc() {
    alert('Logout!');
    try {
      signOut(auth)
        .then(() => {
          toast.success('Logged Out Successfully!!!');
          navigate('/');
          // sign out done successfully
        })
        .catch((error) => {
          // error happened
          toast.error(error.message);
        });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="navbar">
      <p className="logo">KuberTrack.</p>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src={user.photoURL ? user.photoURL : userImg}
            alt="userImage"
            style={{ borderRadius: '50%', height: '1.5rem', width: '1.5rem' }}
          />

          <p className="logo link" onClick={logoutFnc}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
}

export default Header;
