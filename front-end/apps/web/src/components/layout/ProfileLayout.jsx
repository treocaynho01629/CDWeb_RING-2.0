import Grid from "@mui/material/Grid2";
import ProfileTabsList from "../profile/ProfileTabsList";
import { Outlet, useMatch } from 'react-router';
import { useGetProfileQuery } from "../../features/users/usersApiSlice";
import { useMediaQuery, useTheme } from "@mui/material";

export default function ProfileLayout() {
    const showTabs = useMatch("/profile/detail");
    const theme = useTheme();
    const tabletMode = useMediaQuery(theme.breakpoints.down('md'));
    const mobileMode = useMediaQuery(theme.breakpoints.down('sm'));

    //Fetch current profile
    const { data, isLoading, isSuccess, error } = useGetProfileQuery();

    return (
        <Grid container columnSpacing={{ xs: 1, md_lg: 3 }} sx={{ marginTop: { xs: 0, md: 4 } }}>
            {(!mobileMode || showTabs) &&
                <Grid size={{ xs: 12, md: 3.75, lg: 3 }} display="flex" justifyContent="center">
                    <ProfileTabsList {...{ profile: data, loading: isLoading, error, tabletMode }} />
                </Grid>
            }
            <Grid size="grow">
                <Outlet context={{ profile: data, loading: isLoading, isSuccess, error, tabletMode, mobileMode }} />
            </Grid>
        </Grid>
    )
}