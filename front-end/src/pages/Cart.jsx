import { Suspense, lazy, useLayoutEffect } from 'react';
import { NavLink } from 'react-router';
import { ChevronLeft } from '@mui/icons-material';
import { ReactComponent as EmptyIcon } from '../assets/empty.svg';
import { Button } from '@mui/material';
import CustomPlaceholder from '../components/custom/CustomPlaceholder';
import CustomBreadcrumbs from '../components/custom/CustomBreadcrumbs';
import styled from '@emotion/styled';
import useCart from '../hooks/useCart';
import useTitle from '../hooks/useTitle';

const CartContent = lazy(() => import("../components/cart/CartContent"));

//#region styled
const EmptyWrapper = styled.div`
    height: 80dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const Wrapper = styled.div`
    position: relative;
    min-height: 90dvh;
`

const StyledEmptyIcon = styled(EmptyIcon)`
    height: 250px;
    width: 250px;
    fill: ${props => props.theme.palette.text.icon};

    ${props => props.theme.breakpoints.down("sm")} {
        width: 200px;
        height: 200px;
    }
`
//#endregion

const Cart = () => {
    const { cartProducts } = useCart();
    useTitle('Giỏ hàng'); //Set title

    useLayoutEffect(() => {
        if (cartProducts.length == 0) window.scrollTo({ top: 0, behavior: "smooth" });
    }, [cartProducts])

    return (
        <Wrapper>
            <CustomBreadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
                <NavLink to={'/cart'}>Giỏ hàng</NavLink>
            </CustomBreadcrumbs>
            {!cartProducts.length ?
                <EmptyWrapper>
                    <StyledEmptyIcon />
                    <h2>Giỏ hàng của bạn đang trống</h2>
                    <NavLink to={'/'}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<ChevronLeft />}
                        >
                            Tiếp tục mua sắm
                        </Button>
                    </NavLink>
                </EmptyWrapper>
                :
                <Suspense fallback={<EmptyWrapper><CustomPlaceholder /></EmptyWrapper>}>
                    <CartContent />
                </Suspense>
            }
        </Wrapper >
    )
}

export default Cart