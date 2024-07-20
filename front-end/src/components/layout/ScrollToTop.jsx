import React from "react";
import { Box, Zoom, Fab } from "@mui/material";
import { keyframes } from '@mui/system';
import { KeyboardArrowUp } from "@mui/icons-material";
import useScrollTrigger from "@mui/material/useScrollTrigger";

const myEffect = keyframes`
    0%   { transform: scale(1,1)      translateY(0); }
    2.5%  { transform: scale(1.3,.8)   translateY(5px); }
    6.2%   { transform: scale(.8,1.2)      translateY(-18px); }
    7.5%  { transform: scale(.8,1.2)   translateY(-20px); }
    8%  { transform: scale(.9,1.1)   translateY(-21px); }
    8.7%  { transform: scale(.9,1.1)   translateY(-23px); }
    11.5%  { transform: scale(.8,1.2)   translateY(-22px); }
    13%  { transform: scale(.8,1.2) translateY(-4px); }
    14%  { transform: scale(1,1) translateY(0); }
    15%  { transform: scale(1.3,.8) translateY(5px); }
    16.25%  { transform: scale(1,1)      translateY(-2px); }
    100% { transform: scale(1,1)      translateY(0); }
`

const styledFab = {
    borderRadius: 0,
    color: 'white',
    backgroundColor: '#63e399',
    animation: `${myEffect} 7s infinite`,
    animationDelay: '5s',
    '-webkit-animation-delay': '5s',
    '&:hover': {
        backgroundColor: 'lightgray',
        color: 'black',
    },

    '&:focus': {
        border: 'none',
        outline: 'none'
    }
}

const ScrollToTop = () => {
    const trigger = useScrollTrigger({
        threshold: 100,
    });

    const scrollToTop = React.useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, []);

    return (
        <Zoom in={trigger}>
            <Box
                role="presentation"
                sx={{
                    position: "fixed",
                    bottom: 55,
                    right: 15,
                    zIndex: 99,

                    '@media screen and (min-width: 600px)': {
                        bottom: 32,
                        right: 32,
                    },
                }}
            >
                <Fab
                    onClick={scrollToTop}
                    size="medium"
                    aria-label="scroll back to top"
                    sx={styledFab}
                >
                    <KeyboardArrowUp sx={{ fontSize: 30 }} />
                </Fab>
            </Box>
        </Zoom>
    )
}

export default ScrollToTop