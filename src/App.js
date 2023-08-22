import React, { useState } from 'react';
import './App.css';
import UserChat from './components/userChat';

function App() {
  const [button, setButton] = useState("Login");
  const [showUserTodo, setShowUserTodo] = useState(false);
  const [userId, setUserId] = useState(null);
  const [matter, setmatter]= useState("Do not have an account?");
  const [matterBtn, setmatterBtn] = useState("Register");
  const [username1,setusername1] = useState(null);
  const [password1,setpassword1] = useState(null);
  let username, password;

  const registerButton = () => {
    if(matterBtn==="Register"){
      setButton("Register");
      setmatterBtn("Login");
      setmatter("Already have an account?")
    }
    if(matterBtn==="Login"){
      setButton("Login");
      setmatterBtn("Register");
      setmatter("Do not have an account?")
    }
    
    
  }

  const buttonOperation = async () => {
    try {
      username = document.getElementById('username').value;
      password = document.getElementById('password').value;
      if (button === "Register") {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`https://chatapplicationbackend-production.up.railway.app/user/register`, {
          method: 'POST',
          body: formData,
        });
        const responseData = await response.json();
        if(responseData.message === "This user is in DataBase"){
          document.getElementById('msg').innerHTML = "We have an account with this Username if it was yours then try login.";
        }
        if (responseData.message === "One record has been added into users") {
          setUserId(responseData.userId);
          setusername1(username);
          setpassword1(password); 
          console.log(username,password)// Store the user ID in state
          setShowUserTodo(true);
          
        }

      }
      else if (button === "Login") {
        const response = await fetch(`https://chatapplicationbackend-production.up.railway.app/user/login/${username}/${password}`);
        const responseData = await response.json(); // Extract JSON data from response
        console.log(responseData); // Log the response data
      
        if (responseData.message === "This user is in DataBase") {
          setUserId(responseData.userId); 
          setusername1(username);
          setpassword1(password); 
          console.log(username,password)
          setShowUserTodo(true);
        } else if (responseData.message === "No records found") {
          setShowUserTodo(false);
          document.getElementById('msg').innerHTML = "No account is registered with the username and password you entered!!!";
        }
      }
      } catch (error) {
      console.log(error);
      }
      };
      

  return (
    <div className='total'>
      {showUserTodo ? (
        <UserChat userId={userId} username={username1} password={password1}/> 
      ) : (
        <div className='App'>
          <div className='auth'>
          <label>Username</label><br />
          <input type='text' id='username'/><br />
          <label>Password</label><br />
          <input type='password' id='password' /><br />
          <button onClick={buttonOperation}>
            {button}
          </button>
          <p id='msg'></p>
          <div id='registerDiv'>
            <p>{matter}</p>
            <button onClick={registerButton}>{matterBtn}</button>
          </div>
          </div>
        </div>
      )}
     
    </div>
  );
}

export default App;
