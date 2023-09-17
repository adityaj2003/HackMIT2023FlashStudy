let currentSearchEngine = 'youtube';

function setSearchEngine(engine) {
    currentSearchEngine = engine;
}

function search() {
    const query = document.getElementById('search-query').value;
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (currentSearchEngine === 'google') {
        // Implement Google Search API request
        // Display Google search results on the website
            const apiKey = 'AIzaSyD3vkuINJKaWllK1eRXV6fA-Pc1wGrU6Jo'; // Replace with your actual API key
            const cx = 'https://cse.google.com/cse.js?cx=21c23e63f676a4a93'; // Replace with your actual custom search engine ID
            const url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${cx}`;
        
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const resultsContainer = document.getElementById('results');
                    resultsContainer.innerHTML = '';
        
                    data.items.forEach(item => {
                        const title = item.title;
                        const link = item.link;
        
                        resultsContainer.innerHTML += `
                            <div class="result">
                                <h2>${title}</h2>
                                <a href="${link}" target="_blank">${link}</a>
                            </div>
                        `;
                    });
                })
                .catch(error => console.error('Error:', error));
        }
        
    else if (currentSearchEngine === 'youtube') {
        // Implement YouTube API request
        // Display YouTube search results on the website
            const apiKey = 'AIzaSyBIQ9T1b8EXePZ-PDOfUrxqPlIt5NxgCwo'; // Replace with your actual API key
            const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&part=snippet&type=video`;
        
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const resultsContainer = document.getElementById('results');
                    resultsContainer.innerHTML = '';
        
                    data.items.forEach(item => {
                        const videoId = item.id.videoId;
                        const title = item.snippet.title;
        
                        resultsContainer.innerHTML += `
                            <div class="video">
                                <h2>${title}</h2>
                                <iframe width="300" height="300" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                            </div>
                        `;
                    });
                })
                .catch(error => console.error('Error:', error));
        }
        
     else if (currentSearchEngine === 'chatgpt') {
        // Implement ChatGPT API request
        // Display ChatGPT search results on the website
    }
}
