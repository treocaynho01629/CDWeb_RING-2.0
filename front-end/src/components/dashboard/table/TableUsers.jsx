import styled from 'styled-components'
import PropTypes from 'prop-types';
import { styled as muiStyled } from '@mui/material/styles';
import { useState, useEffect, lazy, Suspense } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip, FormControlLabel, Switch, Avatar, Chip, Popover, Grid, TextField, MenuItem } from '@mui/material';
import { Group as GroupIcon, Edit as EditIcon, Delete as DeleteIcon, FilterList, Search } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import { Link } from "react-router-dom";
import { useDeleteUserMutation, useDeleteUsersMutation, useGetUsersQuery } from '../../../features/users/usersApiSlice';
import useAuth from "../../../hooks/useAuth";
import CustomTablePagination from '../custom/CustomTablePagination';
import CustomProgress from '../../custom/CustomProgress';

const EditAccountDialog = lazy(() => import('../dialog/EditAccountDialog'));

//#region styled
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
    id: 'userName',
    align: 'left',
    width: '200px',
    disablePadding: false,
    sortable: true,
    label: 'Tên đăng nhập',
  },
  {
    id: 'authorities',
    align: 'right',
    width: '150px',
    disablePadding: false,
    sortable: false,
    label: 'Quyền',
  },
  {
    id: 'action',
    align: 'right',
    width: '250px',
    disablePadding: false,
    sortable: false,
    label: 'Hành động',
  },
];

function EnhancedTableHead({ onSelectAllClick, sortDir, sortBy, numSelected, onRequestSort, selectedAll }) {
  const createSortHandler = (property) => (e) => { onRequestSort(e, property) };

  return (
    <TableHead>
      <TableRow sx={{ height: '58px' }}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && !selectedAll}
            checked={selectedAll}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'Chọn tất cả' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            style={{ width: headCell.width }}
            sortDirection={sortBy === headCell.id ? sortDir : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={sortBy === headCell.id}
                direction={sortBy === headCell.id ? sortDir : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {sortBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {sortDir === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
  sortDir: PropTypes.oneOf(['asc', 'desc']).isRequired,
};

function EnhancedTableToolbar({ filter, numSelected, selectedAll, handleDeleteMultiples }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => { setAnchorEl(e.currentTarget) }
  const handleClose = () => { setAnchorEl(null) }
  const handleDelete = () => { if (handleDeleteMultiples) handleDeleteMultiples() }

  const open = Boolean(anchorEl);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...((numSelected > 0 || selectedAll) && {
          bgcolor: 'primary.light',
          color: 'primary.contrastText'
        }),
      }}
    >
      {numSelected > 0 || selectedAll ? (
        <Typography
          sx={{ flex: '1 1 100%', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
          variant="h6"
          component="div"
        >
          <GroupIcon sx={{ marginRight: '10px' }} />
          {selectedAll ? "Chọn tất cả" : `Chọn ${numSelected} thành viên`}
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          <GroupIcon sx={{ color: 'text.primary', marginRight: '10px' }} />
          Danh sách {filter ? 'nhân viên' : 'thành viên'}
        </Typography>
      )}

      {(numSelected > 0 || selectedAll) ?
        <Tooltip title="Xoá thành viên đã chọn">
          <StyledIconButton onClick={handleDelete} className="error">
            <DeleteIcon />
          </StyledIconButton>
        </Tooltip>
        :
        <Tooltip title="Lọc thành viên">
          <IconButton onClick={handleClick} >
            <FilterList />
          </IconButton>
        </Tooltip>
      }
      <Popover
        id="filter-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
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
      </Popover>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selectedAll: PropTypes.bool.isRequired,
};

export default function TableUsers({ setUserCount, mini = false }) {
  //#region construct
  const { roles } = useAuth();
  const isAdmin = useState(roles?.find(role => ['ROLE_ADMIN'].includes(role)));
  const [id, setId] = useState([]);
  const [selected, setSelected] = useState([]);
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
    page: pagination.currPage,
    size: pagination.pageSize,
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
        totalPages: data?.info?.totalPages,
        currPage: data?.info?.currPage,
        pageSize: data?.info?.pageSize
      });
      setUserCount(data?.info?.totalElements);
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
    if (pending) return;
    setPending(true);
    const { enqueueSnackbar } = await import('notistack');

    deleteMultipleUsers({ ids: selected }).unwrap()
      .then((data) => {
        //Unselected
        setSelected([]);
        setSelectedAll(false);
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

  const isSelected = (id) => (selected?.indexOf(id) !== -1 || selectedAll);
  //#endregion

  let usersRows;

  if (isLoading) {
    usersRows = (
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
            <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
              {isAdmin ? <Link to={`/user/${id}`}>{id}</Link> : { id }}
            </TableCell>
            <TableCell align="left">
              {isAdmin
                ?
                <Link to={`/user/${id}`} style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ marginRight: 1 }}>{user?.username?.charAt(0) ?? ''}</Avatar>
                  <Box>
                    <ItemTitle>{user.username}</ItemTitle>
                    <ItemTitle>{user.email}</ItemTitle>
                  </Box>
                </Link>
                :
                <>
                  <ItemTitle>{user.username}</ItemTitle>
                  <ItemTitle>{user.email}</ItemTitle>
                </>
              }
            </TableCell>
            <TableCell align="right">
              <Chip label={role == 3 ? 'ADMIN' :
                role == 2 ? 'SELLER' : 'MEMBER'}
                color={role == 3 ? 'primary' :
                  role == 2 ? 'info' : 'default'}
                sx={{ fontWeight: 'bold' }}
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
      <Box sx={{ marginTop: 5, marginBottom: '90dvh' }}>Không tìm thấy thành viên nào!</Box>
  } else if (isError) {
    usersRows = (
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
        <EnhancedTableToolbar
          filter={isEmployees}
          numSelected={selected?.length ?? 0}
          selectedAll={selectedAll}
          handleDeleteMultiples={handleDeleteMultiples} />
        <TableContainer sx={{ maxHeight: mini ? 330 : 'auto' }}>
          <Table
            stickyHeader
            sx={{ minWidth: mini ? 500 : 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected?.length ?? 0}
              sortBy={pagination.sortBy}
              sortDir={pagination.sortDir}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data?.totalElements}
              selectedAll={selectedAll}
            />
            <TableBody>
              {usersRows}
            </TableBody>
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
          {isAdmin
            && <FormControlLabel
              control={
                <Switch
                  color="primary"
                  checked={isEmployees}
                  onChange={handleChangeFilter}
                />
              }
              label="Lọc nhân viên"
            />
          }
        </Box>
        {mini ?
          <Link to={'/manage-users'} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 10 }}>Xem tất cả</Link>
          : null
        }
      </Box>
    </Box>
  );
}
