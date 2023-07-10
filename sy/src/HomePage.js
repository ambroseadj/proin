import React, { useState , useEffect} from 'react';
import axios from 'axios';

const HomePage = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [initialEmail, setInitialEmail] = useState('');
  useEffect(() => {
    setEmail(email); 
  }, []);


  const toggleSignupLogin = () => {
    setIsSignup(!isSignup);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };

    try {
      let response;
      if (isSignup) {
        response = await axios.post('http://localhost:3003/api/signup', userData);
        setSignupSuccess(true);
        setTimeout(() => {
          setSignupSuccess(false);
        }, 3000); 
      } else {
        response = await axios.post('http://localhost:3003/api/login', {
          email: email,
          password: password,
        });
        setIsLoggedIn(true);
      }

    
      console.log('Response:', response);
    } catch (error) {
      
      console.error('Error:', error);
    }
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

   if (email !== initialEmail) {
      setUpdateSuccess(false);
      setRedirectToLogin(true);
      return;
    }
    const loginData = {
      email: email,
      password: password,
    };
  
    try {
      const loginResponse = await axios.post('http://localhost:3003/api/login', loginData);
      const token = loginResponse.data.token;
  
      const updatedUserData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
      };
      
      const config = {
        headers: {
          Authorization: token,
        },
      };
  
      const updateResponse = await axios.put('http://localhost:3003/api/update', updatedUserData, config);
      
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
        setRedirectToLogin(true);
      }, 2000); 
      console.log('Update Response:', updateResponse);
    } catch (error) {
      
      console.error('Update Error:', error);
    }
  };
  
  if (redirectToLogin) {
    return (
      <div className="home-page">
        <div className="center-page">
          <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="input-container">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <button className="action-button" type="submit">
                Login
              </button>
            </form>
            <p>Don't have an account?</p>
            <button className="switch-button" onClick={toggleSignupLogin}>
              Signup
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="home-page">
        <div className="center-page">
          <div className="update-container">
            <h2 style={{textAlign:'center'}}>     Update Details</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <button className="action-button" type="submit">
                Update
              </button>
            </form>
          </div>
        </div>
        {updateSuccess && (
          <div className="hover-bar">
            <div className="popup">
              <p>Update successful!</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="center-page">
        <div className="login-container">
          <h2>{isSignup ? 'Signup' : 'Login'}</h2>
          <form onSubmit={handleFormSubmit}>
            {isSignup && (
              <>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div className="input-container">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <button className="action-button" type="submit">
              {isSignup ? 'Signup' : 'Login'}
            </button>
          </form>
          <p>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button className="switch-button" onClick={toggleSignupLogin}>
              {
            isSignup ? 'Login' : 'Signup'}
            </button>
          </p>
        </div>
      </div>
      {signupSuccess && (
        <div className="hover-bar">
          <div className="popup">
            <p>Signup successful!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
