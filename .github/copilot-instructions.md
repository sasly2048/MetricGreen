# MetricGreen Project Guidelines

## Code Style

- **Framework:** Next.js (App Router, React 19).
- **Styling:** Tailwind CSS v4, `clsx`, and `tailwind-merge`.
- **Client Components:** Use the `"use client"` directive at the top of files in `src/app/` that use React hooks or browser features.
- **UI/UX:** Use `framer-motion` for animations and page transitions. Use `lucide-react` for iconography. Follow the dark-theme glassmorphism aesthetic established in `src/app/page.js`.

## Architecture

- **Web3 Integration:** The app connects to the Ethereum blockchain using `ethers.js` v6.
- **Smart Contracts:** Located in the `contracts/` directory (e.g., `MetricGreen.sol`).
- **Contract Connection:** Interactions should use the ABI and the contract address provided by `process.env.NEXT_PUBLIC_METRIC_GREEN_CONTRACT_ADDRESS` or equivalent environment variables.

## Build and Test

- **Dev Server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`

## Conventions

- **Error Handling:** When handling Ethers v6 errors, intercept specific codes like `ACTION_REJECTED` or `4001` to provide clean, user-friendly messages (e.g., "User rejected the transaction."), as demonstrated in `src/app/page.js`.
- **Environment Variables:** Always use the `NEXT_PUBLIC_` prefix for variables that need to be exposed to the browser.
