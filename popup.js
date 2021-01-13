document.addEventListener('DOMContentLoaded', () => {
    let baseUrl;
    const baseUrlSpanElement = document.getElementById('jira-url-base');
    const form = document.querySelector('form');
    chrome.storage.sync.get('jiraBaseUrl', ({jiraBaseUrl}) =>{
        baseUrl = jiraBaseUrl;
        const baseUrlTextNode = document.createTextNode(jiraBaseUrl);
        baseUrlSpanElement.appendChild(baseUrlTextNode);
    })

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const ticketUrl = `/browse/SS-${e.target[0].value}`;
        const url = `${baseUrl}${ticketUrl}`;
        chrome.tabs.create({url: url})
    })
})