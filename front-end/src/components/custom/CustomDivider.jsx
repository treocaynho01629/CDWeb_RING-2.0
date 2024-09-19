import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';

const StyledDivider = styled(Divider)(({ theme }) => ({
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: theme.palette.primary.main,
    textAlign: 'center',
    justifyContent: 'center',
    margin: '10px 0px',

    [theme.breakpoints.down('sm')]: {
        fontSize: 16,
        fontWeight: 500,
        padding: '0 10px',
        textTransform: 'none'
    },
}));


export default function CustomDivider(props) {
    return <StyledDivider {...props} />;
}