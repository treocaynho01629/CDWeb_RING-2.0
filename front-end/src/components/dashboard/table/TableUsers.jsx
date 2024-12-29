import { useState, useEffect, lazy, Suspense, useRef, useCallback } from 'react';
import { Box, Stack, Button, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Checkbox, FormControlLabel, Switch, Avatar, Chip, Grid2 as Grid, TextField, MenuItem, IconButton, Toolbar, Menu, ListItemIcon, ListItemText } from '@mui/material';
import { Search, MoreHoriz, Edit, Delete, Visibility, FilterAltOff, Add } from '@mui/icons-material';
import { Link } from 'react-router';
import { useDeleteUserMutation, useDeleteUsersMutation, useGetUsersQuery } from '../../../features/users/usersApiSlice';
import { FooterLabel, ItemTitle, FooterContainer } from '../custom/ShareComponents';
import { idFormatter } from '../../../ultils/covert';
import CustomTablePagination from '../table/CustomTablePagination';
import CustomProgress from '../../custom/CustomProgress';
import CustomTableHead from '../table/CustomTableHead';
import useDeepEffect from '../../../hooks/useDeepEffect';

const EditAccountDialog = lazy(() => import('../dialog/EditAccountDialog'));

const userRoles = [
  {
    value: 1,
    label: 'Thành viên',
  },
  {
    value: 2,
    label: 'Nhân viên',
  },
  {
    value: 3,
    label: 'Admin',
  },
];

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
    id: 'username',
    align: 'left',
    disablePadding: false,
    sortable: true,
    label: 'Tên đăng nhập',
  },
  {
    id: 'name',
    align: 'left',
    width: '150px',
    disablePadding: false,
    sortable: true,
    label: 'Thông tin',
  },
  {
    id: 'roles',
    align: 'left',
    width: '120px',
    disablePadding: false,
    sortable: false,
    label: 'Quyền',
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

function UserFilters({ filters, setFilters }) {
  const inputRef = useRef();

  const handleChangeKeyword = useCallback((e) => {
    e.preventDefault();
    if (inputRef) setFilters(prev => ({ ...prev, keyword: inputRef.current.value }));
  }, []);

  const resetFilter = useCallback(() => {
    setFilters({
      keyword: "",
      roles: "",
    });
  }, []);

  return (
    <Stack width="100%" spacing={1} my={2} direction={{ xs: 'column', md: 'row' }}>
      <TextField label='Quyền'
        value={filters.roles || ''}
        onChange={(e) => setFilters({ ...filters, roles: e.target.value })}
        select
        defaultValue=""
        size="small"
        fullWidth
        sx={{ maxWidth: 200 }}
      >
        <MenuItem value=""><em>--Tất cả--</em></MenuItem>
        {userRoles.map((roles, index) => (
          <MenuItem key={`type-${roles.value}-${index}`} value={roles.value}>
            {roles.label}
          </MenuItem>
        ))}
      </TextField>
      <form style={{ width: '100%' }} onSubmit={handleChangeKeyword}>
        <TextField
          placeholder='Tìm kiếm'
          autoComplete="products"
          id="products"
          size="small"
          inputRef={inputRef}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (< Search sx={{ marginRight: 1 }} />)
            },
          }}
        />
      </form>
      <Box display="flex" justifyContent="center">
        <Button sx={{ width: 125 }} color="error" onClick={resetFilter} startIcon={<FilterAltOff />}>Xoá bộ lọc</Button>
      </Box>
    </Stack >
  )
}

export default function TableUsers() {
  //#region construct
  const [selected, setSelected] = useState([]);
  const [deselected, setDeseletected] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [dense, setDense] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [pending, setPending] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    roles: "",
  })
  const [pagination, setPagination] = useState({
    number: 0,
    size: 10,
    totalPages: 0,
    sortBy: "id",
    sortDir: "desc",
  })

  //Actions
  const [anchorEl, setAnchorEl] = useState(null);
  const [contextId, setContextId] = useState(null); //Current select product's id
  const openContext = Boolean(anchorEl);

  //Delete hook
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
  const [deleteMultipleUsers, { isLoading: deletingMultiple }] = useDeleteUsersMutation();

  const { isLoading, isSuccess, isError, error, data } = useGetUsersQuery({
    page: pagination.number,
    size: pagination.size,
    sortBy: pagination.sortBy,
    sortDir: pagination.sortDir,
    keyword: filters.keyword,
    roles: filters.roles
  })

  //Set pagination after fetch
  useEffect(() => {
    if (!isLoading && isSuccess && data) {
      setPagination({
        ...pagination,
        totalPages: data?.page?.totalPages,
        currPage: data?.page?.number,
        pageSize: data?.page?.size
      });
    }
  }, [data])

  useDeepEffect(() => { handleChangePage(0); }, [filters])

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
      if (newDeselected.length == data?.page?.totalElements) {
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
      if (newSelected.length == data?.page?.totalElements) {
        setSelectedAll(true);
        setSelected([]);
      }
    }
  };

  //Pagination
  const handleChangePage = useCallback((page) => {
    setPagination({ ...pagination, number: page });
  }, []);

  const handleChangeRowsPerPage = useCallback((size) => {
    handleChangePage(0);
    const newValue = parseInt(size, 10);
    setPagination({ ...pagination, size: newValue });
  }, []);

  const handleChangeDense = useCallback((e) => {
    setDense(e.target.checked);
  }, []);

  //Actions
  const handleOpenContext = (e, product) => {
    setAnchorEl(e.currentTarget);
    setContextId(product);
  };

  const handleCloseContext = () => {
    setAnchorEl(null);
    setContextId(null);
  }

  const handleOpenEdit = (id) => {
    setOpenEdit(true);
    setContextId(id);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  }


  const handleDelete = async (id) => {
    if (pending) return;
    setPending(true);
    const { enqueueSnackbar } = await import('notistack');

    deleteUser({ id }).unwrap()
      .then((data) => {
        //Unselected
        const selectedIndex = selected?.indexOf(id);
        let newSelected = [];

        if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
          setSelected(newSelected);
        }

        enqueueSnackbar('Đã xoá thành viên!', { variant: 'success' });
        setPending(false);
      })
      .catch((err) => {
        console.error(err);
        if (!err?.status) {
          enqueueSnackbar('Server không phản hồi!', { variant: 'error' });
        } else if (err?.status === 409) {
          enqueueSnackbar(err?.data?.message, { variant: 'error' });
        } else if (err?.status === 400) {
          enqueueSnackbar('Id không hợp lệ!', { variant: 'error' });
        } else {
          enqueueSnackbar('Xoá thành viên thất bại!', { variant: 'error' });
        }
        setPending(false);
      })
  };

  const handleDeleteMultiples = async () => {
    if (selectedAll) {
      if (deselected.length == 0) {
        console.log('Delete all');
      } else {
        console.log('Delete multiples reverse: ' + deselected);
      }
    } else {
      console.log('Delete multiples: ' + selected);
    }
    // if (pending) return;
    // setPending(true);
    // const { enqueueSnackbar } = await import('notistack');

    // deleteMultipleUsers({ ids: selected }).unwrap()
    //   .then((data) => {
    //     //Unselected
    //     setSelected([]);
    //     setSelectedAll(false);
    //     enqueueSnackbar('Đã xoá thành viên!', { variant: 'success' });
    //     setPending(false);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     if (!err?.status) {
    //       enqueueSnackbar('Server không phản hồi!', { variant: 'error' });
    //     } else if (err?.status === 409) {
    //       enqueueSnackbar(err?.data?.message, { variant: 'error' });
    //     } else if (err?.status === 400) {
    //       enqueueSnackbar('Id không hợp lệ!', { variant: 'error' });
    //     } else {
    //       enqueueSnackbar('Xoá thành viên thất bại!', { variant: 'error' });
    //     }
    //     setPending(false);
    //   })
  };

  const isSelected = (id) => (selected?.indexOf(id) !== -1 || (selectedAll && deselected?.indexOf(id) === -1));
  const numSelected = selectedAll ? data?.page?.totalElements - deselected?.length : selected?.length;
  const colSpan = headCells.length + 1;
  //#endregion

  let usersRows;

  if (isLoading) {
    usersRows = (
      <TableRow>
        <TableCell
          scope="row"
          padding="none"
          align="center"
          colSpan={colSpan}
          sx={{ position: 'relative', height: '40dvh' }}
        >
          <CustomProgress color="primary" />
        </TableCell>
      </TableRow>
    )
  } else if (isSuccess) {
    const { ids, entities } = data;

    usersRows = ids?.length
      ? ids?.map((id, index) => {
        const user = entities[id];
        const isItemSelected = isSelected(id);
        const labelId = `enhanced-table-checkbox-${index}`;
        const roles = user.roles;

        return (
          <TableRow
            hover
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={id}
          >
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                onChange={(e) => handleClick(e, id)}
                checked={isItemSelected}
                inputProps={{
                  'aria-labelledby': labelId,
                }}
              />
            </TableCell>
            <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
              <Link to={`/dashboard/user/${id}`}>{idFormatter(id)}</Link>
            </TableCell>
            <TableCell align="left">
              <Link to={`/dashboard/user/${id}`} style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ marginRight: 1 }}>{user?.username?.charAt(0) ?? ''}</Avatar>
                <Box>
                  <ItemTitle>{user.username}</ItemTitle>
                  <ItemTitle className="secondary">{user.email}</ItemTitle>
                </Box>
              </Link>
            </TableCell>
            <TableCell align="left">
              <ItemTitle>{user?.name}</ItemTitle>
              <ItemTitle className="secondary">{user?.phone}</ItemTitle>
            </TableCell>
            <TableCell align="left">
              <Chip variant="outlined"
                label={roles == 3 ? 'Admin' :
                  roles == 2 ? 'Nhân viên' : 'Thành viên'}
                color={roles == 3 ? 'primary' :
                  roles == 2 ? 'info' : 'default'}
                sx={{ fontWeight: 'bold' }}
              />
            </TableCell>
            <TableCell align="right">
              <IconButton onClick={(e) => handleOpenContext(e, id)}><MoreHoriz /></IconButton>
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
          colSpan={colSpan}
          sx={{ height: '40dvh' }}
        >
          <Box>Không tìm thấy thành viên nào!</Box>
        </TableCell>
      </TableRow >
  } else if (isError) {
    usersRows = (
      <TableRow>
        <TableCell
          scope="row"
          padding="none"
          align="center"
          colSpan={colSpan}
          sx={{ height: '40dvh' }}
        >
          <Box>{error?.error || 'Đã xảy ra lỗi'}</Box>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Paper sx={{ width: '100%', height: '100%' }} elevation={3}>
      <Toolbar><UserFilters {...{ filters, setFilters }} /></Toolbar>
      <TableContainer component={Paper}>
        <Table stickyHeader size={dense ? 'small' : 'medium'}>
          <CustomTableHead
            headCells={headCells}
            numSelected={numSelected}
            sortBy={pagination.sortBy}
            sortDir={pagination.sortDir}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            onSubmitDelete={handleDeleteMultiples}
            selectedAll={selectedAll}
          />
          <TableBody>
            {usersRows}
          </TableBody>
        </Table>
      </TableContainer>
      <FooterContainer>
        <Box pl={2}>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label={<FooterLabel>Thu gọn</FooterLabel>}
          />
        </Box>
        <CustomTablePagination
          pagination={pagination}
          onPageChange={handleChangePage}
          onSizeChange={handleChangeRowsPerPage}
          count={data?.page?.totalElements ?? 0}
        />
      </FooterContainer>
      <Suspense fallback={null}>
        {openEdit &&
          <EditAccountDialog
            id={contextId}
            open={openEdit}
            setOpen={handleCloseEdit}
          />
        }
      </Suspense>
      <Menu
        open={openContext}
        onClose={handleCloseContext}
        anchorEl={anchorEl}
      >
        <Link to={`/dashboard/user/${contextId}`}>
          <MenuItem>
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>Xem chi tiết</ListItemText>
          </MenuItem>
        </Link>
        <MenuItem onClick={() => handleOpenEdit(contextId)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Thay đổi</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDelete(contextId)}>
          <ListItemIcon >
            <Delete color="error" fontSize="small" />
          </ListItemIcon>
          <ListItemText color="error">Xoá</ListItemText>
        </MenuItem>
      </Menu >
    </Paper>
  );
}
