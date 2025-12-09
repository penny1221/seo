/**
 * 函數：設定漢堡選單的點擊事件
 * 這個函數必須在 header.html 成功載入後才執行。
 */
function setupHamburgerMenu() {
    // 再次確保我們正在尋找的元素已經存在於 DOM 中
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const mainNavigation = document.getElementById('main-navigation');

    if (hamburgerToggle && mainNavigation) {
        // 監聽點擊事件
        hamburgerToggle.addEventListener('click', () => {
            // 切換 nav-links 上的 'active' 類別
            mainNavigation.classList.toggle('active');

            // 切換漢堡圖標 (例如：X 符號)
            const isExpanded = mainNavigation.classList.contains('active');
            hamburgerToggle.innerHTML = isExpanded ? '&#x2715;' : '&#9776;'; // &#x2715; 是 X 符號
        });

        // 點擊選單項目後自動關閉選單
        mainNavigation.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // 檢查是否在移動模式下
                if (window.innerWidth <= 768) {
                    mainNavigation.classList.remove('active');
                    hamburgerToggle.innerHTML = '&#9776;';
                }
            });
        });
        
        console.log("漢堡選單事件監聽器設定成功！");
    } else {
        // 這條錯誤信息只應在 header.html 加載失敗時出現
        console.error("錯誤：無法找到漢堡選單或導航元素，可能 header.html 尚未載入。");
    }
}

function renderLatestArticles() {
    // 檢查 allArticles 是否存在，以及是否在首頁
    if (typeof allArticles === 'undefined') {
        // 如果還沒載入數據，就退出
        return; 
    }
    const container = document.getElementById('latest-articles-container');
    if (!container) {
        // 如果不在首頁，就退出
        return; 
    }
    
    // 排序文章（如果數據未排序，通常按日期排序）
    // 這裡我們假設 allArticles 已經按日期降序排列
    const latestArticles = allArticles.slice(0, 3); // 抓取最新的 3 篇文章

    // 由於我們不知道您的 createArticleCardHTML 函數在哪，我們在這裡重新定義一個簡單版本
    function createIndexCardHTML(article) {
    // 檢查是否有圖片，如果沒有則使用預設圖片或空白
    const imagePath = article.imageSrc || 'images/default-placeholder.jpg'; 
    const altText = article.title + ' 封面圖'; // 圖片的 alt 屬性

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
                    <p class="meta" style="font-size: 14px; color: #777; margin-bottom: 15px;">發布日期：${article.date}</p>
                    <span class="read-more" style="color: var(--color-accent); font-weight: bold;">深入閱讀 →</span>
                </div>
            </div>
        </a>
    `;
}
    // 渲染 HTML
    container.innerHTML = latestArticles.map(createIndexCardHTML).join('');
}


document.addEventListener('DOMContentLoaded', () => {
    // ... 您的 loadComponent 函數和載入 Header/Footer 的程式碼 ...

    // ⚠️ 在載入完畢後，執行最新文章渲染 ⚠️
    renderLatestArticles(); 

});

document.addEventListener('DOMContentLoaded', () => {

    function loadComponent(file, targetId, callback = null) {
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    console.error(`Failed to load ${file}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    // 將共用 HTML 內容插入佔位符
                    targetElement.innerHTML = data;
                    
                    // ⚠️ 成功載入後，執行回調函數 (Callback) ⚠️
                    if (callback) {
                        callback();
                    }
                }
            })
            .catch(error => console.error('Component loading error:', error));
    }

    // --- 載入核心共用區塊 ---

    // 1. 載入共用樣式和通用 Meta 標籤 (head-styles.html)
    // 載入樣式不需要回調
    loadComponent('head-styles.html', 'head-styles-placeholder');

    // 2. 載入 Header (導航列)
    // ⚠️ 關鍵：載入成功後，執行 setupHamburgerMenu 函數 ⚠️
    loadComponent('header.html', 'nav-placeholder', setupHamburgerMenu);

    // 3. 載入 Footer (頁尾)
    loadComponent('footer.html', 'footer-placeholder');

});