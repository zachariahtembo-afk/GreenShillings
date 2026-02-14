'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  'How does 80% reach communities?',
  'What carbon standards do you follow?',
  'How can I support your work?',
  'What makes you different?',
];

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [chatStatus, setChatStatus] = useState<'checking' | 'enabled' | 'disabled'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isChatEnabled = chatStatus === 'enabled';

  // Check if chat is enabled
  useEffect(() => {
    fetch('/api/chat/status')
      .then((res) => res.json())
      .then((data) => setChatStatus(data.data?.enabled ? 'enabled' : 'disabled'))
      .catch(() => setChatStatus('disabled'));
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    if (!isChatEnabled) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Chat is offline right now. Please email hello@greenshillings.org and we'll respond soon.",
        },
      ]);
      return;
    }

    const userMessage: ChatMessage = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        '/api/chat',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: messageText,
            history: messages,
          }),
        },
      );

      const data = await response.json();

      if (data.data?.limitReached) {
        setLimitReached(true);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.data.message },
        ]);
      } else if (data.data?.message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.data.message }]);
        // Check if this was the last allowed message
        if (data.data.remainingMessages === 0) {
          setLimitReached(true);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: "I'm sorry, I couldn't process that request. Please try again.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm having trouble connecting right now. Please try again or contact us at hello@greenshillings.org",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Chat Launcher */}
      <div className={`fixed bottom-6 left-6 z-50 ${isOpen ? 'hidden' : ''}`}>
        <motion.button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 rounded-full border-2 border-forest/10 bg-white pl-2 pr-4 py-2 shadow-[0_16px_36px_rgba(10,28,20,0.12)] hover:shadow-[0_20px_44px_rgba(10,28,20,0.16)] transition-shadow"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          aria-label="Open chat assistant"
        >
          <span className="w-11 h-11 rounded-full bg-canopy text-white flex items-center justify-center">
            <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
          </span>
          <span className="hidden sm:flex flex-col items-start text-left">
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-forest/60">
              <span
                className={`h-2 w-2 rounded-full ${isChatEnabled ? 'bg-canopy' : 'bg-gray-300'}`}
              />
              {isChatEnabled ? 'Online' : 'Offline'}
            </span>
            <span className="text-sm font-semibold text-forest">Ask GreenShillings</span>
          </span>
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-6 z-50 w-[400px] max-w-[calc(100vw-48px)] bg-white rounded-[32px] shadow-[0_32px_80px_rgba(10,28,20,0.18)] border-2 border-forest/10 overflow-hidden flex flex-col"
            style={{ height: 'min(620px, calc(100vh - 120px))' }}
          >
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-forest/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-canopy text-white flex items-center justify-center">
                  <Bot className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink">GreenShillings Assistant</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isChatEnabled ? 'bg-canopy' : 'bg-gray-300'
                      }`}
                    />
                    <span>
                      {isChatEnabled ? 'Live guidance on advocacy and pilots' : 'Offline right now'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full border border-forest/10 text-forest hover:bg-chalk flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-chalk">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border-2 border-forest/10 bg-white p-4">
                    <div className="flex items-center gap-2 text-forest mb-2">
                      <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                      <p className="text-[11px] uppercase tracking-[0.2em] text-forest/70">
                        Getting started
                      </p>
                    </div>
                    {isChatEnabled ? (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Hi! I can help you with advocacy, pilot phase progress, and how to partner
                        with GreenShillings.
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        The assistant is offline right now. You can still reach us at
                        <span className="font-semibold text-forest"> hello@greenshillings.org</span>.
                      </p>
                    )}
                  </div>
                  {isChatEnabled ? (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-[0.2em]">
                        Popular questions
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {SUGGESTED_QUESTIONS.map((question) => (
                          <button
                            key={question}
                            onClick={() => sendMessage(question)}
                            className="rounded-full border-2 border-forest/10 bg-white px-4 py-2 text-xs font-semibold text-forest/80 hover:text-forest hover:border-forest/30 transition-colors"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <a href="mailto:hello@greenshillings.org" className="btn-secondary w-full">
                      Email the team
                    </a>
                  )}
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-9 h-9 rounded-2xl bg-white border border-forest/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-forest" strokeWidth={1.5} />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          message.role === 'user'
                            ? 'bg-canopy text-white rounded-tr-md'
                            : 'bg-white border-2 border-forest/10 text-gray-700 rounded-tl-md'
                        }`}
                      >
                        {message.content}
                      </div>
                      {message.role === 'user' && (
                        <div className="w-9 h-9 rounded-2xl bg-canopy flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" strokeWidth={1.5} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className="w-9 h-9 rounded-2xl bg-white border border-forest/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-forest" strokeWidth={1.5} />
                      </div>
                      <div className="px-4 py-3 bg-white border-2 border-forest/10 rounded-2xl rounded-tl-md">
                        <Loader2 className="w-4 h-4 text-forest animate-spin" />
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input or Contact CTA */}
            {limitReached ? (
              <div className="px-5 py-4 border-t border-forest/10 bg-white space-y-3">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-canopy text-white px-4 py-3 text-sm font-semibold hover:brightness-95 transition-colors"
                >
                  Contact our team
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </Link>
                <p className="text-[11px] text-gray-400 text-center">
                  Or email us at hello@greenshillings.org
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-5 py-4 border-t border-forest/10 bg-white">
                <div className="flex items-center gap-2 rounded-full border-2 border-forest/10 bg-chalk px-3 py-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      isChatEnabled ? 'Ask about advocacy, pilots, or partners' : 'Chat is offline'
                    }
                    className="flex-1 bg-transparent px-2 text-sm focus:outline-none"
                    disabled={!isChatEnabled || isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading || !isChatEnabled}
                    className="w-10 h-10 rounded-full bg-canopy text-white flex items-center justify-center hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-2 text-center">
                  Responses are informational and may include pilot-phase context.
                </p>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
