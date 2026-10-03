import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'llm-api-plugin',
      configureServer(server) {
        server.middlewares.use('/api/llm-explain', async (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', async () => {
              try {
                const { query, language } = JSON.parse(body || '{}');
                const { explainServiceWithLLM } = await import('./server/llmService');
                const result = await explainServiceWithLLM(query, language);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result));
              } catch (err: any) {
                const isNoKey = err?.message?.includes('NO_API_KEY');
                res.statusCode = isNoKey ? 503 : 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    error: err?.message || 'LLM service failure',
                    fallback: true,
                  })
                );
              }
            });
          } else {
            res.statusCode = 405;
            res.end();
          }
        });
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
  },
});
