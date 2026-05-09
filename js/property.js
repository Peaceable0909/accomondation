/**
 * Property Details Page Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    const propertyContent = document.querySelector('#property-detail-content');
    const similarGrid = document.querySelector('#similar-listings-grid');
    
    // Get property ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');

    if (!propertyId) {
        window.location.href = 'listings.html';
        return;
    }

    async function init() {
        const property = await window.StayStudentAPI.getListingById(propertyId);
        
        if (!property) {
            if (propertyContent) {
                propertyContent.innerHTML = '<h2>Property not found.</h2>';
            }
            return;
        }

        renderDetails(property);
        renderSimilar(property.city, property.id);
        initMap(property);
    }

    function initMap(p) {
        const cityCoords = {
            'London': [51.5074, -0.1278],
            'Manchester': [53.4808, -2.2426],
            'Birmingham': [52.4862, -1.8904],
            'Liverpool': [53.4084, -2.9916],
            'Leeds': [53.8008, -1.5491],
            'Sheffield': [53.3811, -1.4701],
            'Newcastle': [54.9783, -1.6174],
            'Bristol': [51.4545, -2.5879],
            'Coventry': [52.4068, -1.5122],
            'Canterbury': [51.2802, 1.0789],
            'Oxford': [51.7520, -1.2577],
            'Cambridge': [52.2053, 0.1218]
        };

        const coords = cityCoords[p.city] || [51.5074, -0.1278];
        
        // Add a slight random offset so markers don't overlap if they are in the same city
        const offsetLat = (Math.random() - 0.5) * 0.01;
        const offsetLng = (Math.random() - 0.5) * 0.01;
        const finalCoords = [coords[0] + offsetLat, coords[1] + offsetLng];

        const map = L.map('map', {
            scrollWheelZoom: false
        }).setView(finalCoords, 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #2563eb; width: 40px; height: 40px; border-radius: 50%; border: 4px solid #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; color: white;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                   </div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        L.marker(finalCoords, { icon: customIcon }).addTo(map)
            .bindPopup(`<strong style="font-family: inherit;">${p.title}</strong><br>${p.city}`)
            .openPopup();
    }

    function renderDetails(p) {
        if (!propertyContent) return;

        const isAvailable = p.available === 'Yes' || p.available === true;
        const isBillsIncluded = p.billsIncluded === 'Yes' || p.billsIncluded === true;
        const amenitiesList = p.amenities ? p.amenities.split(',').map(a => a.trim()) : [];

        propertyContent.innerHTML = `
            <div class="container section-padding" style="margin-top: 80px;">
                <div style="margin-bottom: 24px;">
                    <p style="font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Listings / ${p.city}</p>
                </div>
                <div id="main-grid" style="display: grid; grid-template-columns: 2.2fr 1fr; gap: 40px; align-items: start;">
                    <!-- Left Side: Media & Info -->
                    <div>
                        <div style="margin-bottom: 32px;">
                             <div class="property-gallery" style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px; height: 450px; overflow: hidden; border-radius: 24px;">
                                <div style="height: 100%;">
                                    <img src="${p.image1}" class="gallery-item" data-index="0" style="width: 100%; height: 100%; object-fit: cover;" data-aos="fade-right">
                                </div>
                                <div class="mobile-hide" style="display: grid; grid-template-rows: 1fr 1fr; gap: 12px; height: 100%;">
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                        <img src="${p.image2}" class="gallery-item" data-index="1" style="width: 100%; height: 100%; object-fit: cover;">
                                        <img src="${p.image3}" class="gallery-item" data-index="2" style="width: 100%; height: 100%; object-fit: cover;">
                                    </div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                        <img src="${p.image1}" class="gallery-item" data-index="3" style="width: 100%; height: 100%; object-fit: cover;">
                                        <div style="position: relative;">
                                            <img src="${p.image2}" class="gallery-item" data-index="4" style="width: 100%; height: 100%; object-fit: cover;">
                                            <button id="show-all-photos" style="position: absolute; bottom: 12px; right: 12px; background: white; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 11px; box-shadow: var(--shadow-sm); border: none; cursor: pointer;">
                                                Show all photos
                                            </button>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>

                        <div style="margin-bottom: 40px;">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                <h1 style="font-size: 2.5rem; color: #0f172a;">${p.title}</h1>
                                <div style="display: flex; gap: 10px;">
                                    <button style="padding: 8px; background: #f8fafc; border-radius: 50%;"><i data-lucide="share-2" style="width: 18px; color: #64748b;"></i></button>
                                    <button style="padding: 8px; background: #f8fafc; border-radius: 50%;"><i data-lucide="heart" style="width: 18px; color: #64748b;"></i></button>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 1rem; margin-bottom: 32px;">
                                <span>${p.city}</span> &bull; <span>4.9 (124 reviews)</span> &bull; <span style="color: #2563eb; font-weight: 700;">Verified</span>
                            </div>
                            <div style="padding-top: 32px; border-top: 1px solid var(--border);">
                                <h3 style="margin-bottom: 16px;">The Space</h3>
                                <p style="color: #64748b; font-size: 1rem; line-height: 1.8; white-space: pre-line;">${p.description}</p>
                            </div>
                        </div>

                        <div>
                            <h3 style="margin-bottom: 24px;">Key Features & Amenities</h3>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 24px;">
                                ${amenitiesList.length > 0 ? amenitiesList.map(a => `
                                    <div style="display: flex; gap: 12px;">
                                        <div style="width: 40px; height: 40px; background: #f8fafc; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                                            <i data-lucide="check" style="color: #2563eb; width: 18px;"></i>
                                        </div>
                                        <div>
                                            <p style="font-size: 0.9rem; font-weight: 600; margin: 0;">${a}</p>
                                            <p style="font-size: 0.75rem; color: #94a3b8;">Included</p>
                                        </div>
                                    </div>
                                `).join('') : '<p>Check with agent for full list.</p>'}
                            </div>
                        </div>

                        <div style="margin-top: 48px;">
                            <h3 style="margin-bottom: 24px;">Location</h3>
                            <div id="map" style="height: 400px; border-radius: 24px; box-shadow: var(--shadow-md); z-index: 1;"></div>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); gap: 20px; margin-top: 24px;">
                                <div style="text-align: center;">
                                    <p style="font-size: 1rem; font-weight: 700;">5 mins</p>
                                    <p style="font-size: 0.75rem; color: #94a3b8;">Walk to Campus</p>
                                </div>
                                <div style="text-align: center;">
                                    <p style="font-size: 1rem; font-weight: 700;">8 mins</p>
                                    <p style="font-size: 0.75rem; color: #94a3b8;">Train Station</p>
                                </div>
                                <div style="text-align: center;">
                                    <p style="font-size: 1rem; font-weight: 700;">2 mins</p>
                                    <p style="font-size: 0.75rem; color: #94a3b8;">Supermarket</p>
                                </div>
                                <div style="text-align: center;">
                                    <p style="font-size: 1rem; font-weight: 700;">12 mins</p>
                                    <p style="font-size: 0.75rem; color: #94a3b8;">City Center</p>
                                </div>
                            </div>
                        </div>

                        <!-- Reviews Section -->
                        <div style="margin-top: 60px; padding-top: 48px; border-top: 1px solid #f1f5f9;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                                <h3 style="margin: 0;">Student Reviews</h3>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <i data-lucide="star" style="fill: #f59e0b; color: #f59e0b; width: 20px;"></i>
                                    <span style="font-size: 1.2rem; font-weight: 800; color: #0f172a;">4.9</span>
                                    <span style="color: #94a3b8; font-size: 0.9rem;">(124 reviews)</span>
                                </div>
                            </div>
                            
                            <!-- Review List -->
                            <div style="display: flex; flex-direction: column; gap: 32px; margin-bottom: 48px;">
                                <div style="padding-bottom: 32px; border-bottom: 1px solid #f8fafc;">
                                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                                        <img src="https://i.pravatar.cc/150?u=4" style="width: 40px; height: 40px; border-radius: 50%;">
                                        <div>
                                            <h4 style="margin: 0; font-size: 0.95rem;">Emma Thompson</h4>
                                            <p style="margin: 0; font-size: 0.75rem; color: #94a3b8;">October 2023</p>
                                        </div>
                                        <div style="margin-left: auto; display: flex; gap: 2px;">
                                            ${[1, 2, 3, 4, 5].map(() => `<i data-lucide="star" style="fill: #f59e0b; color: #f59e0b; width: 12px;"></i>`).join('')}
                                        </div>
                                    </div>
                                    <p style="color: #475569; font-size: 0.95rem; line-height: 1.6;">
                                        Absolutely loved my stay here! The location is unbeatable for getting to lectures, and the management team is so responsive whenever there's a maintenance issue.
                                    </p>
                                </div>
                                <div style="padding-bottom: 32px; border-bottom: 1px solid #f8fafc;">
                                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                                        <img src="https://i.pravatar.cc/150?u=5" style="width: 40px; height: 40px; border-radius: 50%;">
                                        <div>
                                            <h4 style="margin: 0; font-size: 0.95rem;">James Wilson</h4>
                                            <p style="margin: 0; font-size: 0.75rem; color: #94a3b8;">September 2023</p>
                                        </div>
                                        <div style="margin-left: auto; display: flex; gap: 2px;">
                                            ${[1, 2, 3, 4, 5].map(() => `<i data-lucide="star" style="fill: #f59e0b; color: #f59e0b; width: 12px;"></i>`).join('')}
                                        </div>
                                    </div>
                                    <p style="color: #475569; font-size: 0.95rem; line-height: 1.6;">
                                        The high-speed internet was a lifesaver during my finals. Also, the gym is quiet and well-maintained. Highly recommend for any postgraduate students.
                                    </p>
                                </div>
                            </div>

                            <!-- Submission Form -->
                            <div style="background: #f8fafc; padding: 40px; border-radius: 24px;">
                                <h4 style="margin-bottom: 8px;">Leave a Review</h4>
                                <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 24px;">Your review helps other students find their perfect home.</p>
                                
                                <form id="review-form">
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                        <div>
                                            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; text-transform: uppercase;">Full Name</label>
                                            <input type="text" placeholder="John Doe" style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; outline: none; font-size: 0.9rem;">
                                        </div>
                                        <div>
                                            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; text-transform: uppercase;">Rating</label>
                                            <select style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; outline: none; font-size: 0.9rem; background: white;">
                                                <option value="5">5 - Excellent</option>
                                                <option value="4">4 - Very Good</option>
                                                <option value="3">3 - Good</option>
                                                <option value="2">2 - Fair</option>
                                                <option value="1">1 - Poor</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style="margin-bottom: 24px;">
                                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; text-transform: uppercase;">Your Review</label>
                                        <textarea placeholder="Tell us about your experience..." style="width: 100%; height: 120px; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; outline: none; font-size: 0.9rem; resize: none;"></textarea>
                                    </div>
                                    <button type="submit" class="btn btn-primary" style="padding: 12px 32px; border-radius: 10px; font-weight: 700;">Submit Review</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    </div>

                    <!-- Right Side: Sticky Pricing Card -->
                    <div style="position: sticky; top: 120px;">
                        <div class="card" style="padding: 32px; border-radius: 24px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                                <div>
                                    <p style="font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase;">Weekly Rent</p>
                                    <div style="font-size: 2rem; font-weight: 800; color: #0f172a;">${p.price}</div>
                                </div>
                                <div style="background: #fff1f2; color: #e11d48; padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;">Limited Offer</div>
                            </div>

                            <div style="padding: 16px; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; margin-bottom: 24px;">
                                <div style="margin-bottom: 12px;">
                                    <p style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Available From</p>
                                    <p style="font-size: 0.9rem; font-weight: 700; color: #0f172a;">September 15, 2024</p>
                                </div>
                                <div>
                                    <p style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Contract Period</p>
                                    <p style="font-size: 0.9rem; font-weight: 700; color: #0f172a;">51 Weeks</p>
                                </div>
                            </div>

                            <button class="btn btn-primary" style="width: 100%; padding: 16px; margin-bottom: 12px; border-radius: 12px; font-weight: 700;">Schedule a Viewing</button>
                            <a href="https://wa.me/${p.whatsapp}?text=Hello, I am interested in viewing ${encodeURIComponent(p.title)} in ${p.city}." target="_blank" class="btn" style="width: 100%; border: 2px solid #22c55e; color: #22c55e; padding: 14px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                <i data-lucide="message-circle"></i> Inquire on WhatsApp
                            </a>
                            
                            <div style="margin-top: 20px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px; color: #64748b;">
                                <div style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: pulse 1s infinite;"></div>
                                <span style="font-size: 0.8rem; font-weight: 600;">18 students viewed this today</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (window.lucide) window.lucide.createIcons();

        // Review Form Logic
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for your review! It has been submitted for moderation.');
                reviewForm.reset();
            });
        }

        // Image Gallery Logic
        const galleryItems = document.querySelectorAll('.gallery-item');
        const showAllBtn = document.getElementById('show-all-photos');
        const images = Array.from(galleryItems).map(img => img.src);
        
        let currentIndex = 0;

        // Inject Lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close"><i data-lucide="x"></i></button>
                <img src="" class="lightbox-img">
                <div class="lightbox-nav">
                    <button class="lightbox-btn prev"><i data-lucide="chevron-left"></i></button>
                    <button class="lightbox-btn next"><i data-lucide="chevron-right"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);
        if (window.lucide) window.lucide.createIcons();

        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const nextBtn = lightbox.querySelector('.next');
        const prevBtn = lightbox.querySelector('.prev');

        const openLightbox = (index) => {
            currentIndex = index;
            lightboxImg.src = images[currentIndex];
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        const nextImg = () => {
            currentIndex = (currentIndex + 1) % images.length;
            lightboxImg.src = images[currentIndex];
        };

        const prevImg = () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            lightboxImg.src = images[currentIndex];
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        if (showAllBtn) {
            showAllBtn.addEventListener('click', () => openLightbox(0));
        }

        closeBtn.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImg(); });
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImg(); });
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImg();
            if (e.key === 'ArrowLeft') prevImg();
        });
    }

    async function renderSimilar(city, currentId) {
        if (!similarGrid) return;
        const all = await window.StayStudentAPI.fetchAllListings();
        const similar = all.filter(l => l.city === city && l.id !== currentId).slice(0, 3);
        
        if (similar.length === 0) {
            document.querySelector('#similar-section').style.display = 'none';
            return;
        }

        similarGrid.innerHTML = similar.map(l => window.createListingCard(l)).join('');
        if (window.lucide) window.lucide.createIcons();
    }

    init();
});
