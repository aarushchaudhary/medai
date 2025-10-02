const axios = require('axios');
const cheerio = require('cheerio');

// IMPORTANT: Always check a website's `robots.txt` and terms of service before scraping.
// Be responsible and avoid overloading servers.

const scrapeWebsite = async (url, query) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let content = '';
    
    // Customize selectors for each site for better results.
    // This generic example looks for the query in paragraph tags.
    $('p').each((i, elem) => {
      const text = $(elem).text();
      if (text.toLowerCase().includes(query.toLowerCase())) {
        content += text + '\n\n';
      }
    });

    // Return a manageable chunk of the most relevant text
    return content.substring(0, 4000);
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return `Could not retrieve information from ${url}.`;
  }
};

module.exports = { scrapeWebsite };