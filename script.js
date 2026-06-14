'use strict';

// Clean query parameters from URL on load (e.g., from old form submissions)
if (window.location.search) {
  const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.hash;
  window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
}
// Theme Customization Engine
function applyTheme(theme) {
  if (!theme) return;

  const mode = theme.mode || 'dark';
  const preset = theme.preset || 'default';
  const accentColor = theme.accentColor || '#ffdb70';
  const primaryColor = theme.primaryColor || '#090a0f';
  const fontFamily = theme.fontFamily || 'Poppins';

  // 1. Load chosen Google Font
  loadGoogleFont(fontFamily);

  // 2. Map theme colors based on preset and mode
  let actualAccent = accentColor;
  let actualBg = primaryColor;
  let actualCardBg = 'rgba(15, 23, 42, 0.65)';
  let actualInnerBg = '#0b0c10';
  let actualBorder = '#1e293b';
  let actualOnyx = '#334155';
  let actualWhite1 = '#ffffff';
  let actualWhite2 = '#f1f5f9';
  let actualLightGray = '#cbd5e1';
  let actualLightGray70 = 'rgba(203, 213, 225, 0.7)';

  if (preset === 'default') {
    actualAccent = '#ffdb70';
    actualBg = '#090a0f';
  } else if (preset === 'obsidian') {
    actualAccent = '#38bdf8';
    actualBg = '#030712';
  } else if (preset === 'emerald') {
    actualAccent = '#34d399';
    actualBg = '#022c22';
  } else if (preset === 'sunset') {
    actualAccent = '#f97316';
    actualBg = '#0f0502';
  } else if (preset === 'lavender') {
    actualAccent = '#c084fc';
    actualBg = '#0b0514';
  } else if (preset === 'cyberpunk') {
    actualAccent = '#f43f5e';
    actualBg = '#090514';
  }

  if (mode === 'light') {
    actualAccent = adjustColorBrightness(actualAccent, -25);
    actualBg = (preset === 'default' ? '#f8fafc' : (preset === 'custom' ? actualBg : getLightBgForPreset(preset)));
    actualCardBg = 'rgba(255, 255, 255, 0.8)';
    actualInnerBg = '#ffffff';
    actualBorder = '#e2e8f0';
    actualOnyx = '#cbd5e1';
    actualWhite1 = '#0f172a';
    actualWhite2 = '#1e293b';
    actualLightGray = '#475569';
    actualLightGray70 = 'rgba(71, 85, 105, 0.8)';
  } else {
    if (preset !== 'default' && preset !== 'custom') {
      actualBg = getDarkBgForPreset(preset);
    }
  }

  const accentRgb = hexToRgb(actualAccent);
  const root = document.documentElement;

  root.style.setProperty('--smoky-black', actualBg);
  root.style.setProperty('--eerie-black-2', actualCardBg);
  root.style.setProperty('--eerie-black-1', actualInnerBg);
  root.style.setProperty('--jet', actualBorder);
  root.style.setProperty('--onyx', actualOnyx);
  root.style.setProperty('--white-1', actualWhite1);
  root.style.setProperty('--white-2', actualWhite2);
  root.style.setProperty('--light-gray', actualLightGray);
  root.style.setProperty('--light-gray-70', actualLightGray70);
  root.style.setProperty('--orange-yellow-crayola', actualAccent);
  root.style.setProperty('--vegas-gold', actualAccent);
  root.style.setProperty('--ff-poppins', `'${fontFamily}', sans-serif`);

  root.style.setProperty('--text-gradient-yellow', `linear-gradient(to right, ${actualAccent}, ${adjustColorBrightness(actualAccent, -20)})`);
  root.style.setProperty('--bg-gradient-yellow-1', `linear-gradient(to bottom right, ${actualAccent} 0%, rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0) 50%)`);
  root.style.setProperty('--bg-gradient-yellow-2', `linear-gradient(135deg, rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.25) 0%, rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0) 59.86%), ${actualBg}`);
  
  if (mode === 'light') {
    root.style.setProperty('--bg-gradient-onyx', `linear-gradient(to bottom right, #ffffff 3%, #f1f5f9 97%)`);
    root.style.setProperty('--bg-gradient-jet', `linear-gradient(to bottom right, rgba(255, 255, 255, 0.4) 0%, rgba(241, 245, 249, 0) 100%), #ffffff`);
    root.style.setProperty('--border-gradient-onyx', `linear-gradient(to bottom right, rgba(15, 23, 42, 0.12) 0%, rgba(15, 23, 42, 0) 50%)`);
  } else {
    root.style.setProperty('--bg-gradient-onyx', `linear-gradient(to bottom right, ${adjustColorBrightness(actualBg, 10)} 3%, ${actualBg} 97%)`);
    root.style.setProperty('--bg-gradient-jet', `linear-gradient(to bottom right, rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.1) 0%, rgba(15, 23, 42, 0) 100%), ${adjustColorBrightness(actualBg, 5)}`);
    root.style.setProperty('--border-gradient-onyx', `linear-gradient(to bottom right, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 50%)`);
  }

  // Set navbar dynamic colors
  let navbarBg = actualCardBg;
  let navbarBorder = actualBorder;
  let navbarLinkHoverBg = 'rgba(255, 255, 255, 0.05)';
  let navbarLinkActiveBg = 'var(--bg-gradient-jet)';
  let navbarLinkActiveColor = actualAccent;
  let navbarLinkActiveBorder = actualAccent;

  if (mode === 'light') {
    navbarBg = 'rgba(255, 255, 255, 0.85)';
    navbarBorder = '#cbd5e1';
    navbarLinkHoverBg = 'rgba(0, 0, 0, 0.05)';
    navbarLinkActiveBg = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.15)`;
    navbarLinkActiveColor = actualAccent;
    navbarLinkActiveBorder = actualAccent;
  }

  root.style.setProperty('--navbar-bg', navbarBg);
  root.style.setProperty('--navbar-border', navbarBorder);
  root.style.setProperty('--navbar-link-hover-bg', navbarLinkHoverBg);
  root.style.setProperty('--navbar-link-active-bg', navbarLinkActiveBg);
  root.style.setProperty('--navbar-link-active-color', navbarLinkActiveColor);
  root.style.setProperty('--navbar-link-active-border', navbarLinkActiveBorder);

  // Set chatbot dynamic user text contrast color
  const chatbotUserText = mode === 'light' ? '#ffffff' : '#0b0c10';
  root.style.setProperty('--chatbot-user-text', chatbotUserText);

  // Show/Hide Chatbot based on configuration
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  if (chatbotToggle) {
    if (theme.chatbotEnabled === false) {
      chatbotToggle.style.setProperty('display', 'none', 'important');
      if (chatbotWindow) {
        chatbotWindow.classList.remove('active');
        chatbotWindow.style.setProperty('display', 'none', 'important');
      }
    } else {
      chatbotToggle.style.removeProperty('display');
      if (chatbotWindow) {
        chatbotWindow.style.removeProperty('display');
      }
    }
  }

  // 3. Update the 3D background colors
  if (window.updateThreeBgTheme) {
    window.updateThreeBgTheme(actualAccent, actualBg, mode);
  }
}

function getDarkBgForPreset(preset) {
  switch(preset) {
    case 'obsidian': return '#030712';
    case 'emerald': return '#022c22';
    case 'sunset': return '#0f0502';
    case 'lavender': return '#0b0514';
    case 'cyberpunk': return '#090514';
    default: return '#090a0f';
  }
}

function getLightBgForPreset(preset) {
  switch(preset) {
    case 'obsidian': return '#f0f9ff';
    case 'emerald': return '#f0fdf4';
    case 'sunset': return '#fff7ed';
    case 'lavender': return '#faf5ff';
    case 'cyberpunk': return '#fff1f2';
    default: return '#f8fafc';
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 219, b: 112 };
}

function loadGoogleFont(fontName) {
  const fontId = 'dynamic-google-font';
  let link = document.getElementById(fontId);
  if (!link) {
    link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  const formattedName = fontName.replace(/\s+/g, '+');
  link.href = `https://fonts.googleapis.com/css2?family=${formattedName}:wght@300;400;500;600;700&display=swap`;
}

function adjustColorBrightness(hex, percent) {
  let R = parseInt(hex.substring(1, 3), 16);
  let G = parseInt(hex.substring(3, 5), 16);
  let B = parseInt(hex.substring(5, 7), 16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = Math.min(255, Math.max(0, R));
  G = Math.min(255, Math.max(0, G));
  B = Math.min(255, Math.max(0, B));

  const rHex = R.toString(16).padStart(2, '0');
  const gHex = G.toString(16).padStart(2, '0');
  const bHex = B.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

// Function to render all sections from the window.portfolioData object
function renderPortfolio(data) {
  if (!data) {
    console.error("No portfolio data found!");
    return;
  }

  // Handle Maintenance / Under Development Mode
  const maintenancePage = document.getElementById('maintenance-page');
  const mainWrapper = document.querySelector('main');
  const chatbotToggle = document.getElementById('chatbot-toggle');
  
  if (data.settings && data.settings.siteOnline === false) {
    if (maintenancePage) maintenancePage.style.display = 'flex';
    if (mainWrapper) mainWrapper.style.display = 'none';
    if (chatbotToggle) chatbotToggle.style.display = 'none';
    

    
    // Render dynamic socials on maintenance page
    const list = data.profile?.socialsList || [];
    const maintenanceSocials = document.getElementById('maintenance-socials');
    if (maintenanceSocials && list.length > 0) {
      maintenanceSocials.innerHTML = list.map(soc => {
        const platform = soc.platform.toLowerCase();
        const icon = platform === 'custom' || platform === 'website' ? 'globe-outline' : `logo-${platform}`;
        return `<a href="${soc.url}" target="_blank" style="color: var(--light-gray-70); transition: color 0.3s;" onmouseover="this.style.color='var(--orange-yellow-crayola)'" onmouseout="this.style.color='var(--light-gray-70)'"><ion-icon name="${icon}"></ion-icon></a>`;
      }).join('');
    }
    
    // Set minimal meta info (Title & Favicon) even in maintenance mode
    if (data.settings.siteTitle) {
      document.title = data.settings.siteTitle;
    }
    if (data.settings.faviconUrl) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        link.type = 'image/x-icon';
        document.head.appendChild(link);
      }
      link.href = data.settings.faviconUrl;
    }
    return;
  } else {
    if (maintenancePage) maintenancePage.style.display = 'none';
    if (mainWrapper) mainWrapper.style.display = '';
    if (chatbotToggle && (!data.theme || data.theme.chatbotEnabled !== false)) {
      chatbotToggle.style.display = '';
    }
  }

  // Apply Theme configuration if available
  if (data.theme) {
    applyTheme(data.theme);
  }

  // Apply Site Settings (Title & Favicon)
  if (data.settings) {
    if (data.settings.siteTitle) {
      document.title = data.settings.siteTitle;
    } else if (data.profile && data.profile.name) {
      document.title = data.profile.name;
    }
    
    if (data.settings.faviconUrl) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        link.type = 'image/x-icon';
        document.head.appendChild(link);
      }
      link.href = data.settings.faviconUrl;
    }

    if (data.settings.metaDescription) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = data.settings.metaDescription;
    }
    if (data.settings.metaKeywords) {
      let metaKeys = document.querySelector('meta[name="keywords"]');
      if (!metaKeys) {
        metaKeys = document.createElement('meta');
        metaKeys.name = 'keywords';
        document.head.appendChild(metaKeys);
      }
      metaKeys.content = data.settings.metaKeywords;
    }
  } else if (data.profile && data.profile.name) {
    document.title = data.profile.name;
  }

  // Apply Section Visibility Toggles
  if (data.settings && data.settings.visibility) {
    const vis = data.settings.visibility;
    document.querySelectorAll('[data-nav-item]').forEach(li => {
      const item = li.getAttribute('data-nav-item');
      if (item && item !== 'about') {
        const isVisible = vis[item] !== false;
        li.style.display = isVisible ? 'block' : 'none';
      }
    });

    const activePage = document.querySelector('article.active');
    if (activePage) {
      const activeName = activePage.dataset.page;
      const sectionKey = activeName === 'portfolio' ? 'projects' : activeName;
      if (sectionKey && vis[sectionKey] === false) {
        showPage('about');
        document.querySelectorAll("[data-nav-link]").forEach(btn => {
          const label = btn.textContent.trim().toLowerCase();
          const targetName = navMap[label] || label;
          if (targetName === 'about') {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }
    }
  }

  // Render Profile / Sidebar
  const avatarContainer = document.getElementById('avatar-container');
  if (avatarContainer && data.profile) {
    avatarContainer.innerHTML = `<img src="${data.profile.avatar}" alt="${data.profile.name}" width="80">`;
  }

  const profileTitleContainer = document.getElementById('profile-title-container');
  if (profileTitleContainer && data.profile) {
    const isAnim = data.profile.roleAnimationEnabled;
    const roleHTML = isAnim 
      ? `<span class="role-text-typing"></span><span class="typing-cursor">|</span>`
      : data.profile.role;

    profileTitleContainer.innerHTML = `
      <h1 class="name">${data.profile.name}</h1>
      <div class="role">
        ${roleHTML}
        <div>@${data.profile.company}</div>
      </div>
    `;

    // Inject typing cursor style
    if (isAnim && !document.getElementById('typing-cursor-styles')) {
      const style = document.createElement('style');
      style.id = 'typing-cursor-styles';
      style.textContent = `
        .typing-cursor {
          animation: blinkCursor 0.8s infinite;
          color: var(--orange-yellow-crayola);
          margin-left: 2px;
          font-weight: 600;
          vertical-align: middle;
          display: inline-block;
        }
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    if (isAnim && Array.isArray(data.profile.rolesList) && data.profile.rolesList.length > 0) {
      startRoleTypingAnimation(data.profile.rolesList);
    }
  }

  const contactsContainer = document.getElementById('contacts-list-container');
  if (contactsContainer && data.profile) {
    contactsContainer.innerHTML = `
      <li class="contact-item">
        <div class="icon-box"><ion-icon name="mail-outline"></ion-icon></div>
        <div class="contact-info">
          <p class="contact-title">Email</p>
          <a href="mailto:${data.profile.email}" class="contact-link">${data.profile.email}</a>
        </div>
      </li>
      <li class="contact-item">
        <div class="icon-box"><ion-icon name="phone-portrait-outline"></ion-icon></div>
        <div class="contact-info">
          <p class="contact-title">Phone</p>
          <a href="tel:${data.profile.phone.replace(/\s+/g, '')}" class="contact-link">${data.profile.phone}</a>
        </div>
      </li>
      <li class="contact-item">
        <div class="icon-box"><ion-icon name="calendar-outline"></ion-icon></div>
        <div class="contact-info">
          <p class="contact-title">Birthday</p>
          <time datetime="${data.profile.birthday}">${data.profile.birthday}</time>
        </div>
      </li>
      <li class="contact-item">
        <div class="icon-box"><ion-icon name="location-outline"></ion-icon></div>
        <div class="contact-info">
          <p class="contact-title">Location</p>
          <address>${data.profile.location}</address>
        </div>
      </li>
    `;
  }

  const mapOldSocials = (socials) => {
    if (!socials) return [];
    const list = [];
    if (socials.linkedin) list.push({ platform: 'linkedin', url: socials.linkedin });
    if (socials.github) list.push({ platform: 'github', url: socials.github });
    if (socials.instagram) list.push({ platform: 'instagram', url: socials.instagram });
    return list;
  };

  const socialsContainer = document.getElementById('socials-container');
  if (socialsContainer && data.profile) {
    const list = data.profile.socialsList || mapOldSocials(data.profile.socials);
    socialsContainer.innerHTML = list.map(soc => {
      const platform = soc.platform.toLowerCase();
      const icon = platform === 'custom' || platform === 'website' ? 'globe-outline' : `logo-${platform}`;
      return `
        <li class="social-item">
          <a href="${soc.url}" class="social-link" target="_blank">
            <ion-icon name="${icon}"></ion-icon>
          </a>
        </li>
      `;
    }).join('');
  }

  const footerSocials = document.querySelector('.footer-socials');
  if (footerSocials && data.profile) {
    const list = data.profile.socialsList || mapOldSocials(data.profile.socials);
    footerSocials.innerHTML = list.map(soc => {
      const platform = soc.platform.toLowerCase();
      const icon = platform === 'custom' || platform === 'website' ? 'globe-outline' : `logo-${platform}`;
      return `<a href="${soc.url}" target="_blank"><ion-icon name="${icon}"></ion-icon></a>`;
    }).join('');
  }

  // Render About Me text
  const aboutTextContainer = document.getElementById('about-text-container');
  if (aboutTextContainer && data.about && data.about.paragraphs) {
    aboutTextContainer.innerHTML = data.about.paragraphs.map(p => `<p>${p}</p>`).join('');
  }

  // Render Services/What I'm doing list
  const servicesContainer = document.getElementById('services-container');
  if (servicesContainer && data.about && data.about.services) {
    servicesContainer.innerHTML = data.about.services.map(service => `
      <li class="service-item">
        <div class="service-icon-box">
          <img src="${service.icon}" width="40">
        </div>
        <div class="service-content-box">
          <h4 class="h4 service-item-title">${service.title}</h4>
          <p class="service-item-text">${service.desc}</p>
        </div>
      </li>
    `).join('');
  }

  // Render Testimonials List
  const testimonialsSection = document.getElementById('testimonials-section');
  if (testimonialsSection) {
    const isEnabled = data.settings ? data.settings.testimonialsEnabled !== false : true;
    const testimonials = (data.settings && data.settings.testimonials) || [];
    
    if (isEnabled && Array.isArray(testimonials) && testimonials.length > 0) {
      testimonialsSection.style.display = 'block';
      const testimonialsContainer = document.getElementById('testimonials-container');
      if (testimonialsContainer) {
        testimonialsContainer.innerHTML = testimonials.map(t => `
          <li class="testimonials-item">
            <div class="content-card" data-testimonials-item style="cursor: pointer;">
              <figure class="testimonials-avatar-box">
                <img src="${t.avatar || './assets/images/avatar-1.png'}" alt="${t.name}" width="60" data-testimonials-avatar>
              </figure>
              <h4 class="h4 testimonials-item-title" data-testimonials-title>${t.name}</h4>
              <p class="testimonials-company" style="font-size: 12px; color: var(--light-gray-70); margin-top: -4px; margin-bottom: 8px;">${t.role || ''} at ${t.company || ''}</p>
              <div class="testimonials-text" data-testimonials-text>
                <p>${t.content}</p>
              </div>
            </div>
          </li>
        `).join('');
      }
    } else {
      testimonialsSection.style.display = 'none';
    }
  }

  // Render Experience list
  const experienceContainer = document.getElementById('experience-container');
  if (experienceContainer && data.resume && data.resume.experience) {
    experienceContainer.innerHTML = data.resume.experience.map(exp => `
      <li class="timeline-item company-group">
        <div class="company-header">
          <div class="company-logo-wrapper">
            <img src="${exp.logo}" alt="${exp.company} Logo" class="company-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="company-logo-placeholder" style="display:none;">${exp.company.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}</div>
          </div>
          <div class="company-details">
            <h4 class="h4 company-name">${exp.company}</h4>
            <span class="total-duration">${exp.totalDuration}</span>
          </div>
        </div>
        
        <ul class="nested-roles-list">
          ${exp.roles.map(role => `
            <li class="role-item">
              <span class="role-dot"></span>
              <h5 class="role-title">${role.title}</h5>
              <span class="role-dates">${role.dates}</span>
              <p class="timeline-text">${role.desc}</p>
            </li>
          `).join('')}
        </ul>
      </li>
    `).join('');
  }

  // Render Education list
  const educationContainer = document.getElementById('education-container');
  if (educationContainer && data.resume && data.resume.education) {
    educationContainer.innerHTML = data.resume.education.map(edu => `
      <li class="timeline-item education-item">
        <div class="company-logo-wrapper">
          <img src="${edu.logo}" alt="School Logo" class="company-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="company-logo-placeholder" style="display:none;">${edu.school.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}</div>
        </div>
        <div class="school-details">
          <h4 class="h4 school-name">${edu.school}</h4>
          <span>${edu.dates}</span>
          <p class="timeline-text">${edu.desc}</p>
        </div>
      </li>
    `).join('');
  }

  // Render Skills list
  const skillsContainer = document.getElementById('skills-container');
  if (skillsContainer && data.resume && data.resume.skills) {
    skillsContainer.innerHTML = data.resume.skills.map(skill => `
      <li class="skills-item">
        <div class="title-wrapper">
          <h5 class="h5">${skill.name}</h5>
          <data>${skill.level}%</data>
        </div>
        <div class="skill-progress-bg">
          <div class="skill-progress-fill" style="width: ${skill.level}%;"></div>
        </div>
      </li>
    `).join('');
  }

  // Render Resume download link
  const resumeDownloadContainer = document.getElementById('resume-download-container');
  if (resumeDownloadContainer && data.resume) {
    resumeDownloadContainer.innerHTML = `
      <h3 class="h3 form-title">Download Resume</h3>
      <a href="${data.resume.downloadLink}"
         class="form-btn"
         target="_blank"
         style="display:inline-flex; align-items:center; gap:.6rem; padding:.7rem 1rem; border-radius:.6rem; text-decoration:none;">
        <ion-icon name="download-outline"></ion-icon>
        <span>Download Resume</span>
      </a>
    `;
  }

  // Render Certifications list
  const certificationsContainer = document.getElementById('certifications-container');
  if (certificationsContainer && data.certifications) {
    certificationsContainer.innerHTML = data.certifications.map(cert => `
      <li class="certification-item">
        <div class="content-card" style="padding: 20px; border-radius: 14px; border: 1px solid var(--jet); background: var(--bg-gradient-jet); display: flex; flex-direction: column; justify-content: space-between; height: 100%; gap: 15px; cursor: default;">
          <div style="display: flex; align-items: flex-start; gap: 15px;">
            <div class="certification-icon-wrapper" style="width: 48px; height: 48px; border-radius: 8px; background: rgba(255, 219, 112, 0.05); border: 1px solid rgba(255, 219, 112, 0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <ion-icon name="ribbon-outline" style="font-size: 24px; color: var(--orange-yellow-crayola);"></ion-icon>
            </div>
            <div>
              <h4 class="h4 certification-item-title" style="color: var(--white-1); font-size: 15px; margin-bottom: 4px; font-weight: var(--fw-600); line-height: 1.4;">${cert.title}</h4>
              <p style="color: var(--light-gray-70); font-size: 12px; margin: 0;">Verified Certification</p>
            </div>
          </div>
          <div style="display: flex; gap: 10px; margin-top: auto; flex-wrap: wrap;">
            <a href="${cert.link}" target="_blank" class="form-btn" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 8px; text-decoration: none; width: auto; font-size: 13px; font-weight: 500; font-family: inherit;">
              <ion-icon name="eye-outline"></ion-icon>
              <span>View Certificate</span>
            </a>
            ${cert.badge ? `
              <a href="${cert.badge}" target="_blank" class="form-btn" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 8px; text-decoration: none; width: auto; font-size: 13px; font-weight: 500; font-family: inherit; background: transparent !important; color: var(--orange-yellow-crayola) !important; border: 1px solid var(--orange-yellow-crayola); box-shadow: none;">
                <ion-icon name="checkmark-circle-outline"></ion-icon>
                <span>Verify Badge</span>
              </a>
            ` : ''}
          </div>
        </div>
      </li>
    `).join('');
  }

  // Render Projects list
  const projectsContainer = document.getElementById('projects-container');
  if (projectsContainer && data.projects) {
    const sortedProjects = [...data.projects].sort((a, b) => {
      const orderA = typeof a.sortOrder === 'number' ? a.sortOrder : 9999;
      const orderB = typeof b.sortOrder === 'number' ? b.sortOrder : 9999;
      return orderA - orderB;
    });

    projectsContainer.innerHTML = sortedProjects.map(project => `
      <li class="project-item active" data-filter-item data-category="${project.category.toLowerCase()}">
        <a href="${project.link}" ${project.link !== '#' ? 'target="_blank"' : ''}>
          <figure class="project-img" style="position: relative;">
            ${project.featured === true || project.featured === 'true' ? `
              <div class="project-featured-badge" style="position: absolute; top: 12px; left: 12px; background: var(--orange-yellow-crayola); color: var(--eerie-black-1); font-size: 10px; font-weight: var(--fw-600); padding: 3px 8px; border-radius: 20px; display: flex; align-items: center; gap: 3px; z-index: 2; box-shadow: var(--shadow-1);">
                <ion-icon name="star"></ion-icon>
                <span>Featured</span>
              </div>
            ` : ''}
            <div class="project-status-badge" style="position: absolute; top: 12px; right: 12px; background: ${project.status === 'In Progress' ? 'rgba(249, 115, 22, 0.9)' : 'rgba(52, 211, 153, 0.9)'}; color: #0b0c10; font-size: 10px; font-weight: var(--fw-600); padding: 3px 8px; border-radius: 20px; z-index: 2; box-shadow: var(--shadow-1);">
              <span>${project.status || 'Completed'}</span>
            </div>
            <div class="project-item-icon-box"><ion-icon name="eye-outline"></ion-icon></div>
            <img src="${project.image}" alt="${project.title}">
          </figure>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-category">${project.category}</p>
        </a>
      </li>
    `).join('');
  }

  // Render Achievements list
  const achievementsContainer = document.getElementById('achievements-container');
  if (achievementsContainer) {
    if (data.achievements && data.achievements.length > 0) {
      achievementsContainer.innerHTML = data.achievements.map(award => {
        const hasImg = award.image && award.image !== '';
        const imgBlock = hasImg 
          ? `<div class="achievement-img-wrapper" style="width: 80px; height: 80px; border-radius: 10px; overflow: hidden; flex-shrink: 0; background: rgba(255,255,255,0.02); border: 1px solid var(--jet); display: flex; align-items: center; justify-content: center;">
               <img src="${award.image}" alt="${award.title}" style="width: 100%; height: 100%; object-fit: cover;">
             </div>`
          : `<div class="achievement-icon-wrapper" style="width: 80px; height: 80px; border-radius: 10px; background: rgba(255, 219, 112, 0.05); border: 1px solid rgba(255, 219, 112, 0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
               <ion-icon name="trophy-outline" style="font-size: 32px; color: var(--orange-yellow-crayola);"></ion-icon>
             </div>`;

        return `
          <li class="achievement-item">
            <div class="content-card" style="padding: 20px; border-radius: 14px; border: 1px solid var(--jet); background: var(--bg-gradient-jet); display: flex; gap: 15px; align-items: center; height: 100%;">
              ${imgBlock}
              <div class="achievement-content" style="flex-grow: 1;">
                <span class="achievement-date" style="font-size: 11px; color: var(--orange-yellow-crayola); font-weight: var(--fw-500); display: block; margin-bottom: 4px;">${award.date || ''}</span>
                <h4 class="h4 achievement-item-title" style="color: var(--white-1); margin-bottom: 4px; font-size: 16px;">${award.title}</h4>
                <p class="achievement-text" style="color: var(--light-gray); font-size: 13px; line-height: 1.5; margin: 0;">${award.description || ''}</p>
              </div>
            </div>
          </li>
        `;
      }).join('');
    } else {
      achievementsContainer.innerHTML = `
        <li style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--light-gray-70);">
          <p>No achievements added yet.</p>
        </li>
      `;
    }
  }

  // Render Blogs list
  const blogsContainer = document.getElementById('blogs-container');
  if (blogsContainer) {
    const publishedBlogs = (data.blogs || []).filter(post => post.status === 'published');
    if (publishedBlogs.length > 0) {
      blogsContainer.innerHTML = publishedBlogs.map(post => {
        const hasImg = post.image && post.image !== '';
        const tagsHtml = post.tags 
          ? post.tags.split(',').map(tag => `<span class="blog-tag" style="background: rgba(255, 255, 255, 0.05); color: var(--light-gray); font-size: 10px; padding: 2px 6px; border-radius: 4px; border: 1px solid var(--jet);">${tag.trim()}</span>`).join('')
          : '';

        // Strip HTML tag snippets for the card excerpt
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = post.content || '';
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        const excerpt = plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;

        return `
          <li class="blog-post-item active" data-blog-index="${data.blogs.indexOf(post)}" style="cursor: pointer; display: flex; flex-direction: column; height: 100%;">
            <div class="content-card" style="padding: 0; border-radius: 14px; overflow: hidden; border: 1px solid var(--jet); background: var(--bg-gradient-jet); display: flex; flex-direction: column; height: 100%; transition: all 0.3s ease;">
              ${hasImg ? `
                <div class="blog-img-wrapper" style="width: 100%; height: 150px; overflow: hidden;">
                  <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
              ` : ''}
              <div class="blog-content" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 11px;">
                    <time class="blog-date" style="color: var(--light-gray-70);">${post.date || ''}</time>
                  </div>
                  <h4 class="h4 blog-item-title" style="color: var(--white-1); line-height: 1.4; margin-bottom: 8px; font-size: 16px;">${post.title}</h4>
                  <p class="blog-text" style="color: var(--light-gray); font-size: 13px; line-height: 1.5; margin-bottom: 12px;">${excerpt}</p>
                </div>
                <div>
                  <div class="blog-tags-container" style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 15px;">
                    ${tagsHtml}
                  </div>
                  <div class="blog-footer" style="display: flex; align-items: center; gap: 4px; color: var(--orange-yellow-crayola); font-weight: var(--fw-500); font-size: 13px;">
                    <span>Read More</span>
                    <ion-icon name="arrow-forward-outline" style="font-size: 14px;"></ion-icon>
                  </div>
                </div>
              </div>
            </div>
          </li>
        `;
      }).join('');
    } else {
      blogsContainer.innerHTML = `
        <li style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--light-gray-70);">
          <p>No blog posts published yet.</p>
        </li>
      `;
    }
  }

  // Render GitHub Stats Cards
  const githubStatsSection = document.getElementById('github-stats-section');
  if (githubStatsSection && data.settings) {
    const github = data.settings.github || {
      username: "dakshitpatel27",
      statsEnabled: true,
      languagesEnabled: true,
      theme: "dark"
    };

    const username = github.username ? github.username.trim() : '';
    const statsEnabled = github.statsEnabled !== false;
    const languagesEnabled = github.languagesEnabled !== false;
    const theme = github.theme || 'dark';

    if (username && (statsEnabled || languagesEnabled)) {
      githubStatsSection.style.display = 'block';
      const container = githubStatsSection.querySelector('.github-stats-cards');
      if (container) {
        let cardsHtml = '';
        if (statsEnabled) {
          cardsHtml += `<img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${theme}" alt="GitHub Stats" class="github-stats-img" style="max-width: 100%; border-radius: 12px; border: 1px solid var(--jet); padding: 5px; background: rgba(255, 255, 255, 0.02); height: auto;">`;
        }
        if (languagesEnabled) {
          cardsHtml += `<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}" alt="Top Languages" class="github-stats-img" style="max-width: 100%; border-radius: 12px; border: 1px solid var(--jet); padding: 5px; background: rgba(255, 255, 255, 0.02); height: auto;">`;
        }
        container.innerHTML = cardsHtml;
      }
    } else {
      githubStatsSection.style.display = 'none';
    }
  } else if (githubStatsSection) {
    githubStatsSection.style.display = 'none';
  }
}

let typingTimeout = null;
function startRoleTypingAnimation(rolesList) {
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }

  const roleContainer = document.querySelector('.role-text-typing');
  if (!roleContainer) return;
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;
  
  function type() {
    const currentRole = rolesList[roleIndex];
    if (!currentRole) return;

    if (isDeleting) {
      roleContainer.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      delay = 50;
    } else {
      roleContainer.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      delay = 100;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % rolesList.length;
      delay = 500;
    }
    
    typingTimeout = setTimeout(type, delay);
  }
  
  type();
}

// Run the renderer dynamically (fetches from Google Drive API if configured, otherwise falls back to local data.js)
function initPortfolio() {
  // 1. Try to load cached data from localStorage for instant loading
  const cachedDataStr = localStorage.getItem('portfolio_data_cache');
  let loadedData = null;
  
  if (cachedDataStr) {
    try {
      loadedData = JSON.parse(cachedDataStr);
    } catch (e) {
      console.error("Error parsing cached portfolio data:", e);
    }
  }
  
  // 2. If no cache, fall back to synchronously loaded window.portfolioData (from data.js)
  if (!loadedData && window.portfolioData) {
    loadedData = window.portfolioData;
  }
  
  // 3. Render immediately so page is loaded instantly
  if (loadedData) {
    renderPortfolio(loadedData);
    initInteractiveElements();
  }

  // 4. In parallel, fetch the latest data from the configured URL
  const gdriveUrl = window.API_URL || localStorage.getItem('gdrive_api_url');
  if (gdriveUrl) {
    fetch(gdriveUrl)
      .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then(data => {
        if (data && data.profile) {
          const freshDataStr = JSON.stringify(data);
          // Only re-render if the fetched data is actually different from what we rendered
          if (freshDataStr !== JSON.stringify(loadedData)) {
            window.portfolioData = data;
            renderPortfolio(data);
            initInteractiveElements();
          }
          // Update the cache
          localStorage.setItem('portfolio_data_cache', freshDataStr);
        }
      })
      .catch(err => {
        console.error("Failed to fetch dynamic data in background:", err);
        // If we hadn't rendered anything yet, try local fallback data
        if (!loadedData) {
          loadFallbackData();
        }
      });
  } else if (!loadedData) {
    loadFallbackData();
  }
}

function loadFallbackData() {
  if (window.portfolioData) {
    renderPortfolio(window.portfolioData);
  } else {
    console.error("Fallback portfolioData not loaded. Please check data.js file.");
  }
  initInteractiveElements();
}

document.addEventListener('DOMContentLoaded', initPortfolio);

// Global states
let interactiveInitialized = false;
let articlesContainer = null;
let navigationLinks = [];
let pages = [];

const pageOrder = ['about', 'resume', 'portfolio', 'achievements', 'blogs', 'certifications', 'contact'];
const navMap = {
  'about': 'about',
  'resume': 'resume',
  'projects': 'portfolio',
  'achievements': 'achievements',
  'blog': 'blogs',
  'certifications': 'certifications',
  'contact': 'contact'
};

function updateContainerHeight(targetPage) {
  if (articlesContainer && targetPage) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const height = targetPage.offsetHeight;
        articlesContainer.style.height = `${height}px`;
      });
    });
  }
}

function showPage(targetName) {
  const targetIndex = pageOrder.indexOf(targetName);
  if (targetIndex === -1) return;

  let targetPage = null;

  pages.forEach(page => {
    const pageName = page.dataset.page;
    const pageIndex = pageOrder.indexOf(pageName);

    page.classList.remove('active', 'past-page', 'future-page');

    if (pageIndex < targetIndex) {
      page.classList.add('past-page');
    } else if (pageIndex === targetIndex) {
      page.classList.add('active');
      targetPage = page;
    } else {
      page.classList.add('future-page');
    }
  });

  if (targetPage) {
    updateContainerHeight(targetPage);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.setThreeBgMode) {
    window.setThreeBgMode(targetName);
  }
}

function initDynamicTilt() {
  const cards = document.querySelectorAll('.project-item:not(.tilt-initialized), .service-item:not(.tilt-initialized)');
  
  if (window.innerWidth > 768) {
    cards.forEach(card => {
      card.classList.add('tilt-initialized');
      card.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';
      card.style.transformStyle = 'preserve-3d';
      
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const dx = (x - xc) / xc;
        const dy = (y - yc) / yc;
        
        const tiltX = dy * -8;
        const tiltY = dx * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.008, 1.008, 1.008)`;
        card.style.boxShadow = `${-tiltY * 1.2}px ${tiltX * 1.2}px 25px rgba(0, 0, 0, 0.4)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.boxShadow = '';
      });
    });
  }
}

// Toast logic
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const icon = document.getElementById("toast-icon");
  const title = document.getElementById("toast-title");
  const desc = document.getElementById("toast-desc");

  if (toast && icon && title && desc) {
    if (type === "success") {
      icon.setAttribute("name", "checkmark-circle");
      icon.style.color = "var(--orange-yellow-crayola)";
      toast.style.borderColor = "rgba(255, 219, 112, 0.3)";
      title.textContent = "Success";
    } else {
      icon.setAttribute("name", "alert-circle");
      icon.style.color = "var(--bittersweet-shimmer)";
      toast.style.borderColor = "rgba(239, 68, 68, 0.3)";
      title.textContent = "Error";
    }
    desc.textContent = message;

    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }
}

function initInteractiveElements() {
  // Query/re-query dynamic containers
  articlesContainer = document.querySelector(".articles-container");
  pages = document.querySelectorAll("[data-page]");
  navigationLinks = document.querySelectorAll("[data-nav-link]");

  // 1. Re-initialize dynamic card 3D tilt effects
  initDynamicTilt();

  // 2. Update container height for the current active page
  const activePage = document.querySelector('article.active');
  if (activePage) {
    updateContainerHeight(activePage);
  }

  // 3. Prevent duplicate static event listeners
  if (interactiveInitialized) {
    return;
  }
  interactiveInitialized = true;

  // element toggle function
  const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

  // sidebar variables
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");

  // sidebar toggle functionality for mobile
  if (sidebarBtn && sidebar) {
    sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
  }

  // testimonials variables
  const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");

  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  const testimonialsModalFunc = function () {
    if (modalContainer && overlay) {
      modalContainer.classList.toggle("active");
      overlay.classList.toggle("active");
    }
  }

  // Event Delegation for Testimonials Click Modal
  document.addEventListener("click", function (e) {
    const item = e.target.closest("[data-testimonials-item]");
    if (item) {
      const avatar = item.querySelector("[data-testimonials-avatar]");
      const title = item.querySelector("[data-testimonials-title]");
      const company = item.querySelector(".testimonials-company");
      const text = item.querySelector("[data-testimonials-text]");
      if (avatar && title && text && modalImg && modalTitle && modalText) {
        modalImg.src = avatar.src;
        modalImg.alt = avatar.alt;
        let subTitleText = company ? company.textContent.trim() : '';
        modalTitle.innerHTML = title.textContent.trim() + (subTitleText ? `<br><span style="font-size:13px; color:var(--light-gray-70); font-weight:var(--fw-300);">${subTitleText}</span>` : '');
        modalText.innerHTML = text.innerHTML;
        testimonialsModalFunc();
      }
    }
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  if (overlay) overlay.addEventListener("click", testimonialsModalFunc);

  // custom select variables
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-selecct-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");

  if (select && selectValue) {
    select.addEventListener("click", function () { elementToggleFunc(this); });

    for (let i = 0; i < selectItems.length; i++) {
      selectItems[i].addEventListener("click", function () {
        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);
      });
    }
  }

  // filter function (always queries current DOM elements dynamically to support re-rendering)
  const filterFunc = function (selectedValue) {
    const filterItems = document.querySelectorAll("[data-filter-item]");
    for (let i = 0; i < filterItems.length; i++) {
      if (selectedValue === "all") {
        filterItems[i].classList.add("active");
      } else if (filterItems[i].dataset.category.includes(selectedValue)) {
        filterItems[i].classList.add("active");
      } else {
        filterItems[i].classList.remove("active");
      }
    }
  }

  if (filterBtn.length > 0 && selectValue) {
    let lastClickedBtn = filterBtn[0];

    for (let i = 0; i < filterBtn.length; i++) {
      filterBtn[i].addEventListener("click", function () {
        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);
        if (lastClickedBtn) lastClickedBtn.classList.remove("active");
        this.classList.add("active");
        lastClickedBtn = this;
      });
    }
  }

  // contact form variables and dynamic rendering
  const form = document.querySelector("[data-form]");
  if (form && window.portfolioData) {
    const contactForm = window.portfolioData.settings?.contactForm || {
      title: "Get in touch",
      fields: [
        { type: "text", name: "fullname", placeholder: "Full name", required: true },
        { type: "email", name: "email", placeholder: "Email address", required: true },
        { type: "tel", name: "phone", placeholder: "Phone number", required: false },
        { type: "text", name: "subject", placeholder: "Subject", required: true },
        { type: "textarea", name: "message", placeholder: "Your Message", required: true }
      ]
    };

    // Update form title if element exists
    const formTitleEl = document.querySelector(".form-title");
    if (formTitleEl) {
      formTitleEl.textContent = contactForm.title || "Get in touch";
    }

    let formHTML = '';
    let currentGroup = [];

    contactForm.fields.forEach((field) => {
      const isFullWidth = field.type === 'textarea';
      
      const inputHTML = field.type === 'textarea' 
        ? `<textarea name="${field.name}" class="form-input" placeholder="${field.placeholder}" ${field.required ? 'required' : ''} data-form-input></textarea>`
        : `<input type="${field.type}" name="${field.name}" class="form-input" placeholder="${field.placeholder}" ${field.required ? 'required' : ''} data-form-input>`;

      if (isFullWidth) {
        if (currentGroup.length > 0) {
          formHTML += `<div class="input-wrapper">${currentGroup.join('')}</div>`;
          currentGroup = [];
        }
        formHTML += inputHTML;
      } else {
        currentGroup.push(inputHTML);
        if (currentGroup.length === 2) {
          formHTML += `<div class="input-wrapper">${currentGroup.join('')}</div>`;
          currentGroup = [];
        }
      }
    });

    if (currentGroup.length > 0) {
      formHTML += `<div class="input-wrapper">${currentGroup.join('')}</div>`;
    }

    // Add submit button
    formHTML += `
      <button class="form-btn" type="submit" disabled data-form-btn>
        <ion-icon name="paper-plane-outline"></ion-icon>
        <span>Send Message</span>
      </button>
    `;

    form.innerHTML = formHTML;

    // Fetch elements again after rendering
    const formInputs = form.querySelectorAll("[data-form-input]");
    const formBtn = form.querySelector("[data-form-btn]");

    if (formInputs.length > 0 && formBtn) {
      for (let i = 0; i < formInputs.length; i++) {
        formInputs[i].addEventListener("input", function () {
          if (form.checkValidity()) {
            formBtn.removeAttribute("disabled");
          } else {
            formBtn.setAttribute("disabled", "");
          }
        });
      }

      form.addEventListener("submit", function (event) {
        event.preventDefault();

        const originalBtnText = formBtn.innerHTML;
        formBtn.innerHTML = `<span class="spinner"></span> Sending...`;
        formBtn.setAttribute("disabled", "");

        const accessKey = (window.portfolioData && window.portfolioData.settings && window.portfolioData.settings.web3FormsKey) || "1fe4ef89-0663-48b3-92b0-e26621a864b1";
        
        // Dynamically build submit payload
        const payload = {
          access_key: accessKey
        };
        formInputs.forEach(input => {
          const name = input.getAttribute("name");
          if (name) {
            payload[name] = input.value.trim();
          }
        });

        // 1. Submit to Web3Forms
        const web3formsPromise = fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        }).then(async (res) => {
          const ok = res.ok;
          const data = await res.json();
          return { success: ok && data.success, message: data.message };
        }).catch(err => ({ success: false, message: err.message }));

        // 2. Submit to local inquiries logger endpoint
        const localPromise = fetch("/api/submit-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fullname: payload.fullname,
            email: payload.email,
            phone: payload.phone,
            subject: payload.subject,
            message: payload.message
          })
        }).then(async (res) => {
          const ok = res.ok;
          const data = await res.json();
          return { success: ok && data.success, error: data.error };
        }).catch(err => ({ success: false, error: err.message }));

        // 3. Submit to Google Apps Script Web App if configured
        let gdrivePromise = Promise.resolve({ success: false });
        const gdriveUrl = window.API_URL || localStorage.getItem('gdrive_api_url');
        if (gdriveUrl) {
          gdrivePromise = fetch(gdriveUrl, {
            method: "POST",
            mode: "cors",
            redirect: "follow",
            body: JSON.stringify({
              action: 'submit-message',
              fullname: payload.fullname,
              email: payload.email,
              phone: payload.phone,
              subject: payload.subject,
              message: payload.message
            })
          }).then(async (res) => {
            const ok = res.ok;
            const data = await res.json();
            return { success: ok && data.success, error: data.error };
          }).catch(err => ({ success: false, error: err.message }));
        }

        Promise.allSettled([web3formsPromise, localPromise, gdrivePromise])
        .then(([web3Result, localResult, gdriveResult]) => {
          const web3Success = web3Result.status === 'fulfilled' && web3Result.value.success;
          const localSuccess = localResult.status === 'fulfilled' && localResult.value.success;
          const gdriveSuccess = gdriveResult.status === 'fulfilled' && gdriveResult.value.success;

          if (web3Success || localSuccess || gdriveSuccess) {
            showToast("Your message has been sent successfully!");
            form.reset();
          } else {
            const errMsg = (web3Result.status === 'fulfilled' ? web3Result.value.message : null) || 
                           (localResult.status === 'fulfilled' ? localResult.value.error : null) || 
                           (gdriveResult.status === 'fulfilled' ? gdriveResult.value.error : null) || 
                           "Failed to send message. Please try again.";
            showToast(errMsg, "error");
          }
        })
        .catch((error) => {
          console.error(error);
          showToast("Network error. Please try again later.", "error");
        })
        .then(() => {
          formBtn.innerHTML = originalBtnText;
          if (form.checkValidity()) {
            formBtn.removeAttribute("disabled");
          } else {
            formBtn.setAttribute("disabled", "");
          }
        });
      });
    }
  }

  // Event Delegation for Blog Modal Trigger
  document.addEventListener("click", function (e) {
    const blogItem = e.target.closest(".blog-post-item");
    if (blogItem) {
      const idx = parseInt(blogItem.getAttribute("data-blog-index"), 10);
      if (window.portfolioData && window.portfolioData.blogs && window.portfolioData.blogs[idx]) {
        const post = window.portfolioData.blogs[idx];
        const modal = document.getElementById("blog-modal");
        const modalImgContainer = document.getElementById("blog-modal-image-container");
        const modalImg = document.getElementById("blog-modal-image");
        const modalTitle = document.getElementById("blog-modal-title");
        const modalDate = document.getElementById("blog-modal-date");
        const modalTags = document.getElementById("blog-modal-tags");
        const modalText = document.getElementById("blog-modal-text");
        const overlay = document.querySelector("[data-blog-overlay]");

        if (modal && modalTitle && modalDate && modalTags && modalText && overlay) {
          modalTitle.textContent = post.title;
          modalDate.textContent = post.date || '';
          
          if (post.image) {
            modalImg.src = post.image;
            modalImgContainer.style.display = 'block';
          } else {
            modalImgContainer.style.display = 'none';
          }

          if (post.tags) {
            modalTags.innerHTML = post.tags.split(',').map(tag => `<span style="background: rgba(255, 255, 255, 0.05); color: var(--light-gray); font-size: 11px; padding: 3px 8px; border-radius: 4px; border: 1px solid var(--jet);">${tag.trim()}</span>`).join('');
            modalTags.style.display = 'flex';
          } else {
            modalTags.style.display = 'none';
          }

          modalText.innerHTML = post.content || '';
          
          modal.classList.add("active");
          overlay.classList.add("active");
        }
      }
    }
  });

  // Blog Close Modal Trigger
  const closeBlogBtn = document.querySelector("[data-blog-modal-close-btn]");
  const blogOverlay = document.querySelector("[data-blog-overlay]");
  const blogModalCloseFunc = function() {
    const modal = document.getElementById("blog-modal");
    const overlay = document.querySelector("[data-blog-overlay]");
    if (modal && overlay) {
      modal.classList.remove("active");
      overlay.classList.remove("active");
    }
  };
  if (closeBlogBtn) closeBlogBtn.addEventListener("click", blogModalCloseFunc);
  if (blogOverlay) blogOverlay.addEventListener("click", blogModalCloseFunc);

  navigationLinks.forEach(btn => {
    btn.type = 'button';
    btn.addEventListener('click', function () {
      const label = this.textContent.trim().toLowerCase();
      const targetName = navMap[label] || label;

      navigationLinks.forEach(link => link.classList.remove('active'));
      this.classList.add('active');

      showPage(targetName);
    });
  });

  window.addEventListener('resize', () => {
    const activePage = document.querySelector('article.active');
    if (activePage) {
      updateContainerHeight(activePage);
    }
  });
  window.addEventListener('load', () => {
    const activePage = document.querySelector('article.active');
    if (activePage) {
      updateContainerHeight(activePage);
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const activePage = document.querySelector('article.active');
    if (activePage) {
      updateContainerHeight(activePage);
    }
  });

  // Show 'about' page on init
  showPage('about');
}

// Handle "Notify Me" form submission on the Maintenance / Under Development Page
function submitNotificationRequest(event) {
  event.preventDefault();
  const form = event.target;
  const emailInput = document.getElementById('notify-email');
  const successMsg = document.getElementById('notify-success-msg');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  if (!emailInput || !emailInput.value.trim()) return;

  const email = emailInput.value.trim();
  const originalBtnText = submitBtn.innerHTML;
  
  submitBtn.innerHTML = `<span class="spinner" style="border-top-color: var(--eerie-black-1); width: 12px; height: 12px; margin-right: 4px;"></span> Sending...`;
  submitBtn.setAttribute('disabled', '');

  const payload = {
    fullname: "Notification Subscriber",
    email: email,
    phone: "",
    subject: "Newsletter / Launch Notification Request",
    message: `This visitor requested to be notified when the website is back online.`
  };

  // Determine submission endpoint (G-Drive cloud if configured, otherwise fallback local Express server)
  const gdriveUrl = window.API_URL || localStorage.getItem('gdrive_api_url');
  
  let promise;
  if (gdriveUrl) {
    promise = fetch(gdriveUrl, {
      method: "POST",
      mode: "cors",
      redirect: "follow",
      body: JSON.stringify({
        action: 'submit-message',
        fullname: payload.fullname,
        email: payload.email,
        phone: payload.phone,
        subject: payload.subject,
        message: payload.message
      })
    })
    .then(async (res) => {
      const data = await res.json();
      return { success: res.ok && data.success, error: data.error };
    });
  } else {
    promise = fetch('/api/submit-message', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(async (res) => {
      const data = await res.json();
      return { success: res.ok && data.success, error: data.error };
    });
  }

  promise
  .then(result => {
    if (result.success) {
      if (successMsg) {
        successMsg.style.display = 'block';
        successMsg.innerHTML = `<ion-icon name="checkmark-circle-outline" style="vertical-align: middle; margin-right: 4px; font-size: 16px; color: var(--orange-yellow-crayola);"></ion-icon>You will be notified when we are online!`;
        successMsg.style.color = 'var(--orange-yellow-crayola)';
      }
      form.reset();
    } else {
      if (successMsg) {
        successMsg.style.display = 'block';
        successMsg.innerHTML = `<ion-icon name="alert-circle-outline" style="vertical-align: middle; margin-right: 4px; font-size: 16px; color: #ef4444;"></ion-icon>${result.error || 'Failed to request notification. Please try again.'}`;
        successMsg.style.color = '#ef4444';
      }
    }
  })
  .catch(err => {
    console.error(err);
    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.innerHTML = `<ion-icon name="alert-circle-outline" style="vertical-align: middle; margin-right: 4px; font-size: 16px; color: #ef4444;"></ion-icon>Network error. Please try again later.`;
      successMsg.style.color = '#ef4444';
    }
  })
  .then(() => {
    submitBtn.innerHTML = originalBtnText;
    submitBtn.removeAttribute('disabled');
  });
}
