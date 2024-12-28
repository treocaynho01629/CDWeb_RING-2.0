import {
  Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper,
  Skeleton, Toolbar, TableHead, Avatar, Chip,
} from '@mui/material';
import { Link } from 'react-router';
import { ItemTitle, LinkButton, Title } from '../custom/ShareComponents';
import { useGetUsersQuery } from '../../../features/users/usersApiSlice';
import CustomProgress from '../../custom/CustomProgress';

const headCells = [
  {
    id: 'user',
    align: 'left',
    width: 'auto',
    disablePadding: false,
    label: 'Thành viên',
  },
  {
    id: 'info',
    align: 'right',
    width: '110px',
    disablePadding: false,
    label: 'Quyền',
  },
];

export default function SummaryTableUsers() {
  //Fetch books
  const { data, isLoading, isSuccess, isError, error } = useGetUsersQuery({
    size: 5,
    sortBy: 'createdDate',
    sortDir: 'desc'
  })

  const colSpan = headCells.length + 1;
  let userRows;

  if (isLoading) {
    userRows = (
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

    userRows = ids?.length
      ? ids?.map((id, index) => {
        const user = entities[id];
        const roles = user?.roles;

        return (
          <TableRow hover tabIndex={-1} key={id}>
            <TableCell align="left">
              <Link to={`/users/${id}`} style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ marginRight: 1 }} src={user?.image ? user.image + '?size=tiny' : null}>{user?.username?.charAt(0) ?? ''}</Avatar>
                <Box>
                  <ItemTitle>{user.username}</ItemTitle>
                  <Box display="flex"><ItemTitle className="secondary">{user.email}</ItemTitle>&nbsp;</Box>
                </Box>
              </Link>
            </TableCell>
            <TableCell align="right">
              <Chip label={roles == 3 ? 'Admin' : roles == 2 ? 'Nhân viên' : 'Thành viên'}
                color={roles == 3 ? 'primary' : roles == 2 ? 'info' : 'default'}
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
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
    userRows = (
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
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title>Thành viên mới đăng ký</Title>
        <Link to={'/dashboard/user'}><LinkButton>Xem tất cả</LinkButton></Link>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow className="header" tabIndex={-1}>
              {headCells.map((headCell, index) => (
                <TableCell
                  key={`headcell-${headCell.id}-${index}`}
                  align={headCell.align}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sx={{ width: headCell.width, bgcolor: 'action.hover' }}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead >
          <TableBody>
            {userRows}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
