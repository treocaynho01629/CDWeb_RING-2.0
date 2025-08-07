import styled from "@emotion/styled";
import { Suspense } from "react";
import { getPaymentType } from "@ring/shared/enums/payment";
import { iconList } from "@ring/shared/utils/icon";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

//#region styled
const StyledForm = styled(FormControlLabel)`
  padding: ${({ theme }) => theme.spacing(1)} 0;
  min-width: 50%;

  .MuiFormControlLabel-label {
    position: relative;
    width: 100%;
  }
`;

const FormContent = styled.div`
  width: 100%;
`;

const ItemTitle = styled.div`
  display: flex;
  align-items: center;

  svg {
    font-size: 24px;
    margin-right: ${({ theme }) => theme.spacing(0.5)};
  }
`;

const Description = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.vars.palette.text.secondary};
`;

const RadioContainer = styled.div`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 0 ${({ theme }) => theme.spacing(1)};
  }
`;

const PaymentContainer = styled.div`
  padding: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(1)};
  border: 0.5px solid ${({ theme }) => theme.vars.palette.divider};
  background-color: ${({ theme }) => theme.vars.palette.background.paper};

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: ${({ theme }) => theme.spacing(1)};
  }
`;
//#endregion

const PaymentType = getPaymentType();

const PaymentSelect = ({ value, handleChange }) => {
  return (
    <>
      <RadioContainer>
        <RadioGroup spacing={1} row value={value} onChange={handleChange}>
          {Object.values(PaymentType).map((item, index) => {
            const Icon = iconList[item.icon];

            return (
              <StyledForm
                key={index}
                sx={{ width: "100%" }}
                value={item.value}
                control={<Radio />}
                label={
                  <FormContent>
                    <ItemTitle>
                      <Suspense fallback={null}>
                        <Icon />
                      </Suspense>
                      {item.label}
                    </ItemTitle>
                    <Description>{item.description}</Description>
                  </FormContent>
                }
              />
            );
          })}
        </RadioGroup>
      </RadioContainer>
      <PaymentContainer>{getPaymentContent(value)}</PaymentContainer>
    </>
  );
};

export default PaymentSelect;
