import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { utils, writeFile } from 'xlsx';
import { deleteOrder, getOrders, updateOrder } from '../actions/home';
import toast from 'react-simple-toasts';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import { useSelector } from 'react-redux';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [delIds, setDelIds] = useState([]);
    const [dateRanage, setDateRanage] = useState([new Date(), new Date()]);
    const [dateMode, setDateMode] = useState({
        label: 'All',
        value: 'all',
    });

    const userList = useSelector((state) => state?.data?.users);
    const displayOrders = useMemo(() => {
        const regex = new RegExp(search, 'i');
        return orders
            .filter((item) => {
                for (let prop in item) {
                    if (regex.test(item[prop])) {
                        return true;
                    }
                }
                return false;
            })
            .filter((item) => {
                if (dateMode?.value === 'all') {
                    return true;
                } else if (dateMode?.value === 'order') {
                    return (
                        moment(item.order_date) >= moment(dateRanage[0]) &&
                        moment(item.order_date) <= moment(dateRanage[1])
                    );
                } else {
                    return (
                        moment(item.updated_at) >= moment(dateRanage[0]) &&
                        moment(item.updated_at) <= moment(dateRanage[1])
                    );
                }
            });
    }, [search, orders, dateRanage, dateMode]);

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        init();
    }, [dateRanage]);

    const init = () => {
        setIsLoading(true);
        getOrders({
            onLoad: (res) => {
                setIsLoading(false);
                setOrders(res);
            },
        });
    };

    const handleExport = () => {
        const newArray = displayOrders.map((obj) => {
            let newObj = {
                ...obj,
                order_date: moment(obj?.order_date).format('M/D/YYYY'),
                updated_at: moment(obj?.updated_at).format('M/D/YYYY'),
            };
            delete newObj['product_type'];
            delete newObj['id'];
            return newObj;
        });
        const headings = [
            [
                'Purchase order',
                'Source warehouse',
                'Destination store',
                'Date ordered',
                'Product type',
                'Information',
                'Updated Date',
            ],
        ];
        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, newArray, { origin: 'A2', skipHeader: true });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Report.xlsx');
    };

    const handleSelect = async (e, index, order) => {
        setOrders((prev) => {
            if (!prev) {
                return prev;
            }
            const updatedOrder = { ...prev[index], product: e?.label };
            return [
                ...prev.slice(0, index),
                updatedOrder,
                ...prev.slice(index + 1),
            ];
        });
        order = { ...order, product: e?.label };
        setIsLoading(true);
        await updateOrder({
            order,
            onLoad: (e) => {
                setIsLoading(false);
                toast(e);
            },
        });
    };

    const handleMore = (e, index) => {
        setOrders((prev) => {
            if (!prev || !prev[index]) {
                return prev;
            }
            const updatedOrder = {
                ...prev[index],
                info: e?.target?.value ?? '',
            };
            return [
                ...prev.slice(0, index),
                updatedOrder,
                ...prev.slice(index + 1),
            ];
        });
    };

    const handleCheck = (e, order) => {
        const checked = e?.target?.checked;
        const id = order?.id?.toString();
        setDelIds((prevIds) => {
            if (checked) {
                return [...prevIds, id];
            } else {
                // use array filter instead of splice
                return prevIds.filter((prevId) => prevId !== id);
            }
        });
    };

    const handleDelete = async () => {
        setIsLoading(true);
        await deleteOrder({
            delIds,
            onLoad: (e) => {
                setIsLoading(false);
                toast(e);
                setDelIds([]);
                init();
            },
        });
    };

    return (
        <div>
            <div className='row mb-2 mt-5'>
                <div className='col-sm-10 offset-1'>
                    <h4 className='display-6'>ORDERS</h4>
                    <div className='row'>
                        <div className='col-md-3'>
                            <div className='form-group'>
                                <input
                                    type='search'
                                    className='form-control'
                                    placeholder='Search Order'
                                    onChange={(e) =>
                                        setSearch(e?.target?.value ?? '')
                                    }
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex' }} className='col-md-6'>
                            <Select
                                className='basic-single'
                                classNamePrefix='select'
                                value={dateMode}
                                onChange={(e) => setDateMode(e)}
                                options={[
                                    {
                                        label: 'All',
                                        value: 'all',
                                    },
                                    {
                                        label: 'Order',
                                        value: 'order',
                                    },
                                    {
                                        label: 'Update',
                                        value: 'update',
                                    },
                                ]}
                            />
                            <DateRangePicker
                                disabled={dateMode?.value === 'all'}
                                onChange={setDateRanage}
                                value={dateRanage}
                                clearIcon={false}
                            />
                        </div>
                        <div className='col-md-3'>
                            <button
                                onClick={handleExport}
                                className='btn btn-primary float-right mx-1'
                                disabled={!displayOrders?.length}
                            >
                                Export <i className='fa fa-download'></i>
                            </button>
                            <button
                                onClick={handleDelete}
                                className='btn btn-danger float-right mx-1'
                                disabled={!delIds?.length}
                            >
                                Delete <i className='fa fa-trash'></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-sm-10 offset-1'></div>
            </div>
        </div>
    );
};

export default OrderPage;
