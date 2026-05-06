const SUPABASE_URL = 'https://synhvvaolrjxdcbyozld.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Gunakan Key Anda
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Elements
const roleToggle = document.getElementById('roleToggle');
const userSection = document.getElementById('userSection');
const adminSection = document.getElementById('adminSection');
const selectMesin = document.getElementById('select_mesin');
const logBody = document.getElementById('logBody');

// --- 1. Fungsi Role Switch ---
function switchRole() {
    if (roleToggle.value === 'admin') {
        const password = prompt("Masukkan Passcode Admin:");
        if (password === "1234") { // Passcode sederhana
            adminSection.classList.remove('hidden');
            userSection.classList.add('hidden');
        } else {
            alert("Passcode Salah!");
            roleToggle.value = 'user';
        }
    } else {
        adminSection.classList.add('hidden');
        userSection.classList.remove('hidden');
    }
}

// --- 2. Load Daftar Mesin ke Dropdown ---
async function fetchMachines() {
    const { data, error } = await _supabase.from('list_mesin').select('*').order('nama_mesin');
    if (!error) {
        selectMesin.innerHTML = data.map(m => `<option value="${m.nama_mesin}">${m.nama_mesin}</option>`).join('');
    }
}

// --- 3. Admin: Tambah Mesin Baru ---
document.getElementById('addMachineForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('new_machine_name').value;
    
    const { error } = await _supabase.from('list_mesin').insert([{ nama_mesin: name }]);
    
    if (error) {
        alert("Gagal tambah mesin (Mungkin nama sudah ada)");
    } else {
        alert("Mesin berhasil ditambahkan!");
        document.getElementById('new_machine_name').value = '';
        fetchMachines(); // Update dropdown
    }
});

// --- 4. User: Simpan Log Historical ---
document.getElementById('maintenanceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSimpan');
    btn.disabled = true;

    const payload = {
        tanggal: document.getElementById('tanggal').value,
        nama_mesin: document.getElementById('select_mesin').value,
        kategori: document.getElementById('kategori').value,
        teknisi: document.getElementById('teknisi').value,
        deskripsi: document.getElementById('deskripsi').value
    };

    const { error } = await _supabase.from('historical_mesin').insert([payload]);

    if (!error) {
        document.getElementById('maintenanceForm').reset();
        fetchLogs();
    }
    btn.disabled = false;
});

// --- 5. Fetch & Render Logs ---
async function fetchLogs() {
    const { data, error } = await _supabase.from('historical_mesin').select('*').order('tanggal', { ascending: false });
    if (!error) {
        logBody.innerHTML = data.map(log => `
            <tr>
                <td>${log.tanggal}</td>
                <td><b>${log.nama_mesin}</b></td>
                <td><span class="badge badge-${log.kategori}">${log.kategori}</span></td>
                <td>${log.deskripsi}</td>
                <td>${log.teknisi}</td>
            </tr>
        `).join('');
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    fetchMachines();
    fetchLogs();
});
