function interchangeSort(arr) {
  const n = arr.length;

  // Lặp qua từng phần tử trong mảng
  for (let i = 0; i < n - 1; i++) {
    // So sánh phần tử hiện tại với các phần tử phía sau
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[i]) {
        // Hoán đổi nếu phần tử hiện tại lớn hơn phần tử phía sau
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}

async function bubbleSortVisual() {
  const columns = document.querySelectorAll("#columns .column");
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const getHeight = col => parseInt(col.style.height); // lấy số px

  for (let i = 0; i < columns.length - 1; i++) {
    for (let j = 0; j < columns.length - i - 1; j++) {
      const height1 = getHeight(columns[j]);
      const height2 = getHeight(columns[j + 1]);

      // Đổi màu highlight
      columns[j].style.background = "red";
      columns[j + 1].style.background = "red";

      await delay(300);

      if (height1 > height2) {
        // Hoán đổi chiều cao và giá trị text
        [columns[j].style.height, columns[j + 1].style.height] =
          [columns[j + 1].style.height, columns[j].style.height];

        const val1 = columns[j].querySelector(".value").innerText;
        const val2 = columns[j + 1].querySelector(".value").innerText;
        columns[j].querySelector(".value").innerText = val2;
        columns[j + 1].querySelector(".value").innerText = val1;
      }

      // Reset lại màu
      columns[j].style.background = "";
      columns[j + 1].style.background = "";
    }
  }
}

async function interchangeSortVisual() {
  const columns = document.querySelectorAll("#columns .column");
  const letters = document.getElementById("letters");
  const numerals = document.getElementById("numerals");
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const n = columns.length;

  // Khởi tạo các vị trí i và j rỗng
  letters.innerHTML = "";
  numerals.innerHTML = "";
  for (let i = 0; i < n; i++) {
    letters.innerHTML += `<div class="letter-item"></div>`;
    numerals.innerHTML += `<div class="numerals-item"></div>`;
  }

  const getHeight = col => parseInt(col.style.height);

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {

      // Đánh dấu i và j
      updatePointers(i, j);

      const heightI = getHeight(columns[i]);
      const heightJ = getHeight(columns[j]);

      // Đổi màu
      columns[i].style.background = "red";
      columns[j].style.background = "yellow";

      await delay(400);

      if (heightJ < heightI) {
        // Swap
        [columns[i].style.height, columns[j].style.height] =
          [columns[j].style.height, columns[i].style.height];

        const valI = columns[i].querySelector(".value").innerText;
        const valJ = columns[j].querySelector(".value").innerText;

        columns[i].querySelector(".value").innerText = valJ;
        columns[j].querySelector(".value").innerText = valI;
      }

      // Reset màu
      columns[i].style.background = "";
      columns[j].style.background = "";

      await delay(100);
    }
  }

  // Xoá đánh dấu cuối cùng
  clearPointers();

  // Hỗ trợ cập nhật chữ `i`, `j`
  function updatePointers(iIndex, jIndex) {
    const letterItems = letters.querySelectorAll(".letter-item");
    const numeralItems = numerals.querySelectorAll(".numerals-item");

    letterItems.forEach((el, idx) => {
      el.innerText = idx === iIndex ? "i" : "";
    });

    numeralItems.forEach((el, idx) => {
      el.innerText = idx === jIndex ? "j" : "";
    });
  }

  function clearPointers() {
    letters.querySelectorAll(".letter-item").forEach(el => el.innerText = "");
    numerals.querySelectorAll(".numerals-item").forEach(el => el.innerText = "");
  }
}



