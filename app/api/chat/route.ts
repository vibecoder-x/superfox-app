import { getChatConfiguration } from '@/lib/server/chat-config';
import { createChatHandler, methodNotAllowed } from '@/lib/server/chat-handler';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handleChat = createChatHandler();

export function POST(request: Request) {
  return handleChat(request, getChatConfiguration());
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
export const HEAD = methodNotAllowed;
