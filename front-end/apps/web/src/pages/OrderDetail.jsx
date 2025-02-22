import { idFormatter, useTitle } from "@ring/shared";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { TabContentContainer } from "../components/custom/ProfileComponents";
import { useGetOrderDetailQuery } from "../features/orders/ordersApiSlice";
import { Dialog } from "@mui/material";
import OrderDetailComponent from "../components/order/OrderDetailComponent";

const OrderDetail = () => {
  const { id } = useParams(); //Order id
  const { tabletMode, mobileMode } = useOutletContext();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetOrderDetailQuery(id);

  //Set title
  useTitle(`Chi tiết đơn hàng ${idFormatter(id)}`);

  let content = <OrderDetailComponent order={data} />;

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
    </div>
  );
};

export default OrderDetail;
