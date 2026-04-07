---
name: cashpilot-django-backend
description: Django and Django REST Framework conventions for the CashPilot backend under apps/api—domain-organized apps, thin views, services for workflows, selectors for reads, Decimal money, atomic transactions, and CashPilot-specific financial rules. Use when implementing or maintaining CashPilot backend code, apps/api features, models, serializers, APIs, tests, or when the user mentions Django, DRF, wallets, transactions, debts, or financial logic.
---

# CashPilot Django Backend

Pragmatic architecture for a scalable, testable API shared by web, bot, and mobile. Prefer Django’s strengths; avoid academic layering.

## Core principles

1. **Use Django fully**: models, admin, migrations, DRF serializers and views—do not reinvent what the framework already solves.
2. **Organize by domain**, not technical layer. One Django app per business domain (`users`, `transactions`, `wallets`, `cards`, `debts`, `goals`, `insights`), not generic `models/` / `views/` trees at project root.
3. **Thin views**: authenticate, validate, delegate to service or selector, return response—no business logic in views.
4. **Service layer (mandatory for non-trivial logic)**: multiple models, financial math, reusable workflows, atomic writes—use `services.py`.
5. **Selectors (read layer)**: queries, aggregations, dashboards, filtering—in `selectors.py`.
6. **Explicit over magic**: prefer explicit service calls; avoid hidden behavior and heavy reliance on signals for core behavior.

## Project layout

```txt
apps/api/
  users/
  transactions/
  wallets/
  cards/
  debts/
  goals/
  insights/
```

## Internal app layout

Default (each domain app):

```txt
<app>/
  models.py
  serializers.py
  views.py
  services.py
  selectors.py
  urls.py
  admin.py
  tests/
```

For large modules only, split into subpackages (e.g. `models/`, `api/`, `services/`, `selectors/`).

## Domain responsibilities

| App | Responsibility |
|-----|----------------|
| `users` | Auth, profile, preferences |
| `transactions` | Income/expense, recurring, installments |
| `wallets` | Balances, benefits (e.g. Caju), available funds |
| `cards` | Credit cards, limits, closing/due dates |
| `debts` | Tracking, projections, payoff simulation |
| `goals` | Savings, reserves |
| `insights` | Alerts, analytics, summaries |

## Views, services, selectors, models

**Views** — thin; no multi-model orchestration.

```python
def create(self, request):
    serializer = TransactionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    transaction = create_transaction(user=request.user, data=serializer.validated_data)
    return Response(...)
```

**Services** — workflows: create expense, installment purchase, register income, update wallet, simulate debt payoff. Use `@transaction.atomic` when writes must be consistent.

**Selectors** — reads: `get_dashboard_summary`, `get_transactions_filtered`, wallet balance queries, debt projections.

**Models** — entity-level helpers only (e.g. `progress_percentage`); no cross-entity orchestration.

## API design

- RESTful resources; nouns in URLs; consistent naming.
- Examples: `GET/POST /api/transactions/`, `GET /api/wallets/summary/`, `POST /api/debts/payoff-simulation/`.
- List responses follow common pagination shape when applicable: `count` + `results` (or project-standard pagination classes).

## Financial rules (non-negotiable)

- **Never use `float` for money.** Use `DecimalField(max_digits=12, decimal_places=2)` (adjust precision if product requires).
- **Always use atomic transactions** for operations that touch multiple rows or derived state:

```python
from django.db import transaction

@transaction.atomic
def create_expense(...):
    ...
```

- **Source of truth**: transactions are authoritative; wallet balance is **derived**, not independently “edited” without going through defined rules.

## Signals policy

- **Allowed**: logging, notifications (non-financial side effects).
- **Forbidden**: financial logic, balance updates, debt creation—use services explicitly.

## Serializers

- **Do**: validation, representation, simple transforms.
- **Don’t**: business orchestration or multi-model writes—delegate to services.

## Security

- Scope querysets and lookups to the current user: e.g. `queryset.filter(user=request.user)` (or equivalent tenant/user FK).
- Never return another user’s financial data.

## Performance

- Use `select_related` / `prefetch_related` to avoid N+1 queries on list and detail endpoints.

## Testing

Each domain should cover:

- Model tests
- Service tests (especially financial paths)
- API tests

**Priority**: (1) financial logic, (2) services, (3) endpoints.

## Product-specific backend notes

- **Recurring transactions**: store recurrence rules; generate occurrences via scheduled job; preserve history.
- **Installments**: store total amount, installment count, current index, remaining balance.
- **Debts**: support projections, strategies (e.g. snowball/avalanche), payoff simulation endpoints.

## Naming conventions

- Services: verbs + domain nouns — `create_transaction`, `register_income`, `simulate_debt_payoff`.
- Selectors: `get_*` — `get_dashboard_summary`, `get_transactions_filtered`.

## Anti-patterns

- Fat views; logic in serializers; signals doing money/balance work; `float` for currency; duplicated business rules; premature abstraction.

## Implementation flow (new feature)

1. Choose domain (app).
2. Model + migration.
3. Serializer(s).
4. Service(s) for writes/workflows.
5. Selector(s) if reads are non-trivial.
6. View + URLs.
7. Tests (model → service → API).
8. Admin registration.
9. API/docs as required by the project.

## Standard

Generated backend code for CashPilot should remain domain-driven, with thin views, services for workflows, selectors for reads, `Decimal` money, atomic financial operations, and explicit, testable flows suitable for web, bot, and mobile clients.
