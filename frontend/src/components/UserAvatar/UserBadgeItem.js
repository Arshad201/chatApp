import { Box } from '@chakra-ui/react'
import React from 'react'
import { RxCross2 } from 'react-icons/rx';

const UserBadgeItem = ({ user, handleFunction}) => {
  return (
    <Box
        px={2}
        py={2}
        borderRadius='lg'
        m={1}
        mb={2}
        fontSize={12}
        bgColor='purple'
        color='white'
        cursor='pointer'
        display='flex'
        onClick={handleFunction}

    >
      {user.name}
       <RxCross2 style={{paddingLeft:'5px', fontSize:'20px'}}/>
    </Box>
  )
}

export default UserBadgeItem
