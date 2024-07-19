import React, { useState } from 'react';
import './style.css';
import Input from '../Input';
import Button from '../Button';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
function SignupSigninComponent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginForm, setLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);

  function signupWithEmail() {
    setLoading(true);
    console.log('Name', name);
    console.log('email', email);
    console.log('password', password);
    console.log('confirmPassword', confirmPassword);

    // Authenticate new user, or create a new account using email
    if (
      name !== '' &&
      email !== '' &&
      password !== '' &&
      confirmPassword !== ''
    ) {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log('User>>>', user);
            toast.success('User created!');
            setLoading(false);
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            createDoc(user);
            // Create a document with user id as following id
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
            // ..
          });
      } else {
        toast.error('Password and Confirm Password dont match');
      }
    } else {
      toast.error('All fields are mandatory');
      setLoading(false);
    }
  }
  function loginUsingEmail() {
    console.log('Email: ', email);
    console.log('password: ', password);
  }
  function createDoc(user) {
    // make sure doc with same uid doesnt exist
    // create a doc.
  }
  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login on <span style={{ color: 'var(--theme)' }}>KuberTrack.</span>
          </h2>
          <form>
            <Input
              type="email"
              label={'Email'}
              state={email}
              setState={setEmail}
              placeholder={'JohnDoe@gmail.com'}
            />
            <Input
              type="password"
              label={'Password'}
              state={password}
              setState={setPassword}
              placeholder={'Example@123'}
            />
            <Button
              disabled={loading}
              text={loading ? 'Loading...' : 'Login using Email and Password'}
              onClick={loginUsingEmail}
            />
            <p className="p-login">or</p>
            <Button
              disabled={loading}
              text={loading ? 'Loading...' : 'Login using Google'}
              blue={true}
            />
            <p
              className="p-login"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setLoginForm(!loginForm);
              }}
            >
              Or Dont Have An Account Already? Click Here
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign up on{' '}
            <span style={{ color: 'var(--theme)' }}>KuberTrack.</span>
          </h2>
          <form>
            <Input
              label={'Full Name'}
              state={name}
              setState={setName}
              placeholder={'John Doe'}
            />
            <Input
              type="email"
              label={'Email'}
              state={email}
              setState={setEmail}
              placeholder={'JohnDoe@gmail.com'}
            />
            <Input
              type="password"
              label={'Password'}
              state={password}
              setState={setPassword}
              placeholder={'Example@123'}
            />
            <Input
              type="password"
              label={'Confirm Password'}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={'Example@123'}
            />
            <Button
              disabled={loading}
              text={loading ? 'Loading...' : 'SignUp using Email and Password'}
              onClick={signupWithEmail}
            />
            <p className="p-login">or</p>
            <Button
              disabled={loading}
              text={loading ? 'Loading...' : 'SignUp using Google'}
              blue={true}
            />
            <p
              className="p-login"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setLoginForm(!loginForm);
              }}
            >
              Or Have An Account? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSigninComponent;
