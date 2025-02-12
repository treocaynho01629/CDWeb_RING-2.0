import { Link } from "react-router";
import { Breadcrumbs } from "@mui/material";
import styled from "@emotion/styled";

const BreadcrumbsContainer = styled.div`
  margin: 20px 10px;
  display: block;

  a.active {
    font-weight: 450;
    text-decoration: underline;
    color: ${(props) => props.theme.palette.primary.dark};
    pointer-events: none;
  }

  ${(props) => props.theme.breakpoints.down("sm")} {
    display: none;
  }
`;

const StyledMainCrumb = styled(Link)`
  background-color: ${(props) => props.theme.palette.primary.main};
  color: ${(props) => props.theme.palette.primary.contrastText};
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
