import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/chatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { BsFillEyeFill, BsArrowLeft } from 'react-icons/bs';
import { getSender, getSenderFull } from '../config/chatLogic';
import ProfileModal from '../components/miscellaneous/ProfileModal';
import ScrollableChat from '../components/ScrollableChat.js'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import io from 'socket.io-client';

const ENDPOINT = window.location.origin;

var socket, selectedChatCompare, timer;

const SingleChat = ({fetchAgain, setFetchAgain}) => {


  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typingMsg, setTypingMsg] = useState("");


  const {user, selectedChat, setSelectedChat, notifications, setNotifications } = ChatState();

  const toast = useToast();

  const fetchMessages = async () =>{

    if(!selectedChat) return;

    try {
      
      const config = {
        headers:{
          Authorization : `Bearer ${user.token}`
        }
      }

      setLoading(true);

      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id)

    } catch (error) {
      
      toast(
        {
            
            title: 'Error Occured!',
            description: 'Failed to load the messages',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'bottom'
            
        }
        );

    }
  }
  const sendMessage = async (event) =>{

    if(event.key === 'Enter' && newMessage){

        try {
          
          const config = {
            headers:{
              'Content-Type' : 'application/json',
              Authorization : `Bearer ${user.token}`
            }
          }

          const { data } = await axios.post('/api/message', 
          {
            content: newMessage,
            chatId: selectedChat._id
          },
          config
          );


          socket.emit('new message', data);
          setMessages([...messages, data]);
          setFetchAgain(!fetchAgain);
          
        } catch (error) {
          
          toast(
            {
                
                title: 'Error Occured!',
                description: 'Failed to send the message',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
                
            }
            );
        }
    }else{
    socket.emit('typing', {selectedChat, user})
    }
  }

  useEffect(()=>{

    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connection', ()=>setSocketConnected(true));

  });

  useEffect(()=>{

    fetchMessages();
    selectedChatCompare = selectedChat;
    
  },[selectedChat]);



  useEffect(()=>{

    socket.on('message received', (newMessageReceived)=>{

      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
        
        if( !notifications.includes(newMessageReceived) ){
          setNotifications([newMessageReceived, ...notifications]);
        }

      }else{
        setMessages([...messages, newMessageReceived]);

      }

    });

    socket.on('typing recieved', (typingMsg)=>{
      setTypingMsg(typingMsg);

      if(timer){
        clearTimeout(timer);
      }

      timer = setTimeout(()=>{
        setTypingMsg("");
      },1000);

    })

  })

 
  return (
    <>
    {
      selectedChat ? (<>
      <Text 
        fontSize={{base: '28px', md:'30px'}}
        pb={3}
        px={2}
        width='100%'
        fontFamily='Work sans'
        display='flex'
        justifyContent={{base: 'space-between'}}
        alignItems='center'
      >
        <IconButton
        display={{base: 'flex', md: 'none'}}
        icon={<BsArrowLeft/>}
        onClick={()=>{
          setSelectedChat("");
          setFetchAgain(!fetchAgain);
        }
        }
        />

        {
          !selectedChat.isGroupChat ? (
          <>
          <span style={{fontFamily:'cursive'}}>
          {getSender(user, selectedChat.users)}
          </span>
          <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
          </>) 
          : 
          (<>
          {selectedChat.chatName.toUpperCase()}
          {<UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>}
          </>)
        }
      </Text>
      <Box 
        display='flex'
        flexDir='column'
        justifyContent='flex-end'
        p={3}
        bg='#E8E8E8'
        width='100%'
        height='100%'
        borderRadius='lg'
        overflowY='hidden'

      >
        {
          loading ? (<Spinner
          size='xl'
          width={20}
          height={20}
          alignSelf='center'
          margin='auto'
          />)
          :(<div style={{display: 'flex', flexDirection: 'column', height:"90%"}}>
            <ScrollableChat messages={messages}/>
            <span>{typingMsg}</span>
          </div>)
        }

        <FormControl onKeyDown={sendMessage} isRequired mt={3}>

          <Input
          id='input'
          variant='filled'
          bg='#E0E0E0'
          placeholder='Enter a message...'
          onChange={(e)=>setNewMessage(e.target.value)}
          value={newMessage}
          />

        </FormControl>
      </Box>
      </>) : (<Box
      display='flex' alignItems='center' justifyContent='center' height='100%'
      >
        <Text>
        Click on a User to Start Chatting
        </Text>
      </Box>)
    }
    </>
  )
}

export default SingleChat
