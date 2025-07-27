// src/components/playground/ChatPanel.tsx
'use client';

import { usePlaygroundStore, ChatMessage } from '@/store/use-playground-store';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';

export default function ChatPanel() {
  const { chatHistory, addMessage, updateCode } = usePlaygroundStore();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatHistory]);

  const sendPromptToApi = async (promptText: string, imageBase64: string | null = null) => {
    if (isLoading) return;
    setIsLoading(true);
    
    const userMessage: ChatMessage = { role: 'user', content: promptText || "Analyze this image and create a component." };
    addMessage(userMessage);
    setPrompt('');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, image: imageBase64 }),
      });

      if (!res.ok) {
        let errorMessage = `Request failed with status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = await res.text();
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      const assistantMessage: ChatMessage = { role: 'assistant', content: 'Here is the component you requested.' };
      addMessage(assistantMessage);
      updateCode(data.jsx, data.css);

    } catch (error: any) {
      console.error('Chat submission error:', error);
      const assistantMessage: ChatMessage = { role: 'assistant', content: `Sorry, an error occurred: ${error.message}` };
      addMessage(assistantMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    sendPromptToApi(prompt);
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        sendPromptToApi(prompt, base64String);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-bold text-lg">Chat</h3>
      </div>
      
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-4 py-2 max-w-xs break-words ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleTextSubmit} className="p-4 border-t flex items-center space-x-2">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
        
        <button type="button" onClick={handleImageButtonClick} className="p-2 rounded-full hover:bg-gray-200 text-gray-500" disabled={isLoading} title="Upload Image">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 01-2.828 0L6 14m6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </button>

        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your component or upload an image"
          disabled={isLoading}
        />
        
        <Button type="submit" isLoading={isLoading} className="w-auto px-4 py-2 text-sm">
          Send
        </Button>
      </form>
    </div>
  );
}
