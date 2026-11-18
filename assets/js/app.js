const DATA_URL = "./data/articles.json";
let allArticles = [];
let selectedCategory = "Todas";

const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));

function renderArticles() {
    const grid = document.getElementById("news-grid");
    if (!grid) return;

    const query = (document.getElementById("search-input")?.value || "").toLowerCase().trim();

    const filtered = allArticles.filter(article => {
        const categoryMatch = selectedCategory === "Todas" || article.category === selectedCategory;
        const text = `${article.title} ${article.excerpt} ${article.category} ${article.author}`.toLowerCase();
        return categoryMatch && text.includes(query);
    });

    document.getElementById("article-count").textContent =
        `${filtered.length} ${filtered.length === 1 ? "ARTÍCULO" : "ARTÍCULOS"}`;

    document.getElementById("empty-state").hidden = filtered.length !== 0;

    grid.innerHTML = filtered.map(article => {
        const image = article.image
            ? `<img src="${escapeHTML(article.image)}" alt="${escapeHTML(article.title)}" loading="lazy">`
            : `<span>TECHNO<br>LATAM</span>`;

        return `
        <article class="news-card">
            <a href="./articulo.html?id=${encodeURIComponent(article.id)}" class="news-image">${image}</a>
            <div class="news-content">
                <span class="news-category">${escapeHTML(article.category)}</span>
                <h3><a href="./articulo.html?id=${encodeURIComponent(article.id)}">${escapeHTML(article.title)}</a></h3>
                <p>${escapeHTML(article.excerpt)}</p>
                <div class="news-meta"><span>${escapeHTML(article.date)}</span><span>${escapeHTML(article.author)}</span></div>
                <a class="read-more" href="./articulo.html?id=${encodeURIComponent(article.id)}">Leer artículo →</a>
            </div>
        </article>`;
    }).join("");
}

async function loadArticles() {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error("No se pudo cargar el archivo de publicaciones.");
        const data = await response.json();
        allArticles = Array.isArray(data.articles) ? data.articles : [];
        renderArticles();
    } catch (error) {
        const grid = document.getElementById("news-grid");
        if (grid) grid.innerHTML = `<div class="loading-state">No fue posible cargar las publicaciones. ${escapeHTML(error.message)}</div>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const date = document.getElementById("current-date");
    const year = document.getElementById("year");

    if (date) date.textContent = new Intl.DateTimeFormat("es-SV", {
        dateStyle: "long"
    }).format(new Date());

    if (year) year.textContent = new Date().getFullYear();

    const menu = document.getElementById("menu-toggle");
    const nav = document.getElementById("main-nav");

    menu?.addEventListener("click", () => {
        const opened = nav.classList.toggle("open");
        menu.setAttribute("aria-expanded", String(opened));
    });

    document.getElementById("search-input")?.addEventListener("input", renderArticles);

    document.getElementById("category-filters")?.addEventListener("click", event => {
        const button = event.target.closest("[data-category]");
        if (!button) return;
        selectedCategory = button.dataset.category;
        document.querySelectorAll(".filter").forEach(item =>
            item.classList.toggle("active", item === button)
        );
        renderArticles();
    });

    document.querySelectorAll("[data-pick-category]").forEach(link => {
        link.addEventListener("click", () => {
            selectedCategory = link.dataset.pickCategory;
            document.querySelectorAll(".filter").forEach(item =>
                item.classList.toggle("active", item.dataset.category === selectedCategory)
            );
            renderArticles();
        });
    });

    loadArticles();
});
