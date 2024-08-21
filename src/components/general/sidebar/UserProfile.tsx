import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import { styled } from '@mui/system';

const ProfileContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    marginTop: '20px',
});

const UserName = styled(Typography)({
    marginLeft: '10px',
    fontWeight: 600,
});

interface UserProfileProps {
    name: string;
    photoUrl: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, photoUrl }) => {
    return (
        <ProfileContainer>
            <Avatar alt={name} src={photoUrl} />
            <UserName>{name}</UserName>
        </ProfileContainer>
    );
};

export default UserProfile;
