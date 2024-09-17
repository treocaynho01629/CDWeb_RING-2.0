import { KeyboardArrowRight, Sell } from '@mui/icons-material'
import { MobileExtendButton } from '../../custom/GlobalComponents'
import styled from 'styled-components'

//#region styled
const DetailTitle = styled.h4`
    margin: 10px 0;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;

    ${props => props.theme.breakpoints.down("md")} {
        display: none;
    }
`

const CouponWrapper = styled.div`
    position: relative;
`

const CouponContainer = styled.div`
    position: relative;
    display: flex;
    height: 100%;
`

const Wrapper = styled.div`
    display: flex;
    padding: 5px 0;
    overflow-x: scroll;
    scroll-behavior: smooth;

    -ms-overflow-style: none;
    scrollbar-width: none; 

    &::-webkit-scrollbar {display: none;}

    ${props => props.theme.breakpoints.down("md")} {
        padding: 2px 0;
    }
`

const ItemsContainer = styled.div`
    display: flex;
    align-items: center;
`

const CouponItem = styled.div`
    width: 100%;    
    position: relative;
    display: flex;
    overflow: hidden;
    white-space: nowrap;
    margin-right: 8px;
    cursor: pointer;
`

const CouponIcon = styled.div`
    float: left;
    width: 40px;
    height: 40px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: .5px solid ${props => props.theme.palette.divider};
    border-right: none;
    background-color: ${props => props.theme.palette.primary.light};
    color: ${props => props.theme.palette.primary.contrastText};

    ${props => props.theme.breakpoints.down("md")} {
        width: 22px;
        height: 22px;
        background-color: ${props => props.theme.palette.primary.light};
        color: ${props => props.theme.palette.primary.dark};

        svg { font-size: 15px; }
    }
`

const CouponContent = styled.div`
    float: left;
    height: 40px;
    max-width: 130px;
    position: relative;
    display: flex;
    align-items: center;
    border-radius: 6px;
    padding: 0 10px;
    border: .5px solid ${props => props.theme.palette.divider};
    border-left: none;

    &::before, &::after {
        content: "";
        position: absolute;
        background-color: ${props => props.theme.palette.background.default};
        border: .5px solid ${props => props.theme.palette.divider};
        height: 10px;
        width: 10px;
        border-radius: 100%;
    }

    &::before{
        top: -5px;
        left: -5px;
    }

    &::after{
        bottom: -5px;
        left: -5px;
    }

    
    ${props => props.theme.breakpoints.down("md")} {
        height: 22px;
        max-width: 120px;

        &::before, &::after {
            height: 6px;
            width: 6px;

            &::before{
                top: -3px;
                left: -3px;
            }

            &::after{
                bottom: -3px;
                left: -3px;
            }
        }
    }
`

const CouponTitle = styled.div`
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
    font-weight: 450;
    font-size: 14px;

    ${props => props.theme.breakpoints.down("md")} {
        font-size: 12px;
        font-weight: 350;
        text-transform: uppercase;
    }
`

const MoreButton = styled.span`
    font-size: 15px;
    font-weight: 500;
    display: flex;
    align-items: end;
    color: ${props => props.disabled ? props.theme.palette.text.disabled : props.theme.palette.info.main};
    pointer-events: ${props => props.disabled ? 'none' : 'all'};
    cursor: pointer;
`
//#endregion

const ProductCoupon = () => {
    return (
        <CouponWrapper>
            <DetailTitle>
                Ưu đãi: &nbsp;
                <MoreButton>Xem thêm<KeyboardArrowRight /></MoreButton>
            </DetailTitle>
            <CouponContainer>
                <Wrapper draggable={true}>
                    <ItemsContainer>
                        <CouponItem>
                            <CouponIcon><Sell /></CouponIcon>
                            <CouponContent>
                                <CouponTitle>Mã giảm giá 10k - Đơn hàng từ 130k</CouponTitle>
                            </CouponContent>
                        </CouponItem>
                        <CouponItem>
                            <CouponIcon><Sell /></CouponIcon>
                            <CouponContent>
                                <CouponTitle>Mã giảm giá 10k - Đơn hàng từ 130k</CouponTitle>
                            </CouponContent>
                        </CouponItem>
                        <CouponItem>
                            <CouponIcon><Sell /></CouponIcon>
                            <CouponContent>
                                <CouponTitle>Mã giảm giá 10k - Đơn hàng từ 130k</CouponTitle>
                            </CouponContent>
                        </CouponItem>
                        <CouponItem>
                            <CouponIcon><Sell /></CouponIcon>
                            <CouponContent>
                                <CouponTitle>Mã giảm giá 10k - Đơn hàng từ 130k</CouponTitle>
                            </CouponContent>
                        </CouponItem>
                    </ItemsContainer>
                </Wrapper>
                <MobileExtendButton>
                    <KeyboardArrowRight fontSize="small" />
                </MobileExtendButton>
            </CouponContainer>
        </CouponWrapper>
    )
}

export default ProductCoupon