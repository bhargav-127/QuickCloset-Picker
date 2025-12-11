# QuickCloset Picker - Local Backend

This folder contains a simple Express + SQLite backend that implements the `/tables/*` REST endpoints used by the frontend.

Setup (PowerShell):

```powershell
cd "d:\QuickCloset Picker\server"
npm install
npm run init-db
npm start
```

This will create `server/data.db` and start the API on port 3000.

Then serve the frontend (in another terminal):

```powershell
npx http-server -c-1 -p 8080 "d:\QuickCloset Picker"
```

Open `http://localhost:8080` and use the app; API is available at `http://localhost:3000/tables/wardrobe_items` and `http://localhost:3000/tables/saved_outfits`.
