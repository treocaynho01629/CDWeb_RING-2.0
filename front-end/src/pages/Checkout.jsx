import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';
import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { ShoppingCart as ShoppingCartIcon, LocationOn as LocationOnIcon, CreditCard as CreditCardIcon, KeyboardDoubleArrowDown, Person } from '@mui/icons-material';
import { TextareaAutosize, Table, TableBody, TableContainer, TableHead, TableRow, Stepper, Step, StepLabel, StepContent, Typography, Box, } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useDispatch } from "react-redux";
import { resetCart } from '../redux/cartReducer';
import { Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useSnackbar } from 'notistack';
import { useGetProfileQuery } from '../features/users/usersApiSlice';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import CustomBreadcrumbs from '../components/custom/CustomBreadcrumbs';
import CustomButton from '../components/custom/CustomButton';
import AddressComponent from '../components/cart/AddressComponent';
import FinalCheckoutDialog from '../components/cart/FinalCheckoutDialog';

const PendingIndicator = lazy(() => import('../components/authorize/PendingIndicator'));

//#region styled
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

    ${props => props.theme.breakpoints.down("sm")} {
        margin: 20px 10px;
    }
`

const ItemAction = styled.div`
    justify-content: space-between;
    align-items: flex-end;
    display: flex;
`

const SemiTitle = styled.h4`
    font-size: 18px;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    color: inherit;
`

const MiniTitle = styled.h4`
    font-size: 16px;
    margin: 15px 0px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    color: inherit;
`

const SmallContainer = styled.div`
    border: 0.5px solid ${props => props.theme.palette.action.focus};
    padding: 20px;

    &.error {
        border-color: ${props => props.theme.palette.error.main};
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

const ItemContainer = styled.div`
    display: flex;
    width: 100%;
`

const ItemSummary = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 10px;
    padding-bottom: 10px;
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

const Price = styled.p`
    font-size: 16px;
    font-weight: bold;
    color: ${props => props.theme.palette.secondary.main};
    margin: 0;
 
    &.total {
        font-size: 18px;
        color: red;
    }
`

const Amount = styled.p`
    font-size: 16px;
    font-weight: bold;
    margin: 10px 0 0 10px;
    text-align: center;

    &.alt {
        display: none;
        
        ${props => props.theme.breakpoints.down("sm")} {
            display: block;
        }
    }
`

const StyledStepper = muiStyled(Stepper)(({ theme }) => ({
    marginTop: '10px',
    '& .MuiStepLabel-root': {
        [theme.breakpoints.down("sm")]: {
            marginLeft: '10px',
        }
    },
    '& .MuiStepLabel-root .Mui-completed': {
        color: theme.palette.secondary.main,
    },
    '& .MuiStepLabel-root .Mui-active': {
        color: theme.palette.secondary.main,
        textDecoration: 'underline'
    },
    '& .MuiStepLabel-root .Mui-error': {
        color: theme.palette.error.main,
        textDecoration: 'underline'
    },
    '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
        fill: theme.palette.text.main,
    }
}));

const StyledStepContent = muiStyled(StepContent)(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
        padding: 0,
        margin: 0,
        borderLeft: 'none'
    }
}));

const StyledStepLabel = muiStyled(StepLabel)(({ theme }) => ({
    margin: '15px 0px',
}));
//#endregion

const PHONE_REGEX = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
const CHECKOUT_URL = '/api/orders';

const Checkout = () => {
    //#region construct
    //Products from state
    const { state: checkState } = useLocation();
    const products = checkState.products;

    //Initial value
    const [pending, setPending] = useState(false);
    const [addressInfo, setAddressInfo] = useState({
        fullName: '',
        phone: '',
        city: '',
        state: '',
        address: ''
    })
    const [validPhone, setValidPhone] = useState(false);
    const [message, setMessage] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [err, setErr] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [value, setValue] = useState("1");
    const fullAddress = `${addressInfo?.city}${addressInfo?.ward ? `/ ${addressInfo?.ward}/` : ''}${addressInfo?.address}`

    //Fetch current profile
    const { data: profile, isLoading: loadProfile, isSuccess: profileDone } = useGetProfileQuery();

    //Other
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const errRef = useRef();
    const { enqueueSnackbar } = useSnackbar();

    //Error message reset when reinput stuff
    useEffect(() => {
        if ((!addressInfo.fullName || !addressInfo.phone || !addressInfo.address) && !loadProfile) {
            setErrMsg("Vui lòng nhập địa chỉ giao hàng!");
            errRef.current.focus();
            setActiveStep(0);
            return;
        } else {
            setErrMsg('');
            setActiveStep(1);
        }
    }, [addressInfo.fullName, addressInfo.phone, addressInfo.address])

    useEffect(() => { //Load user info
        if (!loadProfile && profileDone && profile) {
            setAddressInfo({ ...addressInfo, address: profile?.address, phone: profile?.phone, fullName: profile?.name });
        }
    }, [loadProfile])

    useEffect(() => { //Check phone number
        const result = PHONE_REGEX.test(addressInfo.phone);
        setValidPhone(result);
    }, [addressInfo.phone])

    useEffect(() => {
        document.title = `Thanh toán`;
        window.scrollTo(0, 0);
    }, [])

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const validAddressInfo = [addressInfo.fullName, addressInfo.phone, addressInfo.address, validPhone].every(Boolean);

    //Submit checkout
    const handleSubmit = async (e) => {
        e.preventDefault();

        const valid = PHONE_REGEX.test(phone);

        if (!valid && addressInfo.phone) {
            setErrMsg("Sai định dạng số điện thoại!");
            errRef.current.focus();
            return;
        } else if (!addressInfo.fullName || !addressInfo.phone || !fullAddress) {
            setErrMsg("Vui lòng nhập địa chỉ giao hàng!");
            errRef.current.focus();
            return;
        }
        setPending(true);

        try {
            let fullNameSplit = addressInfo.fullName.split(' ');
            let lastName = fullNameSplit[fullNameSplit.length - 1];
            let firstName = '';
            if (fullNameSplit.length > 2) firstName = fullNameSplit.slice(0, -1).join(' ');

            const response = await axiosPrivate.post(CHECKOUT_URL,
                JSON.stringify({
                    cart: products,
                    firstName,
                    lastName,
                    phone: addressInfo.phone,
                    address: fullAddress,
                    message: message
                }),
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
            console.error(err);
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
    //#endregion

    if (products.length) {
        return (
            <Wrapper>
                {pending ?
                    <Suspense fallBack={<></>}>
                        <PendingIndicator />
                    </Suspense>
                    : null
                }
                <CustomBreadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
                    <NavLink to={`/cart`}>
                        Giỏ hàng
                    </NavLink>
                    <strong style={{ textDecoration: 'underline' }}>Thanh toán</strong>
                </CustomBreadcrumbs>
                <CheckoutContainer>
                    <Title><Person />&nbsp;XÁC NHẬN ĐẶT HÀNG</Title>
                    <StyledStepper activeStep={activeStep} orientation="vertical" connector={null}>
                        <Step key={0} expanded>
                            <StyledStepLabel ref={errRef}
                                error={errMsg}
                                optional={
                                    errMsg && (
                                        <Typography variant="caption" color="error">
                                            {errMsg}
                                        </Typography>
                                    )}>
                                <SemiTitle><LocationOnIcon />&nbsp;Địa chỉ người nhận</SemiTitle>
                            </StyledStepLabel>
                            <StyledStepContent>
                                <SmallContainer className={`${validAddressInfo ? '' : 'error'}`}>
                                    <AddressComponent {...{ addressInfo, setAddressInfo, fullAddress, errMsg, err, validPhone }} />
                                </SmallContainer>
                            </StyledStepContent>
                        </Step>
                        <Step key={1} expanded>
                            <StyledStepLabel>
                                <SemiTitle><ShoppingCartIcon />&nbsp;Kiểm tra lại sản phẩm</SemiTitle>
                            </StyledStepLabel>
                            <StyledStepContent>
                                <TableContainer>
                                    <Table aria-label="checkout-table">
                                        <TableHead
                                            sx={{
                                                backgroundColor: 'secondary.main',
                                                display: { xs: 'none', sm: 'table-header-group' }
                                            }}
                                        >
                                            <TableRow sx={{ padding: 0, border: '.5px solid lightgray', backgroundColor: 'secondary.main' }}>
                                                <StyledTableCell sx={{ height: '42px' }}>Sản phẩm ({products?.length ?? 0})</StyledTableCell>
                                                <StyledTableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Đơn giá</StyledTableCell>
                                                <StyledTableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Số lượng</StyledTableCell>
                                                <StyledTableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Tổng</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {products.map((product, index) => {
                                                return (
                                                    <StyledTableRow hover key={product.id}>
                                                        <StyledTableCell>
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
                                                                        <Box width={'100%'} display={{ xs: 'flex', md: 'none' }} justifyContent={'space-between'}>
                                                                            <Box display={{ xs: 'block', md: 'none' }}>
                                                                                <Price>{product.price.toLocaleString()}đ</Price>
                                                                                <Box display={'flex'} alignItems={'center'} sx={{ fontWeight: 'bold' }}>
                                                                                    Tổng: &nbsp;&nbsp;<Price className="total">{(product.price * product.quantity).toLocaleString()}đ</Price>
                                                                                </Box>
                                                                            </Box>
                                                                            <Amount className="alt">{`x${product.quantity}`}</Amount>
                                                                        </Box>
                                                                    </ItemAction>
                                                                </ItemSummary>
                                                            </ItemContainer>
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                                            <Price>{product.price.toLocaleString()}đ</Price>
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                                            <Amount>{`x${product.quantity}`}</Amount>
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                                            <Price>{(product.price * product.quantity).toLocaleString()}đ</Price>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Box sx={{ marginTop: '20px', marginLeft: '10px' }}>
                                    <strong style={{ fontSize: '16px' }}>Ghi chú khi giao hàng: </strong>
                                </Box>
                                <TextareaAutosize
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    aria-label="note"
                                    minRows={7}
                                    placeholder="Nhập ghi chú cho đơn hàng ..."
                                    style={{
                                        width: '100%', margin: '10px 0px', backgroundColor: 'white', outline: 'none',
                                        borderRadius: '0', resize: 'none', color: 'black', fontSize: '16px'
                                    }}
                                />
                                {
                                    activeStep < 2
                                    &&
                                    <CustomButton
                                        disabled={!(activeStep === 1)}
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleNext}
                                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                                    >
                                        Tiếp tục<KeyboardDoubleArrowDown />
                                    </CustomButton>
                                }
                            </StyledStepContent>
                        </Step>
                        <Step key={2}>
                            <StyledStepLabel>
                                <MiniTitle><CreditCardIcon />&nbsp;Thanh toán</MiniTitle>
                            </StyledStepLabel>
                            <StyledStepContent TransitionProps={{ unmountOnExit: false }}>
                                <FinalCheckoutDialog {...{ MiniTitle, SmallContainer, Title, value, handleChange, products, handleSubmit, validAddressInfo }} />
                            </StyledStepContent>
                        </Step>
                    </StyledStepper>
                </CheckoutContainer>
            </Wrapper>
        )
    } else {
        return (<Navigate to={'/cart'} />)
    }
}

export default Checkout