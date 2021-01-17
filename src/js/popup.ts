import { IRowData } from './options';
import {
  combineElements, createElement, findPrefix, missingOptions,
} from './utils';

const createRadioButtons = (rowData: IRowData) => {
  const { id, name, prefix } = rowData;
  const inputElement = createElement('input', ['form-check-input'], {
    type: 'radio', name: 'jira-options', id, value: prefix,
  });
  const labelElement = createElement('label', ['form-check-label'], { for: id }, name);
  const wrapperDivElement = createElement('div', ['form-check']);
  const wrapperDiv = combineElements(wrapperDivElement, [inputElement, labelElement]);
  const parentElement = document.querySelector<HTMLDivElement>('#jira-options');
  if (parentElement) parentElement.appendChild(wrapperDiv);
};

const handleLoadPopUp = () => {
  let baseUrl = '';
  const baseUrlSpanElement = document.querySelector<HTMLSpanElement>('#jira-url-base');
  const formElement = document.querySelector<HTMLFormElement>('form');
  // eslint-disable-next-line no-undef
  chrome.storage.sync.get('jiraBaseUrl', (data) => {
    if (!data.jiraBaseUrl) {
      missingOptions();
    } else {
      baseUrl = data.jiraBaseUrl;
      const baseUrlTextNode = document.createTextNode(data.jiraBaseUrl);
      if (baseUrlSpanElement) baseUrlSpanElement.appendChild(baseUrlTextNode);
    }
  });

  // eslint-disable-next-line no-undef
  chrome.storage.sync.get('prefixOptions', (data) => {
    if (Object.keys(data).length === 0 || data.prefixOptions.length === 0) {
      missingOptions();
    } else {
      data.prefixOptions.forEach((prefix: IRowData) => createRadioButtons(prefix));
      const firstInputElement = document.querySelector<HTMLInputElement>('.form-check > .form-check-input');
      if (firstInputElement) firstInputElement.checked = true;
    }
  });

  if (formElement) {
    formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      const ticketNumberInput = document.querySelector<HTMLInputElement>('#jira-url');
      const ticketNumber = ticketNumberInput ? ticketNumberInput.value : '';
      const jiraOptionsInputs = document.querySelectorAll<HTMLInputElement>('#jira-options > .form-check > input');
      const prefix = jiraOptionsInputs ? findPrefix(Array.from(jiraOptionsInputs)) : '';
      const url = `${baseUrl}/browse/${prefix}-${ticketNumber}`;
      // eslint-disable-next-line no-undef
      chrome.tabs.create({ url });
    });
  }
};

export default handleLoadPopUp;
