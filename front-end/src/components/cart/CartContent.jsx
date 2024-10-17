import styled from 'styled-components'
import { useEffect, useMemo, useState, Suspense, lazy } from "react";
import { Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon, Search, ChevronLeft } from '@mui/icons-material';
import { Checkbox, Button, Grid2 as Grid, Table, TableBody, TableRow, Box, MenuItem, ListItemText, ListItemIcon } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { booksApiSlice } from '../../features/books/booksApiSlice';
import { useCalculateMutation } from '../../features/orders/ordersApiSlice';
import { ActionTableCell, StyledTableCell, StyledTableHead } from '../custom/CustomTableComponents';
import useCart from '../../hooks/useCart';
import CheckoutDialog from './CheckoutDialog';
import PropTypes from 'prop-types';
import CartDetailRow from './CartDetailRow';

const Menu = lazy(() => import('@mui/material/Menu'));
const CouponDialog = lazy(() => import('../coupon/CouponDialog'));

//#region styled
const StyledCheckbox = styled(Checkbox)`
    margin-left: 8px;

    ${props => props.theme.breakpoints.down("sm")} {
        margin-left: 0
    }
`

const MainTitleContainer = styled.div`
    position: relative;
    padding: 20px 0px;

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

function EnhancedTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount } = props;
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
    const { cartProducts, replaceProduct, removeProduct, removeShopProduct, decreaseAmount, increaseAmount, changeAmount } = useCart();
    const [selected, setSelected] = useState([]);
    const [coupon, setCoupon] = useState('GIAMTOANBO');
    const [shopCoupon, setShopCoupon] = useState('');
    const [calculated, setCaculated] = useState(null);

    //Dialog/Menu
    const [contextProduct, setContextProduct] = useState(null);
    const [contextShop, setContextShop] = useState(null);
    const [openDialog, setOpenDialog] = useState(undefined);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    //For get similar
    const [getBook] = booksApiSlice.useLazyGetBookQuery();

    //Estimate/calculate price
    const [checkoutCart, setCheckoutCart] = useState([]);
    const [calculate, { isLoading }] = useCalculateMutation();

    //#region construct
    useEffect(() => {
        if (selected.length) {
            handleCalculate();
        } else { //Reset cart
            setCheckoutCart([]);
            setCaculated(null);
        }
    }, [selected, shopCoupon, coupon, cartProducts])

    const handleCalculate = async () => {
        if (isLoading) return;

        //Reduce cart
        const estimateCart = cartProducts.reduce((result, item) => {
            const { id, shopId } = item;

            if (selected.indexOf(id) !== -1) { //Get selected items in redux store
                //Find or create shop
                let detail = result.cart.find(shopItem => shopItem.shopId === shopId);

                if (!detail) {
                    detail = { shopId, coupon: shopCoupon[item.shopId], items: [] };
                    result.cart.push(detail);
                }

                //Add items for that shop
                detail.items.push(item);
            }

            return result;
        }, { coupon: coupon, cart: [] });

        setCheckoutCart(estimateCart); //Set cart for estimate
        calculate(estimateCart).unwrap()
            .then((data) => {
                setCaculated(data);
                syncCart(data);
            })
            .catch((err) => {
                console.error(err);
                if (!err?.status) {
                    console.error('Server không phản hồi!');
                } else if (err?.status === 409) {
                    console.error(err?.data?.errors?.errorMessage);
                } else if (err?.status === 400) {
                    console.error('Sai định dạng thông tin!');
                } else {
                    console.error('Đặt hàng thất bại!')
                }
            })
    }

    //Sync cart between client and server
    const syncCart = (cart) => {
        const details = cart?.details;

        details.map((detail, index) => {
            if (detail.shopName != null) { //Replace all items of that shop
                const items = detail?.items;

                items.map((item, index) => {
                    if (item.title != null) { //Replace old item in cart
                        const newItem = {
                            ...item,
                            shopId: detail.shopId,
                            shopName: detail.shopName
                        }

                        replaceProduct(newItem);
                    } else { //Remove invalid item
                        removeProduct(item.id);
                    }
                })
            } else { //Remove all items of the invalid Shop
                removeShopProduct(detail.shopId);
            }
        })
    }

    //Separate by shop
    const reduceCart = () => {
        return cartProducts.reduce((result, item) => {
            if (!result[item.shopId]) { //Check if not exists shop >> Add new one
                result[item.shopId] = { shopName: item.shopName, products: [] };
            }

            //Else push
            result[item.shopId].products.push(item);
            return result;
        }, {});
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
    }
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setContextShop(null);
    }

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
    }

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
    }

    const handleDelete = (id) => {
        if (isSelected(id)) handleSelect(id);
        removeProduct(id);
        handleClose();
    }

    const handleDecrease = (quantity, id) => {
        if (quantity == 1 && isSelected(id)) handleSelect(id); //Unselect if remove
        decreaseAmount(id)
    }

    const handleChangeQuantity = (quantity, id) => {
        if (quantity < 1 && isSelected(id)) handleSelect(id); //Unselect if remove
        changeAmount({ quantity, id })
    }

    const handleDeleteMultiple = () => {
        selected.map((id) => { removeProduct(id) });
        setSelected([]);
    }

    const handleFindSimilar = async () => {
        getBook({ id: contextProduct?.id })
            .unwrap()
            .then((book) => navigate(`/filters/${book?.category?.slug}?cateId=${book?.category?.id}
                &pubId=${book?.publisher?.id}&type=${book?.type}`))
            .catch((rejected) => console.error(rejected));
        handleClose();
    }

    const handleChangeCoupon = (e, id) => {
        setShopCoupon((prev) => ({ ...prev, [id]: 'GIAMGIAbfd538' }));
    };
    //#endregion

    return (
        <Grid container spacing={2} sx={{ position: 'relative', mb: 10, justifyContent: 'flex-end' }}>
            <Grid size={{ xs: 12, md_lg: 8 }} position="relative">
                <MainTitleContainer>
                    <Title><ShoppingCartIcon />&nbsp;GIỎ HÀNG ({cartProducts?.length})</Title>
                </MainTitleContainer>
                <Table aria-label="cart-table">
                    <EnhancedTableHead
                        numSelected={selected.length}
                        onSelectAllClick={handleSelectAllClick}
                        rowCount={cartProducts?.length}
                    />
                    <TableBody>
                        {Object.keys(reducedCart).map((shopId, index) => {
                            const shop = reducedCart[shopId];

                            return (<CartDetailRow {...{
                                id: shopId, index, shop, coupon: shopCoupon, isSelected, isShopSelected, handleSelect,
                                handleDeselect, handleSelectShop, handleDecrease, increaseAmount, handleChangeQuantity,
                                handleClick, handleOpenDialog, StyledCheckbox
                            }} />)
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
                <CheckoutDialog {...{ checkoutCart, navigate, pending: isLoading, calculated, numSelected: selected.length }} />
            </Grid>
            <Suspense fallback={<></>}>
                {openDialog !== undefined && <CouponDialog {...{ openDialog, handleCloseDialog, shopId: contextShop }} />}
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