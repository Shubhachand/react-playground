// src/components/playground/PreviewFrame.tsx

'use client';

import { useEffect, useRef } from 'react';

interface PreviewFrameProps {
  initialJsx: string | null;
  initialCss: string | null;
}

export default function PreviewFrame({ initialJsx, initialCss }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current || !initialJsx) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const html = `
      <html>
        <head>
          <style>${initialCss || ''}</style>
        </head>
        <body>
          <div id="root"></div>
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script type="text/babel">
            ${initialJsx}
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(html);
    doc.close();
  }, [initialJsx, initialCss]);

  return <iframe ref={iframeRef} className="w-full h-full border rounded-lg" />;
}
