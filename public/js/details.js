import { authAction, addViewedItem, showMessage } from './export.js';



document.addEventListener('DOMContentLoaded', async () => {

    if(!localStorage.getItem("idToken")){
        // If no user is logged in, redirect to login page
        showMessage('You must be logged in to view details.', 'warning');
        window.location.href = 'login.html'; // Redirect to login page
        return;
    }

    // Comic Vine API key and format parameters
    const API_PARAMS = '?api_key=a315bf6a5d29be2ea9ba315c1b455cb8444d44af&format=json';
    // Retrieve the API detail URL for the selected item from localStorage
    const detailUrl = localStorage.getItem('selectedUrl');

    if (!detailUrl) {
        // If no URL is found, show a message and redirect to home page
        showMessage('No item selected to display details.', 'info');
        window.location.href = 'home.html'; // Redirect to home page
        return;
    }

    try {
        // Fetch the detailed data using the stored URL and API key
        const response = await fetch(detailUrl + API_PARAMS);
        const data = await response.json();

        const detailContainer = document.getElementById('comic-details');
        if (!detailContainer) {
            console.error("Detail container element not found!");
            return;
        }
        detailContainer.innerHTML = ''; // Clear previous content

        const item = data.results; // The detailed item object

        // --- Add item to View History ---
        // Record the viewed item's title and type in the user's history
        addViewedItem({
            title: item.name || item.volume?.name || item.issue?.name || 'Unknown Title',
            type: item.resource_type || (detailUrl.includes('character') ? 'Character' :
                                        detailUrl.includes('issue') ? 'Issue' :
                                        detailUrl.includes('movie') ? 'Movie' :
                                        detailUrl.includes('object') ? 'Object' :
                                        detailUrl.includes('person') ? 'Person' :
                                        detailUrl.includes('publisher') ? 'Publisher' :
                                        detailUrl.includes('series') ? 'Series' :
                                        detailUrl.includes('team') ? 'Team' :
                                        detailUrl.includes('volume') ? 'Volume' : 'Unknown Type')
        });

        // --- Render Details Based on Type ---
        // Determine the type of item and render its specific details
        let html = '';
        let imageUrl = item.image?.original_url || 'https://placehold.co/500x750/E0E0E0/333333?text=No+Image'; // Fallback image

        // Common structure for all details
        html += `<div class="detail-card">
                    <img src="${imageUrl}" alt="${item.name || 'Item Image'}" class="detail-image" />
                    <div class="detail-content">
                        <h1>${item.name || 'N/A'}</h1>
                        ${item.description ? `<div class="detail-description">${item.description}</div>` : `<p>No description available.</p>`}
                `;

        if (detailUrl.includes('character')) {
            detailContainer.classList.add('character-details');
            html += `<p><strong>Real Name:</strong> ${item.real_name || 'N/A'}</p>`;
            html += `<p><strong>Publisher:</strong> ${item.publisher?.name || 'N/A'}</p>`;
            html += `<p><strong>Birth:</strong> ${item.birth || 'N/A'}</p>`;

            if (item.character_enemies && item.character_enemies.length > 0) {
                html += `<h3><strong>Enemies:</strong></h3><ul class="detail-list">`;
                item.character_enemies.forEach(enemy => {
                    html += `<li>${enemy.name}</li>`;
                });
                html += `</ul>`;
            }
            if (item.character_friends && item.character_friends.length > 0) {
                html += `<h3><strong>Friends:</strong></h3><ul class="detail-list">`;
                item.character_friends.forEach(friend => {
                    html += `<li>${friend.name}</li>`;
                });
                html += `</ul>`;
            }
            if (item.powers && item.powers.length > 0) {
                html += `<h3><strong>Powers:</strong></h3><ul class="detail-list">`;
                item.powers.forEach(power => {
                    html += `<li>${power.name}</li>`;
                });
                html += `</ul>`;
            }

        } else if (detailUrl.includes('issue')) {
            detailContainer.classList.add('issue-details');
            html += `<p><strong>Issue Date:</strong> ${item.cover_date || 'N/A'}</p>`;
            html += `<p><strong>Issue Number:</strong> ${item.issue_number || 'N/A'}</p>`;
            html += `<p><strong>Volume:</strong> ${item.volume?.name || 'N/A'}</p>`;

            if (item.person_credits && item.person_credits.length > 0) {
                html += `<h3><strong>Credits:</strong></h3><ul class="detail-list">`;
                item.person_credits.forEach(credit => {
                    html += `<li>${credit.name} as ${credit.role || 'N/A'}</li>`;
                });
                html += `</ul>`;
            }
            if (item.characters && item.characters.length > 0) {
                html += `<h3><strong>Characters:</strong></h3><ul class="detail-list">`;
                item.characters.forEach(character => {
                    html += `<li>${character.name}</li>`;
                });
                html += `</ul>`;
            }

        } else if (detailUrl.includes('movie')) {
            detailContainer.classList.add('movie-details');
            html += `<p><strong>Release Date:</strong> ${item.release_date || 'N/A'}</p>`;
            html += `<p><strong>Runtime:</strong> ${item.runtime || 'N/A'} minutes</p>`;
            html += `<p><strong>Rating:</strong> ${item.rating || 'N/A'}</p>`;
            html += `<p><strong>Budget:</strong> ${item.budget ? `$${new Intl.NumberFormat().format(item.budget)}` : 'N/A'}</p>`;
            html += `<p><strong>Box Office Revenue:</strong> ${item.box_office_revenue ? `$${new Intl.NumberFormat().format(item.box_office_revenue)}` : 'N/A'}</p>`;
            html += `<p><strong>Total Revenue:</strong> ${item.total_revenue ? `$${new Intl.NumberFormat().format(item.total_revenue)}` : 'N/A'}</p>`;

            if (item.characters && item.characters.length > 0) {
                html += `<h3><strong>Characters:</strong></h3><ul class="detail-list">`;
                item.characters.forEach(character => {
                    html += `<li>${character.name}</li>`;
                });
                html += `</ul>`;
            }
            if (item.writers && item.writers.length > 0) {
                html += `<h3><strong>Writers:</strong></h3><ul class="detail-list">`;
                item.writers.forEach(writer => {
                    html += `<li>${writer.name}</li>`;
                });
                html += `</ul>`;
            }
            if (item.concepts && item.concepts.length > 0) {
                html += `<h3><strong>Concepts:</strong></h3><ul class="detail-list">`;
                item.concepts.forEach(concept => {
                    html += `<li>${concept.name}</li>`;
                });
                html += `</ul>`;
            }

        } else if (detailUrl.includes('object')) {
            detailContainer.classList.add('object-details');
            html += `<p><strong>Aliases:</strong> ${item.aliases || 'N/A'}</p>`;
            html += `<p><strong>Total Appearances:</strong> ${item.count_of_issue_appearances || 'N/A'}</p>`;

            if (item.movies && item.movies.length > 0) {
                html += `<h3><strong>Appearances in Movies:</strong></h3><ul class="detail-list">`;
                item.movies.forEach(movie => {
                    html += `<li>${movie.name}</li>`;
                });
                html += `</ul>`;
            }
            if (item.first_appearance && item.first_appearance.name) {
                 html += `<p><strong>First Appearance:</strong> ${item.first_appearance.name || 'N/A'}</p>`;
            }

        } else if (detailUrl.includes('person')) {
            detailContainer.classList.add('person-details');
            html += `<p><strong>Aliases:</strong> ${item.aliases || 'N/A'}</p>`;
            html += `<p><strong>Hometown:</strong> ${item.hometown || 'N/A'}</p>`;
            html += `<p><strong>Country:</strong> ${item.country || 'N/A'}</p>`;

            if (item.created_characters && item.created_characters.length > 0) {
                html += `<h3><strong>Created Characters:</strong></h3><ul class="detail-list">`;
                item.created_characters.forEach(character => {
                    html += `<li>${character.name}</li>`;
                });
                html += `</ul>`;
            }
            if (item.story_arc_credits && item.story_arc_credits.length > 0) {
                html += `<h3><strong>Story Arc Credits:</strong></h3><ul class="detail-list">`;
                item.story_arc_credits.forEach(arc => {
                    html += `<li>${arc.name}</li>`;
                });
                html += `</ul>`;
            }
            if (item.volume_credits && item.volume_credits.length > 0) {
                html += `<h3><strong>Volume Credits:</strong></h3><ul class="detail-list">`;
                item.volume_credits.forEach(volume => {
                    html += `<li>${volume.name}</li>`;
                });
                html += `</ul>`;
            }

        } else if (detailUrl.includes('publisher')) {
            detailContainer.classList.add('publisher-details');
            html += `<p><strong>Aliases:</strong> ${item.aliases || 'N/A'}</p>`;
            html += `<p><strong>Location Address:</strong> ${item.location_address || 'N/A'}</p>`;
            html += `<p><strong>Location City:</strong> ${item.location_city || 'N/A'}</p>`;
            html += `<p><strong>Location State:</strong> ${item.location_state || 'N/A'}</p>`;

            if (item.volumes && item.volumes.length > 0) {
                html += `<h3><strong>Published Volumes:</strong></h3><ul class="detail-list">`;
                item.volumes.forEach(volume => {
                    html += `<li>${volume.name}</li>`;
                });
                html += `</ul>`;
            }

        } else if (detailUrl.includes('series')) {
            detailContainer.classList.add('series-details');
            html += `<p><strong>Aliases:</strong> ${item.aliases || 'N/A'}</p>`;
            html += `<p><strong>Number of Episodes:</strong> ${item.count_of_episodes || 'N/A'}</p>`;
            html += `<p><strong>Start Year:</strong> ${item.start_year || 'N/A'}</p>`;
            html += `<p><strong>Publisher:</strong> ${item.publisher?.name || 'N/A'}</p>`;

            if (item.characters && item.characters.length > 0) {
                html += `<h3><strong>Characters:</strong></h3><ul class="detail-list">`;
                item.characters.forEach(character => {
                    html += `<li>${character.name}</li>`;
                });
                html += `</ul>`;
            }
            if (item.episodes && item.episodes.length > 0) {
                html += `<h3><strong>Episodes:</strong></h3><ul class="detail-list">`;
                item.episodes.forEach(episode => {
                    html += `<li>${episode.name}</li>`;
                });
                html += `</ul>`;
            }

        } else if (detailUrl.includes('team')) {
            detailContainer.classList.add('team-details');
            html += `<p><strong>Aliases:</strong> ${item.aliases || 'N/A'}</p>`;
            html += `<p><strong>Number of Team Members:</strong> ${item.count_of_team_members || 'N/A'}</p>`;

            if (item.movies && item.movies.length > 0) {
                html += `<h3><strong>Movies:</strong></h3><ul class="detail-list">`;
                item.movies.forEach(movie => {
                    html += `<li>${movie.name}</li>`;
                });
                html += `</ul>`;
            }
            if (item.publisher && item.publisher.name) {
                html += `<p><strong>Publisher:</strong> ${item.publisher.name}</p>`;
            }
            if (item.volume_credits && item.volume_credits.length > 0) {
                html += `<h3><strong>Volume Credits:</strong></h3><ul class="detail-list">`;
                item.volume_credits.forEach(volume => {
                    html += `<li>${volume.name}</li>`;
                });
                html += `</ul>`;
            }
            if (item.members && item.members.length > 0) {
                html += `<h3><strong>Members:</strong></h3><ul class="detail-list">`;
                item.members.forEach(member => {
                    html += `<li>${member.name}</li>`;
                });
                html += `</ul>`;
            }


        } else if (detailUrl.includes('volume')) {
            detailContainer.classList.add('volume-details');
            html += `<p><strong>Aliases:</strong> ${item.aliases || 'N/A'}</p>`;
            html += `<p><strong>Start Year:</strong> ${item.start_year || 'N/A'}</p>`;
            html += `<p><strong>Publisher:</strong> ${item.publisher?.name || 'N/A'}</p>`;

            if (item.characters && item.characters.length > 0) {
                html += `<h3><strong>Characters:</strong></h3><ul class="detail-list">`;
                item.characters.forEach(character => {
                    html += `<li>${character.name}</li>`;
                });
                html += `</ul>`;
            }
            if (item.locations && item.locations.length > 0) {
                html += `<h3><strong>Locations:</strong></h3><ul class="detail-list">`;
                item.locations.forEach(location => {
                    html += `<li>${location.name}</li>`;
                });
                html += `</ul>`;
            }
            if (item.issues && item.issues.length > 0) {
                html += `<h3><strong>Issues in this Volume:</strong></h3><ul class="detail-list">`;
                item.issues.forEach(issue => {
                    html += `<li>${issue.name} (#${issue.issue_number})</li>`;
                });
                html += `</ul>`;
            }
        }
        else if (item.site_detail_url) {
            // For other types that might have a direct external URL
            showMessage('Redirecting to external details page...', 'info');
            console.log('Redirecting to:', item.site_detail_url);
            window.location.href = item.site_detail_url;
            return; // Exit after redirect
        }
        else {
            html += `<p>No specific details available for this type.</p>`;
        }

        html += `</div></div>`; // Close detail-content and detail-card
        detailContainer.innerHTML = html; // Inject generated HTML into the container

    } catch (error) {
        console.error('Error fetching or rendering details:', error);
        showMessage('Failed to load details. Please try again.', 'error');
        // Consider redirecting to home or a safe page if details fail to load
        // window.location.href = 'home.html';
    }

    // Call authAction to update the header's login/logout state
    authAction();
});
