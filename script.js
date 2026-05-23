// ★ デプロイ後の GAS URL を入れてください
const GAS_URL = "https://script.google.com/macros/s/AKfycbykLEDHLaywaDj7gBG2u_IrUArlryGrqljWxNMsqGnasEEJRk178mhAlnM3A-MAa1vo/exec";

// URL の ?key=xxxx を取得
const urlParams = new URLSearchParams(window.location.search);
const ACCESS_KEY = urlParams.get("key");


// ▼ 今日の日付（JST）を表示
function getTodayJST() {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = jst.getFullYear();
  const m = String(jst.getMonth() + 1).padStart(2, "0");
  const d = String(jst.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("currentDate").textContent = getTodayJST();
  loadTable();
});


// ▼ 表の読み込み（JSONP）
function loadTable() {
  fetch(`${GAS_URL}?callback=cbLoad&key=${ACCESS_KEY}`)
    .then(res => res.text())
    .then(text => {
      const json = text.replace(/^cbLoad\(|\)$/g, "");
      const data = JSON.parse(json);

      const tbody = document.getElementById("sheetBody");
      tbody.innerHTML = "";

      data.table.forEach((row, rIndex) => {
        const tr = document.createElement("tr");

        row.forEach((cell, cIndex) => {
          const td = document.createElement("td");

          // ▼ 編集可能なのは C〜F列（cIndex=1〜4）
          if (cIndex >= 1 && cIndex <= 4) {
            const input = document.createElement("input");
            input.value = cell;

            // ▼ rIndex=0 がシートの 5 行目に対応
            input.dataset.row = rIndex + 5;
            input.dataset.col = cIndex + 2;

            td.appendChild(input);
          } else {
            td.textContent = cell;
          }

          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      });
    });
}


// ▼ 送信処理（JSONP）
function sendUpdates() {
  const dialog = document.getElementById("loadingDialog");
  const dialogMessage = document.getElementById("dialogMessage");

  dialogMessage.textContent = "送信中です。少しお待ちください。";
  dialog.style.display = "flex";

  const inputs = document.querySelectorAll("input");
  const updates = [];

  inputs.forEach(input => {
    const value = input.value.trim();
    if (value !== "") {
      updates.push({
        row: Number(input.dataset.row),
        col: Number(input.dataset.col),
        value
      });
    }
  });

  if (updates.length === 0) {
    dialog.style.display = "none";
    alert("入力がありません。");
    return;
  }

  const json = encodeURIComponent(JSON.stringify({ updates }));
  const url = `${GAS_URL}?callback=cbPost&data=${json}&key=${ACCESS_KEY}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = text.replace(/^cbPost\(|\)$/g, "");
      const result = JSON.parse(json);

      dialogMessage.textContent = "送信が終了しました。";

      setTimeout(() => {
        dialog.style.display = "none";
        loadTable();
      }, 1200);
    })
    .catch(err => {
      dialog.style.display = "none";
      console.error("送信エラー:", err);
      alert("送信に失敗しました。");
    });
}

document.getElementById("sendBtn").addEventListener("click", sendUpdates);
