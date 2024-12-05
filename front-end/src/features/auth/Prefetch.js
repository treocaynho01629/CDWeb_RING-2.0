import { useEffect } from "react";
import { store } from "../../app/store";
import { booksApiSlice } from "../books/booksApiSlice";
import { reviewsApiSlice } from "../reviews/reviewsApiSlice";
import { ordersApiSlice } from "../orders/ordersApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { Outlet } from 'react-router';

const defaultSize = 8;

const Prefetch = () => {

    // useEffect(() => {
    //     store.dispatch(usersApiSlice.util.prefetch("getUsers", { 
    //         page: 1, 
    //         size: defaultSize
    //     }, { force: true }));
    // }, [])

    return <Outlet />
}
export default Prefetch