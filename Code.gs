function normalizeName(str) {
  return String(str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Responses");
  const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
  const data = JSON.parse(raw);

  sheet.appendRow([
    new Date(),
    data.reviewer || "Anonymous",
    data.image || "",
    data.answer || "",
    data.confidence || "",
    data.readability || "",
    data.notes || "",
    data.time_taken_sec || 0
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reviewer = (e && e.parameter && e.parameter.reviewer ? e.parameter.reviewer : "").trim().toLowerCase();
  const action = (e && e.parameter && e.parameter.action) || "progress";
  const respRows = ss.getSheetByName("Responses").getDataRange().getValues();

  // Mode 1: Return completed filenames on login
  // Mode 1: Return completed filenames for this reviewer + global vote counts per image
  if (action === "progress") {
    const completed = [];
    const counts = {};
    for (let i = 1; i < respRows.length; i++) {
      const [ts, rev, respImg] = respRows[i];
      const img = String(respImg).trim();
      if (!img) continue;
      counts[img] = (counts[img] || 0) + 1;
      if (String(rev).trim().toLowerCase() === reviewer) {
        completed.push(img);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ completed, counts }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Mode 2: Check exact matches against private "Answers" tab
  if (action === "score") {
    const ansRows = ss.getSheetByName("Answers").getDataRange().getValues();
    const answerMap = {};
    for (let i = 1; i < ansRows.length; i++) {
      const [ansImg, ansBand] = ansRows[i];
      const key = String(ansImg).trim().split("/").pop();
      answerMap[key] = normalizeName(ansBand);
    }

    let attempted = 0;
    let exactMatches = 0;
    for (let i = 1; i < respRows.length; i++) {
      const [ts, rev, respImg, respGuess] = respRows[i];
      if (String(rev).trim().toLowerCase() === reviewer) {
        const img = String(respImg).trim().split("/").pop();
        const guess = String(respGuess).trim();
        if (guess !== "SKIPPED" && guess !== "[SKIPPED]" && answerMap[img]) {
          attempted++;
          if (normalizeName(guess) === answerMap[img]) {
            exactMatches++;
          }
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ attempted, exactMatches }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
