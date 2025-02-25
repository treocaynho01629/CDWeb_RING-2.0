import { Dialog } from "@mui/material";
import { TabContentContainer } from "../components/custom/ProfileComponents";
import { useNavigate, useOutletContext } from "react-router";
import { useTitle } from "@ring/shared";
import ReviewsList from "../components/review/ReviewsList";

const Orders = () => {
  const { tabletMode, mobileMode, pending, setPending } = useOutletContext();
  const navigate = useNavigate();

  //Set title
  useTitle("Đánh giá");

  let content = <ReviewsList {...{ mobileMode, pending, setPending }} />;

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

export default Orders;
