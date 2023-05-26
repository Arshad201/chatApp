import React, { useState } from 'react';
import { ChatState } from '../context/chatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer.js';
import MyChats from '../components/MyChats.js';
import ChatBox from '../components/ChatBox.js';

const ChatPage = () => {

  const { user } = ChatState();

  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{width: '100%'}}>
      {user && <SideDrawer/>}
      <Box display='flex' justifyContent='space-between' w='100%' height='91.5vh' p='10px'>
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default ChatPage
