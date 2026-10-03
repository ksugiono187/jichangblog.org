// Build a local preview without changing the production domain configuration.
process.env.SITE_URL='';
process.env.SITE_BASE_PATH='';
process.env.SITE_OUTPUT_DIR='.preview';
await import('./build.mjs');
await import('./serve.mjs');
