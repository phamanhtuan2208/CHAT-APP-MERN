import { ArrowBackIcon } from '@chakra-ui/icons';
import {
    Box,
    FormControl,
    IconButton,
    Input,
    Spinner,
    Text,
    useToast,
} from '@chakra-ui/react';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { useState } from 'react';
import Lottie from 'react-lottie';
import io from 'socket.io-client';
import { getSender, getSenderFull } from '~/Config/ChatLogics';
import { ChatState } from '~/Context/ChatProvider';
import ProfileModel from './miscellaneous/ProfileModal';
import UpdateGroupChatModel from './miscellaneous/UpdateGroupChatModel';
import ScrollableChat from './ScrollableChat';
import Style from './Style.module.scss';
import animationData from '~/Animation/typing.json';
import { http } from '~/Util/Request';

const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompares;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [Messages, setMessages] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [NewMessage, setNewMessage] = useState();
    const [SocketConnected, setSocketConnected] = useState(false);
    const [IsTyping, setIsTyping] = useState(false);
    const [Typing, setTyping] = useState(false);

    const {
        user,
        SelectedChat,
        setSelectedChat,
        setNotification,
        Notification,
    } = ChatState();

    const defaultOptions = {
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            PreserveAspectRatio: 'xMidYMid slice',
        },
    };

    const Toast = useToast();

    const cx = classNames.bind(Style);

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchMessages = async () => {
        if (!SelectedChat) {
            return;
        }
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);

            const { data } = await http.get(
                `/api/message/${SelectedChat._id}`,
                config,
            );
            setMessages(data);
            setLoading(false);
            socket.emit('join chat', SelectedChat._id);
        } catch (error) {
            Toast({
                title: 'Error Occured!',
                description: 'Failed to load the chats',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        }
    };

    const sendMessage = async (event) => {
        if (event.key === 'Enter' && NewMessage) {
            socket.emit('stop typing', SelectedChat._id);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage('');
                const { data } = await http.post(
                    '/api/message',
                    {
                        content: NewMessage,
                        chatId: SelectedChat._id,
                    },
                    config,
                );
                socket.emit('new message', data);
                setMessages([...Messages, data]);
            } catch (error) {
                Toast({
                    title: 'Error Occured!',
                    description: 'Failed to load the chats',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom',
                });
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        // Typing Indicator Logic
        if (!SocketConnected) return;

        if (!Typing) {
            setTyping(true);
            socket.emit('typing', SelectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && Typing) {
                socket.emit('stop typing', SelectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    useEffect(() => {
        fetchMessages();
        selectedChatCompares = SelectedChat;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SelectedChat]);

    useEffect(() => {
        socket.on('message recieved', (NewMessageRecieved) => {
            if (
                !selectedChatCompares ||
                selectedChatCompares._id !== NewMessageRecieved.chat._id
            ) {
                if (!Notification.includes(NewMessageRecieved)) {
                    setNotification([NewMessageRecieved, ...Notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...Messages, NewMessageRecieved]);
            }
        });
    });


    return (
        <>
            {SelectedChat ? (
                <>
                    <Text
                        fontSize={{ base: '28px', md: '30px' }}
                        pd={3}
                        paddingX={2}
                        width={'100%'}
                        fontFamily={'Work sans'}
                        justifyContent={{ base: 'space-between' }}
                        alignItems={'center'}
                        display={'flex'}
                    >
                        <IconButton
                            display={{ base: 'flex', md: 'none' }}
                            icon={<ArrowBackIcon></ArrowBackIcon>}
                            onClick={() => setSelectedChat('')}
                        ></IconButton>
                        {!SelectedChat.isGroupChat ? (
                            <>
                                {getSender(user, SelectedChat.users)}
                                <ProfileModel
                                    user={getSenderFull(
                                        user,
                                        SelectedChat.users,
                                    )}
                                />
                            </>
                        ) : (
                            <>
                                {SelectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModel
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                ></UpdateGroupChatModel>
                            </>
                        )}
                    </Text>
                    <Box
                        display={'flex'}
                        flexDir={'column'}
                        justifyContent={'flex-end'}
                        padding={3}
                        background={'#E8E8E8'}
                        width={'100%'}
                        height={'100%'}
                        borderRadius={'lg'}
                        overflowY={'hidden'}
                    >
                        {Loading ? (
                            <Spinner
                                size={'xl'}
                                width={20}
                                height={20}
                                alignSelf={'center'}
                                margin={'auto'}
                            ></Spinner>
                        ) : (
                            <>
                                <div className={cx('message')}>
                                    <ScrollableChat
                                        Messages={Messages}
                                    ></ScrollableChat>
                                </div>
                            </>
                        )}
                        <FormControl
                            onKeyDown={sendMessage}
                            isRequired
                            marginTop={3}
                        >
                            {IsTyping ? (
                                <div
                                    style={{
                                        display: 'flex',
                                    }}
                                >
                                    {' '}
                                    Another is typing...
                                    <Lottie
                                        options={defaultOptions}
                                        width={40}
                                        style={{
                                            marginBottom: 15,
                                            marginLeft: 0,
                                            marginTop: '2px',
                                        }}
                                    ></Lottie>{' '}
                                </div>
                            ) : (
                                <></>
                            )}
                            <Input
                                variant={'filled'}
                                background={'#E0E0E0'}
                                placeholder={'Enter a message...'}
                                onChange={typingHandler}
                                value={NewMessage}
                            ></Input>
                        </FormControl>
                    </Box>
                </>
            ) : (
                <>
                    <Box
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        height={'100%'}
                    >
                        <Text fontSize={'3xl'} pd={3} fontFamily={'Work sans'}>
                            Click on a user to start chatting
                        </Text>
                    </Box>
                </>
            )}
        </>
    );
};

export default SingleChat;
