import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, User, Bot, LogIn, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authAPI } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Extended suggestions for each user role
const PATIENT_SUGGESTIONS = [
  "Find labs near me",
  "What tests do I need for a routine checkup?",
  "How do I prepare for a blood test?",
  "Book a test appointment",
  "Compare prices for CBC test",
  "What is a lipid profile test?",
  "Home collection available labs",
  "Track my test results",
];

const LAB_OWNER_SUGGESTIONS = [
  "How can I add a new test to my lab?",
  "Tips to grow my lab business",
  "How do I manage bookings?",
  "View my lab analytics",
  "Set up home collection service",
  "Handle customer complaints",
  "Best pricing strategies",
  "Improve lab visibility online",
];

const DOCTOR_SUGGESTIONS = [
  "Recommend diagnostic tests for fever",
  "How to refer a patient for lab tests?",
  "Interpreting CBC results",
  "Find specialized labs",
  "Common tests for diabetes monitoring",
  "Thyroid function test interpretation",
];

const ADMIN_SUGGESTIONS = [
  "View platform analytics",
  "How to approve new lab registrations?",
  "Manage user complaints",
  "Generate revenue reports",
  "Platform security best practices",
  "User activity monitoring",
  "Handle payment disputes",
  "System health check",
];

const ChatBot: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userRole = authAPI.getCurrentUserRole();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const authed = await authAPI.isAuthenticated();
      setIsAuthenticated(authed);
    };
    checkAuth();
  }, [isOpen]);
  
  const getSuggestions = () => {
    switch (userRole) {
      case 'lab_owner':
        return LAB_OWNER_SUGGESTIONS;
      case 'doctor':
        return DOCTOR_SUGGESTIONS;
      case 'admin':
      case 'ADMIN':
        return ADMIN_SUGGESTIONS;
      default:
        return PATIENT_SUGGESTIONS;
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'lab_owner':
        return 'Lab Owner';
      case 'doctor':
        return 'Doctor';
      case 'admin':
      case 'ADMIN':
        return 'Admin';
      default:
        return 'Patient';
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current && isAuthenticated) {
      inputRef.current.focus();
    }
  }, [isOpen, isAuthenticated]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          history,
          userRole,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleLoginClick = () => {
    setIsOpen(false);
    navigate('/login');
  };

  // Render login prompt for unauthenticated users
  const renderLoginPrompt = () => (
    <div className="h-full flex flex-col items-center justify-center text-center p-6">
      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center mb-6">
        <LogIn className="h-10 w-10 text-primary" />
      </div>
      <h4 className="font-bold text-xl text-gray-800 dark:text-gray-200 mb-3">
        Login Required
      </h4>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        Please login to access Ekitsa Assistant and get personalized help with labs, tests, and more.
      </p>
      <Button
        onClick={handleLoginClick}
        className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-105"
      >
        <LogIn className="h-4 w-4 mr-2" />
        Login to Continue
      </Button>
      <p className="text-xs text-muted-foreground mt-4">
        Don't have an account?{' '}
        <button
          onClick={() => { setIsOpen(false); navigate('/signup'); }}
          className="text-primary hover:underline font-medium"
        >
          Sign up
        </button>
      </p>
    </div>
  );

  return (
    <>
      {/* Floating Button - More Visible */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-primary via-cyan-500 to-teal-400 text-white shadow-2xl shadow-primary/40 flex items-center justify-center transition-all hover:shadow-primary/60"
          >
            <MessageCircle className="h-7 w-7" />
            {/* Pulsing ring for visibility */}
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-6rem)] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary via-cyan-500 to-teal-400 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Ekitsa Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-xs text-white/90">
                      {isAuthenticated ? `${getRoleLabel()} Mode` : 'AI-powered help'}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
              {!isAuthenticated ? (
                renderLoginPrompt()
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center mb-4">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Hi there! 👋
                  </h4>
                  <p className="text-sm text-muted-foreground mb-6">
                    I'm your Ekitsa Assistant. How can I help you today?
                  </p>
                  <div className="w-full space-y-2 max-h-[280px] overflow-y-auto">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
                      <Shield className="h-3 w-3" />
                      {getRoleLabel()} Suggestions
                    </p>
                    {getSuggestions().map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left text-sm px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-primary hover:bg-primary/5 transition-all text-gray-700 dark:text-gray-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-end gap-2 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-primary text-white rounded-br-md'
                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex items-end gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-2xl rounded-bl-md">
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area - only show if authenticated */}
            {isAuthenticated && (
              <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary/50 outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500"
                  />
                  <Button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 p-0"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
