import styled from "styled-components"
import { styled as muiStyled } from '@mui/material/styles';
import { useState, useEffect, lazy, Suspense } from 'react'
import {
    Grid, TextField, List, ListItemButton, Collapse, Divider, Avatar, Table, TableBody,
    TableContainer, Dialog, DialogTitle, DialogContent, DialogActions, TableCell, TableRow, Paper,
    Stack, FormControl, Radio, RadioGroup, FormControlLabel, Box, InputAdornment, IconButton
} from '@mui/material';
import {
    ExpandLess, ExpandMore, Edit as EditIcon, Person as PersonIcon, Receipt as ReceiptIcon,
    Try as TryIcon, Check as CheckIcon, Close as CloseIcon, AccessTime as AccessTimeIcon, CalendarMonth as CalendarMonthIcon,
    Star as StarIcon, VisibilityOff, Visibility
} from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useGetProfileQuery } from '../features/users/usersApiSlice';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import ReceiptsDetail from '../components/profile/ReceiptsDetail';
import ReviewsDetail from '../components/profile/ReviewsDetail';
import ProfileDetail from "../components/profile/ProfileDetail";

const PendingIndicator = lazy(() => import('../components/authorize/PendingIndicator'));

//#region styled
const Wrapper = styled.div`
`

const ListContainer = styled.div`
    width: 100%;
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
    display: ${props => props.display};
`

const ContentContainer = styled.div`
    padding: 0px 15px;
    border: 0.5px solid ${props => props.theme.palette.action.focus};
`

const Title = styled.h3`
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    border-bottom: 0.5px solid ${props => props.theme.palette.secondary.main};
    padding-bottom: 15px;
    color: ${props => props.theme.palette.secondary.main};
`

const Button = styled.button`
  background-color: ${props => props.theme.palette.secondary.main};
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
    color: ${props => props.theme.palette.secondary.main};
    margin: 0 0;
`

const StatusTag = styled.p`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0;
    font-weight: bold;
    font-size: 16px;
    color: ${props => props.theme.palette.secondary.main};
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

const Profiler = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0px 10px;
    background-color: #f7f7f7;
    border-bottom: 0.5px solid ${props => props.theme.palette.secondary.main};
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

const Profile = () => {
    //#region construct
    const { tab } = useParams();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [pending, setPending] = useState(false);

    //Password dialog open state
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const { data, isLoading, isSuccess, isError, refetch } = useGetProfileQuery();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `RING! - Hồ sơ`;
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [tab])

    const handleOpen = () => {
        setOpen(prevState => !prevState);
    };

    const handleOpenDialog = () => {
        navigate('/profile/detail');
        setOpenDialog(true)
    };

    const handleCloseDialog = () => setOpenDialog(false);
    //#endregion

    return (
        <Wrapper>
            {pending ?
                <Suspense fallBack={<></>}>
                    <PendingIndicator />
                </Suspense>
                : null
            }
            <Grid container spacing={2}>
                <Grid item xs={12} md={3.5} lg={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ListContainer>
                        <MiniProfile>
                            <Grid container spacing={1}>
                                <Grid item xs={6} md={12} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ width: 50, height: 50, marginRight: 2 }} /><h3>{data?.userName}</h3>
                                </Grid>
                                <Grid item xs={6} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ChangeText onClick={() => navigate('/profile/detail')}><EditIcon />Sửa hồ sơ</ChangeText>
                                </Grid>
                            </Grid>
                        </MiniProfile>
                        <Divider sx={{ margin: '20px 0px' }} />
                        <List
                            sx={{ width: '100%', py: 0 }}
                            component="nav"
                        >
                            <ListItemButton sx={listStyle} selected={false} onClick={() => handleOpen()}>
                                <ItemText><PersonIcon />&nbsp;Tài khoản của tôi</ItemText>
                                {open ? <ExpandLess />
                                    : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItemButton sx={{ pl: 8, py: 0, color: 'gray' }} onClick={() => navigate('/profile/detail')}>
                                        <ItemText>Hồ sơ</ItemText>
                                    </ListItemButton>
                                </List>
                                <List component="div" disablePadding>
                                    <ListItemButton sx={{ pl: 8, py: 0, color: 'gray' }} onClick={handleOpenDialog}>
                                        <ItemText>Đổi mật khẩu</ItemText>
                                    </ListItemButton>
                                </List>
                            </Collapse>

                            <ListItemButton sx={listStyle} selected={false} onClick={() => navigate('/profile/receipts')}>
                                <ItemText><ReceiptIcon />&nbsp;Đơn hàng</ItemText>
                            </ListItemButton>
                            <ListItemButton sx={listStyle} selected={false} onClick={() => navigate('/profile/reviews')}>
                                <ItemText><TryIcon />&nbsp;Đánh giá</ItemText>
                            </ListItemButton>
                        </List>
                    </ListContainer>
                </Grid>
                <Grid item xs={12} md={8.5} lg={9}>
                    <TabContext value={tab}>
                        <TabPanel value="detail">
                            <ProfileDetail {...{ ContentContainer, Title, openDialog, handleCloseDialog }} />
                        </TabPanel>
                        {/* <TabPanel value="receipts">
                            <ReceiptsDetail />
                        </TabPanel>
                        <TabPanel value="reviews">
                            <ReviewsDetail />
                        </TabPanel> */}
                    </TabContext>
                </Grid>
            </Grid>
        </Wrapper>
    )
}

export default Profile  