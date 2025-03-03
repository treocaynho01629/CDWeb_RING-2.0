import { trackWindowScroll } from "react-lazy-load-image-component";
import Progress from "@ring/ui/Progress";
import Grid from "@mui/material/Grid2";
import Product from "./Product";

const Products = ({ data, isError, isLoading, isSuccess, scrollPosition }) => {
  let productsContent;

  if (isLoading || isError) {
    productsContent = [...Array(15)].map((item, index) => (
      <Grid key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
        <Product />
      </Grid>
    ));
  } else if (isSuccess) {
    const { ids, entities } = data;

    productsContent = ids?.length
      ? ids?.map((id, index) => {
          const book = entities[id];

          return (
            <Grid
              key={`product-${id}-${index}`}
              size={{ xs: 6, sm: 4, sm_md: 3, md_lg: 2.4 }}
            >
              <Product {...{ book, scrollPosition }} />
            </Grid>
          );
        })
      : [...Array(15)].map((item, index) => (
          <Grid key={index} size={{ xs: 6, sm: 4, sm_md: 3, md_lg: 2.4 }}>
            <Product />
          </Grid>
        ));
  }

  return (
    <div style={{ width: "100%", position: "relative", padding: "5px 0" }}>
      {(isLoading || isError) && (
        <Progress color={isError ? "error" : "primary"} />
      )}
      <Grid container spacing={0.2} size="grow">
        {productsContent}
      </Grid>
    </div>
  );
};

export default trackWindowScroll(Products);
