import styled from '@emotion/styled'
import { getCouponSummary } from '../../ultils/coupon'

//#region styled
const CouponContainer = styled.div`
    position: relative;
    border-radius: 5px;
    height: 100%;
    width: 100%;
    background-color: ${props => props.theme.palette.background.paper};
    border: .5px solid ${props => props.theme.palette.divider};
    box-shadow: ${props => props.theme.shadows[1]};
    display: flex;
    align-items: center;
    margin: 10px 0;

    &::before, &::after {
        content: "";
        position: absolute;
        background-color: ${props => props.theme.palette.background.paper};
        border: .5px solid ${props => props.theme.palette.divider};
        background-image: ${props => props.theme.shadows[3]};
        border-left: none;
        border-bottom: none;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        left: 60px;
        z-index: 1;
    }

    &:after {
        top: -5px;
        transform: rotate(135deg);
    }

    &:before {
        bottom: -5px;
        transform: rotate(-45deg);
    }

    ${props => props.theme.breakpoints.down("md_lg")} {
        margin: 0;

        &::before, &::after {
            left: 35px;
        }
    }

    ${props => props.theme.breakpoints.down("sm")} {
        background-color: transparent;
        box-shadow: none;
        border: none;

        &::before, &::after {
            display: none;
        }
    }
`

const CouponIcon = styled.div`
    height: 50px;
    aspect-ratio: 1/1;
    background-color: ${props => props.theme.palette[props.color]?.light || props.theme.palette.primary.light};
    color: ${props => props.theme.palette[props.color]?.contrastText || props.theme.palette.primary.contrastText};
    border-right: 5px dotted ${props => props.theme.palette.background.paper};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px;
    border-radius: 5px;

    svg { font-size: 30px;}

    ${props => props.theme.breakpoints.down("md_lg")} {
        width: 30px;
        height: 30px;
        margin: 5px;
        border-right-width: 3px;

        svg { font-size: 17px;}
    }

    ${props => props.theme.breakpoints.down("sm")} {
        width: 22px;
        height: 22px;
        margin: 0;
        border-right: none;
        border-radius: 6px;
        border: .5px solid ${props => props.theme.palette.divider};
        color: ${props => props.theme.palette[props.color]?.dark || props.theme.palette.primary.dark};

        svg { font-size: 15px; }
    }
`

const CouponDesc = styled.b`
    position: relative;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
    font-size: 14px;
    font-weight: 450;
    margin-right: 5px;
	
	@supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    ${props => props.theme.breakpoints.down("md_lg")} {
        font-size: 13px;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 12px;
        max-width: 120px;
        border-radius: 6px;
        padding: 0 10px;
        height: 22px;
        border: .5px solid ${props => props.theme.palette.divider};
        border-left: none;
    }
`
//#endregion

const CouponDisplay = ({ coupon }) => {
    const summary = getCouponSummary(coupon?.type);

    return (
        <CouponContainer>
            <CouponIcon color={summary?.color}>
                {summary?.icon}
            </CouponIcon>
            <CouponDesc>
                {coupon?.summary}
            </CouponDesc>
        </CouponContainer>
    )
}

export default CouponDisplay