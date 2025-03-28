import {
  AssignmentReturn,
  KeyboardArrowRight,
  LocalShipping,
  VerifiedUser,
} from "@mui/icons-material";
import { MobileExtendButton } from "@ring/ui/Components";
import styled from "@emotion/styled";

//#region styled
const PoliciesWrapper = styled.div`
  position: relative;
`;

const PoliciesContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ${({ theme }) => theme.breakpoints.down("md")} {
    flex-direction: row;
  }
`;

const DetailTitle = styled.h4`
  margin: 10px 0;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.breakpoints.down("md")} {
    display: none;
  }
`;

const PolicyTitle = styled.span`
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  padding-right: 20px;
  white-space: nowrap;

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin: 3px 0;
  }
`;
//#endregion

const ProductPolicies = () => {
  return (
    <PoliciesWrapper>
      <DetailTitle>Chính sách ưu đãi:</DetailTitle>
      <PoliciesContainer>
        <PolicyTitle>
          <LocalShipping fontSize="16px" color="error" />
          &nbsp;Miễn phí giao hàng
        </PolicyTitle>
        <PolicyTitle>
          <AssignmentReturn fontSize="16px" color="error" />
          &nbsp;Đổi trả miễn phí
        </PolicyTitle>
        <PolicyTitle>
          <VerifiedUser fontSize="16px" color="error" />
          &nbsp;Hàng chính hãng 100%
        </PolicyTitle>
      </PoliciesContainer>
      <MobileExtendButton>
        <KeyboardArrowRight fontSize="small" />
      </MobileExtendButton>
    </PoliciesWrapper>
  );
};

export default ProductPolicies;
