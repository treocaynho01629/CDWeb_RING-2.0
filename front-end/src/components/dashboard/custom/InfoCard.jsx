import styled from '@emotion/styled';
import { Paper } from '@mui/material';

//#region preStyled
const InfoWrapper = styled(Paper)`
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    padding: ${props => props.theme.spacing(2.5)};
    overflow: hidden;
    z-index: 1;

    &:before {
        content: "";
        position: absolute;
        top: -25%;
        left: -5%;
        height: 110%;
        aspect-ratio: 1/1;
        background-color: ${props => props.theme.palette[props.color]?.light || props.theme.palette.primary.light};
        opacity: .3;
        transform: rotate(30deg);
        z-index: -1;
    }
`

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    span { font-weight: 450; }

    h2 {
        font-weight: 600;
        margin: 4px 0;
    }

    svg {
        font-size: 2.75em;
        margin-bottom: ${props => props.theme.spacing(1)};
    }
`

const ChartContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: right;
`
//#endregion

const InfoCard = ({ count, icon, title, color }) => {

    return (
        <InfoWrapper elevation={3} color={color}>
            <InfoContainer>
                {icon}
                <div>
                    <span>{title}</span>
                    <h2>{count}</h2>
                </div>
            </InfoContainer>
            <ChartContainer>
                <span>123</span>
                <div>CHART</div>
            </ChartContainer>
        </InfoWrapper>
    )
}

export default InfoCard