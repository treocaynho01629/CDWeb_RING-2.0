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
    text-shadow: 1.5px 1.5px ${props => props.theme.palette.background.default};
    margin-left: 10px;
    white-space: nowrap;
    transition: width .25s ease;
`

export const LogoSubtitle = styled(LogoTitle)`
    color: ${props => props.theme.palette.text.secondary};
    margin-left: 0;
`

export const MobileExtendButton = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: auto;
    width: 100%;
    height: 100%;
    max-height: 30px;
    font-size: 14px;
    cursor: pointer;
    color: ${props => props.disabled ? props.theme.palette.text.disabled : props.theme.palette.text.secondary};
    pointer-events: ${props => props.disabled ? 'none' : 'all'};
    overflow: hidden;
    z-index: 1;

    &::before {
        content: "";
        position: absolute;
        top: -2%;
        left: 0;
        width: 101%;
        height: 104%;
        background-image: linear-gradient(
            to left, 
            ${props => props.theme.palette.background.default}, 
            ${props => props.theme.palette.background.default} 5%, 
            transparent 15%,
            transparent 100%);
        z-index: -1;
    }

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

    a {
        display: none;
        align-items: center;
        color: ${props => props.theme.palette.text.primary};
    }

    &.primary {
        color: ${props => props.theme.palette.primary.main};
        border-color: ${props => props.theme.palette.primary.main};
    }

    ${props => props.theme.breakpoints.down("md")} {
        font-size: 16px;
        margin: 0 0 15px;
        text-transform: none;

        a { display: flex; }
    }
`

export const TabContentContainer = styled.div`
    position: relative;
    padding: 0 ${props => props.theme.spacing(2)};
    border: 0.5px solid ${props => props.theme.palette.action.focus};
    min-height: 60dvh;

    ${props => props.theme.breakpoints.down("md")} {
        padding: 0 ${props => props.theme.spacing(1)};
        border: none;
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