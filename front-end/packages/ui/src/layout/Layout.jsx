import { Outlet } from "react-router";
import ScrollToTop from "./ScrollToTop";
import LoadingProgress from "./LoadingProgress";

const Layout = () => {
  return (
    <main className="App">
      <LoadingProgress />
      <ScrollToTop />
      <Outlet />
    </main>
  );
};

export default Layout;
