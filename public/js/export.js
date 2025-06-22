// Function to decode JWT (idToken)
export function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
    }
}

// Function to replace alert() with a custom message box or console log.
export function showMessage(message, type = 'info') {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 8px;
        color: white;
        z-index: 1000;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        animation: fadeOut 3s forwards;
    `;
    if (type === 'error') {
        msgDiv.style.backgroundColor = '#dc3545';
    } else if (type === 'success') {
        msgDiv.style.backgroundColor = '#28a745';
    } else {
        msgDiv.style.backgroundColor = '#007bff';
    }
    document.body.appendChild(msgDiv);

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeOut {
            0% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); display: none; }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        msgDiv.remove();
        style.remove();
    }, 3000);
}

// --- History Management Functions (using localStorage) ---

export function loadSearchHistory(searchListElement) {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    searchListElement.innerHTML = '';
    if (history.length === 0) {
        searchListElement.innerHTML = '<li class="history-placeholder">No search history yet.</li>';
    } else {
        history.forEach(term => {
            const li = document.createElement('li');
            li.textContent = term;
            searchListElement.appendChild(li);
        });
    }
}

export function addSearchTerm(term) {
    if (!term || typeof term !== 'string' || term.trim() === '') {
        console.warn("Attempted to add empty or invalid search term.");
        return;
    }
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const index = history.indexOf(term);
    if (index > -1) {
        history.splice(index, 1);
    }
    history.unshift(term);
    localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 10)));
}

export function loadViewHistory(viewedItemsContainerElement) {
    const history = JSON.parse(localStorage.getItem('viewHistory') || '[]');
    viewedItemsContainerElement.innerHTML = '';
    if (history.length === 0) {
        viewedItemsContainerElement.innerHTML = '<p class="history-placeholder">No view history yet.</p>';
    } else {
        history.forEach(item => {
            const div = document.createElement('div');
            div.className = 'viewed-item';
            div.innerHTML = `
                <span><strong>Title:</strong> ${item.title || 'N/A'}</span>
                <span><strong>Type:</strong> ${item.type || 'N/A'}</span>
                <span><strong>Viewed On:</strong> ${new Date(item.timestamp).toLocaleString()}</span>
            `;
            viewedItemsContainerElement.appendChild(div);
        });
    }
}

export function addViewedItem(item) {
    if (!item || typeof item !== 'object' || !item.title) {
        console.warn("Attempted to add empty or invalid viewed item.");
        return;
    }
    const history = JSON.parse(localStorage.getItem('viewHistory') || '[]');
    item.timestamp = new Date().toISOString();
    history.unshift(item);
    localStorage.setItem('viewHistory', JSON.stringify(history.slice(0, 10)));
}

// --- Pagination and Display Functions ---

export function disablePaginationButtons(disable) {
    const buttons = document.querySelectorAll('.page-btn');
    buttons.forEach(btn => {
        btn.disabled = disable;
        btn.style.opacity = disable ? '0.6' : '1';
        btn.style.pointerEvents = disable ? 'none' : 'auto';
    });
}

export function renderPagination({
    pagesContainer,
    totalPages,
    currentPage,
    onPageChange
}) {
    pagesContainer.innerHTML = '';

    function createButton(label, page, isActive = false) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.className = 'page-btn' + (isActive ? ' active' : '');
        btn.onclick = () => {
            if (page !== currentPage) {
                onPageChange(page);
            }
        };
        pagesContainer.appendChild(btn);
    }

    if (totalPages <= 10) {
        for (let i = 1; i <= totalPages; i++) {
            createButton(i, i, i === currentPage);
        }
    } else {
        createButton(1, 1, currentPage === 1);

        if (currentPage > 4) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            pagesContainer.appendChild(dots);
        }

        const start = Math.max(2, currentPage - 2);
        const end = Math.min(totalPages - 1, currentPage + 2);

        for (let i = start; i <= end; i++) {
            createButton(i, i, i === currentPage);
        }

        if (currentPage < totalPages - 3) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            pagesContainer.appendChild(dots);
        }

        createButton(totalPages, totalPages, currentPage === totalPages);
    }
}

export function setupJump(jumpInput, jumpButton, totalPages, onJump) {
    jumpButton.addEventListener('click', () => {
        const pageNumber = parseInt(jumpInput.value, 10);
        if (pageNumber > 0 && pageNumber <= totalPages) {
            onJump(pageNumber);
        } else {
            showMessage(`Please enter a valid page number between 1 and ${totalPages}.`, 'error');
        }
    });

    jumpInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            jumpButton.click();
        }
    });
}

export function displayALL(data, itemList, pages, jumpTo, jumpButton, currentPageRef, fetchCallback) {
    itemList.innerHTML = '';
    const totalPages = Math.ceil(data.number_of_total_results / 100);

    if (!data || !data.results || data.results.length === 0) {
        itemList.innerHTML = '<p class="no-results">No results found.</p>';
        if (pages) pages.innerHTML = '';
        if (jumpTo) jumpTo.value = '';
        return;
    }

    data.results.forEach(item => {
        if (item.image && item.image.original_url === "https://comicvine.gamespot.com/a/uploads/original/11122/111222211/6373148-blank.png") {
            return;
        }

        const ItemDiv = document.createElement('div');
        ItemDiv.className = 'search-result-item';

        let imageHtml;
        if (item.api_detail_url && item.api_detail_url.includes('publisher')) {
            imageHtml = `<img height='150px' width='150px' src="${item.image?.original_url || 'https://placehold.co/200x200/E0E0E0/333333?text=No+Image'}" alt="${item.name}" class="image-result image-publisher">`;
        } else {
            imageHtml = `<img height='350px' width='200px' src="${item.image?.original_url || 'https://placehold.co/200x300/E0E0E0/333333?text=No+Image'}" alt="${item.name}" class="image-result image-comic">`;
        }


        ItemDiv.innerHTML = `
            ${imageHtml}
            <h3>${item.name || 'N/A'}</h3>
        `;

        if (item.resource_type) {
            ItemDiv.innerHTML += `<p class="resource-type">Type: ${item.resource_type}</p>`;
        }
        ItemDiv.innerHTML += `<button class="details-button" data-url="${item.api_detail_url}">View Details</button>`;

        ItemDiv.querySelector('.details-button').addEventListener('click', (event) => {
            const url = event.target.dataset.url;
            if (url) {
                localStorage.setItem('selectedUrl', url);
                window.location.href = 'details.html';
            }
        });
        itemList.appendChild(ItemDiv);
    });

    renderPagination({
        pagesContainer: pages,
        totalPages: totalPages,
        currentPage: currentPageRef.value,
        onPageChange: (newPage) => {
            currentPageRef.value = newPage;
            if (currentPageRef.update) {
                currentPageRef.update(newPage);
            }
            fetchCallback();
        }
    });

    setupJump(jumpTo, jumpButton, totalPages, (page) => {
        currentPageRef.value = page;
        if (currentPageRef.update) {
            currentPageRef.update(page);
        }
        fetchCallback();
    });
}

export function displaySearch(data, itemList) {
    itemList.innerHTML = '';

    if (!data || !data.results || data.results.length === 0) {
        itemList.innerHTML = '<p class="no-results">No results found.</p>';
        if (pages) pages.innerHTML = '';
        if (jumpTo) jumpTo.value = '';
        return;
    }

    data.results.forEach(item => {
        if (item.image && item.image.original_url === "https://comicvine.gamespot.com/a/uploads/original/11122/111222211/6373148-blank.png") {
            return;
        }

        const ItemDiv = document.createElement('div');
        ItemDiv.className = 'search-result-item';

        let imageHtml;
        if (item.api_detail_url && item.api_detail_url.includes('publisher')) {
            imageHtml = `<img height='150px' width='150px' src="${item.image?.original_url}" alt="${item.name}" class="image-result image-publisher">`;
        } else {
            imageHtml = `<img height='350px' width='200px' src="${item.image?.original_url}" alt="${item.name}" class="image-result image-comic">`;
        }


        ItemDiv.innerHTML = `
            ${imageHtml}
            <h3>${item.name || 'N/A'}</h3>
            <p class="resource-type">Type: ${item.resource_type}</p>
            <button class="details-button" data-url="${item.api_detail_url}">View Details</button>
        `;

        ItemDiv.querySelector('.details-button').addEventListener('click', (event) => {
            const url = event.target.dataset.url;
            if (url) {
                localStorage.setItem('selectedUrl', url);
                window.location.href = 'details.html';
            }
        });
        itemList.appendChild(ItemDiv);
    });

}


export function displayHome(data, itemList) {
    itemList.innerHTML = '';
    if (!data || !data.results || data.results.length === 0) {
        itemList.innerHTML = '<p class="no-results">No results found.</p>';
        return;
    }
    data.results.forEach(item => {
        if (item.image && item.image.original_url === "https://comicvine.gamespot.com/a/uploads/original/11122/111222211/6373148-blank.png") {
            return;
        }

        const ItemDiv = document.createElement('div');
        ItemDiv.className = 'home-item';

        let imageHtml;
        if (item.api_detail_url && item.api_detail_url.includes('publisher')) {
            imageHtml = `<img height='150px' width='150px' src="${item.image?.original_url || 'https://placehold.co/200x200/E0E0E0/333333?text=No+Image'}" alt="${item.name}" class="image-result image-publisher">`;
        } else {
            imageHtml = `<img height='350px' width='200px' src="${item.image?.original_url || 'https://placehold.co/200x300/E0E0E0/333333?text=No+Image'}" alt="${item.name}" class="image-result image-comic">`;
        }

        ItemDiv.innerHTML = `
            ${imageHtml}
            <h3>${item.name || 'N/A'}</h3>
            <button class="details-button" data-url="${item.api_detail_url}">View Details</button>
        `;

        ItemDiv.querySelector('.details-button').addEventListener('click', () => {
            localStorage.setItem('selectedUrl', item.api_detail_url);
            window.location.href = 'details.html';
        });
        itemList.appendChild(ItemDiv);
    });
}

// Handles the display of login/logout/user icon in the header based on authentication status and page type.
export function authAction(pageType = 'general') {
    const authActionContainer = document.getElementById('auth-action');

    if (!authActionContainer) {
        console.error("Auth action container not found!");
        return;
    }

    const idToken = localStorage.getItem('idToken');

    if (idToken) {
        // User is logged in
        if (pageType === 'dashboard') {
            // On dashboard, show logout button
            authActionContainer.innerHTML = `
                <button id="logout-btn">Logout</button>
            `;
            const logoutButton = document.getElementById('logout-btn');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    localStorage.removeItem('idToken');
                    localStorage.removeItem('registeredUsername');
                    localStorage.removeItem('displayUsername');
                    localStorage.removeItem('searchHistory');
                    localStorage.removeItem('viewHistory');
                    window.location.href = '/login.html';
                });
            }
        } else {
            // On other pages, show user icon which links to dashboard
            authActionContainer.innerHTML = `
                <img src="images/user.jpg" width='50px' style='border-radius:50%' alt="User Profile" class="user-icon" id="userIconBtn">
            `;
            const userIconBtn = document.getElementById('userIconBtn');
            if (userIconBtn) {
                userIconBtn.addEventListener('click', () => {
                    window.location.href = '/dashboard.html';
                });
            }
        }
    } else {
        // User is not logged in, show login button on all pages
        authActionContainer.innerHTML = `
            <a href="login.html" id="header-auth-link" class="login-button">Login</a>
        `;
    }
}
