var SHEET_NAME = "Manuel";
var EMAIL_TO = "YOUR_EMAIL@gmail.com"; // <-- ЗАМЕНИТЕ НА ВАШ EMAIL
var EMAIL_SUBJECT = "Новая заявка с сайта Manuel Academy";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(SHEET_NAME);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = doc.insertSheet(SHEET_NAME);
      // Create headers
      var headerRow = ["Timestamp", "Type", "Name", "Phone", "Status", "Notes",
        "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
        "referrer", "page_url", "user_agent", "ip_address", "screen_res", "timezone"];
      sheet.appendRow(headerRow);
    }

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    var newRow = headers.map(function (header) {
      if (header === "Timestamp") return new Date();
      // Try exact match first, then lowercase
      return e.parameter[header] || e.parameter[header.toLowerCase()] || "";
    });

    // Save to Sheet
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    // Send Email
    var type = e.parameter.type || "Не указан";
    var name = e.parameter.name || "Не указано";
    var phone = e.parameter.phone || "Не указан";
    var source = e.parameter.utm_source || "Прямой заход";

    var emailBody = "Новая заявка!\n\n" +
      "Тип: " + type + "\n" +
      "Имя: " + name + "\n" +
      "Телефон: " + phone + "\n\n" +
      "Источник: " + source + "\n" +
      "Дата: " + new Date().toLocaleString() + "\n" +
      "Ссылка на таблицу: " + doc.getUrl();

    MailApp.sendEmail({
      to: EMAIL_TO,
      subject: EMAIL_SUBJECT,
      body: emailBody
    });

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": nextRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function setup() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = doc.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = doc.insertSheet(SHEET_NAME);
    var headerRow = ["Timestamp", "Type", "Name", "Phone", "Status", "Notes",
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
      "referrer", "page_url", "user_agent", "ip_address", "screen_res", "timezone"];
    sheet.appendRow(headerRow);
  }
}
