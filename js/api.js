/**
 * StayStudent API Service
 * Handles data fetching from Google Apps Script JSON API
 */

const API_CONFIG = {
    // Replace this with your actual Google Apps Script Web App URL after deployment
    scriptUrl: 'YOUR_GOOGLE_APPS_SCRIPT_URL',
    // Fallback data for development/preview before Google Sheets is connected
    fallbackData: []
};

const StayStudentAPI = {
    async fetchAllListings() {
        if (API_CONFIG.scriptUrl === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
            console.warn('StayStudent: Using fallback data. Connect Google Apps Script to see real-time data.');
            return API_CONFIG.fallbackData;
        }

        try {
            const response = await fetch(API_CONFIG.scriptUrl);
            if (!response.ok) throw new Error('API fetch failed');
            return await response.json();
        } catch (error) {
            console.error('StayStudent API Error:', error);
            return API_CONFIG.fallbackData;
        }
    },

    async getListingById(id) {
        const listings = await this.fetchAllListings();
        return listings.find(item => item.id === id);
    },

    async getFeaturedListings() {
        const listings = await this.fetchAllListings();
        return listings.filter(item => item.featured === 'Yes' || item.featured === true);
    }
};

window.StayStudentAPI = StayStudentAPI;
export default StayStudentAPI;
