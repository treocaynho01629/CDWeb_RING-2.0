import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

export default function PageLayout () {
    return (
        <div>
            <Navbar/>
            <ScrollToTop/>
            <div>
                <Outlet />
            </div>
            <Footer/>
        </div>
    )
}