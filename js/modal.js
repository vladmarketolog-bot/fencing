// Modal Logic

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby_Nrh1e90gC-btKHdqSAfhmf0hctxES3YDnfbBqlsHcH4c2bUMkoFWxrlv_vayVcYV/exec";

const MODAL_HTML = `
<div id="modal-overlay" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4 opacity-0 transition-opacity duration-300">
    <div id="modal-content" class="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative transform transition-all duration-300 scale-95 overflow-y-auto max-h-[90vh]">
        <button onclick="closeModal()" aria-label="Закрыть модальное окно" class="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition">
            <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div id="modal-success" class="hidden text-center py-10">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                <i data-lucide="check" class="w-10 h-10"></i>
            </div>
            <h3 class="text-2xl font-black text-slate-900 mb-4">ЗАЯВКА ПРИНЯТА!</h3>
            <p class="text-slate-500 mb-8">Спасибо. Мы свяжемся с вами в ближайшее время в Telegram или по телефону.</p>
            <button onclick="closeModal()" class="bg-slate-100 text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition">
                Отлично
            </button>
        </div>

        <div id="modal-form-container">
            <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl mb-4">
                    <i data-lucide="zap" class="w-7 h-7 fill-orange-600"></i>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-2">ЗАПИСЬ НА ПРОБНОЕ</h3>
                <p class="text-slate-500 text-sm">Сначала напишем в Telegram, позвоним только если не ответите. На пробное нужны только форма и кроссовки, остальное выдадим.</p>
            </div>

            <form class="space-y-4" onsubmit="submitForm(event)">
                <div class="grid grid-cols-2 gap-3 mb-2">
                    <label class="cursor-pointer">
                        <input type="radio" name="type" value="Ребенок" class="hidden radio-card" checked>
                        <div class="border border-slate-200 rounded-xl py-3 text-center text-sm font-bold text-slate-500 transition-all hover:border-orange-300 peer-checked:border-orange-500 peer-checked:text-orange-600 peer-checked:bg-orange-50">
                            Ребенок
                        </div>
                    </label>
                    <label class="cursor-pointer">
                        <input type="radio" name="type" value="Взрослый" class="hidden radio-card">
                        <div class="border border-slate-200 rounded-xl py-3 text-center text-sm font-bold text-slate-500 transition-all hover:border-orange-300 peer-checked:border-orange-500 peer-checked:text-orange-600 peer-checked:bg-orange-50">
                            Взрослый
                        </div>
                    </label>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Ваше имя</label>
                    <input type="text" name="name" placeholder="Иван" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all" required>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Телефон</label>
                    <input type="tel" name="phone" placeholder="+7 (999) 000-00-00" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all" required>
                </div>
                <button type="submit" id="submit-btn" class="w-full bg-orange-600 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl shadow-xl shadow-orange-200 hover:bg-orange-700 hover:scale-[1.02] transition-all flex items-center justify-center">
                    <span>Записаться бесплатно</span>
                    <svg id="loading-spinner" class="animate-spin ml-2 h-5 w-5 text-white hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </button>
                <p class="text-center text-[10px] text-slate-400 mt-4 leading-tight">
                    Нажимая кнопку, вы соглашаетесь с <a href="#" class="underline hover:text-orange-600">политикой конфиденциальности</a>.
                </p>
            </form>
        </div>
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

    // Add custom styles for radio-card active state if not in CSS
    if (!document.getElementById('modal-custom-style')) {
        const style = document.createElement('style');
        style.id = 'modal-custom-style';
        style.innerHTML = `
            .radio-card:checked + div {
                border-color: #f97316;
                color: #ea580c;
                background-color: #fff7ed;
            }
        `;
        document.head.appendChild(style);
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
    const successDiv = document.getElementById('modal-success');
    const formDiv = document.getElementById('modal-form-container');

    if (!modalOverlay || !modalContent) {
        console.warn('Modal elements not found, initializing...');
        initModal();
        // Retry opening after a short delay
        setTimeout(openModal, 50);
        return;
    }

    // Reset state
    if (successDiv) successDiv.classList.add('hidden');
    if (formDiv) formDiv.classList.remove('hidden');

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

async function getAnalyticsData() {
    const analytics = {
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
    };

    // Parse UTMs
    const urlParams = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
        if (urlParams.has(param)) {
            analytics[param] = urlParams.get(param);
        }
    });

    // Try to get IP (lightweight)
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        if (res.ok) {
            const json = await res.json();
            analytics.ip = json.ip;
        }
    } catch (e) {
        console.warn('IP fetch failed', e);
    }

    return analytics;
}

async function submitForm(event) {
    event.preventDefault();

    if (GOOGLE_SCRIPT_URL === "YOUR_WEB_APP_URL_HERE") {
        alert("Ошибка настройки: Не указана ссылка на скрипт обработчика.");
        return;
    }

    const form = event.target;
    const btn = document.getElementById('submit-btn');
    const spinner = document.getElementById('loading-spinner');

    // Elements - re-select to be safe
    const successDiv = document.getElementById('modal-success');
    const formDiv = document.getElementById('modal-form-container');

    // UI Loading State
    btn.disabled = true;
    btn.classList.add('opacity-75', 'cursor-not-allowed');
    if (spinner) spinner.classList.remove('hidden');

    // Collect Data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    // Enrich with Analytics
    try {
        const analytics = await getAnalyticsData();
        Object.assign(data, {
            utm_source: analytics.utm_source || '',
            utm_medium: analytics.utm_medium || '',
            utm_campaign: analytics.utm_campaign || '',
            utm_term: analytics.utm_term || '',
            utm_content: analytics.utm_content || '',
            referrer: analytics.referrer || '',
            page_url: analytics.url || '',
            user_agent: analytics.userAgent || '',
            ip_address: analytics.ip || '',
            screen_res: analytics.screen || '',
            timezone: analytics.timezone || ''
        });
    } catch (e) {
        console.warn('Analytics collection failed', e);
    }

    const params = new URLSearchParams(data);

    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: params
    })
        .then(response => {
            return response.json().catch(() => ({ result: "success" }));
        })
        .then(result => {
            // Success UI
            if (successDiv) successDiv.classList.remove('hidden');
            if (formDiv) formDiv.classList.add('hidden');

            // Auto close after 3 seconds
            setTimeout(() => {
                closeModal();
                // Reset form state after closing
                setTimeout(() => {
                    successDiv.classList.add('hidden');
                    formDiv.classList.remove('hidden');
                    form.reset();
                    btn.disabled = false;
                    btn.classList.remove('opacity-75', 'cursor-not-allowed');
                    if (spinner) spinner.classList.add('hidden');
                }, 300);
            }, 3000);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке. Пожалуйста, позвоните нам.');

            // Allow retry
            btn.disabled = false;
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
            if (spinner) spinner.classList.add('hidden');
        });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initModal();

    // Auto Open Modal on Hash
    if (window.location.hash === '#contacts') {
        setTimeout(openModal, 500);
    }
});

// Also expose global functions
window.openModal = openModal;
window.closeModal = closeModal;
window.submitForm = submitForm;

