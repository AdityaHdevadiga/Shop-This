// Application State
const appState = {
    currentPage: 'home',
    currentProduct: null,
    cart: [],
    products: [
        {
            id: 1,
            name: "Monaco GP Tee",
            price: 45,
            category: "tees",
            image: "/api/placeholder/300/400",
            description: "Premium cotton tee celebrating the iconic Monaco Grand Prix circuit"
        },
        {
            id: 2,
            name: "Silverstone Racing Tee",
            price: 42,
            category: "tees", 
            image: "/api/placeholder/300/400",
            description: "Vintage-inspired design honoring the home of British motorsport"
        },
        {
            id: 3,
            name: "McLaren Heritage Tee",
            price: 48,
            category: "tees",
            image: "/api/placeholder/300/400",
            description: "Papaya orange accents with classic McLaren racing heritage"
        },
        {
            id: 4,
            name: "Ferrari Tribute Tee",
            price: 50,
            category: "tees",
            image: "/api/placeholder/300/400",
            description: "Rosso Corsa inspired design celebrating the Prancing Horse legacy"
        },
        {
            id: 5,
            name: "Mercedes AMG Tee",
            price: 46,
            category: "tees",
            image: "/api/placeholder/300/400",
            description: "Silver Arrows themed design with modern AMG styling"
        },
        {
            id: 6,
            name: "Red Bull Racing Tee",
            price: 44,
            category: "tees",
            image: "/api/placeholder/300/400",
            description: "Championship-winning design with signature navy and red colors"
        },
        {
            id: 7,
            name: "Vintage F1 Logo Tee",
            price: 52,
            category: "tees",
            image: "/api/placeholder/300/400",
            description: "Classic Formula 1 branding with retro racing aesthetics"
        },
        {
            id: 8,
            name: "Championship Collection Tee",
            price: 55,
            category: "tees",
            image: "/api/placeholder/300/400",
            description: "Limited edition design celebrating F1 championship moments"
        }
    ],
    filteredProducts: [],
    searchQuery: '',
    otpTimer: 60,
    otpTimerInterval: null,
    userEmail: ''
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initializing...');
    
    // Initialize products
    appState.filteredProducts = [...appState.products];
    
    // Update cart display
    updateCartCount();
    
    // Show home page
    showHomePage();
    
    // Setup event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// Page Navigation Functions
function showPage(pageId) {
    console.log('Navigating to page:', pageId);
    
    try {
        // Hide all pages
        const allPages = document.querySelectorAll('.page');
        allPages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            appState.currentPage = pageId.replace('Page', '');
            console.log('Successfully navigated to:', pageId);
        } else {
            console.error('Page not found:', pageId);
        }
    } catch (error) {
        console.error('Error navigating to page:', error);
    }
}

function showHomePage() {
    console.log('Showing home page');
    showPage('homePage');
}

function showCategoryPage(category) {
    console.log('Showing category page:', category);
    showPage('categoryPage');
    
    // Render products after a brief delay to ensure page is visible
    setTimeout(() => {
        renderProducts();
    }, 50);
}

function showProductPage(productId) {
    console.log('Showing product page for ID:', productId);
    
    const product = appState.products.find(p => p.id === parseInt(productId));
    if (product) {
        appState.currentProduct = product;
        showPage('productPage');
        
        // Populate product details
        setTimeout(() => {
            const productImage = document.getElementById('productImage');
            const productName = document.getElementById('productName');
            const productPrice = document.getElementById('productPrice');
            const productDescription = document.getElementById('productDescription');
            const productBreadcrumb = document.getElementById('productBreadcrumb');
            
            if (productImage) productImage.src = product.image;
            if (productImage) productImage.alt = product.name;
            if (productName) productName.textContent = product.name;
            if (productPrice) productPrice.textContent = `$${product.price}`;
            if (productDescription) productDescription.textContent = product.description;
            if (productBreadcrumb) productBreadcrumb.textContent = product.name;
        }, 50);
    } else {
        console.error('Product not found:', productId);
    }
}

function showCartPage() {
    console.log('Showing cart page');
    showPage('cartPage');
    
    // Render cart after a brief delay
    setTimeout(() => {
        renderCart();
    }, 50);
}

function showAuthPage(type) {
    console.log('Showing auth page:', type);
    
    const pageMap = {
        'login': 'loginPage',
        'signup': 'signupPage',
        'forgot': 'forgotPage',
        'otp': 'otpPage',
        'reset': 'resetPage'
    };
    
    const pageId = pageMap[type];
    if (pageId) {
        showPage(pageId);
        
        // Special handling for OTP page
        if (type === 'otp') {
            setTimeout(() => {
                startOtpTimer();
            }, 100);
        }
    }
}

// Product Display Functions
function renderProducts() {
    console.log('Rendering products...');
    
    const productsGrid = document.getElementById('productsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!productsGrid || !emptyState) {
        console.error('Product grid elements not found');
        return;
    }
    
    if (appState.filteredProducts.length === 0) {
        productsGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    productsGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    productsGrid.innerHTML = appState.filteredProducts.map(product => `
        <div class="product-card" onclick="showProductPage(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" />
            </div>
            <div class="product-card-info">
                <h3>${product.name}</h3>
                <p class="product-card-price">$${product.price}</p>
            </div>
        </div>
    `).join('');
    
    console.log('Products rendered:', appState.filteredProducts.length);
}

function handleSearch(event) {
    console.log('Search triggered:', event.target.value);
    
    appState.searchQuery = event.target.value.toLowerCase();
    
    appState.filteredProducts = appState.products.filter(product => 
        product.name.toLowerCase().includes(appState.searchQuery) ||
        product.description.toLowerCase().includes(appState.searchQuery)
    );
    
    renderProducts();
}

// Cart Management Functions
function addToCart() {
    console.log('Adding to cart:', appState.currentProduct);
    
    if (!appState.currentProduct) {
        console.error('No current product to add to cart');
        return;
    }
    
    const existingItem = appState.cart.find(item => item.id === appState.currentProduct.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        appState.cart.push({
            ...appState.currentProduct,
            quantity: 1
        });
    }
    
    updateCartCount();
    
    // Visual feedback
    const button = document.querySelector('.btn--primary');
    if (button) {
        const originalText = button.textContent;
        const originalColor = button.style.backgroundColor;
        
        button.textContent = 'Added!';
        button.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = originalColor;
        }, 1500);
    }
}

function updateCartQuantity(productId, change) {
    console.log('Updating cart quantity:', productId, change);
    
    const item = appState.cart.find(item => item.id === parseInt(productId));
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            appState.cart = appState.cart.filter(item => item.id !== parseInt(productId));
        }
        
        updateCartCount();
        renderCart();
    }
}

function updateCartCount() {
    const count = appState.cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    
    if (cartCountElement) {
        cartCountElement.textContent = count;
        cartCountElement.style.display = count > 0 ? 'flex' : 'none';
    }
}

function renderCart() {
    console.log('Rendering cart...');
    
    const cartContent = document.getElementById('cartContent');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');
    const cartSubtotal = document.getElementById('cartSubtotal');
    
    if (!cartContent || !cartEmpty || !cartFooter) {
        console.error('Cart elements not found');
        return;
    }
    
    if (appState.cart.length === 0) {
        cartContent.style.display = 'none';
        cartFooter.style.display = 'none';
        cartEmpty.style.display = 'block';
        return;
    }
    
    cartContent.style.display = 'block';
    cartFooter.style.display = 'block';
    cartEmpty.style.display = 'none';
    
    // Render cart items
    cartContent.innerHTML = appState.cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" />
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');
    
    // Calculate and display subtotal
    const subtotal = appState.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    if (cartSubtotal) {
        cartSubtotal.textContent = subtotal.toFixed(2);
    }
    
    console.log('Cart rendered with', appState.cart.length, 'items');
}

// Authentication Functions
function handleLogin(event) {
    event.preventDefault();
    console.log('Handling login...');
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (submitBtn) {
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;
    }
    
    setTimeout(() => {
        if (submitBtn) {
            submitBtn.textContent = 'Sign In';
            submitBtn.disabled = false;
        }
        alert('Login successful! (Demo mode)');
        showHomePage();
    }, 1000);
}

function handleSignup(event) {
    event.preventDefault();
    console.log('Handling signup...');
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    const signupBtn = document.getElementById('signupBtn');
    const successMsg = document.getElementById('signupSuccess');
    const errorMsg = document.getElementById('signupError');
    
    // Reset messages
    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';
    
    if (signupBtn) {
        signupBtn.textContent = 'Creating Account...';
        signupBtn.disabled = true;
    }
    
    // Simulate API call
    setTimeout(() => {
        try {
            // Simulate Google Sheets integration
            console.log('User data would be sent to Google Sheets:', { name, email, timestamp: new Date().toISOString() });
            
            if (successMsg) {
                successMsg.style.display = 'block';
                setTimeout(() => {
                    showAuthPage('login');
                }, 2000);
            }
            
        } catch (error) {
            console.error('Signup error:', error);
            if (errorMsg) errorMsg.style.display = 'block';
        } finally {
            if (signupBtn) {
                signupBtn.textContent = 'Create Account';
                signupBtn.disabled = false;
            }
        }
    }, 1500);
}

function handleForgotPassword(event) {
    event.preventDefault();
    console.log('Handling forgot password...');
    
    const emailInput = document.getElementById('forgotEmail');
    if (emailInput) {
        appState.userEmail = emailInput.value;
    }
    
    setTimeout(() => {
        alert(`OTP sent to ${appState.userEmail} (Demo: use code 123456)`);
        showAuthPage('otp');
    }, 1000);
}

function handleOtpVerification(event) {
    event.preventDefault();
    console.log('Handling OTP verification...');
    
    const otpCodeInput = document.getElementById('otpCode');
    const otpCode = otpCodeInput ? otpCodeInput.value : '';
    
    if (otpCode === '123456' || otpCode.length === 6) {
        alert('OTP verified successfully!');
        showAuthPage('reset');
    } else {
        alert('Invalid OTP. Please try again. (Demo: use 123456)');
    }
}

function handlePasswordReset(event) {
    event.preventDefault();
    console.log('Handling password reset...');
    
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    const newPassword = newPasswordInput ? newPasswordInput.value : '';
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';
    
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }
    
    setTimeout(() => {
        alert('Password reset successful!');
        showAuthPage('login');
    }, 1000);
}

function startOtpTimer() {
    console.log('Starting OTP timer...');
    
    appState.otpTimer = 60;
    const timerElement = document.getElementById('timer');
    const resendBtn = document.getElementById('resendBtn');
    
    if (appState.otpTimerInterval) {
        clearInterval(appState.otpTimerInterval);
    }
    
    if (resendBtn) {
        resendBtn.style.opacity = '0.5';
        resendBtn.style.pointerEvents = 'none';
    }
    
    appState.otpTimerInterval = setInterval(() => {
        appState.otpTimer--;
        if (timerElement) {
            timerElement.textContent = appState.otpTimer;
        }
        
        if (appState.otpTimer <= 0) {
            clearInterval(appState.otpTimerInterval);
            if (resendBtn) {
                resendBtn.style.opacity = '1';
                resendBtn.style.pointerEvents = 'auto';
                resendBtn.innerHTML = 'Resend OTP';
            }
        }
    }, 1000);
}

function resendOTP() {
    console.log('Resending OTP...');
    
    if (appState.otpTimer > 0) return;
    
    alert(`New OTP sent to ${appState.userEmail} (Demo: use code 123456)`);
    startOtpTimer();
}

// Global error handler
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
});

// Debug function to check app state
function debugAppState() {
    console.log('Current app state:', appState);
    console.log('Current page elements:', {
        homePage: document.getElementById('homePage'),
        categoryPage: document.getElementById('categoryPage'),
        productPage: document.getElementById('productPage'),
        cartPage: document.getElementById('cartPage'),
        loginPage: document.getElementById('loginPage')
    });
}