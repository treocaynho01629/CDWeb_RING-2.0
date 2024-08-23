import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Checkbox, IconButton, FormControlLabel, Switch, Avatar, Grid, TextField, MenuItem } from '@mui/material';
import { Delete as DeleteIcon, Filter, Search, Star } from '@mui/icons-material';
import { Link } from "react-router-dom";
import { useDeleteReviewMutation, useDeleteReviewsMutation, useGetReviewsByBookIdQuery, useGetReviewsByUserIdQuery, useGetReviewsQuery } from '../../../features/reviews/reviewsApiSlice';
import useAuth from "../../../hooks/useAuth";
import CustomTablePagination from '../custom/CustomTablePagination';
import CustomProgress from '../../custom/CustomProgress';
import CustomTableHead from '../custom/CustomTableHead';
import CustomTableToolbar from '../custom/CustomTableToolbar';

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

const ItemContent = styled.p`
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 500px;
	
	@supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
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
    width: '250px',
    disablePadding: false,
    sortable: true,
    label: 'Sản phẩm',
  },
  {
    id: 'action',
    align: 'right',
    width: '35px',
    disablePadding: false,
    sortable: false,
    label: 'Hành động',
  },
];

function FilterContent({  }) {
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
      setReviewCount(data?.info?.totalElements);
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

  const isSelected = (id) => (selected?.indexOf(id) !== -1 || selectedAll);
  //#endregion

  let reviewsRows;

  if (isLoading) {
    reviewsRows = (
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
            <TableCell component="th" id={labelId} scope="row" padding="none" align="center">{id}</TableCell>
            <TableCell align="left">
              <Link to={`/user/${review.userId}`} style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ marginRight: 1 }}>{review?.userName?.charAt(0) ?? ''}</Avatar>
                <Box>
                  <ItemTitle>{review.userName}</ItemTitle>
                  <ItemTitle>ID: {review.userId}</ItemTitle>
                </Box>
              </Link>
            </TableCell>
            <TableCell align="left">
              <Box>
                <ItemTitle>{review.rating} <Star fontSize="15px" color="primary" /></ItemTitle>
                <ItemContent>{review.content}</ItemContent>
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
              </Link>
            </TableCell>
            <TableCell align="right" sx={{ color: 'text.secondary' }}>
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
          filter={isEmployees}
          numSelected={selected?.length ?? 0}
          selectedAll={selectedAll}
          icon={<Star />}
          title={'đánh giá'}
          filterComponent={<FilterContent/>}
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
              {reviewsRows}
            </TableBody>
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
          {/* {isAdmin
            && <FormControlLabel
              control={
                <Switch
                  color="primary"
                  checked={isEmployees}
                  onChange={handleChangeFilter}
                />
              }
              label="Lọc hiển thị tất cả"
            />
          } */}
        </Box>
        {mini &&
          <Link to={'/manage-reviews'} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 10 }}>Xem tất cả</Link>
        }
      </Box>
    </Box>
  );
}
