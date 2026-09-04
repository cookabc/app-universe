'use strict';
/* 0h n0：黑点数字 = 同行列中被白块挡住前可见的黑点数。 */
(function () {
  const sizeSel = document.getElementById('size');
  const gridEl = document.getElementById('grid');
  const msgEl = document.getElementById('msg');
  const timerEl = document.getElementById('timer');
  [5, 6, 7, 8, 9].forEach(s => {
    const o = document.createElement('option');
    o.value = s; o.textContent = s + ' × ' + s;
    sizeSel.appendChild(o);
  });
  let n = +localStorage.getItem('ohn0-n') || 6;
  sizeSel.value = n;

  let sol, locked, clue, cells, cellEls, startAt, timerId, done;

  function countVisible(g, i) {
    const x = i % n, y = (i / n) | 0;
    let c = 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      let nx = x + dx, ny = y + dy;
      while (nx >= 0 && ny >= 0 && nx < n && ny < n) {
        const j = ny * n + nx;
        if (!g[j]) break;      // 白块挡视线
        c++;
        nx += dx; ny += dy;
      }
    }
    return c;
  }

  function newGame() {
    done = false;
    // 生成解：1=黑点 0=白块
    do {
      sol = Array.from({ length: n * n }, () => Math.random() < 0.55 ? 1 : 0);
    } while (!sol.includes(0) || !sol.includes(1));
    clue = sol.map((v, i) => v ? countVisible(sol, i) : 0);
    locked = sol.map(() => Math.random() < 0.42);
    cells = sol.map((v, i) => locked[i] ? (v ? 1 : 2) : 0);
    msgEl.textContent = '';
    gridEl.classList.remove('won');
    startAt = performance.now();
    clearInterval(timerId);
    timerId = setInterval(showTime, 500);
    showTime();
    render();
    update();
  }

  function fmt(ms) {
    const s = (ms / 1000) | 0;
    return String((s / 60) | 0).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }
  function showTime() { timerEl.textContent = fmt(performance.now() - startAt); }

  function render() {
    gridEl.innerHTML = '';
    gridEl.style.gridTemplateColumns = 'repeat(' + n + ',1fr)';
    cellEls = [];
    for (let i = 0; i < n * n; i++) {
      const d = document.createElement('div');
      d.addEventListener('pointerdown', e => {
        e.preventDefault();
        if (done || locked[i]) return;
        cells[i] = e.button === 2 ? (cells[i] + 2) % 3 : (cells[i] + 1) % 3;
        update();
      });
      d.addEventListener('contextmenu', e => e.preventDefault());
      gridEl.appendChild(d);
      cellEls.push(d);
    }
  }

  function update() {
    // 玩家视角下的可见计数
    const pg = cells.map(v => v === 1 ? 1 : 0);
    let wrong = false, empty = false;
    for (let i = 0; i < n * n; i++) {
      const d = cellEls[i], v = cells[i];
      let cls = 'tc ', text = '';
      if (v === 0) { cls += 'e'; empty = true; }
      else if (v === 1) {
        cls += 'dot';
        const see = countVisible(pg, i);
        text = see;
        if (locked[i]) text = clue[i];        // 给定格显示固定数字
        else if (see === 0) cls += ' err';    // 孤立黑点高亮提示
      } else cls += 'blocker';
      if (locked[i]) cls += ' given';
      // 给定点校验
      if (v === 1 && locked[i]) {
        const see = countVisible(pg, i);
        if (see !== clue[i]) { cls += ' err'; wrong = true; }
      }
      d.className = cls;
      d.textContent = text;
    }
    if (!done && !empty && !wrong) {
      done = true;
      clearInterval(timerId);
      gridEl.classList.add('won');
      msgEl.textContent = '✓ 完成！用时 ' + fmt(performance.now() - startAt);
    }
  }

  sizeSel.onchange = () => {
    n = +sizeSel.value;
    localStorage.setItem('ohn0-n', n);
    newGame();
  };
  document.getElementById('new').onclick = newGame;
  newGame();
})();
