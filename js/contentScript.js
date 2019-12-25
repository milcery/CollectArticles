const doc = document;
const KEY = '__book';
const EVALKEY = '__bookEval';
const KEYTOTAL = '__bookTotal';

function SingleChapter(titleDom, conDom) {
  let content = window.localStorage.getItem(KEY) || '';
  window.localStorage.setItem(KEY,
`
${content}
${titleDom ? doc.querySelector(titleDom).textContent : ''}
${conDom ? doc.querySelector(conDom).textContent : ''}
`);
}

function tapNextBtn(dom) {
  doc.querySelector(dom).click();
}

chrome.extension.onMessage.addListener(function(req, send, sendMsg) {
  if (req.api === 'getText') {
    window.localStorage.setItem(KEYTOTAL, req.total - 1);
    window.localStorage.setItem(EVALKEY,`
      SingleChapter('${req.titleDom}', '${req.conDom}');
      tapNextBtn('${req.nextDom}');
    `);
    SingleChapter(req.titleDom, req.conDom);
    tapNextBtn(req.nextDom);
    sendMsg();
  }
  else if (req.api === 'clear') {
    window.saveAs(new Blob([window.localStorage.getItem(KEY)], {
      type: 'application/ms-txt'
    }), req.name + '.txt');
    window.localStorage.removeItem(KEY);
  }
});

window.onload = function () {
  let total = Number(window.localStorage.getItem(KEYTOTAL) || 0);
  if (total > 0) {
    window.localStorage.setItem(KEYTOTAL, total - 1);
    eval(window.localStorage.getItem(EVALKEY))
  } else {
    window.localStorage.removeItem(KEYTOTAL);
    window.localStorage.removeItem(EVALKEY);
  }
};

console.log('init book2txt');
