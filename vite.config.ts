import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: parseInt(process.env.PORT || '5173'),
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          // Vendor chunks
          if (id.includes('node_modules/react')) return 'vendor-react';
          if (id.includes('node_modules/framer-motion')) return 'vendor-framer';
          if (id.includes('node_modules/@radix-ui')) return 'vendor-radix';

          // Section chunks - lazy loaded
          if (id.includes('ResearchSectionV2')) return 'section-research';
          if (id.includes('AdoptionSectionV2')) return 'section-adoption';

          // Component chunks
          if (id.includes('components/Common')) return 'components-common';
          if (id.includes('components/Visualizations')) return 'components-viz';
          if (id.includes('components/Sections')) return 'components-sections';
        },
      },
    },
    // Compression and size limits
    minify: 'terser',
    sourcemap: mode === 'development',
    chunkSizeWarningLimit: 1000,

    // Terser options for better minification
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
      },
    },
  },
}));
