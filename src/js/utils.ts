export const uniqueID = (): string => {
  let uuid = '';
  for (let i = 0; i < 32; i += 1) {
    const randomNumber = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (randomNumber & 3 | 8) : randomNumber)).toString(16);
  }
  return uuid;
};

export const createElement = (element: string, classNames:string[] = [], attributes: {[key: string]: string} = {}, name: string | null = null) => {
  const newElement = document.createElement(element);
  if (classNames.length > 0) {
    newElement.classList.add(...classNames);
  }
  Object.keys(attributes).forEach((attribute) => {
    newElement.setAttribute(attribute, attributes[attribute]);
  });
  if (name) {
    newElement.innerHTML = name;
  }
  return newElement;
};

export const combineElements = (parentElement: HTMLElement, childElements: HTMLElement[]): HTMLElement => {
  const newElement = parentElement;
  childElements.forEach((element) => newElement.appendChild(element));
  return newElement;
};

export const clearElementChildren = (element: HTMLElement) => {
  while (element.lastElementChild) {
    element.removeChild(element.lastElementChild);
  }
};

export const findPrefix = (elements: HTMLInputElement[]): string => {
  // eslint-disable-next-line consistent-return
  let prefix = '';
  elements.forEach((element) => {
    if (element.checked) {
      prefix = element.value;
    }
  });
  return prefix;
};

export const missingOptions = () => {
  const selector = 'jira-options';
  const missingCardBody = document.querySelector<HTMLDivElement>(`#${selector}-missing`);
  const presentCardBody = document.querySelector<HTMLDivElement>(`#${selector}-present`);
  if (missingCardBody) missingCardBody.classList.remove('d-none');
  if (presentCardBody) presentCardBody.classList.add('d-none');
};
