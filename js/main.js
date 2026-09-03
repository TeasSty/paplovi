(() => {
  const phoneDisplay = "+7 (922) 026-52-94";
  const phoneTel = "+79220265294";
  const telegramUrl = "https://t.me/Paplovi";
  const telegramBook = "https://t.me/+79018514374";
  const maxUrl =
    "https://max.ru/join/zcNvWQO2HTNe2JAvKNAO51nNtX3Y7V4heu3BujitQww";
  const vkUrl = "https://vk.ru/papinbass";

  const formats = {
    infant: {
      title: "Грудничковое плавание",
      text: "Мягкое знакомство с водой вместе с тренером. Темп подстраиваем под малыша — без давления и слёз.",
    },
    "mom-baby": {
      title: "Мама + малыш",
      text: "Индивидуальная пара с тренером: близость, доверие и первые навыки в воде рядом с мамой.",
    },
    personal: {
      title: "Персональная тренировка",
      text: "Один ребёнок — один тренер. Подходит, если нужен спокойный вход в воду или быстрый прогресс.",
    },
    split: {
      title: "Сплит на двоих",
      text: "Двое малышей с одним тренером — удобно для братьев/сестёр или друзей одного возраста.",
    },
    group: {
      title: "Группа 3–5 человек",
      text: "Живая групповая динамика и игровые задания — когда ребёнок уже увереннее в воде.",
    },
    rehab: {
      title: "Гидрореабилитация / «Здоровая спина»",
      text: "Бережная работа в воде по задачам здоровья. Детали и подходящий формат уточним при записи.",
    },
  };

  const ageCopy = {
    "0-1": {
      title: "1–12 месяцев",
      text: "Грудничковое плавание и формат «мама + малыш»: привыкание к воде, контакт и спокойствие.",
      suggest: "infant",
    },
    "1-3": {
      title: "1–3 года",
      text: "Игровое освоение воды. Часто выбирают персональные занятия или сплит на двоих.",
      suggest: "personal",
    },
    "3-7": {
      title: "3–7 лет",
      text: "Навыки, ныряние, уверенность. Персонально или в небольшой группе — под характер ребёнка.",
      suggest: "group",
    },
    "7-12": {
      title: "7–12 лет",
      text: "Техника и развитие. Персональные тренировки или группа — когда уже есть интерес к воде.",
      suggest: "personal",
    },
  };

  const goalMap = {
    habit: "infant",
    skill: "personal",
    bond: "mom-baby",
    twins: "split",
    health: "rehab",
  };

  const header = document.querySelector(".site-header");
  const ageButtons = document.querySelectorAll("[data-age]");
  const agePanel = document.getElementById("age-panel");
  const matcherAge = document.getElementById("matcher-age");
  const matcherGoal = document.getElementById("matcher-goal");
  const matcherOut = document.getElementById("matcher-out");
  const matcherCta = document.getElementById("matcher-cta");
  const leadForm = document.getElementById("lead-form");
  const formStatus = document.getElementById("form-status");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setAge = (key) => {
    const data = ageCopy[key];
    if (!data || !agePanel) return;
    ageButtons.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.age === key));
    });
    agePanel.hidden = false;
    agePanel.innerHTML = `<p><strong>${data.title}.</strong> ${data.text}</p>`;
    if (matcherAge) {
      matcherAge.value = key;
      updateMatcher();
    }
  };

  ageButtons.forEach((btn) => {
    btn.addEventListener("click", () => setAge(btn.dataset.age));
  });

  function updateMatcher() {
    if (!matcherAge || !matcherGoal || !matcherOut) return;
    const age = matcherAge.value;
    const goal = matcherGoal.value;
    const key = goalMap[goal] || ageCopy[age]?.suggest || "personal";
    const format = formats[key];
    matcherOut.innerHTML = `
      <div>
        <div class="label">Рекомендуем</div>
        <h3>${format.title}</h3>
        <p>${format.text}</p>
        <p style="margin-top:0.75rem">Стоимость уточним при записи — без навязанных обещаний «поплывёт за N занятий».</p>
      </div>
    `;
    if (matcherCta) {
      const msg = encodeURIComponent(
        `Здравствуйте! Хочу записаться в ПапЛови.\nВозраст: ${ageCopy[age]?.title || age}\nЦель: ${matcherGoal.options[matcherGoal.selectedIndex].text}\nИнтересует формат: ${format.title}`
      );
      matcherCta.href = `https://t.me/Paplovi?text=${msg}`;
    }
  }

  matcherAge?.addEventListener("change", updateMatcher);
  matcherGoal?.addEventListener("change", updateMatcher);
  updateMatcher();

  function openPrefillMessage({ name, childAge, phone, note }) {
    const lines = [
      "Здравствуйте! Заявка с сайта ПапЛови.",
      name ? `Имя: ${name}` : null,
      childAge ? `Возраст ребёнка: ${childAge}` : null,
      phone ? `Телефон: ${phone}` : null,
      note ? `Комментарий: ${note}` : null,
    ].filter(Boolean);
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://t.me/Paplovi?text=${text}`, "_blank", "noopener");
  }

  leadForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(leadForm);
    if (fd.get("company")) {
      return;
    }
    const name = String(fd.get("name") || "").trim();
    const childAge = String(fd.get("childAge") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const note = String(fd.get("note") || "").trim();
    const channel = String(fd.get("channel") || "telegram");

    if (!name || !phone) {
      if (formStatus) {
        formStatus.dataset.state = "err";
        formStatus.textContent = "Укажите имя и телефон — так мы сможем связаться.";
      }
      return;
    }

    const phoneOk = /[\d+]{10,}/.test(phone.replace(/\s/g, ""));
    if (!phoneOk) {
      if (formStatus) {
        formStatus.dataset.state = "err";
        formStatus.textContent = "Проверьте номер телефона.";
      }
      return;
    }

    const lines = [
      "Здравствуйте! Заявка с сайта ПапЛови.",
      `Имя: ${name}`,
      childAge ? `Возраст ребёнка: ${childAge}` : null,
      `Телефон: ${phone}`,
      note ? `Комментарий: ${note}` : null,
    ].filter(Boolean);
    const text = encodeURIComponent(lines.join("\n"));

    if (channel === "whatsapp") {
      window.open(`https://wa.me/79220265294?text=${text}`, "_blank", "noopener");
    } else if (channel === "phone") {
      window.location.href = `tel:${phoneTel}`;
    } else {
      window.open(`https://t.me/Paplovi?text=${text}`, "_blank", "noopener");
    }

    if (formStatus) {
      formStatus.dataset.state = "ok";
      formStatus.textContent =
        "Открыли мессенджер с готовым текстом. Если окно не появилось — напишите в Telegram @Paplovi.";
    }
    leadForm.reset();
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // Expose for debugging / future config
  window.PAPLOVI = {
    phoneDisplay,
    phoneTel,
    telegramUrl,
    telegramBook,
    maxUrl,
    vkUrl,
    openPrefillMessage,
  };
})();
