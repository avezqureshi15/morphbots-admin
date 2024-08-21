import React, { useState, MouseEvent, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, List, ListItem, Paper, Typography, Menu, MenuItem, IconButton, Avatar, Backdrop } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MailIcon from '@mui/icons-material/Mail';
import BookIcon from '@mui/icons-material/Book';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Images } from '../../../constants/imageConstants';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import { getAdminDetailsThunk } from '../../../slices/adminSlice';

interface StyledListItemProps {
    isActive?: boolean;
}

const StyledListItem = styled(ListItem, {
    shouldForwardProp: (prop) => prop !== 'isActive',
})<StyledListItemProps>(({ isActive }) => ({
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '1rem 0rem',
    backgroundColor: isActive ? '#48C1B8' : 'transparent',
    color: isActive ? '#FFF' : 'black',
    '& .MuiTypography-root': {
        color: isActive ? '#FFF' : 'black',
    },
    '& .MuiSvgIcon-root': {
        color: isActive ? '#FFF' : '#636363',
    },
}));

const Sidebar: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const open = Boolean(anchorEl);
    const dispatch = useAppDispatch();
    const { loggedAdmin } = useAppSelector((state) => state.admin);
    console.log(loggedAdmin)
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        handleMenuClose();
        setTimeout(() => {
            navigate('/login');
            window.location.reload();
        }, 1000);
    };

    const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSettings = () => {
        navigate('/settings');
        handleMenuClose();
    };

    useEffect(() => {
        dispatch(getAdminDetailsThunk());
    }, [])

    function getInitials(name: string): string {
        const names = name.split(' ');
        const initials = names.map(n => n.charAt(0).toUpperCase()).join('');
        return initials.slice(0, 2); // Take the first two initials
    }


    const menuItems = [
        { text: 'Booking System Configuration', icon: <HomeIcon />, path: '/booking-system-configuration' },
        { text: 'Confirmation Email', icon: <MailIcon />, path: '/confirmation-email' },
        { text: 'Curriculum Management', icon: <BookIcon />, path: '/curriculum-management' },
        { text: 'Admin Team Management', icon: <GroupIcon />, path: '/admin-team-management' }
    ];

    return (
        <Box component='div' sx={{
            height: '100vh',
            width: '356px',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 10,
        }}>
            <Paper
                style={{
                    padding: '5px',
                    position: 'relative',
                    borderRadius: 0,
                    height: '100vh',
                }}
            >
                {/* Header */}
                <NavLink to='/' style={{ textDecoration: 'none', color: '#636363' }} >
                    <Box
                        component='div'
                        sx={{
                            display: 'flex',
                            padding: '20px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <Box
                            component='img'
                            sx={{
                                width: '241px',
                                marginBottom: 1,
                                marginRight: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            src={Images.MORPHBOTS_LOGO}
                            alt='Description of the image'
                        />
                    </Box>
                </NavLink>
                {/* Navigation */}
                <List sx={{ padding: '0 20px', marginTop: '14%', fontFamily: 'OpenSans', fontWeight: 400, textAlign: 'start' }}>
                    {menuItems.map((item, index) => (
                        <StyledListItem
                            key={index}
                            //@ts-expect-error
                            component={NavLink}
                            to={item.path}
                            isActive={location.pathname === item.path}
                            sx={{
                                display: 'flex',
                                justifyContent: 'start',
                                alignItems: 'center',
                                paddingTop: '12px',
                                paddingBottom: '12px'
                            }}
                        >
                            {React.cloneElement(item.icon, { sx: { marginRight: '10px' } })}
                            <Typography variant='body1' sx={{ fontWeight: 600, textAlign: 'start' }}>
                                {item.text}
                            </Typography>
                        </StyledListItem>
                    ))}
                </List>

                {/* User Menu */}
                <Box
                    component='div'
                    sx={{
                        textAlign: 'center',
                        padding: '0 20px',
                        marginTop: '20px',
                        position: 'absolute',
                        marginLeft: '6%',
                        bottom: '53px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Avatar sx={{ bgcolor: '#48C1B8', marginRight: '10px', fontWeight: '700', borderRadius: '15px', width: '55px', height: '55px' }}>{getInitials(loggedAdmin?.full_name || '')}</Avatar>
                    <IconButton
                        color='inherit'
                        onClick={handleMenuClick}
                        sx={{
                            color: '#636363',
                            borderRadius: '10px',
                            justifyContent: 'center',
                            flex: 1,
                            textAlign: 'left'
                        }}
                    >
                        <Typography variant='body1' sx={{ fontWeight: 500, fontSize: '20px', width: '115px' }}>
                            {loggedAdmin?.full_name}
                        </Typography>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        sx={{
                            '& .MuiPaper-root': {
                                borderRadius: '10px',
                                top: '546px',
                                left: '67px',
                            }
                        }}
                    >
                        <MenuItem
                            onClick={handleSettings}
                            sx={{
                                width: '254px',
                                height: '56px',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '10px',
                                margin: '0 14px', '&:hover': {
                                    backgroundColor: '#48C1B8',
                                    color: '#FFF',
                                }
                            }}
                        >
                            <SettingsIcon sx={{ marginRight: '10px' }} />
                            Settings
                        </MenuItem>
                        <MenuItem
                            onClick={handleLogout}
                            sx={{
                                width: '254px',
                                height: '56px',
                                display: 'flex',
                                borderRadius: '10px',
                                margin: '0 14px', '&:hover': {
                                    backgroundColor: '#48C1B8',
                                    color: '#FFF',
                                }
                            }}
                        >
                            <ExitToAppIcon sx={{ marginRight: '10px' }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>

                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        backdropFilter: 'blur(5px)',
                    }}
                    open={open}
                    onClick={handleMenuClose}
                />
            </Paper>
        </Box>
    );
};

export default Sidebar;
