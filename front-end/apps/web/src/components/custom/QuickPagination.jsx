import styled from "@emotion/styled";
import { IconButton } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

//#region styled
const Container = styled.div`
  display: flex;
  align-items: center;
`;

const StyledButton = styled(IconButton)`
  border-radius: 0;
  padding: ${({ theme }) => theme.spacing(0.8)};
  border: 0.5px solid ${({ theme }) => theme.palette.divider};
  background-color: ${({ theme }) => theme.palette.background.paper};

  &:last-child {
    border-left: none;
  }

  &.Mui-disabled {
    background-color: ${({ theme }) => theme.palette.background.default};
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 30px;
    height: 30px;
  }
`;

const Count = styled.span`
  font-size: 16px;
  margin-right: ${({ theme }) => theme.spacing(1)};
  cursor: pointer;

  b {
    color: ${({ theme }) => theme.palette.warning.light};
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-radius: 50%;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
//#endregion

const QuickPagination = ({ pagination, onPageChange, onOpenPagination }) => {
  const currPage = pagination?.number;
  const totalPages = pagination?.totalPages;

  const handlePageChange = (page) => {
    if (onPageChange) onPageChange(page);
  };

  const handleOpenPagination = () => {
    if (onOpenPagination) onOpenPagination();
  };

  return (
    <>
      {totalPages > 1 ? (
        <Container>
          <Count onClick={handleOpenPagination}>
            <b>{currPage + 1}</b>
            {totalPages && `/${totalPages}`}
          </Count>
          <StyledButton
            aria-label="prev-page"
            disabled={currPage == 0}
            onClick={() => handlePageChange(currPage)}
          >
            <KeyboardArrowLeft />
          </StyledButton>
          <StyledButton
            aria-label="next-page"
            disabled={!totalPages || currPage + 1 == totalPages}
            onClick={() => handlePageChange(currPage + 2)}
          >
            <KeyboardArrowRight />
          </StyledButton>
        </Container>
      ) : null}
    </>
  );
};

export default QuickPagination;
