import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "../../pages";

test("navega a Home al clickear el logo sin recargar la página", async () => {
  const user = userEvent.setup();
  
  render(
    <MemoryRouter initialEntries={["/not-found"]}>
      <AppRoutes />
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: /404/i })).toBeInTheDocument();

  const logo = screen.getByRole("link", { name: /cinelab — inicio/i });
  await user.click(logo);

  
  expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
});