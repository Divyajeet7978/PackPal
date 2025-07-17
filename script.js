document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STATE MANAGEMENT ---
    const STATE = {
        items: [],
        packedItems: [],
        lastAction: null,
        theme: 'light',
        tripDetails: {},
        categories: [
            { id: 'clothing', name: 'Clothing', icon: 'tshirt' },
            { id: 'electronics', name: 'Electronics', icon: 'laptop' },
            { id: 'toiletries', name: 'Toiletries', icon: 'pump-soap' },
            { id: 'documents', name: 'Documents', icon: 'passport' },
            { id: 'accessories', name: 'Accessories', icon: 'glasses' },
            { id: 'medication', name: 'Medication', icon: 'pills' },
            { id: 'other', name: 'Other', icon: 'box' }
        ],
        swipeState: {
            isDragging: false,
            startX: 0,
            currentX: 0,
            target: null
        }
    };

    // --- 2. DOM ELEMENT REFERENCES ---
    const DOM = {
        themeToggle: document.getElementById('themeToggle'),
        mobileTheme: document.getElementById('mobileTheme'),
        destinationInput: document.getElementById('destination'),
        destinationResults: document.getElementById('destination-results'),
        durationInput: document.getElementById('duration'),
        seasonSelect: document.getElementById('season'),
        activitiesInput: document.getElementById('activities'),
        travelersInput: document.getElementById('travelers'),
        classSelect: document.getElementById('class'),
        airlineSelect: document.getElementById('airline'),
        generateBtn: document.getElementById('generateBtn'),
        itemsContainer: document.getElementById('itemsContainer'),
        addCustomItemBtn: document.getElementById('addCustomItemBtn'),
        packedItemsList: document.getElementById('packedItemsList'),
        currentWeight: document.getElementById('currentWeight'),
        maxWeight: document.getElementById('maxWeight'),
        suitcaseSvg: document.getElementById('suitcase-svg'),
        suitcaseFill: document.getElementById('suitcase-fill'),
        categoriesGrid: document.getElementById('categoriesGrid'),
        travelInfoContainer: document.getElementById('travelInfoContainer'),
        shareBtn: document.getElementById('shareBtn'),
        mobileShare: document.getElementById('mobileShare'),
        shareModal: document.getElementById('shareModal'),
        exportTextBtn: document.getElementById('exportTextBtn'),
        exportPdfBtn: document.getElementById('exportPdfBtn'),
        exportImgBtn: document.getElementById('exportImgBtn'),
        addItemModal: document.getElementById('addItemModal'),
        itemNameInput: document.getElementById('itemName'),
        itemCategorySelect: document.getElementById('itemCategory'),
        itemQuantityInput: document.getElementById('itemQuantity'),
        itemWeightInput: document.getElementById('itemWeight'),
        saveItemBtn: document.getElementById('saveItemBtn'),
        undoNotification: document.getElementById('undoNotification'),
        undoActionBtn: document.getElementById('undoActionBtn'),
        modalCloses: document.querySelectorAll('.modal-close'),
    };

    // --- 3. DATA & SUGGESTION ENGINE ---
    const DATA = {
        airlineAllowances: {
            default: { economy: 23, business: 32, first: 32 },
            emirates: { economy: 30, business: 40, first: 50 },
            qatar: { economy: 30, business: 40, first: 50 },
            singapore: { economy: 30, business: 40, first: 50 },
            delta: { economy: 23, business: 32, first: 32 },
            united: { economy: 23, business: 32, first: 32 },
            lufthansa: { economy: 23, business: 32, first: 32 }
        },
        countryData: {
            "Afghanistan": { currency: "AFN", rate: 0.94, symbol: "؋", biome: "desert", tips: ["Dress conservatively.", "Be aware of the security situation.", "Hospitality is a key part of the culture."] },
            "Albania": { currency: "ALL", rate: 0.88, symbol: "L", biome: "temperate", tips: ["Enjoy the affordable prices.", "Explore the beautiful coastline.", "A nod up means 'no', and a shake side-to-side means 'yes'."] },
            "Algeria": { currency: "DZD", rate: 0.62, symbol: "د.ج", biome: "desert", tips: ["A visa is required for most visitors.", "French is widely spoken.", "The Sahara desert offers incredible landscapes."] },
            "Argentina": { currency: "ARS", rate: 0.09, symbol: "$", biome: "temperate", tips: ["Steak and Malbec wine are national treasures.", "Tango shows in Buenos Aires are a must-see.", "Be prepared for late dinners, often starting after 9 PM."] },
            "Australia": { currency: "AUD", rate: 55.2, symbol: "A$", biome: "temperate", tips: ["Sun protection is crucial.", "Tipping is not obligatory but is appreciated.", "'No worries' is a common, friendly phrase."] },
            "Austria": { currency: "EUR", rate: 90.8, symbol: "€", biome: "alpine", tips: ["Enjoy the coffee house culture in Vienna.", "Hiking in the Alps is spectacular.", "Formal titles are often used."] },
            "Brazil": { currency: "BRL", rate: 15.5, symbol: "R$", biome: "tropical", tips: ["A 'thumbs-up' is a common gesture.", "Be cautious in large cities.", "Lunch is the main meal of the day."] },
            "Canada": { currency: "CAD", rate: 61.2, symbol: "C$", biome: "alpine", tips: ["Tipping (15-20%) is standard.", "Explore the vast national parks.", "Both English and French are official languages."] },
            "China": { currency: "CNY", rate: 11.5, symbol: "¥", biome: "temperate", tips: ["A VPN is needed to access many Western websites.", "Bargaining is common in markets.", "Use WeChat or Alipay for mobile payments."] },
            "Egypt": { currency: "EGP", rate: 1.75, symbol: "E£", biome: "desert", tips: ["Bargaining is expected in markets.", "Dress modestly, especially at religious sites.", "Stay hydrated."] },
            "France": { currency: "EUR", rate: 90.8, symbol: "€", biome: 'temperate', tips: ["Always greet with 'Bonjour' when entering a shop.", "A service charge is usually included in restaurant bills.", "Be mindful of pickpockets in major tourist areas like Paris."] },
            "Germany": { currency: "EUR", rate: 90.8, symbol: "€", biome: "temperate", tips: ["Punctuality is very important.", "Cash is preferred in many smaller shops and restaurants.", "The Autobahn has sections with no speed limit."] },
            "Greece": { currency: "EUR", rate: 90.8, symbol: "€", biome: "temperate", tips: ["Island hopping is a popular activity.", "Enjoy the relaxed pace of life.", "A 'siesta' in the afternoon is common."] },
            "India": { currency: "INR", rate: 1.0, symbol: "₹", biome: "tropical", tips: ["Bargaining is common.", "Be prepared for a sensory overload.", "Respect local customs and dress modestly."] },
            "Italy": { currency: "EUR", rate: 90.8, symbol: "€", biome: "temperate", tips: ["A 'coperto' (cover charge) is common in restaurants.", "Don't order a cappuccino after 11 AM.", "Validate your train tickets before boarding."] },
            "Japan": { currency: 'JPY', rate: 0.54, symbol: '¥', biome: 'temperate', tips: ["Purchase a Japan Rail Pass before you arrive for cost-effective travel.", "Carry cash, as many smaller establishments don't accept cards.", "Bowing is a sign of respect; a simple nod is fine for tourists."] },
            "Mexico": { currency: "MXN", rate: 4.6, symbol: "$", biome: "tropical", tips: ["Enjoy the diverse and regional cuisine.", "Be cautious with tap water; drink bottled water.", "Spanish is the official language."] },
            "Morocco": { currency: "MAD", rate: 8.4, symbol: "د.م.", biome: "desert", tips: ["Haggling in the souks is part of the experience.", "Mint tea is a symbol of hospitality.", "Dress conservatively."] },
            "New Zealand": { currency: "NZD", rate: 51.5, symbol: "NZ$", biome: "alpine", tips: ["Outdoor activities are a must.", "Driving is on the left.", "The 'haka' is a traditional Māori war dance."] },
            "South Africa": { currency: "ZAR", rate: 4.5, symbol: "R", biome: "temperate", tips: ["Go on a safari in Kruger National Park.", "It has 11 official languages.", "Be aware of your surroundings for safety."] },
            "Spain": { currency: "EUR", rate: 90.8, symbol: "€", biome: "temperate", tips: ["Dinner is eaten late, often after 9 PM.", "Siestas are common in the afternoon.", "Each region has its own distinct culture and cuisine."] },
            "Switzerland": { currency: 'CHF', rate: 92.5, symbol: 'Fr', biome: 'alpine', tips: ["Punctuality is highly valued.", "Tap water is of excellent quality and safe to drink.", "A Swiss Travel Pass can offer great value for transport and museums."] },
            "Thailand": { currency: 'THB', rate: 2.28, symbol: '฿', biome: 'tropical', tips: ["The 'wai' is the traditional greeting.", "Never touch someone's head or point your feet at people or religious icons.", "Street food is a highlight; choose vendors with high turnover."] },
            "Turkey": { currency: "TRY", rate: 2.5, symbol: "₺", biome: "temperate", tips: ["Enjoy a traditional Turkish bath (hammam).", "Bargaining is expected in the Grand Bazaar.", "Drink lots of Turkish tea (çay)."] },
            "United Arab Emirates": { currency: 'AED', rate: 22.7, symbol: 'د.إ', biome: 'desert', tips: ["Dress modestly in public areas out of respect for local culture.", "Public displays of affection are not permitted.", "The work week is typically Sunday to Thursday."] },
            "United Kingdom": { currency: "GBP", rate: 106.2, symbol: "£", biome: "temperate", tips: ["Queuing is a way of life.", "The weather is famously unpredictable.", "Pub culture is central to social life."] },
            "United States": { currency: 'USD', rate: 83.5, symbol: '$', biome: 'temperate', tips: ["Tipping (15-20%) is customary in restaurants and for services.", "Sales tax is added at checkout, it's not included in the tag price.", "Distances are vast; plan for long travel times between cities."] },
            "Vietnam": { currency: "VND", rate: 0.0033, symbol: "₫", biome: "tropical", tips: ["Crossing the street in busy cities requires confidence.", "Try the local coffee.", "Motorbikes are the most common form of transport."] },
            "default": { currency: 'USD', rate: 83.5, symbol: '$', biome: 'temperate', tips: ["Always inform your bank of your travel plans to avoid card issues.", "Keep digital and physical copies of your important documents.", "Learn a few basic phrases in the local language; it's always appreciated."] }
        },
        itemPacks: {
            essentials: [
                { name: 'Passport/ID', category: 'documents', weight: 0.1, quantity: 1 },
                { name: 'Phone & Charger', category: 'electronics', weight: 0.2, quantity: 1 },
                { name: 'Wallet (Cash & Cards)', category: 'documents', weight: 0.2, quantity: 1 },
                { name: 'Keys', category: 'other', weight: 0.1, quantity: 1 },
                { name: 'Prescription Medication', category: 'medication', weight: 0.3, quantity: 1 }
            ],
            clothingBase: (days) => [
                { name: 'Underwear & Socks', category: 'clothing', weight: 0.05, quantity: days },
                { name: 'T-shirts/Tops', category: 'clothing', weight: 0.2, quantity: Math.ceil(days / 1.5) },
                { name: 'Pants/Bottoms', category: 'clothing', weight: 0.6, quantity: Math.ceil(days / 3) },
                { name: 'Pajamas', category: 'clothing', weight: 0.4, quantity: 1 },
            ],
            biomes: {
                temperate: {
                    Summer: [{ name: 'Light Jacket', category: 'clothing', weight: 0.6, quantity: 1 }, { name: 'Sunglasses', category: 'accessories', weight: 0.1, quantity: 1 }],
                    Winter: [{ name: 'Warm Coat', category: 'clothing', weight: 1.5, quantity: 1 }, { name: 'Scarf, Gloves & Hat', category: 'accessories', weight: 0.4, quantity: 1 }, { name: 'Thermal Layers', category: 'clothing', weight: 0.5, quantity: 2 }],
                    'Spring/Fall': [{ name: 'Medium Jacket/Sweater', category: 'clothing', weight: 0.8, quantity: 1 }, { name: 'Umbrella', category: 'accessories', weight: 0.3, quantity: 1 }]
                },
                tropical: {
                    Summer: [{ name: 'Swimsuit', category: 'clothing', weight: 0.2, quantity: 2 }, { name: 'Sunscreen', category: 'toiletries', weight: 0.2, quantity: 1 }, { name: 'Insect Repellent', category: 'toiletries', weight: 0.2, quantity: 1 }, { name: 'Sandals/Flip-flops', category: 'clothing', weight: 0.3, quantity: 1 }],
                    Winter: [{ name: 'Light Rain Jacket', category: 'clothing', weight: 0.4, quantity: 1 }, { name: 'Swimsuit', category: 'clothing', weight: 0.2, quantity: 1 }],
                    'Spring/Fall': [{ name: 'Light Rain Jacket', category: 'clothing', weight: 0.4, quantity: 1 }, { name: 'Swimsuit', category: 'clothing', weight: 0.2, quantity: 1 }]
                },
                desert: {
                    Summer: [{ name: 'Sun Hat', category: 'accessories', weight: 0.2, quantity: 1 }, { name: 'Sunglasses', category: 'accessories', weight: 0.1, quantity: 1 }, { name: 'Lip Balm', category: 'toiletries', weight: 0.05, quantity: 1 }, { name: 'Light Long-Sleeved Shirt', category: 'clothing', weight: 0.3, quantity: 2 }],
                    Winter: [{ name: 'Warm Jacket (for nights)', category: 'clothing', weight: 1.0, quantity: 1 }, { name: 'Moisturizer', category: 'toiletries', weight: 0.1, quantity: 1 }],
                    'Spring/Fall': [{ name: 'Jacket/Fleece', category: 'clothing', weight: 0.8, quantity: 1 }, { name: 'Sun Hat', category: 'accessories', weight: 0.2, quantity: 1 }]
                },
                alpine: {
                    Summer: [{ name: 'Hiking Boots', category: 'clothing', weight: 1.2, quantity: 1 }, { name: 'Fleece Jacket', category: 'clothing', weight: 0.6, quantity: 1 }, { name: 'Rain Gear', category: 'clothing', weight: 0.5, quantity: 1 }],
                    Winter: [{ name: 'Insulated Winter Coat', category: 'clothing', weight: 1.8, quantity: 1 }, { name: 'Snow Pants', category: 'clothing', weight: 1.0, quantity: 1 }, { name: 'Goggles/Sunglasses', category: 'accessories', weight: 0.2, quantity: 1 }, { name: 'Thermal Layers', category: 'clothing', weight: 0.5, quantity: 3 }],
                    'Spring/Fall': [{ name: 'Waterproof Jacket', category: 'clothing', weight: 0.7, quantity: 1 }, { name: 'Hiking Shoes', category: 'clothing', weight: 1.0, quantity: 1 }, { name: 'Layers (Fleece, etc.)', category: 'clothing', weight: 0.6, quantity: 2 }]
                }
            },
            activities: {
                beach: [{ name: 'Beach Towel', category: 'accessories', weight: 0.5, quantity: 1 }, { name: 'Swimsuit', category: 'clothing', weight: 0.2, quantity: 2 }],
                hiking: [{ name: 'Daypack', category: 'accessories', weight: 0.6, quantity: 1 }, { name: 'Water Bottle', category: 'accessories', weight: 0.2, quantity: 1 }, { name: 'First-Aid Kit', category: 'medication', weight: 0.4, quantity: 1 }],
                sightseeing: [{ name: 'Comfortable Walking Shoes', category: 'clothing', weight: 0.8, quantity: 1 }, { name: 'Portable Power Bank', category: 'electronics', weight: 0.4, quantity: 1 }],
                business: [{ name: 'Formal Outfit', category: 'clothing', weight: 1.2, quantity: 2 }, { name: 'Laptop & Charger', category: 'electronics', weight: 2.0, quantity: 1 }, { name: 'Travel Steamer', category: 'electronics', weight: 0.5, quantity: 1 }]
            }
        },
        generate() {
            const { duration, destination, season, activities } = STATE.tripDetails;
            const countryInfo = DATA.countryData[destination] || DATA.countryData.default;
            const biome = countryInfo.biome;
            let items = new Map();
            const addItem = (item) => {
                const existing = items.get(item.name.toLowerCase());
                if (existing) {
                    existing.quantity += item.quantity;
                } else {
                    items.set(item.name.toLowerCase(), { ...item });
                }
            };

            this.itemPacks.essentials.forEach(addItem);
            this.itemPacks.clothingBase(duration).forEach(addItem);
            if (this.itemPacks.biomes[biome]?.[season]) {
                this.itemPacks.biomes[biome][season].forEach(addItem);
            }
            Object.keys(this.itemPacks.activities).forEach(key => {
                if (activities.toLowerCase().includes(key)) {
                    this.itemPacks.activities[key].forEach(addItem);
                }
            });
            return Array.from(items.values());
        },
        getIntel() {
            const dest = STATE.tripDetails.destination;
            return DATA.countryData[dest] || DATA.countryData.default;
        }
    };

    // --- 4. UI MODULE ---
    const UI = {
        init() { this.renderCategories(); this.populateCategorySelect(); },
        applyTheme(theme) {
            document.body.setAttribute('data-theme', theme);
            const icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
            DOM.themeToggle.innerHTML = `<i class="fas ${icon}"></i>`;
            DOM.mobileTheme.innerHTML = `<i class="fas ${icon}"></i><span>Theme</span>`;
        },
        renderItemCard(item, index) {
            const card = document.createElement('div');
            card.className = 'item-card item-card-enter';
            card.dataset.id = item.id;
            card.style.animationDelay = `${index * 50}ms`;
            const category = STATE.categories.find(c => c.id === item.category) || {};
            card.innerHTML = `
                <div class="item-icon"><i class="fas fa-${category.icon || 'box'}"></i></div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-meta">
                        <span>${(item.weight * item.quantity).toFixed(1)} kg</span>
                        <span class="item-category">${category.name || 'Other'}</span>
                    </div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease-qty" data-id="${item.id}">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn increase-qty" data-id="${item.id}">+</button>
                </div>`;
            return card;
        },
        renderAllItems() {
            DOM.itemsContainer.innerHTML = '';
            if (STATE.items.length === 0) {
                DOM.itemsContainer.innerHTML = '<p>All items have been sorted!</p>';
            } else {
                STATE.items.forEach((item, index) => {
                    DOM.itemsContainer.appendChild(this.renderItemCard(item, index));
                });
            }
            this.updateStatus();
        },
        renderCategories() {
            DOM.categoriesGrid.innerHTML = STATE.categories.map(cat => `
                <div class="category-card" data-category="${cat.id}">
                    <div class="category-icon"><i class="fas fa-${cat.icon}"></i></div>
                    <div class="category-name">${cat.name}</div>
                    <div class="category-count">0/0</div>
                </div>`).join('');
        },
        populateCategorySelect() {
            DOM.itemCategorySelect.innerHTML = STATE.categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
        },
        updateStatus() {
            const totalWeight = STATE.packedItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
            const maxWeight = parseFloat(DOM.maxWeight.textContent);
            DOM.currentWeight.textContent = totalWeight.toFixed(1);
            const progress = Math.min(1, totalWeight / maxWeight);
            DOM.suitcaseFill.style.transform = `scaleY(${progress})`;
            
            let color = 'var(--primary-color)';
            if (progress > 0.7 && progress < 0.9) {
                color = 'var(--warning-color)';
            } else if (progress >= 0.9) {
                color = 'var(--danger-color)';
            }
            DOM.suitcaseFill.style.setProperty('--suitcase-fill-color', color);

            DOM.suitcaseSvg.classList.toggle('full', progress >= 1);

            STATE.categories.forEach(cat => {
                const totalInCat = [...STATE.items, ...STATE.packedItems].reduce((sum, i) => i.category === cat.id ? sum + i.quantity : sum, 0);
                const packedInCat = STATE.packedItems.reduce((sum, i) => i.category === cat.id ? sum + i.quantity : sum, 0);
                const countEl = DOM.categoriesGrid.querySelector(`[data-category="${cat.id}"] .category-count`);
                if (countEl && countEl.textContent !== `${packedInCat}/${totalInCat}`) {
                    countEl.textContent = `${packedInCat}/${totalInCat}`;
                    countEl.classList.add('updated');
                    setTimeout(() => countEl.classList.remove('updated'), 500);
                }
            });
        },
        updateTravelInfo() {
            const intel = DATA.getIntel();
            const toInrRate = intel.rate.toFixed(2);
            const fromInrRate = (1 / intel.rate).toFixed(4);

            DOM.travelInfoContainer.innerHTML = `
                ${intel.tips.map(tip => `
                    <div class="info-item">
                        <i class="fas fa-info-circle"></i>
                        <div class="info-item-content"><p>${tip}</p></div>
                    </div>`).join('')}
                <div class="currency-widget">
                     <div class="info-item">
                        <i class="fas fa-money-bill-wave"></i>
                        <div class="info-item-content">
                            <h4>Currency</h4>
                            <p><strong>1 ${intel.currency} ≈ ${toInrRate} INR</strong></p>
                            <ul>
                                <li>• Local currency: ${intel.currency} (${intel.symbol})</li>
                                <li>• 1 INR ≈ ${fromInrRate} ${intel.currency}</li>
                            </ul>
                        </div>
                    </div>
                </div>`;
        },
        toggleModal(modalId, show) { document.getElementById(modalId)?.classList.toggle('active', show); },
        showUndo(action) {
            STATE.lastAction = action;
            DOM.undoNotification.classList.add('show');
            setTimeout(() => DOM.undoNotification.classList.remove('show'), 4000);
        },
    };

    // --- 5. APP LOGIC ---
    const APP = {
        init() { UI.init(); this.loadTheme(); this.setupEventListeners(); this.updateWeightAllowance(); },
        loadTheme() {
            const theme = localStorage.getItem('packpal-theme') || 'light';
            STATE.theme = theme;
            UI.applyTheme(theme);
        },
        toggleTheme() {
            STATE.theme = STATE.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('packpal-theme', STATE.theme);
            UI.applyTheme(STATE.theme);
        },
        generateList() {
            Object.assign(STATE.tripDetails, {
                destination: DOM.destinationInput.value,
                duration: parseInt(DOM.durationInput.value),
                season: DOM.seasonSelect.value,
                activities: DOM.activitiesInput.value
            });
            if (!STATE.tripDetails.destination) return alert("Please enter a destination.");
            STATE.items = DATA.generate().map(item => ({ ...item, id: Date.now() + Math.random(), packed: false }));
            STATE.packedItems = [];
            UI.renderAllItems();
            UI.updateTravelInfo();
        },
        addCustomItem() {
            const name = DOM.itemNameInput.value.trim();
            const category = DOM.itemCategorySelect.value;
            const weight = parseFloat(DOM.itemWeightInput.value);
            const quantity = parseInt(DOM.itemQuantityInput.value);
            if (!name || !quantity) return;
            const newItem = { id: Date.now(), name, category, weight, quantity, packed: false };
            STATE.items.unshift(newItem);
            UI.renderAllItems();
            UI.toggleModal('addItemModal', false);
            DOM.itemNameInput.value = '';
            DOM.itemQuantityInput.value = '1';
        },
        handleItemAction(id, action) {
            const itemIndex = STATE.items.findIndex(i => i.id === id);
            if (itemIndex === -1) return;
            const [item] = STATE.items.splice(itemIndex, 1);
            if (action === 'pack') STATE.packedItems.push(item);
            UI.showUndo({ item, from: action });
            UI.renderAllItems();
        },
        updateItemQuantity(id, change) {
            const item = STATE.items.find(i => i.id === id);
            if (item) {
                item.quantity = Math.max(1, item.quantity + change);
                UI.renderAllItems();
            }
        },
        undoLastAction() {
            if (!STATE.lastAction) return;
            const { item, from } = STATE.lastAction;
            if (from === 'pack') {
                const packedIndex = STATE.packedItems.findIndex(i => i.id === item.id);
                if (packedIndex > -1) STATE.packedItems.splice(packedIndex, 1);
            }
            STATE.items.unshift(item);
            STATE.lastAction = null;
            DOM.undoNotification.classList.remove('show');
            UI.renderAllItems();
        },
        updateWeightAllowance() {
            const travelers = parseInt(DOM.travelersInput.value) || 1;
            const airline = DOM.airlineSelect.value;
            const travelClass = DOM.classSelect.value;
            const allowancePerPerson = DATA.airlineAllowances[airline]?.[travelClass] || DATA.airlineAllowances.default.economy;
            const totalAllowance = allowancePerPerson * travelers;
            DOM.maxWeight.textContent = totalAllowance.toFixed(1);
            UI.updateStatus();
        },
        exportAs(type) {
            const listText = STATE.packedItems.map(i => `- ${i.name} (x${i.quantity}) - ${ (i.weight * i.quantity).toFixed(1)}kg`).join('\n');
            const totalWeight = STATE.packedItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
            const fullText = `Packing List for ${STATE.tripDetails.destination}\nTotal Weight: ${totalWeight.toFixed(1)}kg\n\n${listText}`;
            if (type === 'text') {
                navigator.clipboard.writeText(fullText).then(() => alert('Copied to clipboard!'));
            } else if (type === 'image') {
                const listContainer = document.querySelector('.main-content .panel');
                html2canvas(listContainer).then(canvas => {
                    const link = document.createElement('a');
                    link.download = `PackPal-${STATE.tripDetails.destination}.png`;
                    link.href = canvas.toDataURL();
                    link.click();
                });
            }
        },
        async exportStyledPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const { destination, duration, season, activities } = STATE.tripDetails;
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(STATE.theme === 'dark' ? '#4895ef' : '#4361ee');
            doc.text("PackPal Packing List", 105, 20, { align: 'center' });
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(STATE.theme === 'dark' ? '#e0e0e0' : '#212529');
            doc.text(`Destination: ${destination}`, 20, 40);
            doc.text(`Duration: ${duration} days (${season})`, 20, 47);
            doc.text(`Activities: ${activities || 'General'}`, 20, 54);
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("Packed Items", 20, 70);
            doc.setLineWidth(0.5);
            doc.line(20, 72, 190, 72);
            let y = 80;
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            STATE.packedItems.forEach(item => {
                if (y > 270) { doc.addPage(); y = 20; }
                const category = STATE.categories.find(c => c.id === item.category)?.name || 'Other';
                doc.text(`- ${item.name} (x${item.quantity})`, 25, y);
                doc.text(`${(item.weight * item.quantity).toFixed(1)} kg`, 185, y, { align: 'right' });
                y += 8;
            });
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.setTextColor(150);
                doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
            }
            doc.save(`PackPal-${destination}.pdf`);
        },
        handleSwipe(e) {
            if (!STATE.swipeState.isDragging || !STATE.swipeState.target) return;
            const currentX = e.touches ? e.touches[0].clientX : e.clientX;
            const diffX = currentX - STATE.swipeState.startX;
            STATE.swipeState.target.style.transform = `translateX(${diffX}px) rotate(${diffX / 20}deg)`;
            if (diffX > 20) {
                STATE.swipeState.target.classList.add('swiping-right');
                STATE.swipeState.target.classList.remove('swiping-left');
            } else if (diffX < -20) {
                STATE.swipeState.target.classList.add('swiping-left');
                STATE.swipeState.target.classList.remove('swiping-right');
            } else {
                STATE.swipeState.target.classList.remove('swiping-right', 'swiping-left');
            }
        },
        endSwipe() {
            if (!STATE.swipeState.isDragging || !STATE.swipeState.target) return;
            const card = STATE.swipeState.target;
            const diffX = STATE.swipeState.currentX - STATE.swipeState.startX;
            const threshold = card.offsetWidth * 0.4;
            if (Math.abs(diffX) > threshold) {
                card.classList.add(diffX > 0 ? 'swipe-right' : 'swipe-left');
                setTimeout(() => {
                    const id = Number(card.dataset.id);
                    this.handleItemAction(id, diffX > 0 ? 'pack' : 'skip');
                }, 300);
            } else {
                card.style.transform = '';
            }
            card.classList.remove('dragging', 'swiping-left', 'swiping-right');
            STATE.swipeState.isDragging = false;
            STATE.swipeState.target = null;
        },
        setupEventListeners() {
            DOM.themeToggle.addEventListener('click', () => this.toggleTheme());
            DOM.mobileTheme.addEventListener('click', (e) => { e.preventDefault(); this.toggleTheme(); });
            DOM.generateBtn.addEventListener('click', () => this.generateList());
            
            // Dynamic weight allowance listeners
            [DOM.travelersInput, DOM.classSelect, DOM.airlineSelect].forEach(el => {
                el.addEventListener('change', () => this.updateWeightAllowance());
            });
            
            // Searchable Destination Logic
            DOM.destinationInput.addEventListener('input', () => {
                const searchTerm = DOM.destinationInput.value.toLowerCase();
                const results = Object.keys(DATA.countryData).filter(country => 
                    country.toLowerCase().includes(searchTerm) && country !== 'default'
                );
                
                DOM.destinationResults.innerHTML = '';
                if (results.length > 0 && searchTerm.length > 0) {
                    DOM.destinationResults.classList.remove('hidden');
                    results.forEach(country => {
                        const item = document.createElement('div');
                        item.className = 'autocomplete-item';
                        item.textContent = country;
                        item.addEventListener('click', () => {
                            DOM.destinationInput.value = country;
                            DOM.destinationResults.classList.add('hidden');
                        });
                        DOM.destinationResults.appendChild(item);
                    });
                } else {
                    DOM.destinationResults.classList.add('hidden');
                }
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.form-group')) {
                    DOM.destinationResults.classList.add('hidden');
                }
            });

            DOM.itemsContainer.addEventListener('pointerdown', e => {
                if (e.target.closest('.quantity-btn')) return; // Prevent swipe when clicking quantity
                const card = e.target.closest('.item-card');
                if (card) {
                    card.setPointerCapture(e.pointerId);
                    STATE.swipeState.isDragging = true;
                    STATE.swipeState.target = card;
                    STATE.swipeState.startX = e.clientX;
                    card.classList.add('dragging');
                }
            });
            document.addEventListener('pointermove', e => {
                if (STATE.swipeState.isDragging) {
                    STATE.swipeState.currentX = e.clientX;
                    this.handleSwipe(e);
                }
            });
            document.addEventListener('pointerup', () => this.endSwipe());
            document.addEventListener('pointercancel', () => this.endSwipe());

            DOM.itemsContainer.addEventListener('click', e => {
                const target = e.target;
                if (target.matches('.increase-qty')) {
                    this.updateItemQuantity(Number(target.dataset.id), 1);
                } else if (target.matches('.decrease-qty')) {
                    this.updateItemQuantity(Number(target.dataset.id), -1);
                }
            });

            DOM.addCustomItemBtn.addEventListener('click', () => UI.toggleModal('addItemModal', true));
            DOM.saveItemBtn.addEventListener('click', () => this.addCustomItem());
            DOM.shareBtn.addEventListener('click', () => UI.toggleModal('shareModal', true));
            DOM.mobileShare.addEventListener('click', (e) => { e.preventDefault(); UI.toggleModal('shareModal', true); });
            DOM.modalCloses.forEach(btn => btn.addEventListener('click', (e) => e.target.closest('.modal').classList.remove('active')));
            DOM.undoActionBtn.addEventListener('click', () => this.undoLastAction());
            DOM.exportPdfBtn.addEventListener('click', () => this.exportStyledPDF());
            DOM.exportTextBtn.addEventListener('click', () => this.exportAs('text'));
            DOM.exportImgBtn.addEventListener('click', () => this.exportAs('image'));
        }
    };

    // --- 6. INITIALIZE APP ---
    APP.init();
});

