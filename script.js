// ★ デプロイ後の GAS の最終URL（exec形式）
const GAS_URL = "https://script.google.com/macros/s/AKfycbyQbHYiOb_BsxZV4Ion6hXjsbK4jNZdAvOS5VZERKhDl4MxDkfMyUeVZYqwhXLy8Ebm/exec";

// ▼ URL の ?key=xxxx を取得
let ACCESS_KEY = null;
const url = new URL(window.location.href);

ACCESS_KEY = url.searchParams.get("key");

// LIFF の liff.state=%3Fkey%3Dxxxx パターンにも対応
if (!ACCESS_KEY && url.search.includes("liff.state")) {
  const decoded = decodeURIComponent(url.search);
  const match = decoded.match(/key=([A-Za-z0-9]+)/);
  if (match) ACCESS_KEY = match[1];
}

// ▼ 今日の日付（JST）
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
  const script = document.createElement("script");
  script.src = `${GAS_URL}?callback=cbLoad&key=${ACCESS_KEY}`;
  document.body.appendChild(script);
}

// ▼ JSONP コールバック
window.cbLoad = function(response) {
  if (!response || !response.table) {
    alert("データの読み込みに失敗しました。");
    return;
  }

  const data = response;
  const tbody = document.getElementById("sheetBody");
  tbody.innerHTML = "";

  data.table.forEach((row, rIndex) => {
    const tr = document.createElement("tr");

    row.forEach((cell, cIndex) => {
      const td = document.createElement("td");

      // ★ 編集可能なのは C〜F列 → cIndex=2〜5
      if (cIndex >= 2 && cIndex <= 5) {
        const input = document.createElement("input");
        input.value = cell;

        input.dataset.original = cell;
        input.dataset.row = rIndex + 5;
        input.dataset.col = cIndex + 1; // A列追加で+2

        td.appendChild(input);
      } else {
        td.textContent = cell; // A列などは表示のみ
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
};

// ▼ 送信処理（JSONP）
function sendUpdates() {
  const dialog = document.getElementById("loadingDialog");
  const dialogMessage = document.getElementById("dialogMessage");

  dialogMessage.textContent = "送信中です。少しお待ちください。";
  dialog.style.display = "flex";

  const inputs = document.querySelectorAll("input");
  const updates = [];

  inputs.forEach(input => {
    const original = input.dataset.original;
    const current = input.value;

    if (original !== current) {
      updates.push({
        row: Number(input.dataset.row),
        col: Number(input.dataset.col),
        value: current
      });
    }
  });

  if (updates.length === 0) {
    dialog.style.display = "none";
    alert("変更がありません。");
    return;
  }

  const json = encodeURIComponent(JSON.stringify({ updates }));
  const script = document.createElement("script");
  script.src = `${GAS_URL}?callback=cbPost&data=${json}&key=${ACCESS_KEY}`;
  document.body.appendChild(script);
}

// ▼ 送信完了
window.cbPost = function(response) {
  const dialog = document.getElementById("loadingDialog");
  const dialogMessage = document.getElementById("dialogMessage");

  dialogMessage.textContent = "送信が終了しました。";

  setTimeout(() => {
    dialog.style.display = "none";
    loadTable();
  }, 1200);
};

document.getElementById("sendBtn").addEventListener("click", sendUpdates);
