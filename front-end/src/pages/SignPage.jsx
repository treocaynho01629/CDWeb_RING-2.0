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

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 50px;

    &.login {animation: ${fadeIn} .3s linear;}
    &.signup {animation: ${fadeIn2} .3s linear;}

    ${props => props.theme.breakpoints.down("md")} {
        padding: 40px 10px;
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
        <div>
            <SimpleNavbar />
            {(pending) ?
                <Suspense fallBack={<></>}>
                    <PendingIndicator open={pending} message="Đang gửi yêu cầu..." />
                </Suspense>
                : null
            }
            <Wrapper className={`${isLogin ? 'login' : 'signup'}`}>
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
            </Wrapper>
        </div >
    )
}

export default SignPage