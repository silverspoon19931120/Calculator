import React from 'react';
import { Link } from 'react-router-dom';

const HeaderComponent = () => {
    return (
        <nav
            style={{ justifyContent: 'space-between' }}
            className='navbar navbar-expand-lg navbar-light bg-light flex'
        >
            <Link to='/' className='navbar-brand'>
                <i className='fa fa-shopping-cart'></i>&nbsp; Order Form
            </Link>
            <ul className='navbar-nav'>
                <li className='nav-item'>
                    <Link to='/users' className='nav-link'>
                        <i className='fa fa-user'></i>
                        Users
                    </Link>
                </li>
                <li className='nav-item'>
                    <Link to='/orders' className='nav-link'>
                        <i className='fa fa-list'></i>
                        Orders
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default HeaderComponent;
