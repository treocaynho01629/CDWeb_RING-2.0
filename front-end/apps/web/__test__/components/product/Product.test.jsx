import { render, screen } from "@testing-library/react";
import Product from "../../../src/components/product/Product";

describe("Product", () => {
  it("should render placeholder", () => {
    render(<Product />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
