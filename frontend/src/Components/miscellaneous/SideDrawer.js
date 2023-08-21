import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Input,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Spinner,
    Text,
    Tooltip,
    useToast,
} from '@chakra-ui/react';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ChatState } from '~/Context/ChatProvider';
import ProfileModel from './ProfileModal';
import { useDisclosure } from '@chakra-ui/hooks';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '~/Config/ChatLogics';
import NotificationBadge, { Effect } from 'react-notification-badge';
import { http } from '~/Util/Request';

function SidePage() {
    const [Search, setSearch] = useState('');
    const [SearchResult, setSearchResult] = useState([]);

    const [Loading, setLoading] = useState(false);
    const [LoadingChat, setLoadingChat] = useState();

    const {
        user,
        setSelectedChat,
        Chats,
        setChats,
        Notification,
        setNotification,
    } = ChatState();

    const history = useHistory();
    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        history.push('/');
    };

    const Toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSearch = async () => {
        if (!Search) {
            Toast({
                title: 'Please Enter somthing in search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await http.get(
                `/api/user/?search=${Search}`,
                config,
            );
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            Toast({
                title: 'Error Occured!',
                description: 'Failed to Load the Search Results',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await http.post('/api/chat', { userId }, config);
            if (!Chats.find((c) => c._id === data._id))
                setChats([data, ...Chats]);
            setSelectedChat(data);
            setLoadingChat(true);
            onClose();
        } catch (error) {
            Toast({
                title: 'Error fetching the chat',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    };

    return (
        <>
            <Box
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bg={'white'}
                w={'100%'}
                padding={'5px 10px 5px 10px'}
                borderWidth={'5px'}
            >
                <Tooltip
                    label={'Search Users to chat'}
                    hasArrow
                    placement={'bottom-end'}
                >
                    <Button variant={'ghost'} onClick={onOpen}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <Text d={{ base: 'none', md: 'flex' }} px={'4'}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize={'2xl'} fontFamily={'Work sans'}>
                    Talk-A-Tive
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={Notification.length}
                                effect={Effect.SCALE}
                            ></NotificationBadge>
                            <BellIcon fontSize={'2xl'} margin={1}></BellIcon>
                        </MenuButton>
                        <MenuList paddingLeft={2}>
                            {!Notification.length && 'No New Messages'}
                            {Notification.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(
                                            Notification.filter(
                                                (n) => n !== notif,
                                            ),
                                        );
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(
                                              user,
                                              notif.chat.users,
                                          )}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon></ChevronDownIcon>}
                        >
                            <Avatar
                                size={'sm'}
                                cursor={'pointer'}
                                name={user.name}
                                src={user.pic}
                            ></Avatar>
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider></MenuDivider>
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay></DrawerOverlay>
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={'1px'}>
                        Search User
                    </DrawerHeader>
                    <DrawerBody>
                        <Box display={'flex'} pd={2}>
                            <Input
                                placeholder={'Search by name or email'}
                                mr={2}
                                value={Search}
                                onChange={(e) => setSearch(e.target.value)}
                            ></Input>
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {Loading ? (
                            <ChatLoading></ChatLoading>
                        ) : (
                            SearchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                ></UserListItem>
                            ))
                        )}
                        {LoadingChat && (
                            <Spinner ml={'auto'} display={'flex'}></Spinner>
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default SidePage;
