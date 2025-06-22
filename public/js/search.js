// public/js/search.js

import {  authAction, setupJump, displaySearch, addSearchTerm, showMessage } from './export.js';

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements for search functionality
    const searchTermInput = document.getElementById('searchBar');
    const applyFilterButton = document.getElementById('applyFilterButton');
    const searchButton = document.getElementById('searchButton');
    const resultContainer = document.getElementById('result');
    const loadingIndicator = document.getElementById('loading-indicator');

    let currentSearchQuery = ''; // Stores the last successful search query
    let currentFilterString = ''; // Stores the currently applied filters

    // Also ensured 'id' is in field_list for proper history tracking.
    const BASE_URL = 'https://comicvine.gamespot.com/api/search/?format=json&api_key=a315bf6a5d29be2ea9ba315c1b455cb8444d44af&field_list=name,image,api_detail_url,resource_type,id&limit=100';

    // Event listener for applying filters
    applyFilterButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default form submission
        const checkedFilters = Array.from(
            document.querySelectorAll('input[name="filter"]:checked')
        ).map(checkbox => checkbox.value);
        currentFilterString = checkedFilters.join(',');

        if (currentSearchQuery) {
            fetchResults(currentSearchQuery, currentFilterString);
        } else {
            showMessage("Please enter a search query before applying filters.", "info");
        }
    });

    // Event listener for 'Enter' key press on search bar
    searchTermInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchButton.click();
        }
    });

    // Event listener for search button click
    searchButton.addEventListener('click', () => {
        currentSearchQuery = searchTermInput.value.trim();
        if (currentSearchQuery) {
            fetchResults(currentSearchQuery, currentFilterString);
        } else {
            showMessage("Please enter a query to search.", "info");
        }
    });

    // Asynchronous function to fetch search results from the Comic Vine API
    async function fetchResults(query, filters = '') {
        if (!query) {
            showMessage("Search query cannot be empty.", "error");
            return;
        }

        let url = `${BASE_URL}&query=${encodeURIComponent(query)}`;

        if (filters) {
            url += `&resources=${encodeURIComponent(filters)}`;
        }

        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }

        try {
            console.log("Fetching URL:", url); // Log the full URL being fetched
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            const data = await response.json();

            if (data.error === "OK" && data.results) {

                // Call displaySearch (renamed from displayALL)
                displaySearch(
                    data,
                    resultContainer,
                );

                addSearchTerm(currentSearchQuery); // Record the successful search
            } else {
                resultContainer.innerHTML = `<p class="no-results">No results found for "${query}".</p>`;
                
            }

        } catch (error) {
            console.error('Error fetching search results:', error);
            showMessage('Failed to fetch search results. Please try again later.', 'error');
            resultContainer.innerHTML = `<p class="error-message">An error occurred while fetching results.</p>`;
        } finally {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }
    }

    authAction('general'); // Initialize authentication status
});
