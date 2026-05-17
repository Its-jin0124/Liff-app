// ★ あなたの GAS Web アプリの URL を入れてください
const GAS_URL = "https://script.google.com/macros/s/XXXXXX/exec";

// ★ あなたの LIFF ID を入れてください
const LIFF_ID = "YOUR_LIFF_ID";

document.addEventListener("DOMContentLoaded", async () => {
  await liff.init({ liffId: LIFF_ID });
  loadTable();
});

// スプレッドシートの内容を読み込んで表を作る
async function loadTable() {
  const res = await fetch(GAS_URL + "?mode=read");
  const data = await res.json();

  const table = document.getElementById("yoyakuTable");
  table.innerHTML = "";

  data.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");

    row.forEach((cell, colIndex) => {
      const td = document.createElement("td");

      const input = document.createElement("input");
      input.value = cell;

      // 入力が変わったら GAS に送信
      input.addEventListener("change", () => {
        updateCell(rowIndex, colIndex, input.value);
      });

      td.appendChild(input);
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });
}

// セルの更新を GAS に送信
async function updateCell(row, col, value) {
  await fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify({ row, col, value })
  });
}
