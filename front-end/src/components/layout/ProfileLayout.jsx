import { Outlet } from "react-router-dom";
import { Grid } from "@mui/material";
import ProfileTabsList from "../profile/ProfileTabsList";

export default function ProfileLayout() {
    return (
        <Grid container columnSpacing={4}>
            <Grid item xs={12} md={3.5} lg={3} display={'flex'} justifyContent={'center'}>
                <ProfileTabsList />
            </Grid>
            <Grid item xs={12} md={8.5} lg={9}>
                <Outlet />
            </Grid>
        </Grid>
    )
}