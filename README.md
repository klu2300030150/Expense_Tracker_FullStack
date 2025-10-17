# LumenLedger — Unique Expense Tracker

A small React + Vite expense tracker with playful visuals, quick natural-language input, CSV import/export, and recurring transaction markers.

Features
- Private local-first storage (localStorage)
- Natural quick-add: e.g. `Rent -1200` in description
- Mark transactions as recurring
- Export and import CSV
- Donut snapshot and tidy UI with glassmorphism

Run (Windows PowerShell)
1. Install dependencies

```powershell
npm install
```

2. Run dev server

```powershell
npm run dev
```

Build

```powershell
npm run build
npm run preview
```

Notes
- This is a lightweight starter. For production you may want encryption, authentication, and cloud sync.
- CSV import is tolerant but simple — review imported rows.

Recurring transactions
- The app supports marking transactions as recurring.
- On load the app will attempt to generate monthly occurrences for recurring transactions up to the current month. You can also manually trigger this via the "Run recurring" button in the header. Recurrence logic is local and simple — it creates monthly copies of the recurring entry on the same day of month (falling back to end-of-month when needed).

 Categories, Budgets & Auto-categorization
 - You can add categories and set monthly budgets in the Categories & Budgets card.
 - A simple auto-categorization rule set is applied automatically (customize the `autoRules` array in `App.jsx` or we can add a UI to edit rules).

 Backups and optional encryption
 - Export full JSON backup (includes transactions, categories, budgets, rules).
 - Export encrypted backup (AES-GCM via Web Crypto) — choose a password to encrypt. Importing an encrypted backup requires the same password.

 Tests & TypeScript
 - I added a basic Jest + React Testing Library setup and a starter test in `src/__tests__/App.test.jsx`.
 - To run tests (requires npm and jest dev dependencies):

 ```powershell
 # install dev deps (run locally if npm is blocked by PowerShell policy)
 npm install --save-dev jest @testing-library/react @testing-library/jest-dom babel-jest @babel/preset-env @babel/preset-react
 npm test
 ```

 Notes about PowerShell/npm
 - If PowerShell blocks npm commands due to execution policy (PSSecurityException), either run the commands in Command Prompt (cmd.exe) or change policy for the current session:

 ```powershell
 # temporarily allow script execution for this session
 Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
 ```

 Security note
 - The encryption provided is for convenience. For critical data, use vetted backup storage and strong password management.
