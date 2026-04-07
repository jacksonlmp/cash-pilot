from pathlib import Path

from dotenv import load_dotenv

for env_path in (
    Path(__file__).resolve().parent.parent.parent / ".env",
    Path(__file__).resolve().parent.parent.parent.parent.parent / ".env",
):
    load_dotenv(env_path)

from .base import *  # noqa: F403

DEBUG = True

_hosts = os.environ.get("DJANGO_ALLOWED_HOSTS", "*")  # noqa: F405
if _hosts == "*":
    ALLOWED_HOSTS = ["*"]
else:
    ALLOWED_HOSTS = [h.strip() for h in _hosts.split(",") if h.strip()]

CSRF_TRUSTED_ORIGINS = [
    o.strip()
    for o in os.environ.get("DJANGO_CSRF_TRUSTED_ORIGINS", "").split(",")  # noqa: F405
    if o.strip()
]
