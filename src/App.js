import React, { useState } from 'react';
import './App.css';
import UserChat from './components/userChat';
import api from './api';
import eyeopen from './components/eyeopen.png';
import eyeclose from './components/eyeclose.png'; 

function App() {
  const [button, setButton] = useState("Login");
  const [showUserTodo, setShowUserTodo] = useState(false);
  const [userId, setUserId] = useState(null);
  const [matter, setmatter]= useState("Do not have an account?");
  const [matterBtn, setmatterBtn] = useState("Register");
  const [username1,setusername1] = useState(null);
  const [password1,setpassword1] = useState(null);
  const [passType, setpassType] = useState("password");
  const [eyeType,seteyeType] = useState(eyeclose);
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
    username = document.getElementById('username').value;
      password = document.getElementById('password').value;
      if(username!==''&&password!==''){
      if(username.length<16){
     
    try {
      
     
      if (button === "Register") {
       
      
        const response = await api.post(`/user/register`, {
          username:username,
          password:password
        });
        const responseData = await response.data;
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
      
        const response = await api.get(`/user/login/${username}/${password}`);
        const responseData = await response.data; // Extract JSON data from response
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
      
      
    }}catch (error) {
      console.log(error);
      }
    }else{
      document.getElementById('msg').innerHTML = "Username must be less than 15 characters!!";
    }
    }else{
      document.getElementById('msg').innerHTML = "Username and password should not be empty!!";
    }
    }

    const showPassword = async()=>{
      if(eyeType===eyeclose){
        seteyeType(eyeopen);
        setpassType('text');
      }else{
        seteyeType(eyeclose);
        setpassType('password');
      }
    }

  return (
    <div className='total'>
      {showUserTodo ? (
        <UserChat userId={userId} username={username1} password={password1}/> 
      ) : (
        <div className='App'>
          <div className='auth'>
            <p style={{color:'#128c7e',fontWeight:'700',fontSize:'25px'}}>{button}</p><br></br>
          <label>Username</label><br />
          <input type='text' id='username'/><br />
          <label>Password</label><br />
          <div style={{display:'flex',flexDirection:'row'}}>
          <input type={passType} id='password' /><br />
          <img src={eyeType} style={{height:'20px',width:'20px',cursor:'pointer',marginTop:'10px'}} onClick={showPassword} alt='eye'></img>
          </div>
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
