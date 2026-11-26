document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header");
    const scrollProgress = document.getElementById("scroll-progress");
    const menuBtn = document.getElementById("menu-toggle-btn");
    const nav = document.getElementById("main-nav");
    const navLinks = document.querySelectorAll(".nav-link");
    const backToTopBtn = document.getElementById("back-to-top");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ======================================================================
       1. Toast Global
       ====================================================================== */
    const toast = document.getElementById("toast");
    let toastTimer;

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
    }

    /* ======================================================================
       2. Menu Mobile
       ====================================================================== */
    function setMenuOpen(isOpen) {
        nav.classList.toggle("open", isOpen);
        menuBtn.setAttribute("aria-expanded", String(isOpen));
        const icon = menuBtn.querySelector("i");
        if (icon) icon.className = isOpen ? "fas fa-times" : "fas fa-bars";
    }

    menuBtn.addEventListener("click", () => setMenuOpen(!nav.classList.contains("open")));
    navLinks.forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
    document.addEventListener("click", (e) => {
        if (nav.classList.contains("open") && !header.contains(e.target)) {
            setMenuOpen(false);
        }
    });

    /* ======================================================================
       3. Scroll: Barra de Progresso, Header & Paralaxe Suave
       ====================================================================== */
    const parallaxSections = Array.from(document.querySelectorAll(".parallax-section"));
    let ticking = false;

    function updateParallax() {
        const vh = window.innerHeight;
        parallaxSections.forEach((section) => {
            const bg = section.querySelector(".parallax-bg");
            if (!bg) return;
            const rect = section.getBoundingClientRect();
            if (rect.bottom < -120 || rect.top > vh + 120) return;

            const progress = (rect.top + rect.height * 0.5 - vh * 0.5) / vh;
            const offset = progress * -75;
            bg.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
        });
    }

    function handleScroll() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const pct = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;

        scrollProgress.style.width = `${pct.toFixed(1)}%`;
        header.classList.toggle("scrolled", scrollY > 40);
        backToTopBtn.classList.toggle("visible", scrollY > 500);

        if (!prefersReducedMotion && !ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });

    /* ======================================================================
       4. Partículas Douradas Sutis no Hero (Canvas)
       ====================================================================== */
    const canvas = document.getElementById("gold-particles");
    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext("2d");
        let particles = [];

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        function createParticles() {
            const count = Math.min(36, Math.floor(canvas.width / 35));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2 + 0.6,
                vx: (Math.random() - 0.5) * 0.25,
                vy: -Math.random() * 0.35 - 0.1,
                alpha: Math.random() * 0.55 + 0.2
            }));
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.y < -10) {
                    p.y = canvas.height + 10;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(245, 223, 150, ${p.alpha})`;
                ctx.fill();
            });
            window.requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        createParticles();
        animateParticles();
        window.addEventListener("resize", () => {
            resizeCanvas();
            createParticles();
        });
    }

    /* ======================================================================
       5. Reveal ao Rolar & Link Ativo na Navegação
       ====================================================================== */
    const revealObs = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.14 }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

    const navObs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
                }
            });
        },
        { rootMargin: "-40% 0px -45% 0px" }
    );
    document.querySelectorAll("section[id]").forEach((sec) => navObs.observe(sec));

    /* ======================================================================
       6. Etapas Interativas ("A Experiência")
       ====================================================================== */
    const processSteps = [
        {
            icon: "fas fa-comments",
            badge: "Etapa 01 de 04",
            title: "Projetando o seu sonho desde o início",
            text: "Tudo começa com nossa primeira reunião: vocês nos contam seus desejos, referências e expectativas, e nós desenhamos um plano personalizado do zero — definindo cronograma, orçamento estratégico e os primeiros passos.",
            items: [
                "Reuniões presenciais ou por videoconferência",
                "Curadoria de locais no Brasil e no exterior",
                "Cronograma inteligente e transparente"
            ]
        },
        {
            icon: "fas fa-palette",
            badge: "Etapa 02 de 04",
            title: "Identidade visual e curadoria de fornecedores",
            text: "Harmonizamos paleta de cores, iluminação, mobiliário e florais para refletir a personalidade do casal, coordenando fornecedores de prestígio com negociação e acompanhamento técnico.",
            items: [
                "Harmonização de cores, texturas e cenário",
                "Seleção e gestão completa de fornecedores",
                "Visitas técnicas ao local da celebração"
            ]
        },
        {
            icon: "fas fa-ring",
            badge: "Etapa 03 de 04",
            title: "Regência minuciosa até o emocionante 'SIM'",
            text: "Durante a cerimônia, estamos ao seu lado em cada segundo para que cada olhar, música, cortejo e lágrima aconteçam com fluidez absoluta e sem preocupações.",
            items: [
                "Ensaio e alinhamento completo do cortejo",
                "Sincronia entre música, celebrante e foto/vídeo",
                "Assistência dedicada aos noivos e padrinhos"
            ]
        },
        {
            icon: "fas fa-champagne-glasses",
            badge: "Etapa 04 de 04",
            title: "Recepção vibrante até o último brinde",
            text: "Na festa, orquestramos a entrada dos noivos, gastronomia, corte do bolo e pista de dança — garantindo que vocês apenas relaxem e celebrem com quem amam.",
            items: [
                "Protocolo elegante de recepção e brindes",
                "Gestão de timing de jantar, música e atrações",
                "Encerramento seguro e conferência final"
            ]
        }
    ];

    const processTabs = document.querySelectorAll(".process-tab");
    const processModal = document.getElementById("process-modal");
    const processModalBody = document.getElementById("process-modal-body");
    const processModalX = document.getElementById("process-modal-x");
    const processModalCloseBtn = document.getElementById("process-modal-close-btn");

    function openProcessModal(idx) {
        const data = processSteps[idx];
        if (!data) return;

        processModalBody.innerHTML = `
            <div class="process-badge"><i class="${data.icon}" aria-hidden="true"></i> ${data.badge}</div>
            <h3 id="process-modal-title">${data.title}</h3>
            <p>${data.text}</p>
            <ul class="process-highlights">
                ${data.items.map((item) => `<li><i class="fas fa-check" aria-hidden="true"></i> ${item}</li>`).join("")}
            </ul>
        `;
        processModal.hidden = false;
        document.body.style.overflow = "hidden";
    }

    function closeProcessModal() {
        processModal.hidden = true;
        document.body.style.overflow = "";
    }

    processTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            openProcessModal(Number(tab.dataset.step));
        });
    });

    processModalX.addEventListener("click", closeProcessModal);
    processModalCloseBtn.addEventListener("click", closeProcessModal);
    processModal.addEventListener("click", (e) => {
        if (e.target === processModal) closeProcessModal();
    });

    /* ======================================================================
       7. Filtro do Portfólio & Lightbox
       ====================================================================== */
    const filterBtns = document.querySelectorAll(".filter-btn");
    const galleryCards = Array.from(document.querySelectorAll(".bento-card"));

    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const filter = btn.dataset.filter;
            filterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            galleryCards.forEach((card) => {
                const match = filter === "all" || card.dataset.category === filter;
                card.classList.toggle("is-hidden", !match);
            });
        });
    });

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxClose = document.getElementById("lightbox-close");
    const lightboxPrev = document.getElementById("lightbox-prev");
    const lightboxNext = document.getElementById("lightbox-next");
    let visibleCards = galleryCards;
    let currentLbIndex = 0;

    function openLightbox(card) {
        visibleCards = galleryCards.filter((c) => !c.classList.contains("is-hidden"));
        currentLbIndex = Math.max(0, visibleCards.indexOf(card));
        renderLightbox();
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
    }

    function renderLightbox() {
        const card = visibleCards[currentLbIndex];
        const img = card.querySelector("img");
        lightboxImg.src = card.dataset.src || img.src;
        lightboxImg.alt = img ? img.alt : "";
        lightboxCaption.textContent = card.dataset.caption || "";
    }

    function closeLightbox() {
        lightbox.hidden = true;
        document.body.style.overflow = "";
    }

    galleryCards.forEach((card) => card.addEventListener("click", () => openLightbox(card)));
    lightboxClose.addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", () => {
        currentLbIndex = (currentLbIndex - 1 + visibleCards.length) % visibleCards.length;
        renderLightbox();
    });
    lightboxNext.addEventListener("click", () => {
        currentLbIndex = (currentLbIndex + 1) % visibleCards.length;
        renderLightbox();
    });
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
        if (!processModal.hidden) {
            if (e.key === "Escape") closeProcessModal();
            return;
        }
        if (lightbox.hidden) {
            if (e.key === "Escape" && nav.classList.contains("open")) setMenuOpen(false);
            return;
        }
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") lightboxPrev.click();
        if (e.key === "ArrowRight") lightboxNext.click();
    });

    /* ======================================================================
       8. Carrossel de Essência / Filosofia
       ====================================================================== */
    const quotes = [
        {
            text: '"A cerimônia é o coração do seu amor. Cuidamos de cada segundo para que vocês vivam apenas a emoção do \'SIM\'."',
            author: "Anderson Gonçalves — Fundador da Chave do Casamento"
        },
        {
            text: '"O visual é a alma do seu casamento: harmonizamos cada detalhe com elegância para refletir a história única do casal."',
            author: "Curadoria & Design — Chave do Casamento"
        },
        {
            text: '"Do Caribe à Europa, elevamos a arte de celebrar o amor a um patamar de requinte e profissionalismo inigualáveis."',
            author: "Destination Weddings — Especialista RCD Hoteles"
        }
    ];

    const quoteText = document.getElementById("quote-text");
    const quoteAuthor = document.getElementById("quote-author");
    const quoteDots = document.getElementById("quote-dots");
    let quoteIndex = 0;

    quotes.forEach((_, idx) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `quote-dot ${idx === 0 ? "active" : ""}`;
        dot.setAttribute("aria-label", `Citação ${idx + 1}`);
        dot.addEventListener("click", () => setQuote(idx));
        quoteDots.appendChild(dot);
    });

    function setQuote(idx) {
        quoteIndex = (idx + quotes.length) % quotes.length;
        quoteText.textContent = quotes[quoteIndex].text;
        quoteAuthor.textContent = quotes[quoteIndex].author;
        quoteDots.querySelectorAll(".quote-dot").forEach((d, i) => d.classList.toggle("active", i === quoteIndex));
    }

    document.getElementById("quote-prev").addEventListener("click", () => setQuote(quoteIndex - 1));
    document.getElementById("quote-next").addEventListener("click", () => setQuote(quoteIndex + 1));

    /* ======================================================================
       9. Tilt Sutil no Retrato + Copiar E-mail + Formulário Inteligente
       ====================================================================== */
    const portrait = document.getElementById("portrait-tilt");
    if (portrait && !prefersReducedMotion) {
        portrait.addEventListener("mousemove", (e) => {
            const rect = portrait.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
            portrait.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg)`;
        });
        portrait.addEventListener("mouseleave", () => {
            portrait.style.transform = "";
        });
    }

    const copyEmailBtn = document.getElementById("copy-email-btn");
    copyEmailBtn.addEventListener("click", async () => {
        const email = copyEmailBtn.dataset.email;
        try {
            await navigator.clipboard.writeText(email);
            showToast("E-mail copiado: " + email);
        } catch {
            showToast("E-mail: " + email);
        }
    });

    const styleChips = document.querySelectorAll(".style-chip");
    let selectedStyle = "Casamento Moderno";

    styleChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            styleChips.forEach((c) => c.classList.remove("active"));
            chip.classList.add("active");
            selectedStyle = chip.dataset.style;
        });
    });

    const contactForm = document.getElementById("contact-form");
    const sendWhatsappBtn = document.getElementById("send-whatsapp-btn");
    const feedback = document.getElementById("form-feedback");

    function getValidatedForm() {
        const nome = document.getElementById("nome").value.trim();
        const dataEvento = document.getElementById("data-evento").value.trim() || "A definir";
        const email = document.getElementById("email").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nome || !email || !mensagem) {
            feedback.textContent = "Por favor, preencha nome, e-mail e mensagem.";
            feedback.className = "form-feedback is-error";
            return null;
        }
        if (!emailRegex.test(email)) {
            feedback.textContent = "Informe um endereço de e-mail válido.";
            feedback.className = "form-feedback is-error";
            return null;
        }
        return { nome, dataEvento, email, mensagem, estilo: selectedStyle };
    }

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = getValidatedForm();
        if (!data) return;

        const subject = encodeURIComponent(`Consultoria (${data.estilo}) — ${data.nome}`);
        const body = encodeURIComponent(
            `Nome: ${data.nome}\nE-mail: ${data.email}\nEstilo: ${data.estilo}\nPrevisão da data: ${data.dataEvento}\n\nMensagem:\n${data.mensagem}`
        );

        feedback.textContent = "Abrindo seu aplicativo de e-mail com os detalhes preenchidos...";
        feedback.className = "form-feedback is-success";
        window.location.href = `mailto:chavedocasamento@gmail.com?subject=${subject}&body=${body}`;
    });

    sendWhatsappBtn.addEventListener("click", () => {
        const data = getValidatedForm();
        if (!data) return;

        const text = encodeURIComponent(
            `Olá Anderson! Gostaria de solicitar uma consultoria.\n\n• Nome: ${data.nome}\n• E-mail: ${data.email}\n• Estilo: ${data.estilo}\n• Previsão: ${data.dataEvento}\n\n${data.mensagem}`
        );

        feedback.textContent = "Redirecionando para o WhatsApp com sua solicitação...";
        feedback.className = "form-feedback is-success";
        window.open(`https://wa.me/5515997530274?text=${text}`, "_blank", "noopener,noreferrer");
    });
});
