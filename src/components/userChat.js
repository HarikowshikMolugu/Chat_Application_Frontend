import React, { useState, useEffect, useRef } from 'react';
import './chat.css';
import {Routes,Route} from 'react-router-dom'
import NewChat from './NewChat';
import YourProfile from './Yourprofile';
import menu from '../menu.png';
function UserChat(props) {

  const [username1, setUsername1] = useState(props.username);
  const [password1, setPassword1] = useState(props.password);
  const [showChat, setShowChat] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [personalChat, setPersonalChat] = useState([]);
  const [storedchattedUserid, setStoredChattedUserId] = useState('');
  const [storedchattedusername, setStoredChattedUsername] = useState('');
  const [selectedChatId, setSelectedChatId] = useState(null); // Added state
  const messageContainerRef = useRef(null);
  const [showChatList,setshowChatList]= useState(true);
  const [showProfile,setshowProfile] =useState(true);
  const [searchData,setsearchData] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    getChatList();
  }, []);

  useEffect(() => {
    getChatList();
    const interval = setInterval(() => {
      getChatList();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (showChat) {
      const interval = setInterval(() => {
        openChat(storedchattedUserid);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [showChat, storedchattedUserid]);

  const getChatList = async () => {
    try {
      const response = await fetch(`https://chatapplicationbackend-production.up.railway.app/chat/getChatList/${props.userId}`);
      const responseData = await response.json();
      setChatList(responseData.chattedUserData);
    } catch (error) {
      console.log("Error in getting the Chatlist:", error);
    }
  }

  const openChatBox = async (chattedUserId, username) => {
    setStoredChattedUsername(username);
    openChat(chattedUserId);
    scrollToBottom();
  }

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  const openChat = async (chattedUserId) => {
    try {
      setStoredChattedUserId(chattedUserId);

      const response = await fetch(`https://chatapplicationbackend-production.up.railway.app/chat/getChat/${props.userId}/${chattedUserId}`);
      const responseData = await response.json();
      setShowChat(true);
      setPersonalChat(responseData.combinedList);
      setSelectedChatId(chattedUserId); // Set selected chat ID
    } catch (error) {
      console.log("error in opening chat:", error);
    }
  }

  const addChat = async (chattedUserId) => {
    try {
      const message = document.getElementById('message').value;
      const formData = new FormData();
      formData.append('message', message);

      const response = await fetch(`https://chatapplicationbackend-production.up.railway.app/chat/addChat/${props.userId}/${chattedUserId}`, {
        method: 'POST',
        body: formData,
      });
      document.getElementById('message').value = '';
      openChat(chattedUserId);
    } catch (error) {
      console.log("Error in sending message", error);
    }
  }
  const handleUsernameChange = (event) => {
    setUsername1(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword1(event.target.value);
  };

  const newChat = async()=>{
     setshowChatList(false);
     setshowProfile(false);
     
  }

  const yourProfile = async() =>{
    setshowChatList(false);
    setshowProfile(true);
    setsearchData([]);
   
  }
  const Back = async()=>{
    setshowChatList(true);
    setsearchData([]);
  }
  const Edit = () => {
    document.getElementById('saveDiv').style.display = 'block';
    document.getElementById('username12').readOnly = false; // Make input editable
    document.getElementById('password12').readOnly = false; // Make input editable
  };
  const Save = async () => {
    try {
      const usernameValue = username1;
      const passwordValue = password1;
      
      const formData = new FormData();
      formData.append('username', usernameValue);
      formData.append('password', passwordValue);
  
      const response = await fetch(`https://chatapplicationbackend-production.up.railway.app/user/updateuserDetails/${props.userId}`, {
        method: 'POST',
        body: formData,
      });
      const responseData = await response.json();
      if (responseData.message === "This user is in DataBase") {
        document.getElementById('usernameMsg').innerHTML = "Username Exits!!";
      }
      if (responseData.message === "UserDetails Updated Successfully") {
        document.getElementById('sucessMsg').innerHTML = "Profile Details Updated sucessfully!!";
        // No need to update the input fields here
      }
      document.getElementById('username12').readOnly = true; // Make input readonly again
      document.getElementById('password12').readOnly = true; // Make input readonly again
      document.getElementById('saveDiv').style.display = "none";
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    const SearchBtn = async () => {
      const searchUsername = searchFilter;
      console.log(searchUsername);
      if (searchUsername !== null && searchUsername !== '') {
        try {
          const response = await fetch(`https://chatapplicationbackend-production.up.railway.app/chat/search/${searchUsername}`);
          const responseData = await response.json();
          setsearchData(responseData);
        } catch (error) {
          console.log(error);
        }
      }else{
        setsearchData([]);
      }
    };
  
    SearchBtn();  // Call the function here
  
  }, [searchFilter]);
  
  


  return (
    <div className='chatTotal'>
      <div className='chatList'>
        <div className='header'>
          <div className='headerTitle'>
          <p className='title1'>Chat Application</p>
          </div>
          <div className='dropdown'>
            <p className='dropbtn'><img id='menu' src={menu}/></p>
            <div className='dropdown-content'>
              <p onClick={newChat}>New Chat</p>
              <p onClick={yourProfile} id='lastdrp'>Your Profile</p>
            </div>
          </div>
        </div>
         <div className='chatlistheaderdiv'><p>Your Chats</p></div>
        {showChatList ? (
          chatList.map((list) => (
            <div
              onClick={() => openChatBox(list.id, list.username)}
              className={`individualChat ${selectedChatId === list.id ? 'selectedChat' : ''}`}
              key={list.id}
            >
            <div className='profileIcon'>
              <div className='circle'></div>
            </div>
            <div className='userInfo'>
              <p>{list.username}</p>
              <p id='lastMsg'>{list.latestMessage}</p>
            </div>
            <div><p id='date'>{list.latestMessageCreatedAt.split(' ')[0].split('-').join('/')}</p></div>
            </div>
          ))
        ) : (
          showProfile ? (
            <div className='profiletotal'>
              <p id='backbtn' onClick={Back}>Back</p>
              <div className='profileContent'>
                <div>
                <div id='backAndEdit'>
                <p id='yourProfileText'>Your Profile</p>
                <button id='editProfileBtn' onClick={Edit}>Edit</button>
                </div>
              </div>
              <p><b>Your Username: </b><input type='text' id='username12' value={username1} onChange={handleUsernameChange} /></p>
              <p id='usernameMsg' style={{ color: 'red', fontSize: '13px' }}></p>
              <p><b>Your Password: </b><input type='text' id='password12' value={password1} onChange={handlePasswordChange} /></p>
       
             <p id='sucessMsg' style={{ color: 'red', fontSize: '13px' }}></p>
              <div id='saveDiv'>
                <button onClick={Save}>Save</button>
              </div>
              </div>
              </div>
          ) : (
            <div className='newChatTotal'>
              <p id='backbtn' onClick={Back}>Back</p>
              <div className='newChatContent'>
               <div className='searchDiv'>
                <input type='text' placeholder='Search for new one...' id='Searchinput' onChange={(e) => setSearchFilter(e.target.value)} ></input>
                {/* <button onClick={SearchBtn}>Search</button>/ */}
               </div>
               <div>
               {searchData && (
                <>
                {searchData.map((list) => (
                  <>
                  <div className='individualChat' style={{backgroundColor:'#25D366'}}>
                  <div className='profileIcon'>
                  <div className='circle'></div>
                  </div>
              
                <div className='userInfo' style={{flexDirection:'row',justifyContent:'space-between',paddingLeft:'0px'}}>
                  {list.id===props.userId?(
                    <p style={{color:'white',fontSize:'15px'}}>{list.username}(You)</p>
                  ):(
                    <p style={{color:'white',fontSize:'15px'}}>{list.username}</p>
                  )}
                 
                   <button onClick={()=>openChatBox(list.id,list.username)} id='chatBtn'>Chat</button>
                </div>
                </div>
                </>
                ))}
                </>
               )}
               </div>
              </div>
              </div>
          )
        )}
      </div>
      <div className='chatHistory'>
        {showChat && (
          <>
            <div className='chatHistoryTitle'>
              <p>{storedchattedusername}</p>
            </div>
            <div className='messageBox'>
            <div className='messageContainer' id='messageContainer' ref={messageContainerRef}>
  {personalChat.map((list, index) => {
    const currentDate = list.createdat.split(' ')[0].split('-').join('/');
    const previousDate =
      index > 0 ? personalChat[index - 1].createdat.split(' ')[0].split('-').join('/') : null;

    const displayDate = currentDate !== previousDate ? (
      <div className='dateDivider'>
        <p className='centeredText'>{currentDate}</p>
      </div>
    ) : null;

    return (
      
        <div key={list.id} className='datewith'>
          {displayDate && (
            <div className='dateDivider'>
              <p className='centeredText'>{currentDate}</p>
            </div>
          )}
          <div className={`message ${list.side === 'left' ? 'left' : 'right'}`}>
            <p style={{ fontWeight: '700' }}>{list.message}</p>
            <p id='time'>{list.createdat.split(' ')[1].substr(0, 5)}</p>
          </div>
        </div>
      );
      
  })}
              </div>
              <div className='inputContainer'>
                <input type='textarea' placeholder='Type message' id='message' />
                <button onClick={() => addChat(storedchattedUserid)}>Send</button>
              </div>
            </div>
          </>
        )}
      </div>
     
    </div>
  );
}

export default UserChat;
