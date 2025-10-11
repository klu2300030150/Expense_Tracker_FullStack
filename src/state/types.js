// Data models for the app
export const TransactionType = {
  EXPENSE: 'expense',
  INCOME: 'income',
};

export const Frequency = {
  NONE: 'none',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

// A transaction record
// {
//   id: string,
//   date: string ISO,
//   amount: number,
//   type: 'expense'|'income',
//   category: string,
//   merchant: string,
//   notes?: string,
//   tags?: string[],
//   recurrence?: { frequency: Frequency, nextDate?: string }
// }

export const initialSettings = {
  currency: '₹',
  theme: 'system', // 'light' | 'dark' | 'system'
  panicHide: false,
};

export const defaultCategories = [
  'Food',
  'Transport',
  'Bills',
  'Shopping',
  'Entertainment',
  'Health',
  'Education',
  'Travel',
  'Other',
];

export const initialState = {
  version: 1,
  transactions: [],
  categories: defaultCategories,
  budgets: {}, // { [category]: monthlyAmount }
  bills: [], // { id, name, amount, dueDay, category, notes }
  settings: initialSettings,
  snapshots: [], // { id, name, createdAt, dataSummary }
};
