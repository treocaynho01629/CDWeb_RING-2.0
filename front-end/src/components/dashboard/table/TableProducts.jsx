import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';
import { useState, useEffect, lazy, Suspense } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Checkbox, IconButton, FormControlLabel, Switch, LinearProgress, Chip } from '@mui/material';
import { AutoStories as AutoStoriesIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Link } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDeleteBookMutation, useDeleteBooksMutation, useGetBooksByFilterQuery } from '../../../features/books/booksApiSlice';
import CustomProgress from '../../custom/CustomProgress';
import useAuth from '../../../hooks/useAuth';
import CustomTableToolbar from '../custom/CustomTableToolbar';
import CustomTableHead from '../custom/CustomTableHead';
import CustomTablePagination from '../custom/CustomTablePagination';

const EditProductDialog = lazy(() => import('../dialog/EditProductDialog'));

//#region preStyled
const ItemTitle = styled.p`
    font-size: 12px;
    margin: 5px 0;
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

    &.secondary {
      color: ${props => props.theme.palette.text.secondary};
    }
`

const StyledIconButton = muiStyled(IconButton)(({ theme }) => ({
  color: 'inherit',

  '&:hover': {
    transform: 'scale(1.05)',
    color: theme.palette.primary.main,

    '&.error': {
      color: theme.palette.error.main,
    },
  },
}));
//#endregion

const headCells = [
  {
    id: 'id',
    align: 'center',
    width: '70px',
    disablePadding: false,
    sortable: true,
    label: 'ID',
  },
  {
    id: 'title',
    align: 'left',
    width: '500px',
    disablePadding: false,
    sortable: true,
    label: 'Tiêu đề',
  },
  {
    id: 'price',
    align: 'left',
    width: '120px',
    disablePadding: false,
    sortable: true,
    label: 'Giá(đ)',
  },
  {
    id: 'amount',
    align: 'left',
    width: '150px',
    disablePadding: false,
    sortable: true,
    label: 'Số lượng',
  },
  {
    id: 'amount',
    align: 'left',
    width: '150px',
    disablePadding: false,
    sortable: true,
    label: 'Trạng thái',
  },
  {
    id: 'action',
    align: 'right',
    width: '150px',
    disablePadding: false,
    sortable: false,
    label: 'Hành động',
  },
];

function FilterContent({ }) {
  return (
    <Grid container spacing={1} sx={{ width: '80vw', padding: '10px' }}>
      <Grid item xs={12} sm={4}>
        <TextField label='Temp'
          // value={currAddress?.city || ''}
          // onChange={(e) => setCurrAddress({ ...currAddress, city: e.target.value, ward: '' })}
          select
          defaultValue=""
          fullWidth
          size="small"
        >
          <MenuItem disabled value=""><em>--Tất cả--</em></MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={1}>1</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={8}>
        <TextField
          placeholder='Tìm kiếm... '
          // onChange={(e) => setSearchField(e.target.value)}
          // value={searchField}
          id="search-review"
          size="small"
          fullWidth
          InputProps={{ startAdornment: <Search sx={{ marginRight: 1 }} /> }}
        />
      </Grid>
    </Grid>
  )
}

export default function TableProducts({ setBookCount, sellerName, mini = false }) {
  //#region construct
  const { username, roles } = useAuth();
  const isAdmin = useState(roles?.find(role => ['ROLE_ADMIN'].includes(role)));
  const [id, setId] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [dense, setDense] = useState(true);
  const [isSeller, setIsSeller] = useState(!(roles?.find(role => ['ROLE_ADMIN'].includes(role))));
  const [openEdit, setOpenEdit] = useState(false);
  const [pending, setPending] = useState(false);
  const [pagination, setPagination] = useState({
    currPage: 0,
    pageSize: mini ? 5 : 10,
    totalPages: 0,
    sortBy: "id",
    sortDir: "asc",
  })

  //Delete hook
  const [deleteBook, { isLoading: deleting }] = useDeleteBookMutation();
  const [deleteMultipleBooks, { isLoading: deletingMultiple }] = useDeleteBooksMutation();

  //Fetch books
  const { data, isLoading, isSuccess, isError } = useGetBooksByFilterQuery({
    page: pagination?.currPage,
    size: pagination?.pageSize,
    sortBy: pagination?.sortBy,
    sortDir: pagination?.sortDir,
    seller: `${(isSeller ? username : sellerName ?? '')}`,
  })

  //Set pagination after fetch
  useEffect(() => {
    if (!isLoading && isSuccess && data) {
      setPagination({
        ...pagination,
        totalPages: data?.info?.totalPages,
        currPage: data?.info?.currPage,
        pageSize: data?.info?.pageSize
      });
      setBookCount(data?.info?.totalElements);
    }
  }, [data])

  const handleRequestSort = (e, property) => {
    const isAsc = (pagination.sortBy === property && pagination.sortDir === 'asc');
    const sortDir = isAsc ? 'desc' : 'asc';
    setPagination({ ...pagination, sortBy: property, sortDir: sortDir });
  };

  const handleSelectAllClick = (e) => {
    if (e.target.checked) { //Selected all
      const newSelected = data?.content?.map((n) => n.id);
      setSelected(newSelected);
      setSelectedAll(true);
      return;
    }

    //Unselected all
    setSelected([]);
    setSelectedAll(false);
  };

  const handleClick = (e, id) => {
    const selectedIndex = selected?.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected?.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelectedAll(false);
    setSelected(newSelected);
  };

  const handleChangePage = (page) => {
    setPagination({ ...pagination, currPage: page });
  };

  const handleChangeRowsPerPage = (size) => {
    handleChangePage(0);
    const newValue = parseInt(size, 10);
    setPagination({ ...pagination, pageSize: newValue });
  };

  const handleChangeDense = (e) => {
    setDense(e.target.checked);
  };

  const handleChangeSeller = (e) => {
    handleChangePage(1)
    setIsSeller(e.target.checked);
  };

  const handleClickOpenEdit = (id) => {
    setId(id);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {
    if (pending) return;
    setPending(true);
    const { enqueueSnackbar } = await import('notistack');

    deleteBook({ id }).unwrap()
      .then((data) => {
        //Unselected
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
          setSelected(newSelected);
        }

        enqueueSnackbar('Đã xoá sản phẩm!', { variant: 'success' });
        setPending(false);
      })
      .catch((err) => {
        console.error(err);
        if (!err?.status) {
          enqueueSnackbar('Server không phản hồi!', { variant: 'error' });
        } else if (err?.status === 409) {
          enqueueSnackbar(err?.data?.errors?.errorMessage, { variant: 'error' });
        } else if (err?.status === 400) {
          enqueueSnackbar('Id không hợp lệ!', { variant: 'error' });
        } else {
          enqueueSnackbar('Xoá sản phẩm thất bại!', { variant: 'error' });
        }
        setPending(false);
      })
  };

  const handleDeleteMultiples = async () => {
    if (pending) return;
    setPending(true);
    const { enqueueSnackbar } = await import('notistack');

    deleteMultipleBooks({ ids: selected }).unwrap()
      .then((data) => {
        //Unselected
        setSelected([]);
        setSelectedAll(false);
        enqueueSnackbar('Đã xoá sản phẩm!', { variant: 'success' });
        setPending(false);
      })
      .catch((err) => {
        console.error(err);
        if (!err?.status) {
          enqueueSnackbar('Server không phản hồi!', { variant: 'error' });
        } else if (err?.status === 409) {
          enqueueSnackbar(err?.data?.errors?.errorMessage, { variant: 'error' });
        } else if (err?.status === 400) {
          enqueueSnackbar('Id không hợp lệ!', { variant: 'error' });
        } else {
          enqueueSnackbar('Xoá sản phẩm thất bại!', { variant: 'error' });
        }
        setPending(false);
      })
  };

  const isSelected = (id) => (selected?.indexOf(id) !== -1 || selectedAll);
  //#endregion

  let booksRows;

  if (isLoading) {
    booksRows = (
      <TableRow>
        <TableCell
          scope="row"
          padding="none"
          align="center"
          colSpan={6}
          sx={{ position: 'relative', height: '40dvh' }}
        >
          <CustomProgress color="primary" />
        </TableCell>
      </TableRow>
    )
  } else if (isSuccess) {
    const { ids, entities } = data;

    booksRows = ids?.length
      ? ids?.map((id, index) => {
        const book = entities[id];
        const isItemSelected = isSelected(id);
        const labelId = `enhanced-table-checkbox-${index}`;
        const stockProgress = Math.min((book.amount / 199 * 100), 100);
        const stockStatus = stockProgress == 0 ? 'error' : stockProgress < 20 ? 'warning' : stockProgress < 80 ? 'primary' : 'info';
        // const stockStatus = stockProgress == 0 ? 'Ngừng bán' : stockProgress < 20 ? 'Gần hết' : stockProgress < 80 ? 'Bình thường' : 'Mới';

        return (
          <TableRow
            hover
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={id}
            selected={isItemSelected}
          >
            <TableCell padding="checkbox">
              <Checkbox color="primary"
                onChange={(e) => handleClick(e, book.id)}
                checked={isItemSelected}
                inputProps={{
                  'aria-labelledby': labelId,
                }}
              />
            </TableCell>
            <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
              <Link to={`/detail/${id}`}>{id}</Link>
            </TableCell>
            <TableCell align="left">
              <Link to={`/detail/${id}`} style={{ display: 'flex', alignItems: 'center' }}>
                <LazyLoadImage
                  src={`${book.image}?size=small`}
                  height={45}
                  width={45}
                  style={{ marginRight: '10px' }}
                />
                <ItemTitle>{book.title}</ItemTitle>
              </Link>
            </TableCell>
            <TableCell align="left">{book.price.toLocaleString()}đ</TableCell>
            <TableCell align="center">
              <LinearProgress color={stockStatus} variant="determinate" value={stockProgress} />
              <ItemTitle className="secondary">{`${book.amount} trong kho`}</ItemTitle>
            </TableCell>
            <TableCell align="left">
              <Chip label={stockStatus == 'error' ? 'Ngừng bán' :
                stockStatus == 'warning' ? 'Gần hết' :
                  stockStatus == 'primary' ? 'Bình thường' : 'Mới'}
                color={stockStatus}
                sx={{ fontWeight: 'bold' }}
                variant="outlined"
              />
            </TableCell>
            <TableCell align="right" sx={{ color: 'text.secondary' }}>
              <StyledIconButton onClick={(e) => handleClickOpenEdit(id)}>
                <EditIcon />
              </StyledIconButton>
              <StyledIconButton className="error" onClick={(e) => handleDelete(id)}>
                <DeleteIcon />
              </StyledIconButton>
            </TableCell>
          </TableRow>
        )
      })
      :
      <TableRow>
        <TableCell
          scope="row"
          padding="none"
          align="center"
          colSpan={6}
          sx={{ height: '40dvh' }}
        >
          <Box>Không tìm thấy sản phẩm nào!</Box>
        </TableCell>
      </TableRow >
  } else if (isError) {
    booksRows = (
      <TableRow>
        <TableCell
          scope="row"
          padding="none"
          align="center"
          colSpan={6}
          sx={{ height: '40dvh' }}
        >
          <Box>{error?.error}</Box>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={3} sx={{ width: '100%', mb: '2px' }} >
        <CustomTableToolbar
          numSelected={selected?.length ?? 0}
          selectedAll={selectedAll}
          icon={<AutoStoriesIcon />}
          title={'sản phẩm'}
          filterComponent={<FilterContent />}
          handleDeleteMultiples={handleDeleteMultiples} />
        <TableContainer sx={{ maxHeight: mini ? 330 : 'auto' }}>
          <Table
            stickyHeader
            sx={{ minWidth: mini ? 500 : 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <CustomTableHead
              headCells={headCells}
              numSelected={selected?.length ?? 0}
              sortBy={pagination.sortBy}
              sortDir={pagination.sortDir}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data?.totalElements}
              selectedAll={selectedAll}
            />
            <TableBody>
              {booksRows}
            </TableBody>
            <Suspense fallback={<></>}>
              {openEdit ?
                <EditProductDialog
                  id={id}
                  open={openEdit}
                  setOpen={setOpenEdit}
                />
                : null
              }
            </Suspense>
          </Table>
        </TableContainer>
        <CustomTablePagination
          pagination={pagination}
          onPageChange={handleChangePage}
          onSizeChange={handleChangeRowsPerPage}
          count={data?.info?.totalElements ?? 0}
        />
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={dense}
                onChange={handleChangeDense}
              />
            }
            label="Thu gọn"
          />
          {(isAdmin && !sellerName) &&
            <FormControlLabel
              control={<Switch sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#63e399',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#63e399',
                },
              }}
                checked={isSeller} onChange={handleChangeSeller} />}
              label="Theo người bán"
            />
          }
        </Box>
        {mini &&
          <Link to={'/manage-users'} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 10 }}>Xem tất cả</Link>
        }
      </Box>
    </Box>
  );
}
