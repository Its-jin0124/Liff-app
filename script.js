const GAS_URL = "https://script.google.com/macros/s/AKfycbz-jRv5Druw65Hjq1ziXeOYgA0Giw0K2GIwv1SEhx34QVgZr3OUI2gFkoM0lKNiQxA-/exec";
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

  // ★ GAS が返すのは 5〜16行目だけなので、0〜data.length をループ
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const tr = document.createElement("tr");

    // ★ 表示する列：B〜H列（1〜7）
    for (let col = 1; col <= 7; col++) {
      const td = document.createElement("td");

      // ★ C〜F列（名前1〜4）は編集可能
      if (col >= 2 && col <= 5) {
        const input = document.createElement("input");
        input.value = row[col];

        // col=2→名前1, col=3→名前2, col=4→名前3, col=5→名前4
        const columnName = ["名前1", "名前2", "名前3", "名前4"][col - 2];
        const date = row[1]; // B列（日程）

        input.addEventListener("change", () => {
          updateCell(date, columnName, input.value);
        });

        td.appendChild(input);
      } else {
        // ★ B列（日程）、G列、H列は表示のみ
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
