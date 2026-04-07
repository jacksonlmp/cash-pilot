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
    if "[::1]" not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append("[::1]")

CSRF_TRUSTED_ORIGINS = [
    o.strip()
    for o in os.environ.get("DJANGO_CSRF_TRUSTED_ORIGINS", "").split(",")  # noqa: F405
    if o.strip()
]
if not CSRF_TRUSTED_ORIGINS:
    _port = os.environ.get("DJANGO_PUBLIC_PORT", "8000")  # noqa: F405
    CSRF_TRUSTED_ORIGINS = [
        f"http://localhost:{_port}",
        f"http://127.0.0.1:{_port}",
        f"http://[::1]:{_port}",
    ]
