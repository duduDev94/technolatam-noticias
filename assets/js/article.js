const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("article-container");
    const id = new URLSearchParams(location.search).get("id");

    try {
        const response = await fetch("./data/articles.json");
        const data = await response.json();
        const article = (data.articles || []).find(item => item.id === id);

        if (!article) {
            container.innerHTML = "<h1>Artículo no encontrado</h1><p>La publicación solicitada no está disponible.</p><a href='./'>Volver al inicio</a>";
            return;
        }

        document.title = `${article.title} | TECHNOLATAM`;

        container.innerHTML = `
        <span class="article-category">${esc(article.category)}</span>
        <h1>${esc(article.title)}</h1>
        <p class="article-meta">${esc(article.date)} · ${esc(article.author)}</p>
        ${article.image ? `<img src="${esc(article.image)}" alt="${esc(article.title)}" style="width:100%;border-radius:10px;margin:25px 0">` : ""}
        <p class="article-body">${esc(article.content)}</p>
        <p><a href="./">← Volver a TECHNOLATAM</a></p>`;
    } catch {
        container.innerHTML = "<h1>Error al cargar el artículo</h1><a href='./'>Volver al inicio</a>";
    }
});
