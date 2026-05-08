#services/price_services.py
import requests
import yfinance as yf
from config import Config

def get_crypto_price(symbol):
    """Get crypto price in USD from CoinGecko (free, no key)"""
    try:
        url = f'https://api.coingecko.com/api/v3/simple/price?ids={symbol.lower()}&vs_currencies=usd'
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            return resp.json()[symbol.lower()]['usd']
    except:
        pass
    return None

def get_gold_price():
    """Gold spot price per ounce in USD using goldapi.io"""
    headers = {'x-access-token': Config.GOLDAPI_KEY}
    try:
        resp = requests.get('https://www.goldapi.io/api/XAU/USD', headers=headers, timeout=5)
        if resp.status_code == 200:
            return resp.json()['price']
    except:
        pass
    return None

def get_forex_rate(base, target='USD'):
    """Free forex rates from open.er-api.com (no key)"""
    try:
        url = f'https://open.er-api.com/v6/latest/{base.upper()}'
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            rates = resp.json()['rates']
            return rates.get(target.upper())
    except:
        pass
    return None

def get_stock_price(symbol):
    """Stock/ETF price using yfinance (free, no key)"""
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="1d")
        if not hist.empty:
            return hist['Close'].iloc[-1]
    except:
        pass
    return None

def fetch_current_price(asset_type, symbol):
    """Return current unit price for a given asset type/symbol."""
    if asset_type == 'CRYPTO':
        return get_crypto_price(symbol)
    elif asset_type == 'GOLD':
        return get_gold_price()
    elif asset_type == 'FIAT':
        # For fiat like 'NGN', get rate to USD
        return get_forex_rate(symbol, 'USD')
    elif asset_type in ('STOCK', 'ETF', 'ASSET'):
        return get_stock_price(symbol)
    return None