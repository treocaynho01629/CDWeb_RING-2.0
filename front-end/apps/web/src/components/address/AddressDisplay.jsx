import styled from "@emotion/styled";
import { KeyboardArrowRight } from "@mui/icons-material";
import {
  alpha,
  Button,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import { addressTypes, shippingItems, currencyFormat } from "@ring/shared";

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

const FormContent = styled.div`
  width: 100%;
`;

const StyledForm = styled(FormControlLabel)`
  padding: ${({ theme }) => `${theme.spacing(1.5)} ${theme.spacing(2)}`};
  padding-left: 0;
  border: 0.5px solid ${({ theme }) => theme.palette.divider};
  background-color: ${({ theme }) => theme.palette.background.paper};
  min-width: 50%;
  margin: ${({ theme }) => theme.spacing(0.5)} 0;

  .MuiFormControlLabel-label {
    position: relative;
    width: 100%;
  }

  &:has(input[type="radio"]:checked) {
    border-color: ${({ theme }) => theme.palette.primary.main};
    background-color: ${({ theme }) => alpha(theme.palette.primary.light, 0.1)};
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    border-left: none;
    border-right: none;
  }
`;

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
`;

const PriceTag = styled.span`
  font-weight: 450;
  color: ${({ theme, color }) =>
    theme.palette[color]?.dark || theme.palette.text.primary};
`;

const ItemTitle = styled.div`
  display: flex;
  align-items: center;

  svg {
    font-size: 24px;
    margin-right: ${({ theme }) => theme.spacing(0.5)};
  }
`;

const Estimate = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.text.secondary};
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

const AddressDisplay = ({
  addressInfo,
  handleOpen,
  isValid,
  loadAddress,
  value,
  handleChange,
}) => {
  const fullAddress = [addressInfo?.city, addressInfo?.address].join(", ");
  const address = addressInfo?.type ? addressTypes[addressInfo.type] : null;

  return (
    <>
      <Title>Giao tới</Title>
      <AddressDisplayContainer
        className={
          loadAddress ? "" : isValid ? "" : !addressInfo ? "" : "error"
        }
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
          color={!isValid ? "error" : "primary"}
          disabled={loadAddress}
          onClick={handleOpen}
        >
          Thay đổi
        </Button>
        <IconButton
          sx={{ mr: -1, display: { xs: "block", sm: "none" } }}
          aria-label="mobile toggle address dialog"
          onClick={handleOpen}
          color={!isValid ? "error" : "primary"}
          disabled={loadAddress}
          edge="end"
        >
          <KeyboardArrowRight />
        </IconButton>
      </AddressDisplayContainer>
      <Title>Hình thức giao hàng</Title>
      <RadioGroup value={value} onChange={handleChange}>
        {shippingItems.map((item, index) => (
          <StyledForm
            key={index}
            value={item.value}
            control={<Radio />}
            label={
              <FormContent>
                <ItemContent>
                  <ItemTitle>
                    {item.icon}
                    {item.label}
                  </ItemTitle>
                  <PriceTag color={item.color}>
                    {currencyFormat.format(item.price)}
                  </PriceTag>
                </ItemContent>
                <Estimate>{item.description}</Estimate>
              </FormContent>
            }
          />
        ))}
      </RadioGroup>
    </>
  );
};

export default AddressDisplay;
