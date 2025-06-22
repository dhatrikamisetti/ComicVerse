// characters.js (Confirmed existing changes)
import {authAction, disablePaginationButtons, renderPagination, setupJump, displayALL, showMessage } from './export.js'; // Import showMessage

document.addEventListener('DOMContentLoaded', function() {
    const itemList = document.getElementById('characters');
    const pages = document.getElementById('pages');
    const API_KEY = 'a315bf6a5d29be2ea9ba315c1b455cb8444d44af';
    const jumpTo = document.getElementById('Jump');
    const jumpButton = document.getElementById('jumpButton');
    const nameSearch = document.getElementById('nameSearch');
    const searchButton = document.getElementById('searchButton');

    let currentPage = 1;
    let totalPages = 0;
    let currentSearchTerm = '';

    nameSearch.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    searchButton.addEventListener('click', () => {
        const searchTerm = nameSearch.value.trim();
        if (searchTerm) {
            currentSearchTerm = searchTerm;
            currentPage = 1;
            fetchcharacters(currentSearchTerm);
        } else {
            showMessage("Please enter a character name to search.", 'error');
        }
    });

    async function fetchcharacters(searchTerm = '') {
        const loadingIndicator = document.getElementById('loading');
        loadingIndicator.style.display = 'block';
        disablePaginationButtons(true);

        const offset = (currentPage * 100) - 100;
        let url = `https://comicvine.gamespot.com/api/characters/?format=json&offset=${offset}&api_key=${API_KEY}&field_list=name,image,api_detail_url`;

        if (searchTerm) {
            url += `&filter=name:${encodeURIComponent(searchTerm)}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            totalPages = Math.ceil(data.number_of_total_results / 100);
            displayALL(
                data,
                itemList, // This is still the #characters div which now has .search-results-grid
                pages,
                jumpTo,
                jumpButton,
                { value: currentPage, update: (newPage) => { currentPage = newPage; } },
                () => fetchcharacters(currentSearchTerm)
            );

        } catch (error) {
            console.error('Error fetching characters:', error);
            showMessage('Failed to fetch characters. Please try again later.', 'error');
        } finally {
            loadingIndicator.style.display = 'none';
            disablePaginationButtons(false);
        }
    }
    authAction();

    fetchcharacters();
});