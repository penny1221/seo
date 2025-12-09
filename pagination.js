// pagination.js (最終完整版 - 適用於 blog.html)

document.addEventListener('DOMContentLoaded', () => {
    
    // 檢查數據是否載入成功
    if (typeof allArticles === 'undefined') {
        console.error("articles-data.js 未載入或數據有誤，請檢查載入順序。");
        return;
    }

    const articlesPerPage = 3; 
    let currentPage = 1;
    let currentCategory = '全部'; 
    
    const container = document.getElementById('articles-list-container');
    const paginationControls = document.getElementById('pagination-controls');
    const categoryFilters = document.getElementById('category-filters');

    // 如果不在 blog.html 頁面，則無需執行後續邏輯
    if (!container || !paginationControls || !categoryFilters) return;

    // ------------------------------------
    // 核心數據和 HTML 生成函數
    // ------------------------------------
    function getFilteredArticles() {
        if (currentCategory === '全部') {
            return allArticles;
        }
        return allArticles.filter(article => article.category === currentCategory);
    }
    
    // 函數：生成文章卡片的 HTML (整合圖片和 Alt 文本)
    function createArticleCardHTML(article) {
        const imagePath = article.imageSrc || 'images/default-placeholder.jpg'; 
        const altText = article.altText || (article.title + ' 封面圖'); 
        
        return `
            <a href="${article.link}" class="article-card-link" style="text-decoration: none; color: inherit;">
                <div class="article-card" style="border: 1px solid var(--color-divider); border-radius: 8px; overflow: hidden; transition: transform 0.3s;">
                    
                    <div class="card-image" style="height: 200px; background-color: #EEE;">
                        <img 
                            src="${imagePath}" 
                            alt="${altText}"
                            style="width: 100%; height: 100%; object-fit: cover; display: block;"
                        >
                    </div>
                    
                    <div class="card-body" style="padding: 20px;">
                        <span class="tag-primary" style="display: inline-block; background-color: var(--color-primary); color: white; padding: 4px 10px; border-radius: 3px; font-size: 12px; margin-bottom: 10px;">${article.category}</span>
                        <h3 style="font-size: 20px; margin-bottom: 10px;">${article.title}</h3>
                        <p class="meta" style="font-size: 14px; color: #777; margin-bottom: 15px;">發布日期：${article.date} | 閱讀時間：${article.readTime}</p>
                        <span class="read-more" style="color: var(--color-accent); font-weight: bold;">繼續閱讀 →</span>
                    </div>
                </div>
            </a>
        `;
    }

    // ------------------------------------
    // 函數：渲染頁碼控制
    // ------------------------------------
    function renderPaginationControls(activePage, totalPages) {
        let controlsHTML = '';
        const prevDisabled = activePage === 1 ? 'pointer-events: none; opacity: 0.5;' : '';
        controlsHTML += `<a href="#" data-page="${activePage - 1}" style="margin: 0 5px; ${prevDisabled}">« 上一頁</a>`;
        
        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === activePage ? `color: var(--color-primary); font-weight: bold;` : `color: var(--color-text);`;
            controlsHTML += `<a href="#" data-page="${i}" style="margin: 0 5px; ${isActive}">${i}</a>`;
        }
        
        const nextDisabled = activePage === totalPages ? 'pointer-events: none; opacity: 0.5;' : '';
        controlsHTML += `<a href="#" data-page="${activePage + 1}" style="margin: 0 5px; ${nextDisabled}">下一頁 »</a>`;

        paginationControls.innerHTML = controlsHTML;
    }

    // ------------------------------------
    // 函數：渲染文章和頁碼 (核心渲染邏輯)
    // ------------------------------------
    function renderPage(page) {
        const filteredArticles = getFilteredArticles();
        const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
        
        if (filteredArticles.length === 0) {
            container.innerHTML = `<p style="text-align: center; font-size: 1.2em; padding: 50px 0;">此分類目前沒有相關文章。</p>`;
            paginationControls.innerHTML = ''; 
            return;
        }

        // 確保當前頁數不會超過總頁數
        if (page > totalPages) {
            currentPage = totalPages;
            page = totalPages;
        }

        const startIndex = (page - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;
        const articlesToShow = filteredArticles.slice(startIndex, endIndex);

        // 渲染文章
        container.innerHTML = articlesToShow.map(createArticleCardHTML).join('');

        // 渲染頁碼控制
        renderPaginationControls(page, totalPages);
    }


    // ------------------------------------
    // 事件監聽：處理分類按鈕點擊
    // ------------------------------------
    categoryFilters.addEventListener('click', (e) => {
        e.preventDefault(); 
        const target = e.target.closest('a');
        if (!target || !target.getAttribute('data-category')) return;

        const newCategory = target.getAttribute('data-category');
        
        if (newCategory !== currentCategory) {
            currentCategory = newCategory;
            currentPage = 1; 
            renderPage(currentPage);
            
            // 更新 active 樣式 (假設 CSS 中已定義 .btn-filter.active 樣式)
            Array.from(categoryFilters.querySelectorAll('a')).forEach(a => {
                a.classList.remove('active');
            });
            target.classList.add('active');
        }
    });

    // ------------------------------------
    // 事件監聽：處理頁碼點擊
    // ------------------------------------
    paginationControls.addEventListener('click', (e) => {
        e.preventDefault(); 
        const target = e.target.closest('a');
        if (!target) return;

        const newPage = parseInt(target.getAttribute('data-page'));
        const totalPages = Math.ceil(getFilteredArticles().length / articlesPerPage);

        if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
            currentPage = newPage;
            renderPage(currentPage);
            // 點擊後滾動到文章列表上方
            window.scrollTo({ top: container.offsetTop - 50, behavior: 'smooth' }); 
        }
    });


    // 首次載入頁面，執行渲染
    renderPage(currentPage);
});