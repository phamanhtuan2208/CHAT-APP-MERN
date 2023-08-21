import { Avatar, Box, Text } from '@chakra-ui/react';

function UserListItem({ user, handleFunction }) {
    return (
        <>
            <Box
                onClick={handleFunction}
                cursor={'pointer'}
                background="#E8E8E8"
                _hover={{ background: '#38B2AC', color: 'white' }}
                width={'100%'}
                display={'flex'}
                alignItems={'center'}
                color={'black'}
                px={5}
                py={2}
                mb={2}
                borderRadius={'bg'}
            >
                <Avatar
                    mr={2}
                    size="sm"
                    cursor={'pointer'}
                    name={user.name}
                    src={user.pic}
                ></Avatar>
                <Box>
                    <Text>{user.name}</Text>
                    <Text fontSize={'xs'}>
                        <b>Email: </b>
                        {user.email}
                    </Text>
                </Box>
            </Box>
        </>
    );
}

export default UserListItem;
