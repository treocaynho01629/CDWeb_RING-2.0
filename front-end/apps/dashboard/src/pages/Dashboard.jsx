import { useState } from "react";
import {
  AutoStories,
  Group,
  AttachMoney,
  Storefront,
  LocalFireDepartment,
} from "@mui/icons-material";
import { Grid2 as Grid } from "@mui/material";
import { useTitle } from "@ring/shared";
import { useAuth } from "@ring/auth";
import {
  useGetBookAnalyticsQuery,
  useGetBooksQuery,
} from "../features/books/booksApiSlice";
import { useGetUserAnalyticsQuery } from "../features/users/usersApiSlice";
import { useGetSalesAnalyticsQuery } from "../features/orders/ordersApiSlice";
import { useGetShopAnalyticsQuery } from "../features/shops/shopsApiSlice";
import ChartSales from "../components/chart/ChartSales";
import WelcomeCard from "../components/custom/WelcomeCard";
import InfoCard from "../components/custom/InfoCard";
import SummaryTableProducts from "../components/table/SummaryTableProducts";
import SummaryTableOrders from "../components/table/SummaryTableOrders";
import SummaryTableUsers from "../components/table/SummaryTableUsers";
import SummaryTableShops from "../components/table/SummaryTableShops";
import ProductsShowcase from "../components/product/ProductsShowcase";

const TopProducts = ({ shop }) => {
  const { data, isLoading, isSuccess, isError } = useGetBooksQuery({
    size: 6,
    sortBy: "totalOrders",
    sortDir: "desc",
    amount: 0,
    shopId: shop ?? "",
  });

  return (
    <ProductsShowcase
      {...{
        title: (
          <>
            <LocalFireDepartment />
            Top sản phẩm bán chạy
          </>
        ),
        data,
        isLoading,
        isSuccess,
        isError,
      }}
    />
  );
};

const Dashboard = () => {
  const { roles, username, shop } = useAuth();
  const { data: bookAnalytics } = useGetBookAnalyticsQuery(shop ?? null);
  const { data: salesAnalytics } = useGetSalesAnalyticsQuery(shop ?? null);
  const { data: userAnalytics } = useGetUserAnalyticsQuery();
  const { data: shopAnalytics } = useGetShopAnalyticsQuery();
  const isAdmin = roles?.find((role) =>
    ["ROLE_ADMIN", "ROLE_GUEST"].includes(role)
  );

  //Set title
  useTitle("Dashboard");

  return (
    <>
      <Grid container size="grow" spacing={2} pt={2}>
        <Grid size={{ xs: 12, sm: 7 }}>
          <WelcomeCard username={username} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <p>STUFF</p>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md_lg: 3 }}>
          <InfoCard
            icon={<AutoStories color="primary" />}
            info={bookAnalytics}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md_lg: 3 }}>
          <InfoCard
            icon={<Storefront color="info" />}
            info={shopAnalytics}
            color="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md_lg: 3 }}>
          <InfoCard
            icon={<Group color="warning" />}
            info={userAnalytics}
            color="warning"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md_lg: 3 }}>
          <InfoCard
            icon={<AttachMoney color="success" />}
            info={salesAnalytics}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, md_lg: 4 }}>
          <p>STUFF</p>
        </Grid>
        <Grid size={{ xs: 12, md_lg: 8 }}>
          <ChartSales />
        </Grid>
        {/* {isAdmin &&
          <Grid size={12}>
            <ChartUsers />
          </Grid>
        } */}
        <Grid size={{ xs: 12, md_lg: 7 }}>
          <SummaryTableShops />
        </Grid>
        <Grid size={{ xs: 12, md_lg: 5 }}>
          <TopProducts shop={shop} />
        </Grid>
        <Grid size={isAdmin ? { xs: 12, lg: 4 } : { xs: 12, lg: 6 }}>
          <SummaryTableOrders />
        </Grid>
        <Grid size={isAdmin ? { xs: 12, md: 6, lg: 4 } : { xs: 12, lg: 6 }}>
          <SummaryTableProducts shop={shop} />
        </Grid>
        {isAdmin && (
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <SummaryTableUsers />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Dashboard;
