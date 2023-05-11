import React from "react"
import { Grid } from "@mui/material"
import styled from "styled-components"
import Product from "./Product"

const Container = styled.div`
    padding: 20px 0px;
`

const Products = ({booksList}) => {

  return (
    <Container>
      <Grid container spacing={1}>
        {booksList.map((book)=>(
            <Grid key={book.id} item xs={12} sm={4} md={3} lg={2.4}>
              <Product book={book}/>
            </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Products