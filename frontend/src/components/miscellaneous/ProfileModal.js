import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Tooltip, useDisclosure } from '@chakra-ui/react'
import { BsFillEyeFill } from 'react-icons/bs';
import React from 'react'

const ProfileModal = ({user, children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
 
  return (
    <>
      {children ? (<span onClick={onOpen}>{children}</span>) 
      : (<Tooltip label='view profile'>
          <IconButton onClick={onOpen} d={{base: 'flex'}} icon={<BsFillEyeFill/>}/>
        </Tooltip>
          )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign='center'>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody 
            display='flex'
            flexDir='column'
            alignItems='center'
            justifyContent='space-between'
          >
            <Image
                borderRadius='full'
                boxSize='150px'
                src = {user.pic}
                alt = {user.name}
            />
            <Text>Email : {user.email}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}

export default ProfileModal
