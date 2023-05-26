import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/chatProvider';
import { Avatar, Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { GrAdd } from 'react-icons/gr';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/chatLogic';
import GroupChatModal from './miscellaneous/GroupChatModal.js'
import moment from 'moment';

const MyChats = ({fetchAgain}) => {

    const {user, selectedChat, setSelectedChat, chats, setChats} = ChatState();

    const toast = useToast();

    const fetchChats = async () =>{

        try {
            
            const config = {
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization : `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get('/api/chat', config);

            setChats(data);

        } catch (error) {
            toast(
                {
                    
                    title: 'Error Occured!',
                    description: 'Failed to loads the chats',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left'
                    
                }
                );
        }

    }

    useEffect(()=>{
        fetchChats();
    },[fetchAgain])

  return (
    <Box 
        display={{base: selectedChat ? 'none' : 'flex', md:'flex'}}
        flexDir='column'
        alignItems='center'
        p={3}
        bg='white'
        width={{base: '100%', md: '31%'}}
        borderRadius='lg'
        borderWidth='1px'
    >
        <Box
            pb={3}
            px={3}
            fontSize={{ base: '28px', md: '30px'}}
            fontFamily='Work sans'
            display='flex'
            width='100%'
            justifyContent='space-between'
            alignItems='center'
        >
            My Chats
            <GroupChatModal>
                <Button
                    display='flex'
                    fontSize={{ base: '17px', md: '10px', lg: '17px' }}
                    rightIcon={<GrAdd/>}
                    >
                    New Group Chat
                </Button>
            </GroupChatModal>

        </Box>
        <Box
            display='flex'
            flexDir='column'
            p={3}
            bg='#F8F8F8'
            width='100%'
            height='100%'
            borderRadius='lg'
            overflowY='hidden'
        >
            { chats ? (
                <Stack overflowY='scroll' id='myChats'>
                    {
                        chats.map((chat)=>(
                            <Box
                                onClick={()=>setSelectedChat(chat)}
                                cursor='pointer'
                                bg={selectedChat === chat ? 'black' : 'white'}
                                color={selectedChat === chat ? 'white' : 'black'}
                                px={3}
                                py={2}
                                borderRadius='lg'
                                key={chat._id}
                                display='flex'
                                gap={3}
                            >
                                <Avatar
                                    cursor='pointer'
                                    name={!chat.isGroupChat ? getSender(user, chat.users)
                                        : chat.chatName}
                                    src={!chat.isGroupChat ? (chat.users[1]._id===user._id ? chat.users[0].pic: chat.users[1].pic): ""}
                                />
                                <Box>
                                    <Text>
                                        {
                                            !chat.isGroupChat ? getSender(user, chat.users)
                                            : chat.chatName
                                        }
                                        
                                    </Text>

                                    { chat.latestMessage && <>
                                    <span style={{fontSize:'14px', fontWeight: `${chat.latestMessage.sender._id===user._id?'500': '700'}`}}>
                                        <b>{chat.latestMessage.sender._id===user._id ? 'Me: ': ''}</b>
                                        {chat.latestMessage.content} </span>
                                    <span style={{fontSize:'13px', color:`${selectedChat === chat ? 'yellow' : 'blue'}`}}>{moment(chat.latestMessage.updatedAt).from()}</span>
                                    </>}
                                </Box>
                            </Box>
                        ))
                    }

                </Stack>
            ) : (<ChatLoading/>)}
        </Box>

    </Box>
  )
}

export default MyChats
