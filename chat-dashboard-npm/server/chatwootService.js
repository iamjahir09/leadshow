import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const { CHATWOOT_URL, CHATWOOT_ACCOUNT_ID, CHATWOOT_ACCESS_TOKEN } = process.env;

function getClient() {
  if (!CHATWOOT_URL || !CHATWOOT_ACCOUNT_ID || !CHATWOOT_ACCESS_TOKEN) {
    throw new Error(
      "Missing Chatwoot credentials. Check your server/.env file."
    );
  }
  return axios.create({
    baseURL: `${CHATWOOT_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}`,
    headers: {
      api_access_token: CHATWOOT_ACCESS_TOKEN,
      "Content-Type": "application/json",
    },
  });
}

export async function getConversations() {
  const client = getClient();
  const res = await client.get("/conversations");
  const payload = res.data?.data?.payload ?? res.data ?? [];
  return Array.isArray(payload) ? payload : [];
}

export async function getMessages(conversationId) {
  const client = getClient();
  const res = await client.get(`/conversations/${conversationId}/messages`);
  const payload = res.data?.payload ?? res.data ?? [];
  return Array.isArray(payload) ? payload : [];
}

export async function sendMessage(conversationId, content) {
  const client = getClient();
  const res = await client.post(`/conversations/${conversationId}/messages`, {
    content,
    message_type: "outgoing",
    private: false,
  });
  return res.data;
}

export async function toggleConversationStatus(conversationId, status) {
  const client = getClient();
  const res = await client.patch(
    `/conversations/${conversationId}/update`,
    { status }
  );
  return res.data;
}
