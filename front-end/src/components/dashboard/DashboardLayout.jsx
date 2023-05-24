import { useState } from 'react';
import { Outlet } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";
import DashboardDrawer from "./DashboardDrawer";

import { CssBaseline, Box } from "@mui/material";

export default function DashboardLayout () {
    const [open, setOpen] = useState(false);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
                <DashboardNavbar open={open} setOpen={setOpen}/>
                <DashboardDrawer open={open} setOpen={setOpen}/>
                <Box component="main" sx={{ flexGrow: 1, p: 3 , marginTop: '80px'}}>
                    <Outlet />
                </Box>
        </Box>
    )
}