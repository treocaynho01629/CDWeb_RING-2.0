import styled from "@emotion/styled";
import { lazy, Suspense } from "react";
import { Dialog, Skeleton } from "@mui/material";
import {
  StyledDialogTitle,
  TabContentContainer,
} from "../components/custom/ProfileComponents";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { useTitle } from "@ring/shared";
import Placeholder from "@ring/ui/Placeholder";

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
  const {
    profile,
    loading,
    isSuccess,
    tabletMode,
    mobileMode,
    pending,
    setPending,
  } = useOutletContext();
  const navigate = useNavigate();

  //Set title
  useTitle("Hồ sơ");

  let content;

  switch (tab ? tab : tabletMode ? "" : "info") {
    case "info":
      content = (
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
      );
      break;
    case "address":
      content = <AddressComponent {...{ pending, setPending, mobileMode }} />;
      break;
    case "password":
      content = <ResetPassComponent {...{ pending, setPending }} />;
      break;
  }

  return (
    <>
      {tabletMode ? (
        <Dialog
          open={tab ? true : tabletMode ? false : true}
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
          <Suspense fallback={tempLoad}>{content}</Suspense>
        </Dialog>
      ) : (
        <TabContentContainer>
          <Suspense fallback={tempLoad}>{content}</Suspense>
        </TabContentContainer>
      )}
    </>
  );
};

export default Profile;
