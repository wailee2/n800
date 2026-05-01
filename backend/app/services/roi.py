def calculate_profit_loss(initial_value: float, current_value: float) -> float:
    return current_value - initial_value


def calculate_roi(initial_value: float, current_value: float) -> float:
    if initial_value == 0:
        return 0.0
    return ((current_value - initial_value) / initial_value) * 100


def calculate_yearly_return(current_value: float, expected_growth_rate: float = 0.1) -> float:
    """
    Simple yearly estimate.
    expected_growth_rate defaults to 10%.
    """
    return current_value * expected_growth_rate