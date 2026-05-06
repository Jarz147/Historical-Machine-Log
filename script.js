// 1. Inisialisasi Supabase
const SUPABASE_URL = 'URL_PROJECT_ANDA';
const SUPABASE_KEY = 'ANON_KEY_ANDA';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('maintenanceForm');
const logBody = document.getElementById('logBody');
const btnSimpan = document.getElementById('btnSimpan');

// 2. Fungsi Mengambil Data dari Supabase
async function fetchLogs() {
    const { data, error } = await _supabase
        .from('historical_mesin') // Pastikan nama tabel sama di Supabase
        .select('*')
        .order('tanggal', { ascending: false });

    if (error) {
        console.error('Error fetching logs:', error);
    } else {
        renderLogs(data);
    }
}

// 3. Fungsi Menampilkan Data ke Tabel
function renderLogs(logs) {
    logBody.innerHTML = '';
    logs.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.tanggal}</td>
            <td><strong>${log.nama_mesin}</strong></td>
            <td><span class="badge">${log.kategori}</span></td>
            <td>${log.deskripsi}</td>
            <td>${log.teknisi}</td>
        `;
        logBody.appendChild(row);
    });
}

// 4. Fungsi Menyimpan Data
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Beri feedback loading
    btnSimpan.disabled = true;
    btnSimpan.innerText = 'Menyimpan...';

    const payload = {
        tanggal: document.getElementById('tanggal').value,
        nama_mesin: document.getElementById('nama_mesin').value,
        kategori: document.getElementById('kategori').value,
        teknisi: document.getElementById('teknisi').value,
        deskripsi: document.getElementById('deskripsi').value
    };

    const { error } = await _supabase
        .from('historical_mesin')
        .insert([payload]);

    if (error) {
        alert('Gagal menyimpan data: ' + error.message);
    } else {
        form.reset();
        await fetchLogs(); // Refresh tabel
    }

    btnSimpan.disabled = false;
    btnSimpan.innerText = 'Simpan ke Cloud';
});

// Jalankan pengambilan data saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchLogs);
