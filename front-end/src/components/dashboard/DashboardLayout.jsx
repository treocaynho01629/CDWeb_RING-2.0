import { useState } from 'react';
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import DashboardNavbar from "./DashboardNavbar";
import DashboardDrawer from "./DashboardDrawer";

export default function DashboardLayout() {
    const [open, setOpen] = useState(false);

    return (
        <Box display="flex">
            <DashboardDrawer open={open} setOpen={setOpen} />
            <Box component="main" sx={{ flexGrow: 1, position: 'relative' }}>
                <DashboardNavbar open={open} setOpen={setOpen} />
                <Box sx={{ p: 3 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}