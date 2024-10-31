import { DialogTitle } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTitle = styled(DialogTitle)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    borderBottom: '.5px solid',
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    fontSize: 18,

    'a': {
        display: 'none',
        alignItems: 'center',
        color: theme.palette.text.primary,
        marginRight: theme.spacing(.5)
    },

    [theme.breakpoints.down('md')]: {
        textTransform: 'none',
        fontSize: 16,

        'a': { display: 'flex' }
    }
}));

export default function CustomDialogTitle(props) {
    const { children } = props;

    return (
        <StyledTitle {...props}>
            {children}
        </StyledTitle>
    )
}