const GAS_URL = "https://script.google.com/macros/s/AKfycbzWjnb1JTffxUeEN7AnsWlr5wtburGuVCuvvuQzSK8newwPZ19ZZhklWgjsWJS8eoWw/exec";
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

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const tr = document.createElement("tr");

    for (let col = 0; col <= 7; col++) {
      const td = document.createElement("td");

      if (col >= 2 && col <= 5 && i >= 4 && i <= 15) {
        const input = document.createElement("input");
        input.value = row[col];

        const columnName = ["名前1", "名前2", "名前3", "名前4"][col - 2];
        const date = row[1];

        input.addEventListener("blur", () => {
          updateCell(date, columnName, input.value);
        });

        td.appendChild(input);
      } else {
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
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ date, column, name })
  });
}
