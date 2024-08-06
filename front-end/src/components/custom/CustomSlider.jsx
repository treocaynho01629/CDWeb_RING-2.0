import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const StyledSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.secondary.main,
    height: 8,

    '& .MuiSlider-track': {
        border: 'none',
    },

    '& .MuiSlider-thumb': {
        height: 20,
        width: 20,
        backgroundColor: theme.palette.common.white,
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&:before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        backgroundColor: theme.palette.secondary.main,
    },
}));


export default function CustomSlider(props) {
    return <StyledSlider {...props} />;
}