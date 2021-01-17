import handleOptionLoad from './options';
import handleLoadPopUp from './popup';

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.href.indexOf('options.html') > -1) {
    handleOptionLoad();
  } else {
    handleLoadPopUp();
  }
});
