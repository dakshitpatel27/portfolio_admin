'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Select chatbot DOM elements
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotSuggestions = document.getElementById('chatbot-suggestions');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  
  if (!chatbotToggle || !chatbotWindow || !chatbotMessages || !chatbotSuggestions || !chatbotInput || !chatbotSend) {
    console.error('Chatbot elements not found in DOM!');
    return;
  }

  // Update custom chatbot title and subtitle immediately if available
  const chatbotTitleEl = document.querySelector('.chatbot-title');
  const chatbotSubtitleEl = document.querySelector('.chatbot-subtitle');
  if (window.portfolioData && window.portfolioData.chatbot) {
    if (window.portfolioData.chatbot.title && chatbotTitleEl) {
      chatbotTitleEl.textContent = window.portfolioData.chatbot.title;
    }
    if (window.portfolioData.chatbot.subtitle && chatbotSubtitleEl) {
      chatbotSubtitleEl.textContent = window.portfolioData.chatbot.subtitle;
    }
  }

  let isInitialized = false;

  // Toggle chatbot visibility
  chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('active');
    
    // Hide notification badge on first open
    const badge = chatbotToggle.querySelector('.chatbot-notification');
    if (badge) {
      badge.style.display = 'none';
    }
    
    if (chatbotWindow.classList.contains('active')) {
      chatbotInput.focus();
      scrollToBottom();
      if (!isInitialized) {
        initializeChat();
      }
    }
  });

  // Close chatbot
  chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.remove('active');
  });

  // Handle enter key in input
  chatbotInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Handle send button click
  chatbotSend.addEventListener('click', sendMessage);

  // Auto scroll messages to bottom
  function scrollToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Predefined suggestion chips
  const defaultSuggestions = [
    { label: '👋 About Me', query: 'Tell me about yourself' },
    { label: '💻 Skills', query: 'What are your skills?' },
    { label: '🚀 Projects', query: 'Show me your projects' },
    { label: '💼 Work Experience', query: 'Tell me about your experience' },
    { label: '🎓 Education', query: 'Where did you study?' },
    { label: '📜 Certifications', query: 'Show me your certifications' },
    { label: '📞 Contact Info', query: 'How can I contact you?' },
    { label: '📄 Download CV', query: 'How can I download your CV?' }
  ];

  // Initialize welcome message and chips
  function initializeChat() {
    isInitialized = true;
    
    // Suggestion chips
    const chips = window.portfolioData?.chatbot?.suggestions || defaultSuggestions;
    renderChips(chips);
    
    // Welcome message with user name if available
    const welcomeHTML = window.portfolioData?.chatbot?.welcomeMessage || 
      `<p>Hi there! I am <strong>${window.portfolioData?.profile?.name || 'Dakshit'}</strong>'s AI assistant.</p><p>I can help answer questions about his skills, experience, projects, education, or how to contact him. What would you like to know?</p>`;
      
    addBotMessage(welcomeHTML);
  }

  // Render suggestion chips
  function renderChips(chips) {
    chatbotSuggestions.innerHTML = '';
    chips.forEach(chip => {
      const chipEl = document.createElement('button');
      chipEl.className = 'chatbot-chip';
      chipEl.innerText = chip.label;
      chipEl.addEventListener('click', () => {
        sendUserMessage(chip.query);
      });
      chatbotSuggestions.appendChild(chipEl);
    });
  }

  // Send a message from input
  function sendMessage() {
    const text = chatbotInput.value.trim();
    if (!text) return;
    chatbotInput.value = '';
    sendUserMessage(text);
  }

  // Send user message
  function sendUserMessage(text) {
    addUserMessage(text);
    showTypingIndicator();
    
    // Realistic delayed response
    const delay = Math.max(600, Math.min(1000, text.length * 10));
    setTimeout(() => {
      hideTypingIndicator();
      const response = generateResponse(text);
      addBotMessage(response);
    }, delay);
  }

  // Append user bubble to DOM
  function addUserMessage(text) {
    const msgEl = document.createElement('div');
    msgEl.className = 'chatbot-msg user';
    msgEl.innerText = text;
    chatbotMessages.appendChild(msgEl);
    scrollToBottom();
  }

  // Append bot bubble to DOM (supports HTML)
  function addBotMessage(html) {
    const msgEl = document.createElement('div');
    msgEl.className = 'chatbot-msg bot';
    msgEl.innerHTML = html;
    chatbotMessages.appendChild(msgEl);
    scrollToBottom();
  }

  // Show typing animation bubble
  function showTypingIndicator() {
    hideTypingIndicator(); // clear existing if any
    const typingEl = document.createElement('div');
    typingEl.className = 'chatbot-typing';
    typingEl.id = 'chatbot-typing-indicator';
    typingEl.innerHTML = `
      <div class="chatbot-dot"></div>
      <div class="chatbot-dot"></div>
      <div class="chatbot-dot"></div>
    `;
    chatbotMessages.appendChild(typingEl);
    scrollToBottom();
  }

  // Hide typing animation bubble
  function hideTypingIndicator() {
    const indicator = document.getElementById('chatbot-typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // NLP engine: Intent matching & dynamic database extraction
  function generateResponse(query) {
    const cleanQuery = query.toLowerCase().trim();
    const data = window.portfolioData;
    
    if (!data) {
      return `<p>I'm sorry, I couldn't load the portfolio data right now. Please try again later or reach out via email.</p>`;
    }

    // Custom Q&As Intent Matching
    if (data.chatbot && Array.isArray(data.chatbot.customQAs)) {
      for (let i = 0; i < data.chatbot.customQAs.length; i++) {
        const qa = data.chatbot.customQAs[i];
        if (qa && qa.keywords && qa.response) {
          const keywordsList = qa.keywords.split(',').map(kw => kw.trim().toLowerCase()).filter(Boolean);
          if (matchKeywords(cleanQuery, keywordsList)) {
            return qa.response;
          }
        }
      }
    }

    // Intent 1: Greeting
    if (matchKeywords(cleanQuery, ['hi', 'hello', 'hey', 'greetings', 'hola', 'yo', 'good morning', 'good afternoon', 'good evening'])) {
      const name = data.profile?.name || 'Dakshit';
      return `<p>Hello! Hope you are having a wonderful day. I am here to help. Ask me anything about ${name}'s skills, projects, work experience, or education!</p>`;
    }

    // Intent 2: Help / Capabilities
    if (matchKeywords(cleanQuery, ['help', 'what can you do', 'capabilities', 'questions', 'support', 'features'])) {
      return `<p>I can answer detailed questions about Dakshit. Try asking me:</p>
      <ul>
        <li><strong>"What is your CGPA?"</strong></li>
        <li><strong>"Tell me about Nine Formula"</strong> or <strong>"Sigzen"</strong></li>
        <li><strong>"Explain the Smart Parking project"</strong></li>
        <li><strong>"What languages do you know?"</strong></li>
        <li><strong>"How can I download your CV?"</strong></li>
        <li><strong>"Where did you study?"</strong></li>
        <li><strong>"How can I contact you?"</strong></li>
      </ul>`;
    }

    // Intent 3: Availability / Hiring / Work status
    if (matchKeywords(cleanQuery, ['hire', 'hiring', 'job opportunity', 'available', 'open to work', 'freelance', 'remote', 'looking for work', 'contract'])) {
      const email = data.profile?.email || 'dakshit.gajipara2707@gmail.com';
      return `<p><strong>Dakshit is actively open to new job opportunities!</strong></p>
      <p>He is looking for roles in **Python/Django Backend Development**, **Frappe/ERPNext Customization**, or **Full-Stack Software Engineering**.</p>
      <p>He is ready to work remote, hybrid, or on-site in Ahmedabad. Feel free to contact him directly at <a href="mailto:${email}" style="color: var(--orange-yellow-crayola); text-decoration: underline;">${email}</a> to schedule an interview!</p>`;
    }

    // Intent 4: Work Experience at Nine Formula Retech
    if (matchKeywords(cleanQuery, ['nine formula', 'nineformula', 'retech'])) {
      const exp = data.resume?.experience?.find(e => e.company.toLowerCase().includes('nine formula') || e.company.toLowerCase().includes('retech'));
      if (exp) {
        let expHtml = `<p><strong>Nine Formula Retech LLP</strong> (${exp.totalDuration}):</p><ul>`;
        exp.roles.forEach(role => {
          expHtml += `<li><strong>${role.title}</strong> (${role.dates})<br>${role.desc}</li>`;
        });
        expHtml += `</ul>`;
        return expHtml;
      }
      return `<p>Dakshit works at <strong>Nine Formula Retech LLP</strong> as a Jr. Python Developer (June 2026 — Present) and previously worked as a Python Developer Intern (Feb 2026 — May 2026). He develops backend systems and custom Frappe scripts.</p>`;
    }

    // Intent 5: Work Experience at Sigzen Technologies
    if (matchKeywords(cleanQuery, ['sigzen'])) {
      const exp = data.resume?.experience?.find(e => e.company.toLowerCase().includes('sigzen'));
      if (exp) {
        let expHtml = `<p><strong>Sigzen Technologies PVT LTD</strong> (${exp.totalDuration}):</p><ul>`;
        exp.roles.forEach(role => {
          expHtml += `<li><strong>${role.title}</strong> (${role.dates})<br>${role.desc}</li>`;
        });
        expHtml += `</ul>`;
        return expHtml;
      }
      return `<p>Dakshit completed a Python Developer Internship at <strong>Sigzen Technologies PVT LTD</strong> (Nov 2025 — Feb 2026), working on ERPNext customization, server-side scripting, and workflow automations.</p>`;
    }

    // Intent 6: CGPA / Grades / GPA
    if (matchKeywords(cleanQuery, ['cgpa', 'gpa', 'grades', 'marks', 'percentage', 'score', 'c.g.p.a'])) {
      const coll = data.resume?.education?.find(e => e.school.toLowerCase().includes('lj') || e.desc.toLowerCase().includes('cgpa'));
      if (coll) {
        return `<p>Dakshit has a **CGPA of 7.95** (Bachelor of Engineering in Computer Science & Technology) from **${coll.school}**.</p>`;
      }
      return `<p>Dakshit has achieved a **CGPA of 7.95** in his Bachelor of Engineering in Computer Science & Technology.</p>`;
    }

    // Intent 7: Location / Address
    if (matchKeywords(cleanQuery, ['location', 'where do you live', 'where are you from', 'located', 'address', 'living', 'ahmedabad', 'gujarat', 'india'])) {
      const loc = data.profile?.location || 'Ahmedabad, Gujarat, India';
      return `<p>Dakshit is located in <strong>${loc}</strong>.</p>`;
    }

    // Intent 8: Student Performance Tracking Project
    if (matchKeywords(cleanQuery, ['student performance', 'performance tracking'])) {
      const proj = data.projects?.find(p => p.title.toLowerCase().includes('student'));
      let response = `<p><strong>Student Performance Tracking System</strong>:</p>
      <p>A specialized management platform built to monitor, evaluate, and report academic metrics. Implemented backend workflow triggers and custom reports using Python, Frappe Framework, and JavaScript.</p>`;
      if (proj && proj.link && proj.link !== '#') {
        response += `<p><a href="${proj.link}" target="_blank" style="color: var(--orange-yellow-crayola); text-decoration: underline;">View Project live</a></p>`;
      }
      return response;
    }

    // Intent 9: Smart Parking project
    if (matchKeywords(cleanQuery, ['smart parking', 'parking management'])) {
      const proj = data.projects?.find(p => p.title.toLowerCase().includes('parking'));
      let response = `<p><strong>Smart Parking Management System</strong>:</p>
      <p>An automation platform built to allocate, manage, and process parking spaces in real time. Designed using React.js for the responsive frontend dashboard and Django for the backend database and APIs.</p>`;
      if (proj && proj.link && proj.link !== '#') {
        response += `<p><a href="${proj.link}" target="_blank" style="color: var(--orange-yellow-crayola); text-decoration: underline;">View Project live</a></p>`;
      }
      return response;
    }

    // Intent 10: Food Delivery project
    if (matchKeywords(cleanQuery, ['food delivery', 'delivery system'])) {
      const proj = data.projects?.find(p => p.title.toLowerCase().includes('food') || p.title.toLowerCase().includes('delivery'));
      let response = `<p><strong>Food Delivery System</strong>:</p>
      <p>A web application that allows users to browse menus, place orders, and track deliveries. Powered by Python on the backend for clean database structures and transaction logic.</p>`;
      if (proj && proj.link && proj.link !== '#') {
        response += `<p><a href="${proj.link}" target="_blank" style="color: var(--orange-yellow-crayola); text-decoration: underline;">View Project live</a></p>`;
      }
      return response;
    }

    // Intent 11: Hostel Management project
    if (matchKeywords(cleanQuery, ['hostel management', 'hostel'])) {
      const proj = data.projects?.find(p => p.title.toLowerCase().includes('hostel'));
      let response = `<p><strong>Hostel Management System</strong>:</p>
      <p>Developed using ReactJS and Django to manage student registrations, room allocations, fee processing, and warden notifications in a single centralized panel.</p>`;
      if (proj && proj.link && proj.link !== '#') {
        response += `<p><a href="${proj.link}" target="_blank" style="color: var(--orange-yellow-crayola); text-decoration: underline;">View Project live</a></p>`;
      }
      return response;
    }

    // Intent 12: Weather Information project
    if (matchKeywords(cleanQuery, ['weather website', 'weather information', 'weather'])) {
      const proj = data.projects?.find(p => p.title.toLowerCase().includes('weather'));
      let response = `<p><strong>Weather Information Website</strong>:</p>
      <p>A frontend website displaying real-time weather analytics, temperature forecasts, and humidity indices based on geographical searches. Built with clean HTML, CSS, and Vanilla JavaScript, integrating open weather APIs.</p>`;
      if (proj && proj.link && proj.link !== '#') {
        response += `<p><a href="${proj.link}" target="_blank" style="color: var(--orange-yellow-crayola); text-decoration: underline;">View Project live</a></p>`;
      }
      return response;
    }

    // Intent 13: E-Learning project
    if (matchKeywords(cleanQuery, ['e-learning', 'elearning', 'learning website'])) {
      const proj = data.projects?.find(p => p.title.toLowerCase().includes('e-learning') || p.title.toLowerCase().includes('elearning'));
      let response = `<p><strong>E-Learning Website</strong>:</p>
      <p>A responsive online course portal with video lectures, lesson navigation, and course curriculum displays. Designed using modern frontend methodologies (HTML, CSS, and JS).</p>`;
      if (proj && proj.link && proj.link !== '#') {
        response += `<p><a href="${proj.link}" target="_blank" style="color: var(--orange-yellow-crayola); text-decoration: underline;">View Project live</a></p>`;
      }
      return response;
    }

    // Intent 14: Connect 4 project
    if (matchKeywords(cleanQuery, ['connect 4', 'connect4', 'dot game'])) {
      const proj = data.projects?.find(p => p.title.toLowerCase().includes('connect'));
      let response = `<p><strong>Connect 4-Dot Game</strong>:</p>
      <p>An interactive browser-based board game for two players. Built entirely on the frontend using HTML, CSS, and Vanilla JS, implementing game state logic, score counters, and win-condition algorithms.</p>`;
      if (proj && proj.link && proj.link !== '#') {
        response += `<p><a href="${proj.link}" target="_blank" style="color: var(--orange-yellow-crayola); text-decoration: underline;">Play Game Live</a></p>`;
      }
      return response;
    }

    // Intent 15: LJ Institute of Engineering (Education)
    if (matchKeywords(cleanQuery, ['lj', 'college', 'university', 'bachelor', 'b.e', 'degree', 'graduation', 'graduate'])) {
      const edu = data.resume?.education?.find(e => e.school.toLowerCase().includes('lj'));
      if (edu) {
        return `<p><strong>${edu.school}</strong> (${edu.dates}):</p>
        <p>${edu.desc}</p>`;
      }
      return `<p>Dakshit is pursuing a **Bachelor of Engineering in Computer Science & Technology** (2022 — 2026) at **LJ Institute of Engineering & Technology, Ahmedabad**, holding a CGPA of 7.95.</p>`;
    }

    // Intent 16: Gurukul Taravada (Education)
    if (matchKeywords(cleanQuery, ['gurukul', 'taravada', 'school', '10th', '12th', 'hsc', 'ssc'])) {
      const schools = data.resume?.education?.filter(e => e.school.toLowerCase().includes('gurukul') || e.school.toLowerCase().includes('taravada'));
      if (schools && schools.length > 0) {
        let schoolHtml = `<p><strong>Shree Swaminarayan Gurukul-Taravada</strong>:</p><ul>`;
        schools.forEach(s => {
          schoolHtml += `<li><strong>${s.school.split('—')[0]}</strong> (${s.dates})<br>${s.desc}</li>`;
        });
        schoolHtml += `</ul>`;
        return schoolHtml;
      }
      return `<p>Dakshit completed both SSC (10th) and HSC (12th Science Stream) at <strong>Shree Swaminarayan Gurukul-Taravada</strong> (GSEB board).</p>`;
    }

    // Intent 17: Backend stack specific
    if (matchKeywords(cleanQuery, ['backend', 'python', 'django', 'frappe', 'erpnext', 'api', 'databases', 'mysql', 'sql'])) {
      return `<p>Dakshit's **Backend Tech Stack** specialization is very strong:</p>
      <ul>
        <li>🐍 <strong>Python:</strong> Primary language for scripting and logic.</li>
        <li>⚡ <strong>Frappe & ERPNext:</strong> High-level framework customization, DocTypes, custom scripts, and background hooks.</li>
        <li>🌐 <strong>Django:</strong> Model-View-Template architectures and secure REST API design.</li>
        <li>💾 <strong>Databases:</strong> Writing optimized query syntax in SQL and MySQL.</li>
      </ul>`;
    }

    // Intent 18: Frontend stack specific
    if (matchKeywords(cleanQuery, ['frontend', 'javascript', 'js', 'react', 'html', 'css', 'bootstrap'])) {
      return `<p>Dakshit's **Frontend Stack** features:</p>
      <ul>
        <li>✨ <strong>JavaScript (ES6+):</strong> Dynamic UI logic and API communication.</li>
        <li>⚛️ <strong>React.js:</strong> Creating modular, component-based user interfaces.</li>
        <li>🎨 <strong>HTML5 & CSS3:</strong> Creating responsive grid/flexbox layouts and custom styled pages.</li>
      </ul>`;
    }

    // Intent 19: About / Bio
    if (matchKeywords(cleanQuery, ['who are you', 'about', 'bio', 'yourself', 'profile', 'dakshit', 'background', 'summary'])) {
      const pText = data.about?.paragraphs?.map(p => `<p>${p}</p>`).join('') || 
                    `<p>Dakshit is a dedicated developer specializing in building enterprise workflows, custom integrations, and backend services.</p>`;
      return pText;
    }

    // Intent 20: Experience (General)
    if (matchKeywords(cleanQuery, ['experience', 'work', 'job', 'history', 'career', 'intern', 'roles', 'duration', 'company'])) {
      if (!data.resume?.experience || data.resume.experience.length === 0) {
        return `<p>Dakshit is currently working as a Python Developer. Let me know if you would like his contact details!</p>`;
      }
      
      let expHtml = `<p>Here is a summary of <strong>Work Experience</strong>:</p><ul>`;
      data.resume.experience.forEach(job => {
        expHtml += `<li><strong>${job.company}</strong> (${job.totalDuration})<br>`;
        if (job.roles && job.roles.length > 0) {
          job.roles.forEach(role => {
            expHtml += `• <em>${role.title}</em> (${role.dates})<br>`;
          });
        }
        expHtml += `</li>`;
      });
      expHtml += `</ul>`;
      return expHtml;
    }

    // Intent 21: Skills (General)
    if (matchKeywords(cleanQuery, ['skills', 'technologies', 'tools', 'languages', 'programming', 'stack'])) {
      if (!data.resume?.skills || data.resume.skills.length === 0) {
        return `<p>Dakshit has expertise in Python, Frappe Framework, ERPNext, Django, MySQL, and JavaScript/React.js.</p>`;
      }

      let skillsHtml = `<p>Dakshit's core **Technical Skills** include:</p><ul>`;
      data.resume.skills.forEach(skill => {
        skillsHtml += `<li><strong>${skill.name}</strong> - ${skill.level}% proficiency</li>`;
      });
      skillsHtml += `</ul>`;
      return skillsHtml;
    }

    // Intent 22: Projects (General)
    if (matchKeywords(cleanQuery, ['projects', 'portfolio', 'works', 'websites'])) {
      if (!data.projects || data.projects.length === 0) {
        return `<p>You can view all projects by clicking the **Projects** tab in the navigation bar.</p>`;
      }

      let projectsHtml = `<p>Here are some of Dakshit's **Projects**:</p><ul>`;
      data.projects.forEach(project => {
        const hasLink = project.link && project.link !== '#';
        projectsHtml += `<li><strong>${project.title}</strong> - <em>${project.category}</em>`;
        if (hasLink) {
          projectsHtml += ` (<a href="${project.link}" target="_blank" style="color: var(--orange-yellow-crayola); text-decoration: underline;">View Live</a>)`;
        }
        projectsHtml += `</li>`;
      });
      projectsHtml += `</ul>`;
      return projectsHtml;
    }

    // Intent 23: Education (General)
    if (matchKeywords(cleanQuery, ['education', 'school', 'college', 'university', 'studies', 'study', 'where did you study'])) {
      if (!data.resume?.education || data.resume.education.length === 0) {
        return `<p>Dakshit studied Computer Science & Technology at LJ Institute of Engineering & Technology.</p>`;
      }

      let eduHtml = `<p>Here is the **Educational Background**:</p><ul>`;
      data.resume.education.forEach(edu => {
        eduHtml += `<li><strong>${edu.school}</strong><br>• Duration: ${edu.dates}<br>• ${edu.desc}</li>`;
      });
      eduHtml += `</ul>`;
      return eduHtml;
    }

    // Intent 24: Certifications (General)
    if (matchKeywords(cleanQuery, ['certifications', 'certificates', 'courses', 'credentials', 'verify'])) {
      if (!data.certifications || data.certifications.length === 0) {
        return `<p>Dakshit holds multiple professional credentials in Machine Learning, Generative AI, and Java.</p>`;
      }

      let certHtml = `<p>Here are some of his **Certifications**:</p><ul>`;
      data.certifications.forEach(cert => {
        const hasLink = cert.link && cert.link !== '#';
        certHtml += `<li><strong>${cert.title}</strong>`;
        if (hasLink) {
          certHtml += ` (<a href="${cert.link}" target="_blank" style="color: var(--orange-yellow-crayola); text-decoration: underline;">Verify</a>)`;
        }
        certHtml += `</li>`;
      });
      certHtml += `</ul>`;
      return certHtml;
    }

    // Intent 25: Contact Details
    if (matchKeywords(cleanQuery, ['contact', 'email', 'phone', 'reach out', 'number', 'address', 'github', 'linkedin', 'instagram', 'socials'])) {
      const email = data.profile?.email || 'dakshit.gajipara2707@gmail.com';
      const phone = data.profile?.phone || '+91 94292 93754';
      const location = data.profile?.location || 'Gujarat, India';
      
      let contactHtml = `<p>You can get in touch with Dakshit through:</p><ul>`;
      contactHtml += `<li>📧 <strong>Email:</strong> <a href="mailto:${email}" style="color: var(--orange-yellow-crayola);">${email}</a></li>`;
      contactHtml += `<li>📞 <strong>Phone:</strong> <a href="tel:${phone.replace(/\s+/g, '')}" style="color: var(--orange-yellow-crayola);">${phone}</a></li>`;
      contactHtml += `<li>📍 <strong>Location:</strong> ${location}</li>`;
      
      if (data.profile?.socials) {
        const soc = data.profile.socials;
        contactHtml += `<li>🔗 <strong>Socials:</strong> `;
        const links = [];
        if (soc.linkedin) links.push(`<a href="${soc.linkedin}" target="_blank" style="color: var(--orange-yellow-crayola); text-decoration: underline;">LinkedIn</a>`);
        if (soc.github) links.push(`<a href="${soc.github}" target="_blank" style="color: var(--orange-yellow-crayola); text-decoration: underline;">GitHub</a>`);
        if (soc.instagram) links.push(`<a href="${soc.instagram}" target="_blank" style="color: var(--orange-yellow-crayola); text-decoration: underline;">Instagram</a>`);
        contactHtml += links.join(' | ');
        contactHtml += `</li>`;
      }
      
      contactHtml += `</ul><p>Alternatively, write a message using the **Contact** form in the navbar!</p>`;
      return contactHtml;
    }

    // Intent 26: Resume / CV
    if (matchKeywords(cleanQuery, ['resume', 'cv', 'download', 'pdf'])) {
      const link = data.resume?.downloadLink;
      if (!link) {
        return `<p>The resume download link is not configured right now, but feel free to request it by sending an email!</p>`;
      }
      return `<p>You can view and **Download Dakshit's CV/Resume** here:</p><p style="margin-top: 10px;"><a href="${link}" target="_blank" style="display: inline-block; background: var(--orange-yellow-crayola); color: var(--chatbot-user-text) !important; padding: 8px 16px; border-radius: 8px; font-weight: 500; text-align: center;">📄 View Resume (Google Drive)</a></p>`;
    }

    // Fallback response
    return `<p>I'm not sure I understand that question completely. You can ask about my **skills** (Python, React), **work experience** (Nine Formula, Sigzen), specific **projects** (Smart Parking, Hostel Management), **CGPA**, **education**, or download my **resume**.</p><p>Type "help" for a list of things you can ask, or write a message using the contact form!</p>`;
  }

  // Match list of keywords against target query string (incorporating boundary checks for short keywords)
  function matchKeywords(query, keywords) {
    return keywords.some(keyword => {
      // If keyword is short (e.g. 'yo', 'hi'), match as a whole word to prevent false positive substring matches
      if (keyword.length <= 3) {
        const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp('\\b' + escaped + '\\b', 'i');
        return regex.test(query);
      }
      return query.includes(keyword);
    });
  }
});
