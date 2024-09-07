import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';
import { useState } from "react";
import { Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon, MoreHoriz, Search, ChevronLeft } from '@mui/icons-material';
import { Checkbox, Button, Grid2 as Grid, IconButton, Table, TableBody, TableContainer, TableHead, TableRow, Box, Menu, MenuItem, ListItemText, ListItemIcon, Skeleton } from '@mui/material';
import { NavLink, useNavigate } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { booksApiSlice } from '../../features/books/booksApiSlice';
import CheckoutDialog from './CheckoutDialog';
import CustomAmountInput from '../custom/CustomAmountInput';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import PropTypes from 'prop-types';
import useCart from '../../hooks/useCart';

//#region styled
const StyledTableCell = muiStyled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        fontSize: 14,
        fontWeight: 'bold',
        paddingTop: 5,
        paddingBottom: 5
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = muiStyled(TableRow)(({ theme }) => ({
    border: '.5px solid',
    borderColor: theme.palette.action.focus,
    position: 'relative',

    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
}));

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

const ItemContainer = styled.div`
    display: flex;
    width: 100%;
`

const ItemSummary = styled.div`
    margin-left: 10px;
    width: 100%;
`

const ItemTitle = styled.p`
    font-size: 14px;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
    margin: 5px 0px;
	
	@supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
`

const ItemAction = styled.div`
    justify-content: space-between;
    align-items: flex-end;
    display: flex;
`

const Price = styled.p`
    font-size: 16px;
    font-weight: bold;
    text-align: left;
    color: ${props => props.theme.palette.primary.main};
    margin: 0;

    &.total {
        color: ${props => props.theme.palette.warning.light};
    }
`

const Discount = styled.p`
    font-size: 12px;
    color: gray;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    text-decoration: line-through;
`

const StyledLazyImage = styled(LazyLoadImage)`
    display: inline-block;
    height: 90px;
    width: 90px;
    border: .5px solid ${props => props.theme.palette.action.focus};

    ${props => props.theme.breakpoints.down("sm")} {
        height: 80px;
        width: 80px;
    }
`

const StyledSkeleton = styled(Skeleton)`
    display: inline-block;
    height: 90px;
    width: 90px;

    ${props => props.theme.breakpoints.down("sm")} {
        height: 80px;
        width: 80px;
    }
`

const hoverIcon = {
    position: 'absolute',
    right: 1,
    top: 2,
};
//#endregion

function EnhancedTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount } = props;

    return (
        <TableHead sx={{ display: { xs: 'none', sm: 'table-header-group' } }}>
            <TableRow sx={{ padding: 0, border: '.5px solid', borderColor: 'action.focus', backgroundColor: 'primary.main' }}>
                <StyledTableCell>
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all' }}
                        sx={{
                            marginRight: 1,
                            color: 'white',
                            '&.Mui-checked': {
                                color: 'white',
                            },
                            '&.MuiCheckbox-indeterminate': {
                                color: 'white',
                            }
                        }}
                    />
                    Sản phẩm ({numSelected})
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ width: '100px', display: { xs: 'none', md: 'table-cell' } }}>Đơn giá</StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '140px', display: { xs: 'none', sm: 'table-cell' } }}>Số lượng</StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '130px', display: { xs: 'none', md: 'table-cell' } }}>Tổng</StyledTableCell>
                <StyledTableCell sx={{ width: 0, padding: 0 }}></StyledTableCell>
            </TableRow>
        </TableHead>
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
    const [contextProduct, setContextProduct] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    //Get similar
    const [getBook] = booksApiSlice.useLazyGetBookQuery();

    //Open context menu
    const handleClick = (event, product) => {
        setAnchorEl(event.currentTarget);
        setContextProduct(product);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setContextProduct(null);
    };

    //Select all checkboxes
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = cartProducts?.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

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

    const handleDeleteContext = () => {
        handleDelete(contextProduct?.id);
        handleClose();
    }

    const handleFindSimilar = async () => {
        getBook({ id: contextProduct?.id })
            .unwrap()
            .then((book) => navigate(`/filters?cateId=${book?.cateId}&pubId=${book?.publisher?.id}&type=${book?.type}`))
            .catch((rejected) => console.error(rejected));
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

    const isSelected = (id) => selected.indexOf(id) !== -1;

    return (
        <Grid container spacing={3} sx={{ mb: 10, justifyContent: 'flex-end' }}>
            <Grid size={{ xs: 12, lg: 8 }}>
                <MainTitleContainer>
                    <Title><ShoppingCartIcon />&nbsp;GIỎ HÀNG ({cartProducts?.length})</Title>
                    <Button
                        variant="outlined"
                        color="error"
                        sx={{
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
                <TableContainer >
                    <Table aria-label="cart-table">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            onSelectAllClick={handleSelectAllClick}
                            rowCount={cartProducts?.length}
                        />
                        <TableBody>
                            {cartProducts?.map((product, index) => {
                                const isItemSelected = isSelected(product.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <StyledTableRow
                                        hover
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={product.id}
                                        selected={isItemSelected}
                                    >
                                        <StyledTableCell component="th" scope="product">
                                            <Box sx={{ display: 'flex' }}>
                                                <Checkbox
                                                    disableRipple
                                                    disableFocusRipple
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                    sx={{ marginRight: { xs: 1, md: 2 }, marginLeft: { xs: -1.5, sm: 0 } }}
                                                    onClick={() => handleSelect(product.id)}
                                                />
                                                <ItemContainer>
                                                    <NavLink to={`/product/${product.id}`}>
                                                        <StyledLazyImage
                                                            src={`${product.image}?size=small`}
                                                            alt={`${product.title} Cart item`}
                                                            placeholder={<StyledSkeleton variant="rectangular" animation={false} />}
                                                        />
                                                    </NavLink>
                                                    <ItemSummary>
                                                        <NavLink to={`/product/${product.id}`}>
                                                            <ItemTitle>{product.title}</ItemTitle>
                                                        </NavLink>
                                                        <ItemAction>
                                                            <Box display={{ xs: 'block', md: 'none' }}>
                                                                {product?.onSale > 0 && <Discount>{product.price.toLocaleString()}đ</Discount>}
                                                                <Price>{Math.round(product.price * (1 - (product?.onSale || 0))).toLocaleString()}đ</Price>
                                                            </Box>
                                                            <Box display={{ xs: 'flex', sm: 'none' }}>
                                                                <CustomAmountInput
                                                                    size="small"
                                                                    value={product.quantity}
                                                                    onChange={(e) => handleChangeQuantity(e.target.valueAsNumber, product.id)}
                                                                    handleDecrease={() => handleDecrease(product.quantity, product.id)}
                                                                    handleIncrease={() => increaseAmount(product.id)}
                                                                />
                                                            </Box>
                                                        </ItemAction>
                                                    </ItemSummary>
                                                </ItemContainer>
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                            <Price>{Math.round(product.price * (1 - (product?.onSale || 0))).toLocaleString()}đ</Price>
                                            {product?.onSale > 0 && <Discount>{product.price.toLocaleString()}đ</Discount>}
                                        </StyledTableCell>
                                        <StyledTableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                            <CustomAmountInput
                                                size="small"
                                                value={product.quantity}
                                                onChange={(e) => handleChangeQuantity(e.target.valueAsNumber, product.id)}
                                                handleDecrease={() => handleDecrease(product.quantity, product.id)}
                                                handleIncrease={() => increaseAmount(product.id)}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                            <Price className="total">{(Math.round(product.price * (1 - (product?.onSale || 0))) * product.quantity).toLocaleString()}đ</Price>
                                        </StyledTableCell>
                                        <td>
                                            <IconButton sx={hoverIcon} onClick={(e) => handleClick(e, product)}>
                                                <MoreHoriz />
                                            </IconButton>
                                        </td>
                                    </StyledTableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <br />
                <Box display="flex">
                    <NavLink to={'/'}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<ChevronLeft />}
                        >
                            Tiếp tục mua sắm
                        </Button>
                    </NavLink>
                </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 8, lg: 4 }}>
                <CheckoutDialog {...{
                    cartProducts, selected, navigate, handleSelectAllClick,
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