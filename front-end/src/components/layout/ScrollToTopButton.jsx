import { useCallback } from "react";
import { Zoom, Fab } from "@mui/material";
import { keyframes, styled } from '@mui/system';
import { KeyboardArrowUp } from "@mui/icons-material";
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
    bottom: 32,
    right: 32,
    zIndex: 99,

    [theme.breakpoints.down('sm')]: {
        bottom: 55,
        right: 15,
    },
}));

const StyledFab = styled(Fab)(({ theme }) => ({
    borderRadius: 0,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    animation: `${myEffect} 7s infinite`,
    animationDelay: '10s',
    '-webkit-animation-delay': '5s',

    '&:hover': {
        backgroundColor: theme.palette.grey[300],
        color: theme.palette.text.primary,
        'animation-play-state': 'pause'
    },
}));

const ScrollToTopButton = () => {
    const trigger = useScrollTrigger({ threshold: 100 });

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, []);

    return (
        <Zoom in={trigger}>
            <ButtonContainer role="presentation">
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