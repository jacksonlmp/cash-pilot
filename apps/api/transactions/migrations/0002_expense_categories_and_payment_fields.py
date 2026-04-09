import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("cards", "0001_initial"),
        ("categories", "0001_initial"),
        ("transactions", "0001_initial"),
        ("wallets", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="transaction",
            name="wallet",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="transactions",
                to="wallets.wallet",
            ),
        ),
        migrations.AddField(
            model_name="transaction",
            name="card",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="transactions",
                to="cards.card",
            ),
        ),
        migrations.AddField(
            model_name="transaction",
            name="expense_category",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="transactions",
                to="categories.category",
            ),
        ),
        migrations.AddField(
            model_name="transaction",
            name="payment_method",
            field=models.CharField(
                blank=True,
                choices=[
                    ("benefit", "Benefit"),
                    ("credit", "Credit"),
                    ("debit", "Debit"),
                    ("pix", "Pix"),
                ],
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="transaction",
            name="expense_type",
            field=models.CharField(
                blank=True,
                choices=[
                    ("essential", "Essential"),
                    ("non_essential", "Non essential"),
                ],
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="transaction",
            name="is_installment",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="transaction",
            name="installment_count",
            field=models.PositiveSmallIntegerField(default=1),
        ),
    ]
