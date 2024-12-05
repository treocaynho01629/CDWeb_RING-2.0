import './App.css';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import useReachable from './hooks/useReachable';
import Layout from './components/layout/Layout';
import PageLayout from './components/layout/PageLayout';
import RequireAuth from './components/authorize/RequireAuth';
import PersistLogin from './components/authorize/PersistsLogin';
import FallbackLogo from './components/layout/FallbackLogo';

function App() {
  useReachable(); //Test connection to server

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      hydrateFallbackElement: <FallbackLogo />,
      children: [
        {
          path: "reset/:token?",
          lazy: async () => {
            let ResetPage = await import("./pages/ResetPage")
            return { Component: ResetPage.default }
          },
        },
        {
          path: "unauthorized",
          lazy: async () => {
            let Unauthorized = await import("./pages/error/Unauthorized")
            return { Component: Unauthorized.default }
          },
        },
        {
          path: "*",
          lazy: async () => {
            let Missing = await import("./pages/error/Missing")
            return { Component: Missing.default }
          },
        },
        {
          path: "auth/:tab",
          lazy: async () => {
            let AuthPage = await import("./pages/AuthPage")
            return { Component: AuthPage.default }
          },
        },
        {
          element: <PersistLogin />,
          children: [
            {
              element: <PageLayout />,
              children: [
                {
                  path: "/",
                  lazy: async () => {
                    let Home = await import("./pages/Home")
                    return { Component: Home.default }
                  },
                },
                {
                  path: "store/:cSlug?",
                  lazy: async () => {
                    let FiltersPage = await import("./pages/FiltersPage")
                    return { Component: FiltersPage.default }
                  },
                },
                {
                  path: "product/:slug",
                  lazy: async () => {
                    let ProductDetail = await import("./pages/ProductDetail")
                    return { Component: ProductDetail.default }
                  },
                },
                {
                  path: "product-id/:id",
                  lazy: async () => {
                    let ProductDetail = await import("./pages/ProductDetail")
                    return { Component: ProductDetail.default }
                  },
                },
                {
                  path: "cart",
                  lazy: async () => {
                    let Cart = await import("./pages/Cart")
                    return { Component: Cart.default }
                  },
                },
                {
                  element: <RequireAuth allowedRoles={['ROLE_USER']} />,
                  children: [
                    {
                      path: "checkout",
                      lazy: async () => {
                        let Checkout = await import("./pages/Checkout")
                        return { Component: Checkout.default }
                      },
                    },
                    {
                      lazy: async () => {
                        let ProfileLayout = await import("./components/layout/ProfileLayout")
                        return { Component: ProfileLayout.default }
                      },
                      children: [
                        {
                          path: "profile/detail/:tab?",
                          lazy: async () => {
                            let Profile = await import("./pages/Profile")
                            return { Component: Profile.default }
                          },
                        },
                        {
                          path: "profile/order",
                          lazy: async () => {
                            let Orders = await import("./pages/Orders")
                            return { Component: Orders.default }
                          },
                        },
                        {
                          path: "profile/review",
                          lazy: async () => {
                            let Reviews = await import("./pages/Reviews")
                            return { Component: Reviews.default }
                          },
                        },
                      ]
                    },
                  ]
                },
              ]
            },
            {
              lazy: async () => {
                let DashboardLayout = await import("./components/dashboard/DashboardLayout")
                return { Component: DashboardLayout.default }
              },
              children: [
                {
                  element: <RequireAuth allowedRoles={['ROLE_SELLER']} />,
                  children: [
                    {
                      path: "dashboard",
                      lazy: async () => {
                        let Dashboard = await import("./pages/dashboard/Dashboard")
                        return { Component: Dashboard.default }
                      },
                    },
                    {
                      path: "manage-products",
                      lazy: async () => {
                        let ManageProducts = await import("./pages/dashboard/ManageProducts")
                        return { Component: ManageProducts.default }
                      },
                    },
                    {
                      path: "manage-orders",
                      lazy: async () => {
                        let ManageOrders = await import("./pages/dashboard/ManageOrders")
                        return { Component: ManageOrders.default }
                      },
                    },
                    {
                      path: "detail/:id",
                      lazy: async () => {
                        let DetailProduct = await import("./pages/dashboard/DetailProduct")
                        return { Component: DetailProduct.default }
                      },
                    },
                    {
                      path: "user/:id",
                      lazy: async () => {
                        let DetailAccount = await import("./pages/dashboard/DetailAccount")
                        return { Component: DetailAccount.default }
                      },
                    },
                  ]
                },
                {
                  element: <RequireAuth allowedRoles={['ROLE_ADMIN']} />,
                  children: [
                    {
                      path: "manage-users",
                      lazy: async () => {
                        let ManageUsers = await import("./pages/dashboard/ManageUsers")
                        return { Component: ManageUsers.default }
                      },
                    },
                    {
                      path: "manage-reviews",
                      lazy: async () => {
                        let ManageReviews = await import("./pages/dashboard/ManageReviews")
                        return { Component: ManageReviews.default }
                      },
                    },
                  ]
                },
              ]
            },
          ]
        },
      ],
    },
  ], {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionStatusRevalidation: true,
      v7_skipActionErrorRevalidation: true,
    }
  });

  return <RouterProvider
    router={router}
    future={{
      v7_startTransition: true,
    }}
  />;
}

export default App
