import React, { useEffect } from 'react';
import LoadingScreen from 'react-loading-screen';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { getUsers } from './actions/user';
import HeaderComponent from './components/header.component';
import HomeComponent from './components/home.component';
import OrderComponent from './components/order.component';
import UserPage from './pages/UserPage';

function App() {
    const isLoading = useSelector((state) => state?.app?.isLoading);
    const dispatch = useDispatch();
    useEffect(() => {
        getUsers({
            onLoad: (data) => {
                dispatch({
                    type: 'SET_USER_LIST',
                    payload: data,
                });
            },
        });
    });
    return (
        <BrowserRouter>
            <HeaderComponent />
            <Routes>
                <Route exact path='/' element={<OrderComponent />} />
                <Route exact path='/users' element={<UserPage />} />
                <Route exact path='/orders/new' element={<HomeComponent />} />
                <Route exact path='/orders' element={<OrderComponent />} />
            </Routes>
            <LoadingScreen
                loading={isLoading}
                bgColor='#00000087'
                spinnerColor='black'
                textColor='#676767'
            >
                <div></div>
            </LoadingScreen>
        </BrowserRouter>
    );
}

export default App;
