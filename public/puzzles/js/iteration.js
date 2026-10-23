'use strict';
/* 黑白迭代：点击翻转十字区域，拼出目标图形。目标由随机点击生成，保证可解。 */
(function () {
  const boardEl = document.getElementById('board');
  const targetEl = document.getElementById('target');
  const movesEl = document.getElementById('moves');
  const msgEl = document.getElementById('msg');
  const sizeSel = document.getElementById('size');

  let n = 4, board, target, moves, done;

  function flip(g, i) {
    g[i] ^= 1;
    const x = i % n, y = (i / n) | 0;
    if (x > 0) g[i - 1] ^= 1;
    if (x < n - 1) g[i + 1] ^= 1;
    if (y > 0) g[i - n] ^= 1;
    if (y < n - 1) g[i + n] ^= 1;
  }

  function newGame() {
    n = +sizeSel.value;
    board = new Array(n * n).fill(0);
    moves = 0; done = false;
    msgEl.textContent = '';
    boardEl.classList.remove('won');
    // 目标：从空白开始随机点 k 次（保证有解且非空白）
    const k = n + 3;
    do {
      target = new Array(n * n).fill(0);
      for (let t = 0; t < k; t++) flip(target, (Math.random() * n * n) | 0);
    } while (target.every(v => v === 0));
    render();
  }

  function renderGrid(el, g, clickable) {
    el.innerHTML = '';
    el.style.gridTemplateColumns = 'repeat(' + n + ',1fr)';
    g.forEach((v, i) => {
      const d = document.createElement('div');
      d.className = 'ic' + (v ? ' on' : '');
      if (clickable) d.addEventListener('pointerdown', e => {
        e.preventDefault();
        if (done) return;
        flip(board, i);
        moves++;
        movesEl.textContent = moves + ' 步';
        render();
        if (board.every((b, j) => b === target[j])) {
          done = true;
          boardEl.classList.add('won');
          msgEl.textContent = '✓ 完成 / ' + moves + ' 步';
        }
      });
      el.appendChild(d);
    });
  }

  function render() {
    movesEl.textContent = moves + ' 步';
    renderGrid(boardEl, board, true);
    renderGrid(targetEl, target, false);
  }

  document.getElementById('new').onclick = newGame;
  document.getElementById('reset').onclick = () => {
    board = new Array(n * n).fill(0);
    moves = 0; done = false;
    msgEl.textContent = '';
    boardEl.classList.remove('won');
    render();
  };
  sizeSel.onchange = newGame;
  newGame();
})();
