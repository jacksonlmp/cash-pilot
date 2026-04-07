import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/app/App";

describe("CashPilot app shell", () => {
  it("renders dashboard route with the main sections", async () => {
    window.history.pushState({}, "Dashboard", "/dashboard");

    render(<App />);

    expect(await screen.findByText("Panorama do caixa pessoal")).toBeInTheDocument();
    expect(screen.getByText("Adicionar transacao")).toBeInTheDocument();
    expect(screen.getByText("Quick actions")).toBeInTheDocument();
  });

  it("navigates to goals page from the sidebar", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "Dashboard", "/dashboard");

    render(<App />);

    await user.click(await screen.findByRole("link", { name: /metas/i }));

    expect(
      await screen.findByText("Metas motivacionais com leitura simples"),
    ).toBeInTheDocument();
  });

  it("validates and submits the quick transaction form", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "Dashboard", "/dashboard");

    render(<App />);

    const submitButton = screen.getByRole("button", { name: /salvar movimento/i });
    await screen.findByRole("heading", { name: /adicionar transacao/i });
    await user.click(submitButton);

    expect(await screen.findByText("Use um titulo mais descritivo.")).toBeInTheDocument();
    expect(screen.getByText("Informe a categoria.")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Ex: Consultoria abril"), "Freela produto");
    await user.type(screen.getByPlaceholderText("Ex: Receita"), "Receita");
    await user.clear(screen.getByPlaceholderText("0,00"));
    await user.type(screen.getByPlaceholderText("0,00"), "1200");

    await user.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText("Freela produto")).toBeInTheDocument(),
    );
  });
});
