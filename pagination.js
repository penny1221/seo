// pagination.js (增強版 - 支援分頁與篩選)

document.addEventListener('DOMContentLoaded', () => {
    
    if (typeof allArticles === 'undefined') {
        console.error("articles-data.js 未載入或數據有誤。");
        return;
    }

    const articlesPerPage = 3; // 每頁顯示的文章數量
    let currentPage = 1;
    let currentCategory = '全部'; // 追蹤當前選定的分類
    
    const container = document.getElementById('articles-list-container');
    const paginationControls = document.getElementById('pagination-controls');
    const categoryFilters = document.getElementById('category-filters');


    // ------------------------------------
    // 核心函數：過濾數據
    // ------------------------------------
    function getFilteredArticles() {
        if (currentCategory === '全部') {
            return allArticles;
        }
        // 根據 currentCategory 篩選文章
        return allArticles.filter(article => article.category === currentCategory);
    }
    
    // ------------------------------------
    // 函數：生成文章卡片的 HTML (與之前相同，略)
    // ------------------------------------
    function createArticleCardHTML(article) {
         return `
            <a href="${article.link}" class="article-card-link" style="text-decoration: none; color: inherit;">
                <div class="article-card" style="border: 1px solid var(--color-divider); border-radius: 8px; overflow: hidden; transition: transform 0.3s;">
                    <div class="card-image" style="height: 200px; background-color: #EEE;">[${article.category} 圖片佔位符]</div>
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
    // 函數：渲染文章和頁碼
    // ------------------------------------
    function renderPage(page) {
        if (!container || !paginationControls) return;

        // 取得當前過濾後的文章列表
        const filteredArticles = getFilteredArticles();
        const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
        
        // 處理沒有文章的情況
        if (filteredArticles.length === 0) {
            container.innerHTML = `<p style="text-align: center; font-size: 1.2em; padding: 50px 0;">此分類目前沒有相關文章。</p>`;
            paginationControls.innerHTML = ''; // 清空頁碼
            return;
        }

        // 計算起始和結束索引
        const startIndex = (page - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;
        
        // 取得該頁的文章
        const articlesToShow = filteredArticles.slice(startIndex, endIndex);

        // 渲染文章
        container.innerHTML = articlesToShow.map(createArticleCardHTML).join('');

        // 渲染頁碼控制
        renderPaginationControls(page, totalPages);
    }

    function renderPaginationControls(activePage, totalPages) {
        let controlsHTML = '';
        
        // 上一頁按鈕
        const prevDisabled = activePage === 1 ? 'pointer-events: none; opacity: 0.5;' : '';
        controlsHTML += `<a href="#" data-page="${activePage - 1}" style="margin: 0 5px; ${prevDisabled}">« 上一頁</a>`;
        
        // 頁碼數字
        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === activePage ? `color: var(--color-primary); font-weight: bold;` : `color: var(--color-text);`;
            controlsHTML += `<a href="#" data-page="${i}" style="margin: 0 5px; ${isActive}">${i}</a>`;
        }
        
        // 下一頁按鈕
        const nextDisabled = activePage === totalPages ? 'pointer-events: none; opacity: 0.5;' : '';
        controlsHTML += `<a href="#" data-page="${activePage + 1}" style="margin: 0 5px; ${nextDisabled}">下一頁 »</a>`;

        paginationControls.innerHTML = controlsHTML;
    }


    // ------------------------------------
    // 事件監聽：處理分類按鈕點擊
    // ------------------------------------
    categoryFilters.addEventListener('click', (e) => {
        e.preventDefault(); 
        
        const target = e.target.closest('a');
        if (!target || !target.getAttribute('data-category')) return;

        const newCategory = target.getAttribute('data-category');
        
        // 只有當分類切換時才重設並渲染
        if (newCategory !== currentCategory) {
            currentCategory = newCategory;
            currentPage = 1; // 切換分類後，重設到第一頁
            renderPage(currentPage);
            
            // 更新按鈕的 active 樣式
            Array.from(categoryFilters.querySelectorAll('a')).forEach(a => {
                a.classList.remove('active');
                // 移除行內 style 以保持簡潔
                a.style.cssText = 'margin: 0 5px;'; 
            });
            target.classList.add('active');
            
            // 重新添加 active 樣式 (假設您的 CSS 中沒有定義 .active 樣式，我們用 inline style 實現)
            target.style.cssText = `margin: 0 5px; border: 1px solid var(--color-primary); background-color: var(--color-primary); color: white; border-radius: 5px; text-decoration: none;`;
        }
    });

    // ------------------------------------
    // 事件監聽：處理頁碼點擊 (與之前相同，略作精簡)
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


    // 首次載入頁面
    renderPage(currentPage);
});