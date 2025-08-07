import { bannersApiSlice as initialsApiSlice } from "@ring/redux/bannersApiSlice";

export const bannersApiSlice = initialsApiSlice;

export const { useGetBannersQuery } = bannersApiSlice;
