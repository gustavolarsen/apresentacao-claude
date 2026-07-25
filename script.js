      (function () {
        const slides = Array.from(document.querySelectorAll(".slide"));
        const total = slides.length;
        const dotsWrap = document.getElementById("dots");
        const counter = document.getElementById("counter");
        const topProgress = document.getElementById("topProgress");
        const chromeStep = document.getElementById("chromeStep");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");
        let current = 0;

        const accentMap = {
          gold: { accent: "var(--accent)", soft: "var(--accent-soft)" },
          ok: { accent: "var(--accent-2)", soft: "var(--accent-2-soft)" },
          warn: { accent: "var(--accent-3)", soft: "var(--accent-3-soft)" },
        };

        // build dots
        slides.forEach((s, i) => {
          const b = document.createElement("button");
          b.className = "dot" + (i === 0 ? " active" : "");
          b.setAttribute("aria-label", "Ir para slide " + (i + 1));
          b.addEventListener("click", () => goTo(i));
          dotsWrap.appendChild(b);
        });
        const dotEls = Array.from(dotsWrap.children);

        // prep typed command widths (in ch units) from data-text
        slides.forEach((s) => {
          const cmd = s.querySelector(".eyebrow .cmd");
          if (cmd) {
            const text = cmd.getAttribute("data-text") || "";
            cmd.textContent = text;
            cmd.style.setProperty("--chw", text.length + "ch");
          }
          const acc = s.getAttribute("data-accent") || "gold";
          const m = accentMap[acc] || accentMap.gold;
          s.style.setProperty("--slide-accent", m.accent);
          s.style.setProperty("--slide-accent-soft", m.soft);
        });

        function render() {
          slides.forEach((s, i) => {
            if (i === current) {
              s.classList.remove("active");
              void s.offsetWidth; // force reflow to restart animations
              s.classList.add("active");
              s.scrollTop = 0;
            } else {
              s.classList.remove("active");
            }
          });
          dotEls.forEach((d, i) => d.classList.toggle("active", i === current));
          counter.textContent =
            String(current + 1).padStart(2, "0") +
            " / " +
            String(total).padStart(2, "0");
          chromeStep.innerHTML =
            "<b>" +
            String(current + 1).padStart(2, "0") +
            "</b> de " +
            String(total).padStart(2, "0");
          topProgress.style.width = ((current + 1) / total) * 100 + "%";
          prevBtn.disabled = current === 0;
          nextBtn.disabled = current === total - 1;
          const acc = slides[current].getAttribute("data-accent") || "gold";
          document.documentElement.style.setProperty(
            "--slide-accent-global",
            (accentMap[acc] || accentMap.gold).accent,
          );
        }

        function goTo(i) {
          current = Math.max(0, Math.min(total - 1, i));
          render();
        }

        prevBtn.addEventListener("click", () => goTo(current - 1));
        nextBtn.addEventListener("click", () => goTo(current + 1));

        window.addEventListener("keydown", (e) => {
          if (["ArrowRight", "PageDown", " "].includes(e.key)) {
            e.preventDefault();
            goTo(current + 1);
          } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
            e.preventDefault();
            goTo(current - 1);
          } else if (e.key === "Home") {
            goTo(0);
          } else if (e.key === "End") {
            goTo(total - 1);
          }
        });

        // basic touch swipe
        let touchX = null;
        window.addEventListener(
          "touchstart",
          (e) => {
            touchX = e.changedTouches[0].clientX;
          },
          { passive: true },
        );
        window.addEventListener(
          "touchend",
          (e) => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 50) {
              dx < 0 ? goTo(current + 1) : goTo(current - 1);
            }
            touchX = null;
          },
          { passive: true },
        );

        render();
      })();
