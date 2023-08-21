import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { http } from '~/Util/Request';

function Signup() {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [password, setPassword] = useState('');
    const [pic, setPic] = useState('');
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const history = useHistory();

    const handleClick = () => setShow(!show);

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Please Select an Image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
            const data = new FormData();
            data.append('file', pics);
            data.append('upload_preset', 'chat-app');
            data.append('cloud_name', 'dyeorphye');
            fetch('https://api.cloudinary.com/v1_1/dyeorphye/image/upload', {
                method: 'post',
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
        } else {
            toast({
                title: 'Please Select an .jpeg or .png!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        }
    };

    const submitHandle = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: 'Please Fill all the Fields!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            toast({
                title: 'Password Do Not MATCH!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            };
            const { data } = await http.post(
                '/api/user',
                { name, email, password, pic },
                config,
            );
            toast({
                title: 'Registration Successful!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });

            localStorage.setItem('userInfo', JSON.stringify(data));

            setLoading(false);
            history.push('/chats');
            window.location.reload();
        } catch (error) {
            toast({
                title: 'Error Occurred!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing={'5px'}>
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder={'Enter Your Name'}
                    onChange={(e) => setName(e.target.value)}
                ></Input>
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder={'Enter Your Email'}
                    onChange={(e) => setEmail(e.target.value)}
                ></Input>
            </FormControl>
            <FormControl id="Password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder={'Enter Your Password'}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Input>
                    <InputRightElement width={'4.5rem'}>
                        <Button h="1.75rem" size={'sm'} onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="ComfirmPassword" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder={'Enter Your Password'}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Input>
                    <InputRightElement width={'4.5rem'}>
                        <Button h="1.75rem" size={'sm'} onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic">
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    type={'file'}
                    p={'1.5'}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                ></Input>
            </FormControl>
            <Button
                colorScheme="blue"
                width={'100%'}
                style={{ marginTop: '15px' }}
                onClick={submitHandle}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    );
}

export default Signup;
