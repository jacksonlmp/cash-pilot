import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useCreateTransaction } from "@/features/transactions/hooks/useCreateTransaction";
import { useWallets } from "@/features/wallet/hooks/useWallets";

const transactionSchema = z.object({
  title: z.string().min(3, "Use um titulo mais descritivo."),
  category: z.string().min(2, "Informe a categoria."),
  amount: z.coerce.number().positive("Informe um valor positivo."),
  walletId: z.string().min(1, "Selecione uma carteira."),
  kind: z.enum(["income", "expense", "transfer"]),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export function AddTransactionForm() {
  const mutation = useCreateTransaction();
  const walletsQuery = useWallets();
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      category: "",
      amount: 0,
      walletId: "w1",
      kind: "expense",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync(values);
    form.reset({
      title: "",
      category: "",
      amount: 0,
      walletId: values.walletId,
      kind: values.kind,
    });
  });

  return (
    <Card className="space-y-5 bg-surface-container-low">
      <div>
        <p className="text-sm text-on-surface-variant">Quick creation</p>
        <h3 className="mt-1 font-display text-2xl font-bold">Adicionar transacao</h3>
      </div>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <Input
          label="Titulo"
          placeholder="Ex: Consultoria abril"
          error={form.formState.errors.title?.message}
          {...form.register("title")}
        />
        <Input
          label="Categoria"
          placeholder="Ex: Receita"
          error={form.formState.errors.category?.message}
          {...form.register("category")}
        />
        <Input
          label="Valor"
          type="number"
          step="0.01"
          placeholder="0,00"
          error={form.formState.errors.amount?.message}
          {...form.register("amount")}
        />
        <label className="flex flex-col gap-2 text-sm text-on-surface-variant">
          <span>Tipo</span>
          <select
            className="rounded-3xl bg-surface-container-high px-4 py-4 text-on-surface"
            {...form.register("kind")}
          >
            <option value="expense">Saida</option>
            <option value="income">Entrada</option>
            <option value="transfer">Transferencia</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-on-surface-variant">
          <span>Carteira</span>
          <select
            className="rounded-3xl bg-surface-container-high px-4 py-4 text-on-surface"
            {...form.register("walletId")}
          >
            {(walletsQuery.data ?? []).map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : "Salvar movimento"}
        </Button>
      </form>
    </Card>
  );
}
