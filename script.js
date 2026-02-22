// ==========================================
// 1. Mobile Menu Toggle
// ==========================================
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// ==========================================
// 2. Tab Functionality for Programs
// ==========================================
const tabBtns = document.querySelectorAll(".tab-btn");
const programCards = document.querySelectorAll(".program-card");

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    tabBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.getAttribute("data-target");

    programCards.forEach(card => {
      if (card.classList.contains(target)) {
        card.classList.add('show');
        card.style.display = 'block';
      } else {
        card.classList.remove('show');
        card.style.display = 'none';
      }
    });
  });
});

// ==========================================
// 3. Counter Animation (Triggers on scroll)
// ==========================================
const counters = document.querySelectorAll('.counter');
let hasAnimated = false;

const animateCounters = () => {
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const updateCount = () => {
      const count = +counter.innerText;
      const increment = target / 100;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 20);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
};

const sectionObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !hasAnimated) {
    animateCounters();
    hasAnimated = true;
  }
});

const statsSection = document.querySelector('.stats-container');
if (statsSection) {
  sectionObserver.observe(statsSection);
}

// ==========================================
// 4. Contact Form Validation & Email Sending
// ==========================================
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name === "" || email === "" || message === "") {
      showStatus("Please fill in all fields.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus("Please enter a valid email address.", "error");
      return;
    }

    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    // Web3Forms API Integration with your specific Access Key
    const formData = {
      access_key: "ca7d41f3-4834-407c-9f5d-fedc03dbec22",
      subject: "New Contact Form Submission - PAF-IAST Website",
      name: name,
      email: email,
      message: message
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.status === 200) {
        showStatus("Message sent successfully! We will contact you soon.", "success");
        contactForm.reset();
      } else {
        showStatus("Something went wrong. Please try again later.", "error");
      }
    } catch (error) {
      showStatus("Network error. Please check your internet connection.", "error");
    } finally {
      submitBtn.innerText = "Send Message";
      submitBtn.disabled = false;
    }
  });
}

function showStatus(msg, type) {
  if (formStatus) {
    formStatus.innerText = msg;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = "block";

    setTimeout(() => {
      formStatus.style.display = "none";
    }, 5000);
  }
}