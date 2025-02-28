import { useTitle } from "@ring/shared";
import { Dialog } from "@mui/material";
import { useNavigate, useOutletContext } from "react-router";
import { TabContentContainer } from "../components/custom/ProfileComponents";
import OrdersList from "../components/order/OrdersList";

const Orders = () => {
  const { tabletMode, mobileMode, pending, setPending } = useOutletContext();
  const navigate = useNavigate();

  //Set title
  useTitle("Đơn hàng");

  let content = <OrdersList {...{ pending, setPending, mobileMode }} />;

  return (
    <>
      {tabletMode ? (
        <Dialog
          open={tabletMode}
          onClose={() => navigate("/profile/detail")}
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

export default Orders;
