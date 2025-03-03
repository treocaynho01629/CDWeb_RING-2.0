import styled from "@emotion/styled";
import {
  Pagination,
  PaginationItem,
  MenuItem,
  TextField,
  paginationItemClasses,
} from "@mui/material";
import { pageSizes } from "../../ultils/filters";

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

const AppPagination = ({ pagination, onPageChange, onSizeChange, sizes }) => {
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
          {(sizes ?? pageSizes).map((option, index) => (
            <MenuItem value={option} key={`option-${index}`}>
              Hiển thị {option}
            </MenuItem>
          ))}
        </TextField>
      </MoreContainer>
    </Container>
  );
};

export default AppPagination;
