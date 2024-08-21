import { Typography } from '@mui/material';
import styled from 'styled-components';
import { Images } from '../../constants/imageConstants';
import { useNavigate } from 'react-router-dom';

const Logo = styled('img')({
    width: '387.1px',
    height: 'auto',
    marginBottom: '3%',
    cursor: 'pointer'
});

const HeaderText = styled(Typography)({
    fontFamily: 'Roboto, sans-serif',
    fontWeight: '700 !important',
    color: '#000',
    marginBottom: '1rem',
    textAlign: 'center'
});

interface AuthHeaderProps {
    header: string;
}


const AuthHeader: React.FC<AuthHeaderProps> = ({ header }) => {
    const navigate = useNavigate();
    return (
        <div>
            <Logo src={Images.MORPHBOTS_LOGO} onClick={() => { navigate('/login') }} alt='Morphbots Logo' />
            <HeaderText variant='h5'  >
                {header}
            </HeaderText>
        </div>
    );
};

export default AuthHeader;
