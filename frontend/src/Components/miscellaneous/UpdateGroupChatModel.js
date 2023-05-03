import { ViewIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    FormControl,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ChatState } from '~/Context/ChatProvider';
import { http } from '~/Util/Request';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

function UpdateGroupChatModel({ fetchAgain, setFetchAgain, fetchMessages }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [GroupChatName, setGroupChatName] = useState();
    const [Search, setSearch] = useState('');
    const [SearchResult, setSearchResult] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [RenameLoading, setRenameLoading] = useState(false);

    const Toast = useToast();

    const { user, SelectedChat, setSelectedChat } = ChatState();

    const handleRename = async () => {
        if (!GroupChatName) {
            return;
        }
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await http.put(
                '/api/chat/rename',
                {
                    chatId: SelectedChat._id,
                    chatName: GroupChatName,
                },
                config,
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            Toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setRenameLoading(false);
        }
        setGroupChatName('');
    };

    const handleRemove = async (user1) => {
        if (
            SelectedChat.groupAdmin._id !== user._id &&
            user1._id !== user._id
        ) {
            Toast({
                title: 'Only Admins can add someone!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        try {
            setLoading(false);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await http.put(
                `/api/chat/groupremove`,
                {
                    chatId: SelectedChat._id,
                    userId: user1._id,
                },
                config,
            );
            //check that user left group or not, if left data chat from user clear
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            Toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
        }
    };

    const handleAddUser = async (user1) => {
        if (SelectedChat.users.find((u) => u._id === user1._id)) {
            Toast({
                title: 'User Already in Group!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        if (SelectedChat.groupAdmin._id !== user._id) {
            Toast({
                title: 'Only Admins can add someone!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
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
            const { data } = await http.put(
                '/api/chat/groupadd',
                {
                    chatId: SelectedChat._id,
                    userId: user._id,
                },
                config,
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            Toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
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
                `/api/user?search=${Search}`,
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
                position: 'bottom',
            });
            setLoading(false);
        }
    };

    return (
        <>
            <IconButton
                onClick={onOpen}
                display={{ base: 'flex' }}
                icon={<ViewIcon></ViewIcon>}
            >
                Open Modal
            </IconButton>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {SelectedChat.chatName.toUpperCase()}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            pb={3}
                            flexWrap={'wrap'}
                            display={'flex'}
                            width={'100%'}
                        >
                            {SelectedChat.users.map((u) => (
                                <>
                                    <UserBadgeItem
                                        key={u._id}
                                        user={u}
                                        handleFunction={() => handleRemove(u)}
                                    ></UserBadgeItem>
                                </>
                            ))}
                        </Box>
                        <FormControl display={'flex'}>
                            <Input
                                placeholder={'Chat Name'}
                                mb={3}
                                value={GroupChatName}
                                onChange={(e) =>
                                    setGroupChatName(e.target.value)
                                }
                            ></Input>
                            <Button
                                variant={'solid'}
                                colorScheme={'teal'}
                                ml={1}
                                isLoading={RenameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder={'Add User to group'}
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            ></Input>
                        </FormControl>
                        {Loading ? (
                            <Spinner size={'lg'}></Spinner>
                        ) : (
                            SearchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                ></UserListItem>
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme={'red'}
                            onClick={() => handleRemove(user)}
                        >
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default UpdateGroupChatModel;
