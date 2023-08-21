export const getSender = (LoggedUser, users) => {
    return users[0]._id === LoggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (LoggedUser, users) => {
    return users[0]._id === LoggedUser._id ? users[1] : users[0];
};

//kiem tra xem tin nhan tiep theo co phai cua nguoi gui hay k
export const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
};
//kiem tra tin nhan cuoi cung cua nguoi gui
export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};
//chinh margin cua tin nhan, neu gui di set 33%, nguoi gui set 0% va auto neu la truong hop loi
export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);

    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 33;
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return 'auto';
};
//logic neu van la nguoi gui thi tiep tuc
export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
