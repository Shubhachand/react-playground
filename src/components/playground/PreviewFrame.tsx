// src/components/playground/PreviewFrame.tsx
'use client';

import { usePlaygroundStore } from '@/store/use-playground-store';
import { useEffect, useState } from 'react';
import * as Babel from '@babel/standalone';

export default function PreviewFrame() {
  const [iframeContent, setIframeContent] = useState('');

  const { jsxCode, cssCode } = usePlaygroundStore();

  useEffect(() => {
    const generateIframeHtml = (jsx: string, css: string) => {
      if (!jsx.trim()) {
        return `<html><head><script src="https://cdn.tailwindcss.com"></script></head><body></body></html>`;
      }

      try {
        const transformedJsx = Babel.transform(jsx, {
          presets: [['react', { runtime: 'classic' }]],
        }).code;

        return `
          <html>
            <head>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>${css || ''}</style>
            </head>
            <body>
              <div id="root"></div>
              <script type="module">
                import React from 'https://esm.sh/react@18.2.0';
                import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';
                window.React = React;
                const handleError = (error, type) => {
                  const root = document.getElementById('root');
                  root.innerHTML = '<div style="color: red; padding: 1rem;"><h4>' + type + ' Error</h4><pre>' + error.message + '</pre></div>';
                  console.error(type + " Error:", error);
                };
                const transpiledCode = \`${transformedJsx.replace(/`/g, '\\`')}\`;
                try {
                  const blob = new Blob([transpiledCode], { type: 'text/javascript' });
                  const url = URL.createObjectURL(blob);
                  import(url)
                    .then(module => {
                      const AppComponent = module.default;
                      if (AppComponent) {
                        ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(AppComponent));
                      } else {
                        throw new Error("The generated code does not have a default export.");
                      }
                    })
                    .catch(e => handleError(e, 'Runtime'));
                } catch (e) {
                  handleError(e, 'Build');
                }
              </script>
            </body>
          </html>`;
      } catch (e: unknown) {
        console.error('--- BABEL BUILD FAILED ---', e);
        const message = e instanceof Error ? e.message : String(e);
        return `<html><body><div style="color: red; padding: 1rem;"><h4>Build Error</h4><pre>${message}</pre></div></body></html>`;
      }
    };

    const html = generateIframeHtml(jsxCode, cssCode);
    setIframeContent(html);
  }, [jsxCode, cssCode]);

  return (
    <div className="flex-grow p-4 bg-white h-full">
      <iframe
        key={iframeContent}
        title="Component Preview"
        className="w-full h-full border border-gray-300 rounded-md"
        srcDoc={iframeContent}
        sandbox="allow-scripts"
      />
    </div>
  );
}
