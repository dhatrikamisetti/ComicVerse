// Updated dashboard.js with proper session handling
import { decodeJwt, authAction, loadSearchHistory, loadViewHistory } from './export.js';

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const usernameDisplay = document.getElementById('usernameDisplay');
    const emailDisplay = document.getElementById('emailDisplay');
    const searchList = document.getElementById('searchList');
    const clearSearch = document.getElementById('clearSearchHistory');
    const viewedItemsContainer = document.getElementById('viewedItems');
    const clearView = document.getElementById('clearViewHistory');

    // --- Session Validation ---
    const idToken = localStorage.getItem('idToken');
    const userEmail = localStorage.getItem('userEmail');
    const displayUsername = localStorage.getItem('displayUsername');
    
    // Check if we have minimum required session data
    if (!idToken || !userEmail) {
        // Clear any partial session data
        localStorage.removeItem('idToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('displayUsername');
        
        // Redirect to login
        window.location.href = '/login.html';
        return;
    }

    // --- User Profile Display ---
    // Use email from localStorage first (more reliable)
    emailDisplay.textContent = userEmail;
    
    // Get username with proper fallbacks
    const username = displayUsername || 
                    localStorage.getItem('registeredUsername') || 
                    userEmail.split('@')[0];
    usernameDisplay.textContent = username;

    // Store the display name if it wasn't already set
    if (!displayUsername) {
        localStorage.setItem('displayUsername', username);
    }

    // --- Logout Functionality and Header Update ---
    authAction('dashboard');

    // --- Search History Functions ---
    loadSearchHistory(searchList);

    // Event listener for clearing search history
    clearSearch.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your search history?')) {
            localStorage.removeItem('searchHistory');
            loadSearchHistory(searchList);
        }
    });

    // --- View History Functions ---
    loadViewHistory(viewedItemsContainer);

    // Event listener for clearing view history
    clearView.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your view history?')) {
            localStorage.removeItem('viewHistory');
            loadViewHistory(viewedItemsContainer);
        }
    });
});