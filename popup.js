function createRadioButtons({id, name, prefix}) {
    const inputElement = document.createElement('input');
    inputElement.classList.add('form-check-input');
    inputElement.setAttribute('type', 'radio');
    inputElement.setAttribute('name', 'jira-options');
    inputElement.setAttribute('id', id);
    inputElement.setAttribute('value', prefix);
    const labelElement = document.createElement('label');
    labelElement.classList.add('form-check-label');
    labelElement.setAttribute('for', id);
    labelElement.innerHTML = name;
    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('form-check');
    wrapperDiv.appendChild(inputElement);
    wrapperDiv.appendChild(labelElement);
    const parentElement = document.getElementById('jira-options');
    parentElement.appendChild(wrapperDiv);
}

const findPrefix = (elements) => {
    for (const element of elements) {
        if (element.checked) {
            return element.value;
        }
    }
}

const findTicketNumber = (elements) => {
    for (const element of elements) {
        if (element.type === 'text') {
            return element.value;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let baseUrl;
    const baseUrlSpanElement = document.getElementById('jira-url-base');
    const form = document.querySelector('form');
    chrome.storage.sync.get('jiraBaseUrl', ({jiraBaseUrl}) =>{
        baseUrl = jiraBaseUrl;
        const baseUrlTextNode = document.createTextNode(jiraBaseUrl);
        baseUrlSpanElement.appendChild(baseUrlTextNode);
    })

    chrome.storage.sync.get('prefixOptions', data => {
        data.prefixOptions.forEach(prefix => createRadioButtons(prefix));
        const firstInput = document.querySelector('.form-check > .form-check-input');
        firstInput.checked = true;
    })

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const prefix = findPrefix(e.target);
        const ticketNumber = findTicketNumber(e.target);
        const ticketUrl = `/browse/${prefix}-${ticketNumber}`;
        const url = `${baseUrl}${ticketUrl}`;
        chrome.tabs.create({url: url})
    })
})