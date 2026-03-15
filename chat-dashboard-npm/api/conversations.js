export default async function handler(req, res) {
  const { CHATWOOT_URL, CHATWOOT_ACCOUNT_ID, CHATWOOT_ACCESS_TOKEN } = process.env;

  try {
    const response = await fetch(
      `${CHATWOOT_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/conversations`,
      { headers: { api_access_token: CHATWOOT_ACCESS_TOKEN } }
    );
    const data = await response.json();
    const payload = data?.data?.payload ?? data ?? [];
    res.json(Array.isArray(payload) ? payload : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
