import React, { useMemo, useState } from 'react';
import { read, utils, writeFile } from 'xlsx';
import Select from 'react-select';
import { addOrders } from '../actions/home';
import LoadingScreen from 'react-loading-screen';
import toast from 'react-simple-toasts';
import HeaderComponent from './header.component';
import UserListComponent from './user.list.component';
import { useSelector } from 'react-redux';

const HomeComponent = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const selectedUser = useSelector((state) => state?.data?.selectedUser);

    const handleImport = ($event) => {
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;

                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    const newRows = rows.map((item) => {
                        let formattedDate = '';
                        if (!!item?.['Date ordered']) {
                            let dateObj = new Date(
                                (item?.['Date ordered'] - 25569) * 86400 * 1000
                            );
                            let month = dateObj.getMonth() + 1;
                            let day = dateObj.getDate();
                            let year = dateObj.getFullYear();
                            formattedDate = month + '/' + day + '/' + year;
                        }

                        return {
                            purchase_order: item?.['Purchase order'] ?? '',
                            source_warehouse: item?.['Source warehouse'] ?? '',
                            destination_store:
                                item?.['Destination store'] ?? '',
                            order_date: formattedDate,
                            product: '',
                            info: '',
                            product_type: item?.['Product type options'],
                        };
                    });
                    setOrders(newRows);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleExport = () => {
        const newArray = orders.map((obj) => {
            const newObj = { ...obj };
            delete newObj['product_type'];
            return newObj;
        });
        const headings = [
            [
                'Purchase order',
                'Source warehouse',
                'Destination store',
                'Date ordered',
                'Product type',
                'Other',
            ],
        ];
        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, newArray, { origin: 'A2', skipHeader: true });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Report.xlsx');
    };

    const handleSelect = (e, index) => {
        setOrders((prev) => {
            if (prev) {
                if (prev[index]) {
                    prev[index].product = e?.label;
                }
            }
            return prev;
        });
    };

    const handleMore = (e, index) => {
        setOrders((prev) => {
            if (prev) {
                if (prev[index]) {
                    prev[index].info = e?.target?.value ?? '';
                }
            }
            return prev;
        });
    };

    const handleSave = () => {
        setIsLoading(true);
        if (!selectedUser) {
            toast('Please Select the User');
            return;
        }
        addOrders({
            orders: orders,
            userId: selectedUser,
            onSave: (res) => {
                setIsLoading(false);
                toast(res);
            },
        });
    };

    return (
        <>
            <div className='row mb-4 mt-5'>
                <div className='col-sm-10 offset-1'>
                    <h4>NEW ORDERS</h4>
                    <div className='row'>
                        <div className='col-md-6'>
                            <div className='input-group'>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='file'
                                        className='custom-file-input'
                                        id='inputGroupFile'
                                        required
                                        onChange={handleImport}
                                        accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                    />
                                    <label
                                        className='custom-file-label'
                                        htmlFor='inputGroupFile'
                                    >
                                        Select the file
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <button
                                onClick={handleExport}
                                className='btn btn-primary float-right mx-1'
                                disabled={!orders?.length}
                            >
                                Export <i className='fa fa-download'></i>
                            </button>

                            <button
                                onClick={handleSave}
                                className='btn btn-success float-right mx-1'
                                disabled={!orders?.length}
                            >
                                Save <i className='fa fa-save'></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-sm-10 offset-1'>
                    <div className='row'>
                        <div className='col-sm-2'>
                            <UserListComponent />
                        </div>
                        <div className='col-sm-10'>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th scope='col'>No</th>
                                        <th scope='col'>Purchase order</th>
                                        <th scope='col'>Source warehouse</th>
                                        <th scope='col'>Destination store</th>
                                        <th scope='col'>Date ordered</th>
                                        <th scope='col'>Product Type</th>
                                        <th scope='col'>More</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length ? (
                                        orders.map((item, index) => (
                                            <tr key={index}>
                                                <th scope='row'>{index + 1}</th>
                                                <td>{item?.purchase_order}</td>
                                                <td>
                                                    {item?.source_warehouse}
                                                </td>
                                                <td>
                                                    {item?.destination_store}
                                                </td>
                                                <td>{item?.order_date}</td>
                                                <td>
                                                    <Select
                                                        className='basic-single'
                                                        classNamePrefix='select'
                                                        isClearable={true}
                                                        name='ss'
                                                        options={(
                                                            item?.product_type?.split(
                                                                ', '
                                                            ) ?? []
                                                        ).map((item) => {
                                                            return {
                                                                label:
                                                                    item ?? '',
                                                                value:
                                                                    item ?? '',
                                                            };
                                                        })}
                                                        onChange={(e) =>
                                                            handleSelect(
                                                                e,
                                                                index
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <div className='form-group'>
                                                        <input
                                                            type='text'
                                                            className='form-control'
                                                            placeholder='Additinal answer'
                                                            onChange={(e) =>
                                                                handleMore(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan='5'
                                                className='text-center'
                                            >
                                                No Orders Found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <LoadingScreen
                loading={isLoading}
                bgColor='#00000087'
                spinnerColor='black'
                textColor='#676767'
            >
                <div></div>
            </LoadingScreen>
        </>
    );
};

export default HomeComponent;
