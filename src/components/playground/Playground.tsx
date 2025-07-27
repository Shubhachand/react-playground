// src/components/playground/Playground.tsx
'use client';

import { usePlaygroundStore } from '@/store/use-playground-store';
import { Session } from '@prisma/client';
import { useEffect, useState } from 'react';
import ChatPanel from './ChatPanel';
import PreviewFrame from './PreviewFrame';
import CodeEditor from './CodeEditor';
import { useAutoSave } from '@/hooks/use-autosave';

export default function Playground({ session }: { session: Session }) {
  const setInitialState = usePlaygroundStore((state) => state.setInitialState);
  useAutoSave();

  // State to manage whether the main panel shows 'code' or 'preview'
  const [mainView, setMainView] = useState<'code' | 'preview'>('code');

  useEffect(() => {
    setInitialState(session);
  }, [session, setInitialState]);

  return (
    // Main container is now a vertical flexbox
    <div className="flex flex-col h-[calc(100vh-120px)] gap-4">
      
      {/* Top Section: Code Editor or Preview */}
      <div className="flex-grow h-3/5">
        {mainView === 'code' ? (
          <CodeEditor viewMode={mainView} setViewMode={setMainView} />
        ) : (
          <div className="h-full flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-2 bg-[#21222C] border-b border-gray-700 flex justify-start">
                <div className="flex items-center bg-gray-900 rounded-lg p-1">
                    <button onClick={() => setMainView('code')} className={`px-3 py-1 text-sm font-medium rounded-md text-gray-400 hover:bg-gray-700`}>Code</button>
                    <button onClick={() => setMainView('preview')} className={`px-3 py-1 text-sm font-medium rounded-md bg-blue-600 text-white shadow`}>Preview</button>
                </div>
            </div>
            <PreviewFrame
              initialJsx={session.jsxCode}
              initialCss={session.cssCode}
            />
          </div>
        )}
      </div>

      {/* Bottom Section: Chat Panel */}
      <div className="flex-shrink-0 h-2/5">
         <div className="h-full flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
            <ChatPanel />
        </div>
      </div>

    </div>
  );
}