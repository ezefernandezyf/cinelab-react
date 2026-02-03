import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header/Header";

test("render logo and search input (at least one)", () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
  
  // Logo
  expect(screen.getByRole("link", { name: /cinelab/i })).toBeInTheDocument();
  
  // Al menos un searchbox (puede haber desktop + mobile)
  const searchBoxes = screen.getAllByRole("searchbox", { name: /buscar películas/i });
  expect(searchBoxes.length).toBeGreaterThanOrEqual(1);
});