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
    content-visibility: hidden;
    background-color: ${({ theme }) => theme.palette.background.paper};
    position: fixed;
    top: 0;
    width: 100%;
    height: ${({ theme }) => theme.mixins.toolbar.minHeight + 4}px;
    margin: 0;
    z-index: ${({ theme }) => theme.zIndex.appBar - 1};

    &.transparent {
      display: none;
    }

    &.solid {
      position: relative;
    }
  }
`;

const StyledMainCrumb = styled(Link)`
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: 5px 15px;
`;

export default function CustomBreadcrumbs(props) {
  const { children, className, ...leftProps } = props;

  return (
    <BreadcrumbsContainer className={className ?? ""}>
      <Breadcrumbs {...leftProps}>
        <StyledMainCrumb to={"/"}>Trang chủ</StyledMainCrumb>
        {children}
      </Breadcrumbs>
    </BreadcrumbsContainer>
  );
}
