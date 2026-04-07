# CashPilot Backend Rules — Django

## Purpose

These rules are mandatory for all backend code in **CashPilot**.

They exist to ensure:

* consistency
* maintainability
* predictable architecture
* reusable business logic
* safe financial operations

These rules must be followed in all backend implementations.

---

# 1. Stack Rules

## Mandatory stack

* Python
* Django
* Django REST Framework
* PostgreSQL

## Allowed

* Celery or similar for async tasks
* Redis for cache/queue
* pytest or Django test framework

## Forbidden

* float for money
* business-critical logic in signals
* raw SQL unless strictly necessary and justified
* logic duplication across views, serializers, and services

---

# 2. Project Structure Rules

## Backend root

All backend code must live under:

```txt id="n6uq3t"
apps/api/
```

## Domain-based apps only

Each app must represent a business domain.

Allowed examples:

```txt id="e1m4rm"
users/
transactions/
wallets/
cards/
debts/
goals/
insights/
```

Forbidden examples:

```txt id="tukjdq"
services/
helpers/
models/
api_core/
misc/
```

Do not organize the backend by technical layer only.

---

# 3. File Structure Rules Per App

Each domain app should follow this structure unless the module is still very small:

```txt id="pnu79y"
<domain>/
  models.py
  serializers.py
  views.py
  urls.py
  admin.py
  services.py
  selectors.py
  tests/
```

Optional split is allowed only when complexity justifies it:

```txt id="x4e0v1"
<domain>/
  models/
  api/
  services/
  selectors/
  tests/
```

Do not prematurely split files if they are still small.

---

# 4. Responsibility Rules

## Views

Views must:

* authenticate the request
* validate input through serializers
* call services/selectors
* return HTTP responses

Views must not:

* implement business workflows
* perform multi-model orchestration directly
* contain long conditional flows
* calculate financial summaries directly

## Serializers

Serializers are responsible for:

* input validation
* output formatting
* simple create/update when trivial

Serializers must not:

* contain cross-domain orchestration
* implement heavy business rules
* update multiple entities in hidden ways

## Services

Services are mandatory when:

* multiple models are involved
* money is moved or recalculated
* debt/installments are created or updated
* reusable workflows are needed
* atomic operations are required

## Selectors

Selectors are responsible for:

* query logic
* filtered listing
* aggregations
* summaries
* dashboards
* analytics read models

Selectors must not mutate state.

## Models

Models should contain:

* entity behavior
* local validation
* convenience methods tied to that entity

Models must not orchestrate workflows spanning multiple bounded contexts.

---

# 5. Naming Rules

## App names

* lowercase
* plural when representing collections/domains

Examples:

```txt id="54fn7m"
transactions
wallets
cards
debts
```

## Model names

* singular
* clear business meaning

Examples:

```txt id="lt5vqe"
Transaction
Wallet
CreditCard
Debt
Goal
```

## Service names

* verb-first
* action-oriented

Examples:

```txt id="6pd5an"
create_expense
register_income
create_installment_purchase
simulate_debt_payoff
```

## Selector names

* query-oriented
* read-focused

Examples:

```txt id="9ljvr0"
get_dashboard_summary
get_wallet_summary
get_filtered_transactions
```

## URL names

Use clear REST names.

Good:

```txt id="bhqz7d"
transactions-list
transactions-detail
wallet-summary
debt-payoff-simulation
```

Bad:

```txt id="eg8q8m"
doTransaction
walletStuff
getAllThings
```

---

# 6. Money Rules

## Decimal only

All money fields must use `DecimalField`.

Example:

```python id="eoqwjd"
amount = models.DecimalField(max_digits=12, decimal_places=2)
```

Never use:

* float
* integer cents mixed inconsistently across the project

## Currency pattern

Default currency is BRL unless a future requirement states otherwise.

## Formatting

Formatting money is a presentation concern.
Do not store formatted money strings in the database.

---

# 7. Financial Integrity Rules

## Atomic operations are mandatory

Any workflow affecting:

* balances
* debts
* installments
* recurring generation
* wallet updates

must use `transaction.atomic()`.

## Derived values

Source of truth must be explicit.

Preferred:

* transactions are the ledger
* summaries derive from transactions and wallet/card context

## No hidden financial side effects

Financial mutations must be explicit in services.
They must not happen inside:

* signals
* serializer side effects
* model save overrides without clear justification

---

# 8. Endpoint Rules

## REST-first

Prefer REST endpoints for CRUD and summaries.

Examples:

```txt id="5vohp5"
GET /api/transactions/
POST /api/transactions/
GET /api/cards/
GET /api/wallets/summary/
POST /api/debts/payoff-simulation/
```

## Custom endpoints

Allowed when the use case is not plain CRUD.

Examples:

* payoff simulation
* dashboard summary
* recurring preview
* debt strategy comparison

## Response consistency

Collections should follow:

```json id="ffwqfn"
{
  "count": 0,
  "results": []
}
```

Custom summaries should return structured objects, not ad-hoc arrays.

---

# 9. Permission Rules

## User scoping is mandatory

Every query that exposes user data must be scoped to the authenticated user.

Required pattern:

```python id="0j54ek"
queryset.filter(user=request.user)
```

## Forbidden

* returning unscoped querysets
* trusting client-provided user IDs for ownership
* exposing data across users

## DRF permissions

Use:

* `IsAuthenticated`
* custom permissions when needed

Do not leave private financial endpoints publicly accessible.

---

# 10. Query Rules

## Performance practices

Use:

* `select_related`
* `prefetch_related`
* annotations
* aggregates in the database

## Avoid

* N+1 queries
* iterating in Python for things the database can aggregate
* repeating the same filtering logic across multiple views

If query logic is reused twice, move it to a selector.

---

# 11. Testing Rules

## Minimum coverage per domain

Each domain must include tests for:

* models
* services
* API endpoints

## Financial features must be tested first

Highest priority:

* installment generation
* debt payoff calculations
* balance summaries
* recurring transactions
* permissions on user financial data

## Forbidden testing style

* shallow tests that only assert status 200
* tests with unclear names
* tests depending on global mutable state

## Test naming

Use descriptive names, for example:

```txt id="4d3wyl"
test_create_expense_updates_wallet_summary
test_payoff_simulation_returns_expected_month
test_user_cannot_access_another_users_transactions
```

---

# 12. Admin Rules

Django admin is allowed and recommended for:

* support
* internal debugging
* seed verification
* manual inspection

Admin must not be the primary user workflow.

Register useful domain models in admin with:

* filters
* search
* readable list displays

---

# 13. Signals Rules

## Default rule

Do not use signals for core business logic.

## Allowed uses

* logs
* non-critical notifications
* analytics side effects

## Forbidden uses

* wallet recalculation
* debt creation
* installment creation
* transaction propagation
* critical financial updates

If the business depends on it, it must be explicit in a service.

---

# 14. Async and Scheduled Jobs Rules

Async/background jobs are allowed for:

* recurring transaction generation
* reminders
* insight generation
* statement alerts

Tasks must:

* be thin
* call services
* not duplicate business logic

---

# 15. Validation Rules

## Input validation

Must happen in serializers.

## Domain validation

May also exist in:

* model clean methods
* services for workflow-level constraints

Example:

* serializer validates field types
* service validates if a wallet can receive that operation
* model validates entity invariants

---

# 16. Recurring Transactions Rules

Recurring entries must be first-class.
Do not fake recurrence only in frontend.

Required approach:

* store recurrence metadata
* generate occurrences explicitly
* keep traceability to the recurrence source

---

# 17. Installment Rules

Installments must be modeled explicitly.

Each installment workflow must preserve:

* original purchase amount
* total installment count
* current installment number
* remaining amount
* linked card
* linked transaction or debt record

The system must be able to answer:

* how many installments remain
* total remaining debt
* monthly impact

---

# 18. Debt Rules

Debt logic belongs to the `debts` domain.

Debt-related calculations must be centralized and testable.

Supported capabilities should include:

* remaining balance
* payoff month estimation
* extra payment simulation
* strategy comparison when relevant

No debt projection logic should live in frontend only.

---

# 19. Reuse Rules for Web, Bot, and Mobile

Backend logic must be reusable across:

* web app
* chatbot
* mobile app

Therefore:

* business logic must live in services
* read logic must live in selectors
* API must be consistent
* frontend-specific assumptions must stay out of the backend

---

# 20. Code Style Rules

## General

* prefer readability over cleverness
* small functions
* explicit names
* meaningful docstrings when needed

## Code Style

* Python formatting: `black` and `isort`.
* Linting: `flake8`.
* Comment policy: only test code may include comments; production/feature code must not include comments.

## Comments

Only test code may include comments.
Production/feature code must not include comments.

## Utility files

Do not create generic dumping grounds like:

```txt id="j2v3vn"
utils.py
helpers.py
misc.py
common.py
```

Only create a utility module when the scope is clear and bounded.

---

# 21. Migration Rules

* Every schema change requires a migration
* Never edit old migrations unless absolutely necessary in local-only unreleased work
* Review migrations before committing
* Avoid dangerous data migrations without clear rollback considerations

---

# 22. Documentation Rules

When creating a new feature, document:

* purpose
* endpoint behavior
* key rules
* important assumptions

At minimum, keep docs sufficient for:

* future self
* bot integration
* mobile integration

---

# 23. Implementation Workflow Rules

Every new backend feature should follow this order:

1. Define domain ownership
2. Create/update model
3. Create migration
4. Create/update serializer
5. Implement service
6. Implement selector if needed
7. Expose via view/endpoint
8. Write tests
9. Register admin if useful
10. Document behavior

Do not start with frontend assumptions first.

---

# 24. Initial Priority Order for CashPilot

Implement backend domains in this order:

1. users
2. transactions
3. wallets
4. cards
5. goals
6. debts
7. insights

This order supports the product flow:

* auth
* add income/expense
* wallet
* cards
* goals
* debt payoff
* smart guidance

---

# 25. Non-Negotiable Rules

These are absolute:

* Never use float for money
* Never leave user data unscoped
* Never place core financial logic in signals
* Never put large business workflows in views
* Never duplicate critical calculations across layers
* Always use atomic transactions for financial workflows
* Always keep business logic reusable for Web, Bot, and Mobile

---

# Final Rule

CashPilot backend must behave like a **financial engine**, not a collection of CRUD endpoints.

Every implementation must favor:

* clarity
* safety
* explicitness
* reuse
* testability
* product evolution
