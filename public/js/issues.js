import { disablePaginationButtons, renderPagination, setupJump, displayALL,authAction } from './export.js';

document.addEventListener('DOMContentLoaded', function() {
  const itemList = document.getElementById('issues');
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
          fetchissues(currentSearchTerm);
      } else {
          alert("Please enter an issue name to search.");
      }
  });

  async function fetchissues(searchTerm = '') {
      const loadingIndicator = document.getElementById('loading');
      loadingIndicator.style.display = 'block';
      disablePaginationButtons(true);

      const offset = (currentPage * 100) - 100;
      let url = `https://comicvine.gamespot.com/api/issues/?format=json&offset=${offset}&api_key=${API_KEY}&field_list=name,image,api_detail_url`;
      
      if (searchTerm) {
          url += `&filter=name:${encodeURIComponent(searchTerm)}`;
      }

      try {
          const response = await fetch(url);
          const data = await response.json();
          totalPages = Math.ceil(data.number_of_total_results / 100);
          displayALL(
              data,
              itemList,
              pages,
              jumpTo,
              jumpButton,
              { value: currentPage, update: (newPage) => { currentPage = newPage; } },
              () => fetchissues(currentSearchTerm)
          );

      } catch (error) {
          console.error('Error fetching issues:', error);
          alert('Failed to fetch issues. Please try again later.');
      } finally {
          loadingIndicator.style.display = 'none';
          disablePaginationButtons(false);
      }
  }  
  authAction();
  fetchissues(); 
});