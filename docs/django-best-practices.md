---
description: "Workspace rule: enforce Django/DRF best practices for models, serializers, views, permissions, and tests."
applyTo: "backend/**/*.py"
---

# Rule 03 - Django Best Practices

## Project Context

- This project is a REST API based on Django.
- Code must follow the official Django style and PEP 8 recommendations.
- The repository uses Black, isort, and Flake8 for formatting and linting.
- Lines must not exceed 88 characters.
- Code should be idempotent: running Black or isort must not introduce further changes.
- Avoid redundant comments and prefer descriptive naming.
- Use double quotes for strings; docstrings may use triple double quotes.

## Writing and Formatting Style

- Follow PEP 8.
- Use explicit type hints when possible.
- Prefer f-strings over string concatenation.
- Classes and functions must include short, objective docstrings.
- Use spaces around binary operators.
- No code line may exceed 88 characters.
- Use a single space after commas and after `#` in inline comments.
- Use one blank line between function/method definitions and two blank lines between classes.

## Django-specific Preferences

- Follow naming and structural conventions from Django source code.
- Use variable and method names aligned with Django conventions (`get_queryset`, `form_valid`, etc.).
- When creating models, prefer an internal `class Meta:` block with 4-space indentation.
- Use `reverse_lazy` in class-based views when lazy reversal is required.
- When generating migrations, do not add custom logic in `operations`.

## Tests

- Follow Django testing standards.
- Use pytest-django for integration tests.
- Use fixtures for data setup (shared fixtures in `apps/conftest.py`).
- Test one behavior per test.
- Avoid dependencies between tests.

## Linting and Validation

- Black must auto-format code consistently.
- isort must keep imports in proper sorted groups.
- Flake8 must pass without E, F, or W errors.
- Avoid unused imports and unreferenced variables.
- Avoid `print()` and prefer logging (`import logging` and `logger = logging.getLogger(__name__)`).
