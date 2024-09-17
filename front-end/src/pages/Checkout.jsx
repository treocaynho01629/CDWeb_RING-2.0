import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';
import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { ShoppingCart as ShoppingCartIcon, LocationOn as LocationOnIcon, CreditCard as CreditCardIcon, KeyboardDoubleArrowDown, Person } from '@mui/icons-material';
import { TextareaAutosize, Button, Table, TableBody, TableContainer, TableHead, TableRow, Stepper, Step, StepLabel, StepContent, Typography, Box, Skeleton, } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useGetProfileQuery } from '../features/users/usersApiSlice';
import { useCheckoutMutation } from '../features/orders/ordersApiSlice';
import { PHONE_REGEX } from '../ultils/regex';
import CustomBreadcrumbs from '../components/custom/CustomBreadcrumbs';
import AddressDisplay from '../components/address/AddressDisplay';
import AddressSelectDialog from '../components/address/AddressSelectDialog';
import useCart from '../hooks/useCart';
import useTitle from '../hooks/useTitle';

const PendingIndicator = lazy(() => import('../components/layout/PendingIndicator'));
const FinalCheckoutDialog = lazy(() => import('../components/cart/FinalCheckoutDialog'));

//#region styled
const Wrapper = styled.div`
`

const AltCheckoutContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    z-index: 99;
    background-color: white;
    box-shadow: 3px 3px 10px 3px #b7b7b7;
    align-items: flex-end;
    justify-content: flex-end;
    display: none;

    ${props => props.theme.breakpoints.down("sm")} {
        display: flex;
    }
`

const PayButton = styled.button`
    background-color: ${props => props.theme.palette.primary.main};
    padding: 15px 20px;
    margin-top: 20px;
    font-size: 15px;
    font-weight: bold;
    width: 100%;
    height: 50px;
    font-weight: 500;
    border-radius: 0;
    border: none;
    flex-wrap: wrap;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    transition: all 0.5s ease;

    ${props => props.theme.breakpoints.down("sm")} {
        width: 40%;
    }

    &:hover {
        background-color: ${props => props.theme.palette.action.hover};
        color: black;
    }

    &:disabled {
        background-color: gray;
        color: darkslategray;
    }

    &:focus {
        outline: none;
        border: none;
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
    color: ${props => props.theme.palette.primary.main};
    margin: 0;
 
    &.total {
        color: ${props => props.theme.palette.error.main};
        
        ${props => props.theme.breakpoints.down("md")} {
            font-size: 18px;
            text-align: end;
        }
    }
`

const Amount = styled.p`
    font-size: 16px;
    font-weight: 450;
    margin: 0;
    text-align: center;

    &.alt {
        display: none;
        
        ${props => props.theme.breakpoints.down("sm")} {
            display: block;
            margin: 10px 0 0 10px;
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
        color: theme.palette.primary.main,
    },
    '& .MuiStepLabel-root .Mui-active': {
        color: theme.palette.primary.main,
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
//#endregion

const Checkout = () => {
    //#region construct
    //Products from state
    const { state: checkState } = useLocation();
    const { clearCart } = useCart();
    const products = checkState?.products;
    const checkRef = useRef(null);
    const [addressInfo, setAddressInfo] = useState({
        name: '',
        phone: '',
        address: ''
    })
    const [validPhone, setValidPhone] = useState(false);
    const [message, setMessage] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [err, setErr] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [value, setValue] = useState("1");
    const [openDialog, setOpenDialog] = useState(false);
    const [pending, setPending] = useState(false);
    const maxSteps = 3;

    //Checkout hook
    const [checkout, { isLoading }] = useCheckoutMutation();

    //Fetch current profile address
    const { data: profile, isLoading: loadProfile, isSuccess: profileDone } = useGetProfileQuery();

    //Other
    const navigate = useNavigate();
    const errRef = useRef();

    useEffect(() => { //Check phone number
        const result = PHONE_REGEX.test(addressInfo.phone);
        setValidPhone(result);
    }, [addressInfo.phone])

    //Set title
    useTitle('Thanh toán');

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if (activeStep == 1) checkRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleChange = (e) => { setValue(e.target.value) }
    const handleOpenDialog = () => { setOpenDialog(true) }
    const handleCloseDialog = () => { setOpenDialog(false) }

    const validAddressInfo = [addressInfo.name, addressInfo.phone, addressInfo.address, validPhone].every(Boolean);

    //Submit checkout
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading || pending) return;
        setPending(true);

        //Validation
        const valid = PHONE_REGEX.test(addressInfo.phone);

        if (!valid && addressInfo.phone) {
            setErrMsg("Sai định dạng số điện thoại!");
            errRef.current.focus();
            return;
        } else if (!addressInfo.name || !addressInfo.phone || !addressInfo.address) {
            setErrMsg("Vui lòng nhập địa chỉ giao hàng!");
            errRef.current.focus();
            return;
        }

        const { enqueueSnackbar } = await import('notistack');

        checkout({
            cart: products,
            name: addressInfo.name,
            phone: addressInfo.phone,
            address: addressInfo.address,
            message: message
        }).unwrap()
            .then((data) => {
                clearCart();
                enqueueSnackbar('Đặt hàng thành công!', { variant: 'success' });
                navigate('/cart');
                setPending(false);
            })
            .catch((err) => {
                console.error(err);
                setErr(err);
                if (!err?.status) {
                    setErrMsg('Server không phản hồi!');
                } else if (err?.status === 409) {
                    setErrMsg(err?.data?.errors?.errorMessage);
                } else if (err?.status === 400) {
                    setErrMsg('Sai định dạng thông tin!');
                } else {
                    setErrMsg('Đặt hàng thất bại!')
                }
                errRef.current.focus();
                setPending(false);
            })
    }
    //#endregion

    if (products?.length) {
        return (
            <Wrapper>
                {(isLoading || pending) ?
                    <Suspense fallBack={<></>}>
                        <PendingIndicator open={(isLoading || pending)} message="Đang xử lý đơn hàng..." />
                    </Suspense>
                    : null
                }
                <CustomBreadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
                    <NavLink to={`/cart`}>Giỏ hàng</NavLink>
                    <strong style={{ textDecoration: 'underline' }}>Thanh toán</strong>
                </CustomBreadcrumbs>
                <CheckoutContainer>
                    <Title><Person />&nbsp;XÁC NHẬN ĐẶT HÀNG</Title>
                    <StyledStepper activeStep={activeStep} orientation="vertical" connector={null}>
                        <Step key={0} expanded>
                            <StyledStepLabel ref={errRef}
                                error={errMsg !== ''}
                                optional={
                                    errMsg && (
                                        <Typography variant="caption" color="error">
                                            {errMsg}
                                        </Typography>
                                    )}>
                                <SemiTitle><LocationOnIcon />&nbsp;Địa chỉ người nhận</SemiTitle>
                            </StyledStepLabel>
                            <StyledStepContent>
                                <AddressDisplay {...{ addressInfo, isValid: validAddressInfo, handleOpen: handleOpenDialog, loadProfile }} />
                                <AddressSelectDialog {...{ profile, pending, setPending, setAddressInfo, openDialog, handleCloseDialog }} />
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
                                                backgroundColor: 'primary.main',
                                                display: { xs: 'none', sm: 'table-header-group' }
                                            }}
                                        >
                                            <TableRow sx={{ padding: 0, border: '.5px solid', borderColor: 'action.focus', backgroundColor: 'primary.main' }}>
                                                <StyledTableCell sx={{ height: '53px' }}>Sản phẩm ({products?.length ?? 0})</StyledTableCell>
                                                <StyledTableCell align="left" sx={{ width: '100px', display: { xs: 'none', md: 'table-cell' } }}>Đơn giá</StyledTableCell>
                                                <StyledTableCell align="center" sx={{ width: '90px', display: { xs: 'none', sm: 'table-cell' } }}>Số lượng</StyledTableCell>
                                                <StyledTableCell align="center" sx={{ width: '130px', display: { xs: 'none', md: 'table-cell' } }}>Tổng</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {products.map((product, index) => {
                                                return (
                                                    <StyledTableRow hover key={product.id}>
                                                        <StyledTableCell>
                                                            <ItemContainer>
                                                                <NavLink to={`/product/${product.id}`}>
                                                                    <StyledLazyImage
                                                                        src={`${product.image}?size=small`}
                                                                        alt={`${product.title} Checkout item`}
                                                                        placeholder={<StyledSkeleton variant="rectangular" animation={false} />}
                                                                    />
                                                                </NavLink>
                                                                <ItemSummary>
                                                                    <NavLink to={`/product/${product.id}`}>
                                                                        <ItemTitle>{product.title}</ItemTitle>
                                                                    </NavLink>
                                                                    <ItemAction>
                                                                        <Box width={'100%'} display={{ xs: 'flex', md: 'none' }} justifyContent={'space-between'}>
                                                                            <Box>
                                                                                <Price>{Math.round(product.price * (1 - (product?.onSale || 0))).toLocaleString()}đ</Price>
                                                                                <Box display="flex" alignItems="center" sx={{ fontWeight: 'bold' }}>
                                                                                    Tổng: &nbsp;&nbsp;
                                                                                    <Price className="total">{(Math.round(product.price * (1 - (product?.onSale || 0))) * product.quantity).toLocaleString()}đ</Price>
                                                                                </Box>
                                                                            </Box>
                                                                            <Amount className="alt">{`x${product.quantity}`}</Amount>
                                                                        </Box>
                                                                    </ItemAction>
                                                                </ItemSummary>
                                                            </ItemContainer>
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                                            <Price>{Math.round(product.price * (1 - (product?.onSale || 0))).toLocaleString()}đ</Price>
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                                            <Amount>{`x${product.quantity}`}</Amount>
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                                            <Price className="total">{(Math.round(product.price * (1 - (product?.onSale || 0))) * product.quantity).toLocaleString()}đ</Price>
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
                                    <Button
                                        disabled={!validAddressInfo}
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                                        endIcon={<KeyboardDoubleArrowDown />}
                                    >
                                        Tiếp tục
                                    </Button>
                                }
                            </StyledStepContent>
                        </Step>
                        <Step key={2} ref={checkRef}>
                            <StyledStepLabel>
                                <MiniTitle><CreditCardIcon />&nbsp;Thanh toán</MiniTitle>
                            </StyledStepLabel>
                            <StyledStepContent>
                                {activeStep == 2 &&
                                    <Suspense fallBack={<></>}>
                                        <FinalCheckoutDialog {...{
                                            MiniTitle, Title, value, handleChange,
                                            products, handleSubmit, validAddressInfo, AltCheckoutContainer, PayButton
                                        }} />
                                    </Suspense>
                                }
                            </StyledStepContent>
                        </Step>
                    </StyledStepper>
                </CheckoutContainer>
                {
                    activeStep < 2
                    &&
                    <AltCheckoutContainer>
                        <Box sx={{ padding: '0px 5px' }}>
                            <strong>Kiểm tra đơn:</strong>
                            <Price className="total">{`${activeStep + 1}/${maxSteps}`}</Price>
                        </Box>
                        <PayButton disabled={!validAddressInfo} onClick={handleNext}>
                            Tiếp tục<KeyboardDoubleArrowDown />
                        </PayButton>
                    </AltCheckoutContainer>
                }
            </Wrapper>
        )
    } else {
        return (<Navigate to={'/cart'} />)
    }
}

export default Checkout