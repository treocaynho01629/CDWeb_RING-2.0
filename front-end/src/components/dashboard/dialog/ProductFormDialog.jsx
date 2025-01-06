import { useState, useRef, forwardRef } from 'react'
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid2 as Grid, MenuItem, useTheme, useMediaQuery, Button } from '@mui/material';
import { Check, Close as CloseIcon, AutoStories as AutoStoriesIcon } from '@mui/icons-material';
import { bookLanguageItems, bookTypeItems } from '../../../ultils/book';
import { Title } from '../custom/ShareComponents';
import { publishersApiSlice } from '../../../features/publishers/publishersApiSlice';
import { categoriesApiSlice } from '../../../features/categories/categoriesApiSlice';
import { currencyFormat } from '../../../ultils/covert';
import { NumberFormatBase, NumericFormat, PatternFormat } from 'react-number-format';
import { useCreateBookMutation } from '../../../features/books/booksApiSlice';
import { Instruction } from '../../custom/GlobalComponents';
import CustomDropZone from '../custom/CustomDropZone';
import CustomDatePicker from '../../custom/CustomDatePicker';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const NumericFormatCustom = forwardRef(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    const format = (numStr) => {
      if (numStr === '') return '';
      return currencyFormat.format(numStr);
    };

    return (
      <NumberFormatBase
        {...other}
        getInputRef={ref}
        onValueChange={(values, sourceInfo) => {
          let newValue = values.floatValue;

          //Threshold
          if (newValue < 0) newValue = 0;
          if (newValue > 10000000) newValue = 10000000;

          if (onChange) onChange({ target: { value: newValue } });
        }}
        format={format}
      />
    );
  },
);

NumericFormatCustom.propTypes = { onChange: PropTypes.func.isRequired };

const ProductFormDialog = ({ open, handleClose }) => {
  //#region construct
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [pending, setPending] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState(0);
  const [pages, setPages] = useState(0);
  const [amount, setAmount] = useState(0);
  const [size, setSize] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState(dayjs('2001-01-01'));
  const [files, setFiles] = useState([]);
  const amountRef = useRef(0);
  const authorRef = useRef();
  const [price, setPrice] = useState({
    price: 0,
    discount: 0
  });
  const [pub, setPub] = useState('')
  const [cate, setCate] = useState('')
  const [language, setLanguage] = useState(bookLanguageItems[0].value);
  const [type, setType] = useState(bookTypeItems[0].value);
  const [err, setErr] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const [pubsPagination, setPubsPagination] = useState({
    number: 0,
    totalPages: 0,
    totalElements: 0,
  })
  const [catesPagination, setCatesPagination] = useState({
    number: 0,
    totalPages: 0,
    totalElements: 0,
  })

  const [getPublishers, { data: pubs }] = publishersApiSlice.useLazyGetPublishersQuery();
  const [getCategories, { data: cates }] = categoriesApiSlice.useLazyGetCategoriesQuery();
  const [createBook, { isLoading: creating }] = useCreateBookMutation();

  const handleOpenPubs = () => {
    if (!pubs) {
      getPublishers({
        page: pubsPagination?.number,
        loadMore: true,
      })
        .unwrap()
        .then((data) => {
          setPubsPagination({
            ...pubsPagination,
            number: data.page.number,
            totalPages: data.page.totalPages,
            totalElements: data.page.totalElements,
          });
        })
        .catch((rejected) => console.error(rejected));
    }
  };

  const handleOpenCates = () => {
    if (!cates) {
      getCategories({
        include: 'children',
        page: catesPagination?.number,
        loadMore: true
      })
        .unwrap()
        .then((data) => {
          setCatesPagination({
            ...catesPagination,
            number: data.page.number,
            totalPages: data.page.totalPages,
            totalElements: data.page.totalElements,
          });
        })
        .catch((rejected) => console.error(rejected));
    }
  };

  const handleShowmorePubs = () => {
    let currPage = (pubsPagination?.number || 0) + 1;
    if (!pubsPagination?.totalPages <= currPage) {
      getPublishers({
        page: currPage,
        loadMore: true
      })
        .unwrap()
        .then((data) => {
          setPubsPagination({
            ...pubsPagination,
            number: data.page.number,
            totalPages: data.page.totalPages,
            totalElements: data.page.totalElements,
          });
        })
        .catch((rejected) => console.error(rejected));
    }
  }

  const handleShowmoreCates = () => {
    let currPage = (catesPagination?.number || 0) + 1;
    if (!catesPagination?.totalPages <= currPage) {
      getCategories({
        include: 'children',
        page: currPage,
        loadMore: true,
      })
        .unwrap()
        .then((data) => {
          setCatesPagination({
            ...catesPagination,
            number: data.page.number,
            totalPages: data.page.totalPages,
            totalElements: data.page.totalElements,
          });
        })
        .catch((rejected) => console.error(rejected));
    }
  }

  const handleInputChange = (e) => {
    let newValue = e.target.value === '' ? '' : Number(e.target.value);
    setPrice(prev => ({ ...prev, price: newValue }));
  };

  const handleSaleChange = (e) => {
    let newValue = e.target.value === '' ? '' : Number(e.target.value);
    let discountValue = 1 - (newValue / price.price);

    //Threshold
    if (discountValue < 0) discountValue = 0;
    if (discountValue > 1) discountValue = 1;

    if (discountValue != price.discount) setPrice(prev => ({ ...prev, discount: discountValue }));
  }

  const handleDiscountChange = (e) => {
    let newValue = e.target.value;
    newValue = newValue.substring(0, newValue.length - 1) / 100;

    //Threshold
    if (newValue < 0) newValue = 0;
    if (newValue > 1) newValue = 1;

    setPrice(prev => ({ ...prev, discount: newValue }));
  }

  const handleSubmit = async (e) => {
    console.log('a')
    e.preventDefault();
    // if (creating || pending) return;

    console.log('a')

    setPending(true);
    const { enqueueSnackbar } = await import('notistack');

    //Set data
    const formData = new FormData();
    const json = JSON.stringify({
      price: price.price,
      discount: price.discount,
      amount,
      title,
      description,
      type,
      author,
      pubId: pub,
      cateId: cate,
      weight,
      size,
      pages,
      date: date.format('YYYY-MM-DD'),
      language,
      shopId: 10000//FIX
    });
    const blob = new Blob([json], { type: 'application/json' });

    formData.append('request', blob);
    if (files) formData.append('thumbnail', files[0]);

    createBook(formData).unwrap()
      .then((data) => {
        setErrMsg('');
        setErr([]);
        enqueueSnackbar('Thêm sản phẩm thành công!', { variant: 'success' });
        setPending(false);
      })
      .catch((err) => {
        console.error(err);
        setErr(err);
        if (!err?.status) {
          setErrMsg('Server không phản hồi');
        } else if (err?.status === 409) {
          setErrMsg(err?.data?.message);
        } else if (err?.status === 403) {
          setErrMsg('Chưa có ảnh kèm theo!');
        } else if (err?.status === 400) {
          setErrMsg('Sai định dạng thông tin!');
        } else if (err?.status === 417) {
          setErrMsg('File ảnh quá lớn (Tối đa 5MB)!');
        } else {
          setErrMsg('Thêm sản phẩm thất bại!')
        }
        enqueueSnackbar('Thêm sản phẩm thất bại!', { variant: 'error' });
        setPending(false);
      })
  };
  //#endregion

  return (
    <Dialog open={open} scroll={'paper'} maxWidth={'md'} fullWidth onClose={handleClose} fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}><AutoStoriesIcon />&nbsp;Thêm sản phẩm</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Instruction display={errMsg ? "block" : "none"}>{errMsg}</Instruction>
          <Grid container size="grow" spacing={1}>
            <Grid size={12}>
              <Title>Thông tin sản phẩm</Title>
            </Grid>
            <Grid size={12}>
              <TextField
                required
                id="title"
                label="Tiêu đề"
                fullWidth
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={err?.data?.errors?.title}
                helperText={err?.data?.errors?.title}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                required
                id="description"
                label="Mô tả"
                fullWidth
                multiline
                rows={5}
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={err?.data?.errors?.description}
                helperText={err?.data?.errors?.description}
              />
            </Grid>
            <Grid size={12}>
              <CustomDropZone files={files} setFiles={setFiles} />
            </Grid>
            <Grid size={12}>
              <Title>Chi tiết sản phẩm</Title>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <NumericFormat
                required
                id="weight"
                label="Khối lượng"
                suffix="g"
                fullWidth
                variant="outlined"
                value={weight}
                onValueChange={(values) => setWeight(values.floatValue)}
                error={err?.data?.errors?.weight}
                helperText={err?.data?.errors?.weight}
                customInput={TextField}
                allowNegative={false}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <PatternFormat
                required
                id="size"
                label="Kích thước"
                format="### x ### x ###"
                suffix="cm"
                fullWidth
                variant="outlined"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                error={err?.data?.errors?.size}
                helperText={err?.data?.errors?.size}
                customInput={TextField}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <NumericFormat
                required
                id="pages"
                label="Số trang"
                type="number"
                fullWidth
                variant="outlined"
                value={pages}
                onValueChange={(values) => setPages(values.value)}
                error={err?.data?.errors?.pages}
                helperText={err?.data?.errors?.pages}
                customInput={TextField}
                allowNegative={false}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <CustomDatePicker
                required
                label="Ngày xuất bản"
                value={date}
                className="custom-date-picker"
                onChange={newValue => setDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: err?.data?.errors?.date,
                    helperText: err?.data?.errors?.date,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                required
                id="author"
                label="Tác giả"
                fullWidth
                variant="outlined"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                error={err?.data?.errors?.author}
                helperText={err?.data?.errors?.author}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                label="Ngôn ngữ"
                select
                required
                fullWidth
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {bookLanguageItems.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                label="Hình thức"
                select
                required
                fullWidth
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {bookTypeItems.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField label='Danh mục'
                value={cate || ''}
                onChange={(e) => setCate(e.target.value)}
                select
                defaultValue=""
                fullWidth
                slotProps={{
                  select: {
                    onOpen: handleOpenCates,
                    MenuProps: {
                      slotProps: {
                        paper: {
                          style: {
                            maxHeight: 250,
                          },
                        },
                      }
                    }
                  }
                }}
              >
                <MenuItem value=""><em>--Tất cả--</em></MenuItem>
                {cates?.ids?.map((id, index) => {
                  const cate = cates?.entities[id];
                  const cateList = [];

                  cateList.push(
                    <MenuItem key={`cate-${id}-${index}`} value={id}>
                      {cate?.name}
                    </MenuItem>);
                  {
                    cate?.children?.map((child, childIndex) => {
                      cateList.push(
                        <MenuItem sx={{ pl: 3, fontSize: 15 }} key={`child-cate-${child?.id}-${childIndex}`} value={child?.id}>
                          {child?.name}
                        </MenuItem>)
                    })
                  }

                  return cateList;
                })}
                {catesPagination?.totalPages > catesPagination?.number + 1 &&
                  <Box display="flex" justifyContent="center">
                    <Button
                      onClick={handleShowmoreCates}
                      endIcon={<Add />}
                      fullWidth
                    >
                      Tải thêm
                    </Button>
                  </Box>
                }
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField label='Nhà xuất bản'
                value={pub || ''}
                onChange={(e) => setPub(e.target.value)}
                select
                defaultValue=""
                fullWidth
                slotProps={{
                  select: {
                    onOpen: handleOpenPubs,
                    MenuProps: {
                      slotProps: {
                        paper: {
                          style: {
                            maxHeight: 250,
                          },
                        },
                      }
                    }
                  }
                }}
              >
                {pubs?.ids?.map((id, index) => {
                  const pub = pubs?.entities[id];

                  return (
                    <MenuItem key={`pub-${id}-${index}`} value={id}>
                      {pub?.name}
                    </MenuItem>
                  )
                })}
                {pubsPagination?.totalPages > pubsPagination?.number + 1 &&
                  <Box display="flex" justifyContent="center">
                    <Button
                      onClick={handleShowmorePubs}
                      endIcon={<Add />}
                      fullWidth
                    >
                      Tải thêm
                    </Button>
                  </Box>
                }
              </TextField>
            </Grid>
            <Grid size={12}>
              <Title>Giá sản phẩm</Title>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                required
                id="price"
                label="Giá"
                fullWidth
                value={price.price}
                onChange={handleInputChange}
                error={err?.data?.errors?.price}
                helperText={err?.data?.errors?.price}
                slotProps={{
                  input: { inputComponent: NumericFormatCustom }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                id="sale-price"
                label="Giá sale"
                fullWidth
                value={price.price * (1 - price.discount)}
                onChange={handleSaleChange}
                error={err?.data?.errors?.price}
                helperText={err?.data?.errors?.price}
                slotProps={{
                  input: { inputComponent: NumericFormatCustom }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <NumericFormat
                required
                id="discount"
                label="% Sale"
                fullWidth
                suffix="%"
                decimalScale={price.discount >= 1 ? 0 : 2}
                value={price.discount * 100}
                onChange={handleDiscountChange}
                error={err?.data?.errors?.discount}
                helperText={err?.data?.errors?.discount}
                customInput={TextField}
                allowNegative={false}
              />
            </Grid>
            <Grid size={12}>
              <NumericFormat
                required
                id="amount"
                label="Số lượng"
                fullWidth
                variant="outlined"
                value={amount}
                onValueChange={(values) => setAmount(values.value)}
                error={err?.data?.errors?.amount}
                helperText={err?.data?.errors?.amount}
                customInput={TextField}
                allowNegative={false}
              />
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
          onClick={handleClose}
          startIcon={<CloseIcon />}
        >
          Huỷ
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ marginY: '10px' }}
          onClick={handleSubmit}
          startIcon={<Check />}
        >
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog >
  );
}

export default ProductFormDialog