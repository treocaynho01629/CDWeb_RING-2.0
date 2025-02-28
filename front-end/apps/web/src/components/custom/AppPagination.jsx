import styled from "@emotion/styled";
import {
  Pagination,
  PaginationItem,
  MenuItem,
  TextField,
  paginationItemClasses,
} from "@mui/material";

//#region styled
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${({ theme }) => theme.spacing(5)} 0;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    justify-content: center;
  }
`;

const MoreContainer = styled.div`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-top: ${({ theme }) => theme.spacing(1)};
  }
`;

const StyledPageItem = styled(PaginationItem)`
  background-color: ${({ theme }) => theme.palette.action.focus};

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.light};
    color: ${({ theme }) => theme.palette.primary.contrastText};
  }

  &.Mui-disabled {
    display: none;
  }

  &.${paginationItemClasses.ellipsis} {
    background-color: transparent;
    font-weight: bold;
  }
`;
//#endregion

const AppPagination = ({
  mobileMode,
  pagination,
  onPageChange,
  onSizeChange,
}) => {
  //Initial value
  const currPage = pagination?.number + 1;
  const totalPages = pagination?.totalPages;

  //Change current page
  const handlePageChange = (e, page) => {
    if (onPageChange) onPageChange(page);
  };

  //Change amount display
  const handleChangeSize = (e) => {
    if (onSizeChange) onSizeChange(e.target.value);
  };

  return (
    <Container>
      <Pagination
        page={currPage ?? 1}
        count={totalPages}
        shape="rounded"
        color="primary"
        onChange={handlePageChange}
        renderItem={(item) => <StyledPageItem {...item} />}
      />
      <MoreContainer>
        <TextField
          size="small"
          select
          value={pagination?.size}
          onChange={handleChangeSize}
        >
          <MenuItem value={12}>Hiển thị 12</MenuItem>
          <MenuItem value={24}>Hiển thị 24</MenuItem>
          <MenuItem value={48}>Hiển thị 48</MenuItem>
        </TextField>
      </MoreContainer>
    </Container>
  );
};

export default AppPagination;
