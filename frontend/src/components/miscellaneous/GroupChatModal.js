import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/chatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem.js'

const GroupChatModal = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUser, setSelectedUser] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats} = ChatState();

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
                title : '',
                description : '',
                status : 'error',
                duration : 5000,
                isClosable : true,
                position : 'bottom-left'
            })
        }
    }


    const handleSubmit = async() =>{
      if(!groupChatName || !selectedUser){
        toast({
          title : 'Please All the fields!',
          status : 'warning',
          duration : 5000,
          isClosable : true,
          position : 'top'
      });
      return;
      }

      try {
        
        const config = {
          headers : {
            Authorization : `Bearer ${user.token}`
          }
        }

        const users = JSON.stringify(selectedUser.map((user)=>user._id));

        const { data } = await axios.post('/api/chat/group',
        {users, name: groupChatName},
        config
        );

        setChats([data, ...chats]);
        onClose();
        setGroupChatName("");
        setSelectedUser([]);
        toast({
          title : 'Congrat! New Group Chat is Created',
          status : 'success',
          duration : 5000,
          isClosable : true,
          position : 'buttom'
      });
      } catch (error) {
        toast({
          title : 'Error Occured',
          description : error.response.data,
          status : 'warning',
          duration : 5000,
          isClosable : true,
          position : 'top'
      });
      }
    }

    const handleDelete = (delUser) =>{
      setSelectedUser(selectedUser.filter((sel)=>sel._id !== delUser._id));
    }

    const handleGroup = (userToAdd) =>{

      if(selectedUser.includes(userToAdd)){

        toast({
          title : 'User Already added',
          status : 'warning',
          duration : 5000,
          isClosable : true,
          position : 'top'
      });

        return;

      }

        setSelectedUser([...selectedUser, userToAdd]);

    }

    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign='center' fontSize='25px' fontFamily='Work sans'>Create Group Chat</ModalHeader>
            <ModalCloseButton />
            <ModalBody display='flex' flexDir='column' alignItems='center' gap='5px'>
                <FormControl>
                    <Input placeholder='Add group name' value={groupChatName} onChange={(e)=>setGroupChatName(e.target.value)}/>
                </FormControl>
                <FormControl>
                    <Input placeholder='Add Users eg: Rahul, Arif' onChange={(e)=>handleSearch(e.target.value)}/>
                </FormControl>
                <Box display='flex' flexWrap='wrap' justifyContent='flex-start' width='100%'>
                {
                  selectedUser.map((u)=>(<UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)}/>))
                }
                </Box>
                {
                    loading ? (<div>Loading</div>) : (searchResult?.slice(0, 4).map((user)=><UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>))
                }
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                Create Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default GroupChatModal
