import styled, { keyframes } from 'styled-components'
import { useState, useEffect, lazy, Suspense } from "react";
import { useLocation } from 'react-router-dom';
import SimpleNavbar from "../components/navbar/SimpleNavbar";
import LoginTab from '../components/authorize/LoginTab';
import RegisterTab from '../components/authorize/RegisterTab';
import CustomButton from '../components/custom/CustomButton';
import useAuth from '../hooks/useAuth';
import useTitle from '../hooks/useTitle';

const PendingIndicator = lazy(() => import('../components/layout/PendingIndicator'));

//#region styled
const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeIn2 = keyframes`
  from {
    opacity: .1;
  }

  to {
    opacity: 1;
  }
`;

const Container = styled.div`
`

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;

    &.login {
        animation: ${fadeIn} .3s linear;
    }

    &.signup {
        flex-direction: column-reverse;
        animation: ${fadeIn2} .3s linear;
    }
    
    @media (min-width: 900px) {
        flex-direction: row;

        &.signup {
            flex-direction: row-reverse;
            animation: ${fadeIn2} .3s linear;
        }
    }
`

const TabContainer = styled.div`
    justify-content: center;
    flex-grow: 20;
    display: none;

    &.active {
        display: flex;
    }
    
    @media (min-width: 900px) {
        width: 450px;
        display: flex;
    }
`

const DividerContainer = styled.div`
    display: flex;   
    margin: 40px 0px;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
`

const SignDivider = styled.button`
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.palette.secondary.main};
    color: ${props => props.theme.palette.secondary.contrastText};
    border-radius: 0;
    border-radius: 50px;
    width: 60px;
    height: 60px;
    display: none;

    @media (min-width: 900px) {
        display: flex;
    }
`
//#endregion

function SignPage() {
    const location = useLocation();
    const { persist } = useAuth(); //Is user logged in
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
        <Container>
            <SimpleNavbar />
            {(pending) ?
                <Suspense fallBack={<></>}>
                    <PendingIndicator open={pending} message="Đang gửi yêu cầu..." />
                </Suspense>
                : null
            }
            <Wrapper className={`${isLogin ? 'login' : 'signup'}`}>
                {!persist
                    &&
                    <>
                        <TabContainer className={`${isLogin ? 'active' : ''}`}>
                            <LoginTab {...{ pending, setPending }} />
                        </TabContainer>
                        <DividerContainer>
                            <SignDivider onClick={toggleTab}>HOẶC</SignDivider>
                            <CustomButton
                                sx={{ display: { xs: 'block', md: 'none' } }}
                                variant="outlined"
                                color="secondary"
                                onClick={toggleTab}
                            >
                                {isLogin ? 'CHƯA CÓ TÀI KHOẢN?' : 'ĐÃ CÓ TÀI KHOẢN?'}
                            </CustomButton>
                        </DividerContainer>
                    </>
                }
                <TabContainer className={`${isLogin ? '' : 'active'}`}>
                    <RegisterTab {...{ pending, setPending }} />
                </TabContainer>
            </Wrapper>
        </Container>
    )
}

export default SignPage