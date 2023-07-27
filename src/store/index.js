import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import userReducer from './userReducer';
import appReducer from './appReducer';

const rootReducer = combineReducers({
    data: userReducer,
    app: appReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
