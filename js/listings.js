/**
 * Listings Page Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    const listingsGrid = document.querySelector('#listings-grid');
    const searchInput = document.querySelector('#search-input');
    const cityFilter = document.querySelector('#city-filter');
    const typeFilter = document.querySelector('#type-filter');
    const availabilityFilter = document.querySelector('#availability-filter');
    const resultsCount = document.querySelector('#results-count');

    let allListings = [];

    // Initialize Page
    async function init() {
        showSkeletons();
        allListings = await window.StayStudentAPI.fetchAllListings();
        renderListings(allListings);
        populateCityFilter(allListings);
    }

    function showSkeletons() {
        if (!listingsGrid) return;
        listingsGrid.innerHTML = Array(4).fill(0).map(() => `
            <div class="card" style="height: 400px; background: #f1f5f9; animation: pulse 1.5s infinite;"></div>
        `).join('');
    }

    function renderListings(listings) {
        if (!listingsGrid) return;
        
        if (listings.length === 0) {
            listingsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px;">
                    <i data-lucide="search-x" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 20px;"></i>
                    <h3>No listings found</h3>
                    <p style="color: var(--text-muted);">Try adjusting your search or filters.</p>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            if (resultsCount) resultsCount.textContent = '0 properties found';
            return;
        }

        listingsGrid.innerHTML = listings.map(l => window.createListingCard(l)).join('');
        if (window.lucide) window.lucide.createIcons();
        if (resultsCount) resultsCount.textContent = `${listings.length} properties found`;
    }

    function populateCityFilter(listings) {
        if (!cityFilter) return;
        const cities = [...new Set(listings.map(l => l.city))];
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            cityFilter.appendChild(option);
        });
    }

    function filterListings() {
        const searchTerm = searchInput.value.toLowerCase();
        const city = cityFilter.value;
        const type = typeFilter.value;
        const availability = availabilityFilter.value;

        const filtered = allListings.filter(l => {
            const matchesSearch = l.title.toLowerCase().includes(searchTerm) || l.description.toLowerCase().includes(searchTerm);
            const matchesCity = city === 'all' || l.city === city;
            const matchesType = type === 'all' || l.roomType === type;
            const matchesAvailability = availability === 'all' || 
                (availability === 'available' && (l.available === 'Yes' || l.available === true)) ||
                (availability === 'unavailable' && (l.available === 'No' || l.available === false));

            return matchesSearch && matchesCity && matchesType && matchesAvailability;
        });

        renderListings(filtered);
    }

    // Event Listeners
    if (searchInput) searchInput.addEventListener('input', filterListings);
    if (cityFilter) cityFilter.addEventListener('change', filterListings);
    if (typeFilter) typeFilter.addEventListener('change', filterListings);
    if (availabilityFilter) availabilityFilter.addEventListener('change', filterListings);

    init();
});
