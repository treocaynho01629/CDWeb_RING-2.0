import { useState, useEffect, lazy, Suspense } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Checkbox, FormControlLabel, Switch, Avatar, Chip, Grid2 as Grid, TextField, MenuItem, TableFooter, IconButton } from '@mui/material';
import { Group as GroupIcon, Edit as EditIcon, Delete as DeleteIcon, Search, MoreHoriz } from '@mui/icons-material';
import { Link } from 'react-router';
import { useDeleteUserMutation, useDeleteUsersMutation, useGetUsersQuery } from '../../../features/users/usersApiSlice';
import { FooterLabel, ItemTitle, FooterContainer } from '../custom/ShareComponents';
import { idFormatter } from '../../../ultils/covert';
import useAuth from "../../../hooks/useAuth";
import CustomTablePagination from '../custom/CustomTablePagination';
import CustomProgress from '../../custom/CustomProgress';
import CustomTableToolbar from '../custom/CustomTableToolbar';
import CustomTableHead from '../custom/CustomTableHead';

const EditAccountDialog = lazy(() => import('../dialog/EditAccountDialog'));

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
    id: 'authorities',
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

function FilterContent({ filter }) {
  return (
    <Grid container spacing={1} sx={{ width: '80vw', padding: '10px' }}>
      <Grid item xs={12} sm={4}>
        <TextField label='Quyền'
          // value={currAddress?.city || ''}
          // onChange={(e) => setCurrAddress({ ...currAddress, city: e.target.value, ward: '' })}
          select
          defaultValue=""
          fullWidth
          size="small"
        >
          <MenuItem disabled value=""><em>--Quyền--</em></MenuItem>
          {!filter && <MenuItem value={1}>MEMBER</MenuItem>}
          <MenuItem value={2}>SELLER</MenuItem>
          <MenuItem value={3}>ADMIN</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={8}>
        <TextField
          placeholder='Tìm kiếm... '
          // onChange={(e) => setSearchField(e.target.value)}
          // value={searchField}
          id="search-user"
          size="small"
          fullWidth
          InputProps={{ startAdornment: <Search sx={{ marginRight: 1 }} /> }}
        />
      </Grid>
    </Grid>
  )
}

export default function TableUsers({ setUserCount, mini = false }) {
  //#region construct
  const { roles } = useAuth();
  const isAdmin = useState(roles?.find(role => ['ROLE_ADMIN'].includes(role)));
  const [id, setId] = useState([]);
  const [selected, setSelected] = useState([]);
  const [deselected, setDeseletected] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [dense, setDense] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [isEmployees, setIsEmployees] = useState(false);
  const [pending, setPending] = useState(false);
  const [pagination, setPagination] = useState({
    currPage: 0,
    pageSize: mini ? 5 : 10,
    totalPages: 0,
    sortBy: "id",
    sortDir: "asc",
  })
  const { isLoading, isSuccess, isError, error, data } = useGetUsersQuery({
    page: pagination.number,
    size: pagination.size,
    sortBy: pagination.sortBy,
    sortDir: pagination.sortDir,
    isEmployees: isEmployees
  })

  //Delete hook
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
  const [deleteMultipleUsers, { isLoading: deletingMultiple }] = useDeleteUsersMutation();

  //Set pagination after fetch
  useEffect(() => {
    if (!isLoading && isSuccess && data) {
      setPagination({
        ...pagination,
        totalPages: data?.page?.totalPages,
        currPage: data?.page?.number,
        pageSize: data?.page?.size
      });
      if (setUserCount) setUserCount(data?.page?.totalElements);
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

  const handleClickOpenEdit = (id) => {
    setId(id);
    setOpenEdit(true);
  };

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
          enqueueSnackbar(err?.data?.errors?.errorMessage, { variant: 'error' });
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
    //       enqueueSnackbar(err?.data?.errors?.errorMessage, { variant: 'error' });
    //     } else if (err?.status === 400) {
    //       enqueueSnackbar('Id không hợp lệ!', { variant: 'error' });
    //     } else {
    //       enqueueSnackbar('Xoá thành viên thất bại!', { variant: 'error' });
    //     }
    //     setPending(false);
    //   })
  };

  const isSelected = (id) => (selected?.indexOf(id) !== -1 || (selectedAll && deselected?.indexOf(id) === -1));
  const numSelected = () => (selectedAll ? data?.page?.totalElements - deselected?.length : selected?.length);
  const colSpan = () => (mini ? headCells.filter((h) => !h.hideOnMinimize).length : headCells.length + 1);
  //#endregion

  let usersRows;

  if (isLoading) {
    usersRows = (
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

    usersRows = ids?.length
      ? ids?.map((id, index) => {
        const user = entities[id];
        const isItemSelected = isSelected(id);
        const labelId = `enhanced-table-checkbox-${index}`;
        const role = user.authorities.length;

        return (
          <TableRow
            hover
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={id}
            selected={isItemSelected}
          >
            {!mini &&
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
            }
            <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
              <Link to={`/user/${id}`}>{idFormatter(id)}</Link>
            </TableCell>
            <TableCell align="left">
              <Link to={`/user/${id}`} style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ marginRight: 1 }}>{user?.username?.charAt(0) ?? ''}</Avatar>
                <Box>
                  <ItemTitle>{user.username}</ItemTitle>
                  <ItemTitle className="secondary">{user.email}</ItemTitle>
                </Box>
              </Link>
            </TableCell>
            <TableCell align="left">
              <Chip label={role == 3 ? 'Admin' :
                role == 2 ? 'Nhân viên' : 'Thành viên'}
                color={role == 3 ? 'primary' :
                  role == 2 ? 'info' : 'default'}
                sx={{ fontWeight: 'bold' }}
              />
            </TableCell>
            {!mini &&
              <TableCell align="right">
                <IconButton onClick={(e) => handleClickOpenEdit(id)}><MoreHoriz /></IconButton>
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
          colSpan={colSpan()}
          sx={{ height: '40dvh' }}
        >
          <Box>{error?.error || 'Đã xảy ra lỗi'}</Box>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableContainer component={Paper}>
      <CustomTableToolbar
        numSelected={numSelected()}
        icon={<GroupIcon />}
        title={`${isEmployees ? 'nhân viên' : 'thành viên'}`}
        submitIcon={<DeleteIcon />}
        submitTooltip={`Xoá ${isEmployees ? 'nhân viên' : 'thành viên'} đã chọn`}
        onSubmitSelected={handleDeleteMultiples}
        filterComponent={<FilterContent filter={isEmployees} />}
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
            {usersRows}
          </TableBody>
        </Table>
      </TableContainer>
      <FooterContainer>
        {mini ?
          <Link to={'/manage-users'}>Xem tất cả</Link>
          :
          <Box>
            <FormControlLabel
              control={<Switch checked={dense} onChange={handleChangeDense} />}
              label={<FooterLabel>Thu gọn</FooterLabel>}
            />
            {isAdmin &&
              <FormControlLabel
                control={<Switch checked={isEmployees} onChange={handleChangeFilter} />}
                label={<FooterLabel>Lọc nhân viên</FooterLabel>}
              />
            }
          </Box>
        }
        <CustomTablePagination
          pagination={pagination}
          onPageChange={handleChangePage}
          onSizeChange={handleChangeRowsPerPage}
          count={data?.page?.totalElements ?? 0}
        />
      </FooterContainer>
      <Suspense fallback={<></>}>
        {openEdit ?
          <EditAccountDialog
            id={id}
            open={openEdit}
            setOpen={setOpenEdit}
          />
          : null
        }
      </Suspense>
    </TableContainer>
  );
}
