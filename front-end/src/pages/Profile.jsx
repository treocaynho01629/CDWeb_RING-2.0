import { useState, useEffect, lazy, Suspense} from 'react'

import styled from "styled-components"
import { styled as muiStyled } from '@mui/material/styles';

import { Grid, TextField, List, ListItemButton, Collapse, Divider, Avatar, Table, TableBody, 
TableContainer, Dialog, DialogTitle, DialogContent, DialogActions, TableCell, TableRow, Paper, 
Stack, FormControl, Radio, RadioGroup, FormControlLabel, Box, InputAdornment, IconButton} from '@mui/material';
import { ExpandLess, ExpandMore, Edit as EditIcon, Person as PersonIcon, Receipt as ReceiptIcon, 
Try as TryIcon, Check as CheckIcon, Close as CloseIcon, AccessTime as AccessTimeIcon, CalendarMonth as CalendarMonthIcon,
Star as StarIcon, VisibilityOff, Visibility} from '@mui/icons-material';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import AppPagination from "../components/custom/AppPagination"

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch } from "react-redux"
import dayjs from 'dayjs';
import usePrivateFetch from '../hooks/usePrivateFetch'
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const PendingIndicator = lazy(() => import('../components/authorize/PendingIndicator'));

//#region styled
const Wrapper = styled.div`
`

const CustomDialog = muiStyled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      borderRadius: 0,
      width: '90%',
    },
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

const CustomLinearProgress = muiStyled(LinearProgress)(({ theme }) => ({
    borderRadius: 0,
    marginBottom: '400px',
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: 'white',
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 0,
        backgroundColor: '#63e399',
    },
}));

const ContentContainer = styled.div`
    padding: 0px 15px;
    border: 0.5px solid lightgray;
`

const ListContainer = styled.div`
    width: 100%;
`

const InfoText = styled.h4`
    margin: 15px 0px;
`

const InfoStack = styled.div`
    height: 56px;
    display: flex;
    align-items: center;
`

const ChangeText = styled.p`
    display: flex;
    justify-content: center;
    font-weight: 500;
    margin: 0 0;
    font-size: 15px;
    cursor: pointer;
`

const ItemText = styled.h3`
    font-size: 16px;
    margin: 5px 0px;
    color: inherit;
    display: flex;
    align-items: center;
`

const MiniProfile = styled.div`
`

const listStyle = {
    py: '5px', 
    justifyContent: 'space-between',

    '&:hover': {
        color: '#63e399',
        backgroundColor: 'white'
    },

    '&.Mui-selected': {
    color: '#63e399',
    backgroundColor: 'white'
    },
}

const Instruction = styled.p`
    font-size: 14px;
    font-style: italic;
    color: red;
    display: ${props=>props.display};;
`

const Title = styled.h3`
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    border-bottom: 0.5px solid #63e399;
    padding-bottom: 15px;
    color: #63e399;
`

const Button = styled.button`
  background-color: #63e399;
  padding: 10px 20px;;
  font-size: 16px;
  font-weight: 500;
  border-radius: 0;
  border: none;
  transition: all 0.5s ease;
  display: flex;
  align-items: center;

  &:hover {
      background-color: lightgray;
      color: black;
  };

  &:focus {
      outline: none;
      border: none;
      border: 0;
  };

  outline: none;
  border: 0;
`

const ItemTitle = styled.p`
    font-size: 14px;
    font-weight: 500;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
    margin: 0;
	
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
    margin: 0 0;
`

const StatusTag = styled.p`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0;
    font-weight: bold;
    font-size: 16px;
    color: #63e399;
`

const Discount = styled.p`
    font-size: 12px;
    color: gray;
    margin: 0;
    text-decoration: line-through;
`

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

const CustomDatePicker = styled(DatePicker)({
    '& .MuiInputBase-root': {
      borderRadius: 0,
      width: '80%',
    },
    '& label.Mui-focused': {
      color: '#A0AAB4'
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
});

const Profiler = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0px 10px;
    background-color: #f7f7f7;
    border-bottom: 0.5px solid #63e399;
`

const RatingInfo = styled.p`
    font-size: 14px;
    margin-right: 10px;
    font-weight: 400;
    padding: 0;
    display: flex;
    align-items: center;
    text-transform: uppercase;
`
//#endregion

const PHONE_REGEX = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
const RECEIPTS_URL = "/api/orders/user?pSize=5";
const REVIEWS_URL = "/api/reviews/user";
const PROFILE_URL = "/api/accounts/profile";
const CHANGE_PASS_URL = "/api/accounts/change-password";
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%:]).{8,24}$/;

const ReceiptsTable = () => {
    const [count, setCount] = useState(1);
    const [receipts, setReceipts] = useState([]);
    const { loading: loadingReceipts, data: dataReceipts } = usePrivateFetch(RECEIPTS_URL + "&pageNo=" + 0);
    const { loading: loadingMore, data: more } = usePrivateFetch(RECEIPTS_URL + "&pageNo=" + count);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAddToCart = async (detail) => {
        const { addToCart } = await import('../redux/cartReducer');
        const { enqueueSnackbar } = await import('notistack');

        enqueueSnackbar('Đã thêm sản phẩm vào giỏ hàng!', { variant: 'success' });
        dispatch(addToCart({
            id: detail.bookId,
            title: detail.bookTitle,
            price: detail.price,
            image: detail.image,
            quantity: 1,
        }))
    };

    //Load
    useEffect(()=>{
        if (!loadingReceipts){
            setReceipts(current => [...current, ...dataReceipts?.content]);
        }
    }, [loadingReceipts]);

    const handleShowMoreReceipts = async () => {
        if (!loadingMore && more){
            setReceipts(current => [...current, ...more?.content]);
          setCount(prev => prev + 1);
        }
    }

    if (loadingReceipts){
        return (<CustomLinearProgress/>)
    }

    return (
        <>
        { dataReceipts?.totalElements == 0 ?
        <Box sx={{height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <h3>Bạn chưa mua sản phẩm nào</h3>
        </Box>
        :
        <div>
            <TableContainer component={Paper} sx={{borderRadius: '0%'}} >
                <Table sx={{ minWidth: 500, borderRadius: '0%'}} aria-label="cart-table">
                    <TableBody>
                    { receipts?.map((receipt) => {
                        return (
                            receipt?.orderDetails?.map((detail, index) => {
                                return (
                                    <>
                                    <TableRow key={detail.id + "a" + index} sx={{backgroundColor: '#f7f7f7'}}>
                                        <TableCell colSpan={1}><ItemTitle>Giao tới: {receipt.address}</ItemTitle></TableCell>
                                        <TableCell align="right"><StatusTag><CheckIcon/>ĐÃ GIAO</StatusTag></TableCell>
                                    </TableRow>
                                    <TableRow key={detail.id + "b" + index}>
                                        <TableCell>
                                            <div style={{display: 'flex'}}>
                                                <Link to={`/product/${detail.bookId}`} style={{color: 'inherit'}}>
                                                    <div style={{display: 'flex'}}>
                                                        <LazyLoadImage src={detail.image}
                                                            height={90}
                                                            width={90} 
                                                            style={{
                                                                border: '0.5px solid lightgray',
                                                                objectFit: 'contain'
                                                            }}
                                                        /> 
                                                        <div style={{marginLeft: '20px', marginTop: '10px'}}>
                                                            <ItemTitle>{detail.bookTitle}</ItemTitle>
                                                            <p>Số lượng: {detail.amount}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Price>{detail.price.toLocaleString()} đ</Price>
                                            <Discount>{Math.round(detail.price * 1.1).toLocaleString()} đ</Discount>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow key={detail.id + "c" + index}>
                                        <TableCell colSpan={1} sx={{cursor: 'pointer'}} onClick={() => navigate(`/product/${detail.bookId}`)}>Đánh giá sản phẩm?</TableCell>
                                        <TableCell align="right">
                                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '10px'}}>
                                                <b style={{margin: 0}}>Tổng:</b>
                                                <Price>&nbsp;&nbsp;{(detail.price * detail.amount).toLocaleString()} đ</Price>
                                            </div>
                                            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                                <Button onClick={() => handleAddToCart(detail)} style={{marginRight: 0}}>MUA LẠI</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <br/>
                                    </>
                                )
                            })
                        )
                    })}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{display: more?.last ? 'none' : 'flex', 
            justifyContent: 'center', 
            margin: '20px 0px'}}>
                <Button onClick={handleShowMoreReceipts}>Xem thêm</Button>
            </div>
        </div>
        }
      </>
    )
}

const ReviewTable = () => {
    const [pagination, setPagination] = useState({
        currPage: 0,
        pageSize: 8,
        totalPages: 0
    })
    const { loading: loadingReviews, data: reviews } = usePrivateFetch(REVIEWS_URL 
        + "?pSize=" + pagination.pageSize
        + "&pageNo=" + pagination.currPage);

    useEffect(() => {
        if (!loadingReviews){
            setPagination({ ...pagination, totalPages: reviews?.totalPages});
            if (pagination?.currPage > pagination?.pageSize) handlePageChange(1);
        }
    }, [loadingReviews])

    const handleChangeSize = (newValue) => {
        handlePageChange(1);
        setPagination({...pagination, pageSize: newValue});
    };

    const handlePageChange = (page) => {
        setPagination({...pagination, currPage: page - 1});
    };

    if (loadingReviews){
        return (<CustomLinearProgress/>)
    }

    return (
        <>
        { reviews?.totalElements == 0 ?
        <Box sx={{height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <h3>Bạn chưa có đánh giá nào</h3>
        </Box>
        :
        <Box>
            {reviews?.content?.map((review, index) => (
                <Grid key={review.id + ":" + index}>
                    <Review review={review}/>
                </Grid>
            ))}
            <AppPagination pagination={pagination}
            onPageChange={handlePageChange}
            onSizeChange={handleChangeSize}/>
        </Box>
        }
        </>
    )
}

const Review = ({review}) => {
    const date = new Date(review.date)
    const navigate = useNavigate();

    return (
      <div>
        <Profiler>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box display={{xs: 'none', md: 'flex'}}>
              <RatingInfo><Avatar sx={{width: '20px', height: '20px', marginRight: '5px'}}>A</Avatar>{review.userName}</RatingInfo>
              <RatingInfo><AccessTimeIcon sx={{fontSize: 18, marginRight: '5px', color: '#63e399'}}/>{date.getHours() + ":" + date.getMinutes()}</RatingInfo>
            </Box>
              <RatingInfo><CalendarMonthIcon sx={{fontSize: 18, marginRight: '5px', color: '#63e399'}}/>{date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()}</RatingInfo>
          </Box>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <RatingInfo style={{marginRight: '20px', fontWeight: 'bold', cursor: 'pointer'}} 
                onClick={() => navigate(`/product/${review.bookId}`)}>
                Đi đến sản phẩm
              </RatingInfo>
            <RatingInfo><StarIcon sx={{fontSize: 18, marginRight: '5px', color: '#63e399'}}/>{review.rating}</RatingInfo>
          </Box>
        </Profiler>
        <Box sx={{margin: '20px 0px 50px'}}>{review.content}</Box>
      </div>
    )
}

const Profile = () => {
    //#region construct
    const [pending, setPending] = useState(false);
    const {tab} = useParams();
    const [open, setOpen] = useState(false);
    const [err, setErr] = useState([]);
    const [errMsg, setErrMsg] = useState([]);
    const [name, setName] = useState('');
    const [validPhone, setValidPhone] = useState(false);
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState(dayjs('2000-01-01'));

    const [openDialog, setOpenDialog] = useState(false);
    const [errr, setErrr] = useState([]);
    const [otherErrMsg, setOtherErrMsg] = useState('');
    const [pass, setPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [newPassRe, setNewPassRe] = useState('');
    const [show, setShow] = useState(false);
    const [validNewPass, setValidNewPass] = useState(true);
    const [validNewPassRe, setValidNewPassRe] = useState(true);
    const [newPassFocus, setNewPassFocus] = useState(false);
    
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { loading, data, refetch } = usePrivateFetch(PROFILE_URL);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `RING! - Hồ sơ`;
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [tab])

    useEffect(() => {
        const result = PWD_REGEX.test(newPass);
        setValidNewPass(result);
        const match = newPass === newPassRe;
        setValidNewPassRe(match);
    }, [newPass, newPassRe])

    useEffect(() => {
        setErrMsg('');
    }, [newPass, newPassRe, pass])

    useEffect(() => {
        if (!loading){
            setName(data?.name);
            setPhone(data?.phone);
            setAddress(data?.address);
            setGender(data?.gender);
            setDob(dayjs(data?.dob));
        }
    }, [loading])

    useEffect(() => {
        const result = PHONE_REGEX.test(phone);
        setValidPhone(result);
    }, [phone])

    const handleOpen = () => {
        setOpen(prevState => !prevState);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true)
        navigate('/profile/detail');
    };
    const handleCloseDialog = () => setOpenDialog(false);

    const handleClickShowPassword = () => setShow((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChangeInfo = async (e) => {
        e.preventDefault();

        const valid = PHONE_REGEX.test(phone);

        if (!valid && phone) {
            return;
        }

        try {
            const response = await axiosPrivate.put(PROFILE_URL,
                JSON.stringify({
                    name: name,
                    phone: phone,
                    gender: gender,
                    address: address,
                    dob: dob.format('YYYY-MM-DD')
                } ),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            setErr([]);
            const { enqueueSnackbar } = await import('notistack');
            enqueueSnackbar('Sửa thông tin thành công!', { variant: 'success' });
            refetch();
        } catch (err) {
            console.log(err);
            setErr(err);
            if (!err?.response) {
            } else if (err.response?.status === 409) {
            } else if (err.response?.status === 400) {
            } else {
            }
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();

       const v1 = PWD_REGEX.test(newPass);

       if (!v1) {
           setOtherErrMsg("Sai định dạng thông tin!");
           return;
       }

       if (!newPass || !newPassRe){
           setOtherErrMsg("Không được bỏ trống mật khẩu mới!");
           setValidNewPass(false);
           setValidNewPassRe(false);
           return;
       }

       if (newPass !== newPassRe){
           setOtherErrMsg("Không trùng mật khẩu!");
           setValidNewPass(false);
           setValidNewPassRe(false);
           return;
       }

       setPending(true);
       setOpenDialog(false);

        try {
            const response = await axiosPrivate.put(CHANGE_PASS_URL,
                JSON.stringify({
                    pass: pass,
                    newPass: newPass,
                    newPassRe: newPassRe
                } ),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            setErrr([]);
            setOtherErrMsg("");
            setPass("");
            setNewPass("");
            setNewPassRe("");
            setValidNewPass(true);
            setValidNewPassRe(true);
            const { enqueueSnackbar } = await import('notistack');
            enqueueSnackbar('Đổi mật khẩu thành công!', { variant: 'success' });
            refetch();
            setPending(false);
            setOpenDialog(true);
        } catch (err) {
            console.log(err);
            setErrr(err);
            if (!err?.response) {
                setOtherErrMsg("Server không phản hồi!");
            } else if (err.response?.status === 409) {
                setOtherErrMsg(err.response?.data?.errors?.errorMessage);
            } else if (err.response?.status === 400) {
            } else {
                setOtherErrMsg("Đổi mật khẩu thất bại!");
            }
            setPending(false);
            setOpenDialog(true);
        }
    }

    const endAdornment=
    <InputAdornment position="end">
        <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
        >
            {show ? <VisibilityOff /> : <Visibility />}
        </IconButton>
    </InputAdornment>
    //#endregion

  return (
    <Wrapper>
        {pending ?
        <Suspense fallBack={<></>}>
            <PendingIndicator/>
        </Suspense>
        : null
        }
        <Grid container spacing={2}>
            <Grid item xs={12} md={3.5} lg={3} sx={{display: 'flex', justifyContent: 'center'}}>
                <ListContainer>
                    <MiniProfile>
                        <Grid container spacing={1}>
                            <Grid item xs={6} md={12} sx={{display: 'flex', alignItems: 'center'}}>
                                <Avatar sx={{ width: 50, height: 50, marginRight: 2}}/><h3>{data?.userName}</h3>
                            </Grid>
                            <Grid item xs={6} md={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <ChangeText onClick={() => navigate('/profile/detail')}><EditIcon/>Sửa hồ sơ</ChangeText>
                            </Grid>
                        </Grid>
                    </MiniProfile>
                    <Divider sx={{margin: '20px 0px'}}/>
                    <List
                    sx={{ width: '100%', py: 0}}
                    component="nav"
                    >
                        <ListItemButton sx={listStyle} selected={false} onClick={() => handleOpen()}>
                            <ItemText><PersonIcon/>&nbsp;Tài khoản của tôi</ItemText>
                            {open ? <ExpandLess/> 
                                : <ExpandMore/>}
                        </ListItemButton>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 8 , py: 0, color: 'gray'}} onClick={() => navigate('/profile/detail')}>
                                <ItemText>Hồ sơ</ItemText>
                                </ListItemButton>
                            </List>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 8 , py: 0, color: 'gray'}} onClick={handleOpenDialog}>
                                <ItemText>Đổi mật khẩu</ItemText>
                                </ListItemButton>
                            </List>
                        </Collapse>

                        <ListItemButton sx={listStyle} selected={false} onClick={() => navigate('/profile/receipts')}>
                            <ItemText><ReceiptIcon/>&nbsp;Đơn hàng</ItemText>
                        </ListItemButton>
                        <ListItemButton sx={listStyle} selected={false} onClick={() => navigate('/profile/reviews')}>
                            <ItemText><TryIcon/>&nbsp;Đánh giá</ItemText>
                        </ListItemButton>
                    </List>
                </ListContainer>
            </Grid>
            <Grid item xs={12} md={8.5} lg={9}>
                <TabContext value={tab}>
                    <TabPanel value="detail">
                    <ContentContainer>
                        <Title><PersonIcon/>&nbsp;HỒ SƠ CỦA BẠN</Title>
                        {loading ? 
                        <CustomLinearProgress/>
                        :    
                        <Box sx={{paddingBottom: '100px'}}>
                            <Grid container spacing={2}>
                                <Grid item xs={4} lg={3}>
                                    <Stack spacing={0}>
                                        <InfoStack><InfoText>Tên đăng nhập: </InfoText></InfoStack>
                                        <InfoStack><InfoText>Email: </InfoText></InfoStack>
                                        <InfoStack><InfoText>Tên: </InfoText></InfoStack>
                                        <InfoStack><InfoText>Số điện thoại: </InfoText></InfoStack>
                                        <InfoStack><InfoText>Ngày sinh: </InfoText></InfoStack>
                                        <InfoStack><InfoText>Địa chỉ: </InfoText></InfoStack>
                                        <InfoStack><InfoText>Giới tính: </InfoText></InfoStack>
                                    </Stack>
                                </Grid>
                                <Grid item xs={8} lg={6}>
                                    <Stack spacing={0}>
                                        <InfoStack><InfoText>{data?.userName} </InfoText></InfoStack>
                                        <InfoStack><InfoText>{data?.email} </InfoText></InfoStack>
                                        <InfoStack>
                                            <CustomInput
                                            type="text"
                                            id="name"
                                            onChange={(e) => setName(e.target.value)}
                                            value={name}
                                            error = {err?.response?.data?.errors?.firstName}
                                            helperText= {err?.response?.data?.errors?.firstName}
                                            size="small"
                                            sx={{width: '80%'}}
                                            />
                                        </InfoStack>
                                        <InfoStack>
                                            <CustomInput
                                            id="phone"
                                            onChange={(e) => setPhone(e.target.value)}
                                            value={phone}
                                            error={(phone && !validPhone) || err?.response?.data?.errors?.phone}
                                            helperText={(phone && !validPhone) ? "Sai định dạng số điện thoại!" : err?.response?.data?.errors?.phone}
                                            size="small"
                                            sx={{width: '80%'}}
                                            />
                                        </InfoStack>
                                        <InfoStack>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <FormControl margin="dense" fullWidth>
                                                <CustomDatePicker
                                                value={dob}
                                                className="DatePicker"
                                                onChange={(newValue) => setDob(newValue)}
                                                size="small"
                                                slotProps={{
                                                    textField: {
                                                    size: "small",
                                                    error: err?.response?.data?.errors?.dob,
                                                    helperText: err?.response?.data?.errors?.dob,
                                                    },
                                                }}
                                                />
                                            </FormControl>
                                            </LocalizationProvider>
                                        </InfoStack>
                                        <InfoStack>
                                            <CustomInput
                                            type="text"
                                            id="address"
                                            onChange={(e) => setAddress(e.target.value)}
                                            value={address}
                                            error = {err?.response?.data?.errors?.address}
                                            helperText= {err?.response?.data?.errors?.address}
                                            size="small"
                                            sx={{width: '80%'}}
                                            />
                                        </InfoStack>
                                        <InfoStack>
                                            <RadioGroup spacing={1} row value={gender} onChange={(e) => setGender(e.target.value)}>
                                                <FormControlLabel value="Nam" control={<Radio  sx={{
                                                    '&.Mui-checked': {
                                                    color: '#63e399',
                                                }}}/>} 
                                                label="Nam"/>
                                                <FormControlLabel value="Nữ" control={<Radio  sx={{
                                                    '&.Mui-checked': {
                                                    color: '#63e399',
                                                }}}/>} 
                                                label="Nữ"/>
                                                <FormControlLabel value="" control={<Radio  sx={{
                                                    '&.Mui-checked': {
                                                    color: '#63e399',
                                                }}}/>} 
                                                label="Không"/>
                                            </RadioGroup>
                                        </InfoStack>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} lg={3} display={{xs: 'none', lg: 'flex'}} sx={{justifyContent: 'center'}}>
                                    <Avatar sx={{height: 150, width: 150}}/>
                                </Grid>
                            </Grid>
                            <InfoStack><Button onClick={handleChangeInfo}>Lưu thông tin</Button></InfoStack>
                        </Box>
                        }
                    </ContentContainer>
                    <CustomDialog open={openDialog} 
                    scroll="body"
                    onClose={handleCloseDialog}>
                        <DialogTitle sx={{display: 'flex', alignItems: 'center', marginTop: '10px'}}>Thay đổi mật khẩu</DialogTitle>
                        <DialogContent sx={{marginTop: 0, marginX: '10px'}}>
                            <Stack spacing={2} direction="column">
                                <Instruction display={otherErrMsg ? "block" : "none"} aria-live="assertive">{otherErrMsg}</Instruction>
                                <CustomInput label='Nhập mật khẩu hiện tại' 
                                    type={show ? 'text' : 'password'}
                                    onChange={(e) => setPass(e.target.value)}
                                    value={pass}
                                    error = {errr?.response?.data?.errors?.password}
                                    helperText= {errr?.response?.data?.errors?.password}
                                    size="small"
                                    InputProps={{
                                        endAdornment: endAdornment
                                    }}
                                />
                                <CustomInput label='Nhập mật khẩu mới' 
                                    type={show ? 'text' : 'password'}
                                    onChange={(e) => setNewPass(e.target.value)}
                                    value={newPass}
                                    aria-invalid={validNewPass ? "false" : "true"}
                                    onFocus={() => setNewPassFocus(true)}
                                    onBlur={() => setNewPassFocus(false)}
                                    error = {newPass && !validNewPass || errr?.response?.data?.errors?.newPass}
                                    helperText= {newPassFocus && newPass && !validNewPass ? "8 đến 24 kí tự. Phải bao gồm chữ in hoa và ký tự đặc biệt." : errr?.response?.data?.errors?.newPass}                                        size="small"
                                    InputProps={{
                                        endAdornment: endAdornment
                                    }}
                                />
                                <CustomInput label='Nhập lại mật khẩu mới' 
                                    type={show ? 'text' : 'password'}
                                    onChange={(e) => setNewPassRe(e.target.value)}
                                    value={newPassRe}
                                    aria-invalid={validNewPassRe ? "false" : "true"}
                                    error = {newPassRe && !validNewPassRe || errr?.response?.data?.errors?.newPassRe}
                                    helperText= {newPassRe && !validNewPassRe ? "Không trùng mật khẩu." : errr?.response?.data?.errors?.newPassRe}
                                    size="small"
                                    InputProps={{
                                        endAdornment: endAdornment
                                    }}
                                />
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{marginBottom: '20px'}}>
                            <Button onClick={handleChangePassword}><CheckIcon sx={{marginRight: '10px'}}/>Xác nhận</Button>
                            <Button style={{backgroundColor: '#e66161'}} onClick={handleCloseDialog}><CloseIcon sx={{marginRight: '10px'}}/>Huỷ</Button>
                        </DialogActions>
                    </CustomDialog>
                    </TabPanel>
                    <TabPanel value="receipts">
                    <ContentContainer>
                        <Title><ReceiptIcon/>&nbsp;ĐƠN HÀNG CỦA BẠN</Title>
                        <ReceiptsTable/>
                    </ContentContainer>
                    </TabPanel>
                    <TabPanel value="reviews">
                    <ContentContainer>
                        <Title><TryIcon/>&nbsp;ĐÁNH GIÁ CỦA BẠN</Title>
                        <ReviewTable/>
                    </ContentContainer>
                    </TabPanel>
                </TabContext>
            </Grid>
        </Grid>
    </Wrapper>
  )
}

export default Profile  