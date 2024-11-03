import styled, { keyframes } from 'styled-components'
import { useState, useEffect, lazy, Suspense } from "react";
import { useLocation } from 'react-router-dom';
import { Button, Grid2 as Grid } from '@mui/material';
import SimpleNavbar from "../components/navbar/SimpleNavbar";
import LoginTab from '../components/authorize/LoginTab';
import RegisterTab from '../components/authorize/RegisterTab';
import useTitle from '../hooks/useTitle';

const PendingIndicator = lazy(() => import('../components/layout/PendingIndicator'));

//#region styled
const fadeIn = keyframes`
    from {opacity: 0}
    to {opacity: 1}
`

const fadeIn2 = keyframes`
    from { opacity: .1}
    to { opacity: 1}
`

const rotate = keyframes`
    from { transform: rotate(0deg) translateZ(0); }
    to { transform: rotate(360deg) translateZ(0); }
`

const Wrapper = styled.div`
    display: flex;
    height: 100dvh;
    overflow: hidden;

    ${props => props.theme.breakpoints.down("md")} {
        flex-direction: column-reverse;
    }
`

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 50px;
    background-color: red;

    &.login { animation: ${fadeIn} .3s linear; }
    &.signup { animation: ${fadeIn2} .3s linear; }

    ${props => props.theme.breakpoints.down("md")} {
        padding: 40px 10px;
    }
`

const TestContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    padding-bottom: 10%;

    ${props => props.theme.breakpoints.down("md")} {
        align-items: flex-start;
    }
`

const Background = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    z-index: -1;

    ${props => props.theme.breakpoints.down("md")} {
        height: 40%;
    }
`

const SignDivider = styled.button`
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    border: 0;
    background-color: ${props => props.theme.palette.primary.main};
    color: ${props => props.theme.palette.primary.contrastText};
    border-radius: 0;
    border-radius: 50px;
    width: 60px;
    height: 60px;
    margin: 30px;
    cursor: pointer;
    
    ${props => props.theme.breakpoints.down("md")} {
        display: none;
    }
`

const WaveContainer = styled.section`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scaleX(1.2) scaleY(1.2);
    transform-origin: left;

    ${props => props.theme.breakpoints.down("md")} {
        transform: scaleX(1.7) scaleY(1.2);
        transform-origin: bottom;
    }
`

const Wave = styled.span`
    position: absolute;
    height: 100vh;
    width: 100vh;
    border-radius: 43%;
    top: 0;
    left: 14%;
    background: #6DE363;
    opacity: .2;
    animation: ${rotate} 32s infinite steps(480, end);
    
    &:nth-child(2) {
        background: #63E3D9;
        opacity: .3;
        left: 7%;
        animation-duration: 24s;
        animation-timing-function: steps(330, end);
    }
    
    &:nth-child(3) {
        background: #63E399;
        opacity: .4;
        left: 0;
        animation-duration: 28s;
        animation-timing-function: steps(420, end);
    }

    ${props => props.theme.breakpoints.down("md")} {
        height: 100vw;
        width: 100vw;
        top: auto;
        left: 0;
        bottom: 0;
    }
`
//#endregion

function SignPage() {
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(location.pathname === '/login');
    const [pending, setPending] = useState(false);

    //Set title
    useTitle('RING! - Chào mừng');

    //Update tab
    useEffect(() => {
        setIsLogin(location.pathname == '/login');
    }, [location])

    const toggleTab = () => { setIsLogin(prev => !prev) }

    return (
        <Wrapper>
            {pending &&
                <Suspense fallBack={null}>
                    <PendingIndicator open={pending} message="Đang gửi yêu cầu..." />
                </Suspense>
            }
            <SimpleNavbar />
            {/* <Container className={`${isLogin ? 'login' : 'signup'}`}>
                <Grid
                    container
                    size="grow"
                    spacing={5}
                    display="flex"
                    justifyContent="center"
                    offset={{ xs: 0, md: 'auto' }}
                    alignItems={{ xs: 'center', md: 'flex-start' }}
                    direction={{ xs: isLogin ? 'column' : 'column-reverse', md: isLogin ? 'row' : 'row-reverse' }}
                >
                    <Grid
                        size="grow"
                        maxWidth={350}
                        alignItems="center"
                        justifyContent="center"
                        display={{ xs: isLogin ? 'flex' : 'none', md: 'flex' }}
                    >
                        <LoginTab {...{ pending, setPending }} />
                    </Grid>
                    <Grid
                        size="auto"
                        height={{ xs: 'auto', md: 350 }}
                        alignItems="center"
                        justifyContent="center"
                        display="flex"
                    >
                        <>
                            <SignDivider onClick={toggleTab}>HOẶC</SignDivider>
                            <Button
                                sx={{ display: { xs: 'block', md: 'none' } }}
                                variant="outlined"
                                color="primary"
                                onClick={toggleTab}
                            >
                                {isLogin ? 'CHƯA CÓ TÀI KHOẢN?' : 'ĐÃ CÓ TÀI KHOẢN?'}
                            </Button>
                        </>
                    </Grid>
                    <Grid
                        size="grow"
                        maxWidth={350}
                        alignItems="center"
                        justifyContent="center"
                        display={{ xs: isLogin ? 'none' : 'flex', md: 'flex' }}
                    >
                        <RegisterTab {...{ pending, setPending }} />
                    </Grid>
                </Grid>
            </Container> */}
            <TestContainer>
                <LoginTab {...{ pending, setPending }} />
            </TestContainer>
            <Background>
                <WaveContainer>
                    <Wave></Wave>
                    <Wave></Wave>
                    <Wave></Wave>
                </WaveContainer>
            </Background>
        </Wrapper >
    )
}

export default SignPage