// app/theme-script.tsx
export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var path = window.location.pathname || '';
            if (/^\/(fr|en)?\/?(admin|auth)(\/|$)/.test(path)) {
              return;
            }

            function getInitialTheme() {
              const savedTheme = localStorage.getItem('theme');
              if (savedTheme) {
                return savedTheme;
              }
              return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }

            const theme = getInitialTheme();
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            }
          })();
        `,
      }}
    />
  );
}