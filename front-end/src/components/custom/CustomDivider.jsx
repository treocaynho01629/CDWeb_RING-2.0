import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';

const StyledDivider = styled(Divider)(({ theme }) => ({
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: theme.palette.secondary.main,
    textAlign: 'center',
    justifyContent: 'center',
    margin: '10px 0px',
}));


export default function CustomDivider(props) {
    return <StyledDivider {...props} />;
}