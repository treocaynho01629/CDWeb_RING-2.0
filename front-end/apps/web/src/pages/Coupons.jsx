import { useTitle } from "@ring/shared";
import { Dialog } from "@mui/material";
import { useNavigate, useOutletContext } from "react-router";
import { TabContentContainer } from "../components/custom/ProfileComponents";
import CouponsList from "../components/coupon/CouponsList";

const Coupons = () => {
  const { tabletMode, mobileMode } = useOutletContext();
  const navigate = useNavigate();

  //Set title
  useTitle("Mã giảm giá");

  let content = <CouponsList tabletMode={tabletMode} />;

  return (
    <>
      {tabletMode ? (
        <Dialog
          open={tabletMode}
          onClose={() => navigate(-1)}
          fullScreen={mobileMode}
          scroll={"paper"}
          maxWidth={"md"}
          fullWidth
          slotProps={{
            paper: {
              elevation: 0,
            },
          }}
        >
          {content}
        </Dialog>
      ) : (
        <TabContentContainer>{content}</TabContentContainer>
      )}
    </>
  );
};

export default Coupons;
