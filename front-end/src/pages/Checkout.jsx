import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import styled from 'styled-components'
import { styled as muiStyled, useTheme } from '@mui/material/styles';

import { ShoppingCart as ShoppingCartIcon, Sell as SellIcon, LocationOn as LocationOnIcon, Payments as PaymentsIcon,
CreditCard as CreditCardIcon, Check as CheckIcon, Person as PersonIcon, Phone as PhoneIcon, Home as HomeIcon,
Close as CloseIcon, QrCode as QrCodeIcon, LocalAtm as LocalAtmIcon, SystemSecurityUpdateGood as SystemSecurityUpdateGoodIcon } from '@mui/icons-material';

import { Grid, TextareaAutosize, Stack, Table, TableBody, TableContainer, TableHead, TableRow, Paper,
Breadcrumbs, MenuItem, Select, InputBase, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
Stepper, Step, StepLabel, StepContent, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { useDispatch, useSelector } from "react-redux";
import { resetCart } from '../redux/cartReducer';
import { Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useSnackbar } from 'notistack';
import usePrivateFetch from '../hooks/usePrivateFetch'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useMediaQuery from '@mui/material/useMediaQuery';

const PendingIndicator = lazy(() => import('../components/authorize/PendingIndicator'));

//#region styled
const CustomDialog = muiStyled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      borderRadius: 0,
      width: '100%',
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

const TextButton = styled.div`
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
        color: ${props => props.theme.palette.secondary.main};
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

const CustomButton = styled.div`
    padding: 10px 15px;
    font-size: 16px;
    font-weight: 400;
    background-color: ${props => props.theme.palette.secondary.main};
    color: ${props => props.theme.palette.secondary.contrastText};
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
    color: ${props => props.theme.palette.secondary.main};
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
    background-color: ${props => props.theme.palette.secondary.main};
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
const PROFILE_URL = '/api/accounts/profile';

const Checkout = () => {
    //#region construct
    const [pending, setPending] = useState(false);
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
    const [err, setErr] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [value, setValue] = useState("1");
    const { loading, data } = usePrivateFetch(PROFILE_URL);
    const fullAddress = `${city}` + `${state ? `/ ${state}` : ''}` + `${address ? `/ ${address}` : ''}`

    const products = useSelector(state => state.cart.products); //Lấy products trong giỏ từ redux
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const errRef = useRef();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    //Tính tổng tiền
    const totalPrice = () =>{
        let total = 0;
        products.forEach((item) => (total += item.quantity * item.price));
        return total;
    }

    //Error message reset when reinput stuff
    useEffect(() => {
        if ((!firstName || !lastName || !phone || !address) && !loading) {
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
        if (products.length == 0){
            navigate('/cart');
        }
        if (!loading){
            setAddress(data?.address);
            setPhone(data?.phone);
            var fullName = data?.name.split(' ');
            setLastName(fullName[fullName.length - 1]);
            if (fullName.length > 2) setFirstName(fullName.slice(0, -1).join(' '));
            document.title = `RING! - Thanh toán`;
            window.scrollTo(0, 0);
        }
    }, [loading])

    useEffect(() => {
        const result = PHONE_REGEX.test(phone);
        setValidPhone(result);
    }, [phone])

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

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
        setPending(true);

        try {
            const response = await axiosPrivate.post(CHECKOUT_URL,
                JSON.stringify({
                    cart: products,
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    address: fullAddress,
                    message: message
                } ),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            dispatch(resetCart());
            enqueueSnackbar('Đặt hàng thành công!', { variant: 'success' });
            navigate('/cart');
            setPending(false);
        } catch (err) {
            console.log(err);
            setErr(err);
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
    <Wrapper>
        {pending ?
        <Suspense fallBack={<></>}>
            <PendingIndicator/>
        </Suspense>
        : null
        }
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
            <Stepper activeStep={activeStep} 
            orientation="vertical" 
            sx={stepStyle}>
                <Step key={0} expanded>
                    <StepLabel>
                        <SemiTitle><LocationOnIcon/>&nbsp;Địa chỉ người nhận</SemiTitle>
                    </StepLabel>
                    <StepContent>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        <SmallContainer color={firstName && lastName && phone && address && validPhone ? 'lightgray' : 'red' }>
                            <Grid container spacing={1}>
                                <Grid item xs={3}>
                                    <strong>{firstName + " " + lastName} {phone ? `(+84) ${phone}` : ''}</strong>
                                </Grid>
                                <Grid item xs={8}>{city} {state ? `/ ${state}` : ''} {address ? `/ ${address}` : ''}</Grid>
                                <Grid item xs sx={{justifyContent: 'flex-end'}}> 
                                    <TextButton onClick={handleOpen}>Thay đổi</TextButton>
                                </Grid>
                                <CustomDialog open={open} 
                                scroll="body"
                                onClose={handleClose}
                                fullScreen={fullScreen}>
                                    <DialogTitle sx={{display: 'flex', alignItems: 'center'}}><LocationOnIcon/>&nbsp;Địa chỉ người nhận</DialogTitle>
                                    <DialogContent sx={{marginX: '10px'}}>
                                        <Stack spacing={1} direction="column">
                                            <Instruction display={errMsg ? "block" : "none"} aria-live="assertive">{errMsg}</Instruction>
                                            <CustomInput label='Nhập Họ đệm'
                                            type="text"
                                            id="firstName"
                                            required
                                            onChange={(e) => setFirstName(e.target.value)}
                                            value={firstName}
                                            error = {!firstName || err?.response?.data?.errors?.firstName}
                                            helperText= {err?.response?.data?.errors?.firstName}
                                            size="small"
                                            sx={{width: '100%'}}
                                            InputProps={{
                                                endAdornment: <PersonIcon style={{color:"gray"}}/>
                                            }}
                                            />
                                            <CustomInput label='Nhập Tên'
                                            type="text"
                                            id="lastName"
                                            required
                                            fullWidth
                                            onChange={(e) => setLastName(e.target.value)}
                                            value={lastName}
                                            error = {!lastName || err?.response?.data?.errors?.lastName}
                                            helperText= {err?.response?.data?.errors?.lastName}
                                            size="small"
                                            />
                                            
                                            <CustomInput placeholder='Nhập số điện thoại (+84)'
                                            id="phone"
                                            required
                                            onChange={(e) => setPhone(e.target.value)}
                                            value={phone}
                                            error={!phone || (phone && !validPhone) || err?.response?.data?.errors?.phone}
                                            helperText={(phone && !validPhone) ? "Sai định dạng số điện thoại!" : err?.response?.data?.errors?.phone}
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
                                            error={!address || err?.response?.data?.errors?.address}
                                            helperText= {err?.response?.data?.errors?.address}
                                            size="small"
                                            InputProps={{
                                                endAdornment: <HomeIcon style={{color:"gray"}}/>
                                            }}
                                            />
                                            
                                        </Stack>
                                    </DialogContent>
                                    <DialogActions sx={{marginBottom: '10px'}}>
                                        <CustomButton onClick={handleClose}><CheckIcon sx={{marginRight: '10px'}}/>Áp dụng</CustomButton>
                                        <ClearButton onClick={clearInput}><CloseIcon sx={{marginRight: '10px'}}/>Xoá</ClearButton>
                                    </DialogActions>
                                </CustomDialog>
                            </Grid>
                        </SmallContainer>
                    </StepContent>
                </Step>
                <Step key={1} expanded>
                    <StepLabel>
                        <SemiTitle><ShoppingCartIcon/>&nbsp;Kiểm tra lại sản phẩm</SemiTitle>
                    </StepLabel>
                    <StepContent>
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
                                                        <LazyLoadImage src={product.image}
                                                            height={90}
                                                            width={90} 
                                                            style={{
                                                                border: '0.5px solid lightgray',
                                                                objectFit: 'contain'
                                                            }}
                                                        /> 
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
                        {activeStep === 1 ?
                        <div style={{width: '30%'}}>
                            <CustomButton onClick={handleNext}>Tiếp tục</CustomButton>
                        </div>
                        : null
                        }
                
                    </StepContent>
                </Step>
                <Step key={2}>
                    <StepLabel>
                        <SemiTitle><CreditCardIcon/>&nbsp;Thanh toán</SemiTitle>
                    </StepLabel>
                    <StepContent>
                        <SemiTitle><CreditCardIcon/>&nbsp;Hình thức thanh toán</SemiTitle>
                        <SmallContainer>
                            <RadioGroup spacing={1} row value={value} onChange={handleChange}>
                                <FormControlLabel value="1" control={<Radio  sx={{
                                    '&.Mui-checked': {
                                    color: '#63e399',
                                }}}/>} 
                                label={<div style={{display: 'flex', alignItems: 'center'}}>
                                        <LocalAtmIcon sx={{fontSize: 30}}/>Tiền mặt
                                    </div>} />
                                <FormControlLabel value="2" control={<Radio  sx={{
                                    '&.Mui-checked': {
                                    color: '#63e399',
                                }}}/>} 
                                label={<div style={{display: 'flex', alignItems: 'center'}}>
                                        <CreditCardIcon sx={{fontSize: 30}}/>Thẻ ATM
                                    </div>} />
                                <FormControlLabel value="3" control={<Radio  sx={{
                                    '&.Mui-checked': {
                                    color: '#63e399',
                                }}}/>} 
                                label={<div style={{display: 'flex', alignItems: 'center'}}>
                                        <SystemSecurityUpdateGoodIcon sx={{fontSize: 30}}/>Internet Banking
                                    </div>} />
                                <FormControlLabel value="4" control={<Radio  sx={{
                                    '&.Mui-checked': {
                                    color: '#63e399',
                                }}}/>} 
                                label={<div style={{display: 'flex', alignItems: 'center'}}>
                                        <QrCodeIcon sx={{fontSize: 30}}/>QR Code
                                    </div>} />
                            </RadioGroup>
                        </SmallContainer>
                        <SemiTitle><SellIcon/>&nbsp;Khuyến mãi</SemiTitle>
                        <SmallContainer>
                            <Grid container spacing={1}>
                                <Grid item xs={8} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Grid item xs={7}>
                                        <CustomInput placeholder='Nhập mã giảm giá ...'
                                            size="small"
                                            fullWidth
                                            InputProps={{
                                                endAdornment: <SellIcon style={{color:"gray"}}/>
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs><CustomButton>Áp dụng</CustomButton></Grid>
                                </Grid>
                                <Grid item xs sx={{alignItems: 'center', display: 'flex', justifyContent: 'flex-end'}}>
                                    <TextButton>Chọn mã</TextButton>
                                </Grid>
                            </Grid>
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
                    </StepContent>
                </Step>
            </Stepper>
        </CheckoutContainer>
    </Wrapper>
  )
}

export default Checkout