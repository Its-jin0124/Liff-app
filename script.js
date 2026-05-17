const GAS_URL = "https://script.google.com/macros/s/AKfycbzv0JW-UAwmPh7X0H3zSYrez1UZcy_xRxmLHLwDPZQ5CtH_KQK2840Xaf7W3v3EVut3/exec";
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

  data.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");

    row.forEach((cell, colIndex) => {
      const td = document.createElement("td");

      const input = document.createElement("input");
      input.value = cell;

      input.addEventListener("change", () => {
        updateCell(rowIndex, colIndex, input.value);
      });

      td.appendChild(input);
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });
}

async function updateCell(row, col, value) {
  await fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify({ row, col, value })
  });
}
