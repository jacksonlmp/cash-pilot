import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/app/App";

describe("CashPilot app shell", () => {
  it("renders dashboard route with the main sections", async () => {
    window.history.pushState({}, "Dashboard", "/dashboard");

    render(<App />);

    expect(await screen.findByText(/Ola, Jackson/i)).toBeInTheDocument();
    expect(screen.getByText("Situacao do Mes")).toBeInTheDocument();
    expect(screen.getByText("Cartao MultiBeneficios")).toBeInTheDocument();
  });

  it("navigates to goals page from the sidebar", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "Dashboard", "/dashboard");

    render(<App />);

    await user.click(await screen.findByRole("link", { name: /metas/i }));

    expect(await screen.findByText("Metas e reservas")).toBeInTheDocument();
  });

  it("validates and submits the quick transaction form", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "Dashboard", "/dashboard");

    render(<App />);

    const addButtons = screen.getAllByRole("button", { name: /adicionar/i });
    await user.click(addButtons[0]);
    await user.click(screen.getByRole("button", { name: /entrada/i }));

    const submitButton = await screen.findByRole("button", { name: /salvar entrada/i });
    expect(await screen.findByRole("heading", { name: /nova entrada/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /salário/i })).toBeInTheDocument();
    await user.click(submitButton);

    expect(await screen.findByText("Informe um valor positivo.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /benefícios/i }));
    await user.type(screen.getByPlaceholderText("R$ 0,00"), "120000");

    await user.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText("Benefícios")).toBeInTheDocument(),
    );
  });

  it("submits the premium expense modal with credit installments", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "Dashboard", "/dashboard");

    render(<App />);

    const addButtons = screen.getAllByRole("button", { name: /adicionar/i });
    await user.click(addButtons[0]);
    await user.click(screen.getByRole("button", { name: /saida/i }));

    expect(await screen.findByRole("heading", { name: /nova saída/i })).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("R$ 0,00"), "25000");
    await user.type(
      screen.getByPlaceholderText("Ex: Aluguel, Supermercado..."),
      "Jantar com amigos",
    );
    await user.click(screen.getByRole("button", { name: /crédito/i }));
    await user.click(screen.getByRole("button", { name: /compra parcelada/i }));

    await user.click(screen.getByRole("button", { name: /salvar gasto/i }));

    await waitFor(() =>
      expect(screen.getAllByText("Jantar com amigos").length).toBeGreaterThan(1),
    );
  });

  it("renders coming soon pages for inactive modules", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "Dashboard", "/dashboard");

    render(<App />);

    await user.click(await screen.findByRole("link", { name: /assinaturas/i }));

    expect(await screen.findByText(/Assinaturas em breve/i)).toBeInTheDocument();
  });
});
