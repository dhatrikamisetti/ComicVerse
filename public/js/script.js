import { authAction, displayHome } from './export.js';

document.addEventListener('DOMContentLoaded', () => {
  const characterList = document.getElementById('characters');
  const publisher_List = document.getElementById('publishers');
  const volume_List = document.getElementById('volumes');
  const series_List = document.getElementById('series');    
  const team_list = document.getElementById('teams');
  const API_KEY = '&api_key=a315bf6a5d29be2ea9ba315c1b455cb8444d44af';

  async function fetchCharacters(query = '') {
      const response = await fetch('https://comicvine.gamespot.com/api/characters/?format=json&limit=15&field_list=name,image,api_detail_url' + API_KEY);
      const data = await response.json();
      displayHome(data, characterList);
  }
  async function fetchPublishers(query = '') {
      const response = await fetch('https://comicvine.gamespot.com/api/publishers/?format=json&limit=15&field_list=name,image,api_detail_url' + API_KEY);
      const data = await response.json();
      displayHome(data, publisher_List);
  }
  async function fetchVolumes(query = '') {  
      const response = await fetch('https://comicvine.gamespot.com/api/volumes/?format=json&limit=15&field_list=name,image,api_detail_url' + API_KEY);
      const data = await response.json();
      displayHome(data,volume_List);
  }
  async function fetchSeries(query = '') {
      const response = await fetch('https://comicvine.gamespot.com/api/series_list/?format=json&limit=15&field_list=name,image,api_detail_url' + API_KEY);
      const data = await response.json();
      displayHome(data, series_List);
  }
  async function fetchTeams(query = '') {
      const response = await fetch('https://comicvine.gamespot.com/api/teams/?format=json&limit=15&field_list=name,image,api_detail_url' + API_KEY);
      const data = await response.json();
      displayHome(data,team_list );
  }

 authAction();

  // Load initial data
  fetchCharacters();
  fetchPublishers();
  fetchVolumes();
  fetchSeries();
  fetchTeams();
});

