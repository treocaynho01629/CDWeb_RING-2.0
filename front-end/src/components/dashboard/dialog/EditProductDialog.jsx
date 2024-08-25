import React, { useState, useEffect } from 'react'

import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';

import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, FormControl } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

import CustomDropZone from '../custom/CustomDropZone';

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

const CustomDatePicker = styled(DatePicker)({
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

const Instruction = styled.p`
    font-size: 14px;
    font-style: italic;
    color: red;
    display: ${props => props.display};;
`

const bookLanguages = [
  {
    value: 'Tiếng Việt',
    label: 'Tiếng Việt',
  },
  {
    value: 'Tiếng Anh',
    label: 'Tiếng Anh',
  },
  {
    value: 'Tiếng Trung',
    label: 'Tiếng Trung',
  },
  {
    value: 'Tiếng Nhật',
    label: 'Tiếng Nhật',
  },
];

const bookTypes = [
  {
    value: 'Bìa mềm',
    label: 'Bìa mềm',
  },
  {
    value: 'Bìa rời',
    label: 'Bìa rời',
  },
  {
    value: 'Bìa cứng',
    label: 'Bìa cứng',
  },
  {
    value: 'Bìa gỗ',
    label: 'Bìa gỗ',
  },
];

//#endregion

const BOOK_URL = 'api/books';

const EditProductDialog = (props) => {
  return(<p>TEMP</p>)
  // //#region construct
  // const { id, open, setOpen, loadingCate, dataCate, loadingPub, dataPub, refetch } = props;
  // const [date, setDate] = useState(dayjs('2001-01-01'));
  // const [files, setFiles] = useState([]);
  // const [image, setImage] = useState([]);
  // const [title, setTitle] = useState('')
  // const [price, setPrice] = useState('')
  // const [amount, setAmount] = useState('')
  // const [description, setDescription] = useState([''])
  // const [author, setAuthor] = useState('')
  // const [pubId, setPubId] = useState(1)
  // const [cateId, setCateId] = useState(1)
  // const [weight, setWeight] = useState('')
  // const [size, setSize] = useState('')
  // const [pages, setPages] = useState('')
  // const [language, setLanguage] = useState(bookLanguages[0].value);
  // const [type, setType] = useState(bookTypes[0].value);
  // const [err, setErr] = useState([]);
  // const [errMsg, setErrMsg] = useState('');
  // const axiosPrivate = useAxiosPrivate();
  // const { loading, data } = useFetch(id.length !== 0 ? BOOK_URL + "/" + id : '');

  // useEffect(() => {
  //   if (id.length !== 0 && open && data && !loading) {
  //     console.log(id);
  //     setDate(dayjs(data?.date));
  //     setFiles([]);
  //     setImage(data?.image);
  //     setTitle(data?.title);
  //     setPrice(data?.price);
  //     setAmount(data?.amount);
  //     setDescription(data?.description);
  //     setAuthor(data?.author);
  //     setWeight(data?.weight);
  //     setSize(data?.size);
  //     setPages(data?.page);
  //     setPubId(data?.publisher?.id);
  //     setCateId(data?.cateId);
  //     setType(data?.type);
  //     setLanguage(data?.language);
  //   }
  // }, [loading])

  // const handleCloseNew = () => {
  //   setOpen(false);
  // };

  // const handleEditBook = async (event) => {
  //   event.preventDefault();
  //   const formData = new FormData();

  //   const json = JSON.stringify({
  //     price: price.toString(),
  //     amount: amount.toString(),
  //     title,
  //     description,
  //     type,
  //     author,
  //     pubId: pubId.toString(),
  //     cateId: cateId.toString(),
  //     weight: weight.toString(),
  //     size,
  //     pages: pages.toString(),
  //     date: date.format('YYYY-MM-DD'),
  //     language
  //   });
  //   const blob = new Blob([json], {
  //     type: 'application/json'
  //   });

  //   formData.append(`request`, blob);
  //   formData.append(`image`, files[0])

  //   try {
  //     const response = await axiosPrivate.put(BOOK_URL + "/" + id,
  //       formData,
  //       {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //         withCredentials: true
  //       }
  //     );

  //     refetch();
  //     const { enqueueSnackbar } = await import('notistack');
  //     enqueueSnackbar('Đã chỉnh sửa sản phẩm!', { variant: 'success' });
  //     setErrMsg('');
  //     setErr([]);
  //     setFiles([]);
  //     setOpen(false);
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
  //       setErrMsg('Sửa sản phẩm thất bại!')
  //     }

  //     enqueueSnackbar('Sửa sản phẩm thất bại!', { variant: 'error' });
  //   }
  // };
  // //#endregion

  // if (loadingCate || loadingPub || loading || !id) {
  //   return <></>
  // }

  // return (
  //   <CustomDialog open={open} onClose={handleCloseNew} maxWidth={'md'}>
  //     <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}><EditIcon />&nbsp;Chỉnh sửa sản phẩm</DialogTitle>
  //     <DialogContent>
  //       <Instruction display={errMsg ? "block" : "none"} aria-live="assertive">{errMsg}</Instruction>
  //       <Grid container columnSpacing={1}>
  //         <Grid container item columnSpacing={1}>
  //           <Grid item xs={12} sm={6}>
  //             <CustomInput
  //               required
  //               margin="dense"
  //               id="title"
  //               label="Tiêu đề"
  //               fullWidth
  //               variant="outlined"
  //               value={title}
  //               onChange={(e) => setTitle(e.target.value)}
  //               error={err?.response?.data?.errors?.title}
  //               helperText={err?.response?.data?.errors?.title}
  //             />
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <CustomInput
  //               required
  //               margin="dense"
  //               id="weight"
  //               label="Khối lượng"
  //               type="number"
  //               fullWidth
  //               variant="outlined"
  //               value={weight}
  //               onChange={(e) => setWeight(e.target.value)}
  //               error={err?.response?.data?.errors?.weight}
  //               helperText={err?.response?.data?.errors?.weight}
  //             />
  //           </Grid>
  //         </Grid>
  //         <Grid container item columnSpacing={1}>
  //           <Grid item xs={12} sm={6}>
  //             <CustomInput
  //               required
  //               margin="dense"
  //               id="author"
  //               label="Tác giả"
  //               fullWidth
  //               variant="outlined"
  //               value={author}
  //               onChange={(e) => setAuthor(e.target.value)}
  //               error={err?.response?.data?.errors?.author}
  //               helperText={err?.response?.data?.errors?.author}
  //             />
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <CustomInput
  //               required
  //               margin="dense"
  //               id="size"
  //               label="Kích thước"
  //               fullWidth
  //               variant="outlined"
  //               value={size}
  //               onChange={(e) => setSize(e.target.value)}
  //               error={err?.response?.data?.errors?.size}
  //               helperText={err?.response?.data?.errors?.size}
  //             />
  //           </Grid>
  //         </Grid>
  //         <Grid container item columnSpacing={1}>
  //           <Grid item xs={12} sm={6}>
  //             <CustomInput
  //               required
  //               margin="dense"
  //               id="price"
  //               label="Giá"
  //               type="number"
  //               fullWidth
  //               variant="outlined"
  //               value={price}
  //               onChange={(e) => setPrice(e.target.value)}
  //               error={err?.response?.data?.errors?.price}
  //               helperText={err?.response?.data?.errors?.price}
  //             />
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <CustomInput
  //               required
  //               margin="dense"
  //               id="pages"
  //               label="Số trang"
  //               type="number"
  //               fullWidth
  //               variant="outlined"
  //               value={pages}
  //               onChange={(e) => setPages(e.target.value)}
  //               error={err?.response?.data?.errors?.pages}
  //               helperText={err?.response?.data?.errors?.pages}
  //             />
  //           </Grid>
  //         </Grid>
  //         <Grid container item columnSpacing={1}>
  //           <Grid item xs={12} sm={6}>
  //             <CustomInput
  //               required
  //               margin="dense"
  //               id="amount"
  //               label="Số lượng"
  //               type="number"
  //               fullWidth
  //               variant="outlined"
  //               value={amount}
  //               onChange={(e) => setAmount(e.target.value)}
  //               error={err?.response?.data?.errors?.amount}
  //               helperText={err?.response?.data?.errors?.amount}
  //             />
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <LocalizationProvider dateAdapter={AdapterDayjs}>
  //               <FormControl margin="dense" fullWidth>
  //                 <CustomDatePicker
  //                   label="Ngày xuất bản"
  //                   value={date}
  //                   className="DatePicker"
  //                   onChange={(newValue) => setDate(newValue)}
  //                   slotProps={{
  //                     textField: {
  //                       error: err?.response?.data?.errors?.date,
  //                       helperText: err?.response?.data?.errors?.date,
  //                     },
  //                   }}
  //                 />
  //               </FormControl>
  //             </LocalizationProvider>
  //           </Grid>
  //         </Grid>
  //         <Grid item xs={12}>
  //           <CustomDropZone image={image} files={files} setFiles={setFiles} />
  //         </Grid>
  //         <Grid item xs={12}>
  //           <CustomInput
  //             required
  //             margin="dense"
  //             id="description"
  //             label="Mô tả"
  //             fullWidth
  //             multiline
  //             rows={5}
  //             variant="outlined"
  //             value={description}
  //             onChange={(e) => setDescription(e.target.value)}
  //             error={err?.response?.data?.errors?.description}
  //             helperText={err?.response?.data?.errors?.description}
  //           />
  //         </Grid>
  //         <Grid item xs={12} sm={6}>
  //           <CustomInput
  //             label="Ngôn ngữ"
  //             select
  //             required
  //             margin="dense"
  //             fullWidth
  //             id="language"
  //             value={language}
  //             onChange={(e) => setLanguage(e.target.value)}
  //           >
  //             {bookLanguages.map((option) => (
  //               <MenuItem key={option.value} value={option.value}>
  //                 {option.label}
  //               </MenuItem>
  //             ))}
  //           </CustomInput>
  //           <CustomInput
  //             label="Hình thức bìa"
  //             select
  //             required
  //             margin="dense"
  //             fullWidth
  //             id="type"
  //             value={type}
  //             onChange={(e) => setType(e.target.value)}
  //           >
  //             {bookTypes.map((option) => (
  //               <MenuItem key={option.value} value={option.value}>
  //                 {option.label}
  //               </MenuItem>
  //             ))}
  //           </CustomInput>
  //         </Grid>
  //         <Grid item xs={12} sm={6}>
  //           <CustomInput
  //             label="Thể loại"
  //             select
  //             required
  //             margin="dense"
  //             fullWidth
  //             id="category"
  //             value={cateId}
  //             onChange={(e) => setCateId(e.target.value)}
  //           >
  //             {dataCate?.map((option) => (
  //               <MenuItem key={option.id} value={option.id}>
  //                 {option.categoryName}
  //               </MenuItem>
  //             ))}
  //           </CustomInput>
  //           <CustomInput
  //             label="Nhà xuất bản"
  //             select
  //             required
  //             margin="dense"
  //             fullWidth
  //             id="publisher"
  //             value={pubId}
  //             onChange={(e) => setPubId(e.target.value)}
  //           >
  //             {dataPub?.map((option) => (
  //               <MenuItem key={option.id} value={option.id}>
  //                 {option.pubName}
  //               </MenuItem>
  //             ))}
  //           </CustomInput>
  //         </Grid>
  //       </Grid>
  //     </DialogContent>
  //     <DialogActions>
  //       <Button onClick={handleEditBook}><EditIcon sx={{ marginRight: '10px' }} />Chỉnh sửa</Button>
  //       <ClearButton onClick={handleCloseNew}><CloseIcon sx={{ marginRight: '10px' }} />Huỷ</ClearButton>
  //     </DialogActions>
  //   </CustomDialog>
  // );
}

export default EditProductDialog