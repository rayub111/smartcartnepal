# Deploying the protected editor

The public storefront remains static. Only `/manage.html` is protected by a Cloudflare Pages Function.

## Cloudflare setup

1. Create a Cloudflare Pages project using **Git integration** or Wrangler. Dashboard drag-and-drop does not deploy Pages Functions.
2. Set the project root directory to `smartcartnepal`.
3. In **Settings → Variables and Secrets**, add these production secrets:
   - `EDITOR_PASSWORD`: choose a long, unique password.
   - `EDITOR_USERNAME`: optional; defaults to `admin`.
4. Deploy the project.

Visiting `/manage.html` will now prompt for the configured username and password. `/admin.html` redirects to that protected route.

## Important

The editor stores draft changes in the authenticated visitor's browser. Use **Export updated products.js**, replace `products.js` in the project, and redeploy to publish changes for everyone.
