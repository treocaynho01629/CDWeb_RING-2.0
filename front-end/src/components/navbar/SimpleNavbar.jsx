import styled from 'styled-components'
import { Link } from 'react-router-dom';
import { LogoImage, LogoSubtitle, LogoTitle } from '../custom/GlobalComponents';
import { ContactSupportOutlined } from '@mui/icons-material';

//#region styled
const Container = styled.div`
    /* border-bottom: 0.5px solid ${props => props.theme.palette.action.hover}; */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 10px 25px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${props => props.theme.breakpoints.down("md")} {
        justify-content: center;
    }
`

const SupportButton = styled.div`
    display: flex;
    align-items: center;
    color: ${props => props.theme.palette.text.secondary};
    cursor: pointer;

    &:hover {
        color: ${props => props.theme.palette.primary.light};
    }

    ${props => props.theme.breakpoints.down("md")} {
       display: none;
    }
`

const Logo = styled.div`
    display: flex;
    align-items: center;
`
//#endregion

const SimpleNavbar = () => {
    return (
        <Container>
            <Link to={`/`}>
                <Logo>
                    <LogoImage src="/bell.svg" className="logo" alt="RING! logo" />
                    <LogoTitle>RING!&nbsp;</LogoTitle>
                    <LogoSubtitle>- BOOKSTORES</LogoSubtitle>
                </Logo>
            </Link>
            <Link>
                <SupportButton>
                    <ContactSupportOutlined />
                    <p style={{ fontSize: '13px', marginLeft: '5px' }}>Trợ giúp</p>
                </SupportButton>
            </Link>
        </Container>
    )
}

export default SimpleNavbar