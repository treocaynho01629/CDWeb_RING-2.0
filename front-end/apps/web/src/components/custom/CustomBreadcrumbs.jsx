import { Link } from "react-router";
import { Breadcrumbs } from "@mui/material";
import styled from "@emotion/styled";

const BreadcrumbsContainer = styled.div`
  margin: 20px 10px;
  display: block;
  z-index: 3;

  a.active {
    font-weight: 450;
    text-decoration: underline;
    color: ${({ theme }) => theme.palette.primary.dark};
    pointer-events: none;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: none;
  }
`;

const StyledMainCrumb = styled(Link)`
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: 5px 15px;
`;

export default function CustomBreadcrumbs(props) {
  const { children } = props;

  return (
    <BreadcrumbsContainer>
      <Breadcrumbs {...props}>
        <StyledMainCrumb to={"/"}>Trang chủ</StyledMainCrumb>
        {children}
      </Breadcrumbs>
    </BreadcrumbsContainer>
  );
}
