import styled from 'styled-components'
import { styled as muiStyled } from '@mui/system';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import HelpIcon from '@mui/icons-material/Help';

//#region styled
const Container = styled.div`
    background-color: ${props => props.theme.palette.background.default};
    border-bottom: 0.5px solid;
    border-color: lightgray;
    align-items: center;
`

const Wrapper = styled.div`
    padding: 5px 30px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Left = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width: 900px) {
        justify-content: flex-start;
    }
`
const Right = styled.div`
    flex: 1;
    display: none;
    align-items: center;

    @media (min-width: 900px) {
        justify-content: flex-end;
        display: flex;
    }
`

const Logo = styled.h2`
    position: relative;
    font-family: abel;
    font-size: 27px;
    text-transform: uppercase;
    font-weight: 500;
    color: ${props => props.theme.palette.primary.main};
    cursor: pointer;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    white-space: nowrap;
    overflow: hidden;
    margin: 15px 70px 10px 0px;
    transform: translateX(20px);

    p { width: 0; }

    @media (min-width: 768px) {
        p {width: auto;}
    }

    @media (min-width: 900px) {
        transform: none;
    }
`

const ImageLogo = styled.img`
    width: 40px;
    height: 40px;
    margin: 0 10px 0 0;
    padding: 0;
`

const StyledIconButton = muiStyled(IconButton)(({ theme }) => ({
    '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.primary.main,
    },
}));
//#endregion

const SimpleNavbar = () => {
    return (
        <Container>
            <Wrapper>
                <Left>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to={`/`}>
                            <Logo>
                                <ImageLogo src="/bell.svg" className="logo" alt="RING! logo" />RING!&nbsp; <p style={{ color: '#424242', margin: 0 }}>- BOOKSTORES</p>
                            </Logo>
                        </Link>
                    </div>
                </Left>
                <Right>
                    <StyledIconButton aria-label="help" sx={{
                        "&:focus": {
                            outline: 'none',
                        }
                    }}>
                        <HelpIcon />
                        <p style={{ fontSize: '13px', marginLeft: '5px' }}>Trợ giúp</p>
                    </StyledIconButton>
                </Right>
            </Wrapper>
        </Container>
    )
}

export default SimpleNavbar