import {
  createElement, combineElements, uniqueID, clearElementChildren,
} from './utils';

export interface IRowData {
    id: string;
    name: string;
    prefix: string;
}

function editTableRowEntry(id: string, name: string, prefix: string) {
  const selector = 'update-jira-prefix';
  const idInput = document.querySelector<HTMLInputElement>(`#${selector}-id`);
  const nameInput = document.querySelector<HTMLInputElement>(`#${selector}-name`);
  const prefixInput = document.querySelector<HTMLInputElement>(`#${selector}`);
  if (idInput && nameInput && prefixInput) {
    idInput.value = id;
    nameInput.value = name;
    prefixInput.value = prefix;
  }
}

function deleteTableRowEntry(id: string) {
  // eslint-disable-next-line no-undef
  chrome.storage.sync.get('prefixOptions', (data) => {
    const newPrefixes = data.prefixOptions.filter((prefix: IRowData) => prefix.id !== id);
    // eslint-disable-next-line no-undef
    chrome.storage.sync.set({ prefixOptions: newPrefixes });
  });
}

function createTableRow({ id, name, prefix }: IRowData) {
  const tableRowElement = createElement('tr', [], { id });
  const tableRowNameElement = createElement('td', [], {}, name);
  const tableRowPrefixElement = createElement('td', [], {}, prefix);
  const tableRowActionsElement = createElement('td');
  const editButtonElement = createElement('button', ['btn', 'btn-sm', 'btn-success', 'me-3'], {}, 'Edit');
  const deleteButtonElement = createElement('button', ['btn', 'btn-sm', 'btn-danger'], {}, 'Delete');
  const tableRowActions = combineElements(tableRowActionsElement, [editButtonElement, deleteButtonElement]);
  const tableRows = combineElements(tableRowElement, [tableRowNameElement, tableRowPrefixElement, tableRowActions]);
  const tableBodyElement = document.querySelector('tbody');
  if (tableBodyElement) tableBodyElement.appendChild(tableRows);

  editButtonElement.addEventListener('click', () => {
    editTableRowEntry(id, name, prefix);
  });

  deleteButtonElement.addEventListener('click', () => {
    deleteTableRowEntry(id);
  });
}

const handleOptionLoad = () => {
  const urlSelector = 'jira-url';
  const urlInput = document.querySelector<HTMLInputElement>(`#update-${urlSelector}`);
  const titleElement = document.querySelector(`#${urlSelector}`);
  // eslint-disable-next-line no-undef
  chrome.storage.sync.get('jiraBaseUrl', (data) => {
    const currentUrl = Object.keys(data).length === 0 ? '' : data.jiraBaseUrl;
    if (urlInput) urlInput.value = currentUrl;
    if (titleElement) titleElement.innerHTML = `Current URL: ${currentUrl}`;
  });

  const urlForm = document.querySelector<HTMLFormElement>('#url-form');

  // eslint-disable-next-line no-undef
  chrome.storage.sync.get('prefixOptions', (data) => {
    const prefixes = Object.keys(data).length === 0 ? [] : data.prefixOptions;
    if (prefixes.length !== 0) prefixes.forEach((prefix: IRowData) => createTableRow(prefix));
  });

  if (urlForm) {
    urlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newUrl = urlInput ? urlInput.value : '';
      // eslint-disable-next-line no-undef
      chrome.storage.sync.set({ jiraBaseUrl: newUrl }, () => {
        if (titleElement) titleElement.innerHTML = `Current URL: ${newUrl}`;
      });
    });
  }

  const prefixSelector = 'update-jira-prefix';

  const idInput = document.querySelector<HTMLInputElement>(`#${prefixSelector}-id`);
  const nameInput = document.querySelector<HTMLInputElement>(`#${prefixSelector}-name`);
  const prefixInput = document.querySelector<HTMLInputElement>(`#${prefixSelector}`);
  const prefixForm = document.querySelector<HTMLFormElement>('#prefix-form');

  if (prefixForm) {
    prefixForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = idInput ? idInput.value : null;
      const name = nameInput ? nameInput.value : '';
      const prefix = prefixInput ? prefixInput.value : '';
      // eslint-disable-next-line no-undef
      chrome.storage.sync.get('prefixOptions', (data) => {
        const prefixes: IRowData[] = Object.keys(data).length === 0 ? [] : data.prefixOptions;
        let updatedPrefixes;
        if (id && id !== '') {
          updatedPrefixes = prefixes.map((prefixData: IRowData) => {
            if (prefixData.id === id) {
              return { id, name, prefix };
            }
            return prefixData;
          });
        } else {
          const newId = uniqueID();
          updatedPrefixes = [...prefixes, { id: newId, name, prefix }];
        }
        // eslint-disable-next-line no-undef
        chrome.storage.sync.set({ prefixOptions: updatedPrefixes });
      });
      if (idInput) idInput.value = '';
      if (nameInput) nameInput.value = '';
      if (prefixInput) prefixInput.value = '';
    });
  }

  // eslint-disable-next-line no-undef
  chrome.storage.onChanged.addListener((changes) => {
    if (Object.keys(changes).indexOf('prefixOptions') > -1) {
      const tableBodyElement = document.querySelector('tbody');
      if (tableBodyElement) clearElementChildren(tableBodyElement);
      changes.prefixOptions.newValue.forEach((tableRow: IRowData) => createTableRow(tableRow));
    }
  });
};

export default handleOptionLoad;
