import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
});

export const addOrders = ({ orders = [], userId = '', onSave = () => {} }) => {
    axiosInstance
        .post('/orders/create', {
            orders: orders,
            user_id: userId
        })
        .then((response) => {
            onSave(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
};

export const getOrders = ({ user_id = '', onLoad = () => {} }) => {
    axiosInstance
        .post('/orders', { user_id: user_id })
        .then((response) => {
            onLoad(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
};

export const updateOrder = ({ order = {}, onLoad = () => {} }) => {
    console.log(order, 'orderItem');
    axiosInstance
        .post('/orders/edit/' + order?.id, { order: order })
        .then((response) => {
            onLoad(response?.data?.message ?? '');
        })
        .catch((error) => {
            console.error(error);
        });
};

export const deleteOrder = ({ delIds = [], onLoad = () => {} }) => {
    axiosInstance
        .post('/orders/delete', { delIds: delIds })
        .then((response) => {
            onLoad(response?.data ?? '');
        })
        .catch((error) => {
            console.error(error);
        });
};
