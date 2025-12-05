# Config Files

These JSON configuration files contain placeholders that are replaced with environment variable values during the build process.

## Placeholders

- `${VUE_APP_API_ENDPOINT}` - Replaced with the API endpoint URL (e.g., `https://krw-nutrend.avi.deltares.nl`)
- `${VUE_APP_END_YEAR}` - Replaced with the end year (e.g., `2025`)

## How it works

When you run `npm run dev` or `npm run build`, the `scripts/process-config.js` script:
1. Reads these JSON files
2. Replaces all placeholders with values from your `.env` file
3. Writes the processed files back (in-place)

## Editing

**Edit these files directly** - they contain placeholders like `${VUE_APP_API_ENDPOINT}` which are human-readable and make it clear what values will be used.

Example:
```json
{
  "url": "${VUE_APP_API_ENDPOINT}/reports/document.pdf"
}
```

After processing with `VUE_APP_API_ENDPOINT=https://example.com`, it becomes:
```json
{
  "url": "https://example.com/reports/document.pdf"
}
```

## Environment Variables

Make sure your `.env` file contains:
```env
VUE_APP_API_ENDPOINT=https://krw-nutrend.avi.deltares.nl
VUE_APP_END_YEAR=2025
```

