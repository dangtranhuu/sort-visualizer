document.addEventListener('DOMContentLoaded', () => {
  const originalArr = [15, 5, 8, 20, 10];
  let logs = [];

  function renderColumns(array) {
    const container = document.getElementById('columns');
    container.innerHTML = '';
    array.forEach(val => {
      const div = document.createElement('div');
      div.className = 'column';
      div.style.height = (val * 3) + 'px';
      div.textContent = val;
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
    let renderArr = [...originalArr];
    for (const step of logs) {
      highlightLine(step.line);
      renderArr[step.i] = step.val;
      renderColumns(renderArr);
      await new Promise(res => setTimeout(res, 500));
    }
    highlightLine(-1);
    document.getElementById('finalResult').innerText = '✅ Sắp xếp hoàn tất: [' + renderArr.join(', ') + ']';
  }

  document.getElementById('runBtn').addEventListener('click', () => {
    logs = [];
    let currentLine = 0;

    const code = document.getElementById('userCode').value.trim();
    const codeLines = code.split('\n');
    document.getElementById('codeView').innerHTML = codeLines.map(l => `<span>${l}</span>`).join('');

    // Tạo proxy trên bản sao để ghi log
    const simArr = [...originalArr];
    const proxyArr = new Proxy(simArr, {
      set(target, prop, value) {
        if (!isNaN(prop)) {
          logs.push({ type: 'assign', i: Number(prop), val: value, line: currentLine });
          target[prop] = value;
        }
        return true;
      },
      get(target, prop) {
        return target[prop];
      }
    });

    try {
      const wrappedCode = codeLines.map((line, index) => `currentLine = ${index}; ${line}`).join('\n');
      const fn = new Function('arr', 'currentLine', 'logs', wrappedCode);
      fn(proxyArr, currentLine, logs);

      // 🧠 Log rõ ràng ra console
      console.log("👉 Mảng ban đầu:", [...originalArr]);
      console.log("👉 Mảng sau khi chạy:", proxyArr);
      console.log("📋 Logs:", logs);

      renderColumns([...originalArr]);
      document.getElementById('finalResult').innerText = '';
      replayLogs();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi chạy code: " + err.message);
    }
  });
});
