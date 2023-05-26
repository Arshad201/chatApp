import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import { GrSearch } from 'react-icons/gr';
import { TbBellRinging } from 'react-icons/tb';
import { BsChevronDown } from 'react-icons/bs';
import React, { useState } from 'react';
import { ChatState } from '../../context/chatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import ChatLoading from '../ChatLoading.js'
import UserListItem from '../UserAvatar/UserListItem.js'
import axios from 'axios';
import { getSender } from '../../config/chatLogic';
import NotificationBadge, { Effect } from 'react-notification-badge';

const SideDrawer = () => {

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const { user, setSelectedChat, chats, setChats, notifications, setNotifications } = ChatState();

    
    const { isOpen, onOpen, onClose } =  useDisclosure();

    const navigate = useNavigate();
    const toast = useToast();

    const handleLogout = () =>{
        localStorage.removeItem('userInfo');
        
        toast(
            {
                
                title: 'Logout Successfully!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
                
            }
            );

            navigate('/');
    }

    const handleSearch = async () =>{
        if(!search){
            toast(
                {
                    
                    title: 'Please Enter something to search!',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-left'
                    
                }
                );
                return;
        }

        try {
            
            setLoading(true);

            const config = {
                headers : {
                    Authorization : `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);

        } catch (error) {
              toast(
            {
                
                title: 'Error Occured!',
                description: 'Failed to load the search results',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
                
            }
            );
        }
    }

    const accessChat = async (userId) =>{

        try {
            
            setLoadingChat(true);

            const config = {
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization : `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post('/api/chat', { userId }, config);

            if(!chats.find((c)=>c._id === data._id)) setChats([data, ...chats]);

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();

        } catch (error) {
            toast(
                {
                    
                    title: 'Error Occured!',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left'
                    
                }
                );
        }

    }

  return (
   <>
   <Box
    display='flex'
    justifyContent='space-between'
    alignItems='center'
    bg='white'
    width='100%'
    p='5px 10px 5px 10px'
   >
    <Tooltip label='Search users to Chat' hasArrow placement='bottom-end'>
        <Button onClick={onOpen}>
        <GrSearch/>
        <Text d={{base:'none', md:'flex'}} px='4'>
            Search a user
        </Text>
        </Button>
    </Tooltip>
    <Text fontSize='30px' fontFamily='cursive'>
        ChatUp
    </Text>
    <div style={{display:'flex', alignItems:'center'}}>
        <Menu>
            <MenuButton p={1} display='flex' gap='10px'>
                <NotificationBadge count={notifications.length} effecet={Effect.scale}/>
                <TbBellRinging style={{fontSize:'20px'}}/>
            </MenuButton>
           {notifications.length>0 ?
           <MenuList>
                {notifications && notifications.map((noti)=>{
                    return <MenuItem key={noti._id} 
                    onClick={()=>{
                        setSelectedChat(noti.chat);
                        setNotifications(notifications.filter((n)=>n!==noti));
                    }
                    }>
                        {noti.chat.isGroupChat ? `New Message in ${noti.chat.chatName}` : `New Message from ${getSender(user, noti.chat.users)}`}
                        </MenuItem>
                })}
            </MenuList> : <MenuList><MenuItem>No Notification is out there!</MenuItem></MenuList>}
        </Menu>
        <Menu>
            <MenuButton as={Button} rightIcon={<BsChevronDown/>}>
                <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
                <ProfileModal user={user}>
                    <MenuItem>My Profile</MenuItem>
                </ProfileModal>
                    <MenuDivider/>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
        </Menu>
    </div>
   </Box>
   <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
    <DrawerOverlay/>
    <DrawerContent>
        <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
        <DrawerBody>
            <Box display='flex' pb={2}>
                <Input
                    placeholder='Search by name or Email'
                    mr={2}
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>
                    Go
                </Button>
            </Box>
            {
                loading ? (<ChatLoading/>)
                : searchResult?.map((user)=>{
                    return <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={()=>accessChat(user._id)}
                    />
                })
            }
            {loadingChat && <Spinner ml='auto' display='flex'/>}
        </DrawerBody>
    </DrawerContent>
   </Drawer>
   </>
  )
}

export default SideDrawer
