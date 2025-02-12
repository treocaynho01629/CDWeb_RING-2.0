import { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  Grid2 as Grid,
  Skeleton,
  Chip,
  Stack,
} from "@mui/material";
import { NavLink, useParams } from "react-router";
import { Launch, Edit as EditIcon } from "@mui/icons-material";
import { useGetUserQuery } from "../features/users/usersApiSlice";
import {
  ButtonContainer,
  HeaderContainer,
  InfoTable,
} from "../components/custom/Components";
import { numFormat, genderTypes, roleTypes, useTitle } from "@ring/shared";
import CustomBreadcrumbs from "../components/custom/CustomBreadcrumbs";

const DetailAccount = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(undefined);
  const { data, isLoading, isSuccess, isError, error } = useGetUserQuery(id, {
    skip: !id,
  });

  const handleOpenEdit = () => {
    setOpen(true);
  };

  //Set title
  useTitle(data?.username ?? "Thành viên");

  const roleItem = roleTypes[data?.roles];

  return (
    <>
      <HeaderContainer>
        <div>
          <h2>Chi tiết thành viên</h2>
          <CustomBreadcrumbs separator="." maxItems={4} aria-label="breadcrumb">
            <NavLink to={"/user"} end>
              Quản lý thành viên
            </NavLink>
            <NavLink to={`/user/${id}`}>{data?.username}</NavLink>
          </CustomBreadcrumbs>
        </div>
        <ButtonContainer>
          <NavLink to={`/profile/${data?.username}`}>
            <IconButton>
              <Launch fontSize="small" />
            </IconButton>
          </NavLink>
          <IconButton onClick={handleOpenEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
        </ButtonContainer>
      </HeaderContainer>
      <Grid
        container
        size="grow"
        spacing={{ xs: 0, md: 1, lg: 2 }}
        position="relative"
      >
        <Grid
          size={{ xs: 12, md: 5 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          {isLoading ? (
            <Skeleton variant="circular" sx={{ width: 150, height: 150 }} />
          ) : (
            <Avatar sx={{ width: 150, height: 150 }} />
          )}
          <Stack direction="row" spacing={2} my={2}>
            <Typography variant="subtitle1">
              Theo dõi:&nbsp;<b>{numFormat.format(data?.totalFollows || 0)}</b>
            </Typography>
            <Typography variant="subtitle1">
              Đánh giá:&nbsp;<b>{numFormat.format(data?.totalReviews || 0)}</b>
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={1} px={{ xs: 1, md: 0 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignContent="center"
            >
              <Chip
                variant="outlined"
                color={roleItem?.color}
                label={roleItem?.label}
                sx={{
                  fontWeight: 450,
                  textTransform: "uppercase",
                  fontSize: 14,
                }}
              />
              <Typography variant="subtitle2" color="text.secondary">
                Tham gia:{" "}
                {new Date(data?.joinedDate).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                })}
              </Typography>
            </Box>
            <Typography variant="h6" color="primary">
              {data?.username}
            </Typography>
            <Typography variant="button">{data?.email}</Typography>
            <InfoTable>
              <tbody>
                <tr>
                  <td>
                    <Typography variant="subtitle1">Số điện thoại:</Typography>
                  </td>
                  <td>
                    <Typography variant="subtitle1" color="text.secondary">
                      {data?.phone ?? "Không"}
                    </Typography>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Typography variant="subtitle1">Giới tính</Typography>
                  </td>
                  <td>
                    <Typography variant="subtitle1" color="text.secondary">
                      {genderTypes[data?.gender ?? ""]}
                    </Typography>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Typography variant="subtitle1">Ngày sinh:</Typography>
                  </td>
                  <td>
                    <Typography variant="subtitle1" color="text.secondary">
                      {data?.dob}
                    </Typography>
                  </td>
                </tr>
              </tbody>
            </InfoTable>
          </Stack>
        </Grid>
      </Grid>
      {/* <Suspense fallback={<></>}>
                {open !== undefined && <EditAccountDialog
                    id={id}
                    open={open}
                    setOpen={openEdit}
                    refetch={refetch} />}
            </Suspense> */}
    </>
  );
};

export default DetailAccount;
