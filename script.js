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

  // Apply Theme configuration if available
  if (data.theme) {
    applyTheme(data.theme);
  }

  // Render Profile / Sidebar
  const avatarContainer = document.getElementById('avatar-container');
  if (avatarContainer && data.profile) {
    avatarContainer.innerHTML = `<img src="${data.profile.avatar}" alt="${data.profile.name}" width="80">`;
  }

  const profileTitleContainer = document.getElementById('profile-title-container');
  if (profileTitleContainer && data.profile) {
    profileTitleContainer.innerHTML = `
      <h1 class="name">${data.profile.name}</h1>
      <div class="role">
        ${data.profile.role}
        <div>@${data.profile.company}</div>
      </div>
    `;
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

  const socialsContainer = document.getElementById('socials-container');
  if (socialsContainer && data.profile && data.profile.socials) {
    socialsContainer.innerHTML = `
      <li class="social-item">
        <a href="${data.profile.socials.linkedin}" class="social-link" target="_blank">
          <ion-icon name="logo-linkedin"></ion-icon>
        </a>
      </li>
      <li class="social-item">
        <a href="${data.profile.socials.github}" class="social-link" target="_blank">
          <ion-icon name="logo-github"></ion-icon>
        </a>
      </li>
      <li class="social-item">
        <a href="${data.profile.socials.instagram}" class="social-link" target="_blank">
          <ion-icon name="logo-instagram"></ion-icon>
        </a>
      </li>
    `;
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
      <li>
        ${cert.title} — 
        <a href="${cert.link}" target="_blank">View Certificate</a>
        ${cert.badge ? `- <a href="${cert.badge}" target="_blank"> Verify Badge</a>` : ''}
      </li>
    `).join('');
  }

  // Render Projects list
  const projectsContainer = document.getElementById('projects-container');
  if (projectsContainer && data.projects) {
    projectsContainer.innerHTML = data.projects.map(project => `
      <li class="project-item active" data-filter-item data-category="${project.category.toLowerCase()}">
        <a href="${project.link}" ${project.link !== '#' ? 'target="_blank"' : ''}>
          <figure class="project-img">
            <div class="project-item-icon-box"><ion-icon name="eye-outline"></ion-icon></div>
            <img src="${project.image}" alt="${project.title}">
          </figure>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-category">${project.category}</p>
        </a>
      </li>
    `).join('');
  }
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

const pageOrder = ['about', 'resume', 'portfolio', 'certifications', 'contact'];
const navMap = {
  'about': 'about',
  'resume': 'resume',
  'projects': 'portfolio',
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

  if (modalImg && modalTitle && modalText && testimonialsItem.length > 0) {
    for (let i = 0; i < testimonialsItem.length; i++) {
      testimonialsItem[i].addEventListener("click", function () {
        const avatar = this.querySelector("[data-testimonials-avatar]");
        const title = this.querySelector("[data-testimonials-title]");
        const text = this.querySelector("[data-testimonials-text]");
        if (avatar && title && text) {
          modalImg.src = avatar.src;
          modalImg.alt = avatar.alt;
          modalTitle.innerHTML = title.innerHTML;
          modalText.innerHTML = text.innerHTML;
          testimonialsModalFunc();
        }
      });
    }
  }

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

  // contact form variables
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  // add event to all form input fields for live validation and handle background submit
  if (form && formInputs.length > 0 && formBtn) {
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

      const fullname = form.querySelector('[name="fullname"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const subject = form.querySelector('[name="subject"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();

      const accessKey = "1fe4ef89-0663-48b3-92b0-e26621a864b1";

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: fullname,
          email: email,
          phone: phone,
          subject: subject,
          message: message
        })
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status === 200) {
          showToast("Your message has been sent successfully!");
          form.reset();
        } else {
          showToast(json.message || "Failed to send message. Please try again.", "error");
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