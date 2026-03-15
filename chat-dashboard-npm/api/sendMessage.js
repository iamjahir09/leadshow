export default async function handler(req, res) {
  const { CHATWOOT_URL, CHATWOOT_ACCOUNT_ID, CHATWOOT_ACCESS_TOKEN } = process.env;
  const { conversationId, content } = req.body;

  if (!conversationId || !content) {
    return res.status(400).json({ error: "conversationId and content required" });
  }

  try {
    const response = await fetch(
      `${CHATWOOT_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          api_access_token: CHATWOOT_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, message_type: "outgoing", private: false }),
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
