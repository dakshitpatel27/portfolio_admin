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
const INQUIRIES_FILE_NAME = "portfolioInquiries.json";

// Set your spreadsheet / JSON file ID here if you want to lock it to a specific file.
// If empty, the script will automatically find or create "portfolioData.json" in your Google Drive.
const FIXED_FILE_ID = ""; 

function doGet(e) {
  try {
    var action = e.parameter.action;
    
    if (action === 'get-inquiries') {
      var password = e.parameter.password;
      var file = getOrCreateInquiriesFile();
      var data = JSON.parse(file.getBlob().getDataAsString());
      
      // Default fallback password matches the one in config.js (Daksh@1234)
      var expectedPass = data.admin_password || "Daksh@1234";
      if (expectedPass !== password) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Unauthorized' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true, inquiries: data.inquiries || [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Default GET: Return public portfolioData
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
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    
    if (action === 'submit-message') {
      var file = getOrCreateInquiriesFile();
      var data = JSON.parse(file.getBlob().getDataAsString());
      
      var newInquiry = {
        id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 5),
        name: payload.fullname || payload.name || 'Anonymous',
        email: payload.email || '',
        phone: payload.phone || '',
        subject: payload.subject || 'No Subject',
        message: payload.message || '',
        timestamp: new Date().toISOString(),
        read: false
      };
      
      if (!data.inquiries) data.inquiries = [];
      data.inquiries.push(newInquiry);
      file.setContent(JSON.stringify(data, null, 2));
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, inquiry: newInquiry }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'inquiries-update') {
      var password = payload.password;
      var file = getOrCreateInquiriesFile();
      var data = JSON.parse(file.getBlob().getDataAsString());
      
      var expectedPass = data.admin_password || "Daksh@1234";
      if (expectedPass !== password) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Unauthorized' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      var id = payload.id;
      var subAction = payload.subAction; // 'read' or 'delete'
      var updated = false;
      
      if (!data.inquiries) data.inquiries = [];
      
      if (subAction === 'read') {
        data.inquiries = data.inquiries.map(function(inq) {
          if (inq.id === id) {
            inq.read = true;
            updated = true;
          }
          return inq;
        });
      } else if (subAction === 'unread') {
        data.inquiries = data.inquiries.map(function(inq) {
          if (inq.id === id) {
            inq.read = false;
            updated = true;
          }
          return inq;
        });
      } else if (subAction === 'star') {
        data.inquiries = data.inquiries.map(function(inq) {
          if (inq.id === id) {
            inq.starred = true;
            updated = true;
          }
          return inq;
        });
      } else if (subAction === 'unstar') {
        data.inquiries = data.inquiries.map(function(inq) {
          if (inq.id === id) {
            inq.starred = false;
            updated = true;
          }
          return inq;
        });
      } else if (subAction === 'delete') {
        var initialLength = data.inquiries.length;
        data.inquiries = data.inquiries.filter(function(inq) {
          return inq.id !== id;
        });
        if (data.inquiries.length !== initialLength) {
          updated = true;
        }
      }
      
      if (updated) {
        file.setContent(JSON.stringify(data, null, 2));
        return ContentService.createTextOutput(JSON.stringify({ success: true }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Inquiry not found' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    if (action === 'save-admin-config') {
      var password = payload.password;
      var file = getOrCreateInquiriesFile();
      var data = JSON.parse(file.getBlob().getDataAsString());
      
      var expectedPass = data.admin_password || "Daksh@1234";
      if (expectedPass !== password) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Unauthorized' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      data.admin_password = payload.admin_password || 'admin123';
      data.admin_email = payload.admin_email || 'admin@example.com';
      file.setContent(JSON.stringify(data, null, 2));
      
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'send-single-email') {
      var password = payload.password;
      var file = getOrCreateInquiriesFile();
      var data = JSON.parse(file.getBlob().getDataAsString());
      
      var expectedPass = data.admin_password || "Daksh@1234";
      if (expectedPass !== password) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Unauthorized' }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      var id = payload.id;
      var siteUrl = payload.siteUrl;
      var updated = false;

      if (!data.inquiries) data.inquiries = [];
      
      var configFile = getOrCreateFile();
      var newConfig = {};
      try {
        newConfig = JSON.parse(configFile.getBlob().getDataAsString());
      } catch(e) {}

      var errorMsg = "Subscriber not found";
      for (var i = 0; i < data.inquiries.length; i++) {
        if (String(data.inquiries[i].id) === String(id)) {
          var result = sendSingleNotificationEmail(data.inquiries[i], siteUrl, newConfig);
          if (result.success) {
            data.inquiries[i].notified = true;
            updated = true;
          } else {
            errorMsg = result.error;
          }
          break;
        }
      }

      if (updated) {
        file.setContent(JSON.stringify(data, null, 2));
        return ContentService.createTextOutput(JSON.stringify({ success: true }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: errorMsg }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    if (action === 'send-all-emails') {
      var password = payload.password;
      var file = getOrCreateInquiriesFile();
      var data = JSON.parse(file.getBlob().getDataAsString());
      
      var expectedPass = data.admin_password || "Daksh@1234";
      if (expectedPass !== password) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Unauthorized' }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      var siteUrl = payload.siteUrl;
      var updated = false;

      if (!data.inquiries) data.inquiries = [];

      var configFile = getOrCreateFile();
      var newConfig = {};
      try {
        newConfig = JSON.parse(configFile.getBlob().getDataAsString());
      } catch(e) {}

      var errors = [];
      for (var i = 0; i < data.inquiries.length; i++) {
        var sub = data.inquiries[i];
        if (sub.subject === 'Newsletter / Launch Notification Request' && sub.notified !== true) {
          var result = sendSingleNotificationEmail(sub, siteUrl, newConfig);
          if (result.success) {
            sub.notified = true;
            updated = true;
          } else {
            errors.push(sub.email + ": " + result.error);
          }
        }
      }

      if (updated) {
        file.setContent(JSON.stringify(data, null, 2));
      }
      
      if (errors.length > 0) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Failed to send to: " + errors.join(", ") }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Default POST: Save portfolio configuration data
    var file = getOrCreateFile();
    
    try {
      var oldContentStr = file.getBlob().getDataAsString();
      if (oldContentStr) {
        var oldConfig = JSON.parse(oldContentStr);
        var newConfig = JSON.parse(e.postData.contents);
        
        var wasOffline = oldConfig && oldConfig.settings && oldConfig.settings.siteOnline === false;
        var isNowOnline = newConfig && newConfig.settings && newConfig.settings.siteOnline === true;
        
        if (wasOffline && isNowOnline) {
          sendSiteOnlineEmails(newConfig);
        }
      }
    } catch (err) {
      Logger.log("Transition check error: " + err.toString());
    }

    file.setContent(e.postData.contents);
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

function getOrCreateInquiriesFile() {
  var files = DriveApp.getFilesByName(INQUIRIES_FILE_NAME);
  if (files.hasNext()) {
    return files.next();
  } else {
    var defaultInquiries = {
      admin_password: "Daksh@1234",
      inquiries: []
    };
    return DriveApp.createFile(INQUIRIES_FILE_NAME, JSON.stringify(defaultInquiries, null, 2), MimeType.PLAIN_TEXT);
  }
}

function sendSiteOnlineEmails(newConfig) {
  try {
    var file = getOrCreateInquiriesFile();
    var data = JSON.parse(file.getBlob().getDataAsString());

    if (!data.inquiries) return;

    var developerName =
      (newConfig && newConfig.profile && newConfig.profile.name) ||
      "Dakshit Gajipara";

    var websiteTitle =
      (newConfig && newConfig.settings && newConfig.settings.siteTitle) ||
      developerName;

    var siteUrl =
      (newConfig && newConfig.settings && newConfig.settings.siteUrl) ||
      "https://dakshit.vercel.app";

    var subscribers = data.inquiries.filter(function (inq) {
      return (
        inq.subject === "Newsletter / Launch Notification Request" &&
        inq.notified !== true
      );
    });

    if (subscribers.length === 0) return;

    subscribers.forEach(function (sub) {
      if (!sub.email) return;

      var subject = "🚀 " + websiteTitle + " is Now Live!";

      var body =
        "Hi,\n\n" +
        "Thank you for your interest! The website for " +
        developerName +
        " is now back online and fully functional.\n\n" +
        "Visit the live site here: " +
        siteUrl +
        "\n\nBest regards,\n" +
        developerName;

      var htmlBody =
        "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>" +
        "<h2>🚀 We Are Online!</h2>" +
        "<p>Hi there,</p>" +
        "<p>Thank you for subscribing to updates on <strong>" +
        websiteTitle +
        "</strong>.</p>" +
        "<p>Our website is now live and fully functional.</p>" +
        "<p><a href='" +
        siteUrl +
        "'>Visit Portfolio</a></p>" +
        "<p>Best regards,<br><strong>" +
        developerName +
        "</strong></p>" +
        "</div>";

      try {
        MailApp.sendEmail({
          to: sub.email,
          subject: subject,
          body: body,
          htmlBody: htmlBody
        });

        Logger.log("Email sent to: " + sub.email);

      } catch (err) {
        Logger.log(
          "Failed to send email to " +
            sub.email +
            ": " +
            err.toString()
        );
      }
    });

    Logger.log("All notification emails processed successfully.");

  } catch (err) {
    Logger.log("Error in sendSiteOnlineEmails: " + err.toString());
  }
}

function sendSingleNotificationEmail(sub, siteUrl, newConfig) {
  if (!sub || !sub.email) return { success: false, error: "Missing subscriber email" };

  var developerName = (newConfig && newConfig.profile && newConfig.profile.name) || "Dakshit Gajipara";
  var websiteTitle = (newConfig && newConfig.settings && newConfig.settings.siteTitle) || developerName;
  var targetUrl = siteUrl || (newConfig && newConfig.settings && newConfig.settings.siteUrl) || "https://dakshit.vercel.app";

  var subject = "🚀 " + websiteTitle + " is Now Live!";
  var body = "Hi,\n\n" +
             "Thank you for your interest! The website for " + developerName + " is now back online and fully functional.\n\n" +
             "Visit the live site here: " + targetUrl + "\n\n" +
             "Best regards,\n" +
             developerName;
  
  var htmlBody = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c;'>" +
                 "<h2 style='color: #0b0c10; background: linear-gradient(135deg, #ffdb70 0%, #ffd43b 100%); padding: 20px; margin-top: 0; border-radius: 8px 8px 0 0; text-align: center;'>🚀 We Are Online!</h2>" +
                 "<div style='padding: 20px;'>" +
                 "<p>Hi there,</p>" +
                 "<p>Thank you for subscribing to updates on <strong>" + websiteTitle + "</strong>.</p>" +
                 "<p>We wanted to let you know that our scheduled upgrades are complete and our website is now <strong>live and fully functional</strong>!</p>" +
                 "<div style='text-align: center; margin: 30px 0;'>" +
                 "<a href='" + targetUrl + "' style='background: #ffd43b; color: #0b0c10; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>Visit Portfolio</a>" +
                 "</div>" +
                 "<p>Best regards,<br><strong>" + developerName + "</strong></p>" +
                 "</div>" +
                 "</div>";

  try {
    MailApp.sendEmail({
      to: sub.email,
      subject: subject,
      body: body,
      htmlBody: htmlBody
    });

  
    return { success: true };
  } catch (err) {
    Logger.log("Failed to send email to " + sub.email + ": " + err.toString());
    return { success: false, error: err.toString() };
  }
}
