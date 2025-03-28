import styled from "@emotion/styled";
import { KeyboardArrowRight, MoreHoriz } from "@mui/icons-material";
import { Box, Button, IconButton, Radio } from "@mui/material";
import { PHONE_REGEX } from "@ring/shared/regex";

//#region styled
const Wrapper = styled.div`
  display: flex;
  margin-bottom: 5px;
`;

const AddressItemContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  border: 0.5px solid ${({ theme }) => theme.palette.action.focus};

  &.active {
    border-color: ${({ theme }) => theme.palette.primary.main};
  }
  &.temp {
    border-color: ${({ theme }) => theme.palette.info.dark};
  }
  &.error {
    border-color: ${({ theme }) => theme.palette.error.main};
  }
`;

const AddressTag = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  font-weight: bold;
  font-size: 12px;
  padding: 2px 10px;
  border-right: 0.5px solid;
  border-bottom: 0.5px solid;
  border-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.dark};
  pointer-events: none;

  &.temp {
    border-color: ${({ theme }) => theme.palette.info.dark};
    color: ${({ theme }) => theme.palette.info.dark};
  }

  &.error {
    border-color: ${({ theme }) => theme.palette.error.main};
    color: ${({ theme }) => theme.palette.error.dark};
  }
`;

const UserInfo = styled.b`
  display: flex;
  white-space: nowrap;
  margin-right: 16px;
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

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 13px;
  }
`;

const UserAddress = styled.span`
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
`;

const StyledRadio = styled(Radio)(({ theme }) => ({
  borderRadius: 0,
  backgroundColor: theme.palette.action.disabled,
  transition: "all .25s ease",

  "&:hover": {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },

  "&.Mui-checked": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));
//#endregion

const AddressItem = ({
  onCheck,
  addressInfo,
  handleOpen,
  handleClick,
  selectedValue,
  isTemp,
}) => {
  const isValid = () => {
    if (!addressInfo) return false;

    const { name, phone, address, city } = addressInfo;
    let addressSplit = city?.split(", ");
    let ward = addressSplit[addressSplit.length - 1];
    let currCity = "";
    if (addressSplit.length > 1) currCity = addressSplit[0];

    const result = !(
      !name ||
      !phone ||
      !address ||
      !currCity ||
      !ward ||
      !PHONE_REGEX.test(phone)
    );
    return result;
  };
  const isNotValid = !isValid();
  const isSelected = selectedValue != null && selectedValue == addressInfo?.id;

  return (
    <Wrapper>
      {onCheck && (
        <StyledRadio
          checked={selectedValue == addressInfo?.id}
          onChange={onCheck}
          value={addressInfo?.id}
          color={isNotValid ? "error" : isTemp ? "info" : "primary"}
          name="address-radio-button"
        />
      )}
      <AddressItemContainer
        className={`${isNotValid ? "error" : addressInfo?.isDefault ? "active" : isTemp ? "temp" : ""}`}
      >
        {addressInfo?.isDefault && (
          <AddressTag className={`${isNotValid ? "error" : ""}`}>
            Mặc định
          </AddressTag>
        )}
        {isTemp && (
          <AddressTag className={`${isNotValid ? "error" : "temp"}`}>
            Tạm lưu
          </AddressTag>
        )}
        <Box display="flex" flexDirection={"column"}>
          {!addressInfo ? (
            <>
              <UserInfo>Chưa có địa chỉ mặc định</UserInfo>
              <UserAddress>Tạo địa chỉ tạm thời?</UserAddress>
            </>
          ) : (
            <>
              <UserInfo>
                {addressInfo?.companyName || addressInfo?.name}&nbsp;
                {addressInfo?.phone && `(+84) ${addressInfo?.phone}`}
              </UserInfo>
              <UserAddress>
                {[addressInfo?.city, addressInfo?.address].join(", ")}
              </UserAddress>
            </>
          )}
        </Box>
        <Button
          sx={{
            display: { xs: "none", sm: "flex" },
            whiteSpace: "nowrap",
            marginTop: 2,
          }}
          aria-label="toggle address dialog"
          variant="outlined"
          color={isNotValid ? "error" : isTemp ? "info" : "primary"}
          onClick={() => handleOpen(addressInfo)}
        >
          Thay đổi
        </Button>
        <IconButton
          sx={{ display: { xs: "block", sm: "none" } }}
          aria-label="mobile toggle address dialog"
          onClick={() => handleOpen(addressInfo)}
          color={isNotValid ? "error" : "primary"}
          edge="end"
        >
          <KeyboardArrowRight />
        </IconButton>
        {!addressInfo?.isDefault && !isSelected && (
          <IconButton
            sx={{
              display: { xs: "none", sm: "flex" },
              position: "absolute",
              top: 1,
              right: 2,
            }}
            onClick={(e) => handleClick(e, addressInfo)}
          >
            <MoreHoriz />
          </IconButton>
        )}
      </AddressItemContainer>
    </Wrapper>
  );
};

export default AddressItem;
