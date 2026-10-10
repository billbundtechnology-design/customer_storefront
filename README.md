# Rentos customer booking

Separate customer-facing Next.js storefront for discovering event rentals, venues, and planning packages. The catalogue and interactions are local demo data only. Axios uses an in-memory adapter; no application data is fetched over the network and no booking or payment is actually submitted.

## Run locally

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. Run `npm run build` to validate a production build.

Demo catalogue records are in `lib/catalog.ts`. Add-to-bag and enquiry state exists only in the current browser session.
# customer_storefront
