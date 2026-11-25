/* =========================================================
   portfolio2.js — ringan, tanpa library.
   Fitur: smooth scroll, menu HP, menu aktif saat scroll,
   filter portfolio, lightbox, form via email.
   ========================================================= */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sidebar = document.getElementById("sidebar");
  const burger = document.getElementById("burger");

  /* ---------- 1. Smooth scroll ---------- */
  document.querySelectorAll("[data-scroll]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      closeMenu();
    });
  });

  /* ---------- 2. Menu HP ---------- */
  function closeMenu() {
    sidebar.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }
  burger.addEventListener("click", () => {
    const open = sidebar.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });

  /* ---------- 3. Tandai menu aktif sesuai bagian yang terlihat ---------- */
  const menuLinks = document.querySelectorAll(".menu a");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        menuLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));
  }

  /* ---------- 4. Filter portfolio ---------- */
  const filters = document.querySelectorAll("#filters button");
  const works = document.querySelectorAll(".work");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.toggle("on", b === btn));
      const f = btn.dataset.filter;
      works.forEach((w) => { w.hidden = !(f === "all" || w.dataset.category === f); });
    });
  });

  /* ---------- 5. Lightbox ---------- */
  const box = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");

  function openLightbox(work) {
    const img = work.querySelector("img");
    const visible = img && img.style.display !== "none";
    lbImg.src = visible ? img.src : "";
    lbImg.alt = img ? img.alt : "";
    lbImg.style.display = visible ? "block" : "none";
    document.getElementById("lbTitle").textContent = work.querySelector("figcaption b").textContent;
    document.getElementById("lbMeta").textContent = work.querySelector("figcaption span").textContent;
    document.getElementById("lbDetail").textContent = work.querySelector(".work__detail")?.textContent.trim() || "";
    box.showModal();
  }
  works.forEach((w) => {
    w.addEventListener("click", () => openLightbox(w));
    w.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(w); }
    });
  });
  document.getElementById("lbClose").addEventListener("click", () => box.close());
  box.addEventListener("click", (e) => { if (e.target === box) box.close(); });

  /* ---------- 6. Form kontak: buka aplikasi email ----------
     [GANTI] Alamat email tujuan */
  const EMAIL_TUJUAN = "emailanda@gmail.com";
  document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    const subject = encodeURIComponent("Pesan dari " + d.get("nama"));
    const body = encodeURIComponent(d.get("pesan") + "\n\n— " + d.get("nama") + " (" + d.get("email") + ")");
    window.location.href = `mailto:${EMAIL_TUJUAN}?subject=${subject}&body=${body}`;
  });
})();
