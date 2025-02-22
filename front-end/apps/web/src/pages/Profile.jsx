import styled from "@emotion/styled";
import { useState, lazy, Suspense } from "react";
import { Dialog, Skeleton } from "@mui/material";
import {
  StyledDialogTitle,
  TabContentContainer,
} from "../components/custom/ProfileComponents";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { useTitle } from "@ring/shared";
import Placeholder from "@ring/ui/Placeholder";

const PendingModal = lazy(() => import("@ring/ui/PendingModal"));
const ProfileDetail = lazy(() => import("../components/profile/ProfileDetail"));
const AddressComponent = lazy(
  () => import("../components/address/AddressComponent")
);
const ResetPassComponent = lazy(
  () => import("../components/profile/ResetPassComponent")
);

//#region styled
const PlaceholderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40dvh;
`;
//#endregion

const tempLoad = (
  <>
    <StyledDialogTitle>
      <Skeleton variant="text" sx={{ fontSize: "19px" }} width="50%" />
    </StyledDialogTitle>
    <PlaceholderContainer>
      <Placeholder />
    </PlaceholderContainer>
  </>
);

const Profile = () => {
  const { tab } = useParams();
  const { profile, loading, isSuccess, tabletMode, mobileMode } =
    useOutletContext();
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  //Set title
  useTitle("Hồ sơ");

  let content;

  switch (tab ? tab : tabletMode ? "" : "info") {
    case "info":
      content = (
        <Suspense fallback={tempLoad}>
          <ProfileDetail
            {...{
              pending,
              setPending,
              profile,
              loading,
              isSuccess,
              tabletMode,
            }}
          />
        </Suspense>
      );
      break;
    case "address":
      content = (
        <Suspense fallback={tempLoad}>
          <AddressComponent {...{ pending, setPending }} />
        </Suspense>
      );
      break;
    case "password":
      content = (
        <Suspense fallback={tempLoad}>
          <ResetPassComponent {...{ pending, setPending }} />
        </Suspense>
      );
      break;
  }

  return (
    <>
      {pending && (
        <Suspense fallBack={null}>
          <PendingModal open={pending} message="Đang gửi yêu cầu..." />
        </Suspense>
      )}
      {tabletMode ? (
        <Dialog
          open={tab ? true : tabletMode ? false : true}
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

export default Profile;
