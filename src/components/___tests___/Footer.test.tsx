import { render, screen } from "@testing-library/react";
import Footer from "../Footer/Footer";

test("renders footer with copyright", () => {
  render(<Footer />);
  expect(screen.getByText(/©/)).toBeInTheDocument();
  expect(screen.getByRole("navigation", { name: /footer/i })).toBeInTheDocument();
});