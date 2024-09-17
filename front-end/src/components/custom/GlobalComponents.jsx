import styled from 'styled-components'

export const Instruction = styled.p`
    font-size: 14px;
    font-style: italic;
    color: ${props => props.theme.palette.error.main};
    display: ${props => props.display};
`

export const LogoImage = styled.img`
    width: 40px;
    height: 40px;
    padding: 0;
`

export const LogoTitle = styled.span`
    font-family: abel;
    font-size: 27px;
    text-transform: uppercase;
    font-weight: 500;
    color: ${props => props.theme.palette.primary.main};
    margin-left: 10px;
    white-space: nowrap;
    transition: width .25s ease;
`

export const LogoSubtitle = styled(LogoTitle)`
    color: ${props => props.theme.palette.text.secondary};
    margin-left: 0;
`

export const MobileExtendButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-left: 5px;
    position: absolute;
    left: 0;
    top: -2%;
    width: 101%;
    height: 104%;
    background-image: linear-gradient(
        to left, 
        ${props => props.theme.palette.background.default}, 
        ${props => props.theme.palette.background.default} 5%, 
        transparent 15%,
        transparent 100%);
    cursor: pointer;
    color: ${props => props.disabled ? props.theme.palette.text.disabled : props.theme.palette.text.secondary};
    pointer-events: ${props => props.disabled ? 'none' : 'all'};

    ${props => props.theme.breakpoints.up("md")} {
        display: none;
    }
`

export const Title = styled.h3`
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    border-bottom: .5px solid ${props => props.theme.palette.divider};
    padding-bottom: 15px;

    &.primary {
        color: ${props => props.theme.palette.primary.main};
        border-color: ${props => props.theme.palette.primary.main};
    }

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 15px;
        margin: 15px 0;
    }
`