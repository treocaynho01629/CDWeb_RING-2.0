import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellIcon from '@mui/icons-material/Sell';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentsIcon from '@mui/icons-material/Payments';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckIcon from '@mui/icons-material/Check';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';

import { styled as muiStyled } from '@mui/material/styles';
import Stack from "@mui/material/Stack";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputBase from '@mui/material/InputBase';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Grid, TextareaAutosize } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';

import { useDispatch, useSelector } from "react-redux";
import { resetCart } from '../redux/cartReducer';
import { Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from '../hooks/useAxiosPrivate';

//#region styled
const Container = styled.div``

const CustomDialog = muiStyled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      borderRadius: 0,
      padding: '20px 15px',
    },
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));
  
const CustomInput = muiStyled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        borderRadius: 0,
    },
    '& label.Mui-focused': {
        color: '#b4a0a8'
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#B2BAC2',
    },
    '& .MuiOutlinedInput-root': {
    borderRadius: 0,
        '& fieldset': {
            borderRadius: 0,
            borderColor: '#E0E3E7',
        },
        '&:hover fieldset': {
            borderRadius: 0,
            borderColor: '#B2BAC2',
        },
        '&.Mui-focused fieldset': {
            borderRadius: 0,
            borderColor: '#6F7E8C',
        },
    },
    '& input:valid + fieldset': {
        borderColor: 'lightgray',
        borderRadius: 0,
        borderWidth: 1,
    },
    '& input:invalid + fieldset': {
        borderColor: '#e66161',
        borderRadius: 0,
        borderWidth: 1,
    },
    '& input:valid:focus + fieldset': {
        borderColor: '#63e399',
        borderLeftWidth: 4,
        borderRadius: 0,
        padding: '4px !important', 
    },
}));

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

const CheckoutContainer = styled.div`
    display: 'flex';
    flex-direction: 'column';
`

const Title = styled.h3`
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
`

const SemiTitle = styled.h4`
    font-size: 18px;
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    color: gray;
`

const SmallContainer = styled.div`
    border: 0.5px solid lightgray;
    border-color: ${props=>props.color};;
    padding: 20px;
`

const EditButton = styled.div`
    font-size: 16px;
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
        color: #63e399;
    }
`

const StyledTableCell = muiStyled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#63e399',
      color: theme.palette.common.white,
      fontSize: 14,
      fontWeight: 'bold',
      paddingTop: 10,
      paddingBottom: 10,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
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

const ItemContainer = styled.div`
    display: flex;
    margin-left: 20px;
`

const ItemSummary = styled.div`
    margin-left: 10px;
`

const ItemImage = styled.img`
    width: 90px;
    height: 90px;
    border: 0.5px solid lightgray;
`

const CustomButton = styled.div`
    padding: 10px 15px;
    font-size: 16px;
    font-weight: 400;
    background-color: #63e399;
    color: white;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s ease;

    &:hover {
        background: lightgray;
        color: #424242;
    }
`

const ClearButton = styled.div`
    padding: 10px 15px;
    font-size: 16px;
    font-weight: 400;
    background-color: #e66161;
    color: white;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s ease;

    &:hover {
        background: lightgray;
        color: #424242;
    }
`

const SelectCoupon = styled.div`
    font-size: 16px;
    font-weight: 400;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    color: #424242;
    cursor: pointer;
    transition: all 0.5s ease;

    &:hover {
        transform: scale(1.05);
        color: #63e399;
    }
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

const Amount = styled.p`
    font-size: 16px;
    font-weight: bold;
    margin: 10px 0 0 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
`

const Payout = styled.div`
    border: 0.5px solid lightgray;
    padding: 20px;
    margin-bottom: 20px;
    width: 100%;
`

const PayoutTitle = styled.h5`
    margin: 0;
`

const PayoutRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: lightgray;
    margin-top: 10px;
    padding: 0px 10px;
`

const PayoutText = styled.p`
    font-size: 14px;
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

    &:disabled {
        background-color: gray;
        color: darkslategray;
    }
`

const Instruction = styled.p`
    font-size: 14px;
    font-style: italic;
    color: red;
    display: ${props=>props.display};;
`

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '0.5px solid lightgray',
    borderRadius: 0,
    p: 4,
};

const BootstrapInput = muiStyled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 0,
    position: 'relative',
    border: '0.5px solid lightgray',
    background: '#f5f5f5',
    fontSize: 13,
    padding: '10px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    },
}));

const stepStyle = {
    marginTop: '10px',
    '& .MuiStepLabel-root .Mui-completed': {
    color: '#63e399', // circle color (COMPLETED)
    },
    '& .MuiStepLabel-root .Mui-active': {
    color: '#63e399', // circle color (ACTIVE)
    },
    '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
    fill: 'white', // circle's number (ACTIVE)
    }
}
//#endregion

const PHONE_REGEX = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
const CHECKOUT_URL = '/api/orders';

const Checkout = () => {
    //#region construct
    const [open, setOpen] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [validPhone, setValidPhone] = useState(false);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [activeStep, setActiveStep] = useState(0);

    const products = useSelector(state => state.cart.products); //Lấy products trong giỏ từ redux
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const errRef = useRef();

    //Tính tổng tiền
    const totalPrice = () =>{
        let total = 0;
        products.forEach((item) => (total += item.quantity * item.price));
        return total;
    }

    //Error message reset when reinput stuff
    useEffect(() => {
        if (!firstName || !lastName || !phone || !address) {
            setErrMsg("Vui lòng nhập địa chỉ giao hàng!");
            errRef.current.focus();
            setActiveStep(0);
            return;
        } else {
            setErrMsg('');
            setActiveStep(1);
        }
    }, [firstName, lastName, phone, address])

    useEffect(() => {
        const result = PHONE_REGEX.test(phone);
        setValidPhone(result);
    }, [phone])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const valid = PHONE_REGEX.test(phone);

        if (!valid && phone) {
            setErrMsg("Sai định dạng số điện thoại!");
            errRef.current.focus();
            return;
        } else if (!firstName || !lastName || !phone || !address) {
            setErrMsg("Vui lòng nhập địa chỉ giao hàng!");
            errRef.current.focus();
            return;
        }

        try {
            const response = await axiosPrivate.post(CHECKOUT_URL,
                JSON.stringify({
                    cart: products,
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    address: city + "/" + state + "/" + address,
                    message: message
                } ),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response))
            dispatch(resetCart());
            navigate('/cart');
        } catch (err) {
            console.log(err);
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg(err.response?.data?.errors?.errorMessage);
            } else if (err.response?.status === 400) {
                setErrMsg('Sai định dạng thông tin!');  
            } else {
                setErrMsg('Đặt hàng thất bại!')
            }
            errRef.current.focus();
        }
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const clearInput = () => {
        setFirstName('');
        setLastName('');
        setPhone('');
        setCity('');
        setState('');
        setAddress('');
    }
    //#endregion

  return (
    <Container>
        <Navbar/>
        <Wrapper>
            <div role="presentation" style={{margin: '20px 10px'}}>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <Link to={`/`} style={{backgroundColor: '#63e399', padding: '5px 15px', color: 'white'}}>
                    Trang chủ
                    </Link>
                    <Link to={`/cart`}>
                    Giỏ hàng
                    </Link>
                    <strong style={{textDecoration: 'underline'}}>Thanh toán</strong>
                </Breadcrumbs>
            </div>
            <CheckoutContainer>
                <Title><PersonIcon/>&nbsp;XÁC NHẬN ĐẶT HÀNG</Title>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{maxWidth: '50px', marginRight: '10px'}}>
                        <Stepper activeStep={activeStep} 
                        orientation="vertical" 
                        sx={stepStyle}>
                             <Step key={1}>
                                <StepLabel></StepLabel>
                                <StepContent sx={{height: activeStep == 0 ? '120px' : '70px'}}>
                                </StepContent>
                            </Step>
                            <Step key={2}>
                                <StepLabel></StepLabel>
                                <StepContent sx={{height: `${products.length * 129 + 260}px`}}>
                                </StepContent>
                            </Step>
                            <Step key={3}>
                                <StepLabel></StepLabel>
                            </Step>
                        </Stepper>
                    </div>
                    <div style={{width: '100%'}}>
                        <SemiTitle><LocationOnIcon/>&nbsp;Địa chỉ người nhận</SemiTitle>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        <SmallContainer color={firstName && lastName && phone && address && validPhone ? 'lightgray' : 'red' }>
                            <Grid container spacing={1}>
                                <Grid item xs={3}>
                                    <strong>{firstName + " " + lastName} {phone ? `(+84) ${phone}` : ''}</strong>
                                </Grid>
                                <Grid item xs={8}>{city} {state ? `/ ${state}` : ''} {address ? `/ ${address}` : ''}</Grid>
                                <Grid item xs sx={{justifyContent: 'flex-end'}}> 
                                    <EditButton onClick={handleOpen}>Thay đổi</EditButton>
                                </Grid>
                                <CustomDialog open={open} onClose={handleClose}>
                                    <DialogTitle sx={{display: 'flex', alignItems: 'center'}}><LocationOnIcon/>&nbsp;Địa chỉ người nhận</DialogTitle>
                                    <DialogContent>
                                        <Stack spacing={1} direction="column">
                                            <Instruction display={errMsg ? "block" : "none"} aria-live="assertive">{errMsg}</Instruction>
                                            
                                            <CustomInput label='Nhập Họ đệm'
                                            type="text"
                                            id="firstName"
                                            required
                                            onChange={(e) => setFirstName(e.target.value)}
                                            value={firstName}
                                            error = {!firstName}
                                            size="small"
                                            sx={{width: '500px'}}
                                            InputProps={{
                                                endAdornment: <PersonIcon style={{color:"gray"}}/>
                                            }}
                                            />
                                            <CustomInput label='Nhập Tên'
                                            type="text"
                                            id="lastName"
                                            required
                                            onChange={(e) => setLastName(e.target.value)}
                                            value={lastName}
                                            error = {!lastName}
                                            size="small"
                                            />
                                            
                                            <CustomInput placeholder='Nhập số điện thoại (+84)'
                                            autoComplete="on"
                                            id="phone"
                                            required
                                            onChange={(e) => setPhone(e.target.value)}
                                            value={phone}
                                            error={!phone || (phone && !validPhone)}
                                            helperText={(phone && !validPhone) ? "Sai định dạng số điện thoại!" : ""}
                                            size="small"
                                            InputProps={{
                                                endAdornment: <PhoneIcon style={{color:"gray"}}/>
                                            }}
                                            />
                                            
                                            <Select
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            input={<BootstrapInput />}
                                            >
                                                <MenuItem disabled value="">
                                                    <em>--Tỉnh/Thành phố--</em>
                                                </MenuItem>
                                                <MenuItem value={'TP. Hồ Chí Minh'}>TP. Hồ Chí Minh</MenuItem>
                                                <MenuItem value={'Hải Phòng'}>Hải Phòng</MenuItem>
                                                <MenuItem value={'Hà Nội'}>Hà Nội</MenuItem>
                                                <MenuItem value={'Lâm Đồng'}>Lâm Đồng</MenuItem>
                                                <MenuItem value={'Bà Rịa - Vũng Tàu'}>Bà Rịa - Vũng Tàu</MenuItem>
                                            </Select>
                                            <Select
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            input={<BootstrapInput />}
                                            >
                                                <MenuItem disabled value="">
                                                    <em>--Phường/Xã--</em>
                                                </MenuItem>
                                                <MenuItem value={'Phường An Bình'}>	Phường An Bình</MenuItem>
                                                <MenuItem value={'Phường Bình Đa'}>	Phường Bình Đa</MenuItem>
                                                <MenuItem value={'Xã Xuân Trường'}>Xã Xuân Trường</MenuItem>
                                                <MenuItem value={'Xã Phước Tân'}>Xã Phước Tân</MenuItem>
                                                <MenuItem value={'Xã Tân Hạnh'}>Xã Tân Hạnh</MenuItem>
                                                <MenuItem value={'Xã Long Hưng'}>Xã Long Hưng</MenuItem>
                                            </Select>
                                            <CustomInput placeholder='Nhập địa chỉ nhận hàng'
                                            type="text"
                                            autoComplete="on"
                                            onChange={(e) => setAddress(e.target.value)}
                                            value={address}
                                            error={!address}
                                            size="small"
                                            InputProps={{
                                                endAdornment: <HomeIcon style={{color:"gray"}}/>
                                            }}
                                            />
                                            
                                        </Stack>
                                    </DialogContent>
                                    <DialogActions>
                                        <CustomButton onClick={handleClose}><CheckIcon sx={{marginRight: '10px'}}/>Áp dụng</CustomButton>
                                        <ClearButton onClick={clearInput}><CloseIcon sx={{marginRight: '10px'}}/>Xoá</ClearButton>
                                    </DialogActions>
                                </CustomDialog>
                            </Grid>
                        </SmallContainer>
                        <SemiTitle><ShoppingCartIcon/>&nbsp;Kiểm tra lại sản phẩm</SemiTitle>
                        <TableContainer component={Paper} sx={{borderRadius: '0%'}} >
                            <Table sx={{minWidth: 500, borderRadius: '0%'}} aria-label="cart-table">
                                <TableHead>
                                    <TableRow sx={{padding: 0}}>
                                        <StyledTableCell sx={{marginLeft: '20px'}}>SẢN PHẨM (100)</StyledTableCell>
                                        <StyledTableCell>Đơn giá</StyledTableCell>
                                        <StyledTableCell>Số lượng</StyledTableCell>
                                        <StyledTableCell>Thành tiền</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {products.map((product, index) => {
                                    return (
                                        <StyledTableRow hover
                                            key={product.id}
                                        >
                                            <StyledTableCell>
                                                <Link to={`/product/${product.id}`} style={{display: 'flex'}}>
                                                    <ItemContainer>
                                                        <ItemImage src={product.image}/>
                                                        <ItemSummary>
                                                            <ItemTitle>{product.title}</ItemTitle>
                                                        </ItemSummary>
                                                    </ItemContainer>
                                                </Link>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <Price>{product.price.toLocaleString()}đ</Price>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <Amount>{product.quantity}</Amount>
                                            </StyledTableCell>
                                            <StyledTableCell align="right"><Price>{(product.price * product.quantity).toLocaleString()}đ</Price></StyledTableCell>
                                        </StyledTableRow>
                                    )
                                })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div style={{marginTop: '20px', marginLeft: '10px'}}>
                            <strong style={{fontSize: '16px'}}>Ghi chú khi giao hàng: </strong>
                        </div>
                        <TextareaAutosize
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            aria-label="note"
                            minRows={7}
                            placeholder="Nhập ghi chú cho đơn hàng ..."
                            style={{ width: '100%', margin: '10px 0px', backgroundColor: 'white', outline: 'none',
                            borderRadius: '0', resize: 'none', color: 'black', fontSize: '16px'}}
                        />
                        <SemiTitle><SellIcon/>&nbsp;Khuyến mãi</SemiTitle>
                        <SmallContainer>
                            <Grid container spacing={1}>
                                <Grid item xs={10} sx={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Grid item xs={10}>
                                        <CustomInput placeholder='Nhập mã giảm giá ...' size="small"/>
                                        <SellIcon style={{color:"gray"}}/>
                                    </Grid>
                                    <Grid item xs>
                                        <CustomButton>Áp dụng</CustomButton>
                                    </Grid>
                                </Grid>
                                <Grid item xs sx={{alignItems: 'center', display: 'flex', justifyContent: 'flex-end'}}>
                                    <SelectCoupon>Chọn mã</SelectCoupon>
                                </Grid>
                            </Grid>
                        </SmallContainer>
                        <SemiTitle><CreditCardIcon/>&nbsp;Hình thức thanh toán</SemiTitle>
                        <SmallContainer>
                            dsadas
                        </SmallContainer>
                        <Title><CheckIcon/>&nbsp;XÁC THỰC ĐẶT HÀNG</Title>
                        <Grid container>
                            <Grid item lg={6} xs={12} sx={{display: 'flex'}}>
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
                                    <PayButton onClick={handleSubmit}
                                    disabled={!validPhone || !firstName || !lastName || !address || !phone ? true : false}>
                                        <PaymentsIcon style={{fontSize: 18}}/>&nbsp;ĐẶT HÀNG
                                    </PayButton>
                                </Payout>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </CheckoutContainer>
        </Wrapper>
        <Footer/>
    </Container>
  )
}

export default Checkout