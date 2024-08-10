import styled from 'styled-components'
import { useState, useEffect, lazy, Suspense } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip, FormControlLabel, Switch } from '@mui/material';
import { AutoStories as AutoStoriesIcon, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import { Link, useSearchParams } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDeleteBookMutation, useDeleteBooksMutation, useGetBooksByFilterQuery } from '../../../features/books/booksApiSlice';
import { useGetCategoriesQuery } from '../../../features/categories/categoriesApiSlice';
import { useGetPublishersQuery } from '../../../features/publishers/publishersApiSlice';
import CustomProgress from '../../custom/CustomProgress';
import PropTypes from 'prop-types';
import useAuth from '../../../hooks/useAuth';

const AddProductDialog = lazy(() => import('../dialog/AddProductDialog'));
const EditProductDialog = lazy(() => import('../dialog/EditProductDialog'));

//#region preStyled
const ItemTitle = styled.p`
  font-size: 12px;
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
`

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
    id: 'image',
    align: 'left',
    width: '100px',
    disablePadding: false,
    sortable: false,
    label: 'Ảnh',
  },
  {
    id: 'price',
    align: 'right',
    width: '120px',
    disablePadding: false,
    sortable: true,
    label: 'Giá(đ)',
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

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, selectedAll }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow sx={{ height: '58px' }}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && selectedAll == false}
            checked={selectedAll == true}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'Chọn tất cả',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            style={{ width: headCell.width }}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <TableSortLabel hideSortIcon>
                {headCell.label}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
};

function EnhancedTableToolbar({ loadCates, cates, loadPubs, pubs, numSelected, selectedAll, handleDeleteMultiples }) {
  const [openNew, setOpenNew] = useState(false);

  const handleClickOpenNew = () => { setOpenNew(true) }
  const handleDelete = () => { if (handleDeleteMultiples) handleDeleteMultiples() }

  return (
    <Toolbar
      sx={{
        backgroundColor: '#63e399',
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: '#63e3a7',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center' }}
          variant="h6"
          component="div"
        >
          <AutoStoriesIcon sx={{ marginRight: '10px' }} />
          {selectedAll ? "Chọn tất cả" : `Chọn ${numSelected} sản phẩm`}
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          <AutoStoriesIcon sx={{ color: 'white', marginRight: '10px' }} />
          Danh sách sản phẩm
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Xoá sản phẩm đã chọn">
          <IconButton onClick={handleDelete}>
            <DeleteIcon sx={{ color: 'white', "&:hover": { transform: 'scale(1.05)', color: '#e66161' } }} />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title="Thêm sản phẩm mới">
            <IconButton sx={{
              "&:focus": {
                outline: 'none',
              }
            }}
              onClick={handleClickOpenNew}>
              <AddIcon sx={{ color: 'white' }} />
            </IconButton>
          </Tooltip>
        </>
      )}

      <Suspense fallback={<></>}>
        {openNew ?
          <AddProductDialog {...{ open: openNew, setOpen: setOpenNew, loadCates, cates, loadPubs, pubs }} />
          : null
        }
      </Suspense>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selectedAll: PropTypes.bool.isRequired,
};

//#endregion

export default function TableBooks({ setBookCount, sellerName, mini }) {
  //#region construct
  const [searchParams, setSearchParams] = useSearchParams();
  const { username, roles } = useAuth();
  const [id, setId] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [dense, setDense] = useState(true);
  const [seller, setSeller] = useState(!(roles?.find(role => ['ROLE_ADMIN'].includes(role))));
  const [openEdit, setOpenEdit] = useState(false);
  const [pagination, setPagination] = useState({
    currPage: searchParams.get("pageNo") ? searchParams.get("pageNo") - 1 : 0,
    pageSize: searchParams.get("pSize") ?? (mini ? 5 : 10),
    totalPages: 0,
    sortBy: searchParams.get("sortBy") ?? "id",
    sortDir: searchParams.get("sortDir") ?? "asc",
  })

  //Delete hook
  const [deleteBook, { isLoading: deleting }] = useDeleteBookMutation();
  const [deleteMultipleBook, { isLoading: deletingMultiple }] = useDeleteBooksMutation();

  //Fetch books
  const { data, isLoading, isSuccess, isError } = useGetBooksByFilterQuery({
    page: pagination?.currPage,
    size: pagination?.pageSize,
    sortBy: pagination?.sortBy,
    sortDir: pagination?.sortDir,
    seller: `${(!seller ? "" : username)}${(sellerName ?? '')}`,
  })
  const { data: cates, isLoading: loadCates } = useGetCategoriesQuery();
  const { data: pubs, isLoading: loadPubs } = useGetPublishersQuery();

  //Set pagination after fetch
  useEffect(() => {
    if (!isLoading && isSuccess && data) {
      setPagination({
        ...pagination,
        totalPages: data?.info?.totalPages,
        currPage: data?.info?.currPage,
        pageSize: data?.info?.pageSize
      });
    }
  }, [data])

  // useEffect(() => {
  //   if (!loading && setBookCount) {
  //     setBookCount(rows?.totalElements);
  //   }
  // }, [loading]);

  const handleRequestSort = (property) => {
    const isAsc = (pagination.sortBy === property && pagination.sortDir === 'asc');
    setPagination({
      ...pagination,
      sortBy: property,
      sortDir: isAsc ? 'desc' : 'asc'
    })
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data?.ids?.length?.content?.map((n) => n.id);
      setSelected(newSelected);
      setSelectedAll(true);
      return;
    }
    setSelected([]);
    setSelectedAll(false);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
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
    if (page == 1) {
      searchParams.delete("pageNo");
      setSearchParams(searchParams);
    } else {
      searchParams.set("pageNo", page);
      setSearchParams(searchParams);
    }
    setPagination({ ...pagination, currPage: page - 1 });
  };

  const handleChangeRowsPerPage = (e) => {
    const newValue = parseInt(e.target.value, 10);
    handleChangePage(1);
    if (newValue == 16) {
      searchParams.delete("pSize");
      setSearchParams(searchParams);
    } else {
      searchParams.set("pSize", newValue);
      setSearchParams(searchParams);
    }
    setPagination({ ...pagination, pageSize: newValue });
  };

  const handleChangeDense = (e) => {
    setDense(e.target.checked);
  };

  const handleChangeSeller = (e) => {
    handleChangePage(1)
    setSeller(e.target.checked);
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

    deleteMultipleBook({ ids: selected }).unwrap()
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

  const isSelected = (name) => (selected.indexOf(name) !== -1 || selectedAll);
  const emptyRows = Math.max(0, (pagination.currPage) * pagination.pageSize - data?.info?.totalElements);
  //#endregion

  let booksRows;

  if (isLoading) {
    booksRows = (
      <TableRow>
        <TableCell
          scope="row"
          padding="none"
          align="center"
          colSpan={6}>
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

        return (
          <TableRow
            hover
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={id}
            selected={isItemSelected}
            sx={{ cursor: 'pointer' }}
          >
            <TableCell padding="checkbox">
              <Checkbox color="primary"
                onChange={(event) => handleClick(event, book.id)}
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
              <Link to={`/detail/${id}`}>
                <ItemTitle>{book.title}</ItemTitle>
              </Link>
            </TableCell>
            <TableCell align="left">
              <LazyLoadImage
                src={book.image}
                height={45}
                width={45}
              />
            </TableCell>
            <TableCell align="right">{book.price.toLocaleString()} đ</TableCell>
            <TableCell align="right">
              <IconButton sx={{ "&:hover": { transform: 'scale(1.05)', color: '#63e399' } }}
                onClick={(e) => handleClickOpenEdit(id)}>
                <EditIcon />
              </IconButton>
              <IconButton sx={{ "&:hover": { transform: 'scale(1.05)', color: '#e66161' } }}
                onClick={(e) => handleDelete(id)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        )
      })
      :
      <Box sx={{ marginTop: 5, marginBottom: '90dvh' }}>Không tìm thấy sản phẩm nào!</Box>
  } else if (isError) {
    booksRows = (
      <Box sx={{ marginTop: 5, marginBottom: '90dvh' }}>{error?.error}</Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: '2px' }}>
        <EnhancedTableToolbar {...{ loadCates, cates, loadPubs, pubs, numSelected: selected.length, selectedAll, handleDeleteMultiples }} />
        <TableContainer sx={{ maxHeight: mini ? 330 : 500 }}>
          <Table
            sx={{ minWidth: mini ? 500 : 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              {...{
                numSelected: selected.length, selectedAll, pagination, rowCount: data?.ids?.length,
                onSelectAllClick: handleSelectAllClick, onRequestSort: handleRequestSort
              }}
            />
            <TableBody>
              {booksRows}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 63 : 83) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <Suspense fallback={<></>}>
              {openEdit ?
                <EditProductDialog {...{ id, open: openEdit, setOpen: setOpenEdit, loadCates, cates, loadPubs, pubs }} />
                : null}
            </Suspense>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          labelRowsPerPage={"Hiển thị"}
          labelDisplayedRows={function defaultLabelDisplayedRows({ from, to, count }) { return `${from}–${to} trong số ${count !== -1 ? count : `Có hơn ${to}`}`; }}
          count={data?.info?.totalElements ?? 0}
          page={pagination?.currPage}
          rowsPerPage={pagination?.pageSize}
          showFirstButton
          showLastButton
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Box sx={{ height: '10px' }}>
        {isLoading && (<CustomProgress color="primary" />)}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <FormControlLabel
            control={<Switch sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#63e399',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#63e399',
              },
            }}
              checked={dense} onChange={handleChangeDense} />}
            label="Thu gọn"
          />
          {roles?.find(role => ['ROLE_ADMIN'].includes(role)) && !sellerName
            ? <FormControlLabel
              control={<Switch sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#63e399',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#63e399',
                },
              }}
                checked={seller} onChange={handleChangeSeller} />}
              label="Theo người bán"
            />
            : null
          }
        </Box>
        {mini ?
          <Link to={'/manage-books'} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 10 }}>Xem tất cả</Link>
          : null
        }
      </Box>
    </Box>
  );
}

TableBooks.defaultProps = {
  mini: false,
};
