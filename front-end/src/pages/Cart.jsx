import { useState } from "react";

import styled from 'styled-components'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import SellIcon from '@mui/icons-material/Sell';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentsIcon from '@mui/icons-material/Payments';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Checkbox, Grid, IconButton } from '@mui/material';

import { styled as muiStyled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, increaseQuantity, decreaseQuantity, changeQuantity } from '../redux/cartReducer';

const StyledTableCell = muiStyled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#63e399',
    color: theme.palette.common.white,
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 5
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  },
}));

const StyledTableRow = muiStyled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Container = styled.div``

const Wrapper = styled.div`
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;

    @media (min-width: 768px) {
        width: 750px;
    }
    @media (min-width: 992px) {
        width: 970px;
    }
    @media (min-width: 1200px) {
        width: 1170px;
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

const DeleteAllButton = styled.div`
    font-size: 14px;
    font-weight: 400;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    color: #424242;
    cursor: pointer;
    transition: all 0.5s ease;

    &:hover {
        transform: scale(1.05);
        color: #e66161;
    }
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
        background-color: #63e399;
        color: white;
    }
`

const ItemContainer = styled.div`
    display: flex;
`

const ItemSummary = styled.div`
    margin-left: 10px;
`

const ItemImage = styled.img`
    width: 90px;
    height: 90px;
    border: 0.5px solid lightgray;
`

const ItemTitle = styled.p`
    font-size: 14px;
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
`

const Price = styled.p`
    font-size: 16px;
    font-weight: bold;
    color: #63e399;
    margin: 10px 0 0;
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

const Payout = styled.div`
    border: 0.5px solid lightgray;
    padding: 20px;
    margin-bottom: 20px;
`

const PayoutTitle = styled.h5`
    margin: 0;
`

const CouponContainer = styled.div`
    width: 70%;
    margin-left: 10px;
    border: 0.5px solid lightgray;
    align-items: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Input = styled.input`
    border: none;
    background: transparent;
    color: black;
    resize: none;
    outline: none;
    display: flex;
`

const PayoutRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: lightgray;
    margin-top: 10px;
    padding: 0px 10px;
`

const CouponRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: lightgray;
    margin-top: 10px;
    padding: 0px 10px;
`

const PayoutText = styled.p`
    font-size: 14px;
    font-weight: 500;
    margin: 8px 0;
`

const PayoutPrice = styled.p`
    font-size: 16px;
    font-weight: bold;
    color: red;
`

const PayButton = styled.button`
    background-color: #63e399;
    padding: 15px 20px;
    margin-top: 20px;
    font-size: 14px;
    font-weight: bold;
    width: 100%;
    font-weight: 500;
    border-radius: 0;
    border: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    transition: all 0.5s ease;

    &:hover {
        background-color: lightgray;
        color: black;
    }
`

const hoverIcon = {
    "&:hover": {
        transform: 'scale(1.05)',
        color: '#e66161',
    },
};

const Cart = () => {
    const products = useSelector(state => state.cart.products); //Lấy products trong giỏ từ redux
    const dispatch = useDispatch();
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate();

    //Tính tổng tiền
    const totalPrice = () =>{
        let total = 0;
        products.forEach((item) => (total += item.quantity * item.price));
        return total;
    }

    //Chọn tất cả
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelected = products.map((n) => n.id);
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

    const handleDelete = (id) => {
        if (isSelected(id)) handleSelect(id);
        dispatch(removeItem(id));
    }

    const handleDecrease = (quantity, id) => {
        if (quantity == 1 && isSelected(id)) handleSelect(id);
        dispatch(decreaseQuantity(id));
    }

    const handleChangeQuantity = (quantity, id) => {
        console.log(quantity);
        if (quantity < 1 && isSelected(id)) handleSelect(id);
        dispatch(changeQuantity({quantity, id}));
    }

    const handleDeleteMultiple = () => {
        selected.map((id) => {
            dispatch(removeItem(id))
        })
        setSelected([]);
    }

    const isSelected = (id) => selected.indexOf(id) !== -1;

    function EnhancedTableHead(props) {
        const { onSelectAllClick, numSelected, rowCount } =
          props;
      
        return (
          <TableHead>
            <TableRow sx={{padding: 0}}>
                <StyledTableCell>
                    <Checkbox
                    color="primary"
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={onSelectAllClick}
                    inputProps={{
                        'aria-label': 'select all',
                    }}
                    sx={{color: 'white',
                    '&.Mui-checked': {
                          color: 'white',
                    },
                    '&.MuiCheckbox-indeterminate': {
                        color: 'white',
                    }}}
                    />
                    SẢN PHẨM ({selected.length})
                </StyledTableCell>
                <StyledTableCell align="left">Đơn giá</StyledTableCell>
                <StyledTableCell align="center">Số lượng</StyledTableCell>
                <StyledTableCell align="center">Tổng</StyledTableCell>
            </TableRow>
        </TableHead>
        );
      }
      
    EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired,
    };

  return (
    <Container>
        <Navbar/>
        <Wrapper>
            <div role="presentation" style={{margin: '20px 10px'}}>
                <Breadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
                    <Link to={`/`} style={{backgroundColor: '#63e399', padding: '5px 15px', color: 'white'}}>
                    Trang chủ
                    </Link>
                    <strong style={{textDecoration: 'underline'}}>Giỏ hàng</strong>
                </Breadcrumbs>
            </div>
            
            <Grid container spacing={3} sx={{mb: 10}}>
                <Grid item xs={12} lg={8}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0px'}}>
                        <Title><ShoppingCartIcon/>&nbsp;GIỎ HÀNG ({products.length})</Title>
                        <DeleteAllButton style={{display: selected.length > 0 ? "flex" : "none"}} onClick={handleDeleteMultiple}>Xoá mục đã chọn&nbsp;<DeleteIcon/></DeleteAllButton>
                    </div>
                    <TableContainer component={Paper} sx={{borderRadius: '0%'}} >
                        <Table sx={{ minWidth: 500, borderRadius: '0%'}} aria-label="cart-table">
                            <EnhancedTableHead
                                numSelected={selected.length}
                                onSelectAllClick={handleSelectAllClick}
                                rowCount={products.length}
                            />
                            <TableBody>
                            {products.map((product, index) => {
                                const isItemSelected = isSelected(product.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <StyledTableRow hover
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={product.id}
                                        selected={isItemSelected}
                                    >
                                        <StyledTableCell component="th" scope="product" onClick={() => handleSelect(product.id)}>
                                            <div style={{display: 'flex'}}>
                                                <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                                sx={{marginRight: 2,
                                                    '&.Mui-checked': {
                                                    color: 'gray',
                                                }}}
                                                />
                                                <Link to={`/product/${product.id}`}>
                                                    <ItemContainer>
                                                            <ItemImage src={product.image}/>
                                                            <ItemSummary>
                                                                <ItemTitle>{product.title}</ItemTitle>
                                                            </ItemSummary>
                                                    </ItemContainer>
                                                </Link>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <Price>{product.price.toLocaleString()}đ</Price>
                                            <Discount>{Math.round(product.price * 1.1).toLocaleString()}đ</Discount>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                                <AmountButton direction="remove" onClick={() => handleDecrease(product.quantity, product.id)}>
                                                    <RemoveIcon style={{fontSize: 12}}/>
                                                </AmountButton>
                                                <InputContainer>
                                                    <AmountInput type="number" onChange={(e) => handleChangeQuantity(e.target.valueAsNumber, product.id)} value={product.quantity}/>    
                                                </InputContainer>
                                                <AmountButton direction="add" onClick={() => dispatch(increaseQuantity(product.id))}>
                                                    <AddIcon style={{fontSize: 12}}/>
                                                </AmountButton>
                                            </div>
                                            <IconButton sx={hoverIcon} onClick={() => handleDelete(product.id)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell align="right"><Price>{(product.price * product.quantity).toLocaleString()}đ</Price></StyledTableCell>
                                    </StyledTableRow>
                                )
                            })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} lg={4}> 
                    <div style={{display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '20px 0px'}}>
                        <Title>ĐƠN DỰ TÍNH&nbsp;</Title><SellIcon/>
                    </div>
                    <Payout>
                        <PayoutTitle>KHUYẾN MÃI</PayoutTitle>
                        <CouponRow>
                            <PayoutText>Nhập mã:</PayoutText>
                            <CouponContainer>
                                <Input/>
                                <SellIcon style={{color:"gray"}}/>
                            </CouponContainer>
                        </CouponRow>
                    </Payout>
                    <Payout>
                        <PayoutTitle>THANH TOÁN</PayoutTitle>
                        <PayoutRow>
                            <PayoutText>Thành tiền:</PayoutText>
                            <PayoutText>{totalPrice().toLocaleString()} đ</PayoutText>
                        </PayoutRow>
                        <PayoutRow>
                            <PayoutText>VAT:</PayoutText>
                            <PayoutText>10%</PayoutText>
                        </PayoutRow>
                        <PayoutRow>
                            <PayoutText>Phí ship:</PayoutText>
                            <PayoutText>10,000 đ</PayoutText>
                        </PayoutRow>
                        <PayoutRow>
                            <PayoutText>Tổng:</PayoutText>
                            <PayoutPrice>{Math.round(totalPrice() * 1.1 + 10000).toLocaleString()}&nbsp;đ</PayoutPrice>
                        </PayoutRow>
                        <PayButton disabled={products.length == 0} onClick={() => navigate('/checkout')}><PaymentsIcon style={{fontSize: 18}}/>&nbsp;THANH TOÁN</PayButton>
                    </Payout>
                </Grid>
            </Grid>
        </Wrapper>
        <Footer/>
    </Container>
  )
}

export default Cart