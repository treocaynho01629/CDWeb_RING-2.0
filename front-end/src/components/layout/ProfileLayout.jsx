import { Outlet } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import ProfileTabsList from "../profile/ProfileTabsList";

export default function ProfileLayout() {
    return (
        <Grid container columnSpacing={4}>
            <Grid size={{ xs: 12, md: 3.5, lg: 3 }} display="flex" justifyContent="center">
                <ProfileTabsList />
            </Grid>
            <Grid size="grow">
                <Outlet />
            </Grid>
        </Grid>
    )
}