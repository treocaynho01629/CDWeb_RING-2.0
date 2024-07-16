import { store } from "../../app/store";
import { postsApiSlice } from "../posts/postsApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { usersApiSlice } from "../users/usersApiSlice";
import { imagesApiSlice } from "../images/imagesApiSlice";

const defaultSize = 8;

const Prefetch = () => {

    useEffect(() => {
        store.dispatch(postsApiSlice.util.prefetch("getPosts", { 
            page: 1, 
            size: defaultSize 
        }, { force: true }));
        store.dispatch(usersApiSlice.util.prefetch("getUsers", { 
            page: 1, 
            size: defaultSize
        }, { force: true }));
        store.dispatch(imagesApiSlice.util.prefetch("getImages", {
            page: 1,
            size: defaultSize
        }, { force: true }));
    }, [])

    return <Outlet />
}
export default Prefetch