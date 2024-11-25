import styled from "@emotion/styled";
import { useState, lazy, Suspense } from "react";
import { useParams } from 'react-router';
import { keyframes } from "@emotion/react";
import SimpleNavbar from "../components/navbar/SimpleNavbar";
import useTitle from '../hooks/useTitle';

const PendingModal = lazy(() => import('../components/layout/PendingModal'));
const RegisterTab = lazy(() => import('../components/authorize/RegisterTab'));
const LoginTab = lazy(() => import('../components/authorize/LoginTab'));

//#region styled
const rotate = keyframes`
    from { transform: rotate(0deg) translateZ(0); }
    to { transform: rotate(360deg) translateZ(0); }
`

const flowIn = keyframes`
    from { transform: rotate(240deg) translateZ(0); }
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
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    
    ${props => props.theme.breakpoints.down("md")} {
        align-items: flex-start;
        margin-top: -${props => props.theme.spacing(8)};
    }
`

const Background = styled.div`
    position: relative;
    width: 70%;
    height: 100%;
    z-index: -1;
    transform-origin: 110% 55%;
    animation: ${flowIn} 1s ${props => props.theme.transitions.easing.easOut} 1;

    ${props => props.theme.breakpoints.down("md")} {
        width: 100%;
        height: 25%;
        transform-origin: 50% -150%;
    }
`

const WaveContainer = styled.section`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scale(1.2);
    transform-origin: left;

    ${props => props.theme.breakpoints.down("md")} {
        transform: scale(1.8);
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
    background: hsl(from ${props => props.theme.palette.primary.main}  calc(h - 30) s l / 0.2);
    animation: ${rotate} 32s infinite steps(480, end);
    
    &:nth-of-type(2) {
        background: hsl(from ${props => props.theme.palette.primary.main}  calc(h + 30) s l / 0.3);
        left: 7%;
        animation-duration: 24s;
        animation-timing-function: steps(330, end);
    }
    
    &:nth-of-type(3) {
        background: hsl(from ${props => props.theme.palette.primary.main}  h s l / 0.4);
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

function AuthPage() {
    const { tab } = useParams();
    const [pending, setPending] = useState(false);

    //Set title
    useTitle('RING! - Chào mừng');

    return (
        <Wrapper>
            {pending &&
                <Suspense fallBack={null}>
                    <PendingModal open={pending} message="Đang gửi yêu cầu..." />
                </Suspense>
            }
            <SimpleNavbar />
            <Container>
                {tab == 'login' ?
                    <LoginTab {...{ pending, setPending }} />
                    : tab == 'register' ?
                        <RegisterTab {...{ pending, setPending }} />
                        : null}
            </Container>
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

export default AuthPage