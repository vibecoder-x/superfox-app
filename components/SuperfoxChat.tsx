'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaPaperPlane, FaTimes, FaRobot, FaCalculator, FaBook } from 'react-icons/fa';

type Message = { role: 'user' | 'assistant'; content: string };

const greeting: Message = {
  role: 'assistant',
  content: 'Hello, learning explorer! 🦊 Let’s practice a short math, reading, or science question. Keep personal details private.',
};

export default function SuperfoxChat({ enabled = false }: { enabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pendingRequest = useRef<AbortController | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && enabled) messagesEndRef.current?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'nearest' });
  }, [messages, isOpen, enabled, reduceMotion]);

  useEffect(() => () => pendingRequest.current?.abort(), []);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const content = inputMessage.trim();
    if (!enabled || !content || content.length > 500 || pendingRequest.current) return;
    const userMessage: Message = { role: 'user', content };
    // The greeting is local; keep only five completed exchanges and this question.
    const conversationHistory = [...messages.slice(1).slice(-10), userMessage];
    setMessages((previous) => [...previous, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    const controller = new AbortController();
    pendingRequest.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
        signal: controller.signal,
        cache: 'no-store',
      });
      if (!response.ok) throw new Error('Chat unavailable');
      const data: unknown = await response.json();
      if (!data || typeof data !== 'object' || !('content' in data) || typeof data.content !== 'string' || !data.content.trim() || data.content.length > 1_000) {
        throw new Error('Chat unavailable');
      }
      const reply = data.content;
      setMessages((previous) => [...previous, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((previous) => [...previous, {
        role: 'assistant',
        content: 'Superfox needs a little break! 🦊 Try Math Adventures or enjoy a story with a trusted adult.',
      }]);
    } finally {
      window.clearTimeout(timeout);
      pendingRequest.current = null;
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open Superfox learning buddy"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="superfox-chat-dialog"
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 cursor-pointer rounded-full focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
      >
        <span className="block relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-superfox-orange to-superfox-yellow rounded-full shadow-2xl overflow-hidden border-4 border-white">
          <Image src="/images/icon.png" alt="" fill className="object-cover" sizes="80px" />
        </span>
        <span className="absolute -top-2 -right-2 bg-orange-700 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white" aria-hidden="true"><FaRobot /></span>
      </motion.button>

      {isOpen && (
        <dialog
          ref={dialogRef}
          id="superfox-chat-dialog"
          aria-labelledby="superfox-chat-title"
          onCancel={(event) => { event.preventDefault(); setIsOpen(false); }}
          className="fixed top-auto left-auto bottom-24 right-4 sm:bottom-32 sm:right-8 m-0 z-50 w-[calc(100vw-2rem)] max-w-sm h-[min(600px,calc(100dvh-8rem))] max-h-[calc(100dvh-8rem)] bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-superfox-orange p-0 backdrop:bg-black/30"
        >
          <div className="h-full flex flex-col">
            <div className="bg-gradient-to-r from-superfox-orange to-superfox-yellow p-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shrink-0">
                  <Image src="/images/icon.png" alt="" fill className="object-cover" sizes="48px" />
                </div>
                <div>
                  <h2 id="superfox-chat-title" className="text-orange-950 font-bold text-lg baloo">Superfox</h2>
                  <p className="text-orange-950 text-xs">Your Learning Buddy 🦊</p>
                </div>
              </div>
              <button type="button" autoFocus onClick={() => setIsOpen(false)} aria-label="Close Superfox learning buddy" className="text-orange-950 hover:bg-white/30 min-w-11 min-h-11 p-3 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800">
                <FaTimes className="text-xl" aria-hidden="true" />
              </button>
            </div>

            {enabled ? (
              <>
                <p className="text-xs text-amber-950 bg-amber-100 px-4 py-3">Developer preview for adults. Replies are not verified for child safety. Questions go to DeepSeek; keep personal details private.</p>
                <div role="log" aria-label="Learning conversation" aria-live="polite" aria-relevant="additions" className="flex-1 min-h-0 overflow-y-auto p-4 bg-gradient-to-b from-blue-50 to-purple-50">
                  {messages.map((message, index) => (
                    <div key={index} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-4 break-words ${message.role === 'user' ? 'bg-orange-700 text-white' : 'bg-white text-gray-800 shadow-md'}`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && <p className="text-sm text-gray-700" role="status">Superfox is thinking…</p>}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-200">
                  <label htmlFor="superfox-question" className="sr-only">Short learning question</label>
                  <div className="flex gap-2">
                    <input id="superfox-question" type="text" value={inputMessage} onChange={(event) => setInputMessage(event.target.value)} maxLength={500} placeholder="A short learning question…" className="min-w-0 flex-1 px-3 py-3 rounded-full border-2 border-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 text-sm" disabled={isLoading} autoComplete="off" />
                    <button type="submit" disabled={isLoading || !inputMessage.trim()} aria-label="Send learning question" className="bg-orange-700 text-white p-3 min-w-11 min-h-11 rounded-full disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"><FaPaperPlane aria-hidden="true" /></button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto p-5 bg-gradient-to-b from-blue-50 to-purple-50">
                <p className="text-4xl mb-3" aria-hidden="true">🦊 🌟</p>
                <h3 className="text-xl font-bold text-orange-900 baloo mb-3">Let’s go on a learning adventure!</h3>
                <p className="text-gray-700 mb-5">Superfox chat is getting ready. Our games and stories are here to explore with a trusted adult.</p>
                <div className="space-y-3">
                  <Link href="/math-adventures" onClick={() => setIsOpen(false)} className="flex items-center gap-3 bg-blue-700 text-white rounded-2xl p-4 font-bold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange-700"><FaCalculator aria-hidden="true" /> Math Adventures</Link>
                  <Link href="/#stories" onClick={() => setIsOpen(false)} className="flex items-center gap-3 bg-purple-700 text-white rounded-2xl p-4 font-bold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange-700"><FaBook aria-hidden="true" /> Explore Stories</Link>
                </div>
                <div className="bg-white rounded-2xl p-4 mt-5 shadow-sm text-gray-800">
                  <h4 className="font-bold mb-2">Try this together</h4>
                  <p>Find three blue things nearby. Count them, then tell a trusted adult a story about one of them!</p>
                </div>
              </div>
            )}
          </div>
        </dialog>
      )}
    </>
  );
}
