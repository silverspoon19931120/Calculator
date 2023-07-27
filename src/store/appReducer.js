// Define initial state
const initialState = {
    isAuth: false,
    isLoading: false,
};
// Define action types
const SET_IS_LOADING = 'SET_IS_LOADING';

// Define reducer function
const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_IS_LOADING:
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
};

export default appReducer;
