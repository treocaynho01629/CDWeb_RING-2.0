import styled from 'styled-components'
import { Suspense, lazy } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft } from '@mui/icons-material';
import Button from '@mui/material/Button';
import CustomBreadcrumbs from '../components/custom/CustomBreadcrumbs';
import useCart from '../hooks/useCart';
import useTitle from '../hooks/useTitle';

const CartContent = lazy(() => import("../components/cart/CartContent"));

//#region styled
const EmptyWrapper = styled.div`
    height: 90dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const Wrapper = styled.div`
    min-height: 90dvh;
`
//#endregion

const Cart = () => {
    const { cartProducts } = useCart();
    useTitle('Giỏ hàng'); //Set title

    return (
        <Wrapper>
            <CustomBreadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
                <strong style={{ textDecoration: 'underline' }}>Giỏ hàng</strong>
            </CustomBreadcrumbs>

            {cartProducts?.length == 0 ?
                <EmptyWrapper>
                    <img src="/empty.svg" height={250} />
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
                <Suspense fallback={<></>}>
                    <CartContent />
                </Suspense>
            }
        </Wrapper >
    )
}

export default Cart