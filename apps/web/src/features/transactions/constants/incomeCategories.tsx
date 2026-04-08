import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, CreditCard, PlusCircle } from "lucide-react";

export const incomeCategoryValues = ["Salário", "Benefícios", "Extra"] as const;

export type IncomeCategory = (typeof incomeCategoryValues)[number];

export type IncomeCategoryOption = {
  value: IncomeCategory;
  label: string;
  icon: LucideIcon;
  insightLabel: string;
};

export const incomeCategoryOptions: IncomeCategoryOption[] = [
  {
    value: "Salário",
    label: "Salário",
    icon: BriefcaseBusiness,
    insightLabel: "reforça sua base de receita recorrente",
  },
  {
    value: "Benefícios",
    label: "Benefícios",
    icon: CreditCard,
    insightLabel: "aumenta seu colchão para gastos essenciais",
  },
  {
    value: "Extra",
    label: "Extra",
    icon: PlusCircle,
    insightLabel: "cria margem para acelerar suas metas",
  },
];

export function isIncomeCategory(value: string): value is IncomeCategory {
  return incomeCategoryValues.includes(value as IncomeCategory);
}
