import { Paper } from '@mui/material';
import { styled } from '@mui/material';

//#region preStyled
const CountContainer = styled(Paper)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 15px'
}));

const CountInfo = styled.div`
    text-align: right;
    white-space: nowrap;
`

const CountIcon = styled('span')(({ theme }) => ({
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',

    svg: { fontSize: '60px' }
}));
//#endregion

const CountCard = ({ count, icon, title }) => {

    return (
        <CountContainer elevation={3} >
            <CountIcon>{icon}</CountIcon>
            <CountInfo><h2 style={{ margin: 0 }}>{count}</h2><span>{title}</span></CountInfo>
        </CountContainer>
    )
}

export default CountCard