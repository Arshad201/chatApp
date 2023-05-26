import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { FaEdit } from 'react-icons/fa';
import React, { useState } from 'react'
import { ChatState } from '../../context/chatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {

    
    const { user, selectedChat, setSelectedChat } = ChatState();

    const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
    const [search, setSearch] = useState();
    const [SearchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();


    const handleRename = async()=>{

        if(!groupChatName) return;

        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put('/api/chat/rename',
            {
                chatId: selectedChat._id,
                chatName: groupChatName
            },
            config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            setRenameLoading(false);

            groupChatName("")
        } catch (error) {
            
        }
    }

     const handleSearch = async(query) =>{

        setSearch(query);

        if(!query){
            return
        }

        try {
            setLoading(true);

            const config = {
                headers : {
                    Authorization : `Bearer ${user.token}`
                },
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false)
            setSearchResult(data);

        } catch (error) {
            toast({
                title : 'Error Occured',
                description : 'Failed to load the search results',
                status : 'error',
                duration : 5000,
                isClosable : true,
                position : 'bottom-left'
            })

            setLoading(false);
        }
    }

    const handleAddUser = async(user1) =>{

        console.log('enter')

        if(selectedChat.users.find((u)=>u._id===user1._id)){

            toast({
                title : 'User is already in group',
                status : 'error',
                duration : 5000,
                isClosable : true,
                position : 'bottom'
            })
             
            return
        }

        if(selectedChat.groupAdmin._id !== user._id){

            toast({
                title : 'Only Admins can add someone',
                status : 'error',
                duration : 5000,
                isClosable : true,
                position : 'bottom'
            })
             
            return
        }

        try {
            setLoading(true);

            const config = {
                headers : {
                    Authorization: `Bearer ${user.token}`
                }
            };
 
            const { data } = await axios.put('/api/chat/groupadd',
            {
                chatId: selectedChat._id,
                userId: user1._id
            },
            config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);

        } catch (error) {
            toast({
                title : 'Error Occured!',
                description : error.response.data.message,
                status : 'error',
                duration : 5000,
                isClosable : true,
                position : 'bottom'
            });

            setLoading(false);  
        }
    }

    const handleRemoveUser = async(user1) =>{

        if(selectedChat.groupAdmin._id !== user._id){

            toast({
                title : 'Only Admins can add someone',
                status : 'error',
                duration : 5000,
                isClosable : true,
                position : 'bottom'
            })
             
            return
        }

        try {
            
            setLoading(true);

            const config = {
                headers : {
                    Authorization: `Bearer ${user.token}`
                }
            };
 
            const { data } = await axios.put('/api/chat/groupremove',
            {
                chatId: selectedChat._id,
                userId: user1._id
            },
            config);

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);

        } catch (error) {
            toast({
                title : 'Error Occured!',
                description : error.response.data.message,
                status : 'error',
                duration : 5000,
                isClosable : true,
                position : 'bottom'
            });

            setLoading(false);  
        }
    }
   

  return (
    <>
    <Tooltip label='Edit Group' >
      <IconButton display={{base: 'flex'}} icon={<FaEdit/>} onClick={onOpen}/>
    </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody 
          >
            <Box display='flex' flexWrap='wrap'>
                {
                    selectedChat.users.map((u)=><UserBadgeItem key={u._id} user={u} handleFunction={()=>handleRemoveUser(u)}/>)
                }

                <Box width='100%' display='flex' flexDir='column' gap='10px'>
                    <FormControl display='flex'>
                        <Input placeholder='Update group name' value={groupChatName} onChange={(e)=>setGroupChatName(e.target.value)}/>
                        <Button colorScheme='green' onClick={handleRename}>Update</Button>
                    </FormControl>
                    <FormControl>
                        <Input placeholder='Update Users eg: Rahul, Arif' onChange={(e)=>handleSearch(e.target.value)}/>
                    </FormControl>
                    {
                        loading ? (<Spinner size='lg'/>) : (
                            SearchResult?.map((user)=>(
                            <UserListItem key={user._id} user={user} handleFunction={()=>handleAddUser(user)} />
                            ))
                        )
                    }
                </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={()=>handleRemoveUser(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}

export default UpdateGroupChatModal
