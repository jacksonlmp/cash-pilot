from django.core.management.base import BaseCommand

from users.services import ensure_demo_data


class Command(BaseCommand):
    help = "Seed demo financial data for the temporary public dashboard."

    def handle(self, *args, **options):
        user = ensure_demo_data()
        self.stdout.write(self.style.SUCCESS(f"Demo data ready for {user.username}"))
