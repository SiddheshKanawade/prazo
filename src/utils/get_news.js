import { getDateRange } from './helper';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Error from '../Components/InternalServerError';

async function getLiveNews(category) {
    const baseUrl = process.env.REACT_APP_BASEURL;
    const selectedSources = ['bloomberg', 'indiatimes', 'the-economic-times', 'businesstoday', 'reuters', 'the-hindu', 'bbc', 'cnbc', 'google-news'];
    try {
        const apiURL = `${baseUrl}/news/live`;
        console.log(`Fetching Live News for category: ${category}`);
        let response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "sources": selectedSources,
                "categories": category ? [category] : ['business']
            })
        });

        if (!response.ok) {
            console.log(`HTTP error! status: ${response.status}`);
            return [];
        }
        let data = await response.json();

        return data['results'];

    } catch (error) {
        console.error('Error fetching Live News:', error);
    }
}

async function getTickerNews(ticker, selectedCategories) {
    const baseUrl = process.env.REACT_APP_BASEURL;
    const { formattedStartDate, formattedEndDate } = getDateRange(); // NEVER USED!!!

    try {
        let response = await fetch(`${baseUrl}/news/ticker`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "keyWords": [ticker],
                "categories": selectedCategories,
            })
        });

        if (!response.ok) {
            console.log(`HTTP error! status: ${response.status}`);
            return [];
        }
        let data = await response.json();

        return data['results'];

    } catch (error) {
        console.error('Error fetching Ticker News:', error);
    }
}

async function getFeedNews(token, navigate) {
    const baseUrl = process.env.REACT_APP_BASEURL;
    try {
        console.log('Fetching Feed News');
        const response = await axios.post(`${baseUrl}/user/feed`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data['results'];
    } catch (resp) {
        if (resp.status === 401) {
            localStorage.removeItem('authToken');
            alert('Session timedout. Login again to continue');
            navigate('/login');
        } else if (resp.status === 400) {
            console.error('Bad request exception:', resp);
            alert('Please add feed sources to continue');
            navigate('/feed-sources');
            return (
                <div>
                    <Error />
                </div>
            );
        }

        console.error('Error fetching Feed News:', resp);

        return (
            <div>
                <Error />
            </div>
        );


    }
}

async function isLoggedIn(token) {
    const baseUrl = process.env.REACT_APP_BASEURL;
    try {
        const response = await axios.post(`${baseUrl}/user/login`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            console.log(response);
            return true
        } else {
            return false
        }
    } catch (err) {
        console.error('Error checking login status:', err);
        return false;
    }
}

export { getLiveNews, getTickerNews, getFeedNews, isLoggedIn };