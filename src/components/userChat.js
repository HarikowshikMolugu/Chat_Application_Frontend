import React, { useState, useEffect, useRef } from 'react';
import './chat.css';
import {Routes,Route} from 'react-router-dom'
import api from '../api';
import menu from '../menu.png';
import chatpic from "./chat.png";
import unseen from './unsee_tick.png';
import seen from './seen_tick.png';
import eyeopen from './eyeopen.png';
import eyeclose  from './eyeclose.png';
import back from './back.png';
import send from './send.png';
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
  const encrypttxt = "(end-to-end encrypted)";
  const [passType, setpassType] = useState("password");
  const [eyeType,seteyeType] = useState(eyeclose);

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

  useEffect(() => {
    if (showChat) {
      // Call updateMessages when showChat is true
      updateMessages(storedchattedUserid);

      const interval = setInterval(() => {
        getChatList();
        updateMessages(storedchattedUserid); // Also update periodically
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [showChat, storedchattedUserid]);

  const getChatList = async () => {
    try {
      const response = await api.get(`/chat/getChatList/${props.userId}`);
      const responseData = await response.data;
      setChatList(responseData.data);
    } catch (error) {
      console.log("Error in getting the Chatlist:", error);
    }
  }
  
 

  const openChatBox = async (chattedUserId, username) => {
    document.getElementById('chatHistory').setAttribute('data-show', 'true');
    setStoredChattedUsername(username);
    updateMessages(chattedUserId);
    openChat(chattedUserId);
    scrollToBottom();
  }
  

  
  

  useEffect(() => {
    scrollToBottom();
  }, [personalChat]);
  
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };
  const updateMessages = async (chattedUserId)=>{
    try{
    await api.post(`/chat/update/messageSeen/${chattedUserId}/${props.userId}`)
    }catch(error){
      console.log("Error in updating unseen to seen",error);
    }
  }

  const openChat = async (chattedUserId) => {
    try {
      setStoredChattedUserId(chattedUserId);

      const response = await api.get(`/chat/getChat/${props.userId}/${chattedUserId}`);
      const responseData = await response.data;
      setShowChat(true);
      setPersonalChat(responseData.combinedList);
      setSelectedChatId(chattedUserId); // Set selected chat ID
    } catch (error) {
      console.log("error in opening chat:", error);
    }
  }

  const addChat = async (chattedUserId) => {
    const message = document.getElementById('message').value;
  
    if (message !== '') {
      try {
        const formData = new FormData();
        formData.append('message', message);
  
        await api.post(`/chat/addChat/${props.userId}/${chattedUserId}`, {
          message: message,
        });
  
        document.getElementById('message').value = '';
        openChat(chattedUserId);
        scrollToBottom(); // Scroll to the bottom after adding a new message
      } catch (error) {
        console.log('Error in sending message', error);
      }
    }
  };
  
  const handleUsernameChange = (event) => {
    setUsername1(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword1(event.target.value);
  };

  const newChat = async()=>{
    setsearchData([]);
     setshowChatList(false);
     setshowProfile(false);
     
  }

  const yourProfile = async() =>{
    setshowChatList(false);
    setshowProfile(true);
    setsearchData([]);
   
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
      
      
  
      const response = await api.post(`/user/updateuserDetails/${props.userId}`, {
        username:usernameValue,
        password:passwordValue
      });
      const responseData = await response.data;
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
          const response = await api.get(`/chat/search/${searchUsername}`);
          const responseData = await response.data;
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
  
  
  const backimgFun = () => {
    document.getElementById('chatHistory').setAttribute('data-show', 'false');
  }

  return (
    <div className='chatTotal'>
      <div className='chatList'>
        <div className='header'>
          <div className='headerTitle'>
          <p className='title1'><span><img id='titlepic' src={chatpic}></img></span>InfiniTalk</p>
          <p  className="encrypt" >{encrypttxt}</p>
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
             {list.username.length <= 15 ? (
             <p>{list.username}</p>
             ) : (
            <p>{list.username.slice(0, 15)}...</p>
            )}
            {list.side==='right'?(
              <>
              {list.status==="Seen"?(
                <>
                {list.message.length <= 25 ? (
                  <div style={{display:'flex',flexDirection:'row',marginLeft:'10px',justifyContent:'normal',marginTop:'5px'}}>
             <img id='tickimg'   src={seen} alt='Seen'></img>
             <p id='lastmsg' style={{paddingLeft:'0px'}}>{list.message}</p>
             </div>
             ) : (
              <div style={{display:'flex',flexDirection:'row',marginLeft:'10px',justifyContent:'normal',marginTop:'5px'}}>
             <img id='tickimg' src={seen} alt='Seen'></img>
            <p id='lastmsg' style={{paddingLeft:'0px'}}>{list.message.slice(0, 25)}...</p>
            </div>
            )}
                </>
              ):(
                <>
                {list.message.length <= 25 ? (
                  <div style={{display:'flex',flexDirection:'row',marginLeft:'10px',justifyContent:'normal',marginTop:'5px'}}>
             <img id='tickimg' src={unseen} alt='Seen'></img>
             <p id='lastmsg' style={{paddingLeft:'0px'}}>{list.message}</p>
             </div>
             ) : (
              <div style={{display:'flex',flexDirection:'row',marginLeft:'10px',justifyContent:'normal',marginTop:'5px'}}>
             <img id='tickimg' src={unseen} alt='Seen'></img>
            <p id='lastmsg' style={{paddingLeft:'0px'}}>{list.message.slice(0, 25)}...</p>
            </div>
            )}
                </>
              )}
              </>
            ):(
              <>
              {list.status==="Seen"?(
                <>
                {list.message.length <= 25 ? (
                  
             <p id='lastmsg' style={{marginTop:'5px'}}>{list.message}</p>
            
             ) : (
              
            <p id='lastmsg' style={{marginTop:'5px'}}>{list.message.slice(0, 25)}...</p>
           
            )}
                </>
              ):(
                <>
                {list.message.length <= 25 ? (
                  
             <p id='lastmsg' style={{color:'#25d366',fontWeight:'700',marginTop:'5px'}}>{list.message}</p>
             
             ) : (
           
             
            <p id='lastmsg' style={{color:'#25d366',fontWeight:'700',marginTop:'5px'}}>{list.message.slice(0, 25)}...</p>
            
            )}
                </>
              )}
              </>
            )}
          
           </div>

            <div><p id='date'>{list.createdat.split(' ')[0].split('-').join('/')}</p></div>
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
              <p><b>Your Password: </b>
              <div style={{display:'flex',flexDirection:'row',position:'relative'}}>
              <input type={passType} id='password12' value={password1} onChange={handlePasswordChange} />
              <img src={eyeType} style={{height:'20px',width:'20px',cursor:'pointer',marginTop:'10px',position:'absolute',marginRight:'5px',right:'0'}} onClick={showPassword} alt='eye'></img>
              </div>
              </p>
       
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
              
                  <div className='userInfo' style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: '0px' }}>
                  {list.id === props.userId ? (
                    <p style={{ color: 'white', fontSize: '15px' }}>{list.username.length <= 17 ? list.username : `${list.username.slice(0, 17)}...`} (You)</p>
                  ) : (
                    <p style={{ color: 'white', fontSize: '15px' }}>{list.username.length <= 17 ? list.username : `${list.username.slice(0, 17)}...`}</p>
                  )}

                  <button onClick={() => openChatBox(list.id, list.username)} id='chatBtn'>
                    <img style={{ marginRight: '0' }} id='titlepic' src={chatpic} alt='Chat Icon' />
                  </button>
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
      <div className='chatHistory' id='chatHistory' data-show="false">
        {showChat && (
          <>
            <div className='chatHistoryTitle'>
              <div id='backimagDiv'>
              <img  id="backimg"  src={back} onClick={backimgFun}></img>
              </div>
              <div id='chatHistoryUsername'>
              <p>{storedchattedusername}</p>
              </div>
              
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
            <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
            <p id='time'>{list.createdat.split(' ')[1].substr(0, 5)}</p>
            {list.side==="right"&&(
              <>
            {list.status==="Unseen"?(
            <img id='tickimg' src={unseen} alt='Unseen'></img>
            ):(
              <img id='tickimg' src={seen} alt='Seen'></img>
            )}
            </>
          )}
            </div>
          </div>
        </div>
      );
      
  })}
              </div>
              <div className='inputContainer'>
                <input type='textarea' placeholder='Type message' id='message' />
                <button onClick={() => addChat(storedchattedUserid)}><img style={{height:'15px',width:'15px'}} src={send}></img></button>
              </div>
            </div>
          </>
        )}
      </div>
     
    </div>
  );
}

export default UserChat;
