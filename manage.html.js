// Cloudflare Pages Function: protects only /manage.html with HTTP Basic Auth.
// Set EDITOR_PASSWORD as a Cloudflare Pages secret before deploying.
// EDITOR_USERNAME is optional and defaults to "admin".

function unauthorized() {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="SmartCart editor", charset="UTF-8"',
      'Cache-Control': 'no-store'
    }
  });
}

export async function onRequest(context) {
  const expectedPassword = context.env.EDITOR_PASSWORD;
  const expectedUsername = context.env.EDITOR_USERNAME || 'admin';

  if (!expectedPassword) {
    return new Response('Editor protection has not been configured.', { status: 500 });
  }

  const authorization = context.request.headers.get('Authorization') || '';
  if (!authorization.startsWith('Basic ')) return unauthorized();

  try {
    const credentials = atob(authorization.slice(6));
    const separator = credentials.indexOf(':');
    if (separator === -1) return unauthorized();
    const username = credentials.slice(0, separator);
    const password = credentials.slice(separator + 1);
    if (username !== expectedUsername || password !== expectedPassword) return unauthorized();
  } catch (error) {
    return unauthorized();
  }

  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'no-store');
  return new Response(response.body, { status: response.status, headers });
}
