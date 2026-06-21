# Workflow — Add a Shopify webhook

1. Subscribe in `shopify.app.toml` (correct topic + API version).
2. Route `app/routes/webhooks.<topic>.tsx`:
   - `authenticate.webhook(request)` (HMAC) first — reject if it fails.
   - Zod-parse the payload (untrusted input).
   - Call a domain service; keep the handler thin; return 200 fast.
   - Make it idempotent (Shopify may redeliver).
3. Long work → enqueue to `app/domains/jobs/`, don't block the response.
4. Test: integration test posting a signed + an unsigned payload.
5. Record the topic in the owning domain's `AGENTS.md`.
