import { Button, Skeleton, Paper } from '@mui/material'
import styled from 'styled-components'

//#region styledc
const Wrapper = styled.div`
    padding: 5px;
    overflow: hidden;
    position: relative;
    width: 100%;
`

const CouponContainer = styled.div`
    position: relative;
    border-radius: 5px;
    padding: 5px;
    height: 100%;
    background-color: ${props => props.theme.palette.background.default};
    border: .5px solid ${props => props.theme.palette.divider};
    box-shadow: ${props => props.theme.shadows[1]};

    &.disabled {
        filter: grayscale(1);
        pointer-events: none;
    }

    &:after {
        right: -12px;
        transform: rotate(-135deg);
    }

    &:before {
        left: -12px;
        transform: rotate(45deg);
    }

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 5px 2px;
    }
`

const CouponEdge = styled(Paper)`
    position: absolute;
    border: .5px solid ${props => props.theme.palette.divider};
    border-left: none;
    border-bottom: none;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    box-shadow: none;
    top: calc(50% - 15px);
    z-index: 1;

    ${props => props.theme.breakpoints.down("sm")} {
        width: 20px;
        height: 20px;
        top: calc(50% - 10px);
    }

    &.left {
        left: -12px;
        transform: rotate(45deg);
    }

    &.right {
        right: -12px;
        transform: rotate(-135deg);
    }
`

const CouponContent = styled.div`
    display: flex;
    position: relative;
    height: 100%;
    padding: 0 10px;
    align-items: center;
`

const CouponAction = styled.div`
    display: flex;
    position: relative;
    height: 100%;
    border: .5px dashed ${props => props.theme.palette.primary.main};
    justify-content: space-around;
    align-items: center;
    margin: 0 10px 5px;

    ${props => props.theme.breakpoints.down("sm")} {
        position: absolute;
        padding: 0;
        right: 2%;
        bottom: 3%;
        height: 30%;
    }
`

const CouponMain = styled.div`
    position: relative;
    height: 100%;
    padding-left: 10px;
    max-width: 80%;
    
    h2 {
        font-size: 15px;
        margin: 0;
        text-transform: uppercase;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        
        @supports (-webkit-line-clamp: 1) {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: initial;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
    }

    p {
        font-size: 14px;
        margin: 5px 0;
        color: ${props => props.theme.palette.text.secondary};
    }

    span {
        font-size: 14px;
        color: ${props => props.theme.palette.info.light};
    }

    ${props => props.theme.breakpoints.down("sm")} {
        h2 {
            font-size: 14px;
            text-transform: none;
        }

        p { 
            margin: 0;
            font-size: 13px;
        }
        
        span { font-size: 12px; }
    }
`

const CouponIcon = styled.div`
    width: 80px;
    height: 80px;
    background-color: ${props => props.theme.palette.primary.light};
    color: ${props => props.theme.palette.primary.contrastText};
    border-right: 5px dotted ${props => props.theme.palette.background.default};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px;
    border-radius: 5px;

    svg { font-size: 40px;}

    &.error {
        background-color: ${props => props.theme.palette.error.light};
        color: ${props => props.theme.palette.error.contrastText};
    }

    &.warning {
        background-color: ${props => props.theme.palette.warning.light};
        color: ${props => props.theme.palette.warning.contrastText};
    }

    ${props => props.theme.breakpoints.down("sm")} {
        width: 50px;
        height: 50px;
        margin: 5px;

        svg { font-size: 20px;}
    }
`

const CouponCode = styled.span`
    position: relative;
    height: 100%;
    flex-grow: 1;
    margin-left: 10px;

    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
    }
`
//#endregion

const CouponItem = ({ coupon, sumary, isSelect }) => {
    const date = new Date(coupon?.detail.expDate);

    return (
        <Wrapper>
            {coupon ?
                <CouponContainer className={coupon?.isUsable ? '' : 'disabled'}>
                    <CouponEdge elevation={24} className="left"/>
                    <CouponEdge elevation={24} className="right"/>
                    <CouponContent>
                        <CouponIcon className={sumary?.color}>
                            {sumary?.icon}
                        </CouponIcon>
                        <CouponMain>
                            <h2>{`${sumary?.name} ${coupon?.detail.discount * 100}% - giảm tối đa ${coupon?.detail.maxDiscount.toLocaleString()}đ`}</h2>
                            <p>{`${sumary?.sumary} ${coupon?.detail.attribute.toLocaleString()} ${sumary?.unit}`}</p>
                            <span>HSD:&nbsp;
                                {date.toLocaleDateString("en-GB", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                })}
                            </span>
                        </CouponMain>
                    </CouponContent>
                    <CouponAction>
                        <CouponCode>{coupon?.code}</CouponCode>
                        {isSelect
                            ?
                            <Button disableRipple>Áp dụng</Button>
                            :
                            <Button disableRipple>Lưu</Button>
                        }
                    </CouponAction>
                </CouponContainer>
                : <Skeleton
                    variant="rectangular"
                    width="100%"
                    sx={{ margin: '5px 0', borderRadius: '5px', height: { xs: 85, sm: 155 } }}
                />
            }
        </Wrapper>
    )
}

export default CouponItem