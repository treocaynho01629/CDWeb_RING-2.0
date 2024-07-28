import { Backdrop, CircularProgress } from '@mui/material';

const PendingIndicator = (props) => {
  const { open, message, children } = props;

  return (
    <Backdrop sx={{ color: 'background.default', display: 'flex', flexDirection: 'column', zIndex: 9999 }} open={open}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CircularProgress
          sx={{
            color: 'secondary.main',
            marginRight: '10px',
          }}
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

export default PendingIndicator