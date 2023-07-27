import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import React from 'react';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from 'react-redux';

const UserListComponent = () => {
    const dispatch = useDispatch();
    const userList = useSelector((state) => state?.data?.users);
    const selectedUser = useSelector((state) => state?.data?.selectedUser);
    return (
        <div className='list-group'>
            <div className='list-group-item font-weight-bold'>User List</div>
            {userList.map((item, index) => {
                return (
                    <div
                        key={index}
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                            dispatch({
                                type: 'SELECT_USER',
                                payload: item?.id,
                            })
                        }
                        className={`list-group-item ${
                            selectedUser === item?.id ? 'active' : ''
                        }`}
                    >
                        {item?.username}
                    </div>
                );
            })}
        </div>
    );
};

export default UserListComponent;
