const min = 10;
const max = 50;
let arrRoot = 0;
let isPaused = false;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const genRandom = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min);

const genCol = (id, val) => {
  let styleClass = id % 10;
  return `
    <div class="column column${styleClass}" id="col${id}" style="height: ${val * 10}px;" value="${val}">
      ${val}
    </div>
  `;
};

const genIndex = (val) => `<div class="index-item">${val}</div>`;
const genIMarker = () => `<div class="i-marker"></div>`;
const genJMarker = () => `<div class="j-marker"></div>`;

const genMaps = (n) => {
  const container = document.getElementById("columns");
  const index = document.getElementById("indexs");
  const iLine = document.getElementById("iLine");
  const jLine = document.getElementById("jLine");

  const arr = genRandom(n);
  arrRoot = arr;

  container.innerHTML = "";
  index.innerHTML = "";
  iLine.innerHTML = "";
  jLine.innerHTML = "";

  for (let i = 0; i < arr.length; i++) {
    container.innerHTML += genCol(i, arr[i]);
    index.innerHTML += genIndex(i);
    iLine.innerHTML += genIMarker();
    jLine.innerHTML += genJMarker();
  }
};

function updatePointers(iIndex, jIndex) {
  const iMarkers = document.querySelectorAll(".i-marker");
  const jMarkers = document.querySelectorAll(".j-marker");

  iMarkers.forEach((el, idx) => el.innerText = idx === iIndex ? "i" : "");
  jMarkers.forEach((el, idx) => el.innerText = idx === jIndex ? "j" : "");
}

async function waitWhilePaused() {
  while (isPaused) await delay(100);
}

async function swapColumns(col1, col2) {
  const left1 = col1.offsetLeft;
  const left2 = col2.offsetLeft;

  col1.style.transition = "transform 1s";
  col2.style.transition = "transform 1s";

  col1.style.transform = `translateX(${left2 - left1}px)`;
  col2.style.transform = `translateX(${left1 - left2}px)`;

  await new Promise(resolve => {
    const onEnd = () => {
      col1.style.transition = "";
      col2.style.transition = "";
      col1.style.transform = "";
      col2.style.transform = "";

      const tempHeight = col1.style.height;
      const tempText = col1.textContent;

      col1.style.height = col2.style.height;
      col2.style.height = tempHeight;

      col1.textContent = col2.textContent;
      col2.textContent = tempText;

      col1.removeEventListener("transitionend", onEnd);
      resolve();
    };
    col1.addEventListener("transitionend", onEnd);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const simulation = async (arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        updatePointers(i, j);

        const colI = document.getElementById(`col${i}`);
        const colJ = document.getElementById(`col${j}`);

        colI.style.border = "2px solid red";
        colJ.style.border = "2px solid red";

        await waitWhilePaused();
        await delay(400);

        if (arr[j] < arr[i]) {
          colI.style.border = "2px solid green";
          colJ.style.border = "2px solid green";

          await swapColumns(colI, colJ);

          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          await delay(500);
        }

        colI.style.border = "";
        colJ.style.border = "";
      }
    }
  };

  document.getElementById("sort").addEventListener("click", () => simulation(arrRoot));
  document.getElementById("pause-resume").addEventListener("click", () => {
    isPaused = !isPaused;
    const icon = document.getElementById("pauseIcon");
    icon.className = isPaused ? "fa-solid fa-play" : "fa-solid fa-pause";
    document.getElementById("pause-resume").title = isPaused ? "Tiếp tục" : "Tạm dừng";
  });
});
