function uniqueId() {
    let uuid = "";
    for (let i = 0; i < 32; i++) {
        const random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
}

function createTableRow(rowData) {
    const {id, name, prefix} = rowData;
    const tableRowElement = document.createElement('tr');
    const tableRowNameElement = document.createElement('td');
    const tableRowPrefixElement = document.createElement('td');
    const tableRowActionsElement = document.createElement('td');
    tableRowElement.setAttribute('id', id);
    const editButtonElement = document.createElement('button');
    const deleteButtonElement = document.createElement('button');
    editButtonElement.classList.add('btn', 'btn-sm', 'btn-success', 'me-3');
    deleteButtonElement.classList.add('btn', 'btn-sm', 'btn-danger');
    editButtonElement.innerHTML = "Edit"
    deleteButtonElement.innerHTML = "Delete"
    tableRowActionsElement.appendChild(editButtonElement);
    tableRowActionsElement.appendChild(deleteButtonElement);
    tableRowNameElement.innerHTML = name;
    tableRowPrefixElement.innerHTML = prefix;
    tableRowElement.appendChild(tableRowNameElement);
    tableRowElement.appendChild(tableRowPrefixElement);
    tableRowElement.appendChild(tableRowActionsElement);
    const tableBodyElement = document.querySelector('tbody');
    tableBodyElement.appendChild(tableRowElement);

    editButtonElement.addEventListener('click', () => {
        editTableRowEntry(id, name, prefix);
    })

    deleteButtonElement.addEventListener('click', () => {
        deleteTableRowEntry(id);
    })
}

function editTableRowEntry(id, name, prefix) {
    const idInput = document.getElementById('update-jira-prefix-id')
    const nameInput = document.getElementById('update-jira-prefix-name');
    const prefixInput = document.getElementById('update-jira-prefix');
    idInput.value = id;
    nameInput.value = name;
    prefixInput.value = prefix;
}

function deleteTableRowEntry(id) {
    chrome.storage.sync.get('prefixOptions', data => {
        const newPrefixes = data.prefixOptions.filter(prefix => prefix.id !== id);
        chrome.storage.sync.set({prefixOptions: newPrefixes});
    })
}

function clearElementsChildren(element) {
    while (element.lastElementChild) {
        element.removeChild(element.lastElementChild);
    }
}

chrome.storage.onChanged.addListener((changes) => {
    if (Object.keys(changes).indexOf('prefixOptions') > -1) {
        const tableBodyElement = document.querySelector('tbody');
        clearElementsChildren(tableBodyElement);
        changes.prefixOptions.newValue.forEach(tableRow => createTableRow(tableRow));
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('update-jira-url')
    const titleElement = document.getElementById('jira-url')
    chrome.storage.sync.get('jiraBaseUrl', data => {
        const currentUrl = Object.keys(data).length === 0 ? "" : data.jiraBaseUrl;
        urlInput.value = currentUrl;
        titleElement.innerHTML = `Current Url: ${currentUrl}`
    })

    const urlFormElement = document.getElementById('url-form');

    chrome.storage.sync.get('prefixOptions', data => {
        console.log(data);
        const prefixes = Object.keys(data).length === 0 ? [] : data.prefixOptions;
        if (prefixes.length !== 0) {
            prefixes.forEach(prefix => createTableRow(prefix));
        }
    })

    urlFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        chrome.storage.sync.set({jiraBaseUrl: e.target[0].value}, () => {
            titleElement.textContent = `Current Url: ${e.target[0].value}`
        })
    })

    const idInput = document.getElementById('update-jira-prefix-id')
    const nameInput = document.getElementById('update-jira-prefix-name');
    const prefixInput = document.getElementById('update-jira-prefix');
    const prefixForm = document.getElementById('prefix-form');

    prefixForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = idInput.value;
        const name = nameInput.value;
        const prefix = prefixInput.value;
        chrome.storage.sync.get('prefixOptions', data => {
            const prefixes = Object.keys(data).length === 0 ? [] : data.prefixOptions;
            let updatedPrefixes;
            if (id) {
                updatedPrefixes = prefixes.map(p => {
                    if (p.id === id) {
                        return {id, name, prefix}
                    }
                    return p;
                })
            } else {
                const id = uniqueId();
                updatedPrefixes = [...prefixes, {id, name, prefix}];
            }
            chrome.storage.sync.set({prefixOptions: updatedPrefixes})
        })
        idInput.value = null;
        nameInput.value = "";
        prefixInput.value = "";
    })
})