// ★ デプロイ後の GAS の最終URL（googleusercontent.com）を入れてください
const GAS_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnTsPO5jChAH7o3ySlDWAS5azsBMMkKL8JwDeUNctovTQ89lB_43GbhVDK5iSC6hQXPH1p-JqoZt1YgcuVk5uV1sgvX9cvlb27ralhTLhxACtAJ-FH2_sAa7L2QbhCfPDQeukSYtOMA7N5plZIguOPCwLpfVuFLP6fToT2-hN8XKgiWfkIA8rFECGzbLOrsTZClvYhOR502bz-ZiUJHFFWL0fM6yeAs4QoJVxmxkW2GfkVw3EXG8BLwSXxSo5qZVqnsi_8SCZv89zevwErWISCcxv_KjbA&lib=MyKRQqBssREHI6V9_PKnLDqjSmd3jpffu";

// URL の ?key=xxxx を取得（LIFF のエンコード対策）
const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
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
  const script = document.createElement("script");
  script.src = `${GAS_URL}?callback=cbLoad&key=${ACCESS_KEY}`;
  document.body.appendChild(script);
}

// ▼ JSONP コールバック（グローバル登録）
window.cbLoad = function(response) {
  if (!response || !response.table) {
    console.error("cbLoad: table data not found", response);
    alert("データの読み込みに失敗しました。GAS の URL または key を確認してください。");
    return;
  }

  const data = response;
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
  const script = document.createElement("script");
  script.src = `${GAS_URL}?callback=cbPost&data=${json}&key=${ACCESS_KEY}`;
  document.body.appendChild(script);
}

// ▼ JSONP コールバック（送信完了）
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
