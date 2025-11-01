// Cart data structure
let cart = [];

// Menu items data structure (dynamic menu)
let menuItems = [];

// Daily income tracking
let dailyIncome = 0;
let currentDay = new Date().toDateString();
let dishToRemove = null;
let adminMode = false;

// Initialize menu items from localStorage or default items
function initializeMenuItems() {
    const savedMenu = localStorage.getItem('hotelMenuItems');
    const savedDay = localStorage.getItem('incomeDate');
    
    // Check if it's a new day
    if (savedDay !== currentDay) {
        localStorage.removeItem('dailyIncome');
        dailyIncome = 0;
    } else {
        const savedIncome = localStorage.getItem('dailyIncome');
        dailyIncome = savedIncome ? parseFloat(savedIncome) : 0;
    }
    
    if (savedMenu) {
        menuItems = JSON.parse(savedMenu);
        renderMenu();
    } else {
        // Default menu items
        menuItems = [
            { id: 'idly', name: 'Idly', price: 30, description: 'Soft steamed rice cakes', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop' },
            { id: 'dosa', name: 'Dosa', price: 50, description: 'Crispy fermented crepe', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop' },
            { id: 'vada', name: 'Vada', price: 25, description: 'Savory fried doughnut', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop' },
            { id: 'pongal', name: 'Pongal', price: 40, description: 'Rice and lentil porridge', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop' },
            { id: 'biryani', name: 'Biryani', price: 180, description: 'Fragrant spiced rice', image: 'https://images.unsplash.com/photo-1563379091339-03246963d29c?w=300&h=200&fit=crop' },
            { id: 'curry', name: 'Vegetable Curry', price: 150, description: 'Spicy mixed vegetables', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=300&h=200&fit=crop' },
            { id: 'naan', name: 'Naan Bread', price: 35, description: 'Soft leavened flatbread', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop' },
            { id: 'rice', name: 'Fried Rice', price: 80, description: 'Spiced fried rice', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop' },
            { id: 'coffee', name: 'Hot Coffee', price: 40, description: 'Freshly brewed coffee', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=300&h=200&fit=crop' },
            { id: 'tea', name: 'Tea', price: 20, description: 'Traditional masala chai', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop' },
            { id: 'juice', name: 'Fresh Juice', price: 60, description: 'Seasonal fresh juice', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=200&fit=crop' },
            { id: 'soda', name: 'Soft Drink', price: 30, description: 'Cold beverage', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=200&fit=crop' },
            { id: 'samosa', name: 'Samosa', price: 25, description: 'Fried pastry with filling', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop' },
            { id: 'pakora', name: 'Pakora', price: 45, description: 'Deep-fried fritters', image: 'https://images.unsplash.com/photo-1610057099433-d73e75048b2f?w=300&h=200&fit=crop' },
            { id: 'icecream', name: 'Ice Cream', price: 50, description: 'Creamy frozen dessert', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop' },
            { id: 'gulabjamun', name: 'Gulab Jamun', price: 35, description: 'Sweet milk dumplings', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop' }
        ];
        saveMenuItems();
        renderMenu();
    }
    
    // Update item images mapping
    menuItems.forEach(item => {
        itemImages[item.id] = item.image;
    });
    
    updateDailyIncomeDisplay();
}

// Render menu items dynamically
function renderMenu() {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid) return;
    
    menuGrid.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.className = 'menu-item';
        menuItemDiv.setAttribute('data-item', item.id);
        menuItemDiv.setAttribute('data-price', item.price);
        
        const removeBtn = adminMode ? `<button class="remove-dish-btn" onclick="removeDish('${item.id}')" title="Remove dish">🗑️</button>` : '';
        
        menuItemDiv.innerHTML = `
            ${removeBtn}
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x200?text=${item.name}'">
            </div>
            <div class="item-info">
                <h3>${item.name}</h3>
                <p class="item-description">${item.description}</p>
                <p class="item-price">₹${item.price}</p>
                <button class="add-to-cart-btn" onclick="addToCart('${item.id}', '${item.name}', ${item.price})">Add to Cart</button>
            </div>
        `;
        
        menuGrid.appendChild(menuItemDiv);
    });
}

// Save menu items to localStorage
function saveMenuItems() {
    localStorage.setItem('hotelMenuItems', JSON.stringify(menuItems));
}

// Toggle admin panel
function toggleAdminPanel() {
    adminMode = !adminMode;
    const adminPanel = document.getElementById('admin-panel');
    const adminBtn = document.querySelector('.admin-toggle-btn');
    
    if (adminMode) {
        adminPanel.style.display = 'block';
        adminBtn.textContent = '❌ Close Admin';
        adminBtn.style.background = '#dc3545';
    } else {
        adminPanel.style.display = 'none';
        adminBtn.textContent = '⚙️ Manage Menu';
        adminBtn.style.background = '';
    }
    
    renderMenu(); // Re-render to show/hide remove buttons
}

// Add new dish
function addNewDish() {
    const name = document.getElementById('new-dish-name').value.trim();
    const price = parseFloat(document.getElementById('new-dish-price').value);
    const description = document.getElementById('new-dish-description').value.trim();
    const image = document.getElementById('new-dish-image').value.trim() || 'https://via.placeholder.com/300x200?text=' + name;
    
    if (!name || !price || price <= 0) {
        alert('Please fill in dish name and valid price!');
        return;
    }
    
    const dishId = name.toLowerCase().replace(/\s+/g, '-');
    
    // Check if dish already exists
    if (menuItems.find(item => item.id === dishId)) {
        alert('This dish already exists in the menu!');
        return;
    }
    
    const newDish = {
        id: dishId,
        name: name,
        price: price,
        description: description || 'Delicious dish',
        image: image
    };
    
    menuItems.push(newDish);
    itemImages[dishId] = image;
    saveMenuItems();
    renderMenu();
    
    // Clear form
    document.getElementById('new-dish-name').value = '';
    document.getElementById('new-dish-price').value = '';
    document.getElementById('new-dish-description').value = '';
    document.getElementById('new-dish-image').value = '';
    
    showNotification(`${name} added to menu!`);
}

// Remove dish
function removeDish(dishId) {
    const dish = menuItems.find(item => item.id === dishId);
    if (!dish) return;
    
    dishToRemove = dishId;
    document.getElementById('remove-dish-name').textContent = dish.name;
    document.getElementById('admin-remove-modal').style.display = 'block';
}

function confirmRemoveDish() {
    if (dishToRemove) {
        menuItems = menuItems.filter(item => item.id !== dishToRemove);
        delete itemImages[dishToRemove];
        saveMenuItems();
        renderMenu();
        showNotification('Dish removed from menu!');
    }
    closeAdminRemoveModal();
}

function closeAdminRemoveModal() {
    document.getElementById('admin-remove-modal').style.display = 'none';
    dishToRemove = null;
}

// Daily income functions
function updateDailyIncome(amount) {
    const today = new Date().toDateString();
    
    if (today !== currentDay) {
        // New day - reset income
        dailyIncome = 0;
        currentDay = today;
        localStorage.setItem('incomeDate', currentDay);
    }
    
    dailyIncome += amount;
    localStorage.setItem('dailyIncome', dailyIncome.toString());
    localStorage.setItem('incomeDate', currentDay);
    updateDailyIncomeDisplay();
}

function updateDailyIncomeDisplay() {
    const incomeElement = document.getElementById('daily-income');
    if (incomeElement) {
        incomeElement.textContent = `₹${dailyIncome.toFixed(2)}`;
    }
}

function resetDailyIncome() {
    if (confirm('Are you sure you want to reset today\'s income? This cannot be undone.')) {
        dailyIncome = 0;
        localStorage.setItem('dailyIncome', '0');
        updateDailyIncomeDisplay();
        showNotification('Daily income reset!');
    }
}

// Item images mapping (using placeholder images, replace with actual image paths if needed)
const itemImages = {
    'idly': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
    'dosa': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop',
    'vada': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop',
    'pongal': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop',
    'biryani': 'https://images.unsplash.com/photo-1563379091339-03246963d29c?w=300&h=200&fit=crop',
    'curry': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=300&h=200&fit=crop',
    'naan': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop',
    'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
    'coffee': 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=300&h=200&fit=crop',
    'tea': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop',
    'juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=200&fit=crop',
    'soda': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=200&fit=crop',
    'samosa': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop',
    'pakora': 'https://images.unsplash.com/photo-1610057099433-d73e75048b2f?w=300&h=200&fit=crop',
    'icecream': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop',
    'gulabjamun': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop'
};

// Add item to cart
function addToCart(itemId, itemName, price) {
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: itemId,
            name: itemName,
            price: price,
            quantity: 1,
            image: itemImages[itemId] || 'https://via.placeholder.com/300x200'
        });
    }
    
    updateCartDisplay();
    showNotification(`${itemName} added to cart!`);
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
}

// Update quantity of item in cart
function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartDisplay();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    
    // Clear previous content
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        checkoutBtn.disabled = true;
        clearCartBtn.style.display = 'none';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60?text=${item.name}'">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price} each</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        checkoutBtn.disabled = false;
        clearCartBtn.style.display = 'block';
    }
    
    updateBillSummary();
}

// Update bill summary
function updateBillSummary() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        updateCartDisplay();
        showNotification('Cart cleared!');
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const modal = document.getElementById('checkout-modal');
    const billDetails = document.getElementById('bill-details');
    const billTotal = document.getElementById('bill-total');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Generate bill details
    let billHTML = '';
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        billHTML += `
            <div class="bill-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>₹${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    billHTML += `
        <div class="bill-item" style="border-top: 2px solid #dee2e6; margin-top: 10px; padding-top: 10px;">
            <span>Total:</span>
            <span>₹${total.toFixed(2)}</span>
        </div>
    `;
    
    billDetails.innerHTML = billHTML;
    billTotal.textContent = `₹${total.toFixed(2)}`;
    
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('checkout-modal').style.display = 'none';
}

// Print bill
function printBill() {
    const printWindow = window.open('', '_blank');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let printContent = `
        <html>
        <head>
            <title>Bill - Hotel Billing System</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #667eea; text-align: center; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #667eea; color: white; }
                .total { font-size: 1.2em; font-weight: bold; margin-top: 20px; text-align: right; }
            </style>
        </head>
        <body>
            <h1>Hotel Billing System</h1>
            <h2>Bill Receipt</h2>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        printContent += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>₹${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });
    
    printContent += `
                </tbody>
            </table>
            <div class="total">
                <p style="font-size: 1.5em; color: #667eea;">Total: ₹${total.toFixed(2)}</p>
            </div>
            <p style="text-align: center; margin-top: 30px;">Thank you for your visit!</p>
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Payment functionality
let selectedPaymentMethod = null;

function showPaymentModal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('payment-total').textContent = `₹${total.toFixed(2)}`;
    document.getElementById('payment-modal').style.display = 'block';
    closeModal();
}

function closePaymentModal() {
    document.getElementById('payment-modal').style.display = 'none';
    selectedPaymentMethod = null;
    document.getElementById('payment-details').style.display = 'none';
    closeQRScanner(); // Close QR scanner if open
}

// QR Code and Scanner functionality
let qrStream = null;
let qrScanInterval = null;

function generateUPIUrl(upiId, amount) {
    // Format: upi://pay?pa=<UPI_ID>&am=<Amount>&cu=INR&tn=<Transaction Note>
    const transactionNote = 'Hotel Payment';
    return `upi://pay?pa=${encodeURIComponent(upiId)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${generateTransactionId()}`;
}

function generateUPIQRCode(upiUrl) {
    const qrContainer = document.getElementById('upi-qr-code');
    if (!qrContainer) return;
    
    qrContainer.innerHTML = ''; // Clear previous QR
    
    // Try using QRCode library
    if (typeof QRCode !== 'undefined') {
        try {
            new QRCode(qrContainer, {
                text: upiUrl,
                width: 250,
                height: 250,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            return;
        } catch (e) {
            console.log('QRCode library error, using fallback');
        }
    }
    
    // Fallback: Show QR code using API service or display URL
    qrContainer.innerHTML = `
        <div style="padding: 20px; border: 2px dashed #667eea; border-radius: 8px;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}" 
                     alt="UPI QR Code" 
                     style="width: 200px; height: 200px; display: block; margin: 0 auto;">
            </div>
            <p style="margin-bottom: 10px; font-weight: 600;">UPI Payment Details:</p>
            <p style="word-break: break-all; font-size: 0.85rem; color: #666; background: white; padding: 10px; border-radius: 5px;">${upiUrl}</p>
            <p style="margin-top: 15px; color: #667eea; font-size: 0.9rem;">Scan this QR code with any UPI app</p>
        </div>
    `;
}

function switchUPITab(tabName, button) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.upi-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.upi-tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab
    if (button) {
        button.classList.add('active');
    }
    
    // Show corresponding content
    const contentId = `upi-${tabName}`;
    const content = document.getElementById(contentId);
    if (content) {
        content.classList.add('active');
    }
    
    // If switching to generate tab, regenerate QR code
    if (tabName === 'generate') {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const upiPaymentId = 'hotel@upi';
        const upiPaymentUrl = generateUPIUrl(upiPaymentId, total);
        setTimeout(() => generateUPIQRCode(upiPaymentUrl), 100);
    }
}

function startQRScanner() {
    const scannerModal = document.getElementById('qr-scanner-modal');
    scannerModal.style.display = 'block';
    
    const video = document.getElementById('qr-video');
    const canvas = document.getElementById('qr-canvas');
    const context = canvas.getContext('2d');
    const statusDiv = document.getElementById('qr-status');
    
    navigator.mediaDevices.getUserMedia({ 
        video: { 
            facingMode: 'environment' // Use back camera on mobile
        } 
    }).then(stream => {
        qrStream = stream;
        video.srcObject = stream;
        video.setAttribute('playsinline', true);
        
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        };
        
        // Start scanning
        qrScanInterval = setInterval(() => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                
                if (code) {
                    statusDiv.textContent = 'QR Code detected!';
                    statusDiv.style.color = '#28a745';
                    
                    // Process the scanned QR code
                    processScannedQR(code.data);
                    
                    // Stop scanning
                    stopQRScanner();
                } else {
                    statusDiv.textContent = 'Scanning...';
                    statusDiv.style.color = '#667eea';
                }
            }
        }, 100);
        
    }).catch(err => {
        console.error('Error accessing camera:', err);
        statusDiv.textContent = 'Camera access denied. Please allow camera permissions.';
        statusDiv.style.color = '#dc3545';
        alert('Camera access is required for QR scanning. Please allow camera permissions and try again.');
    });
}

function processScannedQR(qrData) {
    // Check if it's a UPI payment QR
    if (qrData.startsWith('upi://') || qrData.includes('@')) {
        let upiId = '';
        
        if (qrData.startsWith('upi://')) {
            // Extract UPI ID from UPI URL
            const match = qrData.match(/pa=([^&]+)/);
            if (match) {
                upiId = decodeURIComponent(match[1]);
            }
        } else {
            upiId = qrData;
        }
        
        if (upiId) {
            // Update manual entry field if visible
            const upiInput = document.getElementById('upi-id');
            if (upiInput) {
                upiInput.value = upiId;
            }
            
            // Show scanned info
            const scannedInfo = document.getElementById('scanned-upi-info');
            const scannedId = document.getElementById('scanned-upi-id');
            if (scannedInfo && scannedId) {
                scannedId.textContent = upiId;
                scannedInfo.style.display = 'block';
            }
            
            showNotification('UPI ID scanned successfully!');
        }
    } else {
        alert('Invalid QR code. Please scan a valid UPI payment QR code.');
    }
}

function closeQRScanner() {
    stopQRScanner();
    document.getElementById('qr-scanner-modal').style.display = 'none';
}

function stopQRScanner() {
    if (qrScanInterval) {
        clearInterval(qrScanInterval);
        qrScanInterval = null;
    }
    
    if (qrStream) {
        qrStream.getTracks().forEach(track => track.stop());
        qrStream = null;
    }
    
    const video = document.getElementById('qr-video');
    if (video && video.srcObject) {
        video.srcObject = null;
    }
    
    document.getElementById('qr-status').textContent = '';
}

function selectPaymentMethod(method, button) {
    selectedPaymentMethod = method;
    const paymentForm = document.getElementById('payment-form');
    const paymentDetails = document.getElementById('payment-details');
    
    // Remove active class from all buttons
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected button
    if (button) {
        button.classList.add('active');
    }
    
    // Show payment form based on method
    paymentDetails.style.display = 'block';
    
    if (method === 'cash') {
        paymentForm.innerHTML = `
            <div class="payment-input-group">
                <label>Amount Received:</label>
                <input type="number" id="cash-received" placeholder="Enter amount" min="0" step="0.01">
                <p id="cash-change" class="change-display"></p>
            </div>
        `;
        document.getElementById('cash-received').addEventListener('input', calculateChange);
    } else if (method === 'card') {
        paymentForm.innerHTML = `
            <div class="payment-input-group">
                <label>Card Number:</label>
                <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19" oninput="formatCardNumber(this)">
            </div>
            <div class="payment-input-group">
                <label>Expiry Date:</label>
                <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5" oninput="formatExpiry(this)">
            </div>
            <div class="payment-input-group">
                <label>CVV:</label>
                <input type="text" id="card-cvv" placeholder="123" maxlength="3" pattern="[0-9]*" inputmode="numeric">
            </div>
            <div class="payment-input-group">
                <label>Cardholder Name:</label>
                <input type="text" id="card-name" placeholder="John Doe">
            </div>
        `;
    } else if (method === 'upi') {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const upiPaymentId = 'hotel@upi'; // This would be your actual UPI ID
        const upiPaymentUrl = generateUPIUrl(upiPaymentId, total);
        
        paymentForm.innerHTML = `
            <div class="upi-options">
                <div class="upi-option-tabs">
                    <button class="upi-tab-btn active" onclick="switchUPITab('generate', this)">Generate QR</button>
                    <button class="upi-tab-btn" onclick="switchUPITab('scan', this)">Scan QR</button>
                    <button class="upi-tab-btn" onclick="switchUPITab('manual', this)">Manual Entry</button>
                </div>
                
                <div id="upi-generate" class="upi-tab-content active">
                    <div class="qr-code-container">
                        <div id="upi-qr-code"></div>
                        <p class="payment-note">Scan this QR code with any UPI app to pay</p>
                        <div class="upi-details">
                            <p><strong>UPI ID:</strong> ${upiPaymentId}</p>
                            <p><strong>Amount:</strong> ₹${total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                
                <div id="upi-scan" class="upi-tab-content">
                    <div class="qr-scan-container">
                        <button class="start-scan-btn" onclick="startQRScanner()">
                            <span class="scan-icon">📷</span>
                            Start QR Scanner
                        </button>
                        <p class="payment-note">Click to scan customer's payment QR code</p>
                        <div id="scanned-upi-info" style="display: none; margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                            <p><strong>Scanned UPI:</strong> <span id="scanned-upi-id"></span></p>
                        </div>
                    </div>
                </div>
                
                <div id="upi-manual" class="upi-tab-content">
                    <div class="payment-input-group">
                        <label>Enter UPI ID:</label>
                        <input type="text" id="upi-id" placeholder="yourname@upi">
                    </div>
                    <p class="payment-note">Enter customer's UPI ID to process payment</p>
                </div>
            </div>
        `;
        
        // Generate QR code
        setTimeout(() => {
            generateUPIQRCode(upiPaymentUrl);
        }, 100);
    } else if (method === 'wallet') {
        paymentForm.innerHTML = `
            <div class="payment-input-group">
                <label>Select Wallet:</label>
                <select id="wallet-type">
                    <option value="paytm">Paytm</option>
                    <option value="phonepe">PhonePe</option>
                    <option value="gpay">Google Pay</option>
                    <option value="amazonpay">Amazon Pay</option>
                </select>
            </div>
            <div class="payment-input-group">
                <label>Mobile Number:</label>
                <input type="text" id="wallet-mobile" placeholder="Enter mobile number" maxlength="10">
            </div>
        `;
    }
}

function calculateChange() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const received = parseFloat(document.getElementById('cash-received').value) || 0;
    const change = received - total;
    const changeDisplay = document.getElementById('cash-change');
    
    if (received > 0) {
        if (change >= 0) {
            changeDisplay.textContent = `Change: ₹${change.toFixed(2)}`;
            changeDisplay.style.color = '#28a745';
        } else {
            changeDisplay.textContent = `Insufficient: ₹${Math.abs(change).toFixed(2)}`;
            changeDisplay.style.color = '#dc3545';
        }
    } else {
        changeDisplay.textContent = '';
    }
}

function processPayment() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (!selectedPaymentMethod) {
        alert('Please select a payment method');
        return;
    }
    
    if (selectedPaymentMethod === 'cash') {
        const received = parseFloat(document.getElementById('cash-received').value) || 0;
        if (received < total) {
            alert('Insufficient amount received!');
            return;
        }
    } else if (selectedPaymentMethod === 'card') {
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvv = document.getElementById('card-cvv').value;
        const cardName = document.getElementById('card-name').value;
        
        if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
            alert('Please fill all card details');
            return;
        }
    } else if (selectedPaymentMethod === 'upi') {
        // Check which UPI tab is active
        const activeTab = document.querySelector('.upi-tab-content.active').id;
        let upiId = '';
        
        if (activeTab === 'upi-manual') {
            upiId = document.getElementById('upi-id')?.value || '';
            if (!upiId || !upiId.includes('@')) {
                alert('Please enter a valid UPI ID');
                return;
            }
        } else if (activeTab === 'upi-scan') {
            upiId = document.getElementById('scanned-upi-id')?.textContent || '';
            if (!upiId) {
                alert('Please scan a QR code first');
                return;
            }
        } else if (activeTab === 'upi-generate') {
            // For QR generation, payment is initiated by customer scanning
            // We can proceed as payment is confirmed when customer scans
            upiId = 'hotel@upi'; // Merchant UPI ID
        }
    } else if (selectedPaymentMethod === 'wallet') {
        const mobile = document.getElementById('wallet-mobile').value;
        if (!mobile || mobile.length !== 10) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }
    }
    
    // Simulate payment processing
    showNotification('Processing payment...');
    
    setTimeout(() => {
        closePaymentModal();
        showPaymentSuccess();
    }, 1500);
}

function showPaymentSuccess() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update daily income
    updateDailyIncome(total);
    
    const successModal = document.createElement('div');
    successModal.className = 'modal';
    successModal.style.display = 'block';
    successModal.innerHTML = `
        <div class="modal-content">
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 4rem; margin-bottom: 20px;">✅</div>
                <h2 style="color: #28a745; margin-bottom: 15px;">Payment Successful!</h2>
                <p style="font-size: 1.2rem; margin-bottom: 10px;">Amount Paid: <strong>₹${total.toFixed(2)}</strong></p>
                <p style="color: #666; margin-bottom: 20px;">Payment Method: ${selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1)}</p>
                <p style="color: #666; margin-bottom: 30px;">Transaction ID: ${generateTransactionId()}</p>
                <button class="new-order-btn" onclick="newOrder(); this.closest('.modal').remove();" style="width: 100%;">New Order</button>
            </div>
        </div>
    `;
    document.body.appendChild(successModal);
    
    // Close on click outside
    successModal.onclick = function(event) {
        if (event.target === successModal) {
            successModal.remove();
            newOrder();
        }
    };
}

function generateTransactionId() {
    return 'TXN' + Date.now().toString().slice(-10);
}

// Format card number with spaces
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    input.value = formattedValue;
}

// Format expiry date as MM/YY
function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    input.value = value;
}

// New order
function newOrder() {
    cart = [];
    updateCartDisplay();
    closeModal();
    closePaymentModal();
    showNotification('New order started!');
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const checkoutModal = document.getElementById('checkout-modal');
    const paymentModal = document.getElementById('payment-modal');
    
    if (event.target === checkoutModal) {
        closeModal();
    }
    if (event.target === paymentModal) {
        closePaymentModal();
    }
}

// Initialize app
initializeMenuItems();
updateCartDisplay();

// Check for new day on load
window.addEventListener('load', function() {
    const savedDay = localStorage.getItem('incomeDate');
    if (savedDay !== currentDay) {
        localStorage.removeItem('dailyIncome');
        dailyIncome = 0;
        updateDailyIncomeDisplay();
    }
});


