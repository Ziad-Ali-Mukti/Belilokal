// Supabase setup
const SUPABASE_URL = "https://cyvnmofeesuwajrygkis.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Elemen
const productList = document.getElementById("product-list");
const authPopup = document.getElementById("authPopup");
const closeAuth = document.getElementById("closeAuth");
const btnLogout = document.getElementById("btnLogout");

let currentUser = null;

// === TAMPIL PRODUK TANPA LOGIN ===
async function loadProducts() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    console.error(error);
    productList.innerHTML = "<p>Gagal memuat produk.</p>";
    return;
  }

  productList.innerHTML = "";
  data.forEach((p) => {
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

// === LOGIN & REGISTER ===
document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert("Login gagal: " + error.message);
  currentUser = data.user;
  authPopup.style.display = "none";
  btnLogout.style.display = "inline-block";
  alert("Login berhasil!");
};

document.getElementById("registerBtn").onclick = async () => {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return alert("Daftar gagal: " + error.message);
  alert("Registrasi berhasil! Silakan login.");
};

document.getElementById("closeAuth").onclick = () => {
  authPopup.style.display = "none";
};

// === LOGOUT ===
btnLogout.onclick = async () => {
  await supabase.auth.signOut();
  currentUser = null;
  btnLogout.style.display = "none";
  alert("Logout berhasil!");
};

// === PEMBAYARAN & ULASAN ===
document.querySelectorAll(".payBtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const method = btn.dataset.method;
    document.getElementById("paymentStatus").innerText = `Pembayaran ${method} berhasil! ✅`;
    setTimeout(() => {
      document.getElementById("reviewSection").style.display = "block";
      window.scrollTo(0, document.body.scrollHeight);
    }, 1000);
  });
});

document.getElementById("sendReview").onclick = () => {
  const text = document.getElementById("reviewText").value.trim();
  if (!text) return alert("Isi ulasan dulu!");
  document.getElementById("reviewMsg").innerText = "Ulasan terkirim! 🌟";
};

// Jalankan awal
loadProducts();
