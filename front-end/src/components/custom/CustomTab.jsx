import { styled } from '@mui/material/styles';
import { Tab } from '@mui/material';

const StyledTab = styled((props) => <Tab {...props} />)(
    ({ theme }) => ({
        fontWeight: 500,
        color: theme.palette.grey[500],
        '&.Mui-selected': {
            fontWeight: 'bold',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
        '&.Mui-focusVisible': {
            backgroundColor: theme.palette.primary.main,
        },
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },

        [theme.breakpoints.down('sm')]: {
            textTransform: 'none',
            
            '&.Mui-selected': {
                fontWeight: 'bold',
                backgroundColor: 'transparent',
                color: theme.palette.primary.main,
            },
            '&:hover': {
                backgroundColor: 'inherit',
            },
        },
    }),
);

const CustomTab = (props) => {
    return (<StyledTab {...props} />)
}

export default CustomTab