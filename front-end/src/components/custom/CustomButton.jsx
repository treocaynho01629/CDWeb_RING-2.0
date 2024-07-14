import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
    '&.Mui-focused': {
        outline: 'none',
        border: 0
    },

    //Filled
    '&.MuiButton-contained': {
        '&:hover': {
            backgroundColor: 'lightgray',
            color: 'black'
        },

        '&:disabled': {
            backgroundColor: 'gray',
            color: 'darkslategray'
        }
    },
}));


export default function CustomButton(props) {
    return <StyledButton {...props}/>;
}