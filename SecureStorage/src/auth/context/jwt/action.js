  'use client';

  import axios, { endpoints } from 'src/utils/axios';
  // const cors = require('cors');
  import { setSession,setError,setErrorMessage} from './utils';
  import { STORAGE_KEY } from './constant';
  import CryptoJS from 'crypto-js';
  

  /** **************************************
   * Sign in
   *************************************** */
  export const signInWithPassword = async ({ email, password }) => {
    try {
      // Login logic
      console.log("ss")
      const hashedPassword = CryptoJS.SHA256(password).toString();
      const response = await axios.post('http://localhost:5000/login', { email: email, password: hashedPassword }, endpoints.auth.signIn);
      localStorage.setItem('email', email);
      localStorage.setItem('userid', response.data.userid);
      console.log("ss")

      if (!response.data.userid) {
        throw new Error('Access token not found in response');
      }
      const params = { email: 'demo@minimals.cc', password: '@demo1' };
      const res = await axios.post(endpoints.auth.signIn, params);
      const { accessToken } = res.data;
      // const { accessToken } = response.data;
      setSession(accessToken);
      return response
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
      setErrorMessage(error.error)
      return error
    }
  };

  // import { useRouter } from 'next/router';  // Import the useRouter hook from next/router
  // // import { setSession, setErrorMessage } from './utils';

  // export const signInWithPassword = async ({ email, password }) => {
  //   const router = useRouter();  // Initialize the Next.js router

  //   try {
  //     // Login logic
  //     console.log("Logging in...");

  //     // Make the API request to the backend
  //     const response = await axios.post('http://localhost:5000/login', { email, password });

  //     // Store user info in localStorage
  //     localStorage.setItem('email', email);  // Save the email passed to the function
  //     localStorage.setItem('userid', response.data.userid);  // Save the user id from the response

  //     console.log("Login successful");

  //     // Clear error message if login is successful
  //     if (typeof setErrorMessage === 'function') {
  //       setErrorMessage('');
  //     }

  //     // Extract and store access token
  //     const { accessToken } = response.data;
  //     if (typeof setSession === 'function') {
  //       setSession(accessToken);  // Save the session or access token
  //     }

  //     // Navigate to the homepage after successful login
  //     router.push('/');  // Redirect to the home page (or any route you want)

  //   } catch (error) {
  //     console.error('Error during sign in:', error);
  //     if (typeof setErrorMessage === 'function') {
  //       setErrorMessage('Login failed, please try again.');
  //     }
  //     throw error;
  //   }
  // };





  /** **************************************
   * Sign up
   *************************************** */
  // Password validation function
  const isPasswordValid = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasSpecialCharacter && hasMinLength;
  };

  export const signUp = async ({ email, password, firstname, lastname }) => {
    
    const hashedPassword = CryptoJS.SHA256(password).toString();
    const params = {
      email: email,
      password: hashedPassword,
      firstname: firstname,
      lastname: lastname
    };

    try {
      // if (isPasswordValid(password)) {
        
        console.log('Rwara11111')
        if (firstname && lastname && password && email) {
          try {
            const response = await axios.post('http://localhost:5000/register', params);
            
            console.log('Rwara')
            console.log('response: ', response);
            return response
          } catch (error) {
            console.error('Error registering user:', error);
            return error
          }
        }
      // } else {
      //   // setErrorMessage('Password does not meet the required criteria.');
      //   console.log("12")
      // }

    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    }
  };


  export const resetPassword = async ({ email, password }) => {
    const params = {
      email,
      password
    };

    try {
      // if (isPasswordValid(password)) {
        
        console.log('Rwara11111')
        if ( password && email) {
          try {
            const response = await axios.post('http://localhost:5000/updatepassword', params);
            console.log("Api called");
            
            console.log('response: ', response);
            return response
          } catch (error) {
            console.error('Error changing user detail:', error);
            return error
          }
        }
      // } else {
      //   // setErrorMessage('Password does not meet the required criteria.');
      //   console.log("12")
      // }

    } catch (error) {
      console.error('Error during changing password:', error);
      throw error;
    }
  };


  /** **************************************
   * Sign out
   *************************************** */
  export const signOut = async () => {
    try {
      await setSession(null);
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };
