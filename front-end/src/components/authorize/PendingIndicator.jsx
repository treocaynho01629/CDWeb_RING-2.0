import { Backdrop, CircularProgress } from '@mui/material';

const PendingIndicator = ({ open, message }) => {
  return (
    <Backdrop sx={{ color: 'white', zIndex: 9999 }} open={open}>
      <CircularProgress
        sx={{
          color: '#63e399',
          marginRight: '10px',
        }}
        size={40}
        thickness={5}
      />
      <b>{message}</b>
    </Backdrop>
  )
}

export default PendingIndicator