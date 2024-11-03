import styled from 'styled-components'
import { Suspense, lazy } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft } from '@mui/icons-material';
import { ReactComponent as EmptyIcon } from '../assets/empty.svg';
import Button from '@mui/material/Button';
import CustomBreadcrumbs from '../components/custom/CustomBreadcrumbs';
import useCart from '../hooks/useCart';
import useTitle from '../hooks/useTitle';
import CustomPlaceholder from '../components/custom/CustomPlaceholder';

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
`
//#endregion

const Cart = () => {
    const { cartProducts } = useCart();
    useTitle('Giỏ hàng'); //Set title

    return (
        <Wrapper>
            <CustomBreadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
                <NavLink to={'/cart'}>Giỏ hàng</NavLink>
            </CustomBreadcrumbs>
            {cartProducts?.length == 0 ? <EmptyWrapper>
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
                : <Suspense fallback={<EmptyWrapper><CustomPlaceholder /></EmptyWrapper>}>
                    <CartContent />
                </Suspense>
            }
        </Wrapper >
    )
}

export default Cart