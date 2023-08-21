import { Box } from '@chakra-ui/react';
import React from 'react';
import { ChatState } from '~/Context/ChatProvider';
import SingleChat from './SingleChat';

function ChatBox({ fetchAgain, setFetchAgain }) {
    const { SelectedChat } = ChatState();

    return (
        <>
            <Box
                display={{ base: SelectedChat ? 'flex' : 'none', md: 'flex' }}
                alignItems={'center'}
                flexDir={'column'}
                padding={3}
                background={'white'}
                width={{ base: '100%', md: '63%' }}
                borderRadius={'lg'}
                borderWidth={'1px'}
            >
                <SingleChat
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                ></SingleChat>
            </Box>
        </>
    );
}

export default ChatBox;
