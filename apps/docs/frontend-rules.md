# CashPilot Frontend Rules — ReactJS

## Purpose

These rules are mandatory for all frontend code in **CashPilot**.

They exist to ensure:

* consistency
* maintainability
* predictable architecture
* reusable UI and logic
* scalability for future Web and Mobile alignment

These rules must be followed in all frontend implementations.

---

# 1. Stack Rules

## Mandatory stack

* ReactJS
* TypeScript
* CSS Modules, Tailwind, or another single chosen styling system
* React Query / TanStack Query for server state
* React Hook Form for forms
* Zod or Yup for schema validation

## Allowed

* Zustand or Context for lightweight client state
* Feature-based folder organization
* Reusable hooks
* Design tokens

## Forbidden

* mixing multiple state management patterns without reason
* inline styles scattered across the project
* duplicated business rules from backend
* direct API calls inside random components
* giant components with UI + fetch + transformation + business rules all together

---

# 2. Project Structure Rules

Frontend code must live under:

```txt
apps/web/
```

Recommended structure:

```txt
apps/web/
  src/
    app/
    pages/ or routes/
    features/
    components/
    services/
    hooks/
    lib/
    types/
    constants/
    styles/
```

---

# 3. Architecture Rules

## Domain-first / feature-first organization

Organize primarily by **feature/domain**, not by file type only.

✅ Good:

```txt
features/
  dashboard/
  transactions/
  wallet/
  debts/
  goals/
```

❌ Bad:

```txt
components/
pages/
hooks/
utils/
services/
```

with all unrelated things mixed forever.

Use shared folders only for truly shared code.

---

# 4. Responsibility Rules

## Pages / Route Components

Pages are responsible for:

* composing the screen
* connecting feature sections
* handling route-level concerns

Pages must not:

* hold complex business logic
* perform raw API requests directly
* become giant 500-line files

---

## Feature Components

Feature components are responsible for:

* rendering domain-specific UI
* interacting with hooks/services from that feature
* local UI states when needed

Examples:

* `TransactionsList`
* `WalletSummary`
* `DebtProjectionCard`

---

## Shared Components

Shared components are responsible for:

* generic UI
* reusable building blocks
* design system consistency

Examples:

* `Button`
* `Modal`
* `Input`
* `Select`
* `Card`
* `Badge`
* `Tabs`

Shared components must not contain product-specific business logic.

---

## Hooks

Hooks are responsible for:

* encapsulating reusable logic
* wrapping data fetching
* handling local interaction patterns

Examples:

* `useTransactionsFilters`
* `useWalletSummary`
* `useCreateExpense`

Hooks must not become a hidden dumping ground for unrelated logic.

---

## Services / API Layer

Services are responsible for:

* API communication
* request/response mapping
* endpoint abstraction

Components must not call `fetch` or `axios` directly unless there is a very good reason.

---

# 5. Naming Rules

## Components

* PascalCase
* descriptive
* aligned with business meaning

Examples:

```txt
TransactionsPage
WalletCard
DebtSummary
AddTransactionModal
```

## Hooks

* must start with `use`

Examples:

```txt
useTransactions
useWallet
useDebtProjection
```

## Files

* match exported component/hook purpose
* avoid vague names

✅ Good:

```txt
add-transaction-modal.tsx
wallet-summary-card.tsx
use-transactions-filters.ts
```

❌ Bad:

```txt
helper.tsx
stuff.ts
common.tsx
```

---

# 6. Component Rules

## Keep components small and focused

A component should ideally do one thing well.

When a component starts handling:

* rendering
* fetch logic
* transformation
* filtering
* modal state
* form logic

it probably needs to be split.

---

## Presentational vs container separation

Prefer separating:

* UI rendering
* behavior/data logic

Pattern example:

* `TransactionsPage.tsx`
* `TransactionsList.tsx`
* `useTransactions.ts`

This is not mandatory everywhere, but should be used when it improves clarity.

---

## Avoid prop drilling when it becomes painful

Use:

* Context
* feature state
* composed hooks

Do not pass 8 levels of props just to avoid using proper composition.

---

# 7. State Management Rules

## Server state

Use React Query / TanStack Query for:

* API data
* caching
* loading states
* invalidation
* optimistic updates where appropriate

Do not manually recreate server-state management with `useEffect + useState` everywhere.

---

## Client state

Use local state for:

* modal open/close
* dropdown selection
* temporary filters
* UI-only state

Use lightweight global state only when necessary:

* auth/session
* theme
* global UI state
* shared transaction draft if needed

Do not globalize state too early.

---

# 8. API Rules

## All API calls must go through services

Example structure:

```txt
services/
  api-client.ts
  transactions.service.ts
  wallet.service.ts
  debts.service.ts
```

Components should call hooks or services, not raw endpoints.

---

## Strong typing

All request and response data must be typed.

Prefer:

* DTO types
* Zod schemas when helpful
* shared endpoint contracts when possible

---

## No frontend-only critical calculations

Critical financial calculations must come from backend or mirror backend contracts explicitly.

The frontend may display:

* progress
* percentages
* lightweight derived UI values

But must not invent or own the source of truth for:

* debt payoff results
* installment totals
* wallet balances
* financial projections

---

# 9. Form Rules

Use:

* React Hook Form
* Zod/Yup validation

Forms must:

* validate clearly
* show inline errors
* handle loading state
* disable submit when invalid or submitting

---

## Modal forms

Modal forms like:

* Add Transaction
* Add Income
* Create Goal
* Add Card

must:

* focus on fast completion
* have clear CTA
* preserve consistency with other modals

---

## Conditional forms

When fields depend on user choice, reveal them progressively.

Example:

* if transaction is installment → show installments + card
* if income is recurring → show recurrence fields

Do not overwhelm the user with irrelevant fields.

---

# 10. UI and Design Rules

## Design consistency is mandatory

Use a consistent design language:

* spacing
* typography
* border radius
* colors
* shadows
* interactions

Do not style each screen as if it belongs to a different product.

---

## Design tokens

Prefer centralized values for:

* colors
* spacing
* border radius
* z-index
* shadows
* breakpoints

Do not hardcode random values everywhere.

---

## Visual hierarchy

Each screen must make the main information obvious.

Examples:

* Dashboard → balance first
* Transactions → list + filters
* Wallet → where the money is
* Debts → what is owed and when it ends

Do not make secondary UI compete with core information.

---

## Accessibility

Minimum expectations:

* keyboard navigable
* visible focus states
* sufficient contrast
* labels for form fields
* buttons should look clickable
* modals should trap focus correctly

---

# 11. UX Rules

## Fast actions should stay fast

The most common actions:

* add transaction
* add income
* filter transactions
* view debts
* check wallet

must require as little friction as possible.

---

## Repeated actions must stay consistent

If “Add Transaction” opens a chooser in one part of the app, it should behave the same in another part unless there is a very strong UX reason.

Consistency > surprise.

---

## Empty states

Every major screen should have a meaningful empty state.

Examples:

* No transactions yet
* No cards added
* No goals created

Empty states should guide the next action.

---

## Loading states

Use real loading states:

* skeletons
* placeholders
* disabled buttons
* loading text

Do not leave the user guessing.

---

## Error states

Errors must be:

* user-friendly
* visible
* actionable

Do not expose raw backend exceptions to users.

---

# 12. Performance Rules

## Avoid unnecessary rerenders

Use:

* memoization when justified
* derived values carefully
* stable props and keys

Do not optimize prematurely, but do not ignore obvious waste.

---

## Lazy loading

Use route-based or component-based lazy loading when useful for:

* large pages
* modals
* analytics screens
* less frequent sections

---

## Lists

For long lists:

* paginate or virtualize if needed
* avoid rendering massive lists blindly

Transactions screens may grow large; plan accordingly.

---

# 13. Reuse Rules

## Shared logic belongs in hooks or lib

If logic is used in more than one place, consider extracting it.

Examples:

* currency formatting
* transaction grouping by day
* date label formatting
* filter normalization

---

## Shared UI belongs in components

Examples:

* `SummaryCard`
* `MetricCard`
* `FilterChip`
* `EmptyState`
* `SectionHeader`

---

## Do not over-share too early

Not everything belongs in shared.
Prefer extracting after proven repetition.

---

# 14. Routing Rules

Routes must reflect product structure.

Examples:

```txt
/dashboard
/transactions
/wallet
/debts
/goals
/settings
```

Do not create confusing route structures without clear product reasoning.

---

# 15. Error Handling Rules

## Network and API errors

Must be handled centrally where possible.

Use:

* API client interceptors or wrappers
* reusable error mappers
* predictable toast/alert system

---

## Form submission errors

Must show clear messages near the action that failed.

---

## Forbidden

* silent failures
* console-only errors for critical actions
* generic “Something went wrong” everywhere without context

---

# 16. Styling Rules

Choose one main styling strategy and stay consistent.

Examples:

* Tailwind
* CSS Modules
* Styled Components

Do not mix:

* random inline style objects
* multiple styling paradigms
* duplicated utility class systems

---

## Responsive behavior

Even though the product is web-first, screens must be built with future responsiveness in mind.

Avoid desktop-only assumptions that make future mobile adaptation painful.

---

# 17. File Size Rules

When a file becomes too large, split it.

Suggested warning signs:

* component file > 250–300 lines
* hook handling too many concerns
* page component rendering too many unrelated blocks

Large files are not automatically wrong, but they must justify their size.

---

# 18. Testing Rules

Frontend must be testable.

Priority to test:

* critical interaction flows
* forms
* filters
* modals
* data rendering states
* edge cases for debt/wallet/transactions screens

Recommended:

* React Testing Library
* Vitest or Jest

Do not test implementation details when behavior is what matters.

---

# 19. Logging and Debug Rules

Do not leave:

* stray console logs
* debug prints
* temporary comments
* dead code branches

If debugging helpers are needed, they must be removed before merge.

---

# 20. Constants and Enums Rules

All repeated product constants should be centralized.

Examples:

* transaction types
* payment methods
* categories
* alert thresholds
* card brands
* wallet types

This helps:

* consistency
* bot/mobile reuse later
* easier refactor

---

# 21. Frontend Domain Rules for CashPilot

## Dashboard

Must prioritize:

* current balance
* monthly summary
* debt visibility
* wallet status
* reserve status
* insights

## Transactions

Must prioritize:

* readability
* grouped history
* filters
* quick creation/edit

## Wallet

Must clearly separate:

* real money
* credit usage
* benefits
* goals/reserves

## Debts

Must prioritize:

* what is owed
* monthly impact
* payoff timeline
* simulation clarity

## Goals

Must be motivational and easy to understand.

---

# 22. Modal Rules

Modals must:

* have clear purpose
* not be overloaded
* close safely
* support keyboard navigation
* have clear primary and secondary actions

Do not turn modals into full mini-apps unless absolutely necessary.

Use side panels instead of small modals for:

* advanced filters
* complex editing
* dense configuration

---

# 23. Search and Filter Rules

Filters must be:

* easy to reset
* visible when active
* consistent across the app

Search must feel immediate and useful.

If there are active filters, the UI should clearly show them.

---

# 24. Future-Proofing Rules

This frontend is web-first, but the product is multi-interface in the long term:

* web
* mobile
* chatbot

Therefore:

* keep business logic out of view components
* keep data contracts clear
* avoid UI structures that cannot evolve

The frontend should be a client of the product logic, not the owner of it.

---

# 25. Non-Negotiable Rules

* No critical financial logic only in frontend
* No raw fetch calls scattered across components
* No giant god-components
* No duplicated enums/constants across features
* No inconsistent interaction patterns for the same action
* No vague file names
* No untyped API data in important flows
* No inaccessible modals/forms/buttons

---

# Final Rule

CashPilot frontend must behave like a **financial product**, not a collection of screens.

Every implementation must favor:

* clarity
* consistency
* maintainability
* responsiveness
* reusable logic
* strong UX
* easy future expansion for Mobile and Chat
