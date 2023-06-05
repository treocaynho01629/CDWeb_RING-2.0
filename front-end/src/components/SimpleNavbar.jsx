import React from 'react'
import styled from 'styled-components'
import { styled as muiStyled } from '@mui/system';

import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

import HelpIcon from '@mui/icons-material/Help';

import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Container = styled.div`
    background-color: white;
    border-bottom: 0.5px solid;
    border-color: lightgray;
    align-items: center;
    margin-bottom: 50px;
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
    justify-content: space-between;

    @media (min-width: 900px) {
        justify-content: flex-start;
    }
`
const Right = styled.div`
    flex: 1;
    display: none;
    align-items: center;
    justify-content: space-evenly;

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
    color: #63e399;
    cursor: pointer;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    margin: 15px 70px 10px 0px;
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
        color: '#63e399',
    },
}));

const SimpleNavbar = () => { 
  return (
    <Container>
        <Wrapper>
            <Grid container>
                <Grid item xs={12} md={7}>
                    <Left>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Link to={`/`}>
                            <Logo>
                                <ImageLogo src="/bell.svg" className="logo" alt="RING! logo" />RING!&nbsp; <p style={{color: '#424242', margin: 0}}>- BOOKSTORES</p>
                            </Logo>
                            </Link>
                        </div>
                    </Left>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Right>
                        <StyledIconButton aria-label="help" sx={{
                            "&:focus": {
                                outline: 'none',
                            }}}>
                                <HelpIcon/>
                            <p style={{fontSize: '13px', marginLeft: '5px'}}>Trợ giúp</p>
                        </StyledIconButton>
                    </Right>
                </Grid>
            </Grid>
        </Wrapper>
    </Container>
  )
}

export default SimpleNavbar