import styled from '@emotion/styled'
import { Link } from 'react-router'
import { Button } from '@mui/material';
import { Block } from '@mui/icons-material';
import SimpleNavbar from '../../components/navbar/SimpleNavbar';

//#region styled
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100dvh;

    &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        mask-image: linear-gradient(200deg, transparent, transparent 75%, #000000);
        background: radial-gradient(circle, transparent 25%, ${props => props.theme.palette.background.default} 26%),
        linear-gradient(45deg, transparent 46%, ${props => props.theme.palette.primary.light} 47%, 
            ${props => props.theme.palette.primary.light} 52%, transparent 53%), 
        linear-gradient(135deg, transparent 46%, ${props => props.theme.palette.primary.light} 47%, 
            ${props => props.theme.palette.primary.light} 52%, transparent 53%);
        background-size: 4em 4em;
        background-color: ${props => props.theme.palette.background.default};
        opacity: .3;
    }
`

const Content = styled.div`
    font-size: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: ${props => props.theme.spacing(1)};

    h2 {
        font-size: 2.25em;
        margin: 0;
    }

    h3 {
        font-size: 1.5em;
        font-weight: 400;
    }

    p {
        margin: 0;
        color: ${props => props.theme.palette.text.secondary};
    }

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 12px;

        p {
            font-size: 1.25em;
            text-align: center;
        }
    }
`

const ErrorCode = styled.h1`
    display: flex;
    align-items: center;
    font-size: 13em;
    color: ${props => props.theme.palette.background.default};
    margin: 0;
    text-shadow:
        3px 3px 0 ${props => props.theme.palette.warning.main},
        -3px 3px 0 ${props => props.theme.palette.warning.main},
        -3px -3px 0 ${props => props.theme.palette.warning.main},
        3px -3px 0 ${props => props.theme.palette.warning.main};
    border-bottom: .02em solid ${props => props.theme.palette.primary.main};

    svg {
        font-size: .9em;

        path {
            fill: none;
            stroke: ${props => props.theme.palette.warning.main};
            stroke-width: .4px;
            stroke-linejoin: round;
        }
    }
`


const ErrorContainer = styled('div')(({ theme }) => ({
    mixBlendMode: 'darken',
    ...theme.applyStyles('dark', {
        mixBlendMode: 'lighten',
    }),
}));
//#endregion


const Unauthorized = () => {
    return (
        <Wrapper>
            <SimpleNavbar />
            <Content>
                <h2>Chờ đã!!!</h2>
                <ErrorContainer>
                    <ErrorCode>4<Block />1</ErrorCode>
                </ErrorContainer>
                <h3>Bạn không có quyền truy cập vào trang này</h3>
                <p>Liên hệ ringbookstore@ring.com hoặc đăng nhập tài khoản khác.</p>
                <Link to={-1}><Button sx={{ marginTop: 2 }} variant="outlined" color="primary">Quay trở lại</Button></Link>
            </Content>
        </Wrapper>
    )
}

export default Unauthorized