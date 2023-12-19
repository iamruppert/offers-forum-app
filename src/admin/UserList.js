import React, { useState, useEffect } from 'react';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 4;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/api/admin/listAllUsers?page=${currentPage}&size=${itemsPerPage}`);
                if (response.ok) {
                    const { content, totalPages } = await response.json();
                    setUsers(content);
                    setTotalPages(totalPages);
                } else {
                    console.error('Failed to fetch users:', response.statusText);
                }
            } catch (error) {
                console.error('Error occurred while fetching users', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4" style={styles.heading}>
                User List
            </h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <React.Fragment>
                    {users && users.length > 0 ? (
                        <table className="table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Surname</th>
                                <th>Pesel</th>
                                <th>Country</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Enabled</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.surname}</td>
                                    <td>{user.pesel}</td>
                                    <td>{user.country}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.enabled ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No users available.</p>
                    )}
                    <div className="d-flex justify-content-center mt-3">
                        <nav>
                            <ul className="pagination">
                                {[...Array(totalPages).keys()].map((index) => (
                                    <li key={index} className={`page-item ${index === currentPage ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(index)}>
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};

const styles = {
    heading: {
        borderBottom: '2px solid #000',
        fontStyle: 'italic',
        fontSize: '28px',
        paddingBottom: '10px',
        display: 'inline-block',
        textAlign: 'center',
        width: '100%',
    },
};

export default UserList;
