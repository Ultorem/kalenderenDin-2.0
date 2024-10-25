const fetch = require('node-fetch');

exports.handler = async function(event) {
  const { lat, lon } = event.queryStringParameters;

  try {
    const response = await fetch(
      `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,
      {
        headers: {
          'User-Agent': 'NorwegianCalendar/1.0 (https://hilarious-lollipop-cf53c6.netlify.app)',
        },
      }
    );
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed fetching weather data' }),
    };
  }
};