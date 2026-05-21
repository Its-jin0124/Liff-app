const GAS_URL = "https://script.google.com/macros/s/AKfycbzbmzRbfm8FAcUJ27gSlsVnrVuNX-NzQLlh-PkzFQIfWbO9DNARM4l-12jx1nyK2zpu/exec";

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

        if (rIndex >= 0 && rIndex <= 11 && cIndex >= 1 && cIndex <= 4) {
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

      // ★ 「12月12日」の行の下に送信ボタンを追加
      if (row[0].trim() === "12月12日") {
        const btnTr = document.createElement("tr");

        // G列（決まらない場合）の下に置くために、5列分の空白セル
        for (let i = 0; i < 5; i++) {
          btnTr.appendChild(document.createElement("td"));
        }

        // 6列目（決まらない場合の下）にボタンを置く
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

        tbody.appendChild(btnTr);
      }
    });
  });

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

document.getElementById("sendBtn").addEventListener("click", sendUpdates);
