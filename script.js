
const products = [
    {
        id: 1,
        name: "Классикалык жайнамаз",
        description: "Күнүмдүк колдонууга",
        price: 450,
        image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600"
    },
    {
        id: 2,
        name: "Премиум жайнамаз",
        description: "Кооз жасалга менен",
        price: 750,
        image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600"
    },
    {
        id: 3,
        name: "Жумшак жайнамаз",
        description: "Ыңгайлуу жана сапаттуу",
        price: 900,
        image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600"
    },
    {
        id: 4,
        name: "Жашыл жайнамаз",
        description: "Классикалык үлгү",
        price: 600,
        image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600"
    },
    {
        id: 5,
        name: "Саякат жайнамазы",
        description: "Алып жүрүүгө ыңгайлуу",
        price: 550,
        image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600"
    },
    {
        id: 6,
        name: "Белек жайнамазы",
        description: "Белек үчүн",
        price: 1100,
        image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600"
    }
];

let cart = [];

try {
    const saved = JSON.parse(localStorage.getItem("nurShopCart"));
    if (Array.isArray(saved)) cart = saved;
} catch (error) {
    cart = [];
}

const $ = id => document.getElementById(id);

function money(value) {
    return value.toLocaleString("ky-KG") + " сом";
}

function saveCart() {
    localStorage.setItem("nurShopCart", JSON.stringify(cart));
}

function showProducts() {
    $("productList").innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}"
                onerror="this.src='https://placehold.co/600x400?text=NUR+SHOP'">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">${money(product.price)}</div>
                <button class="add-button" data-id="${product.id}">
                    🛒 Себетке кошуу
                </button>
            </div>
        </div>
    `).join("");
}

function addToCart(id) {
    const item = cart.find(p => p.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ id, quantity: 1 });
    }

    saveCart();
    updateCart();
    alert("Товар себетке кошулду!");
}

function updateCart() {
    $("cartCount").textContent = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    let total = 0;

    $("cartItems").innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return "";

        total += product.price * item.quantity;

        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${product.name}</strong>
                    <p>${money(product.price * item.quantity)}</p>
                </div>
                <div class="quantity-controls">
                    <button data-action="minus" data-id="${item.id}">−</button>
                    ${item.quantity}
                    <button data-action="plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-button"
                    data-action="remove" data-id="${item.id}">✕</button>
            </div>
        `;
    }).join("") || "<p>Себет бош.</p>";

    $("cartTotal").textContent = "Жалпы: " + money(total);
    $("checkoutButton").disabled = cart.length === 0;
}

function getTotal() {
    return cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);
}

// Товар кошуу
$("productList").addEventListener("click", event => {
    const button = event.target.closest(".add-button");
    if (button) addToCart(Number(button.dataset.id));
});

// Себеттеги аракеттер
$("cartItems").addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    const item = cart.find(p => p.id === id);

    if (!item) return;

    if (action === "plus") item.quantity++;
    if (action === "minus") item.quantity--;
    if (action === "remove" || item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }

    saveCart();
    updateCart();
});

// Себетти ачуу жана жабуу
$("openCart").addEventListener("click", () => {
    $("cartOverlay").classList.add("active");
});

$("closeCart").addEventListener("click", () => {
    $("cartOverlay").classList.remove("active");
});

$("closeOrder").addEventListener("click", () => {
    $("orderOverlay").classList.remove("active");
});

// Облусту тандоо
document.querySelectorAll(".region-button").forEach(button => {
    button.addEventListener("click", () => {
        const region = button.dataset.region;

        document.querySelectorAll(".region-button").forEach(item => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        $("selectedRegion").textContent =
            "Сиз тандадыңыз: " + region;

        $("customerRegion").value = region;

        $("orderOverlay").classList.add("active");
    });
});

// Буйрутма формасын ачуу
$("checkoutButton").addEventListener("click", () => {
    if (cart.length === 0) return;

    $("cartOverlay").classList.remove("active");
    $("orderOverlay").classList.add("active");
});

// Сыртын басып жабуу
["cartOverlay", "orderOverlay"].forEach(id => {
    $(id).addEventListener("click", event => {
        if (event.target === $(id)) {
            $(id).classList.remove("active");
        }
    });
});

// HTML коопсуздугу
function safe(text) {
    return String(text).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// Буйрутманы ырастоо
$("orderForm").addEventListener("submit", event => {
    event.preventDefault();

    if (!cart.length) {
        alert("Себетиңиз бош!");
        return;
    }

    const name = $("customerName").value.trim();
    const phone = $("customerPhone").value.trim();
    const region = $("customerRegion").value;
    const city = $("customerCity").value.trim();
    const address = $("customerAddress").value.trim();
    const note = $("customerNote").value.trim();

    if (!name || !phone || !region || !city || !address) {
        alert("Бардык маалыматтарды толтуруңуз!");
        return;
    }

    const items = cart.map(item => {
        const p = products.find(product => product.id === item.id);
        return `<p>${safe(p.name)} × ${item.quantity} — ${
            money(p.price * item.quantity)
        }</p>`;
    }).join("");

    const orderId = "NUR-" + Date.now().toString().slice(-7);
    const total = getTotal();

    $("orderResult").innerHTML = `
        <h3>✅ Буйрутма даярдалды!</h3>
        <p>Номери: ${orderId}</p>
        <p>Аты: ${safe(name)}</p>
        <p>Телефон: ${safe(phone)}</p>
        <p>Облус: ${safe(region)}</p>
        <p>Шаар/айыл: ${safe(city)}</p>
        <p>Дарек: ${safe(address)}</p>
        ${items}
        <p><strong>Жалпы: ${money(total)}</strong></p>
        <p>Жеткирүү: Акысыз</p>
        <p>Кошумча: ${safe(note || "Жок")}</p>
        <p>Бул буйрутма азырынча браузерде гана сакталды. Дүкөнгө жөнөтүлгөн жок.</p>
        <button class="btn full" id="finishOrder">Жабуу</button>
    `;

    $("orderForm").hidden = true;
    $("orderResult").hidden = false;

    cart = [];
    saveCart();
    updateCart();

    $("finishOrder").addEventListener("click", () => {
        $("orderOverlay").classList.remove("active");
        $("orderForm").reset();
        $("orderForm").hidden = false;
        $("orderResult").hidden = true;
    });
});

// Сайтты иштетүү
showProducts();
updateCart();
console.log("NUR SHOP даяр!");
