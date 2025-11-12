// Dummy data produk
const products = [
  { id: 1, name: "Kopi Jembrana", price: 45000, image: "https://via.placeholder.com/200" },
  { id: 2, name: "Kerajinan Kayu Bali", price: 120000, image: "https://via.placeholder.com/200" },
  { id: 3, name: "Sambal Matah Asli", price: 25000, image: "https://via.placeholder.com/200" }
];

// Referensi elemen
const productList = document.getElementById("product-list");
const authSection = document.getElementById("authSection");
const productSection = document.getElementById("productSection");
const paymentSection = document.getElementById("paymentSection");
const reviewSection = document.getElementById("reviewSection");
const adminSection = document.getElementById("adminSection");

// State
let currentUser = null;

// 🔹 Registrasi pengguna
document.getElementById("registerBtn").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (!username || !password) return alert("Isi semua data!");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registrasi berhasil! Silakan login.");
});

// 🔹 Login pengguna
document.getElementById("loginBtn").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));
    authSection.style.display = "none";
    productSection.style.display = "block";
    document.getElementById("btnLogout").style.display = "inline";
    renderProducts();
  } else {
    alert("Username atau password salah!");
  }
});

// 🔹 Render daftar produk
function renderProducts() {
  productList.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.image}" width="200">
      <h3>${p.name}</h3>
      <p>Rp ${p.price.toLocaleString()}</p>
      <button onclick="buyProduct(${p.id})">Beli</button>
    `;
    productList.appendChild(div);
  });
}

// 🔹 Simulasi pembelian
function buyProduct(id) {
  localStorage.setItem("selectedProduct", id);
  productSection.style.display = "none";
  paymentSection.style.display = "block";
}

// 🔹 Pilih metode pembayaran
document.querySelectorAll(".payBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const method = btn.dataset.method;
    document.getElementById("paymentStatus").innerText = `Pembayaran via ${method} berhasil ✅`;
    setTimeout(() => {
      paymentSection.style.display = "none";
      reviewSection.style.display = "block";
    }, 1500);
  });
});

// 🔹 Kirim ulasan
document.getElementById("sendReview").addEventListener("click", () => {
  const review = document.getElementById("reviewText").value;
  if (!review) return alert("Tulis ulasan dulu!");
  document.getElementById("reviewMsg").innerText = "Terima kasih atas ulasannya! 🌟";
  localStorage.removeItem("selectedProduct");
});

// 🔹 Logout
document.getElementById("btnLogout").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  location.reload();
});

// 🔹 Admin dashboard
document.getElementById("btnAdmin").addEventListener("click", () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  document.getElementById("userCount").innerText = users.length;
  document.getElementById("productCount").innerText = products.length;
  hideAllSections();
  adminSection.style.display = "block";
});

function hideAllSections() {
  [authSection, productSection, paymentSection, reviewSection, adminSection]
    .forEach(s => s.style.display = "none");
}
