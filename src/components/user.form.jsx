import Modal from 'react-bootstrap/Modal';

function UserForm({
    open = false,
    setState = () => {},
    user = {},
    setUser = () => {},
    handleSubmit = () => {},
}) {
    return (
        <Modal show={open} onHide={() => setState((prv) => ({ ...prv, isForm: false }))}>
            <div className='p-3'>
                <h4>User Form</h4>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>Name</label>
                        <input
                            type='text'
                            className='form-control'
                            id='name'
                            value={user?.username}
                            onChange={(e) =>
                                setUser((prv) => ({
                                    ...prv,
                                    username: e?.target?.value ?? '',
                                }))
                            }
                            placeholder='Enter name'
                        />
                    </div>

                    <div className='form-group'>
                        <label>Email address</label>
                        <input
                            type='email'
                            className='form-control'
                            id='email'
                            value={user?.email}
                            onChange={(e) =>
                                setUser((prv) => ({
                                    ...prv,
                                    email: e?.target?.value ?? '',
                                }))
                            }
                            placeholder='Enter email'
                        />
                    </div>
                    <button type='submit' className='btn btn-primary'>
                        Submit
                    </button>
                </form>
            </div>
        </Modal>
    );
}

export default UserForm;
