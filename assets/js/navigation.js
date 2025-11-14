// import { App } from "@capacitor/app"
function getAllPages() {
    return Array.from(document.querySelectorAll('.floater-pages.nativeNavigation .page'));
}

function getState(pages) {
    return pages.map(page => page.classList.contains('active'));
}

function applyState(pages, state) {
    pages.forEach((page, i) => {
        page.classList.toggle('active', state[i]);
    });
}

function initWindowNavigation() {
    window.addEventListener('load', () => {
        const allPages = getAllPages();
        let prevState = getState(allPages);

        // Replace initial state in history
        history.replaceState({ state: prevState }, '');

        // Set up mutation observer
        const observer = new MutationObserver((mutations) => {
            const newPages = getAllPages(); // In case the DOM changed
            const newState = getState(newPages);

            if (JSON.stringify(newState) !== JSON.stringify(prevState)) {
                prevState = newState;
                history.pushState({ state: newState }, '');
            }
        });

        allPages.forEach(page => {
            observer.observe(page, {
                attributes: true,
                attributeFilter: ['class'], // Only watch for class changes
                attributeOldValue: true
            });
        });

        // Handle back/forward navigation
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.state) {
                try{shutPop('.active')}catch(err){}
                const currentPages = getAllPages();
                applyState(currentPages, e.state.state);
                prevState = e.state.state;
                switchTheme();
            }
        });
    });
}

initWindowNavigation();
// App.addListener('backButton', () => {
//     if (history.state) {history.back()}
//     else{App.close()};
// });