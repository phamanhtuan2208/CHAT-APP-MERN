import { Box } from '@chakra-ui/react';
import { ChatState } from '~/Context/ChatProvider';
import SideDrawer from '~/Components/miscellaneous/SideDrawer';
import MyChats from '~/Components/MyChats';
import ChatBox from '~/Components/ChatBox';
import { useState } from 'react';

function ChatPage() {
    const { user } = ChatState();
    const [FetchAgain, setFetchAgain] = useState(false);

    return (
        <div style={{ width: '100%' }}>
            {user && <SideDrawer></SideDrawer>}
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                w={'100%'}
                h={'91.5vh'}
                p={'10px'}
            >
                {user && (
                    <MyChats
                        fetchAgain={FetchAgain}
                        setFetchAgain={setFetchAgain}
                    ></MyChats>
                )}
                {user && (
                    <ChatBox
                        fetchAgain={FetchAgain}
                        setFetchAgain={setFetchAgain}
                    ></ChatBox>
                )}
            </Box>
        </div>
    );
}

export default ChatPage;
