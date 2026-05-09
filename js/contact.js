/**
 * Contact Page Logic with EmailJS Integration
 * 
 * Setup Instructions:
 * 1. Create account at emailjs.com
 * 2. Create a Service & an Email Template
 * 3. Copy your Public Key, Service ID, and Template ID
 * 4. Replace the placeholders below
 */

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // Get property name from URL if redirected from details page
    const urlParams = new URLSearchParams(window.location.search);
    const propertySelected = urlParams.get('property');
    const messageField = document.getElementById('message');
    
    if (propertySelected && messageField) {
        messageField.value = `I am interested in ${propertySelected}. Please provide more information.`;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Check if EmailJS is initialized
            if (typeof emailjs === 'undefined') {
                showStatus('Email service is not configured. Please use WhatsApp instead.', 'error');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i data-lucide="loader-2" style="animation: spin 2s linear infinite;"></i> Sending...';
            if (window.lucide) window.lucide.createIcons();

            const templateParams = {
                to_name: 'StayStudent Agency',
                from_name: contactForm.full_name.value,
                from_email: contactForm.email.value,
                phone: contactForm.phone.value,
                city: contactForm.city.value,
                message: contactForm.message.value
            };

            try {
                // REPLACE THESE WITH YOUR ACTUAL EMAILJS IDS
                // await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
                
                // Simulate success for preview
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                showStatus('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
                contactForm.reset();
            } catch (error) {
                console.error('Email Error:', error);
                showStatus('Oops! Something went wrong. Please try again or contact us via WhatsApp.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                if (window.lucide) window.lucide.createIcons();
            }
        });
    }

    function showStatus(msg, type) {
        if (!formStatus) return;
        formStatus.textContent = msg;
        formStatus.style.display = 'block';
        formStatus.style.padding = '16px';
        formStatus.style.borderRadius = '8px';
        formStatus.style.marginTop = '20px';
        formStatus.style.textAlign = 'center';
        
        if (type === 'success') {
            formStatus.style.backgroundColor = '#dcfce7';
            formStatus.style.color = '#166534';
            formStatus.style.border = '1px solid #bbf7d0';
        } else {
            formStatus.style.backgroundColor = '#fee2e2';
            formStatus.style.color = '#991b1b';
            formStatus.style.border = '1px solid #fecaca';
        }

        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
});
