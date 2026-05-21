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
        } else if (cIndex >= 1 && cIndex <= 4) {
          // 名前1〜4列のみ入力可能
          const input = document.createElement("input");
          input.value = cell;
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

    // ★ 表描画後に「決まらない場合」列の上に送信ボタン行を追加
    const btnTr = document.createElement("tr");

    // G列（決まらない場合）の位置に合わせるため、5列分の空白セル
    for (let i = 0; i < 5; i++) {
      btnTr.appendChild(document.createElement("td"));
    }

    // 6列目にボタンを置く
    const btnTd = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "送信";
    btn.className = "inline-send-btn";

    btn.addEventListener("click", () => {
      sendUpdates();
    });

    btnTd.appendChild(btn);
    btnTr.appendChild(btnTd);

    // 備考列の分の空白セル
    btnTr.appendChild(document.createElement("td"));

    // 表の最後に追加（決まらない場合の上に見える位置）
    tbody.appendChild(btnTr);
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

// ▼ 右下の送信ボタンも同じ処理を使う
document.getElementById("sendBtn").addEventListener("click", sendUpdates);
