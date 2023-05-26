import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';


const SignUp = () => {

    const navigate = useNavigate();

    const toast = useToast();

    const [show, setShow] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pic, setPic] = useState("");
    const [loading, setLoading] = useState(false);

    const handleClick=()=>{setShow(!show)}

    const submitHandler= async()=>{

        setLoading(true);

        if(!name || !email || !password || !confirmPassword){

            toast(
                {
                    title: 'Please fill all the fields',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                }
            );

            setLoading(false);
            return;

        }

        if(password !== confirmPassword){

            toast(
                {
                    title: 'Passwords do not matched!',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                }
            );

            setLoading(false);
            return;

        }


        try {
            
            const formDataObj = {
                name,
                email,
                password,
                pic
            }

            const config = {

                headers : {
                    'Content-Type' : 'application/json'
                }

            }

            const { data } = await axios.post('/api/user', formDataObj, config);

            toast(
                {
                    title: 'Registration Successful!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                }
            );

            localStorage.setItem( 'userInfo', JSON.stringify(data));

            setLoading(false);
            navigate('/chats');

        } catch (error) {
            
            toast(
                {
                    title: 'Error Occured!',
                    description: error.response.data.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                }
            );

            setLoading(false);

        }

    }

    const postDetails=(pics)=>{

        setLoading(true);

        if(pics===undefined){

            toast(
                {
                    title: 'Please select an Image',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                }
            );

            return;
            
        }

        if(pics.type === 'image/jpeg' || pics.type === 'image/png'){
            const data = new FormData();
            data.append('file', pics);
            data.append('upload_preset', 'chat-app');
            data.append('cloud_name', 'arshadmern');
            fetch("https://api.cloudinary.com/v1_1/arshadmern/image/upload", { method : 'POST', body: data,}).then((res)=>res.json()).then(data=>{
                setPic(data.url.toString());
                setLoading(false);
            }).catch((err)=>{
                console.log(err);
                setLoading(false);
            })
        }else{
            toast(
                {
                    title: 'Please select an Image',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                }
            );

            setLoading(false);
            return;
        }
    }

  return (
    <VStack spacing="5px">
        <FormControl id='name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter Your Name' value={name} onChange={(e)=>setName(e.target.value)}/>
        </FormControl>
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
        <FormControl id='cpassword' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input type={show ? 'text' : 'password'} placeholder='Confirm your Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                <InputRightElement width='4.5rem'>
                    <Button height="1.75rem" size='sm' onClick={handleClick}>
                        {show ? <BsEyeFill/> : <BsEyeSlashFill/>}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='pic'>
            <FormLabel>Upload your Picture</FormLabel>
            <Input
                type='file'
                p='1.5'
                accept='image/*'
                onChange={(e)=>postDetails(e.target.files[0])}
            />
        </FormControl>
        <Button
            colorScheme='green'
            width='100%'
            style={{marginTop:'15'}}
            onClick={submitHandler}
            isLoading={loading}
            borderRadius={0}
        >
            SignUp
        </Button>

    </VStack>
  )
}

export default SignUp
