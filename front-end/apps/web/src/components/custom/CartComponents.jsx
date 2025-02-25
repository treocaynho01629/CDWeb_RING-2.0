import styled from "@emotion/styled";
import { Button, Checkbox } from "@mui/material";

export const CheckoutContainer = styled.div`
  position: relative;
  height: 100%;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    position: fixed;
    bottom: 0;
    left: 0;
    max-height: 100px;
    width: 100%;
    z-index: ${({ theme }) => theme.zIndex.appBar};
    border-top: 0.5px solid ${({ theme }) => theme.palette.divider};
    box-shadow: ${({ theme }) => theme.shadows[12]};
    background-color: ${({ theme }) => theme.palette.background.paper};
  }
`;

export const CheckoutBox = styled.div`
  border: 0.5px solid ${({ theme }) => theme.palette.action.focus};
  padding: 20px 16px;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.palette.background.paper};

  &.sticky {
    margin-bottom: -0.5px;
    position: sticky;
    top: ${({ theme }) => theme.mixins.toolbar.minHeight + 15}px;
    bottom: ${({ theme }) => theme.spacing(2)};
    z-index: 1;
  }

  ${({ theme }) => theme.breakpoints.down("md_lg")} {
    margin: 0;
    padding-top: ${({ theme }) => theme.spacing(1)};
  }
`;

export const CheckoutStack = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:first-of-type {
    border-bottom: 0.5px dashed ${({ theme }) => theme.palette.divider};
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    padding-bottom: ${({ theme }) => theme.spacing(1)};
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    height: 50px;

    &:first-of-type {
      margin-bottom: 0;
      padding: 0 5px;
    }
  }
`;

export const CheckoutPriceContainer = styled.div`
  position: relative;
  width: 100%;
  margin-right: ${({ theme }) => theme.spacing(2)};
`;

export const AltCheckoutBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 5px 7px;
  white-space: nowrap;
`;

export const CheckoutTitle = styled.span`
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;

  span {
    font-size: 12px;
    color: ${({ theme }) => theme.palette.text.secondary};
    font-style: italic;
  }
`;

export const CheckoutRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing(0.5)} 0;
`;

export const CheckoutText = styled.span`
  font-size: 14px;
  font-weight: 400;
  white-space: nowrap;
  color: ${({ theme, color }) =>
    theme.palette[color]?.main || theme.palette.text.primary};
`;

export const PriceContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: end;

  ${({ theme }) => theme.breakpoints.down("md_lg")} {
    flex-direction: row;
    align-items: center;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    align-items: end;
  }
`;

export const CheckoutPrice = styled.span`
  font-size: 18px;
  width: 100%;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.palette.error.main};
  cursor: pointer;

  b {
    font-size: 14px;
    color: ${({ theme }) => theme.palette.text.primary};
  }

  ${({ theme }) => theme.breakpoints.down("md_lg")} {
    font-size: 16px;
  }
`;

export const SavePrice = styled.span`
  font-size: 14px;
  font-weight: 450;
  width: 100%;
  text-align: right;
  color: ${({ theme }) => theme.palette.success.dark};
`;

export const SubText = styled.span`
  font-size: 12px;
  width: 100%;
  text-align: right;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const DetailContainer = styled.div`
  padding: 10px 0;
  margin-bottom: 10px;
  border-bottom: 0.5px dashed ${({ theme }) => theme.palette.divider};
`;

export const CouponButton = styled.b`
  font-size: 15px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;

  span {
    display: flex;
    align-items: center;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
    margin: 0;
    width: 100%;
  }
`;

export const MiniCouponContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const CheckoutButton = styled(Button)`
  height: 100%;
  line-height: 1.5;
`;

export const StyledCheckbox = styled(Checkbox)`
  margin-left: 8px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-left: 0;
  }
`;
