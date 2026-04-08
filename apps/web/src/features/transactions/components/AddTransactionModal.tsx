import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  CreditCard,
  Gift,
  Lightbulb,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { useExpenseCategories } from "@/features/categories/hooks/useExpenseCategories";
import { useCards } from "@/features/cards/hooks/useCards";
import {
  incomeCategoryOptions,
  incomeCategoryValues,
  isIncomeCategory,
} from "@/features/transactions/constants/incomeCategories";
import { useCreateTransaction } from "@/features/transactions/hooks/useCreateTransaction";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/formatters";
import type { Card, Wallet as WalletType } from "@/types/domain";

function parseCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) / 100 : 0;
}

function formatCurrencyInput(value: string) {
  const amount = parseCurrencyInput(value);
  return amount > 0 ? formatCurrency(amount) : "";
}

function getTodayDateValue() {
  return new Date().toISOString().slice(0, 10);
}

function toOccurredAtIso(dateValue: string) {
  return new Date(`${dateValue}T12:00:00`).toISOString();
}

const paymentMethodOptions = [
  { value: "benefit", label: "Benefícios", icon: Gift },
  { value: "credit", label: "Crédito", icon: CreditCard },
  { value: "debit", label: "Débito", icon: Wallet },
  { value: "pix", label: "Pix", icon: Zap },
] as const;

const expenseTypeOptions = [
  { value: "essential", label: "Essencial" },
  { value: "non_essential", label: "Não essencial" },
] as const;

const transactionSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    categoryId: z.string(),
    amountInput: z.string().min(1, "Informe um valor positivo."),
    walletId: z.string(),
    cardId: z.string(),
    kind: z.enum(["income", "expense"]),
    occurredAt: z.string().min(1, "Informe a data."),
    paymentMethod: z.enum(["benefit", "credit", "debit", "pix"]),
    expenseType: z.enum(["essential", "non_essential"]),
    isInstallment: z.boolean(),
    installmentCount: z.string(),
  })
  .superRefine((values, ctx) => {
    const parsedAmount = parseCurrencyInput(values.amountInput);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe um valor positivo.",
        path: ["amountInput"],
      });
    }

    if (values.kind === "income") {
      if (!isIncomeCategory(values.category)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione um tipo de entrada válido.",
          path: ["category"],
        });
      }
      return;
    }

    if (values.description.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Use uma descrição mais descritiva.",
        path: ["description"],
      });
    }

    if (!values.categoryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma categoria.",
        path: ["categoryId"],
      });
    }

    if (values.paymentMethod === "credit") {
      if (!values.cardId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione um cartão.",
          path: ["cardId"],
        });
      }

      const installmentCount = Number(values.installmentCount);
      if (values.isInstallment && (!Number.isFinite(installmentCount) || installmentCount < 2)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe ao menos 2 parcelas.",
          path: ["installmentCount"],
        });
      }
      return;
    }

    if (!values.walletId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione a origem do pagamento.",
        path: ["walletId"],
      });
    }
  });

type TransactionFormValues = z.infer<typeof transactionSchema>;

type AddTransactionModalProps = {
  defaultKind: "income" | "expense";
  isOpen: boolean;
  onClose: () => void;
};

function getPrimaryWallet(wallets: WalletType[]) {
  return (
    wallets.find((wallet) => wallet.type === "bank") ??
    wallets.find((wallet) => wallet.type === "cash") ??
    wallets[0]
  );
}

function setIfChanged(
  form: ReturnType<typeof useForm<TransactionFormValues>>,
  field: keyof TransactionFormValues,
  value: TransactionFormValues[keyof TransactionFormValues],
) {
  if (form.getValues(field) !== value) {
    form.setValue(field, value);
  }
}

export function AddTransactionModal({
  defaultKind,
  isOpen,
  onClose,
}: AddTransactionModalProps) {
  const mutation = useCreateTransaction();
  const walletsQuery = useWallets();
  const cardsQuery = useCards();
  const expenseCategoriesQuery = useExpenseCategories();
  const wallets = walletsQuery.data ?? [];
  const cards = cardsQuery.data ?? [];
  const expenseCategories = expenseCategoriesQuery.data ?? [];
  const benefitWallet = useMemo(
    () => wallets.find((wallet) => wallet.type === "benefit"),
    [wallets],
  );
  const spendWallets = useMemo(
    () => wallets.filter((wallet) => wallet.type === "bank" || wallet.type === "cash"),
    [wallets],
  );
  const creditCards = useMemo(
    () => cards.filter((card) => card.cardKind === "credit"),
    [cards],
  );
  const primaryWallet = useMemo(() => getPrimaryWallet(wallets), [wallets]);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      description: "",
      category: defaultKind === "income" ? incomeCategoryValues[0] : "",
      categoryId: "",
      amountInput: "",
      walletId: "",
      cardId: "",
      kind: defaultKind,
      occurredAt: getTodayDateValue(),
      paymentMethod: "debit",
      expenseType: "essential",
      isInstallment: false,
      installmentCount: "2",
    },
  });

  const selectedCategory = form.watch("category");
  const selectedCategoryId = form.watch("categoryId");
  const amountInput = form.watch("amountInput");
  const paymentMethod = form.watch("paymentMethod");
  const expenseType = form.watch("expenseType");
  const isInstallment = form.watch("isInstallment");
  const amount = parseCurrencyInput(amountInput);

  useEffect(() => {
    setIfChanged(form, "kind", defaultKind);
    setIfChanged(form, "occurredAt", getTodayDateValue());
    setIfChanged(form, "amountInput", "");
    setIfChanged(form, "title", "");
    setIfChanged(form, "description", "");
    setIfChanged(form, "cardId", "");
    setIfChanged(form, "walletId", "");
    setIfChanged(form, "isInstallment", false);
    setIfChanged(form, "installmentCount", "2");
    setIfChanged(form, "expenseType", "essential");
    setIfChanged(form, "paymentMethod", "debit");
    setIfChanged(form, "category", defaultKind === "income" ? incomeCategoryValues[0] : "");
    setIfChanged(form, "categoryId", "");
  }, [defaultKind, form]);

  useEffect(() => {
    if (defaultKind === "income") {
      setIfChanged(form, "category", incomeCategoryValues[0]);
      return;
    }

    if (expenseCategories.length > 0 && !form.getValues("categoryId")) {
      setIfChanged(form, "categoryId", String(expenseCategories[0].id));
    }
  }, [defaultKind, expenseCategories, form]);

  useEffect(() => {
    if (defaultKind !== "expense") {
      if (wallets.length > 0 && !form.getValues("walletId")) {
        setIfChanged(form, "walletId", String(wallets[0].id));
      }
      return;
    }

    if (paymentMethod === "benefit") {
      setIfChanged(form, "walletId", benefitWallet ? String(benefitWallet.id) : "");
      setIfChanged(form, "cardId", "");
      setIfChanged(form, "isInstallment", false);
      return;
    }

    if (paymentMethod === "credit") {
      setIfChanged(form, "walletId", "");
      if (creditCards.length > 0 && !form.getValues("cardId")) {
        setIfChanged(form, "cardId", String(creditCards[0].id));
      }
      return;
    }

    if (!form.getValues("walletId") && spendWallets.length > 0) {
      setIfChanged(form, "walletId", String(spendWallets[0].id));
    }
    setIfChanged(form, "cardId", "");
    setIfChanged(form, "isInstallment", false);
  }, [benefitWallet, creditCards, defaultKind, form, paymentMethod, spendWallets, wallets]);

  if (!isOpen) {
    return null;
  }

  const selectedIncomeOption =
    incomeCategoryOptions.find((option) => option.value === selectedCategory) ??
    incomeCategoryOptions[0];
  const selectedExpenseCategory = expenseCategories.find(
    (category) => String(category.id) === selectedCategoryId,
  );
  const selectedWallet =
    wallets.find((wallet) => String(wallet.id) === form.watch("walletId")) ?? primaryWallet;
  const budgetBase =
    selectedWallet?.monthlyBudget ??
    primaryWallet?.monthlyBudget ??
    0;
  const budgetUsagePercent = budgetBase > 0 ? Math.round((amount / budgetBase) * 100) : 0;
  const canSubmitIncome = wallets.length > 0;
  const canSubmitExpense =
    expenseCategories.length > 0 &&
    ((paymentMethod === "credit" && creditCards.length > 0) ||
      (paymentMethod === "benefit" && Boolean(benefitWallet)) ||
      ((paymentMethod === "debit" || paymentMethod === "pix") && spendWallets.length > 0));

  const onSubmit = form.handleSubmit(async (values) => {
    if (values.kind === "income") {
      const amountValue = parseCurrencyInput(values.amountInput);

      await mutation.mutateAsync({
        title: values.category,
        category: values.category,
        kind: values.kind,
        amount: amountValue,
        walletId: Number(values.walletId),
        occurredAt: toOccurredAtIso(values.occurredAt),
      });

      onClose();
      form.reset({
        ...form.getValues(),
        title: "",
        description: "",
        category: incomeCategoryValues[0],
        categoryId: "",
        amountInput: "",
        occurredAt: getTodayDateValue(),
      });
      return;
    }

    const amountValue = parseCurrencyInput(values.amountInput);
    const paymentWalletId =
      values.paymentMethod === "benefit"
        ? benefitWallet?.id
        : values.paymentMethod === "credit"
          ? undefined
          : Number(values.walletId);

    await mutation.mutateAsync({
      title: values.description.trim(),
      category: selectedExpenseCategory?.name ?? "",
      categoryId: Number(values.categoryId),
      kind: "expense",
      amount: amountValue,
      walletId: paymentWalletId,
      cardId: values.paymentMethod === "credit" ? Number(values.cardId) : undefined,
      paymentMethod: values.paymentMethod,
      expenseType: values.expenseType,
      isInstallment: values.paymentMethod === "credit" ? values.isInstallment : false,
      installmentCount:
        values.paymentMethod === "credit" && values.isInstallment
          ? Number(values.installmentCount)
          : 1,
      occurredAt: toOccurredAtIso(values.occurredAt),
    });

    onClose();
    form.reset({
      ...form.getValues(),
      title: "",
      description: "",
      category: "",
      categoryId: expenseCategories[0] ? String(expenseCategories[0].id) : "",
      amountInput: "",
      walletId:
        paymentMethod === "benefit"
          ? benefitWallet
            ? String(benefitWallet.id)
            : ""
          : spendWallets[0]
            ? String(spendWallets[0].id)
            : "",
      cardId: creditCards[0] ? String(creditCards[0].id) : "",
      occurredAt: getTodayDateValue(),
      paymentMethod: "debit",
      expenseType: "essential",
      isInstallment: false,
      installmentCount: "2",
    });
  });

  if (defaultKind === "income") {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-primary/20 px-0 backdrop-blur-sm md:items-center md:px-6">
        <div className="w-full max-w-lg overflow-hidden rounded-t-[1.5rem] bg-surface-container-lowest shadow-[0_24px_48px_-12px_rgba(35,0,96,0.12)] md:rounded-[1.5rem]">
          <div className="flex items-center justify-between border-b border-outline/10 px-6 py-5">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-primary">
              Nova Entrada
            </h2>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high"
              onClick={onClose}
              aria-label="Fechar modal"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={onSubmit}>
            <div className="space-y-8 p-6">
              {amount > 0 ? (
                <div className="flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/5 p-4 text-primary">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80">
                    <Lightbulb size={18} />
                  </span>
                  <p className="text-sm font-medium leading-relaxed text-primary">
                    {formatCurrency(amount)} em {selectedIncomeOption.label.toLowerCase()}{" "}
                    {selectedIncomeOption.insightLabel}. O insight real será integrado em breve.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-xl border border-outline/10 bg-surface-container-low p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Lightbulb size={18} />
                  </span>
                  <p className="text-sm font-medium leading-relaxed text-on-surface-variant">
                    Informe um valor para visualizar um insight mockado sobre esta entrada.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label
                  className="px-1 text-xs font-semibold uppercase tracking-[0.22em] text-on-surface-variant"
                  htmlFor="income-amount"
                >
                  Valor
                </label>
                <div
                  className={cn(
                    "relative flex items-center overflow-hidden rounded-xl border-l-4 border-l-transparent bg-surface-container-low transition-all duration-300 ease-kinetic focus-within:border-l-primary",
                    form.formState.errors.amountInput ? "border border-error/30" : "",
                  )}
                >
                  <div className="absolute left-4 text-primary">
                    <Wallet size={30} />
                  </div>
                  <input
                    id="income-amount"
                    inputMode="numeric"
                    placeholder="R$ 0,00"
                    className="w-full bg-transparent py-6 pl-16 pr-6 font-display text-4xl font-extrabold tracking-tight text-primary placeholder:text-outline/50 focus:outline-none"
                    value={amountInput}
                    onChange={(event) => {
                      form.setValue("amountInput", formatCurrencyInput(event.target.value), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  />
                </div>
                {form.formState.errors.amountInput ? (
                  <p className="text-xs text-error">{form.formState.errors.amountInput.message}</p>
                ) : null}
              </div>

              <div className="space-y-4">
                <label className="px-1 text-xs font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                  Tipo
                </label>
                <div className="flex flex-wrap gap-3">
                  {incomeCategoryOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = selectedCategory === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          form.setValue("category", option.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm transition-all duration-300 ease-kinetic",
                          isActive
                            ? "scale-[1.02] bg-primary font-semibold text-white shadow-md"
                            : "bg-surface-container-high font-medium text-on-surface-variant hover:bg-surface-variant",
                        )}
                      >
                        <Icon size={18} />
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
                {form.formState.errors.category ? (
                  <p className="text-xs text-error">{form.formState.errors.category.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label
                  className="px-1 text-xs font-semibold uppercase tracking-[0.22em] text-on-surface-variant"
                  htmlFor="income-date"
                >
                  Data
                </label>
                <div className="relative flex items-center overflow-hidden rounded-xl border-l-4 border-l-transparent bg-surface-container-low transition-all duration-300 ease-kinetic focus-within:border-l-primary">
                  <div className="absolute left-4 text-on-surface-variant">
                    <CalendarDays size={18} />
                  </div>
                  <input
                    id="income-date"
                    type="date"
                    className="w-full bg-transparent py-4 pl-12 pr-4 font-medium text-on-surface focus:outline-none"
                    {...form.register("occurredAt")}
                  />
                </div>
                {form.formState.errors.occurredAt ? (
                  <p className="text-xs text-error">{form.formState.errors.occurredAt.message}</p>
                ) : null}
              </div>

              {!canSubmitIncome ? (
                <div className="rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
                  Nenhuma carteira disponível para receber esta entrada.
                </div>
              ) : null}
            </div>

            <div className="p-6 pt-2 pb-10 md:pb-6">
              <Button
                type="submit"
                disabled={mutation.isPending || !canSubmitIncome}
                className="h-auto w-full justify-center rounded-2xl bg-secondary py-5 text-lg font-bold shadow-[0_12px_24px_-8px_rgba(0,110,42,0.3)] hover:scale-[1.02] hover:bg-secondary"
              >
                {mutation.isPending ? "Salvando..." : "Salvar entrada"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/20 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[95vh] w-full max-w-xl flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_-4px_24px_-4px_rgba(35,0,96,0.06)]">
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-primary">
            Nova Saída
          </h2>
          <button
            type="button"
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="space-y-6 overflow-y-auto px-8 pb-8">
            <div className="flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/5 p-4">
              <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-primary">
                <Lightbulb size={18} />
              </span>
              <p className="text-sm font-medium leading-relaxed text-primary">
                {amount > 0 && budgetBase > 0
                  ? `Esse gasto vai consumir ${budgetUsagePercent}% do seu orçamento mensal disponível.`
                  : "Informe um valor para visualizar um insight mockado sobre o impacto deste gasto."}
              </p>
            </div>

            <div className="space-y-2">
              <label
                className="ml-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                htmlFor="expense-amount"
              >
                Valor
              </label>
              <div className="group relative flex items-center rounded-xl border-l-4 border-transparent bg-surface-container-high px-6 py-5 transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                <Wallet className="mr-4 text-primary" size={24} />
                <input
                  id="expense-amount"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  className="w-full bg-transparent p-0 font-display text-3xl font-extrabold text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none"
                  value={amountInput}
                  onChange={(event) => {
                    form.setValue("amountInput", formatCurrencyInput(event.target.value), {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />
              </div>
              {form.formState.errors.amountInput ? (
                <p className="text-xs text-error">{form.formState.errors.amountInput.message}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    className="ml-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                    htmlFor="expense-date"
                  >
                    Data
                  </label>
                  <div className="relative rounded-xl border-l-4 border-transparent bg-surface-container-high px-4 py-3 transition-all focus-within:border-primary">
                    <input
                      id="expense-date"
                      type="date"
                      className="w-full bg-transparent border-none p-0 font-medium text-on-surface focus:outline-none"
                      {...form.register("occurredAt")}
                    />
                    <CalendarDays className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="ml-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                    htmlFor="expense-category"
                  >
                    Categoria
                  </label>
                  <div className="relative rounded-xl border-l-4 border-transparent bg-surface-container-high px-4 py-3 transition-all focus-within:border-primary">
                    <select
                      id="expense-category"
                      className="w-full appearance-none bg-transparent border-none p-0 font-medium text-on-surface focus:outline-none"
                      {...form.register("categoryId")}
                    >
                      <option value="">Selecione</option>
                      {expenseCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                      ▾
                    </span>
                  </div>
                  {form.formState.errors.categoryId ? (
                    <p className="text-xs text-error">{form.formState.errors.categoryId.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="ml-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                  htmlFor="expense-description"
                >
                  Descrição
                </label>
                <div className="rounded-xl border-l-4 border-transparent bg-surface-container-high px-5 py-4 transition-all focus-within:border-primary">
                  <input
                    id="expense-description"
                    className="w-full bg-transparent border-none p-0 font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none"
                    placeholder="Ex: Aluguel, Supermercado..."
                    {...form.register("description")}
                  />
                </div>
                {form.formState.errors.description ? (
                  <p className="text-xs text-error">{form.formState.errors.description.message}</p>
                ) : null}
              </div>

              <div className="space-y-3">
                <label className="ml-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Forma de Pagamento
                </label>
                <div className="flex flex-wrap gap-2">
                  {paymentMethodOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = paymentMethod === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => form.setValue("paymentMethod", option.value, { shouldValidate: true })}
                        className={cn(
                          "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-all",
                          isActive
                            ? "bg-primary font-bold text-white shadow-md"
                            : option.value === "benefit"
                              ? "border border-primary/10 bg-primary/5 font-bold text-primary"
                              : "bg-surface-container-high font-semibold text-on-surface-variant hover:bg-surface-container-highest",
                        )}
                      >
                        <Icon size={18} />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {(paymentMethod === "debit" || paymentMethod === "pix") && (
                <div className="space-y-2">
                  <label
                    className="ml-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                    htmlFor="expense-wallet"
                  >
                    Carteira
                  </label>
                  <div className="relative rounded-xl border-l-4 border-transparent bg-surface-container-high px-4 py-3 transition-all focus-within:border-primary">
                    <select
                      id="expense-wallet"
                      className="w-full appearance-none bg-transparent border-none p-0 font-medium text-on-surface focus:outline-none"
                      {...form.register("walletId")}
                    >
                      <option value="">Selecione</option>
                      {spendWallets.map((wallet) => (
                        <option key={wallet.id} value={wallet.id}>
                          {wallet.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                      ▾
                    </span>
                  </div>
                  {form.formState.errors.walletId ? (
                    <p className="text-xs text-error">{form.formState.errors.walletId.message}</p>
                  ) : null}
                </div>
              )}

              {paymentMethod === "benefit" && (
                <div className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
                  {benefitWallet
                    ? `Esta compra será debitada automaticamente da carteira ${benefitWallet.name}.`
                    : "Nenhuma carteira de benefícios disponível para esta compra."}
                </div>
              )}

              <div className="space-y-4 rounded-xl bg-surface-container-low p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-on-surface-variant" size={18} />
                    <span className="text-sm font-bold text-on-surface">Compra parcelada</span>
                  </div>
                  <button
                    type="button"
                    aria-label="Compra parcelada"
                    disabled={paymentMethod !== "credit"}
                    onClick={() =>
                      form.setValue("isInstallment", !isInstallment, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      paymentMethod !== "credit"
                        ? "cursor-not-allowed bg-surface-container-highest opacity-50"
                        : isInstallment
                          ? "bg-secondary"
                          : "bg-surface-container-highest",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-[2px] h-5 w-5 rounded-full bg-white transition-transform",
                        isInstallment ? "translate-x-5" : "translate-x-0.5",
                      )}
                    />
                  </button>
                </div>

                {paymentMethod === "credit" ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="ml-1 text-[10px] font-bold uppercase text-on-surface-variant">
                        Cartão
                      </label>
                      <div className="rounded-lg bg-surface-container-lowest px-3 py-2">
                        <select
                          className="w-full appearance-none bg-transparent border-none p-0 text-sm font-bold text-on-surface focus:outline-none"
                          {...form.register("cardId")}
                        >
                          <option value="">Selecione</option>
                          {creditCards.map((card: Card) => (
                            <option key={card.id} value={card.id}>
                              {card.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {form.formState.errors.cardId ? (
                        <p className="text-xs text-error">{form.formState.errors.cardId.message}</p>
                      ) : null}
                    </div>

                    {isInstallment ? (
                      <div className="space-y-1">
                        <label className="ml-1 text-[10px] font-bold uppercase text-on-surface-variant">
                          Parcelas
                        </label>
                        <div className="rounded-lg bg-surface-container-lowest px-3 py-2">
                          <input
                            inputMode="numeric"
                            className="w-full bg-transparent border-none p-0 text-sm font-bold text-on-surface focus:outline-none"
                            {...form.register("installmentCount")}
                          />
                        </div>
                        {form.formState.errors.installmentCount ? (
                          <p className="text-xs text-error">
                            {form.formState.errors.installmentCount.message}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="space-y-3">
                <label className="ml-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Tipo de Gasto
                </label>
                <div className="flex w-fit rounded-full bg-surface-container-high p-1">
                  {expenseTypeOptions.map((option) => {
                    const isActive = expenseType === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => form.setValue("expenseType", option.value)}
                        className={cn(
                          "rounded-full px-6 py-2 text-sm transition-all",
                          isActive
                            ? "bg-surface-container-lowest font-bold text-primary shadow-sm"
                            : "font-semibold text-on-surface-variant hover:text-on-surface",
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-error/10 bg-error/5 p-4">
                <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-error/10 text-error">
                  <CircleAlert size={18} />
                </span>
                <p className="text-sm font-medium leading-relaxed text-on-error-container">
                  {selectedExpenseCategory
                    ? `Você já está monitorando a categoria ${selectedExpenseCategory.name}. O alerta real de orçamento será conectado em breve.`
                    : "Selecione uma categoria para visualizar um alerta mockado de orçamento."}
                </p>
              </div>

              {!canSubmitExpense ? (
                <div className="rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
                  Finalize o cadastro de categorias, cartões e carteiras necessárias para registrar este gasto.
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 bg-surface-container-low/50 px-8 py-6 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="order-2 flex-1 rounded-xl px-6 py-4 font-bold text-on-surface-variant transition-all hover:bg-surface-container-high sm:order-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !canSubmitExpense}
              className="order-1 flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-4 font-bold text-on-secondary shadow-lg shadow-secondary/20 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:order-2"
            >
              <CheckCircle2 size={18} />
              {mutation.isPending ? "Salvando..." : "Salvar gasto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
