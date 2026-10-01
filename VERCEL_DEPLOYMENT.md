/* FraudCheckr deployment: Vercel Functions + Neon */

## Architecture

Deploy this repository as two Vercel projects:

- **API project**: repository root (`.`), using the FastAPI app in `main.py`.
- **Frontend project**: root directory `Frontend`, using Vite and `Frontend/vercel.json`.
- **Database**: Neon PostgreSQL, using the pooled connection string for serverless requests.

The root `vercel.json` configures the Python function bundle. The frontend project uses its own config and does not need API route rewrites because it calls the API project directly.

## Build And Migration Steps

1. **Confirm Neon is ready**

   In Vercel Storage, open the connected Neon database and copy its pooled connection string. It should use SSL. Keep the value private and do not commit it.

2. **Import existing data before deploying the API**

   From the repository root, set `DATABASE_URL` in a local PowerShell session to the Neon pooled connection string, then run:

   ```powershell
   .\venv\Scripts\python.exe migrate_neon.py
   ```

   The importer creates the application tables, copies records from `developer_platform.db` when that file exists, and processes `efcc_convictions_updated.csv` into the Neon `conviction_records` table. It refuses to run if the target tables already contain data; do not use it as a routine deploy command.

   Optional source overrides:

   ```powershell
   .\venv\Scripts\python.exe migrate_neon.py --sqlite-path .\developer_platform.db --csv-path .\efcc_convictions_updated.csv
   ```

3. **Create the API Vercel project**

   Import the same Git repository as a new Vercel project and set **Root Directory** to `.`. Let Vercel detect the Python/FastAPI entrypoint. Do not set the frontend build command or a static output directory on this project. Add these environment variables for Production, Preview, and Development as needed:

   ```text
   DATABASE_URL=<Neon pooled connection string>
   ENVIRONMENT=production
   FRONTEND_ORIGINS=https://<frontend-project>.vercel.app
   ```

   Also add the existing application secrets such as `PAYSTACK_SECRET_KEY` and any plan configuration required by the developer billing routes. Add custom frontend domains to `FRONTEND_ORIGINS`, comma-separated.

4. **Create the frontend Vercel project**

   Import the repository again as another Vercel project and set **Root Directory** to `Frontend`. Use the Vite preset, build command `npm run build`, and output directory `dist`. Set:

   ```text
   VITE_API_URL=https://<api-project>.vercel.app
   ```

5. **Deploy and verify**

   Deploy the API project first, then the frontend. Check the API root, `/docs`, `/convictions?limit=3`, `/search?name=JOHN`, and `/stats`; then test sign-in, report persistence, and browser CORS from the frontend domain.

6. **Cut over from Railway**

   Keep the old Railway service available until the Vercel API and frontend checks pass. Then update any custom DNS or integrations to the Vercel API URL and retire Railway.

## Data Migration Caveat

This repository's application code used SQLite for developer accounts and did not use Railway PostgreSQL, despite the old deployment guide mentioning it. The importer can copy the local `developer_platform.db` file in this checkout. If Railway had a separate persistent volume or database containing newer account, subscription, or report data, export that data separately and reconcile it before cutover; this script cannot access Railway's filesystem. Conviction records are imported from the checked-in CSV.

## Local Checks

```powershell
npm --prefix Frontend run build
uvicorn main:app --reload --port 8000
```

Without `DATABASE_URL`, local development continues to use SQLite for developer data and the CSV for conviction data. With `DATABASE_URL`, the API reads both persisted developer state and conviction records from Neon.

## Troubleshooting

- **API has no conviction records**: run the migration command against the intended Neon database and confirm it reports imported records.
- **Database connection errors**: use Neon's pooled connection string, ensure SSL is enabled, and verify `DATABASE_URL` is set on the API Vercel project.
- **Browser CORS errors**: set `FRONTEND_ORIGINS` to the exact frontend origin, including `https://` and without a trailing slash.
- **Frontend does not reach the API**: confirm `VITE_API_URL` is the API project's origin and redeploy the frontend after changing it.
- **Vercel function build errors**: confirm the API project root is `.` and has not inherited the Frontend project's `dist` output configuration.

