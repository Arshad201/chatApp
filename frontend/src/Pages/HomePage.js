import React, { useEffect } from 'react';
import Login from '../components/Authentication/Login.js';
import SignUp from '../components/Authentication/SignUp.js';
import { 
  Container,
  Box,
  Text,
  TabList, 
  Tab,
  Tabs,
  TabPanels,
  TabPanel
 } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

  const navigate = useNavigate();

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('userInfo'));

    if(user){
        navigate('/chats');
    }

},[navigate]);

  return (
    <Container>
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg='white'
        w="100%"
        m="40px 0 15px 0"
        borderWidth="1px"
      >
        <Text
          fontSize="4xl"
          fontFamily="cursive"
          color="black"
          textAlign="center"
        >
          ChatUp
        </Text>
      </Box>
      <Box
        bg="white"
        w="100%"
        p={4}
        borderWidth="1px"
      >
        <Tabs colorScheme='black'>
          <TabList mb="1rem">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">SignUp</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
