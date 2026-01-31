// Modal Logic

const MODAL_HTML = `
<div id="modal-overlay" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4 opacity-0 transition-opacity duration-300">
    <div id="modal-content" class="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative transform transition-all duration-300 scale-95 overflow-y-auto max-h-[90vh]">
        <button onclick="closeModal()" aria-label="Закрыть модальное окно" class="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition">
            <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl mb-4">
                <i data-lucide="zap" class="w-7 h-7 fill-orange-600"></i>
            </div>
            <h3 class="text-2xl font-black text-slate-900 mb-2">ЗАПИСЬ НА ПРОБНОЕ</h3>
            <p class="text-slate-500 text-sm">Сначала напишем в Telegram, позвоним только если не ответите. На пробное нужны только форма и кроссовки, остальное выдадим.</p>
        </div>

        <form class="space-y-4" onsubmit="event.preventDefault(); alert('Спасибо! Заявка отправлена. Мы скоро свяжемся с вами.'); closeModal();">
            <div class="grid grid-cols-2 gap-3 mb-2">
                <label class="cursor-pointer">
                    <input type="radio" name="type" class="hidden radio-card" checked>
                    <div class="border border-slate-200 rounded-xl py-3 text-center text-sm font-bold text-slate-500 transition-all hover:border-orange-300">
                        Ребенок
                    </div>
                </label>
                <label class="cursor-pointer">
                    <input type="radio" name="type" class="hidden radio-card">
                    <div class="border border-slate-200 rounded-xl py-3 text-center text-sm font-bold text-slate-500 transition-all hover:border-orange-300">
                        Взрослый
                    </div>
                </label>
            </div>
            <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Ваше имя</label>
                <input type="text" placeholder="Иван" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all" required>
            </div>
            <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Телефон</label>
                <input type="tel" placeholder="+7 (999) 000-00-00" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all" required>
            </div>
            <button type="submit" class="w-full bg-orange-600 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl shadow-xl shadow-orange-200 hover:bg-orange-700 hover:scale-[1.02] transition-all">
                Записаться бесплатно
            </button>
            <p class="text-center text-[10px] text-slate-400 mt-4 leading-tight">
                Нажимая кнопку, вы соглашаетесь с <a href="#" class="underline hover:text-orange-600">политикой конфиденциальности</a>.
            </p>
        </form>
    </div>
</div>
`;

function initModal() {
    // 1. Inject CSS if not present
    if (!document.querySelector('link[href*="modal.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/modal.css';
        document.head.appendChild(link);
    }

    // 2. Inject HTML if not present
    if (!document.getElementById('modal-overlay')) {
        const div = document.createElement('div');
        div.innerHTML = MODAL_HTML;
        document.body.appendChild(div.firstElementChild);
    }

    // 3. Re-select elements
    const overlay = document.getElementById('modal-overlay');

    // 4. Attach Listeners
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }

    // 5. Initialize Icons in the modal
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function openModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');

    if (!modalOverlay || !modalContent) {
        console.warn('Modal elements not found, initializing...');
        initModal();
        // Retry opening after a short delay
        setTimeout(openModal, 50);
        return;
    }

    modalOverlay.classList.remove('hidden');
    // Force reflow
    void modalOverlay.offsetWidth;

    setTimeout(() => {
        modalOverlay.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    }, 10);

    // Close mobile menu if open
    const menu = document.getElementById('mobile-menu');
    if (menu && !menu.classList.contains('hidden')) {
        if (typeof toggleMobileMenu === 'function') {
            toggleMobileMenu();
        } else {
            menu.classList.add('hidden');
            menu.classList.remove('flex');
        }
    }
}

function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');

    if (!modalOverlay || !modalContent) return;

    modalOverlay.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        modalOverlay.classList.add('hidden');
    }, 300);

    // Remove hash if it exists to allow re-opening via URL hash
    if (window.location.hash === '#contacts') {
        history.pushState("", document.title, window.location.pathname + window.location.search);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initModal();

    // Auto Open Modal on Hash
    if (window.location.hash === '#contacts') {
        setTimeout(openModal, 500);
    }
});

// Also expose global functions if needed
window.openModal = openModal;
window.closeModal = closeModal;

