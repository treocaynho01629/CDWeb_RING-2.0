import styled from "@emotion/styled";
import { Skeleton, Typography } from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";

export const ItemTitle = styled.p`
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin: 5px 0px;

  @supports (-webkit-line-clamp: 2) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: initial;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &:hover {
    color: ${(props) => props.theme.palette.info.main};
  }

  ${(props) => props.theme.breakpoints.down("sm")} {
    font-size: 13px;

    @supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
`;

export const Shop = styled.b`
  font-size: 15px;
  white-space: nowrap;
  display: flex;
  align-items: center;

  ${(props) => props.theme.breakpoints.down("sm")} {
    font-size: 14px;
    margin: 8px 0;
  }
`;

export const ShopTag = styled.span`
  background-color: ${(props) => props.theme.palette.primary.main};
  color: ${(props) => props.theme.palette.primary.contrastText};
  padding: 2px 10px;
  margin-right: 8px;
`;

export const StatusTag = styled(Typography)`
  text-transform: uppercase;
  font-weight: 450;

  ${(props) => props.theme.breakpoints.down("sm")} {
    font-size: 14px;
  }
`;

export const DetailText = styled.p`
  margin: 0;
  font-weight: 350;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-decoration: underline;
  color: ${(props) => props.theme.palette.primary.dark};
`;

export const ContentContainer = styled.div`
  margin-left: 10px;
  width: 100%;
`;

export const StuffContainer = styled.div`
  display: flex;
  justify-content: space-between;

  ${(props) => props.theme.breakpoints.down("md")} {
    align-items: flex-end;
  }

  ${(props) => props.theme.breakpoints.down("sm")} {
    flex-direction: row-reverse;
  }
`;

export const HeadContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing(2)};
  border-bottom: 0.5px solid;
  border-color: ${(props) => props.theme.palette.action.focus};

  ${(props) => props.theme.breakpoints.down("sm")} {
    padding: ${(props) => props.theme.spacing(1)};
  }
`;

export const BodyContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  padding: ${(props) => props.theme.spacing(2)};

  ${(props) => props.theme.breakpoints.down("sm")} {
    padding: ${(props) => props.theme.spacing(1)};
  }

  &.disabled {
    opacity: 0.7;
    filter: grayscale(0.5);
  }
`;

export const StyledLazyImage = styled(LazyLoadImage)`
  display: inline-block;
  height: 90px;
  width: 90px;
  border: 0.5px solid ${(props) => props.theme.palette.action.focus};

  ${(props) => props.theme.breakpoints.down("sm")} {
    height: 80px;
    width: 80px;
  }
`;

export const StyledSkeleton = styled(Skeleton)`
  display: inline-block;
  height: 90px;
  width: 90px;

  ${(props) => props.theme.breakpoints.down("sm")} {
    height: 80px;
    width: 80px;
  }
`;
