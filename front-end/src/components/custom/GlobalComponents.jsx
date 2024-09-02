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