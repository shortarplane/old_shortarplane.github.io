document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    document.getElementById('copyright').textContent = `© ${currentYear} Your Name. All rights reserved.`;

    if (document.getElementById('shortener-form')) {
        document.getElementById('shortener-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const url = document.getElementById('url').value;
            const expiration = document.getElementById('expiration').value;
            const language = document.getElementById('language').value;
            const id = Math.random().toString(36).substring(2, 8);  // Generate a random ID

            const response = await fetch('{{ site.google_apps_script_url }}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, url, expiration }),
            });

            if (response.ok) {
                const shortUrl = `${window.location.origin}/redirect.html?id=${id}&lang=${language}`;
                document.getElementById('short-url').textContent = `Shortened URL: ${shortUrl}`;
            } else {
                document.getElementById('short-url').textContent = `Error: Unable to shorten URL.`;
            }
        });
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const lang = params.get('lang') || '{{ site.lang }}';
    const translations = {{ site.translations | jsonify }};
    const messages = translations[lang] || translations['{{ site.lang }}'];

    if (document.getElementById('message')) {
        document.getElementById('message').textContent = messages.loading;

        if (id) {
            fetch(`{{ site.google_apps_script_url }}?path=${id}`)
                .then(response => response.text())
                .then(url => {
                    if (url.startsWith('http')) {
                        window.location.href = url;
                    } else {
                        document.getElementById('message').textContent = url;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('message').textContent = messages.error;
                });
        } else {
            document.getElementById('message').textContent = messages.invalidId;
        }
    }
});
