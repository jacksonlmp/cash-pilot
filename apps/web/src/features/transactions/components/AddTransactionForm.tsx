import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  incomeCategoryOptions,
  incomeCategoryValues,
  isIncomeCategory,
} from "@/features/transactions/constants/incomeCategories";
import { useCreateTransaction } from "@/features/transactions/hooks/useCreateTransaction";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { cn } from "@/lib/cn";

const transactionSchema = z
  .object({
    title: z.string(),
    category: z.string().min(2, "Informe a categoria."),
    amount: z.coerce.number().positive("Informe um valor positivo."),
    walletId: z.string().min(1, "Selecione uma carteira."),
    kind: z.enum(["income", "expense"]),
  })
  .superRefine((values, ctx) => {
    if (values.kind === "income" && !isIncomeCategory(values.category)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione um tipo de entrada válido.",
        path: ["category"],
      });
    }

    if (values.kind === "expense" && values.title.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Use um titulo mais descritivo.",
        path: ["title"],
      });
    }
  });

type TransactionFormValues = z.infer<typeof transactionSchema>;

export function AddTransactionForm() {
  const mutation = useCreateTransaction();
  const walletsQuery = useWallets();
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      category: incomeCategoryValues[0],
      amount: 0,
      walletId: "w1",
      kind: "expense",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync({
      title: values.kind === "income" ? values.category : values.title.trim(),
      category: values.category,
      kind: values.kind,
      amount: values.amount,
      walletId: values.walletId,
      paymentMethod: values.kind === "expense" ? "debit" : undefined,
      expenseType: values.kind === "expense" ? "essential" : undefined,
      occurredAt: new Date().toISOString(),
    });
    form.reset({
      title: "",
      category: incomeCategoryValues[0],
      amount: 0,
      walletId: values.walletId,
      kind: values.kind,
    });
  });

  const selectedKind = form.watch("kind");
  const selectedCategory = form.watch("category");

  useEffect(() => {
    if (selectedKind === "income" && !isIncomeCategory(selectedCategory)) {
      form.setValue("category", incomeCategoryValues[0], { shouldValidate: true });
    }
  }, [form, selectedCategory, selectedKind]);

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
          disabled={selectedKind === "income"}
          {...form.register("title")}
        />
        {selectedKind === "income" ? (
          <div className="flex flex-col gap-2 text-sm text-on-surface-variant">
            <span>Categoria</span>
            <div className="flex flex-wrap gap-3">
              {incomeCategoryOptions.map((option) => {
                const isActive = selectedCategory === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => form.setValue("category", option.value, { shouldValidate: true })}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm transition-all duration-300 ease-kinetic",
                      isActive
                        ? "bg-primary font-semibold text-white"
                        : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            {form.formState.errors.category ? (
              <span className="text-xs text-error">{form.formState.errors.category.message}</span>
            ) : null}
          </div>
        ) : (
          <Input
            label="Categoria"
            placeholder="Ex: Receita"
            error={form.formState.errors.category?.message}
            {...form.register("category")}
          />
        )}
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
