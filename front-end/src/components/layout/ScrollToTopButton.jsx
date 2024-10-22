import { useCallback } from "react";
import { Zoom, Fab } from "@mui/material";
import { keyframes, styled } from '@mui/system';
import { KeyboardArrowUp } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import useScrollTrigger from "@mui/material/useScrollTrigger";

const myEffect = keyframes`
    0% { transform: scale(1, 1) translateY(0); }
    2.5% { transform: scale(1.3, .8) translateY(5px); }
    6.2% { transform: scale(.8, 1.2) translateY(-18px); }
    7.5% { transform: scale(.8, 1.2) translateY(-20px); }
    8% { transform: scale(.9, 1.1) translateY(-21px); }
    8.7% { transform: scale(.9, 1.1) translateY(-23px); }
    11.5% { transform: scale(.8, 1.2)  translateY(-22px); }
    13% { transform: scale(.8 ,1.2) translateY(-4px); }
    14% { transform: scale(1, 1)  translateY(0); }
    15% { transform: scale(1.3, .8) translateY(5px); }
    16.25% { transform: scale(1, 1) translateY(-2px); }
    100% { transform: scale(1, 1) translateY(0); }
`

const ButtonContainer = styled('div')(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    zIndex: 1,

    '&.medium': {
        bottom: theme.spacing(8),
    },

    [theme.breakpoints.down('sm_md')]: {
        bottom: theme.spacing(2),
        right: theme.spacing(2),

        '&.high': {
            bottom: theme.spacing(17),
        }
    },

    [theme.breakpoints.down('sm')]: {
        bottom: theme.spacing(1.5),
        right: theme.spacing(1.5),

        '&.medium': {
            bottom: theme.spacing(7.5),
        },

        '&.high': {
            bottom: theme.spacing(14),
        }
    },
}));

const StyledFab = styled(Fab)(({ theme }) => ({
    borderRadius: 0,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    animation: `${myEffect} 7s infinite`,
    animationDelay: '10s',
    WebkitAnimationDelay: '5s',

    '&:hover': {
        backgroundColor: theme.palette.grey[300],
        color: theme.palette.text.primary,
        WebkitAnimationPlayState: 'pause'
    },

    [theme.breakpoints.down('sm')]: {
        width: 35,
        height: 35,
        opacity: .8,
    },
}));

const buttonHeightMap = {
    '/cart': 'high',
    '/checkout': 'high',
    '/product': 'medium',
};
  
const ScrollToTopButton = () => {
    const trigger = useScrollTrigger({ threshold: 100 });
    const location = useLocation();
    const pathname = `/${location.pathname.split('/')[1]}`;

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, []);

    return (
        <Zoom in={trigger}>
            <ButtonContainer role="presentation" className={buttonHeightMap[pathname]}>
                <StyledFab
                    onClick={scrollToTop}
                    size="medium"
                    aria-label="scroll back to top"
                >
                    <KeyboardArrowUp sx={{ fontSize: 30 }} />
                </StyledFab>
            </ButtonContainer>
        </Zoom>
    )
}

export default ScrollToTopButton