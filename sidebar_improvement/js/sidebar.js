// Sidebar interactivity: toggle, save state, smooth scroll, keyboard helpers
(function(){
    const KEY = 'sidebarCollapsed_v1';
    function $(sel){return document.querySelector(sel);}    

    function init() {
        const nav = $('.navbar');
        if (!nav) return;
        nav.setAttribute('role','navigation');
        nav.setAttribute('aria-label','Главное меню');

        // add toggle button if not present
        if (!document.getElementById('sidebarToggle')){
            const btn = document.createElement('button');
            btn.id = 'sidebarToggle';
            btn.className = 'btn btn-secondary no-print';
            btn.setAttribute('aria-expanded','true');
            btn.setAttribute('aria-controls','mainNav');
            btn.title = 'Свернуть/развернуть меню';
            btn.innerHTML = '☰';
            nav.insertBefore(btn, nav.firstChild);
            btn.addEventListener('click', toggleSidebar);
        }

        // set id for nav-links container
        const linksContainer = document.querySelector('.nav-links');
        if (linksContainer) linksContainer.id = 'mainNav';

        // restore state
        const collapsed = localStorage.getItem(KEY) === '1';
        if (collapsed) document.body.classList.add('sidebar-collapsed');
        updateToggleAria();

        // smooth scroll for internal links
        document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
            a.addEventListener('click', function(e){
                e.preventDefault();
                const targetId = this.getAttribute('href').slice(1);
                const target = document.getElementById(targetId);
                if (target){
                    target.scrollIntoView({behavior:'smooth', block:'start'});
                    history.replaceState(null,'', '#'+targetId);
                }
                // set active immediately
                document.querySelectorAll('.nav-links a').forEach(l=>l.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // keyboard shortcuts: Esc closes mobile (removes focus)
        document.addEventListener('keydown', (e)=>{
            if (e.key === 'Escape'){
                // remove any focus from nav
                document.activeElement && document.activeElement.blur();
            }
        });

        // accessibility: allow Enter on collapsed links
        document.querySelectorAll('.nav-links a').forEach(a => {
            a.addEventListener('keydown', (e)=>{
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); a.click(); }
            });
        });

        updateToggleAria();
    }

    function toggleSidebar(){
        const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
        localStorage.setItem(KEY, isCollapsed ? '1' : '0');
        updateToggleAria();
    }

    function updateToggleAria(){
        const btn = document.getElementById('sidebarToggle');
        if (!btn) return;
        const expanded = !document.body.classList.contains('sidebar-collapsed');
        btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }

    document.addEventListener('DOMContentLoaded', init);
})();
