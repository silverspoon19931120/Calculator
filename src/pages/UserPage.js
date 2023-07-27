import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-simple-toasts';
import { createUser, deleteUser, getUsers, updateUser } from '../actions/user';
import UserComponent from '../components/user.component';
import UserForm from '../components/user.form';

const UserPage = () => {
    const dispatch = useDispatch();
    const userList = useSelector((state) => state?.data?.users);
    const [state, setState] = useState({
        isForm: false,
    });
    const [user, setUser] = useState({
        username: '',
        password: '0',
        email: '',
        first_name: '',
        last_name: '',
    });
    const handleDelete = (delId) => {
        dispatch({
            type: 'SET_IS_LOADING',
            payload: true,
        });
        deleteUser({
            delId,
            onLoad: (data) => {
                dispatch({
                    type: 'SET_IS_LOADING',
                    payload: false,
                });
                toast(data);
            },
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!(user?.username ?? false) || !(user?.email ?? false)) {
            toast('Please fill the data correctly');
            return;
        }
        if (
            userList.some(
                (item) =>
                    item?.id !== user?.id && item?.email === user?.email
            )
        ) {
            toast('User Email is exist');
            return;
        }
        setState((prv) => ({ ...prv, isForm: false }));
        dispatch({
            type: 'SET_IS_LOADING',
            payload: true,
        });
        if (user?.id) {
            updateUser({
                user: user,
                onLoad: (res) => {
                    dispatch({
                        type: 'SET_IS_LOADING',
                        payload: false,
                    });
                    toast(res);
                },
            });
        } else {
            createUser({
                user: user,
                onSave: (res) => {
                    toast(res);
                    dispatch({
                        type: 'SET_IS_LOADING',
                        payload: false,
                    });
                },
            });
        }
    };
    useEffect(() => {
        getUsers({
            onLoad: (data) => {
                dispatch({
                    type: 'SET_USER_LIST',
                    payload: data,
                });
            },
            onFaild: (error) => {
                toast(error);
            },
        });
    });
    return (
        <div>
            <UserComponent
                setState={setState}
                handleDelete={handleDelete}
                setUser={setUser}
            />
            <UserForm
                open={state?.isForm}
                setState={setState}
                user={user}
                setUser={setUser}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default UserPage;
