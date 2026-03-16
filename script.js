const supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

async function fetchPackages() {
    try {
        if (CONFIG.SUPABASE_URL === "YOUR_SUPABASE_URL") {
            console.log("Supabase not configured, using static fallback.");
            return;
        }

        const { data, error } = await supabaseClient
            .from('packages')
            .select('*')
            .order('level', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
            renderPackages(data);
        }
    } catch (err) {
        console.error("Error fetching packages:", err);
    }
}

function renderPackages(packages) {
    const container = document.getElementById('package-container');
    if (!container) return;

    container.innerHTML = '';
    packages.forEach(pkg => {
        const card = document.createElement('div');
        card.className = `card level-${pkg.level} ${pkg.is_featured ? 'featured' : ''}`;
        
        // Atur warna latar belakang secara dinamis jika tersedia
        if (pkg.color) {
            card.style.backgroundColor = pkg.color;
            card.style.borderColor = pkg.color;
        }
        
        const descriptionList = pkg.description.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('');
        
        card.innerHTML = `
            <div class="card-header">${pkg.name}</div>
            <div class="price">IDR ${new Intl.NumberFormat('id-ID').format(pkg.price)} <span>/${pkg.unit}</span></div>
            <ul>
                ${descriptionList}
            </ul>
            <a href="https://wa.me/6281233451988?text=Halo%20Bos%20Laundry%20Pro!%20Saya%20ingin%20memesan%20paket%20*${encodeURIComponent(pkg.name)}*."
                class="btn-order">Pesan Sekarang</a>
        `;
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', fetchPackages);
