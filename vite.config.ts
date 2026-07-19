import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';

const r = (p: string): string => fileURLToPath(new URL(p, import.meta.url));

const BUILD_ID = Date.now().toString();

function emitBootLoader(): Plugin {
  return {
    name: 'emit-boot-loader',
    apply: 'build',
    closeBundle() {
      const distDir = pathResolve('dist');
      const htmlPath = pathResolve(distDir, 'index.html');
      const html = readFileSync(htmlPath, 'utf-8');

      // Extract JS and CSS filenames from built HTML
      const jsMatch = html.match(/src="\/assets\/(index-[^"]+\.js)"/);
      const cssMatch = html.match(/href="\/assets\/(index-[^"]+\.css)"/);

      const boot = {
        id: BUILD_ID,
        js: jsMatch ? jsMatch[1] : '',
        css: cssMatch ? cssMatch[1] : '',
      };

      // Write boot.json to assets
      writeFileSync(pathResolve(distDir, 'assets', 'boot.json'), JSON.stringify(boot));

      // Write version.txt
      writeFileSync(pathResolve(distDir, 'version.txt'), BUILD_ID);

      // Overwrite index.html with a dynamic loader
      const loaderHtml = `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/qhub-icon.png?v=3" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#2563EB" />
    <title>Qhub — لوحة تحكم واتساب CRM</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <script>
      (function () {
        try {
          var theme = localStorage.getItem('sekaa_theme');
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch (e) {}
      })();
    </script>
    <script>
      (function(){
        var u='/assets/boot.json?_='+Date.now();
        fetch(u,{cache:'no-store'}).then(function(r){return r.json()}).then(function(b){
          var css=document.createElement('link');
          css.rel='stylesheet';css.href='/assets/'+b.css;
          document.head.appendChild(css);
          var js=document.createElement('script');
          js.type='module';js.crossOrigin='';js.src='/assets/'+b.js;
          document.head.appendChild(js);
        }).catch(function(){
          window.location.reload();
        });
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;
      writeFileSync(htmlPath, loaderHtml);
    },
  };
}

export default defineConfig({
  base: '/',
  define: {
    __BUILD_ID__: JSON.stringify(BUILD_ID),
  },
  plugins: [react(), emitBootLoader()],
  resolve: {
    alias: {
      '@': r('./src'),
      '@components': r('./src/components'),
      '@hooks': r('./src/hooks'),
      '@pages': r('./src/pages'),
      '@store': r('./src/store'),
      '@types': r('./src/types'),
      '@utils': r('./src/utils'),
      '@assets': r('./src/assets'),
      '@services': r('./src/services'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
