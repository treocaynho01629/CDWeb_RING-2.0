import styled from 'styled-components'

export const Instruction = styled.p`
    font-size: 14px;
    font-style: italic;
    color: ${props => props.theme.palette.error.main};
    display: ${props => props.display};
`