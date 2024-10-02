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
    bottom: 0;
    margin: auto;
    width: 101%;
    height: 104%;
    max-height: 30px;
    font-size: 14px;
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
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    text-transform: uppercase;
    margin: 0 0 20px;
    padding: 15px 0;
    border-bottom: .5px solid ${props => props.theme.palette.divider};

    &.primary {
        color: ${props => props.theme.palette.primary.main};
        border-color: ${props => props.theme.palette.primary.main};
    }

    ${props => props.theme.breakpoints.down("md")} {
        font-size: 16px;
        margin: 0 0 15px;
        text-transform: none;
    }
`

export const Showmore = styled.div`
    font-size: 14px;
    font-weight: 500;
    flex-grow: 1;
    padding: 15px 0;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.palette.info.main};
    cursor: pointer;

    &::after {
        content: "";
        z-index: 0;
        position: absolute;
        top: -55px;
        left: 0;
        height: 100%;
        width: 100%;
        pointer-events: none;
        border-bottom: .5px solid ${props => props.theme.palette.divider};
        background-image: linear-gradient(180deg, 
        transparent, 
        transparent 60%,
        ${props => props.theme.palette.background.default} 100%);
    }

    &.expand {
        margin-top: 10px;

        &::after {
            background-image: none;
        }
    }

    ${props => props.theme.breakpoints.down("md")} {
        margin-top: 0;
    }
`