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
        if (rIndex >= 1 && rIndex <= 12 && cIndex >= 1 && cIndex <= 4) {
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
  });

// ▼ 送信ボタン（POST）
document.getElementById("sendBtn").addEventListener("click", () => {
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
});
