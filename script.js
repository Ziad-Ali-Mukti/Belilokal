// === Inisialisasi Supabase ===
const { createClient } = supabase;
const SUPABASE_URL = "https://cyvnmofeesuwajrygkis.supabase.co"; 
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY"; 
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Elemen DOM
const productList = document.getElementById("product-list");
const authPopup = document.getElementById("authPopup");
const btnUser = document.getElementById("btnUser");
const btnLogout = document.getElementById("btnLogout");
const btnCart = document.getElementById("btnCart");
const btnAdmin = document.getElementById("btnAdmin");
let currentUser = null;

// Produk Dummy
const dummyProducts = [
  { id: 1, name: "Kopi Robusta Jembrana", price: 55000, image_url: "https://via.placeholder.com/150/00704A/FFFFFF?text=Kopi+Lokal", description: "Biji kopi pilihan dari kebun Jembrana." },
  { id: 2, name: "Tenun Ikat Khas", price: 350000, image_url: "https://via.placeholder.com/150/D9880B/FFFFFF?text=Tenun+Jembrana", description: "Kain tenun ikat asli, motif tradisional." },
  { id: 3, name: "Pie Susu Cokelat", price: 25000, image_url: "https://via.placeholder.com/150/808080/FFFFFF?text=Pie+Susu", description: "Camilan khas Bali dengan rasa cokelat." },
  { id: 4, name: "Madu Hutan Jembrana", price: 85000, image_url: "https://via.placeholder.com/150/4A90E2/FFFFFF?text=Madu+Murni", description: "Madu murni yang dipanen dari hutan." },
  { id: 5, name: "Batik Pewarna Alam", price: 210000, image_url: "https://via.placeholder.com/150/9B59B6/FFFFFF?text=Batik+Alam", description: "Batik tulis dengan pewarna dari bahan alami." },
  { id: 6, name: "Keripik Singkong Pedas", price: 18000, image_url: "https://via.placeholder.com/150/FF4500/FFFFFF?text=Keripik", description: "Keripik singkong renyah rasa pedas." },
  { id: 7, name: "Lukisan Pemandangan", price: 550000, image_url: "https://via.placeholder.com/150/191970/FFFFFF?text=Lukisan", description: "Lukisan kanvas pemandangan alam Jembrana." },
  { id: 8, name: "Sandal Kulit Handmade", price: 150000, image_url: "https://via.placeholder.com/150/B8860B/FFFFFF?text=Sandal+Kulit", description: "Sandal kulit asli buatan tangan." },
  { id: 9, name: "Minyak Kelapa Murni", price: 45000, image_url: "https://via.placeholder.com/150/3CB371/FFFFFF?text=Minyak+VCO", description: "Virgin Coconut Oil (VCO) tanpa pemanasan." },
  { id: 10, name: "Gula Aren Organik", price: 30000, image_url: "https://via.placeholder.com/150/CD853F/FFFFFF?text=Gula+Aren", description: "Gula aren murni hasil sadapan petani lokal." }
];

// Cek Status Login
async function checkAuthStatus() {
  const { data } = await supabaseClient.auth.getUser();
  if (data.user) {
    currentUser = data.user;
    btnLogout.style.display = "inline-block";
    btnUser.style.display = "none";
  } else {
    currentUser = null;
    btnLogout.style.display = "none";
    btnUser.style.display = "inline-block";
  }
}

// Tampilkan Produk
function loadProducts() {
  productList.innerHTML = "";
  dummyProducts.forEach((p) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.image_url}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>Rp ${p.price.toLocaleString()}</p>
      <button class="buyBtn" data-id="${p.id}">Beli</button>
    `;
    productList.appendChild(div);
  });

  document.querySelectorAll(".buyBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!currentUser) {
        authPopup.style.display = "flex";
      } else {
        document.getElementById("paymentSection").style.display = "block";
        window.scrollTo(0, document.body.scrollHeight);
      }
    });
  });
}

// Tombol Header
btnCart.onclick = () => {
  if (currentUser) alert("Keranjang Anda masih kosong 🛍️");
  else authPopup.style.display = "flex";
};

btnUser.onclick = () => authPopup.style.display = "flex";

btnAdmin.onclick = () => {
  if (currentUser) alert("Anda diarahkan ke Halaman Admin 🛠️");
  else {
    authPopup.style.display = "flex";
    alert("Hanya admin yang bisa mengakses ini.");
  }
};

btnLogout.onclick = async () => {
  await supabaseClient.auth.signOut();
  checkAuthStatus();
  alert("Logout berhasil!");
};

// Popup Login
document.getElementById("closeAuth").onclick = () => authPopup.style.display = "none";

// Login
document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) return alert("Login gagal: " + error.message);
  authPopup.style.display = "none";
  checkAuthStatus();
  alert("Login berhasil!");
};

// Register
document.getElementById("registerBtn").onclick = async () => {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) return alert("Registrasi gagal: " + error.message);
  alert("Akun berhasil dibuat, silakan login!");
};

// Pembayaran
document.querySelectorAll(".payBtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const method = btn.dataset.method;
    document.getElementById("paymentStatus").innerText = `Pembayaran via ${method} berhasil ✅`;
    setTimeout(() => {
      document.getElementById("reviewSection").style.display = "block";
      window.scrollTo(0, document.body.scrollHeight);
    }, 1000);
  });
});

// Ulasan
document.getElementById("sendReview").onclick = () => {
  const text = document.getElementById("reviewText").value.trim();
  if (!text) return alert("Isi ulasan dulu!");
  document.getElementById("reviewMsg").innerText = "Ulasan terkirim! 🌟";
};

// Jalankan Awal
checkAuthStatus();
loadProducts();
