'use strict';
/* Nonogram 数织（纯黑白单色） */
(function () {
  const PUZZLES = [
    { name: '爱心 / 5×5', g: [
      '.###.',
      '#####',
      '#####',
      '.###.',
      '..#..'] },
    { name: '小树 / 10×10', g: [
      '....#.....',
      '...###....',
      '...###....',
      '..#####...',
      '..#####...',
      '.#######..',
      '.#######..',
      '#########.',
      '....#.....',
      '...###....'] },
    { name: '蘑菇 / 10×10', g: [
      '..#####...',
      '.#######..',
      '#########.',
      '#########.',
      '#..###..#.',
      '...###....',
      '...###....',
      '...###....',
      '...###....',
      '..#####...'] },
    { name: '外星人 / 10×10', g: [
      '..#....#..',
      '...#..#...',
      '..######..',
      '.##.##.##.',
      '##########',
      '#.######.#',
      '#.#....#.#',
      '...#..#...',
      '..#....#..',
      '..##..##..'] },
    { name: '小房子 / 10×10', g: [
      '....#.....',
      '...###....',
      '..#####...',
      '.#######..',
      '#########.',
      '..#...#...',
      '..#...#...',
      '..#####...',
      '..#...#...',
      '..#####...'] },
    { name: '骷髅 / 15×15', g: [
      '....#######....',
      '..###########..',
      '.#############.',
      '.####....####..',
      '.###......###..',
      '.###..##..###..',
      '.####....####..',
      '..###########..',
      '....#######....',
      '.....#####.....',
      '....##.#.##....',
      '....#.....#....',
      '....#######....',
      '....#.#.#.#....',
      '....#######....'] },
    { name: '随机 / 12×12', random: 12 },
  ];

  const pzSel = document.getElementById('pz');
  const gridEl = document.getElementById('grid');
  const msgEl = document.getElementById('msg');
  const pinfo = document.getElementById('pinfo');
  const fillBtn = document.getElementById('modeFill');
  const xBtn = document.getElementById('modeX');

  PUZZLES.forEach((p, i) => {
    const o = document.createElement('option');
    o.value = i; o.textContent = p.name;
    pzSel.appendChild(o);
  });

  let sol, Wd, Ht, cells, cellEls, rowClues, colClues, done, mode = 'fill';
  let dragging = false, dragVal = 0;

  function clues(line) {
    const out = []; let c = 0;
    for (const v of line) { if (v) c++; else if (c) { out.push(c); c = 0; } }
    if (c) out.push(c);
    return out.length ? out : [0];
  }

  function setMode(m) {
    mode = m;
    fillBtn.classList.toggle('on', m === 'fill');
    fillBtn.classList.toggle('ghost', m !== 'fill');
    xBtn.classList.toggle('on', m === 'x');
    xBtn.classList.toggle('ghost', m !== 'x');
  }
  fillBtn.onclick = () => setMode('fill');
  xBtn.onclick = () => setMode('x');

  function newGame() {
    const p = PUZZLES[+pzSel.value];
    let g = p.g;
    if (p.random) {
      g = [];
      for (let r = 0; r < p.random; r++) {
        let row = '';
        for (let c = 0; c < p.random; c++) row += Math.random() < 0.5 ? '#' : '.';
        g.push(row);
      }
    }
    Ht = g.length; Wd = g[0].length;
    sol = [];
    for (let r = 0; r < Ht; r++) for (let c = 0; c < Wd; c++) sol.push(g[r][c] === '#' ? 1 : 0);
    cells = new Array(Wd * Ht).fill(0);
    rowClues = []; colClues = [];
    for (let r = 0; r < Ht; r++) rowClues.push(clues(sol.slice(r * Wd, (r + 1) * Wd)));
    for (let c = 0; c < Wd; c++) {
      const col = [];
      for (let r = 0; r < Ht; r++) col.push(sol[r * Wd + c]);
      colClues.push(clues(col));
    }
    done = false;
    msgEl.textContent = '';
    gridEl.classList.remove('won');
    pinfo.textContent = Wd + ' × ' + Ht;
    render();
  }

  function render() {
    gridEl.innerHTML = '';
    cellEls = [];
    const cs = Math.max(20, Math.min(34, Math.floor((Math.min(window.innerWidth - 60, 560) - 100) / Wd)));
    gridEl.style.gridTemplateColumns = '92px repeat(' + Wd + ',' + cs + 'px)';
    gridEl.style.gridAutoRows = cs + 'px';
    gridEl.style.touchAction = 'none';

    const corner = document.createElement('div');
    gridEl.appendChild(corner);
    colClues.forEach(cl => {
      const d = document.createElement('div');
      d.className = 'nclue col';
      d.style.minHeight = '46px';
      d.innerHTML = cl.map(v => '<span>' + v + '</span>').join('');
      gridEl.appendChild(d);
    });
    for (let r = 0; r < Ht; r++) {
      const rc = document.createElement('div');
      rc.className = 'nclue row';
      rc.innerHTML = rowClues[r].map(v => '<span>' + v + '</span>').join('');
      gridEl.appendChild(rc);
      for (let c = 0; c < Wd; c++) {
        const d = document.createElement('div');
        d.className = 'nc' + (c % 5 === 0 ? ' b5' : '') + (r % 5 === 0 ? ' t5' : '');
        const i = r * Wd + c;
        d.dataset.i = i;
        d.addEventListener('pointerdown', e => {
          e.preventDefault();
          if (done) return;
          const useX = e.button === 2 || mode === 'x';
          dragVal = useX ? (cells[i] === 2 ? 0 : 2) : (cells[i] === 1 ? 0 : 1);
          dragging = true;
          apply(i);
        });
        d.addEventListener('pointerenter', () => { if (dragging && !done) apply(i); });
        d.addEventListener('contextmenu', e => e.preventDefault());
        gridEl.appendChild(d);
        cellEls.push(d);
      }
    }
    // 触屏拖动：隐式指针捕获导致 pointerenter 不触发，用 elementFromPoint 兜底
    gridEl.addEventListener('pointermove', e => {
      if (!dragging || done) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el && el.dataset && el.dataset.i !== undefined) apply(+el.dataset.i);
    });
    update();
  }

  function apply(i) {
    if (cells[i] === dragVal) return;
    cells[i] = dragVal;
    update();
  }

  addEventListener('pointerup', () => dragging = false);

  function lineDone(getLine, cl) {
    const line = getLine();
    // 该行所有黑格是否与答案一致
    for (let k = 0; k < line.length; k++) if ((line[k] === 1) !== (cl.solLine[k] === 1)) return false;
    return true;
  }

  function update() {
    for (let i = 0; i < cells.length; i++) {
      const d = cellEls[i];
      const keep = d.className.match(/[bt]5/g) || [];
      d.className = 'nc ' + (cells[i] === 1 ? 'fill' : cells[i] === 2 ? 'x' : '') + (keep.length ? ' ' + keep.join(' ') : '');
    }
    // 行列完成划线
    const clueEls = gridEl.querySelectorAll('.nclue');
    for (let c = 0; c < Wd; c++) {
      const ok = lineDone(() => { const a = []; for (let r = 0; r < Ht; r++) a.push(cells[r * Wd + c]); return a; },
        { solLine: (() => { const a = []; for (let r = 0; r < Ht; r++) a.push(sol[r * Wd + c]); return a; })() });
      clueEls[c].classList.toggle('done', ok);
    }
    for (let r = 0; r < Ht; r++) {
      const ok = lineDone(() => cells.slice(r * Wd, (r + 1) * Wd),
        { solLine: sol.slice(r * Wd, (r + 1) * Wd) });
      clueEls[Wd + r].classList.toggle('done', ok);
    }
    // 胜利判定
    if (!done && cells.every((v, i) => (v === 1) === (sol[i] === 1))) {
      done = true;
      gridEl.classList.add('won');
      // 清掉所有 ×，展示成品
      cells = cells.map(v => v === 1 ? 1 : 0);
      for (let i = 0; i < cells.length; i++) {
        const keep = cellEls[i].className.match(/[bt]5/g) || [];
        cellEls[i].className = 'nc ' + (cells[i] ? 'fill' : '') + (keep.length ? ' ' + keep.join(' ') : '');
      }
      msgEl.textContent = '✓ 完成！';
    }
  }

  document.getElementById('clear').onclick = () => {
    if (done) return;
    cells = new Array(Wd * Ht).fill(0);
    update();
  };
  pzSel.onchange = newGame;
  addEventListener('resize', () => { if (sol) render(); });
  setMode('fill');
  newGame();
})();
