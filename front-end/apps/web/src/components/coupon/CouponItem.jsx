import { Button, Skeleton, Paper, alpha } from "@mui/material";
import styled from "@emotion/styled";
import { dateFormatter } from "@ring/shared";

//#region styledc
const Wrapper = styled.div`
  padding: 5px;
  overflow: hidden;
  position: relative;
  width: 100%;
`;

const CouponEdge = styled(Paper)`
  position: absolute;
  border: 0.5px solid ${({ theme }) => theme.palette.divider};
  border-left: none;
  border-bottom: none;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  box-shadow: none;
  top: calc(50% - 15px);
  z-index: 1;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 20px;
    height: 20px;
    top: calc(50% - 10px);
  }

  &.left {
    left: -12px;
    transform: rotate(45deg);
  }

  &.right {
    right: -12px;
    transform: rotate(-135deg);
  }
`;

const CouponContent = styled.div`
  display: flex;
  position: relative;
  height: 100%;
  padding: 0 10px;
  align-items: center;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 0 5px;
  }
`;

const CouponAction = styled.div`
  display: flex;
  position: relative;
  height: 100%;
  border: 0.5px dashed ${({ theme }) => theme.palette.primary.main};
  justify-content: space-around;
  align-items: center;
  margin: 0 10px 5px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    position: absolute;
    padding: 0;
    right: 2%;
    bottom: 3%;
    height: 30%;
  }
`;

const CouponMain = styled.div`
  position: relative;
  height: 100%;
  padding-left: 10px;
  max-width: 75%;
  width: 100%;

  h2 {
    font-size: 15px;
    margin: 0;
    text-transform: uppercase;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    @supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }

  p {
    font-size: 14px;
    margin: 5px 0;
    color: ${({ theme }) => theme.palette.text.secondary};
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    h2 {
      font-size: 14px;
      text-transform: none;
    }

    p {
      margin: 0;
      font-size: 13px;
      width: 80%;
    }

    span {
      font-size: 12px;
    }
  }
`;

const Expire = styled.div`
  display: flex;
  width: 80%;
`;

const ExpText = styled.span`
  font-size: 14px;
  margin-right: 10px;
  font-weight: 450;
  color: ${({ theme, color }) =>
    theme.palette[color]?.main || theme.palette.text.primary};

  &::before {
    content: "Còn:";
  }

  &.date {
    color: ${({ theme }) => theme.palette.info.light};
    font-weight: normal;

    &::before {
      content: "HSD:";
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
    &::before {
      content: "";
    }
  }
`;

const CouponIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: ${({ theme, color }) =>
    theme.palette[color]?.light || theme.palette.primary.light};
  color: ${({ theme, color }) =>
    theme.palette[color]?.contrastText || theme.palette.primary.contrastText};
  border-right: 5px dotted ${({ theme }) => theme.palette.background.default};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  border-radius: 5px;

  svg {
    font-size: 40px;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 70px;
    height: 70px;
    margin: 5px;
  }
`;

const CouponCode = styled.span`
  position: relative;
  height: 100%;
  flex-grow: 1;
  margin-left: 10px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: none;
  }
`;

const CouponContainer = styled.div`
  position: relative;
  border-radius: 5px;
  padding: 5px;
  height: 100%;
  background-color: ${({ theme }) => theme.palette.background.default};
  border: 0.5px solid ${({ theme }) => theme.palette.divider};
  box-shadow: ${({ theme }) => theme.shadows[1]};

  &.active {
    background-color: ${({ theme }) => alpha(theme.palette.primary.light, 0.1)};
    border-color: ${({ theme }) => theme.palette.primary.main};

    ${CouponEdge} {
      border-color: ${({ theme }) => theme.palette.primary.main};
    }

    ${CouponIcon} {
      border-color: transparent;
    }
  }

  &.disabled {
    filter: grayscale(1);
    pointer-events: none;

    &::after {
      content: "CHƯA THOẢ ĐIỀU KIỆN";
      position: absolute;
      right: 20px;
      bottom: 20px;
      width: 120px;
      height: 56px;
      font-weight: bold;
      text-align: center;
      display: flex;
      align-items: center;
      background-color: ${({ theme }) => theme.palette.background.default};
      color: ${({ theme }) => theme.palette.text.disabled};
      border: 1px solid ${({ theme }) => theme.palette.divider};
      border-radius: 6px;
      transform: rotate(-10deg);
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 5px 2px;

    &.disabled {
      &::after {
        right: 10px;
        bottom: 10px;
        width: 70px;
        height: 40px;
        font-size: 11px;
      }
    }
  }
`;
//#endregion

const CouponItem = ({
  coupon,
  summary,
  isDisabled,
  isSelected,
  selectMode,
  onClickApply,
}) => {
  const date = new Date(coupon?.expDate);
  const warnDate = new Date();
  warnDate.setDate(warnDate.getDate() + 2);

  const handleClick = () => {
    isSelected ? onClickApply(null) : onClickApply(coupon);
  };

  return (
    <Wrapper>
      {coupon ? (
        <CouponContainer
          className={
            selectMode && isDisabled ? "disabled" : isSelected ? "active" : ""
          }
        >
          <CouponEdge elevation={24} className="left" />
          <CouponEdge elevation={24} className="right" />
          <CouponContent>
            <CouponIcon color={summary?.color}>{summary?.icon}</CouponIcon>
            <CouponMain>
              <h2>{coupon?.summary}</h2>
              <p>{coupon?.condition}</p>
              <Expire>
                <ExpText color={date <= warnDate && "error"} className="date">
                  &nbsp;{dateFormatter(date)}
                </ExpText>
                {coupon?.usage < 100 && (
                  <ExpText color="error">&nbsp;{coupon?.usage} lượt</ExpText>
                )}
              </Expire>
            </CouponMain>
          </CouponContent>
          <CouponAction>
            <CouponCode>{coupon?.code}</CouponCode>
            {selectMode ? (
              <Button
                disableRipple
                color={isSelected ? "error" : "primary"}
                onClick={handleClick}
              >
                {isSelected ? "Bỏ chọn" : "Áp dụng"}
              </Button>
            ) : (
              <Button disableRipple>Lưu</Button>
            )}
          </CouponAction>
        </CouponContainer>
      ) : (
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{
            margin: "5px 0",
            borderRadius: "5px",
            height: { xs: 85, sm: 155 },
          }}
        />
      )}
    </Wrapper>
  );
};

export default CouponItem;
