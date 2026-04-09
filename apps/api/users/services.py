from django.contrib.auth import get_user_model

from wallets.models import Wallet


def get_or_create_demo_user():
    user_model = get_user_model()
    user, _ = user_model.objects.get_or_create(
        username="demo",
        defaults={
            "first_name": "Jackson",
            "last_name": "Silva",
            "email": "demo@cashpilot.local",
        },
    )
    return user


def ensure_demo_data():
    from users.demo import seed_demo_data

    user = get_or_create_demo_user()
    if not Wallet.objects.filter(user=user).exists():
        seed_demo_data(user)
    return user


def get_request_user(request):
    if getattr(request, "user", None) and request.user.is_authenticated:
        return request.user
    return ensure_demo_data()
