const GAS_URL = "https://script.google.com/macros/s/AKfycbxKJBTETMjpzTY-Lenp6Z5S7phD07dsQS4SwP6Sc-Guw5DanY4Blz0NYXLNCZfUM73-/exec";
const LIFF_ID = "2010107820-vGh6Z9fq";

// ★ 変更されたセルを保存する配列
let editedCells = [];

document.addEventListener("DOMContentLoaded", async () => {
  await liff.init({ liffId: LIFF_ID });
  loadTable();

  // ★ 送信ボタンのイベント登録
  document.getElementById("sendBtn").addEventListener("click", sendDataToGAS);
});

async function loadTable() {
  const res = await fetch(GAS_URL + "?mode=read");
  const data = await res.json();

  const table = document.getElementById("yoyakuTable");
  table.innerHTML = "";

  // ★ A1〜H21（21行）をそのまま表示
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const tr = document.createElement("tr");

    // A〜H列（0〜7）
    for (let col = 0; col <= 7; col++) {
      const td = document.createElement("td");

      // ★ 編集可能条件：C〜F列（col=2〜5）かつ 5〜16行目（i=4〜15）
      if (col >= 2 && col <= 5 && i >= 4 && i <= 15) {
        const input = document.createElement("input");
        input.value = row[col];

        const columnName = ["名前1", "名前2", "名前3", "名前4"][col - 2];
        const date = row[1]; // B列（日程）

        // ★ blur では送信せず、変更内容だけ記録
        input.addEventListener("blur", () => {
          editedCells.push({
            date: date,
            column: columnName,
            value: input.value
          });
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

// ★ 送信ボタンでまとめて POST
async function sendDataToGAS() {
  if (editedCells.length === 0) {
    alert("変更されたセルがありません");
    return;
  }

  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ updates: editedCells })
    });

    const json = await res.json();

    if (json.result === "success") {
      alert("スプレッドシートに保存しました！");
      editedCells = []; // 成功したらクリア
    } else {
      alert("保存に失敗しました");
    }

  } catch (e) {
    console.error(e);
    alert("通信エラーが発生しました");
  }
}
