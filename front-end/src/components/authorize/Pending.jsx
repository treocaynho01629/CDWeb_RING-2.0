import { Backdrop, CircularProgress } from '@mui/material';

const Pending = () => {
  return (
    <Backdrop sx={{ color: 'white'}} open={true}>
        <CircularProgress
        sx={{
            color: '#63e399',
            marginRight: '10px',
        }}
        size={40}
        thickness={5}
        />
        <b>Đang gửi yêu cầu ...</b>
    </Backdrop>
  )
}

export default Pending