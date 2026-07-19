import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
var r = function (p) { return fileURLToPath(new URL(p, import.meta.url)); };
var BUILD_ID = Date.now().toString();
function emitBootLoader() {
    return {
        name: 'emit-boot-loader',
        apply: 'build',
        closeBundle: function () {
            var distDir = pathResolve('dist');
            var htmlPath = pathResolve(distDir, 'index.html');
            var html = readFileSync(htmlPath, 'utf-8');
            // Extract JS and CSS filenames from built HTML
            var jsMatch = html.match(/src="\/assets\/(index-[^"]+\.js)"/);
            var cssMatch = html.match(/href="\/assets\/(index-[^"]+\.css)"/);
            var boot = {
                id: BUILD_ID,
                js: jsMatch ? jsMatch[1] : '',
                css: cssMatch ? cssMatch[1] : '',
            };
            // Write boot.json to assets
            writeFileSync(pathResolve(distDir, 'assets', 'boot.json'), JSON.stringify(boot));
            // Write version.txt
            writeFileSync(pathResolve(distDir, 'version.txt'), BUILD_ID);
            // Overwrite index.html with a dynamic loader
            var loaderHtml = "<!doctype html>\n<html lang=\"ar\" dir=\"rtl\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" type=\"image/png\" href=\"/qhub-icon.png?v=3\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <meta name=\"theme-color\" content=\"#2563EB\" />\n    <title>Qhub \u2014 \u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645 \u0648\u0627\u062A\u0633\u0627\u0628 CRM</title>\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n    <link href=\"https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap\" rel=\"stylesheet\" />\n    <script>\n      (function () {\n        try {\n          var theme = localStorage.getItem('sekaa_theme');\n          if (theme === 'dark') {\n            document.documentElement.classList.add('dark');\n          } else {\n            document.documentElement.classList.remove('dark');\n          }\n        } catch (e) {}\n      })();\n    </script>\n    <script>\n      (function(){\n        var u='/assets/boot.json?_='+Date.now();\n        fetch(u,{cache:'no-store'}).then(function(r){return r.json()}).then(function(b){\n          var css=document.createElement('link');\n          css.rel='stylesheet';css.href='/assets/'+b.css;\n          document.head.appendChild(css);\n          var js=document.createElement('script');\n          js.type='module';js.crossOrigin='';js.src='/assets/'+b.js;\n          document.head.appendChild(js);\n        }).catch(function(){\n          window.location.reload();\n        });\n      })();\n    </script>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n  </body>\n</html>\n";
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
