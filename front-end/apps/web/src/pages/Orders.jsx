import { idFormatter, useConfirm, useTitle } from "@ring/shared";
import { Dialog } from "@mui/material";
import { useNavigate, useOutletContext } from "react-router";
import { TabContentContainer } from "../components/custom/ProfileComponents";
import { useState } from "react";
import OrdersList from "../components/order/OrdersList";

const Orders = () => {
  const { tabletMode, mobileMode, pending, setPending } = useOutletContext();
  const navigate = useNavigate();
  const [contextOrder, setContextOrder] = useState(null);
  const [ConfirmationDialog, confirm] = useConfirm(
    "Huỷ đơn hàng?",
    `Huỷ đơn hàng ${idFormatter(contextOrder?.id)}?`
  );

  //Set title
  useTitle("Đơn hàng");

  let content = (
    <OrdersList {...{ pending, setPending, setContextOrder, confirm }} />
  );

  return (
    <div>
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
      <ConfirmationDialog />
    </div>
  );
};

export default Orders;
