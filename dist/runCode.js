function encodeHtml(str) {
  return String(str)
    .replace(/&/g, `&amp;`)
    .replace(/"/g, `&quot;`)
    .replace(/'/g, `&#39;`)
    .replace(/</g, `&lt;`)
    .replace(/>/g, `&gt;`);
}
function _mdSetCodeResult(btn, $r, result, isHtml, isError) {
  $r.style.display = `block`;
  $r.style.borderColor = `rgba(45,112,145,.3)`;
  $r.style.backgroundColor = `#ebf7fd`;
  $r.style.color = `#2d7091`;
  if (isError) {
    $r.style.borderColor = `rgba(216,80,48,.3)`;
    $r.style.backgroundColor = `#fff1f0`;
    $r.style.color = `#d85030`;
  }
  if (isHtml) {
    $r.innerHTML = result;
  } else {
    var ss = result.split(`\n`);
    const fragment = document.createDocumentFragment();
    ss.forEach(function (s) {
      if (s) {
        const span = document.createElement(`span`);
        span.innerText = encodeHtml(s);
        fragment.appendChild(span);
        fragment.appendChild(document.createElement(`br`));
      }
    });

    $r.innerHTML = ``;
    $r.appendChild(fragment);
  }
}

function _mdShowCodeResult(btn, $r, result) {
  _mdSetCodeResult(btn, $r, result, false);
}

function _mdShowCodeError(btn, $r, result, isHtml) {
  _mdSetCodeResult(btn, $r, result, isHtml, true);
}
function execute_javascript(tid, btn) {
  const codeBox = document.getElementById(tid);
  const textBox = codeBox.querySelector(`textarea`);
  const resultBox = codeBox.querySelector(`.code-result`);
  const code = textBox.value;
  (function () {
    // prepare console.log
    var buffer = ``,
      _log = function (s) {
        console.log(s);
        buffer = `${buffer}${s}\n`;
      },
      _warn = function (s) {
        console.warn(s);
        buffer = `${buffer}${s}\n`;
      },
      _error = function (s) {
        console.error(s);
        buffer = `${buffer}${s}\n`;
      },
      _console = {
        trace: _log,
        debug: _log,
        log: _log,
        info: _log,
        warn: _warn,
        error: _error,
      };
    try {
      eval(`(function() {\n var console = _console; \n ${code} \n})();`);
      if (!buffer) {
        buffer = `(no output)`;
      }
      _mdShowCodeResult(btn, resultBox, buffer);
    } catch (e) {
      buffer = buffer + String(e);
      _mdShowCodeError(btn, resultBox, buffer);
    }
  })();
}
