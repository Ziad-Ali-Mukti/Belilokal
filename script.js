// Supabase setup
const SUPABASE_URL = "https://cyvnmofeesuwajrygkis.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Elemen
const productList = document.getElementById("product-list");
const authPopup = document.getElementById("authPopup");
const closeAuth = document.getElementById("closeAuth");

// Referensi ke tombol-tombol header yang baru
const btnUser = document.getElementById("btnUser");
const btnLogout = document.getElementById("btnLogout");
// const btnCart = document.getElementById("btnCart"); // Anda bisa menambahkan fungsi untuk keranjang di sini
// const btnAdmin = document.getElementById("btnAdmin"); // Tambahkan admin (jika perlu)

let currentUser = null; // Status login pengguna

// === CEK STATUS OTENTIKASI AWAL ===
async function checkAuthStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        currentUser = user;
        btnLogout.style.display = "inline-block";
        btnUser.style.display = "none"; // Sembunyikan ikon user saat sudah login, diganti logout
    } else {
        btnLogout.style.display = "none";
        btnUser.style.display = "inline-block"; // Tampilkan ikon user untuk login/daftar
    }
}

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

    // LOGIKA KUNCI: Memicu Login/Daftar saat klik "Beli"
    document.querySelectorAll(".buyBtn").forEach((btn) => {
        btn.addEventListener("click", () => {
            if (!currentUser) {
                authPopup.style.display = "flex"; // Tampilkan pop-up login
            } else {
                // Lanjut ke pembayaran jika sudah login
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
    checkAuthStatus(); // Update tombol header
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
    checkAuthStatus(); // Update tombol header
    alert("Logout berhasil!");
};

// === FUNGSI USER ICON (Memicu Login/Daftar) ===
btnUser.onclick = () => {
    if (!currentUser) {
        authPopup.style.display = "flex";
    } else {
        alert("Ini adalah halaman Profil User."); // Jika sudah login, bisa diarahkan ke halaman profil
    }
}

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

// Jalankan fungsi awal saat halaman dimuat
checkAuthStatus();
loadProducts();