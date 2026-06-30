(() => {
  const form = document.getElementById('multiStepForm');
  const steps = Array.from(document.querySelectorAll('.step[data-step]'));
  const sidebarItems = Array.from(document.querySelectorAll('.sidebar__item'));
  const stepNav = document.getElementById('stepNav');
  const goBackBtn = document.getElementById('goBackBtn');
  const nextBtn = document.getElementById('nextBtn');
  const confirmBtn = document.getElementById('confirmBtn');
  const step5 = document.getElementById('step-5');
  const card = document.querySelector('.card');

  const billingToggle = document.getElementById('billingToggle');

  const PLAN_PRICES = {
    arcade:   { monthly: 9,  yearly: 90 },
    advanced: { monthly: 12, yearly: 120 },
    pro:      { monthly: 15, yearly: 150 },
  };

  const ADDON_INFO = {
    online:  { name: 'Online service',       monthly: 1, yearly: 10 },
    storage: { name: 'Larger storage',        monthly: 2, yearly: 20 },
    profile: { name: 'Customizable profile',  monthly: 2, yearly: 20 },
  };

  const PLAN_LABELS = { arcade: 'Arcade', advanced: 'Advanced', pro: 'Pro' };

  let currentStep = 1;
  let isYearly = false;

  // ---------- Step navigation ----------
  function showStep(stepNum) {
    steps.forEach(s => {
      const n = Number(s.dataset.step);
      s.hidden = n !== stepNum;
    });
    step5.hidden = true;
    form.hidden = false;

    sidebarItems.forEach(item => {
      const n = Number(item.dataset.step);
      item.classList.toggle('is-active', n === stepNum);
      if (n === stepNum) {
        item.setAttribute('aria-current', 'step');
      } else {
        item.removeAttribute('aria-current');
      }
    });

    stepNav.classList.toggle('show-back', stepNum > 1);
    nextBtn.hidden = stepNum === 4;
    confirmBtn.hidden = stepNum !== 4;

    if (stepNum === 4) {
      renderSummary();
    }

    currentStep = stepNum;

    const firstField = steps.find(s => Number(s.dataset.step) === stepNum)?.querySelector('input');
    if (firstField && stepNum === 1) {
      firstField.focus({ preventScroll: true });
    }
  }

  function showThankYou() {
    form.hidden = true;
    step5.hidden = false;
    sidebarItems.forEach(item => {
      const n = Number(item.dataset.step);
      item.classList.toggle('is-active', n === 4);
      if (n === 4) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
  }

  // ---------- Validation ----------
  function showFieldError(input, message) {
    const field = input.closest('.field');
    const errorEl = document.getElementById(`${input.id}-error`);
    field.classList.add('has-error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearFieldError(input) {
    const field = input.closest('.field');
    const errorEl = document.getElementById(`${input.id}-error`);
    field.classList.remove('has-error');
    if (errorEl) errorEl.textContent = '';
  }

  function validateStep1() {
    let valid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');

    if (!name.value.trim()) {
      showFieldError(name, 'This field is required');
      valid = false;
    } else {
      clearFieldError(name);
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      showFieldError(email, 'This field is required');
      valid = false;
    } else if (!emailPattern.test(email.value.trim())) {
      showFieldError(email, 'Please enter a valid email');
      valid = false;
    } else {
      clearFieldError(email);
    }

    if (!phone.value.trim()) {
      showFieldError(phone, 'This field is required');
      valid = false;
    } else {
      clearFieldError(phone);
    }

    return valid;
  }

  function validateStep2() {
    const selected = form.querySelector('input[name="plan"]:checked');
    const plansEl = document.querySelector('.plans');
    const errorEl = document.getElementById('plan-error');
    if (!selected) {
      plansEl.classList.add('has-error');
      errorEl.textContent = 'Please select a plan';
      errorEl.classList.add('is-visible');
      return false;
    }
    plansEl.classList.remove('has-error');
    errorEl.classList.remove('is-visible');
    errorEl.textContent = '';
    return true;
  }

  function validateCurrentStep() {
    if (currentStep === 1) return validateStep1();
    if (currentStep === 2) return validateStep2();
    return true;
  }

  // Clear errors as the user fixes them
  ['name', 'email', 'phone'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => {
      if (!input.closest('.field').classList.contains('has-error')) return;
      if (id === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (input.value.trim() && emailPattern.test(input.value.trim())) clearFieldError(input);
      } else if (input.value.trim()) {
        clearFieldError(input);
      }
    });
  });

  form.querySelectorAll('input[name="plan"]').forEach(input => {
    input.addEventListener('change', () => {
      document.querySelector('.plans').classList.remove('has-error');
      const errorEl = document.getElementById('plan-error');
      errorEl.classList.remove('is-visible');
      errorEl.textContent = '';
    });
  });

  // ---------- Billing toggle ----------
  function setYearly(yearly) {
    isYearly = yearly;
    billingToggle.setAttribute('aria-checked', String(yearly));
    document.body.classList.toggle('is-yearly', yearly);
    document.querySelector('.toggle').classList.toggle('is-yearly', yearly);

    document.querySelectorAll('.plan__price').forEach(el => {
      el.textContent = yearly ? el.dataset.yearly : el.dataset.monthly;
    });
    document.querySelectorAll('.addon__price').forEach(el => {
      el.textContent = yearly ? el.dataset.yearly : el.dataset.monthly;
    });
  }

  billingToggle.addEventListener('click', () => setYearly(!isYearly));

  // ---------- Summary (step 4) ----------
  function renderSummary() {
    const planInput = form.querySelector('input[name="plan"]:checked');
    const planKey = planInput ? planInput.value : 'arcade';
    const prices = PLAN_PRICES[planKey];
    const period = isYearly ? 'yearly' : 'monthly';
    const periodLabel = isYearly ? 'Yearly' : 'Monthly';

    document.getElementById('summaryPlanName').textContent = `${PLAN_LABELS[planKey]} (${periodLabel})`;
    document.getElementById('summaryPlanPrice').textContent = `$${prices[period]}/${isYearly ? 'yr' : 'mo'}`;

    let total = prices[period];

    const addonsContainer = document.getElementById('summaryAddons');
    addonsContainer.innerHTML = '';

    Object.entries(ADDON_INFO).forEach(([key, info]) => {
      const checkbox = form.querySelector(`input[name="addon-${key}"]`);
      if (checkbox && checkbox.checked) {
        const price = info[period];
        total += price;
        const row = document.createElement('div');
        row.className = 'summary__addon-row';
        row.innerHTML = `<span>${info.name}</span><span>+$${price}/${isYearly ? 'yr' : 'mo'}</span>`;
        addonsContainer.appendChild(row);
      }
    });

    document.getElementById('summaryTotalLabel').textContent = `Total (per ${isYearly ? 'year' : 'month'})`;
    document.getElementById('summaryTotalPrice').textContent = `+$${total}/${isYearly ? 'yr' : 'mo'}`;
  }

  document.getElementById('summaryChange').addEventListener('click', () => {
    showStep(2);
  });

  // ---------- Button handlers ----------
  nextBtn.addEventListener('click', () => {
    if (!validateCurrentStep()) return;
    showStep(Math.min(currentStep + 1, 4));
  });

  goBackBtn.addEventListener('click', () => {
    showStep(Math.max(currentStep - 1, 1));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showThankYou();
  });

  // Allow Enter key to behave like clicking Next on step 1
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && currentStep < 4) {
      e.preventDefault();
      nextBtn.click();
    }
  });

  // ---------- Init ----------
  showStep(1);
  setYearly(false);
})();