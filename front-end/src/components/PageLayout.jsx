import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageLayout () {
    return (
        <div>
            <Navbar/>
            <div>
                <Outlet />
            </div>
            <Footer/>
        </div>
    )
}