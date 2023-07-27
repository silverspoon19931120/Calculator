import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    timeout: 1000,
});

export const createUser = ({ user = {}, onSave = () => {} }) => {
    axiosInstance
        .post('/users/create', {
            ...user,
        })
        .then((response) => {
            onSave(response.data);
        })
        .catch((error) => {
            onSave(error);
        });
};

export const updateUser = ({ user = {}, onLoad = () => {} }) => {
    console.log(user, 'userItem');
    axiosInstance
        .patch('/users/id/' + user?.id, { ...user })
        .then((response) => {
            onLoad(response?.data?.message ?? '');
        })
        .catch((error) => {
            onLoad(error);
            console.error(error);
        });
};

export const getUsers = ({ onLoad = () => {}, onFaild = () => {} }) => {
    axiosInstance
        .get('/users')
        .then((response) => {
            onLoad(response.data);
        })
        .catch((error) => {
            console.error(error);
            onFaild(error);
        });
};

export const deleteUser = ({ delId = '', onLoad = () => {} }) => {
    axiosInstance
        .delete('/users/id/' + delId)
        .then((response) => {
            onLoad(response?.data ?? '');
        })
        .catch((error) => {
            onLoad(error);
        });
};
