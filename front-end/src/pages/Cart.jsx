import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';
import { useState, useEffect } from "react";
import { Remove as RemoveIcon, Add as AddIcon, Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon, MoreHoriz, Search } from '@mui/icons-material';
import { Checkbox, Grid, IconButton, Breadcrumbs, Table, TableBody, TableContainer, TableHead, TableRow, Box, Menu, MenuItem, ListItemText, ListItemIcon } from '@mui/material';
import { NavLink, useNavigate } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { booksApiSlice } from '../features/books/booksApiSlice';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import PropTypes from 'prop-types';
import useCart from '../hooks/useCart';
import CustomButton from '../components/custom/CustomButton';
import CheckoutDialog from '../components/cart/CheckoutDialog';

//#region styled
const BreadcrumbsContainer = styled.div`
    margin: 20px 10px;
    display: none;

    @media (min-width: ${props => props.theme.breakpoints.values['sm']}px) {
        display: block;
    }
`

const StyledTableCell = muiStyled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.secondary.main,
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
    border: '.5px solid lightgray',
    position: 'relative',

    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const EmptyWrapper = styled.div`
    height: 90dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const Wrapper = styled.div`
`

const MainTitleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 10px;

    @media (min-width: ${props => props.theme.breakpoints.values['md']}px) {
        padding: 20px 0px;
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

const InputContainer = styled.div`
    border: 0.5px solid lightgray;
    align-items: center;
    justify-content: space-between;
    align-items: center;
`

const AmountInput = styled.input`
    height: 20px;
    width: 20px;
    background: transparent;
    color: black;
    font-weight: bold;
    resize: none;
    outline: none;
    border: none;
    text-align: center;

    &::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
`

const AmountButton = styled.div`
    width: 25px;
    height: 25px;
    background-color: lightgray;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.75;
    transition: all 0.5s ease;

    &:hover{
        background-color: ${props => props.theme.palette.secondary.main};
        color: ${props => props.theme.palette.secondary.contrastText};
    }
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
    color: ${props => props.theme.palette.secondary.main};
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
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

const hoverIcon = {
    position: 'absolute',
    right: 1,
    top: 2,
};
//#endregion

const Cart = () => {
    //#region construct
    const { cartProducts, removeProduct, decreaseAmount, increaseAmount, changeAmount } = useCart();
    const [selected, setSelected] = useState([]);
    const [contextProduct, setContextProduct] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    //Get similar
    const [getBook] = booksApiSlice.useLazyGetBookQuery();

    useEffect(() => {
        document.title = `Giỏ hàng`;
        window.scrollTo(0, 0);
    }, [])

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
        selected.map((id) => {
            removeProduct(id);
        })
        setSelected([]);
    }

    const isSelected = (id) => selected.indexOf(id) !== -1;

    function EnhancedTableHead(props) {
        const { onSelectAllClick, numSelected, rowCount } =
            props;

        return (
            <TableHead sx={{ display: { xs: 'none', sm: 'table-header-group' } }}>
                <TableRow sx={{ padding: 0, border: '.5px solid lightgray', backgroundColor: 'secondary.main' }}>
                    <StyledTableCell>
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all',
                            }}
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
                        Sản phẩm ({selected.length})
                    </StyledTableCell>
                    <StyledTableCell align="left" sx={{ display: { xs: 'none', md: 'table-cell' } }}>Đơn giá</StyledTableCell>
                    <StyledTableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Số lượng</StyledTableCell>
                    <StyledTableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>Tổng</StyledTableCell>
                </TableRow>
            </TableHead>
        );
    }

    EnhancedTableHead.propTypes = {
        numSelected: PropTypes.number.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        rowCount: PropTypes.number.isRequired,
    };
    //#endregion

    return (
        <Wrapper>
            <BreadcrumbsContainer>
                <Breadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
                    <NavLink to={`/`} style={{ backgroundColor: '#63e399', padding: '5px 15px', color: 'white' }}>
                        Trang chủ
                    </NavLink>
                    <strong style={{ textDecoration: 'underline' }}>Giỏ hàng</strong>
                </Breadcrumbs>
            </BreadcrumbsContainer>

            {cartProducts?.length == 0 ?
                <EmptyWrapper>
                    <LazyLoadImage src="/empty.svg"
                        height={250}
                    />
                    <h2>Giỏ hàng của bạn đang trống</h2>
                    <NavLink to={'/'}>
                        <CustomButton variant="contained" color="secondary">Tiếp tục mua sắm</CustomButton>
                    </NavLink>
                </EmptyWrapper>
                :
                <Grid container spacing={3} sx={{ mb: 10, justifyContent: 'flex-end' }}>
                    <Grid item xs={12} lg={8}>
                        <MainTitleContainer>
                            <Title><ShoppingCartIcon />&nbsp;GIỎ HÀNG ({cartProducts?.length})</Title>
                            <CustomButton
                                variant="outlined"
                                color="error"
                                sx={{
                                    opacity: selected.length > 0 ? 1 : 0,
                                    visibility: selected.length > 0 ? 'visible' : 'hidden',
                                    transition: 'all .25s ease',
                                }}
                                onClick={handleDeleteMultiple}>
                                Xoá &nbsp;<DeleteIcon />
                            </CustomButton>
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
                                                                <LazyLoadImage src={product.image}
                                                                    height={90}
                                                                    width={90}
                                                                    style={{
                                                                        border: '0.5px solid lightgray',
                                                                        objectFit: 'contain'
                                                                    }}
                                                                />
                                                            </NavLink>
                                                            <ItemSummary>
                                                                <NavLink to={`/product/${product.id}`}>
                                                                    <ItemTitle>{product.title}</ItemTitle>
                                                                </NavLink>
                                                                <ItemAction>
                                                                    <Box display={{ xs: 'block', md: 'none' }}>
                                                                        <Discount>{(product.price * product.quantity).toLocaleString()}đ</Discount>
                                                                        <Price>{product.price.toLocaleString()}đ</Price>
                                                                    </Box>
                                                                    <Box display={{ xs: 'flex', sm: 'none' }} justifyContent={'center'}>
                                                                        <AmountButton direction="remove" onClick={() => handleDecrease(product.quantity, product.id)}>
                                                                            <RemoveIcon style={{ fontSize: 12 }} />
                                                                        </AmountButton>
                                                                        <InputContainer>
                                                                            <AmountInput type="number" onChange={(e) => handleChangeQuantity(e.target.valueAsNumber, product.id)} value={product.quantity} />
                                                                        </InputContainer>
                                                                        <AmountButton direction="add" onClick={() => increaseAmount(product.id)}>
                                                                            <AddIcon style={{ fontSize: 12 }} />
                                                                        </AmountButton>
                                                                    </Box>
                                                                </ItemAction>
                                                            </ItemSummary>
                                                        </ItemContainer>
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                                    <Price>{product.price.toLocaleString()}đ</Price>
                                                    <Discount>{Math.round(product.price * 1.1).toLocaleString()}đ</Discount>
                                                </StyledTableCell>
                                                <StyledTableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <AmountButton direction="remove" onClick={() => handleDecrease(product.quantity, product.id)}>
                                                            <RemoveIcon style={{ fontSize: 12 }} />
                                                        </AmountButton>
                                                        <InputContainer>
                                                            <AmountInput type="number" onChange={(e) => handleChangeQuantity(e.target.valueAsNumber, product.id)} value={product.quantity} />
                                                        </InputContainer>
                                                        <AmountButton direction="add" onClick={() => increaseAmount(product.id)}>
                                                            <AddIcon style={{ fontSize: 12 }} />
                                                        </AmountButton>
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}><Price>{(product.price * product.quantity).toLocaleString()}đ</Price></StyledTableCell>
                                                <IconButton sx={hoverIcon} onClick={(e) => handleClick(e, product)}>
                                                    <MoreHoriz />
                                                </IconButton>
                                            </StyledTableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} md={8} lg={4}>
                        <CheckoutDialog {...{ cartProducts, selected, navigate, handleSelectAllClick, 
                            numSelected: selected.length, rowCount: cartProducts?.length }} />
                    </Grid>
                </Grid>
            }
            <br /><br />
            <Menu
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
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
        </Wrapper >
    )
}

export default Cart