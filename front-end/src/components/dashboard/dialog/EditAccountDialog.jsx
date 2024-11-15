import { useState, useEffect } from 'react'

import styled from '@emotion/styled'
import { styled as muiStyled } from '@mui/material';

import { TextField, InputAdornment, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Grid2 as Grid, MenuItem, FormControl } from '@mui/material';
import { Edit as EditIcon, Close as CloseIcon, VisibilityOff, Visibility, Cached as CachedIcon, LockReset as LockResetIcon } from '@mui/icons-material';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

//#region styled
const Button = styled.div`
    padding: 10px 15px;
    font-size: 16px;
    font-weight: 400;
    background-color: ${props => props.theme.palette.primary.main};
    color: ${props => props.theme.palette.primary.contrastText};
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

const Instruction = styled.p`
    font-size: 14px;
    font-style: italic;
    color: red;
    display: ${display};;
`

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

const CustomInput = styled(TextField)({
  '& .MuiInputBase-root': {
    borderRadius: 0
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

// const CustomDatePicker = styled(DatePicker)({
//   '& .MuiInputBase-root': {
//     borderRadius: 0
//   },
//   '& label.Mui-focused': {
//     color: '#A0AAB4'
//   },
//   '& .MuiInput-underline:after': {
//     borderBottomColor: '#B2BAC2',
//   },
//   '& .MuiOutlinedInput-root': {
//     borderRadius: 0,
//     '& fieldset': {
//       borderRadius: 0,
//       borderColor: '#E0E3E7',
//     },
//     '&:hover fieldset': {
//       borderRadius: 0,
//       borderColor: '#B2BAC2',
//     },
//     '&.Mui-focused fieldset': {
//       borderRadius: 0,
//       borderColor: '#6F7E8C',
//     },
//   },
//   '& input:valid + fieldset': {
//     borderColor: 'lightgray',
//     borderRadius: 0,
//     borderWidth: 1,
//   },
//   '& input:invalid + fieldset': {
//     borderColor: '#e66161',
//     borderRadius: 0,
//     borderWidth: 1,
//   },
//   '& input:valid:focus + fieldset': {
//     borderColor: '#63e399',
//     borderLeftWidth: 4,
//     borderRadius: 0,
//     padding: '4px !important',
//   },
// });
//#endregion

const ACCOUNT_URL = 'api/accounts';
const gendersList = [
  {
    value: '',
    label: 'Không',
  },
  {
    value: 'Nam',
    label: 'Nam',
  },
  {
    value: 'Nữ',
    label: 'Nữ',
  },
];

const rolesList = [
  {
    value: '1',
    label: 'MEMBER',
  },
  {
    value: '2',
    label: 'SELLER',
  },
  {
    value: '3',
    label: 'ADMIN',
  },
];

const EditAccountDialog = (props) => {
  return (<p>TEMP</p>)

  // //#region construct
  // const { id, open, setOpen, refetch } = props;
  // const [username, setUserName] = useState('')
  // const [pass, setPass] = useState('')
  // const [email, setEmail] = useState('')
  // const [roles, setRoles] = useState(rolesList[0].value)
  // const [name, setName] = useState('')
  // const [phone, setPhone] = useState('')
  // const [gender, setGender] = useState(gendersList[0].value)
  // const [dob, setDob] = useState(dayjs('2001-01-01'));
  // const [address, setAddress] = useState('')
  // const [err, setErr] = useState([]);
  // const [errMsg, setErrMsg] = useState('');
  // const [show, setShow] = useState(false);
  // const [keep, setKeep] = useState(false);
  // const axiosPrivate = useAxiosPrivate();
  // const { loading, data } = usePrivateFetch(id.length !== 0 ? ACCOUNT_URL + "/" + id : '');;

  // useEffect(() => {
  //   if (id.length !== 0 && open && data && !loading) {
  //     setUserName(data?.username);
  //     setEmail(data?.email);
  //     setRoles(data?.roles);
  //     setName(data?.name);
  //     setPhone(data?.phone);
  //     setDob(dayjs(data?.dob));
  //     setAddress(data?.address);
  //     setGender(data?.gender);
  //   }
  // }, [loading])

  // const handleCloseNew = () => {
  //   setOpen(false);
  //   setErr([]);
  //   setErrMsg('');
  // };

  // const handleClickShow = () => setShow((show) => !show);

  // const handleMouseDown = (event) => {
  //   event.preventDefault();
  // };

  // const handleClickKeep = () => setKeep((keep) => !keep);

  // const handleMouseDownKeep = (event) => {
  //   event.preventDefault();
  // };

  // const endAdornment =
  //   <InputAdornment position="end">
  //     <IconButton
  //       aria-label="toggle keep passowrd"
  //       onClick={handleClickKeep}
  //       onMouseDown={handleMouseDownKeep}
  //       edge="end"
  //     >
  //       {keep ? <CachedIcon /> : <LockResetIcon />}
  //     </IconButton>
  //     <IconButton
  //       aria-label="toggle password visibility"
  //       onClick={handleClickShow}
  //       onMouseDown={handleMouseDown}
  //       edge="end"
  //     >
  //       {show ? <VisibilityOff /> : <Visibility />}
  //     </IconButton>
  //   </InputAdornment>

  // const handleAddBook = async (event) => {
  //   event.preventDefault();
  //   const { enqueueSnackbar } = await import('notistack');

  //   let json = JSON.stringify({
  //     username: username, pass: pass, email: email, roles: roles, keepOldPass: keep,
  //     name: name, phone: phone, dob: dob.format('YYYY-MM-DD'), gender: gender, address: address
  //   })

  //   if (keep) {
  //     json = JSON.stringify({
  //       username: username, pass: '................', email: email, roles: roles, keepOldPass: keep,
  //       name: name, phone: phone, dob: dob.format('YYYY-MM-DD'), gender: gender, address: address
  //     })
  //   }

  //   try {
  //     const response = await axiosPrivate.put(ACCOUNT_URL + "/" + id, json,
  //       {
  //         headers: { 'Content-Type': 'application/json' },
  //         withCredentials: true
  //       }
  //     );

  //     refetch();
  //     enqueueSnackbar('Đã chỉnh sửa thành viên!', { variant: 'success' });
  //     setErrMsg('');
  //     setErr([]);
  //   } catch (err) {
  //     console.error(err);
  //     setErr(err);
  //     if (!err?.response) {
  //       setErrMsg('Server không phản hồi');
  //     } else if (err.response?.status === 409) {
  //       setErrMsg(err.response?.data?.errors?.errorMessage);
  //     } else if (err.response?.status === 400) {
  //       setErrMsg('Sai định dạng thông tin!');
  //     } else {
  //       setErrMsg('Chỉnh sửa thành viên thất bại!')
  //     }

  //     enqueueSnackbar('Chỉnh sửa thành viên thất bại!', { variant: 'error' });
  //   }
  // };
  // //#endregion

  // return (
  //   <CustomDialog open={open} onClose={handleCloseNew} maxWidth={'md'}>
  //     <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}><EditIcon />&nbsp;Chỉnh sửa thành viên</DialogTitle>
  //     <DialogContent>
  //       <Instruction display={errMsg ? "block" : "none"} aria-live="assertive">{errMsg}</Instruction>
  //       <Grid container columnSpacing={1}>
  //         <Grid container item columnSpacing={1}>
  //           <Grid item xs={12} sm={6}>
  //             <CustomInput
  //               required
  //               margin="dense"
  //               id="username"
  //               label="Tên đăng nhập"
  //               fullWidth
  //               variant="outlined"
  //               value={username}
  //               onChange={(e) => setUserName(e.target.value)}
  //               error={err?.response?.data?.errors?.username}
  //               helperText={err?.response?.data?.errors?.username}
  //             />
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <CustomInput
  //               margin="dense"
  //               id="name"
  //               label="Họ và tên"
  //               fullWidth
  //               variant="outlined"
  //               value={name}
  //               onChange={(e) => setName(e.target.value)}
  //               error={err?.response?.data?.errors?.name}
  //               helperText={err?.response?.data?.errors?.name}
  //             />
  //           </Grid>
  //         </Grid>
  //         <Grid container item columnSpacing={1}>
  //           <Grid item xs={12} sm={6}>
  //             <CustomInput
  //               type={show ? 'text' : 'password'}
  //               margin="dense"
  //               id="pass"
  //               label={keep ? 'Giữ mật khẩu cũ' : 'Mật khẩu mới'}
  //               disabled={keep}
  //               fullWidth
  //               variant="outlined"
  //               value={pass}
  //               onChange={(e) => setPass(e.target.value)}
  //               error={err?.response?.data?.errors?.pass}
  //               helperText={err?.response?.data?.errors?.pass}
  //               InputProps={{
  //                 endAdornment: endAdornment
  //               }}
  //             />
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <CustomInput
  //               margin="dense"
  //               id="phone"
  //               label="Số điện thoại"
  //               fullWidth
  //               variant="outlined"
  //               value={phone}
  //               onChange={(e) => setPhone(e.target.value)}
  //               error={err?.response?.data?.errors?.phone}
  //               helperText={err?.response?.data?.errors?.phone}
  //             />
  //           </Grid>
  //         </Grid>
  //         <Grid container item columnSpacing={1}>
  //           <Grid item xs={12} sm={6}>
  //             <CustomInput
  //               required
  //               margin="dense"
  //               id="email"
  //               label="Email"
  //               fullWidth
  //               variant="outlined"
  //               value={email}
  //               onChange={(e) => setEmail(e.target.value)}
  //               error={err?.response?.data?.errors?.email}
  //               helperText={err?.response?.data?.errors?.email}
  //             />
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <CustomInput
  //               label="Giới tính"
  //               select
  //               margin="dense"
  //               fullWidth
  //               id="gender"
  //               value={gender}
  //               onChange={(e) => setGender(e.target.value)}
  //             >
  //               {gendersList.map((option) => (
  //                 <MenuItem key={option.value} value={option.value}>
  //                   {option.label}
  //                 </MenuItem>
  //               ))}
  //             </CustomInput>
  //           </Grid>
  //         </Grid>
  //         <Grid container item columnSpacing={1}>
  //           <Grid item xs={12} sm={6}>
  //             <CustomInput CustomInput
  //               label="Quyền"
  //               select
  //               required
  //               margin="dense"
  //               fullWidth
  //               id="roles"
  //               value={roles}
  //               onChange={(e) => setRoles(e.target.value)}
  //             >
  //               {rolesList.map((option) => (
  //                 <MenuItem key={option.value} value={option.value}>
  //                   {option.label}
  //                 </MenuItem>
  //               ))}
  //             </CustomInput>
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <LocalizationProvider dateAdapter={AdapterDayjs}>
  //               <FormControl margin="dense" fullWidth>
  //                 <CustomDatePicker
  //                   label="Ngày sinh"
  //                   value={dob}
  //                   className="DatePicker"
  //                   onChange={(newValue) => setDob(newValue)}
  //                   error={err?.response?.data?.errors?.dob}
  //                   helperText={err?.response?.data?.errors?.dob}
  //                 />
  //               </FormControl>
  //             </LocalizationProvider>
  //           </Grid>
  //         </Grid>
  //         <Grid item xs={12}>
  //           <CustomInput
  //             required
  //             margin="dense"
  //             id="address"
  //             label="Địa chỉ"
  //             fullWidth
  //             multiline
  //             rows={2}
  //             variant="outlined"
  //             value={address}
  //             onChange={(e) => setAddress(e.target.value)}
  //             error={err?.response?.data?.errors?.address}
  //             helperText={err?.response?.data?.errors?.address}
  //           />
  //         </Grid>
  //       </Grid>
  //     </DialogContent>
  //     <DialogActions>
  //       <Button onClick={handleAddBook}><EditIcon sx={{ marginRight: '10px' }} />Chỉnh sửa</Button>
  //       <ClearButton onClick={handleCloseNew}><CloseIcon sx={{ marginRight: '10px' }} />Huỷ</ClearButton>
  //     </DialogActions>
  //   </CustomDialog>
  // );
}

export default EditAccountDialog