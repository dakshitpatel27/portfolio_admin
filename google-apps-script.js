/**
 * Portfolio Data API for Google Drive (with Email OTP Forgot Password feature)
 * 
 * Instructions:
 * 1. Go to https://script.google.com and click "New Project".
 * 2. Delete any default code and paste this script.
 * 3. Change "YOUR_GOOGLE_DRIVE_FILE_ID" to your actual portfolioData.json file ID
 *    or leave it empty/incorrect first. Run any function (like getOrCreateFile) once,
 *    it will ask for permissions. Authorize it.
 * 4. Click "Deploy" -> "New deployment".
 * 5. Select "Web app":
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL and paste it into your portfolio's admin panel configuration.
 */

const FILE_NAME = "portfolioData.json";

// Set your spreadsheet / JSON file ID here if you want to lock it to a specific file.
// If empty, the script will automatically find or create "portfolioData.json" in your Google Drive.
const FIXED_FILE_ID = ""; 

function doGet(e) {
  try {
    var file = getOrCreateFile();
    var content = file.getBlob().getDataAsString();
    return ContentService.createTextOutput(content)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var jsonString = e.postData.contents;
    
    // Default: Save portfolio configuration data
    var file = getOrCreateFile();
    file.setContent(jsonString);
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateFile() {
  if (FIXED_FILE_ID) {
    return DriveApp.getFileById(FIXED_FILE_ID);
  }
  
  var files = DriveApp.getFilesByName(FILE_NAME);
  if (files.hasNext()) {
    return files.next();
  } else {
    // Create default file if it doesn't exist
    var defaultData = {
      profile: { name: "Dakshit", role: "Developer", company: "", avatar: "", email: "", phone: "", birthday: "", location: "", socials: { linkedin: "", github: "", instagram: "" } },
      about: { paragraphs: [], services: [] },
      resume: { downloadLink: "", experience: [], education: [], skills: [] },
      projects: [],
      certifications: []
    };
    return DriveApp.createFile(FILE_NAME, JSON.stringify(defaultData, null, 2), MimeType.PLAIN_TEXT);
  }
}
