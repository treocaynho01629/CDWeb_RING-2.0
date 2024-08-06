import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
    //Filled
    '&.MuiButton-contained': {
        '&:hover': {
            backgroundColor: theme.palette.grey[300],
            color: theme.palette.text.primary
        },

        '&:disabled': {
            backgroundColor: theme.palette.grey[500],
            color: theme.palette.text.disabled
        }
    },
}));


export default function CustomButton(props) {
    return <StyledButton {...props}/>;
}