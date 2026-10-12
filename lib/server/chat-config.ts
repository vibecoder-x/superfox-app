import 'server-only';

import { isDevelopmentPreviewEnabled, type ChatConfiguration } from './chat-handler';

/** Public production stays locked until safety and consent controls are verified. */
export function isChatPreviewEnabled(): boolean {
  return isDevelopmentPreviewEnabled(
    process.env.NODE_ENV,
    process.env.SUPERFOX_CHAT_PREVIEW_ENABLED,
  );
}

export function getChatConfiguration(): ChatConfiguration {
  return {
    environment: process.env.NODE_ENV ?? 'production',
    previewEnabled: isChatPreviewEnabled(),
    apiKey: process.env.DEEPSEEK_API_KEY,
  };
}
