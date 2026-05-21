const GAS_URL = "https://script.google.com/macros/s/AKfycbxueBZJHpSZ0yP2YHYk9GqHX_UvPUtci--b_qVhjujGT64XIAAUgweZ0utYgUlIKKly/exec";

// ▼ 表示処理（GET）→ JSONP
fetch(`${GAS_URL}?callback=cb`)
  .then(res => res.text())
  .then(text => {
    const json = text.replace(/^cb\(|\)$/g, "");
    const data = JSON.parse(json);

    document.getElementById("dateText").textContent = data.date;
    const tbody = document.getElementById("sheetBody");

    data.table.forEach((row, rIndex) => {
      const tr = document.createElement("tr");

      row.forEach((cell, cIndex) => {
        const td = document.createElement("td");

        // ★ 1行目（ヘッダー）は編集不可
        if (rIndex === 0) {
          td.textContent = cell;
        }
        // ★ 2行目以降は名前1〜4（cIndex 1〜4）だけ編集可能
        else if (cIndex >= 1 && cIndex <= 4) {
          const input = document.createElement("input");
          input.value = cell;

          // スプレッドシートの行列に合わせる
          input.dataset.row = rIndex + 4; // B5〜
          input.dataset.col = cIndex + 2; // C〜F

          td.appendChild(input);
        }
        // ★ その他の列は編集不可
        else {
          td.textContent = cell;
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  });

// ▼ 送信処理（POST）
function sendUpdates() {
  const inputs = document.querySelectorAll("input");
  const updates = [];

  inputs.forEach(input => {
    updates.push({
      row: Number(input.dataset.row),
      col: Number(input.dataset.col),
      value: input.value
    });
  });

  fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ updates })
  })
    .then(res => res.json())
    .then(result => {
      alert("送信しました！");
    });
}

// ▼ 下部の送信ボタンにイベントを設定
document.getElementById("sendBtn").addEventListener("click", sendUpdates);

