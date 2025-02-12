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
  padding: ${(props) => props.theme.spacing(0.8)};
  border: 0.5px solid ${(props) => props.theme.palette.divider};
  background-color: ${(props) => props.theme.palette.background.paper};

  &:last-child {
    border-left: none;
  }
`;

const Count = styled.span`
  font-size: 16px;
  margin-right: ${(props) => props.theme.spacing(1)};

  b {
    color: ${(props) => props.theme.palette.warning.light};
  }
`;
//#endregion

const QuickPagination = ({ pagination, onPageChange }) => {
  const currPage = pagination?.number;
  const totalPages = pagination?.totalPages;

  const handlePageChange = (page) => {
    if (onPageChange) onPageChange(page);
  };

  return (
    <Container>
      {totalPages > 0 && (
        <Count>
          <b>{currPage + 1}</b>
          {totalPages && `/${totalPages}`}
        </Count>
      )}
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
  );
};

export default QuickPagination;
