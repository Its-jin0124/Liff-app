const GAS_URL = "https://script.google.com/macros/s/AKfycbxV5vHlKwpZfXFzZOjHXeWY5BFuUUw-iTqJ2sgBgzKmBT9WAhOqzc3ON-rDmJQR5Z4Y/exec";
const LIFF_ID = "2010107820-vGh6Z9fq";

document.addEventListener("DOMContentLoaded", async () => {
  await liff.init({ liffId: LIFF_ID });
  loadTable();
});

async function loadTable() {
  const res = await fetch(GAS_URL + "?mode=read");
  const data = await res.json();

  const table = document.getElementById("yoyakuTable");
  table.innerHTML = "";

  // データは5行目から
  for (let i = 4; i < data.length; i++) {
    const row = data[i];
    const tr = document.createElement("tr");

    // 表示する列：B〜F列（1〜5）
    for (let col = 1; col <= 5; col++) {
      const td = document.createElement("td");

      if (col >= 2 && col <= 5) {
        // 名前1〜4（C〜F列）は編集可能
        const input = document.createElement("input");
        input.value = row[col];

        const columnName = ["名前1", "名前2", "名前3", "名前4"][col - 2];
        const date = row[1]; // B列の日付

        input.addEventListener("change", () => {
          updateCell(date, columnName, input.value);
        });

        td.appendChild(input);
      } else {
        // B列（日付）は表示のみ
        td.textContent = row[col];
      }

      tr.appendChild(td);
    }

    table.appendChild(tr);
  }
}

async function updateCell(date, column, name) {
  await fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify({ date, column, name })
  });
}
