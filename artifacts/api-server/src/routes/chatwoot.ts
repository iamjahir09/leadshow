import { Router, type IRouter } from "express";
import axios from "axios";
import {
  GetConversationsResponse,
  GetMessagesParams,
  GetMessagesResponse,
  SendMessageBody,
  SendMessageResponse,
  ToggleStatusBody,
  ToggleStatusResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function getChatwootClient() {
  const url = process.env.CHATWOOT_URL;
  const accountId = process.env.CHATWOOT_ACCOUNT_ID;
  const token = process.env.CHATWOOT_ACCESS_TOKEN;

  if (!url || !accountId || !token) {
    throw new Error(
      "Missing Chatwoot credentials: CHATWOOT_URL, CHATWOOT_ACCOUNT_ID, CHATWOOT_ACCESS_TOKEN"
    );
  }

  const baseURL = `${url}/api/v1/accounts/${accountId}`;
  return axios.create({
    baseURL,
    headers: {
      api_access_token: token,
      "Content-Type": "application/json",
    },
  });
}

router.get("/conversations", async (_req, res): Promise<void> => {
  try {
    const client = getChatwootClient();
    const response = await client.get("/conversations");
    const data = response.data?.data?.payload ?? response.data ?? [];
    const conversations = Array.isArray(data) ? data : [];
    res.json(GetConversationsResponse.parse(conversations));
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      res.status(err.response?.status ?? 500).json({
        error: err.response?.data?.message ?? err.message,
      });
    } else if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
});

router.get("/messages/:conversationId", async (req, res): Promise<void> => {
  const params = GetMessagesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  try {
    const client = getChatwootClient();
    const response = await client.get(
      `/conversations/${params.data.conversationId}/messages`
    );
    const data = response.data?.payload ?? response.data ?? [];
    const messages = Array.isArray(data) ? data : [];
    res.json(GetMessagesResponse.parse(messages));
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      res.status(err.response?.status ?? 500).json({
        error: err.response?.data?.message ?? err.message,
      });
    } else if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
});

router.post("/sendMessage", async (req, res): Promise<void> => {
  const parsed = SendMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const client = getChatwootClient();
    const response = await client.post(
      `/conversations/${parsed.data.conversationId}/messages`,
      {
        content: parsed.data.content,
        message_type: "outgoing",
        private: false,
      }
    );
    res.json(SendMessageResponse.parse(response.data));
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      res.status(err.response?.status ?? 500).json({
        error: err.response?.data?.message ?? err.message,
      });
    } else if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
});

router.post("/toggleStatus", async (req, res): Promise<void> => {
  const parsed = ToggleStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const client = getChatwootClient();
    const response = await client.patch(
      `/conversations/${parsed.data.conversationId}/update`,
      {
        status: parsed.data.status,
      }
    );
    res.json(ToggleStatusResponse.parse(response.data));
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      res.status(err.response?.status ?? 500).json({
        error: err.response?.data?.message ?? err.message,
      });
    } else if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
});

export default router;
