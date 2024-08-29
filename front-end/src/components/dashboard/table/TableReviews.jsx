import { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Checkbox, IconButton, FormControlLabel, Switch, Avatar, Grid2 as Grid, TextField, MenuItem } from '@mui/material';
import { Delete as DeleteIcon, Search, Star } from '@mui/icons-material';
import { Link } from "react-router-dom";
import { useDeleteReviewMutation, useDeleteReviewsMutation, useGetReviewsByBookIdQuery, useGetReviewsByUserIdQuery, useGetReviewsQuery } from '../../../features/reviews/reviewsApiSlice';
import { FooterLabel, ItemTitle, FooterContainer } from '../custom/ShareComponents';
import useAuth from "../../../hooks/useAuth";
import CustomTablePagination from '../custom/CustomTablePagination';
import CustomProgress from '../../custom/CustomProgress';
import CustomTableHead from '../custom/CustomTableHead';
import CustomTableToolbar from '../custom/CustomTableToolbar';

const headCells = [
  {
    id: 'id',
    align: 'center',
    width: '70px',
    disablePadding: false,
    sortable: true,
    hideOnMinimize: true,
    label: 'ID',
  },
  {
    id: 'user.userName',
    align: 'left',
    width: '200px',
    disablePadding: false,
    sortable: true,
    label: 'Thành viên',
  },
  {
    id: 'rating',
    align: 'left',
    disablePadding: false,
    sortable: true,
    label: 'Đánh giá',
  },
  {
    id: 'rDate',
    align: 'left',
    width: '150px',
    disablePadding: false,
    sortable: true,
    label: 'Thời gian',
  },
  {
    id: 'book.title',
    align: 'left',
    disablePadding: false,
    sortable: true,
    label: 'Sản phẩm',
  },
  {
    id: 'action',
    width: '35px',
    disablePadding: false,
    sortable: false,
    hideOnMinimize: true,
    label: '',
  },
];

function FilterContent({ }) {
  return (
    <Grid container spacing={1} sx={{ width: '80vw', padding: '10px' }}>
      <Grid item xs={12} sm={4}>
        <TextField label='Đánh giá'
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

export default function TableReviews({ setReviewCount, bookId, userId, mini = false }) {
  //#region construct
  const { roles } = useAuth();
  const isAdmin = useState(roles?.find(role => ['ROLE_ADMIN'].includes(role)));
  const [selected, setSelected] = useState([]);
  const [deselected, setDeseletected] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [dense, setDense] = useState(true);
  const [isEmployees, setIsEmployees] = useState(false);
  const [pagination, setPagination] = useState({
    currPage: 0,
    pageSize: mini ? 5 : 10,
    totalPages: 0,
    sortBy: "id",
    sortDir: "asc",
  })
  const { data, isLoading, isSuccess, isError, error } =
    bookId ? useGetReviewsByBookIdQuery({
      page: pagination.currPage,
      size: pagination.pageSize,
      sortBy: pagination.sortBy,
      sortDir: pagination.sortDir,
      id: bookId
    }) : userId ?
      useGetReviewsByUserIdQuery({
        page: pagination.currPage,
        size: pagination.pageSize,
        sortBy: pagination.sortBy,
        sortDir: pagination.sortDir,
        id: userId
      })
      :
      useGetReviewsQuery({
        page: pagination.currPage,
        size: pagination.pageSize,
        sortBy: pagination.sortBy,
        sortDir: pagination.sortDir,
        isEmployees: isEmployees
      })

  //Delete hook
  const [deleteReview, { isLoading: deleting }] = useDeleteReviewMutation();
  const [deleteMultipleReviews, { isLoading: deletingMultiple }] = useDeleteReviewsMutation();


  //Set pagination after fetch
  useEffect(() => {
    if (!isLoading && isSuccess && data) {
      setPagination({
        ...pagination,
        totalPages: data?.info?.totalPages,
        currPage: data?.info?.currPage,
        pageSize: data?.info?.pageSize
      });
      if (setReviewCount) setReviewCount(data?.info?.totalElements);
    }
  }, [data])

  const handleRequestSort = (e, property) => {
    const isAsc = (pagination.sortBy === property && pagination.sortDir === 'asc');
    const sortDir = isAsc ? 'desc' : 'asc';
    setPagination({ ...pagination, sortBy: property, sortDir: sortDir });
  };

  const handleSelectAllClick = (e) => {
    if (e.target.checked) { //Selected all
      setSelectedAll(true);
      return;
    }

    //Unselected all
    setSelected([]);
    setDeseletected([]);
    setSelectedAll(false);
  };

  const handleClick = (e, id) => {
    if (selectedAll) {
      //Set unselected elements for reverse
      const deselectedIndex = deselected?.indexOf(id);
      let newDeselected = [];

      if (deselectedIndex === -1) {
        newDeselected = newDeselected.concat(deselected, id);
      } else if (deselectedIndex === 0) {
        newDeselected = newDeselected.concat(deselected.slice(1));
      } else if (deselectedIndex === deselected?.length - 1) {
        newDeselected = newDeselected.concat(deselected.slice(0, -1));
      } else if (deselectedIndex > 0) {
        newDeselected = newDeselected.concat(
          deselected.slice(0, deselectedIndex),
          deselected.slice(deselectedIndex + 1),
        );
      }

      setDeseletected(newDeselected);
      if (newDeselected.length == data?.info?.totalElements) {
        setDeseletected([]);
        setSelectedAll(false);
      }
    } else {
      //Set main selected elements
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

      setSelected(newSelected);
      if (newSelected.length == data?.info?.totalElements) {
        setSelectedAll(true);
        setSelected([]);
      }
    }
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

  const handleChangeFilter = (e) => {
    handleChangePage(0);
    setIsEmployees(e.target.checked);
  };

  const handleDelete = async (id) => {
    if (pending) return;
    setPending(true);
    const { enqueueSnackbar } = await import('notistack');

    deleteReview({ id }).unwrap()
      .then((data) => {
        //Unselected
        const selectedIndex = selected?.indexOf(id);
        let newSelected = [];

        if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
          setSelected(newSelected);
        }

        enqueueSnackbar('Đã xoá đánh giá!', { variant: 'success' });
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
          enqueueSnackbar('Xoá đánh giá thất bại!', { variant: 'error' });
        }
        setPending(false);
      })
  };

  const handleDeleteMultiples = async () => {
    if (pending) return;
    setPending(true);
    const { enqueueSnackbar } = await import('notistack');

    deleteMultipleReviews({ ids: selected }).unwrap()
      .then((data) => {
        //Unselected
        setSelected([]);
        setSelectedAll(false);
        enqueueSnackbar('Đã xoá đánh giá!', { variant: 'success' });
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
          enqueueSnackbar('Xoá đánh giá thất bại!', { variant: 'error' });
        }
        setPending(false);
      })
  };

  const isSelected = (id) => (selected?.indexOf(id) !== -1 || (selectedAll && deselected?.indexOf(id) === -1));
  const numSelected = () => (selectedAll ? data?.info?.totalElements - deselected?.length : selected?.length);
  const colSpan = () => (mini ? headCells.filter((h) => !h.hideOnMinimize).length : headCells.length + 1);
  //#endregion

  let reviewsRows;

  if (isLoading) {
    reviewsRows = (
      <TableRow>
        <TableCell
          scope="row"
          padding="none"
          align="center"
          colSpan={colSpan()}
          sx={{ position: 'relative', height: '40dvh' }}
        >
          <CustomProgress color="primary" />
        </TableCell>
      </TableRow>
    )
  } else if (isSuccess) {
    const { ids, entities } = data;

    reviewsRows = ids?.length
      ? ids?.map((id, index) => {
        const review = entities[id];
        const isItemSelected = isSelected(id);
        const labelId = `enhanced-table-checkbox-${index}`;
        const date = new Date(review.date);

        return (
          <TableRow
            hover
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={id}
            selected={isItemSelected}
          >
            {!mini &&
              <>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    onChange={(event) => handleClick(event, id)}
                    checked={isItemSelected}
                    inputProps={{
                      'aria-labelledby': labelId,
                    }}
                  />
                </TableCell>
                <TableCell component="th" id={labelId} scope="row" padding="none" align="center">#{('00000' + id).slice(-5)}</TableCell>
              </>
            }
            <TableCell align="left">
              <Link to={`/user/${review.userId}`} style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ marginRight: 1 }}>{review?.userName?.charAt(0) ?? ''}</Avatar>
                <Box>
                  <ItemTitle>{review.userName}</ItemTitle>
                  <ItemTitle className="secondary">ID: #{('00000' + review.userId).slice(-5)}</ItemTitle>
                </Box>
              </Link>
            </TableCell>
            <TableCell align="left">
              <Box>
                <ItemTitle>Đánh giá: {review.rating} <Star fontSize="15px" color="primary" /></ItemTitle>
                <ItemTitle className="review">{review.content}</ItemTitle>
              </Box>
            </TableCell>
            <TableCell align="left">
              <Box>
                <ItemTitle>{`${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`}</ItemTitle>
                <ItemTitle className="secondary">{`${('0' + date?.getHours()).slice(-2)}:${('0' + date?.getMinutes()).slice(-2)}`}</ItemTitle>
              </Box>
            </TableCell>
            <TableCell align="left">
              <Link to={`/detail/${review.bookId}`} >
                <ItemTitle>{review.bookTitle}</ItemTitle>
                <ItemTitle className="secondary">ID: #{('00000' + review.bookId).slice(-5)}</ItemTitle>
              </Link>
            </TableCell>
            {(!mini && isAdmin) &&
              <TableCell align="right">
                <IconButton onClick={(e) => handleDelete(id)}><DeleteIcon /></IconButton>
              </TableCell>
            }
          </TableRow>
        )
      })
      :
      <TableRow>
        <TableCell
          scope="row"
          padding="none"
          align="center"
          colSpan={colSpan()}
          sx={{ height: '40dvh' }}
        >
          <Box>Không tìm thấy đánh giá nào!</Box>
        </TableCell>
      </TableRow >
  } else if (isError) {
    reviewsRows = (
      <TableRow>
        <TableCell
          scope="row"
          padding="none"
          align="center"
          colSpan={colSpan()}
          sx={{ height: '40dvh' }}
        >
          <Box>{error?.error}</Box>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableContainer component={Paper}>
      <CustomTableToolbar
        numSelected={numSelected()}
        icon={<Star />}
        title={'đánh giá'}
        submitIcon={<DeleteIcon />}
        submitTooltip={'Xoá đánh giá đã chọn'}
        onSubmitSelected={handleDeleteMultiples}
        filterComponent={<FilterContent />}
      />
      <TableContainer sx={{ maxHeight: mini ? 330 : 'auto' }}>
        <Table
          stickyHeader
          sx={{ minWidth: mini ? 500 : 750 }}
          aria-labelledby="tableTitle"
          size={dense ? 'small' : 'medium'}
        >
          <CustomTableHead
            headCells={headCells}
            numSelected={numSelected()}
            sortBy={pagination.sortBy}
            sortDir={pagination.sortDir}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            selectedAll={selectedAll}
            mini={mini}
          />
          <TableBody>
            {reviewsRows}
          </TableBody>
        </Table>
      </TableContainer>
      <FooterContainer>
        {mini ?
          <Link to={'/manage-reviews'}>Xem tất cả</Link>
          :
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label={<FooterLabel>Thu gọn</FooterLabel>}
          />
        }
        <CustomTablePagination
          pagination={pagination}
          onPageChange={handleChangePage}
          onSizeChange={handleChangeRowsPerPage}
          count={data?.info?.totalElements ?? 0}
        />
      </FooterContainer>
    </TableContainer>
  );
}
