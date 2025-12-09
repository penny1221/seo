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