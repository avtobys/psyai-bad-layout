// Import our custom CSS
import '../scss/styles.scss';

// Import only the Bootstrap components we need
import { Popover, Tooltip, Offcanvas } from 'bootstrap';


// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]')
  .forEach(el => {
    new Popover(el)
  })

document.querySelectorAll('[data-bs-toggle="tooltip"]')
  .forEach(el => {
    new Tooltip(el)
  })


document.addEventListener('DOMContentLoaded', function () {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new Tooltip(tooltipTriggerEl);
  });
});


function blockKeys(event) {
  event.preventDefault();
}

// Разблокировка нажатий клавиш
function unblockKeys() {
  document.removeEventListener('keydown', blockKeys);
}

window.loading = function (state) {
  window.loadblock && loadblock.remove();
  unblockKeys();
  if (!state || state == 'show') {
    document.addEventListener('keydown', blockKeys);
    document.body.insertAdjacentHTML('beforeend', '<div id="loadblock" class="fade" style="position:fixed;width:100%;height:100%;top:0;left:0;z-index:99999;opacity:1;display:flex;justify-content:center;align-items:center;flex-direction:column;background:rgba(0,0,0,.6);"><style>@keyframes cssload-spin{100%{transform:rotate(360deg);transform:rotate(360deg)}}@-o-keyframes cssload-spin{100%{-o-transform:rotate(360deg);transform:rotate(360deg)}}@-ms-keyframes cssload-spin{100%{-ms-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframes cssload-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-moz-keyframes cssload-spin{100%{-moz-transform:rotate(360deg);transform:rotate(360deg)}}</style><div style="width: 100%;height:49px;text-align:center;"><div style="width:49px;height:49px;margin:0 auto;border:3px solid rgb(191,191,191);border-radius:50%;border-left-color:transparent;border-right-color:transparent;animation:cssload-spin 575ms infinite linear;-o-animation: cssload-spin 575ms infinite linear;-ms-animation: cssload-spin 575ms infinite linear;-webkit-animation:cssload-spin 575ms infinite linear;-moz-animation: cssload-spin 575ms infinite linear;"></div><div style="color:#fff;margin-top:15px;font-size:14px;">Ожидаем...</div></div></div>');
    setTimeout(() => {
      window.loadblock && loadblock.focus();
      window.loadblock && loadblock.click();
    }, 50);
  }
}

loading();

window.addEventListener('load', () => {
  loading('hide');
})
