document.addEventListener('DOMContentLoaded', () => {
  const originalArr = [15, 5, 8, 20, 10];
  let logs = [];

  function renderColumns(array, pointerI = null, pointerJ = null) {
    const container = document.getElementById('columns');
    container.innerHTML = '';

    array.forEach((val, idx) => {
      const div = document.createElement('div');
      div.className = 'column';
      div.style.height = (val * 3) + 'px';
      div.textContent = val;
      div.dataset.index = idx;
      div.style.position = 'relative';

      if (idx === pointerI) {
        const pi = document.createElement('div');
        pi.className = 'pointer pointer-i';
        pi.textContent = 'i';
        div.appendChild(pi);
      }
      if (idx === pointerJ) {
        const pj = document.createElement('div');
        pj.className = 'pointer pointer-j';
        pj.textContent = 'j';
        div.appendChild(pj);
      }

      container.appendChild(div);
    });
  }

  function highlightLine(n) {
    const lines = document.querySelectorAll('#codeView span');
    lines.forEach((line, idx) => {
      line.classList.toggle('highlight', idx === n);
    });
  }

  async function replayLogs() {
    const renderArr = [...originalArr];

    for (const step of logs) {
      highlightLine(step.line);

      if (step.type === 'exec') {
        renderColumns(renderArr, step.i, step.j);
      }

      if (step.type === 'swap') {
        const container = document.getElementById('columns');
        const columns = container.children;
        const col1 = columns[step.i];
        const col2 = columns[step.j];

        const offset1 = col1.offsetLeft;
        const offset2 = col2.offsetLeft;

        col1.style.transition = 'transform 0.5s ease';
        col2.style.transition = 'transform 0.5s ease';
        col1.style.transform = `translateX(${offset2 - offset1}px)`;
        col2.style.transform = `translateX(${offset1 - offset2}px)`;

        await new Promise(res => setTimeout(res, 500));

        // Thực hiện hoán đổi dữ liệu
        const temp = renderArr[step.i];
        renderArr[step.i] = renderArr[step.j];
        renderArr[step.j] = temp;

        // Xóa hiệu ứng
        col1.style.transition = '';
        col2.style.transition = '';
        col1.style.transform = '';
        col2.style.transform = '';

        renderColumns(renderArr, step.i, step.j);
      }

      await new Promise(res => setTimeout(res, 800));
    }

    highlightLine(-1);
    document.getElementById('finalResult').innerText =
      '✅ Sắp xếp hoàn tất: [' + renderArr.join(', ') + ']';
  }

  document.getElementById('runBtn').addEventListener('click', () => {
    logs = [];

    const code = document.getElementById('userCode').value.trim();
    const codeLines = code.split('\n');
    document.getElementById('codeView').innerHTML = codeLines.map(l => `<span>${l}</span>`).join('');

    const arr = [...originalArr];
    window.__currentLine = 0;

    const context = {
      arr,
      logs,
      swap: (i, j) => {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        logs.push({
          type: 'swap',
          i,
          j,
          line: window.__currentLine,
          desc: `Swap arr[${i}] <-> arr[${j}]`
        });
      }
    };

    try {
      const wrappedCode = codeLines.map((line, index) => {
        return `
          window.__currentLine = ${index};
          try {
            logs.push({
              type: 'exec',
              line: ${index},
              i: (typeof i !== 'undefined' ? i : null),
              j: (typeof j !== 'undefined' ? j : null)
            });
          } catch (e) {
            logs.push({ type: 'exec', line: ${index}, i: null, j: null });
          }
          ${line}
        `;
      }).join('\n');



      const userFn = new Function('arr', 'swap', 'logs', wrappedCode);
      userFn(context.arr, context.swap, context.logs);

      console.clear();
      console.log("👉 Mảng ban đầu:", [...originalArr]);
      console.log("👉 Mảng sau khi chạy:", context.arr);
      console.table(logs);

      renderColumns([...originalArr]);
      document.getElementById('finalResult').innerText = '';
      replayLogs();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi chạy code: " + err.message);
    }
  });
});
