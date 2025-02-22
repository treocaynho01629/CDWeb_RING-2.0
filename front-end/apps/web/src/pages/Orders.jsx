import { idFormatter, useConfirm, useTitle } from "@ring/shared";
import { Dialog } from "@mui/material";
import { useNavigate, useOutletContext } from "react-router";
import { TabContentContainer } from "../components/custom/ProfileComponents";
import { lazy, Suspense, useState } from "react";
import OrdersList from "../components/order/OrdersList";

const PendingModal = lazy(() => import("@ring/ui/PendingModal"));

const Orders = () => {
  const { tabletMode, mobileMode } = useOutletContext();
  const navigate = useNavigate();
  const [contextOrder, setContextOrder] = useState(null);
  const [pending, setPending] = useState(false);
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
      {pending && (
        <Suspense fallBack={null}>
          <PendingModal open={pending} message="Đang gửi yêu cầu..." />
        </Suspense>
      )}
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
