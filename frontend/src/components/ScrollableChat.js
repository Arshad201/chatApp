import React, { useEffect } from 'react';
import { ChatState } from '../context/chatProvider';
import { isLastMessage, isSameSender } from '../config/chatLogic';
import { Avatar, Tooltip } from '@chakra-ui/react';


const ScrollableChat = ({ messages }) => {

    const { user } = ChatState();

    function scrollToBottom(){
      const msges = document.getElementById('msges');
      
      msges.scrollTop = msges.scrollHeight;
  }

  useEffect(()=>{
    scrollToBottom();    
  })

  return (
    <div id='msges' style={{height:'100%', overflow:'auto'}}>
      {messages && messages.map((m, i)=>{
        return <div style={{display: 'flex', marginBottom:'10px', flexDirection:'column'}} key={m._id} >
            <span 
            style={{
                backgroundColor: `${m.sender._id === user._id ? '#5B0FF0' : '#7C3FF3'} `,
                color: 'white',
                borderRadius: '20px',
                padding: '5px 15px',
                width: 'fit-content',
                maxWidth: '70%',
                marginLeft: `${m.sender._id === user._id ? '0px' : '45px'} `,
                alignSelf:  `${m.sender._id === user._id ? 'flex-end' : 'flex-start'} `
            }}
            >
                {m.content}
            </span>

            {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, m, i, user._id)) 
            && 
            (<Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                <Avatar
                mt='7px'
                ml={1}
                size='sm'
                cursor='pointer'
                marginTop='-33px'
                boxShadow='1px 1px 3px rgba(0,0,0,0.4)'
                name={m.sender.name}
                src={m.sender.pic}
                />
            </Tooltip>)}
            </div>
      })}
    </div>
  )
}

export default ScrollableChat
