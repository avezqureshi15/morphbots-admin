import { Box, CircularProgress } from '@mui/material'

const Loader = () => {
    return (
        <Box
            component='div'
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <CircularProgress style={{ color: '#6ECDDD' }} />
        </Box>
    )
}

export default Loader
