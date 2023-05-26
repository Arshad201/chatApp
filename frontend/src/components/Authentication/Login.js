import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import axios from "axios";


const Login = () => {

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");

    const toast = useToast();
    const navigate = useNavigate();

    const handleClick=()=>{setShow(!show)}

    const submitHandler = async() => {

        setLoading(true);

        if(!email || !password){
            toast(
                {
                    
                    title: 'Enter Email and Password!',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                    
                }
            )

            setLoading(false);
            return;
        }

        try {

            const formData = {
                email,
                password
            }

            const config = {
                
                headers : {
                    'Content-Type' : 'application/json'
                }

            }

            const { data } = await axios.post('/api/user/login', formData, config);

            localStorage.setItem('userInfo', JSON.stringify(data));

            toast(
                {
                    
                    title: 'Login Successfully!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                    
                }
            )

            navigate('/chats')
            
        } catch (error) {

            toast(
                {
                    
                    title: 'Error occured!',
                    description : error.response.data.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                    
                }
            )

            setLoading(false);
            return;
        }
    }

  return (
    <VStack spacing="5px">
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter Your Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input type={show ? 'text' : 'password'} placeholder='Enter Your Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <InputRightElement width='4.5rem'>
                    <Button height="1.75rem" size='sm' onClick={handleClick}>
                        {show ? <BsEyeFill/> : <BsEyeSlashFill/>}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button
            colorScheme='blue'
            width='100%'
            style={{marginTop:'15'}}
            borderRadius={0}
            onClick={submitHandler}
        >
            Login
        </Button>
        <Button
            colorScheme='red'
            borderRadius={0}
            width='100%'
            style={{marginTop:'15'}}
            variant='solid'
            onClick={()=>{setEmail('guest@rest.com'); setPassword('786')}}
            isLoading= {loading}
        >
            Get Guest Credentials
        </Button>

    </VStack>
  )
}

export default Login
