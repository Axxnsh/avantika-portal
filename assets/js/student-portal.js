// Avantika Portal - Student Login, Courses & Payment Flow

const COURSES_DATA = [
  {
    id: "BCA_2026",
    name: "Bachelor of Computer Applications (BCA)",
    code: "AVK-BCA-01",
    duration: "3 Years (6 Semesters)",
    mode: "Online / Distance Learning",
    fee: 2500,
    originalFee: 5000,
    badge: "Most Popular",
    description: "Comprehensive undergraduate degree in computer science, software engineering, web development, and cloud computing.",
    syllabus: [
      "Semester 1: Programming in C & Data Structures",
      "Semester 2: Object-Oriented Programming with Java",
      "Semester 3: Database Management Systems & SQL",
      "Semester 4: Full Stack Web Tech (HTML, CSS, JS, Node)",
      "Semester 5: Cloud Architecture & Python Programming",
      "Semester 6: Major Industry Capstone Project"
    ]
  },
  {
    id: "MCA_2026",
    name: "Master of Computer Applications (MCA)",
    code: "AVK-MCA-02",
    duration: "2 Years (4 Semesters)",
    mode: "Online / Hybrid",
    fee: 2000,
    originalFee: 4500,
    badge: "Trending",
    description: "Advanced post-graduate program covering enterprise software architecture, AI/ML, distributed systems, and DevOps.",
    syllabus: [
      "Advanced Data Structures & Algorithms",
      "Enterprise Application Development",
      "Artificial Intelligence & Machine Learning",
      "Cloud-Native Computing & Microservices",
      "Cybersecurity Principles & Applied Cryptography"
    ]
  },
  {
    id: "AIML_2026",
    name: "Diploma in Artificial Intelligence & Machine Learning",
    code: "AVK-AIML-03",
    duration: "1 Year (2 Semesters)",
    mode: "100% Online with Live Mentorship",
    fee: 9999,
    originalFee: 14000,
    badge: "High Demand",
    description: "Job-ready curriculum covering Python for Data Science, Deep Learning, Computer Vision, and Large Language Models.",
    syllabus: [
      "Python, NumPy, Pandas, Matplotlib",
      "Statistical Learning & Predictive Modeling",
      "Deep Learning with PyTorch & TensorFlow",
      "Generative AI & LLM Prompt Engineering",
      "Real-time AI Model Deployment via FastAPI"
    ]
  },
  {
    id: "FSWD_2026",
    name: "Full Stack Web Development Professional Certificate",
    code: "AVK-WEB-04",
    duration: "6 Months",
    mode: "Self-Paced + Weekend Live Sessions",
    fee: 6499,
    originalFee: 9999,
    badge: "Career Ready",
    description: "Master front-end, back-end, and database technologies to build scalable production web applications.",
    syllabus: [
      "HTML5, CSS3, Modern JavaScript (ES6+)",
      "React.js, Tailwind CSS & Redux Toolkit",
      "Node.js, Express.js RESTful APIs",
      "MongoDB & PostgreSQL Database Design",
      "CI/CD Pipelines, Git & AWS Cloud Deployment"
    ]
  }
];

let currentUser = null;
let selectedCourse = null;
let qrTimerInterval = null;

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  renderCourseCatalog();
  checkExistingSession();
});

function checkExistingSession() {
  const saved = localStorage.getItem("avantika_user");
  if (saved) {
    try {
      currentUser = JSON.parse(saved);
      updateUserUI();
    } catch (e) {
      localStorage.removeItem("avantika_user");
    }
  }
}

// Render Courses
function renderCourseCatalog() {
  const container = document.getElementById("portalCoursesGrid");
  if (!container) return;

  container.innerHTML = COURSES_DATA.map(c => `
    <div class="col-lg-6 col-md-6 mb-4">
      <div class="portal-course-card shadow-sm">
        <div class="portal-course-header d-flex justify-content-between align-items-center">
          <span class="badge bg-primary px-3 py-1 rounded-pill">${c.badge}</span>
          <span class="text-muted small"><i class="bi bi-clock me-1"></i>${c.duration}</span>
        </div>
        <div class="portal-course-body">
          <h5 class="fw-bold text-dark mb-1">${c.name}</h5>
          <p class="text-primary small fw-semibold mb-2">${c.code} • ${c.mode}</p>
          <p class="text-secondary small mb-3">${c.description}</p>
          
          <div class="d-flex align-items-baseline gap-2 mb-2">
            <span class="fs-4 fw-bold text-dark">₹${c.fee.toLocaleString("en-IN")}</span>
            <span class="text-decoration-line-through text-muted small">₹${c.originalFee.toLocaleString("en-IN")}</span>
            <span class="badge bg-success-subtle text-success small">Save ₹${(c.originalFee - c.fee).toLocaleString("en-IN")}</span>
          </div>
        </div>
        <div class="portal-course-footer">
          <span class="text-success small fw-semibold"><i class="bi bi-patch-check-fill me-1"></i>Certificate Included</span>
          <button class="btn btn-sm btn-primary px-3 py-2 rounded-pill fw-bold" onclick="openCourseDetailsModal('${c.id}')">
            <i class="bi bi-bag-check me-1"></i> View Details & Buy
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// Student Login Modal
function openStudentLoginModal() {
  const modalEl = document.getElementById("studentLoginModal");
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

function handleStudentLogin(e) {
  if (e) e.preventDefault();
  const emailInput = document.getElementById("studentLoginEmail").value.trim();
  const password = document.getElementById("studentLoginPass").value.trim();

  if (!emailInput) {
    alert("Kripya apna Student ID ya Email darj karein!");
    return;
  }

  const namePart = emailInput.includes("@") ? emailInput.split("@")[0] : emailInput;
  const capitalizedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

  currentUser = {
    name: capitalizedName || "Aman Verma",
    email: emailInput,
    enrollmentId: "AVK-2026-" + Math.floor(1000 + Math.random() * 9000),
    enrolledAt: new Date().toLocaleDateString("en-IN")
  };

  localStorage.setItem("avantika_user", JSON.stringify(currentUser));
  updateUserUI();

  // Close Login Modal
  const modalEl = document.getElementById("studentLoginModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();

  // Smooth scroll to Course section
  const section = document.getElementById("studentCoursesSection");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

function quickDemoLogin() {
  document.getElementById("studentLoginEmail").value = "rahul.sharma@avantika.edu";
  document.getElementById("studentLoginPass").value = "avantika@123";
  handleStudentLogin();
}

function handleStudentLogout() {
  currentUser = null;
  localStorage.removeItem("avantika_user");
  updateUserUI();
  alert("Aap successfully logout ho chuke hain!");
}

function updateUserUI() {
  const loginBtnSlot = document.getElementById("studentLoginBtnSlot");
  const topbarSlot = document.getElementById("topbarLoginSlot");
  const loggedInNotice = document.getElementById("loggedInUserNotice");
  const userNameText = document.getElementById("dashboardUserName");
  const userEnrollText = document.getElementById("dashboardUserEnroll");

  if (currentUser) {
    const badgeHtml = `
      <div class="dropdown d-inline-block">
        <button class="btn btn-sm btn-outline-light dropdown-toggle rounded-pill px-3 py-1 text-dark fw-bold bg-white" data-bs-toggle="dropdown">
          <i class="bi bi-person-check-fill text-success me-1"></i> ${currentUser.name}
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow">
          <li class="px-3 py-1 small text-muted">ID: <strong>${currentUser.enrollmentId}</strong></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#studentCoursesSection"><i class="bi bi-grid-fill me-2"></i>My Courses</a></li>
          <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="handleStudentLogout()"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
        </ul>
      </div>
    `;

    if (loginBtnSlot) loginBtnSlot.innerHTML = badgeHtml;
    if (topbarSlot) topbarSlot.innerHTML = badgeHtml;

    if (loggedInNotice) loggedInNotice.classList.remove("d-none");
    if (userNameText) userNameText.textContent = currentUser.name;
    if (userEnrollText) userEnrollText.textContent = currentUser.enrollmentId;
  } else {
    const btnHtml = `
      <a href="javascript:void(0)" class="student-login-btn" onclick="openStudentLoginModal()">
        <i class="bi bi-person-circle"></i> Student Login
      </a>
    `;

    if (loginBtnSlot) loginBtnSlot.innerHTML = btnHtml;
    if (topbarSlot) topbarSlot.innerHTML = btnHtml;
    if (loggedInNotice) loggedInNotice.classList.add("d-none");
  }
}

// Course Details Modal
function openCourseDetailsModal(courseId) {
  selectedCourse = COURSES_DATA.find(c => c.id === courseId);
  if (!selectedCourse) return;

  document.getElementById("modalCourseTitle").textContent = selectedCourse.name;
  document.getElementById("modalCourseCode").textContent = selectedCourse.code;
  document.getElementById("modalCourseDuration").textContent = selectedCourse.duration;
  document.getElementById("modalCourseMode").textContent = selectedCourse.mode;
  document.getElementById("modalCourseDesc").textContent = selectedCourse.description;
  document.getElementById("modalCourseFee").textContent = "₹" + selectedCourse.fee.toLocaleString("en-IN");
  document.getElementById("modalCourseOrigFee").textContent = "₹" + selectedCourse.originalFee.toLocaleString("en-IN");

  const syllabusList = document.getElementById("modalCourseSyllabus");
  if (syllabusList) {
    syllabusList.innerHTML = selectedCourse.syllabus.map(s => `<li class="mb-1"><i class="bi bi-check-circle-fill text-success me-2"></i>${s}</li>`).join("");
  }

  const modalEl = document.getElementById("courseDetailsModal");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

// Open Payment Gateway Modal
function proceedToPaymentGateway() {
  if (!selectedCourse) return;

  // Check login first
  if (!currentUser) {
    const detailModal = bootstrap.Modal.getInstance(document.getElementById("courseDetailsModal"));
    if (detailModal) detailModal.hide();

    setTimeout(() => {
      openStudentLoginModal();
    }, 400);
    return;
  }

  // Populate checkout modal
  document.getElementById("payItemName").textContent = selectedCourse.name;
  document.getElementById("payItemCode").textContent = selectedCourse.code;
  document.getElementById("payItemFee").textContent = "₹" + selectedCourse.fee.toLocaleString("en-IN");
  document.getElementById("payGrandTotal").textContent = "₹" + selectedCourse.fee.toLocaleString("en-IN");
  document.getElementById("payBtnAmount").textContent = "₹" + selectedCourse.fee.toLocaleString("en-IN");

  // Reset payment states
  document.getElementById("paymentViewSection").classList.remove("d-none");
  document.getElementById("paymentSuccessSection").classList.add("d-none");
  document.getElementById("paymentProcessingSection").classList.add("d-none");

  startQrTimer();

  // Close details modal and open payment modal
  const detailModal = bootstrap.Modal.getInstance(document.getElementById("courseDetailsModal"));
  if (detailModal) detailModal.hide();

  const payModal = new bootstrap.Modal(document.getElementById("paymentGatewayModal"));
  payModal.show();
}

function startQrTimer() {
  clearInterval(qrTimerInterval);
  let timeLeft = 300; // 5 minutes
  const timerEl = document.getElementById("qrTimer");

  qrTimerInterval = setInterval(() => {
    timeLeft--;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    if (timerEl) {
      timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    if (timeLeft <= 0) {
      clearInterval(qrTimerInterval);
    }
  }, 1000);
}

// Simulate Payment Process
function executePayment() {
  document.getElementById("paymentViewSection").classList.add("d-none");
  document.getElementById("paymentProcessingSection").classList.remove("d-none");

  setTimeout(() => {
    document.getElementById("paymentProcessingSection").classList.add("d-none");
    document.getElementById("paymentSuccessSection").classList.remove("d-none");

    const txnId = "TXN_AVK_" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const orderId = "ORD_2026_" + Math.floor(10000 + Math.random() * 90000);
    const dateStr = new Date().toLocaleString("en-IN");

    document.getElementById("receiptTxnId").textContent = txnId;
    document.getElementById("receiptOrderId").textContent = orderId;
    document.getElementById("receiptDate").textContent = dateStr;
    document.getElementById("receiptStudentName").textContent = currentUser.name;
    document.getElementById("receiptCourse").textContent = selectedCourse.name;
    document.getElementById("receiptAmount").textContent = "₹" + selectedCourse.fee.toLocaleString("en-IN");

    clearInterval(qrTimerInterval);
  }, 2000);
}

function printReceipt() {
  window.print();
}
