import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getSender } from '~/Config/ChatLogics';
import { ChatState } from '~/Context/ChatProvider';
import { http } from '~/Util/Request';
import ChatLoading from './ChatLoading';
import GroupChatModel from './miscellaneous/GroupChatModel';

function MyChats({ fetchAgain, setFetchAgain }) {
    const [LoggedUser, setLoggedUser] = useState();
    const { user, setSelectedChat, setChats, SelectedChat, Chats } =
        ChatState();

    const Toast = useToast();

    const fetchChat = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await http.get('/api/chat', config);
            setChats(data);
        } catch (error) {
            Toast({
                title: 'Error Occured!',
                description: 'Failed to load the chats',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
        fetchChat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAgain]);

    console.log(Chats);

    return (
        <>
            <Box
                display={{ base: SelectedChat ? 'none' : 'flex', md: 'flex' }}
                flexDir={'column'}
                alignItems={'center'}
                p={3}
                background={'white'}
                width={{ base: '100%', md: '31%' }}
                borderRadius={'lg'}
                borderWidth={'1px'}
            >
                <Box
                    padding={3}
                    paddingX={3}
                    fontSize={{ base: '28px', md: '30px' }}
                    fontFamily={'Work sans'}
                    display={'flex'}
                    width={'100%'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                >
                    My Chats
                    <GroupChatModel>
                        <Button
                            display={'flex'}
                            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
                            rightIcon={<AddIcon></AddIcon>}
                        >
                            New Group Chat
                        </Button>
                    </GroupChatModel>
                </Box>
                <Box
                    display={'flex'}
                    flexDir={'column'}
                    p={3}
                    background={'#F8F8F8'}
                    width={'100%'}
                    height={'100%'}
                    borderRadius={'lg'}
                    overflowY={'hidden'}
                >
                    {Chats ? (
                        <Stack overflow={'scroll'}>
                            {Chats?.map((item) => (
                                <Box
                                    onClick={() => setSelectedChat(item)}
                                    cursor="pointer"
                                    bg={
                                        SelectedChat === item
                                            ? '#38B2AC'
                                            : '#E8E8E8'
                                    }
                                    color={
                                        SelectedChat === item
                                            ? 'white'
                                            : 'black'
                                    }
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    key={item._id}
                                >
                                    <Text>
                                        {!item.isGroupChat
                                            ? getSender(LoggedUser, item.users)
                                            : item.chatName}
                                    </Text>
                                </Box>
                            ))}
                        </Stack>
                    ) : (
                        <ChatLoading></ChatLoading>
                    )}
                </Box>
            </Box>
        </>
    );
}

export default MyChats;
