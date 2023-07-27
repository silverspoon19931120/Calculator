import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const UserComponent = ({
    setState = () => {},
    handleDelete = () => {},
    setUser = () => {},
}) => {
    const userList = useSelector((state) => state?.data?.users);
    const handleEdit = (user) => {
        setUser((prv) => ({
            ...prv,
            id: user?.id ?? '',
            username: user?.username ?? '',
            email: user?.email ?? '',
        }));
        setState((prv) => ({
            ...prv,
            isForm: true,
        }));
    };
    return (
        <div>
            <div className='row mb-2 mt-5'>
                <div className='col-sm-10 offset-1'>
                    <h4 className='display-6'>User list</h4>
                    <div className='row'>
                        <div className='col-md-6'></div>
                        <div className='col-md-6'>
                            <button
                                onClick={() => {
                                    setUser({
                                        password: '0',
                                        first_name: '',
                                        last_name: '',
                                    });
                                    setState((prv) => ({
                                        ...prv,
                                        isForm: true,
                                    }));
                                }}
                                className='btn btn-primary float-right mx-1'
                            >
                                New <i className='fa fa-plus'></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-sm-10 offset-1'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th scope='col'>No</th>
                                <th scope='col'>Name</th>
                                <th scope='col'>Email</th>
                                <th scope='col' className='text-right'>
                                    Action
                                </th>
                            </tr>
                            {userList?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item?.username}</td>
                                        <td>{item?.email}</td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleDelete(item?.id)
                                                }
                                                className='btn btn-danger float-right mx-1'
                                            >
                                                Delete{' '}
                                                <i className='fa fa-trash'></i>
                                            </button>
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className='btn btn-primary float-right mx-1'
                                            >
                                                Edit
                                                <i className='fa fa-trash'></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserComponent;
