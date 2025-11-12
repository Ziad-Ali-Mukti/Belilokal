// Supabase setup (Pastikan Kunci dan URL Anda Benar)
const SUPABASE_URL = "https://cyvnmofeesuwajrygkis.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Elemen DOM
const productList = document.getElementById("product-list");
const authPopup = document.getElementById("authPopup");

// Referensi ke tombol-tombol header
const btnUser = document.getElementById("btnUser");
const btnLogout = document.getElementById("btnLogout");
const btnCart = document.getElementById("btnCart"); 
const btnAdmin = document.getElementById("btnAdmin"); 

let currentUser = null; 

// Tambahkan data produk dummy 10 item, termasuk URL gambar placeholder
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

// === CEK STATUS OTENTIKASI AWAL ===
async function checkAuthStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        currentUser = user;
        btnLogout.style.display = "inline-block";
        btnUser.style.display = "none"; 
    } else {
        currentUser = null;
        btnLogout.style.display = "none";
        btnUser.style.display = "inline-block"; 
    }
}

// === TAMPIL PRODUK (MENGGUNAKAN 10 PRODUK DUMMY) ===
async function loadProducts() {
    let data = dummyProducts; 

    productList.innerHTML = "";
    if (!data || data.length === 0) {
        productList.innerHTML = "<p>Tidak ada produk yang tersedia saat ini.</p>";
        return;
    }
    
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

    // Memicu Login/Daftar saat klik "Beli" jika belum login
    document.querySelectorAll(".buyBtn").forEach((btn) => {
        btn.addEventListener("click", () => {
            if (!currentUser) {
                authPopup.style.display = "flex"; 
            } else {
                // Tampilkan bagian pembayaran jika sudah login
                document.getElementById("paymentSection").style.display = "block";
                window.scrollTo(0, document.body.scrollHeight);
            }
        });
    });
}

// === FUNGSI MENU POJOK KANAN ATAS ===

// 1. Ikon Keranjang (btnCart): Berfungsi memicu login/notifikasi
btnCart.onclick = () => {
    if (currentUser) {
        alert("Ini adalah Keranjang Belanja Anda.");
    } else {
        authPopup.style.display = "flex";
        alert("Silakan Login/Daftar untuk melihat Keranjang.");
    }
};

// 2. Ikon User (btnUser): Berfungsi memicu Login/Daftar
btnUser.onclick = () => {
    authPopup.style.display = "flex";
}

// 3. Ikon Admin (btnAdmin): Berfungsi memicu login/notifikasi admin
btnAdmin.onclick = () => {
    if (currentUser) {
        alert("Anda diarahkan ke Halaman Admin.");
        // Anda bisa tambahkan window.location.href = "admin.html"; di sini
    } else {
        authPopup.style.display = "flex";
        alert("Hanya Admin yang dapat mengakses ini. Silakan Login.");
    }
}

// Logika Logout
btnLogout.onclick = async () => {
    await supabase.auth.signOut();
    checkAuthStatus(); 
    alert("Logout berhasil!");
};

// Logika menutup popup
document.getElementById("closeAuth").onclick = () => {
    authPopup.style.display = "none";
};


// === LOGIN, REGISTER, PEMBAYARAN & ULASAN (Logika tetap sama) ===

document.getElementById("loginBtn").onclick = async () => {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert("Login gagal: " + error.message);
    
    authPopup.style.display = "none";
    checkAuthStatus();
    alert("Login berhasil!");
};

document.getElementById("registerBtn").onclick = async () => {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return alert("Daftar gagal: " + error.message);
    alert("Registrasi berhasil! Silakan login.");
};

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