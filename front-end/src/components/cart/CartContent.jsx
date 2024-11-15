import styled from "@emotion/styled";
import { useEffect, useMemo, useState, Suspense, lazy, useCallback } from "react";
import { Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon, Search, ChevronLeft, Sell } from '@mui/icons-material';
import { Checkbox, Button, Grid2 as Grid, Table, TableBody, TableRow, Box, MenuItem, ListItemText, ListItemIcon } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { booksApiSlice } from '../../features/books/booksApiSlice';
import { useCalculateMutation } from '../../features/orders/ordersApiSlice';
import { ActionTableCell, StyledTableCell, StyledTableHead } from '../custom/CustomTableComponents';
import { debounce, isEqual } from 'lodash-es';
import { useGetRecommendCouponsQuery } from '../../features/coupons/couponsApiSlice';
import useCart from '../../hooks/useCart';
import CheckoutDialog from './CheckoutDialog';
import PropTypes from 'prop-types';
import CartDetailRow from './CartDetailRow';
import useDeepEffect from '../../hooks/useDeepEffect';

const Menu = lazy(() => import('@mui/material/Menu'));
const CouponDialog = lazy(() => import('../coupon/CouponDialog'));

//#region styled
const StyledCheckbox = styled(Checkbox)`
    margin-left: 8px;

    ${props => props.theme.breakpoints.down("sm")} {
        margin-left: 0
    }
`

const TitleContainer = styled.div`
    position: relative;
    padding: 20px 0px;
    
    &.end {
        text-align: end;
        direction: rtl;

        ${props => props.theme.breakpoints.down("md_lg")} {
            display: none;
        }
    }

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 20px 10px;
    }
`

const Title = styled.h3`
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
`

const StyledDeleteButton = styled(Button)`
    position: absolute;
    right: 8px;
    background-color: transparent;
    z-index: 1;
    visibility: visible;
    transition: all .2s ease;

    &.hidden {
        opacity: 0;
        visibility: hidden;
    }
`
//#endregion

const tempShippingFee = 10000;

function EnhancedTableHead({ onSelectAllClick, numSelected, rowCount, handleDeleteMultiple }) {
    let isIndeterminate = numSelected > 0 && numSelected < rowCount;
    let isSelectedAll = rowCount > 0 && numSelected === rowCount;

    return (
        <StyledTableHead>
            <TableRow
                className="header"
                role="select-all-checkbox"
                aria-checked={isIndeterminate || isSelectedAll}
                selected={isIndeterminate || isSelectedAll}
                sx={{ backgroundColor: { xs: 'background.default', sm: 'action.hover' } }}
            >
                <StyledTableCell padding="checkbox" sx={{ width: '40px' }}>
                    <StyledCheckbox
                        indeterminate={isIndeterminate}
                        checked={isSelectedAll}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'Select all' }}
                    />
                </StyledTableCell>
                <StyledTableCell align="left">Chọn tất cả ({rowCount} sản phẩm)</StyledTableCell>
                <StyledTableCell align="left" className={numSelected > 0 ? 'hidden' : ''}
                    sx={{
                        width: '100px',
                        display: { xs: 'none', md: 'table-cell', md_lg: 'none', lg: 'table-cell' }
                    }}
                >
                    Đơn giá
                </StyledTableCell>
                <StyledTableCell align="center" className={numSelected > 0 ? 'hidden' : ''}
                    sx={{
                        width: '140px',
                        display: { xs: 'none', sm: 'table-cell' }
                    }}
                >
                    Số lượng
                </StyledTableCell>
                <StyledTableCell align="left" className={numSelected > 0 ? 'hidden' : ''}
                    sx={{
                        width: '100px',
                        display: { xs: 'none', md: 'table-cell' }
                    }}
                >
                    Tổng
                </StyledTableCell>
                <ActionTableCell>
                    <StyledDeleteButton
                        className={numSelected > 0 ? '' : 'hidden'}
                        color="error"
                        endIcon={<DeleteIcon />}
                        disableRipple
                        onClick={handleDeleteMultiple}
                    >
                        Xoá
                    </StyledDeleteButton>
                </ActionTableCell>
            </TableRow>
        </StyledTableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const CartContent = () => {
    const { cartProducts, replaceProduct, removeProduct, removeShopProduct, clearCart,
        decreaseAmount, increaseAmount, changeAmount } = useCart();
    const [selected, setSelected] = useState([]);
    const [shopIds, setShopIds] = useState([]);
    const [coupon, setCoupon] = useState('');
    const [shopCoupon, setShopCoupon] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [checkState, setCheckState] = useState(null);

    //Dialog/Menu
    const [contextProduct, setContextProduct] = useState(null);
    const [contextShop, setContextShop] = useState(null);
    const [contextState, setContextState] = useState(null);
    const [contextCoupon, setContextCoupon] = useState(null);
    const [openDialog, setOpenDialog] = useState(undefined);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    //Recommend coupons
    const { data: recommend, isLoading: loadRecommend, isSuccess: doneRecommend } = useGetRecommendCouponsQuery({ shopIds }, { skip: !shopIds.length });

    //For get similar
    const [getBook] = booksApiSlice.useLazyGetBookQuery();

    //Estimate/calculate price
    const [estimated, setEstimated] = useState({ deal: 0, subTotal: 0, shipping: 0, total: 0 });
    const [calculated, setCalculated] = useState(null);
    const [calculate, { isLoading }] = useCalculateMutation();

    //#region construct
    useDeepEffect(() => {
        handleCartChange();
    }, [selected, cartProducts, shopCoupon, coupon])

    //Set recommend coupons
    useEffect(() => {
        if (recommend && !loadRecommend && doneRecommend) {
            const { ids, entities } = recommend;

            ids.forEach((id) => {
                const coupon = entities[id];

                if (coupon?.shopId) {
                    setShopCoupon((prev) => ({ ...prev, [coupon?.shopId]: coupon }));
                } else {
                    setCoupon(coupon);
                }
            })
        }
    }, [recommend, loadRecommend])

    const handleCartChange = () => {
        if (selected.length > 0 && cartProducts.length > 0 && doneRecommend) {
            //Reduce cart
            const selectedCart = cartProducts.reduce((result, item) => {
                const { id, shopId } = item;

                if (selected.indexOf(id) !== -1) { //Get selected items in redux store
                    //Find or create shop
                    let detail = result.cart.find(shopItem => shopItem.shopId === shopId);

                    if (!detail) {
                        detail = { shopId, coupon: shopCoupon[shopId]?.code, items: [] };
                        result.cart.push(detail);
                    }

                    //Add items for that shop
                    detail.items.push(item);
                }

                return result;
            }, { coupon: coupon?.code, cart: [] });

            handleEstimate(selectedCart); //Estimate price
            handleCalculate(selectedCart); //Calculate price
        } else { //Reset
            handleEstimate(null);
            handleCalculate(null);
            setCalculated(null);
        }
    }

    const handleClearSelect = () => {
        setSelected([]);
        setCalculated(null);
    }

    //Estimate before receive caculated price from server
    const handleEstimate = (cart) => {
        let estimate = { deal: 0, subTotal: 0, shipping: 0, total: 0 }; //Initial value
        let cartDetails = {};

        if (cart?.cart?.length) {
            let totalDeal = 0;
            let subTotal = 0;
            let totalQuantity = 0;
            const shipping = tempShippingFee * (cart?.cart?.length || 0);

            //Loop & calculate
            cart?.cart?.forEach((detail) => {
                let deal = 0;
                let productTotal = 0;
                let quantity = 0;

                detail?.items?.forEach((item) => {
                    const discount = Math.round(item.price * item.discount);

                    //Both deal & total price
                    deal += item.quantity * discount;
                    productTotal += item.quantity * item.price;
                    quantity += item.quantity;
                })

                //Set value & cart state
                totalDeal += deal;
                subTotal += productTotal;
                totalQuantity += quantity;
                cartDetails[detail?.shopId] = { value: productTotal - deal, quantity };
            });

            //Set values
            estimate = { deal: totalDeal, subTotal, shipping, total: (subTotal + shipping - totalDeal) };

            //Set cart state
            setCheckState({ value: subTotal - totalDeal, quantity: totalQuantity, details: cartDetails });
        }

        setEstimated(estimate);
    }

    //Calculate server side
    const handleCalculate = useCallback(debounce(async (cart) => {
        if (isLoading || cart == null) return;

        calculate(cart).unwrap()
            .then((data) => {
                setCalculated(data);
                syncCart(data);
            })
            .catch((err) => {
                console.error(err);
                if (!err?.status) {
                    console.error('Server không phản hồi!');
                } else if (err?.status === 409) {
                    console.error(err?.data?.errors?.errorMessage);
                } else if (err?.status === 400) {
                    console.error('Sai định dạng giỏ hàng!');
                } else {
                    console.error('Tính trước đơn hàng thất bại!')
                }
            })
    }, 500), []);

    //Sync cart between client and server
    const syncCart = (cart) => {
        if (!cartProducts?.length) return;
        const details = cart?.details;

        details.forEach((detail, index) => {
            if (detail.shopName != null) { //Replace all items of that shop
                const items = detail?.items;

                items.forEach((item, index) => {
                    if (item.title != null) { //Replace old item in cart
                        const newItem = {
                            ...item,
                            shopId: detail.shopId,
                            shopName: detail.shopName
                        }

                        replaceProduct(newItem);
                    } else { //Remove invalid item
                        handleClearSelect();
                        removeProduct(item.id);
                    }
                })

                //Replace recommend coupon
                setCouponDiscount((prev) => ({
                    ...prev,
                    [detail?.shopId]: detail?.couponDiscount > 0 ? detail?.couponDiscount : detail?.shippingDiscount
                }));
                if (detail?.coupon != null
                    && shopCoupon[detail?.shopId] != null
                    && !isEqual(detail.coupon, shopCoupon[detail?.shopId]
                    )) {
                    setShopCoupon((prev) => ({ ...prev, [detail?.shopId]: detail.coupon }));
                }
            } else { //Remove all items of the invalid Shop
                handleClearSelect();
                removeShopProduct(detail.shopId);
            }
        })

        //Replace recommend coupon
        if (cart?.coupon != null && coupon != null && !isEqual(cart?.coupon, coupon)) setCoupon(cart.coupon);
    }

    //Separate by shop
    const reduceCart = () => {
        let shopIds = [];
        let resultCart = cartProducts.reduce((result, item) => {
            if (!result[item.shopId]) { //Check if not exists shop >> Add new one
                result[item.shopId] = { shopName: item.shopName, products: [] };
                shopIds.push(item.shopId);
            }

            //Else push
            result[item.shopId].products.push(item);
            return result;
        }, {});

        setShopIds(shopIds);
        return resultCart;
    }
    const reducedCart = useMemo(() => reduceCart(), [cartProducts]);

    //Open context menu
    const handleClick = (e, product) => {
        setAnchorEl(e.currentTarget);
        setContextProduct(product);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setContextProduct(null);
    };

    const handleOpenDialog = (shopId) => {
        setOpenDialog(true);
        setContextShop(shopId);
        setContextState(shopId ? checkState?.details[shopId] : { value: checkState?.value, quantity: checkState?.quantity });
        setContextCoupon(shopId ? shopCoupon[shopId] : coupon)
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setContextShop(null);
        setContextState(null);
        setContextCoupon(null);
    };

    //Selected?
    const isShopSelected = (shop) => shop?.products.some(product => selected.includes(product.id));
    const isSelected = (id) => selected.indexOf(id) !== -1;

    //Select all checkboxes
    const handleSelectAllClick = (e) => {
        if (e.target.checked) {
            const newSelected = cartProducts?.map((item) => {
                if (item.amount > 0) return item.id;
            });
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    //Select item
    const handleSelect = (id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleDeselect = (id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    //Select shop
    const handleSelectShop = (shop) => {
        let newSelected = [];
        let disabled = [];
        const notSelected = shop?.products
            .filter(product => !selected.includes(product.id))
            .map(product => {
                if (product.amount > 0) {
                    return product.id;
                } else {
                    disabled.push(product.id);
                }
            });

        if (notSelected.length <= disabled.length) {
            const alreadySelected = shop?.products
                .filter(product => selected.includes(product.id))
                .map(product => product.id);
            newSelected = selected.filter(id => !alreadySelected.includes(id));
        } else {
            newSelected = newSelected.concat(selected, notSelected);
        }
        setSelected(newSelected);
    };

    //Delete
    const handleDeleteContext = () => {
        handleDelete(contextProduct?.id);
        handleClose();
    };

    const handleDelete = (id) => {
        if (isSelected(id)) handleSelect(id);
        removeProduct(id);
        handleClose();
        handleCalculate.cancel();
    };

    const handleDecrease = (quantity, id) => {
        if (quantity == 1 && isSelected(id)) handleSelect(id); //Unselect if remove
        decreaseAmount(id)
    };

    const handleChangeQuantity = (quantity, id) => {
        if (quantity < 1 && isSelected(id)) handleSelect(id); //Unselect if remove
        changeAmount({ quantity, id })
    };

    const handleDeleteMultiple = () => {
        if (selected.length == cartProducts.length) {
            clearCart();
        } else {
            selected.forEach((id) => { removeProduct(id) });
        }
        handleClearSelect();
        handleCalculate.cancel();
    };

    const handleFindSimilar = async () => {
        getBook({ id: contextProduct?.id })
            .unwrap()
            .then((book) => navigate(`/store/${book?.category?.slug}?cate=${book?.category?.id}
                &pubs=${book?.publisher?.id}&types=${book?.type}`))
            .catch((rejected) => console.error(rejected));
        handleClose();
    };

    const handleChangeCoupon = (coupon, shopId) => {
        if (shopId) {
            setShopCoupon((prev) => ({ ...prev, [shopId]: coupon }));
        } else {
            setCoupon(coupon);
        }
    };
    //#endregion

    return (
        <Grid container spacing={2} sx={{ position: 'relative', mb: 10, justifyContent: 'flex-end' }}>
            <Grid size={{ xs: 12, md_lg: 8 }} position="relative">
                <TitleContainer>
                    <Title><ShoppingCartIcon />&nbsp;GIỎ HÀNG ({cartProducts?.length})</Title>
                </TitleContainer>
                <Table aria-label="cart-table">
                    <EnhancedTableHead
                        numSelected={selected.length}
                        onSelectAllClick={handleSelectAllClick}
                        handleDeleteMultiple={handleDeleteMultiple}
                        rowCount={cartProducts?.length}
                    />
                    <TableBody>
                        {Object.keys(reducedCart).map((shopId, index) => {
                            const shop = reducedCart[shopId];

                            return (<CartDetailRow key={`detail-${shopId}-${index}`}
                                {...{
                                    StyledCheckbox,
                                    id: shopId, index, shop, isSelected, isShopSelected,
                                    handleSelect, handleDeselect, handleSelectShop,
                                    coupon: shopCoupon[shopId], couponDiscount: couponDiscount[shopId],
                                    handleDecrease, increaseAmount, handleChangeQuantity,
                                    handleClick, handleOpenDialog
                                }}
                            />)
                        })}
                    </TableBody>
                </Table>
                <br />
                <Box display="flex">
                    <Link to={'/'}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<ChevronLeft />}
                        >
                            Tiếp tục mua sắm
                        </Button>
                    </Link>
                </Box>
            </Grid>
            <Grid size={{ xs: 12, md_lg: 4 }} position={{ xs: 'sticky', md_lg: 'relative' }} bottom={0}>
                <TitleContainer className="end">
                    <Title><Sell />&nbsp;ĐƠN DỰ TÍNH</Title>
                </TitleContainer>
                <CheckoutDialog {...{
                    coupon: coupon, navigate, calculating: isLoading,
                    calculated, estimated, numSelected: selected.length, handleOpenDialog
                }} />
            </Grid>
            <Suspense fallback={<></>}>
                {openDialog !== undefined
                    && <CouponDialog {...{
                        openDialog, handleCloseDialog, shopId: contextShop, checkState: contextState,
                        numSelected: selected.length, selectedCoupon: contextCoupon, selectMode: true, onClickApply: handleChangeCoupon
                    }} />}
            </Suspense>
            <Suspense fallback={<></>}>
                {open !== undefined &&
                    <Menu
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                        anchorEl={anchorEl}
                    >
                        <MenuItem onClick={handleDeleteContext}>
                            <ListItemIcon >
                                <DeleteIcon sx={{ color: 'error.main' }} fontSize="small" />
                            </ListItemIcon>
                            <ListItemText sx={{ color: 'error.main' }}>Xoá khỏi giỏ</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleFindSimilar}>
                            <ListItemIcon>
                                <Search fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Tìm sản phẩm tương tự</ListItemText>
                        </MenuItem>
                    </Menu>
                }
            </Suspense>
        </Grid>
    )
}

export default CartContent