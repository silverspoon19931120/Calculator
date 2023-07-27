// Define initial state
const initialState = {
    users: [],
    selectedUser: '',
};
// Define action types
const SET_USER_LIST = 'SET_USER_LIST';
const SELECT_USER = 'SELECT_USER';

// Define reducer function
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_LIST:
            return { ...state, users: action.payload };
        case SELECT_USER:
            return { ...state, selectedUser: action.payload };
        default:
            return state;
    }
};

export default userReducer;
