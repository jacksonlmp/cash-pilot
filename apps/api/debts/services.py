from debts.selectors import get_debt_summary


def get_payoff_plan(user):
    return get_debt_summary(user)
