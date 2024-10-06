import styled from 'styled-components'
import { useEffect, useMemo, useState } from "react";
import { Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon, Search, ChevronLeft } from '@mui/icons-material';
import { Checkbox, Button, Grid2 as Grid, Table, TableBody, TableHead, TableRow, Box, Menu, MenuItem, ListItemText, ListItemIcon } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { booksApiSlice } from '../../features/books/booksApiSlice';
import CheckoutDialog from './CheckoutDialog';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import PropTypes from 'prop-types';
import useCart from '../../hooks/useCart';
import CartDetailRow from './CartDetailRow';
import { useCalculateMutation } from '../../features/orders/ordersApiSlice';

//#region styled
const StyledTableCell = styled(TableCell)`
    &.${tableCellClasses.root} {
        border: none;
    }

    &.${tableCellClasses.head} {
        font-weight: bold;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        &.${tableCellClasses.body} {
            padding: 8px 8px 8px 4px;
        }

        &.${tableCellClasses.head} {
            padding: 4px;
        }

        &.${tableCellClasses.paddingCheckbox} {
            padding: 0;
        }
    }
`

const ActionTableCell = styled(TableCell)`
    &.${tableCellClasses.root} {
        border: none;
        padding: 0;
        width: 8px;
    }
`

const StyledTableHead = styled(TableHead)`
    position: sticky; 
    top: ${props => props.theme.mixins.toolbar.minHeight + 16.5}px;
    background-color: ${props => props.theme.palette.background.default};
    z-index: 2;

    ${props => props.theme.breakpoints.down("sm")} {
        top: ${props => props.theme.mixins.toolbar.minHeight + 4.5}px;

        &:before{
            display: none;            
        }
    }

    &:before{
        content: "";
        position: absolute;
        left: -10px;
        top: -16px;
        width: calc(100% + 20px);
        height: calc(100% + 16px);
        background-color: ${props => props.theme.palette.background.default};
        z-index: -1;
    }

    &:after{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border: .5px solid ${props => props.theme.palette.action.focus};

        ${props => props.theme.breakpoints.down("sm")} {
            border-left: none;
            border-right: none;
        }
    }
`

const StyledCheckbox = styled(Checkbox)`
    margin-left: 8px;

    ${props => props.theme.breakpoints.down("sm")} {
        margin-left: 0
    }
`

const MainTitleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    justify-content: center;
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
                <StyledTableCell align="left">Sản phẩm ({rowCount})</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: '100px', display: { xs: 'none', md: 'table-cell' } }}>Đơn giá</StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '140px', display: { xs: 'none', sm: 'table-cell' } }}>Số lượng</StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '130px', display: { xs: 'none', md: 'table-cell' } }}>Tổng</StyledTableCell>
                <ActionTableCell></ActionTableCell>
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
    const { cartProducts, removeProduct, decreaseAmount, increaseAmount, changeAmount } = useCart();
    const [selected, setSelected] = useState([]);
    const [coupon, setCoupon] = useState('');
    const [contextProduct, setContextProduct] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    //TEST
    const [testCart, setTestCart] = useState([]);
    const [calculate, { isLoading }] = useCalculateMutation();

    //Test calculate
    const handleCalculate = async () => {
        if (isLoading) return;

        //Create cart
        let newProducts = cartProducts.filter(product => selected.includes(product?.id));
        let test = newProducts.reduce((result, item) => {
            if (!result[item.shopId]) { //Check if not exists shop >> Add new one
                result[item.shopId] = { coupon: coupon[item.shopId], items: [] };
            }

            //Else push
            result[item.shopId].items.push(item);
            return result;
        }, {});
        let finalCart = { coupon: 'GIAMTOANBO', cart: Object.entries(test).map(([id, value]) => ({
            shopId: id,
            coupon: value.coupon,
            items: value.items
        }))};
        setTestCart(finalCart);

        calculate(finalCart).unwrap()
            .then((data) => {
                console.log(data);
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

    //#region construct
    useEffect(() => {
        if (selected.length) handleCalculate();
    }, [selected, coupon])

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

    const reducedCart = useMemo(() => reduceCart(), cartProducts);

    //Get similar
    const [getBook] = booksApiSlice.useLazyGetBookQuery();

    //Open context menu
    const handleClick = (e, product) => {
        setAnchorEl(e.currentTarget);
        setContextProduct(product);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setContextProduct(null);
    };

    //Selected?
    const isShopSelected = (shop) => shop?.products.some(product => selected.includes(product.id));
    const isSelected = (id) => selected.indexOf(id) !== -1;

    //Select all checkboxes
    const handleSelectAllClick = (e) => {
        if (e.target.checked) {
            const newSelected = cartProducts?.map((n) => n.id);
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

    //Select shop
    const handleSelectShop = (shop) => {
        let newSelected = [];
        const notSelected = shop?.products
            .filter(product => !selected.includes(product.id))
            .map(product => product.id);

        if (!notSelected.length) {
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
            .then((book) => navigate(`/filters?cateId=${book?.cateId}&pubId=${book?.publisher?.id}&type=${book?.type}`))
            .catch((rejected) => console.error(rejected));
        handleClose();
    }

    const handleChangeCoupon = (e, id) => {
        setCoupon((prev) => ({ ...prev, [id]: 'GIAMGIAbfd538' }));
    };
    //#endregion

    return (
        <Grid container spacing={3} sx={{ position: 'relative', mb: 10, justifyContent: 'flex-end' }}>
            <Grid size={{ xs: 12, lg: 8 }} position="relative">
                <MainTitleContainer>
                    <Title><ShoppingCartIcon />&nbsp;GIỎ HÀNG ({cartProducts?.length})</Title>
                    <Button
                        variant="outlined"
                        color="error"
                        sx={{
                            position: 'absolute',
                            right: 0,
                            opacity: selected.length > 0 ? 1 : 0,
                            visibility: selected.length > 0 ? 'visible' : 'hidden',
                            transition: 'all .25s ease',
                        }}
                        onClick={handleDeleteMultiple}
                        endIcon={<DeleteIcon />}
                    >
                        Xoá
                    </Button>
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
                                id: shopId, index, shop, coupon, isSelected, isShopSelected, handleSelect, handleSelectShop,
                                handleDecrease, handleChangeQuantity, handleChangeCoupon, handleClick,
                                StyledCheckbox, StyledTableCell, ActionTableCell
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
            <Grid size={{ xs: 12, md: 8, lg: 4 }} position="relative">
                <CheckoutDialog {...{
                    testCart, selected, navigate, handleSelectAllClick,
                    numSelected: selected.length, rowCount: cartProducts?.length
                }} />
            </Grid>
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
        </Grid>
    )
}

export default CartContent