// ★ あなたの GAS WebアプリURL を入れてください
const GAS_URL = "https://script.google.com/macros/s/AKfycbwu0gHzc501Z9vWOsjFf6sdlZSZ9b-wpxzUWXDWKoGQtasX1LFrHSRGRtxYBbi3ls3A/exec";
// ▼ 表示処理（GET）
fetch(GAS_URL)
  .then(res => res.json())
  .then(data => {
    // F1 の日付
    document.getElementById("dateText").textContent = data.date;

    // B4〜H16 の表データ
    const tbody = document.getElementById("sheetBody");

    data.table.forEach((row, rIndex) => {
      const tr = document.createElement("tr");

      row.forEach((cell, cIndex) => {
        const td = document.createElement("td");

        // C5〜F16（＝表の2〜5列目）だけ入力可能
        if (rIndex >= 1 && rIndex <= 12 && cIndex >= 1 && cIndex <= 4) {
          const input = document.createElement("input");
          input.value = cell;

          // 実際のシート位置（row=5〜16, col=3〜6）
          input.dataset.row = rIndex + 4;
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

// ▼ 送信ボタン（まだ送信処理は後で）
document.getElementById("sendBtn").addEventListener("click", () => {
  alert("送信処理は後で実装します！");
});
