async function getAggregatedNews(apiURL, keyWords) {
    try {
        // Make the POST request
        let response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(keyWords)
        });

        if (!response.ok) {
            console.log(`HTTP error! status: ${response.status}`);
            return [];
        }
        let data = await response.json();

        return data['results'];
    } catch (error) {
        alert('Error connecting to server');
        console.error('Error while calling news aggregator:', error);
    }

}

export { getAggregatedNews };