import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';

function UserBadgeItem({ user, handleFunction }) {
    return (
        <>
            <Box
                paddingX={2}
                paddingY={1}
                borderRadius={'lg'}
                margin={1}
                mb={2}
                variant={'solid'}
                fontSize={12}
                background={'purple'}
                color={'white'}
                cursor={'pointer'}
                onClick={handleFunction}
            >
                {user.name}
                <CloseIcon pl={1}></CloseIcon>
            </Box>
        </>
    );
}

export default UserBadgeItem;
