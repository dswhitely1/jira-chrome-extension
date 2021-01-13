document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('update-jira-url')
    const titleElement = document.getElementById('jira-url')
    chrome.storage.sync.get('jiraBaseUrl', data => {
        const currentUrl = Object.keys(data).length === 0 ? "" : data.jiraBaseUrl;
        urlInput.value = currentUrl;
        titleElement.textContent = `Current Url: ${currentUrl}`
    })

    const formElement = document.querySelector('form');

    formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        chrome.storage.sync.set({jiraBaseUrl: e.target[0].value}, () => {
            titleElement.textContent = `Current Url: ${e.target[0].value}`
        })
    })
})