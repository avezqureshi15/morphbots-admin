import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hook'; // Adjust import path as needed
import { deleteAdminThunk, getAdminsThunk, editAdminThunk } from '../../slices/adminSlice'; // Adjust import path as needed
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import PrimaryButton from '../../components/custom/PrimaryButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditAdmin from './EditAdmin';
import { formatTimeStamp } from '../../utils/formatTime';
import Loader from '../../components/custom/Loader'
interface Admin {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
}

const AdminTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const { status, admins } = useAppSelector((state) => state.admin);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null); // Track selected admin

    useEffect(() => {
        dispatch(getAdminsThunk());
    }, [dispatch]);

    const handleOpenPopup = (admin: Admin) => {
        setSelectedAdmin(admin);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedAdmin(null); // Clear selected admin when closing the popup
    };

    const handleDelete = (adminId: string) => {
        dispatch(deleteAdminThunk(adminId));
    };

    const handleSave = (updatedAdmin: Admin) => {
        const payload = {
            id: updatedAdmin.id,
            data: {
                full_name: updatedAdmin.full_name,
                email: updatedAdmin.email,
                role: updatedAdmin.role,
            },
        };
        dispatch(editAdminThunk(payload));
    };

    return (
        <>
            {status === 'loading' && (
                <Loader />
            )}
            {/* {error && <Typography color='red'>{error}</Typography>} */}
            {status === 'idle' && (
                <TableContainer component={Paper} sx={{ width: '1100px', margin: '2rem' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: '800' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: '800' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: '800' }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: '800' }}>Onboarding Date</TableCell>
                                <TableCell sx={{ fontWeight: '800' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {admins.map((admin, index) => (
                                <TableRow key={admin.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#F7F9FA' }}>
                                    <TableCell sx={{ fontWeight: '700' }}>{admin.full_name}</TableCell>
                                    <TableCell sx={{ fontWeight: '700' }}>{admin.email}</TableCell>
                                    <TableCell sx={{ fontWeight: '700' }}>{admin.role}</TableCell>
                                    <TableCell sx={{ fontWeight: '700' }}>{formatTimeStamp(admin.created_at)}</TableCell>
                                    <TableCell sx={{ fontWeight: '700' }}>
                                        <PrimaryButton
                                            variant='filled'
                                            textTransform='capitalize'
                                            height='31px'
                                            width='80px'
                                            fontWeight='600'
                                            fontSize='13px'
                                            icon={EditIcon}
                                            fontFamily='Roboto, sans-serif'
                                            letterSpacing='1px'
                                            onClick={() => handleOpenPopup(admin)}
                                            style={{ marginRight: '0.5rem' }}
                                        >
                                            Edit
                                        </PrimaryButton>
                                        <PrimaryButton
                                            onClick={() => handleDelete(admin.id)}
                                            variant='filled'
                                            textTransform='capitalize'
                                            height='31px'
                                            width='100px'
                                            fontWeight='600'
                                            fontSize='13px'
                                            backgroundColor='#DD6E70'
                                            borderColor='#DD6E70'
                                            icon={DeleteIcon}
                                            fontFamily='Roboto, sans-serif'
                                            letterSpacing='1px'
                                        >
                                            Delete
                                        </PrimaryButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {selectedAdmin && (
                <EditAdmin
                    open={isPopupOpen}
                    onClose={handleClosePopup}
                    admin={selectedAdmin}
                    onSave={handleSave} // Pass handleSave function
                />
            )}
        </>
    );
};

export default AdminTable;
