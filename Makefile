# CashPilot — Docker Compose shortcuts (run from repo root)

.DEFAULT_GOAL := help

DC := docker compose
API := api
PYTEST_ARGS ?=

.PHONY: help
help: ## Show available targets
	@echo "CashPilot — common commands"
	@echo ""
	@grep -E '^[a-zA-Z0-9_.-]+:.*?## ' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

.PHONY: up
up: ## Start all services (detached)
	$(DC) up -d

.PHONY: dev
dev: ## Start all services, rebuild image if Dockerfile/requirements changed
	$(DC) up -d --build

.PHONY: down
down: ## Stop containers (volumes kept)
	$(DC) down

.PHONY: down-volumes
down-volumes: ## Stop containers and remove volumes (database is wiped)
	$(DC) down -v

.PHONY: restart
restart: ## Restart every service in the compose project
	$(DC) restart

.PHONY: restart-api
restart-api: ## Restart only the API container
	$(DC) restart $(API)

.PHONY: build
build: ## Build images
	$(DC) build

.PHONY: rebuild
rebuild: ## Rebuild images without cache, then start stack
	$(DC) build --no-cache
	$(DC) up -d

.PHONY: ps
ps: ## List running compose services
	$(DC) ps

.PHONY: logs
logs: ## Follow logs (all services)
	$(DC) logs -f

.PHONY: logs-api
logs-api: ## Follow API logs only
	$(DC) logs -f $(API)

.PHONY: test
test: ## Run pytest in API container (installs dev deps in ephemeral run)
	$(DC) run --rm $(API) sh -c "pip install --no-cache-dir -q -r requirements-dev.txt && pytest $(PYTEST_ARGS)"

.PHONY: test-local
test-local: ## Run pytest in apps/api using local .venv (set POSTGRES_* for DB tests)
	cd apps/api && . .venv/bin/activate && pytest $(PYTEST_ARGS)

.PHONY: lint
lint: ## Run black, isort, and flake8 inside API container
	$(DC) exec -T $(API) sh -c "pip install --no-cache-dir -q -r requirements-dev.txt && cd /app && black . && isort . && flake8 . --exclude=.venv --config=.flake8"

.PHONY: check
check: ## Django system check (container must be up)
	$(DC) exec -T $(API) python manage.py check

.PHONY: migrate
migrate: ## Apply migrations
	$(DC) exec -T $(API) python manage.py migrate

.PHONY: makemigrations
makemigrations: ## Create migrations (pass app: make makemigrations ARGS='users')
	$(DC) exec -T $(API) python manage.py makemigrations $(ARGS)

.PHONY: shell
shell: ## Django shell (interactive)
	$(DC) exec -it $(API) python manage.py shell

.PHONY: dbshell
dbshell: ## PostgreSQL shell (psql, interactive)
	$(DC) exec -it $(API) python manage.py dbshell

.PHONY: createsuperuser
createsuperuser: ## Create Django superuser (interactive)
	$(DC) exec $(API) python manage.py createsuperuser

.PHONY: bash
bash: ## Shell inside API container
	$(DC) exec -it $(API) sh
