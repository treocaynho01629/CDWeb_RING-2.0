import styled from '@emotion/styled'
import { useState, useEffect } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid2 as Grid, MenuItem, FormControl, Button, TextField, TextareaAutosize } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { useCreateBookMutation, useGetBookQuery, useUpdateBookMutation } from '../../../features/books/booksApiSlice';
import { useGetPublishersQuery } from '../../../features/publishers/publishersApiSlice';
import { useGetCategoriesQuery } from '../../../features/categories/categoriesApiSlice';
import dayjs from 'dayjs';
import CustomDropZone from '../custom/CustomDropZone';
// import CustomDatePicker from '../../custom/CustomDatePicker';

//#region styled
const Instruction = styled.p`
    font-size: 14px;
    font-style: italic;
    color: red;
    display: ${display};;
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

const EditProductDialog = ({ id, open, handleClose }) => {
  //#region construct
  const [date, setDate] = useState(dayjs('2001-01-01'));
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [author, setAuthor] = useState('');
  const [pubId, setPubId] = useState('');
  const [cateId, setCateId] = useState('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState('');
  const [pages, setPages] = useState('');
  const [language, setLanguage] = useState(bookLanguages[0].value);
  const [type, setType] = useState(bookTypes[0].value);
  const [err, setErr] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const [pending, setPending] = useState(false);

  //Fetch book detail if edit
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetBookQuery(id, { skip: (!id || !open) });
  const { data: cates, isLoading: loadCates, isSuccess: doneCates, isError: errorCates } = useGetCategoriesQuery(); //Categories
  const { data: pubs, isLoading: loadPubs, isSuccess: donePubs, isError: errorPubs } = useGetPublishersQuery(); //Publishers

  //Update/New product hooks
  const [updateProduct, { isLoading: updating }] = useUpdateBookMutation();
  const [createProduct, { isLoading: creating }] = useCreateBookMutation();

  useEffect(() => {
    if (id && open && data && !isLoading && isSuccess) {
      setDate(dayjs(data?.date));
      setFiles([]);
      setImage(data?.image);
      setPrice(data?.price);
      setAmount(data?.amount);
      setAuthor(data?.author);
      setWeight(data?.weight);
      setSize(data?.size);
      setPages(data?.page);
      setPubId(data?.publisher?.id);
      setCateId(data?.category?.id);
      setType(data?.type);
      setLanguage(data?.language);
      setTitle(data?.title);
      setDescription(data?.description);
    }
  }, [data]);

  const resetInput = () => {
    setDate(dayjs('2001-01-01'));
    setFiles([]);
    setTitle('');
    setPrice('');
    setAmount('');
    setDescription('');
    setAuthor('');
    setWeight('');
    setSize('');
    setPages('');
    setPubId('');
    setCateId('');
    setType(bookTypes[0].value);
    setLanguage(bookLanguages[0].value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pending || creating || updating) return;

    //New form data
    const formData = new FormData();
    const json = JSON.stringify({
      title,
      description,
      type,
      author,
      size,
      price: price.toString(),
      amount: amount.toString(),
      pubId: pubId.toString(),
      cateId: cateId.toString(),
      weight: weight.toString(),
      pages: pages.toString(),
      date: date.format('YYYY-MM-DD'),
      language
    });
    const blob = new Blob([json], { type: 'application/json' });

    formData.append('request', blob);
    formData.append('image', files[0])

    //Request
    setPending(true);
    const { enqueueSnackbar } = await import('notistack');

    if (!id) { //Create
      createProduct(formData).unwrap()
        .then((data) => {
          setErrMsg('');
          setErr([]);
          setFiles([]);
          resetInput();
          handleClose();
          enqueueSnackbar('Đã thêm sản phẩm!', { variant: 'success' });
          setPending(false);
        })
        .catch((err) => {
          console.error(err);
          setErr(err);
          if (!err?.status) {
            setErrMsg('Server không phản hồi');
          } else if (err?.status === 409) {
            setErrMsg(err?.data?.errors?.errorMessage);
          } else if (err?.status === 400) {
            setErrMsg('Sai định dạng thông tin!');
          } else {
            setErrMsg('Cập nhật sản phẩm thất bại');
          }
          setPending(false);
        })
    } else { //Update
      updateProduct({ id, updatedBook: formData }).unwrap()
        .then((data) => {
          setErrMsg('');
          setErr([]);
          setFiles([]);
          handleClose();
          enqueueSnackbar('Đã cập nhật sản phẩm!', { variant: 'success' });
          setPending(false);
        })
        .catch((err) => {
          console.error(err);
          setErr(err);
          if (!err?.status) {
            setErrMsg('Server không phản hồi');
          } else if (err?.status === 409) {
            setErrMsg(err?.data?.errors?.errorMessage);
          } else if (err?.status === 400) {
            setErrMsg('Sai định dạng thông tin!');
          } else {
            setErrMsg('Thêm sản phẩm thất bại');
          }
          setPending(false);
        })
    }
  }

  let catesItems;
  let pubsItems;

  if (loadCates || errorCates) {
    catesItems = null;
  } else if (doneCates) {
    const { ids, entities } = cates;

    catesItems = ids?.length
      ? ids?.map((id, index) => {
        const cate = entities[id];

        return (
          <MenuItem key={`Cate:${id}-${index}`} value={id}>
            {cate.name}
          </MenuItem>
        )
      })
      : null
  }

  if (loadPubs || errorPubs) {
    pubsItems = null;
  } else if (donePubs) {
    const { ids, entities } = pubs;

    pubsItems = ids?.length
      ? ids?.map((id, index) => {
        const pub = entities[id];

        return (
          <MenuItem key={`Pub:${id}-${index}`} value={id}>
            {pub.pubName}
          </MenuItem>
        )
      })
      : null
  }
  //#endregion

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'md'}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>Chỉnh sửa sản phẩm</DialogTitle>
      <DialogContent>
        <form style={{ paddingTop: 10 }} onSubmit={handleSubmit}>
          <Instruction display={errMsg ? "block" : "none"} aria-live="assertive">{errMsg}</Instruction>
          <Grid container size="grow" columnSpacing={1}>
            <TextField
              required
              margin="dense"
              id="title"
              label="Tiêu đề"
              fullWidth
              variant="outlined"
              value={title}
              onBlur={(e) => setTitle(e.target.value)}
              error={err?.response?.data?.errors?.title}
              helperText={err?.response?.data?.errors?.title}
            />
            <TextField
              required
              margin="dense"
              id="description"
              label="Mô tả"
              fullWidth
              multiline
              minRows={6}
              slotProps={{
                inputComponent: TextareaAutosize,
                inputProps: {
                  minRows: 6,
                  style: {
                    resize: "auto"
                  }
                }
              }}
              variant="outlined"
              value={description}
              onBlur={(e) => setDescription(e.target.value)}
              error={err?.response?.data?.errors?.description}
              helperText={err?.response?.data?.errors?.description}
            />
            <Grid size={12}>
              <CustomDropZone image={image} files={files} setFiles={setFiles} />
            </Grid>
            <Grid container size={12} columnSpacing={1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  margin="dense"
                  id="size"
                  label="Kích thước"
                  fullWidth
                  variant="outlined"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  error={err?.response?.data?.errors?.size}
                  helperText={err?.response?.data?.errors?.size}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  margin="dense"
                  id="weight"
                  label="Khối lượng (g)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  error={err?.response?.data?.errors?.weight}
                  helperText={err?.response?.data?.errors?.weight}
                />
              </Grid>
            </Grid>
            <Grid container size={12} columnSpacing={1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  margin="dense"
                  id="amount"
                  label="Số lượng"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  error={err?.response?.data?.errors?.amount}
                  helperText={err?.response?.data?.errors?.amount}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  margin="dense"
                  id="pages"
                  label="Số trang"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  error={err?.response?.data?.errors?.pages}
                  helperText={err?.response?.data?.errors?.pages}
                />
              </Grid>
            </Grid>
            <Grid container size={12} columnSpacing={1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  margin="dense"
                  id="author"
                  label="Tác giả"
                  fullWidth
                  variant="outlined"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  error={err?.response?.data?.errors?.author}
                  helperText={err?.response?.data?.errors?.author}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  margin="dense"
                  id="price"
                  label="Giá (đ)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  error={err?.response?.data?.errors?.price}
                  helperText={err?.response?.data?.errors?.price}
                />
              </Grid>
            </Grid>
            <Grid container size={12} columnSpacing={1}>
              <Grid size={{ xs: 12, sm: 6 }}>

              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {/* <CustomDatePicker
                  label="Ngày xuất bản"
                  value={date}
                  className="DatePicker"
                  onChange={(newValue) => setDate(newValue)}
                  slotProps={{
                    textField: {
                      error: err?.response?.data?.errors?.date,
                      helperText: err?.response?.data?.errors?.date,
                    },
                  }}
                /> */}
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Ngôn ngữ"
                select
                required
                margin="dense"
                fullWidth
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {bookLanguages.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Hình thức bìa"
                select
                required
                margin="dense"
                fullWidth
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {bookTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Danh mục"
                select
                required
                margin="dense"
                fullWidth
                id="category"
                value={cateId}
                onChange={(e) => setCateId(e.target.value)}
              >
                <MenuItem disabled value=""><em>--Danh mục--</em></MenuItem>
                {catesItems}
              </TextField>
              <TextField
                label="Nhà xuất bản"
                select
                required
                margin="dense"
                fullWidth
                id="publisher"
                value={pubId}
                onChange={(e) => setPubId(e.target.value)}
              >
                <MenuItem disabled value=""><em>--Nhà xuất bản--</em></MenuItem>
                {pubsItems}
              </TextField>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          size="large"
          sx={{ marginY: '10px' }}
          startIcon={<Close />}
          onClick={handleClose}
        >
          Huỷ
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ marginY: '10px' }}
          startIcon={<Check />}
          onClick={handleSubmit}
        >
          Chỉnh sửa
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditProductDialog