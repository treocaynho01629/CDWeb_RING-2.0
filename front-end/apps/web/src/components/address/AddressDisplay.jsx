import styled from "@emotion/styled";
import { KeyboardArrowRight } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { getAddressType } from "@ring/shared";

//#region styled
const Title = styled.h4`
  margin: ${({ theme }) => `${theme.spacing(1.5)} ${theme.spacing(1)}`};
  font-weight: 420;
`;

const AddressDisplayContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0.5px solid ${({ theme }) => theme.palette.action.focus};
  background-color: ${({ theme }) => theme.palette.background.paper};
  padding: 20px;

  &.error {
    border-color: ${({ theme }) => theme.palette.error.main};
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: ${({ theme }) => theme.spacing(1)};
    border-left: none;
    border-right: none;
  }
`;

const UserInfo = styled.b`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 13px;
  }
`;

const AddressContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddressContent = styled.div`
  display: flex;
  margin-right: ${({ theme }) => theme.spacing(2)};
  white-space: nowrap;
`;

const Address = styled.span`
  font-size: 16px;
  line-height: 1.75em;
  margin-top: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const AddressTag = styled.span`
  font-size: 12px;
  font-weight: bold;
  margin-right: ${({ theme }) => theme.spacing(0.5)};
  padding: ${({ theme }) => `${theme.spacing(0.5)} ${theme.spacing(1)}`};
  border: 0.5px solid ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.main};

  &.info {
    color: ${({ theme }) => theme.palette.info.main};
    border-color: ${({ theme }) => theme.palette.info.main};
  }
`;
//#endregion

const AddressType = getAddressType();

const AddressDisplay = ({ addressInfo, handleOpen, isValid, loadAddress }) => {
  const fullAddress = [addressInfo?.city, addressInfo?.address].join(", ");
  const address = addressInfo?.type ? AddressType[addressInfo.type] : null;

  return (
    <>
      <Title>Giao tới</Title>
      <AddressDisplayContainer
        className={!loadAddress && isValid ? "" : !addressInfo ? "" : "error"}
      >
        <AddressContainer>
          {!addressInfo && loadAddress ? (
            <Address>Đang cập nhật...</Address>
          ) : (
            <>
              <AddressContent>
                <UserInfo>
                  {addressInfo?.companyName ?? addressInfo?.name}&nbsp;
                </UserInfo>
                {addressInfo?.phone && (
                  <UserInfo>{`(+84) ${addressInfo.phone}`}</UserInfo>
                )}
              </AddressContent>
              <Address>
                {address && (
                  <AddressTag className={address.color}>
                    {address.label}
                  </AddressTag>
                )}
                {fullAddress.length > 2 ? fullAddress : "Không xác định"}
              </Address>
            </>
          )}
        </AddressContainer>
        <Button
          sx={{ display: { xs: "none", sm: "flex" }, whiteSpace: "nowrap" }}
          aria-label="toggle address dialog"
          variant="outlined"
          color={
            !loadAddress && isValid
              ? "primary"
              : !addressInfo
                ? "primary"
                : "error"
          }
          disabled={loadAddress}
          onClick={handleOpen}
        >
          Thay đổi
        </Button>
        <IconButton
          sx={{ mr: -1, display: { xs: "block", sm: "none" } }}
          aria-label="mobile toggle address dialog"
          onClick={handleOpen}
          color={
            !loadAddress && isValid
              ? "primary"
              : !addressInfo
                ? "primary"
                : "error"
          }
          disabled={loadAddress}
          edge="end"
        >
          <KeyboardArrowRight />
        </IconButton>
      </AddressDisplayContainer>
    </>
  );
};

export default AddressDisplay;
