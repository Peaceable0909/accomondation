/**
 * StayStudent Global App Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
    initMobileMenu();
});

function initNavbar() {
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Initial check for scroll position on page load
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    }
}

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });
}

// Utility: Create Listing Card HTML
function createListingCard(property) {
    const isAvailable = property.available === 'Yes' || property.available === true;
    const isBillsIncluded = property.billsIncluded === 'Yes' || property.billsIncluded === true;
    
    return `
        <div class="card" data-aos="fade-up">
            <div style="position: relative; height: 200px; border-radius: 16px; overflow: hidden; margin-bottom: 16px;">
                <img src="${property.image1}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 1s;">
                <div style="position: absolute; top: 12px; left: 12px;">
                    <span style="padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; background: #2563eb; color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        ${isAvailable ? 'Verified' : 'Booked'}
                    </span>
                </div>
                <div style="position: absolute; bottom: 12px; left: 12px; background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 8px; font-weight: 800; color: #0f172a; font-size: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    ${property.price}<span style="font-size: 10px; font-weight: 500; color: #64748b;">/pw</span>
                </div>
            </div>
            <div style="padding: 0 8px 8px;">
                <h3 style="font-size: 1.1rem; margin-bottom: 4px; color: #0f172a; font-weight: 700;">${property.title}</h3>
                <div style="display: flex; align-items: center; gap: 4px; color: #64748b; font-size: 11px; font-weight: 600; margin-bottom: 16px;">
                    <i data-lucide="map-pin" style="width: 12px; height: 12px; color: #2563eb;"></i>
                    <span>${property.city}, UK &bull; 0.2 miles from Uni</span>
                </div>
                
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
                    <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                        ${isBillsIncluded ? `
                            <span style="background: #f1f5f9; color: #475569; font-size: 9px; font-weight: 700; padding: 4px 8px; border-radius: 6px;">Bills Inc.</span>
                        ` : ''}
                        <span style="background: #f1f5f9; color: #475569; font-size: 9px; font-weight: 700; padding: 4px 8px; border-radius: 6px;">${property.roomType}</span>
                    </div>
                    <a href="property.html?id=${property.id}" style="color: #2563eb; font-size: 11px; font-weight: 800;">View Details</a>
                </div>
                
                <a href="https://wa.me/${property.whatsapp}?text=Hello, I am interested in the ${encodeURIComponent(property.title)} listing." target="_blank" class="btn" style="background: #22c55e; color: #ffffff; width: 100%; padding: 12px; font-size: 12px; font-weight: 700; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.2);">
                    <i data-lucide="message-circle" style="width: 16px; height: 16px;"></i> WhatsApp Inquiry
                </a>
            </div>
        </div>
    `;
}

window.createListingCard = createListingCard;
