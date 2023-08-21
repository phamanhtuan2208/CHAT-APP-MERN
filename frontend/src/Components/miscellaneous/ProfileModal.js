import { useDisclosure } from '@chakra-ui/hooks';
import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton } from '@chakra-ui/button';
import {
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
} from '@chakra-ui/react';
import AvatarUserDefault from '~/Components/Asset/Image/user.jpg';

function ProfileModel({ user, children }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton
                    d={'flex'}
                    icon={<ViewIcon></ViewIcon>}
                    onClick={onOpen}
                ></IconButton>
            )}

            <Modal size={'lg'} isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent height={'410px'}>
                    <ModalHeader
                        fontSize={'40px'}
                        fontFamily={'Work sans'}
                        display={'flex'}
                        justifyContent={'center'}
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={'flex'}
                        flexDir={'column'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Image
                            borderRadius={'full'}
                            boxSize={'150px'}
                            src={user.pic || AvatarUserDefault}
                            alt={AvatarUserDefault}
                        ></Image>
                        <Text
                            fontSize={{ base: '28px', md: '30px' }}
                            fontFamily={'Word sans'}
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ProfileModel;
