// 1. Konfigurasi Supabase
const SUPABASE_URL = 'https://synhvvaolrjxdcbyozld.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bmh2dmFvbHJqeGRjYnlvemxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5Njg4NzEsImV4cCI6MjA4NTU0NDg3MX0.GSEfz8HVd49uEWXd70taR6FUv243VrFJKn6KlsZW-aQ';

// Inisialisasi client
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('maintenanceForm');
const logBody = document.getElementById('logBody');
const btnSimpan = document.getElementById('btnSimpan');

// 2. Fungsi Mengambil Data dari Supabase
async function fetchLogs() {
    const { data, error } = await _supabase
        .from('historical_mesin')
        .select('*')
        .order('tanggal', { ascending: false });

    if (error) {
        console.error('Error fetching logs:', error);
        // Jika error 403 atau empty, periksa RLS di Dashboard Supabase
    } else {
        renderLogs(data);
    }
}

// 3. Fungsi Menampilkan Data ke Tabel
function renderLogs(logs) {
    logBody.innerHTML = '';
    if (logs.length === 0) {
        logBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Belum ada data historical.</td></tr>';
        return;
    }

    logs.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.tanggal}</td>
            <td><strong>${log.nama_mesin}</strong></td>
            <td><span class="badge badge-${log.kategori}">${log.kategori}</span></td>
            <td>${log.deskripsi}</td>
            <td>${log.teknisi}</td>
        `;
        logBody.appendChild(row);
    });
}

// 4. Fungsi Menyimpan Data
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
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
        alert('Gagal menyimpan data! Pastikan tabel "historical_mesin" sudah dibuat dan RLS sudah diatur ke public.');
        console.error(error);
    } else {
        form.reset();
        await fetchLogs();
    }

    btnSimpan.disabled = false;
    btnSimpan.innerText = 'Simpan ke Cloud';
});

// Jalankan pengambilan data saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchLogs);
