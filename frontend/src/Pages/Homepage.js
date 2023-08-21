import {
    Container,
    Box,
    Tab,
    TabList,
    Tabs,
    TabPanel,
    TabPanels,
    Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Login from '~/Components/Authentication/Login.js';
import Signup from '~/Components/Authentication/Signup.js';

function Homepage() {
    const history = useHistory();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        if (user) {
            history.push('/chats');
        }
    }, [history]);

    return (
        <Container maxW={'xl'} centerContent>
            <Box></Box>
            <Box
                d="flex"
                justifyContent={'center'}
                p={3}
                bg={'white'}
                w={'100%'}
                m={'40px 0 15px 0'}
                borderRadius="lg"
                borderWidth={'1px'}
            >
                <Text
                    textAlign={'center'}
                    fontSize="4xl"
                    fontFamily={'work sans'}
                    color={'black'}
                >
                    Talk-A-Tive
                </Text>
            </Box>
            <Box
                bg={'white'}
                w={'100%'}
                p={4}
                borderRadius={'lg'}
                borderWidth={'1px'}
                color={'black'}
            >
                <Tabs variant="soft-rounded">
                    <TabList>
                        <Tab width={'50%'}>Login</Tab>
                        <Tab width={'50%'}>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login></Login>
                        </TabPanel>
                        <TabPanel>
                            <Signup></Signup>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
}

export default Homepage;
