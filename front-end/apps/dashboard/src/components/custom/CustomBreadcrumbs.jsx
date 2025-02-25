import { Link } from "react-router";
import { Breadcrumbs } from "@mui/material";
import styled from "@emotion/styled";

const BreadcrumbsContainer = styled.div`
  display: block;

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

export default function CustomBreadcrumbs(props) {
  const { children } = props;

  return (
    <BreadcrumbsContainer>
      <Breadcrumbs {...props}>
        <Link to="/">Trang chủ</Link>
        {children}
      </Breadcrumbs>
    </BreadcrumbsContainer>
  );
}
