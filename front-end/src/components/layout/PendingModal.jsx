import { Backdrop, CircularProgress } from '@mui/material';

const PendingModal = (props) => {
  const { open, message, children } = props;

  return (
    <Backdrop sx={{ display: 'flex', flexDirection: 'column', zIndex: 9999 }} open={open}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CircularProgress
          sx={{ marginRight: '10px' }}
          color="primary"
          size={40}
          thickness={5}
        />
        <b>{message}</b>
      </div>
      <br />
      {children}
    </Backdrop>
  )
}

export default PendingModal