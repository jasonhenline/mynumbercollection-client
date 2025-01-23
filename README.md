## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

You can ignore console errors about version.json not being served when you run locally. Those are expected for a local run.

## Bundle for deploy

```bash
npm run build:web
```

This will create the deployable assets in the `dist` directory.