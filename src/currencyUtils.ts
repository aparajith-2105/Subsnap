export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$", name: "United States Dollar", flag: "🇺🇸" },
  { code: "GBP", symbol: "£", name: "United Kingdom Pound", flag: "🇬🇧" },
  { code: "EUR", symbol: "€", name: "Eurozone Euro", flag: "🇪🇺" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan / Renminbi", flag: "🇨🇳" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", symbol: "$", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵" },
];

export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  GBP: 0.79,
  EUR: 0.92,
  INR: 83.5,
  CNY: 7.25,
  CAD: 1.37,
  AUD: 1.51,
  SGD: 1.35,
  JPY: 160.0
};

export function getCurrencySymbol(code: string): string {
  const match = SUPPORTED_CURRENCIES.find(c => c.code.toUpperCase() === code.toUpperCase());
  return match ? match.symbol : "$";
}

export function convertCurrency(amount: number, fromCode: string, toCode: string): number {
  const fromRate = EXCHANGE_RATES[fromCode.toUpperCase()] || 1.0;
  const toRate = EXCHANGE_RATES[toCode.toUpperCase()] || 1.0;
  return (amount / fromRate) * toRate;
}

export function formatCurrency(amount: number, code: string): string {
  const symbol = getCurrencySymbol(code);
  if (code === "JPY") {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
  return `${symbol}${amount.toFixed(2)}`;
}

export function formatNotificationMessage(msg: string, targetCurrency: string): string {
  if (!msg) return msg;
  const regex = /(S\$|\$|£|€|₹|¥)\s*(\d+(?:\.\d+)?)/g;
  return msg.replace(regex, (match, symbol, valueStr) => {
    const value = parseFloat(valueStr);
    if (isNaN(value)) return match;
    let fromCode = "USD";
    if (symbol === "£") fromCode = "GBP";
    else if (symbol === "€") fromCode = "EUR";
    else if (symbol === "₹") fromCode = "INR";
    else if (symbol === "¥") {
      fromCode = value % 1 === 0 && value > 150 ? "JPY" : "CNY";
    } else if (symbol === "S$") fromCode = "SGD";
    const converted = convertCurrency(value, fromCode, targetCurrency);
    return formatCurrency(converted, targetCurrency);
  });
}
