import { NavLink } from "react-router";
import { useTitle } from "@ring/shared";
import { HeaderContainer } from "../components/custom/Components";
import TableReviews from "../components/table/TableReviews";
import CustomBreadcrumbs from "../components/custom/CustomBreadcrumbs";

const ManageReviews = () => {
  //Set title
  useTitle("Đánh giá");

  return (
    <>
      <HeaderContainer>
        <div>
          <h2>Quản lý đánh giá</h2>
          <CustomBreadcrumbs separator="." maxItems={4} aria-label="breadcrumb">
            <NavLink to={"/review"}>Quản lý đánh giá</NavLink>
          </CustomBreadcrumbs>
        </div>
      </HeaderContainer>
      <TableReviews />
    </>
  );
};

export default ManageReviews;
