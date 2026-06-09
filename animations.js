// animations.js - Premium Web Design Interactions & Animations

// 1. Check if the device is a mobile or touch-capable screen
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(max-width: 768px)').matches;

// 2. Load Lenis Smooth Scroll dynamically from CDN (desktops only)
if (!isTouchDevice) {
    const lenisScript = document.createElement('script');
    lenisScript.src = "https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js";
    lenisScript.onload = function() {
        const lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 0.85,
            smoothTouch: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        console.log("Lenis Smooth Scroll loaded & initialized.");
    };
    document.head.appendChild(lenisScript);
}

// 3. Inject Core Premium CSS Styles (Cursor, Typewriter, Scroll Badge)
const style = document.createElement('style');
style.textContent = `
    /* Scroll Reveal Base */
    .reveal-element {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1), transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
        will-change: transform, opacity;
    }
    .reveal-element.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    .reveal-delay-1 { transition-delay: 0.12s; }
    .reveal-delay-2 { transition-delay: 0.24s; }
    .reveal-delay-3 { transition-delay: 0.36s; }
    .reveal-delay-4 { transition-delay: 0.48s; }

    /* Hover Micro-animations */
    .price_table_1 {
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1) !important;
    }
    .price_table_1:hover {
        transform: translateY(-8px) scale(1.015) !important;
        box-shadow: 0 15px 35px rgba(212, 175, 55, 0.22) !important;
    }
    
    .mega_team_case, .stm_testimonials .item, .widget_recent_entries li, .post_list_main {
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .mega_team_case:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }
    .stm_testimonials .item:hover {
        transform: translateY(-4px);
    }

    a, button, .vc_btn3, .price-btn {
        transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    }

    /* Typewriter Cursor blinking */
    .typewriter-cursor {
        font-weight: 300;
        margin-left: 2px;
        animation: typewriterBlink 0.8s infinite;
        will-change: opacity;
    }
    @keyframes typewriterBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }

    /* Custom Cursor Styles (Desktop Only) */
    ${!isTouchDevice ? `
    .custom-cursor-circle {
        width: 24px;
        height: 24px;
        border: 1.5px solid rgba(212, 175, 55, 0.55);
        border-radius: 50%;
        position: fixed;
        top: 0;
        left: 0;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9999;
        will-change: transform;
        transition: width 0.25s cubic-bezier(0.25, 1, 0.5, 1), height 0.25s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.25s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease;
        overflow: hidden;
        opacity: 0; /* Fade in on mousemove */
    }
    .custom-cursor-circle.hovering {
        width: 48px;
        height: 48px;
        border-color: #D4AF37;
        background-color: transparent !important;
    }
    ` : ''}

    /* Scroll Badge Styling */
    .scroll-badge {
        position: absolute;
        bottom: 20px;
        right: 40px;
        z-index: 10;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .scroll-badge svg {
        animation: spin-fallback 16s linear infinite;
        will-change: transform;
    }
    @keyframes spin-fallback {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    /* Force parents to have overflow visible for sticky positioning */
    #wrapper, #fullpage, #main, .container, .content-area, article {
        overflow: visible !important;
    }

    body {
        overflow-x: hidden !important;
    }

    /* Stacked Testimonials Section */
    .stacked-testimonials-section {
        position: relative;
        height: 480vh; /* Scroll track length for 9 cards */
        background-color: #ffffff;
        margin-top: 100px;
        margin-bottom: 100px;
        width: 100vw;
        margin-left: calc(-50vw + 50%);
        left: 0;
        overflow: visible;
    }
    .stacked-testimonials-sticky {
        position: sticky;
        top: 0px; /* Pin at the very top of the screen */
        height: 100vh; /* Use full viewport height */
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ffffff;
        width: 100%;
        transition: top 0.4s ease, height 0.4s ease;
    }

    /* Navigation Bar Hide Transition */
    #header {
        transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out !important;
    }
    body.header-hide #header {
        transform: translateY(-100%) !important;
        opacity: 0 !important;
        pointer-events: none !important;
    }
    .testimonials-bg-text {
        position: absolute;
        font-size: 11vw; /* Fits viewport width perfectly with 8-10% side margins */
        font-family: 'Poppins', sans-serif;
        font-weight: 900;
        color: #000000;
        text-transform: uppercase;
        letter-spacing: -0.04em;
        line-height: 1;
        white-space: nowrap;
        user-select: none;
        pointer-events: none;
        z-index: 1;
        text-align: center;
        width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(1.0, 1.9); /* Stretch vertically to look massive and bold */
        opacity: 0.95;
    }
    .testimonials-stack {
        position: relative;
        width: 820px; /* Wider cards using horizontal screen space */
        height: 420px; /* Taller height to ensure full testimonial text fits */
        z-index: 5;
        perspective: 1200px;
        transform-style: preserve-3d;
    }
    .testimonial-card {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 16px;
        box-shadow: 0 15px 45px rgba(0, 0, 0, 0.06);
        padding: 40px; /* Spacious padding */
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        will-change: transform, opacity;
        transition: transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.15s cubic-bezier(0.25, 1, 0.5, 1);
        background-color: #ffffff;
    }
    .testimonial-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    .card-dot {
        width: 10px;
        height: 10px;
        background-color: #ff3b30;
        border-radius: 50%;
    }
    .testimonial-avatar {
        width: 55px;
        height: 55px;
        border-radius: 50%;
        border: 2px solid #D4AF37;
        object-fit: cover;
    }
    .testimonial-quote {
        font-size: 17px; /* Clear and bold reading size */
        line-height: 1.65;
        color: #333333;
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
        text-align: center;
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15px;
        overflow: visible; /* Prevent scrollbar inside card */
    }
    .testimonial-author {
        text-align: center;
    }
    .testimonial-author h6 {
        font-size: 15px;
        font-weight: 700;
        color: #001040;
        margin: 0;
        text-transform: capitalize;
    }
    .testimonial-author .position {
        font-size: 11px;
        color: #777777;
        margin-top: 2px;
        font-weight: 500;
    }
    .testimonial-quote::-webkit-scrollbar {
        width: 4px;
    }
    .testimonial-quote::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 2px;
    }

    @media screen and (max-width: 992px) {
        .testimonials-stack {
            width: 90%;
            height: 420px;
        }
        .testimonial-card {
            padding: 30px;
        }
        .testimonial-quote {
            font-size: 15.5px;
        }
    }

    @media screen and (max-width: 768px) {
        .testimonials-stack {
            width: 92%;
            height: 400px;
        }
        .testimonial-card {
            padding: 24px;
        }
        .testimonial-quote {
            font-size: 14.5px;
            line-height: 1.55;
            margin-bottom: 12px;
        }
        .testimonials-bg-text {
            font-size: 11.5vw;
            transform: translate(-50%, -50%) scale(1.0, 1.6);
        }
    }

    @media screen and (max-width: 480px) {
        .testimonials-stack {
            width: 94%;
            height: 430px; /* Taller on mobile to avoid line wrapping clipping */
        }
        .testimonial-card {
            padding: 20px;
        }
        .testimonial-quote {
            font-size: 13.5px;
            line-height: 1.5;
        }
    }

    .spiral-philosophy-section {
        position: relative;
        height: 220vh; /* Scroll track length for pinning and scrolling */
        background: radial-gradient(circle at center, #0e2042 0%, #050d1d 100%) !important;
        margin-top: 100px;
        margin-bottom: 100px;
        width: 100vw;
        margin-left: calc(-50vw + 50%);
        left: 0;
        overflow: visible;
    }
    
    .spiral-philosophy-sticky {
        position: sticky;
        top: 0px; /* Pin at the very top of the screen */
        height: 100vh; /* Use full viewport height */
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        transition: top 0.4s ease, height 0.4s ease;
    }
    
    .spiral-philosophy-sticky::before {
        content: '';
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background-image: 
            linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px);
        background-size: 50px 50px;
        background-position: center;
        pointer-events: none;
    }
    
    .spiral-scene {
        position: relative;
        perspective: 1400px;
        perspective-origin: 50% 35%;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .spiral-carousel {
        position: relative;
        width: 320px;
        height: 200px;
        transform-style: preserve-3d;
        will-change: transform;
    }
    
    .spiral-card {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 320px;
        height: 200px;
        margin-left: -160px;
        margin-top: -100px;
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1.5px solid rgba(212, 175, 55, 0.18) !important;
        border-radius: 16px;
        padding: 24px;
        box-sizing: border-box;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        transition: border-color 0.3s, background 0.3s, box-shadow 0.3s, opacity 0.3s;
        transform-style: preserve-3d;
        backface-visibility: visible;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    
    .spiral-card:hover {
        background: rgba(255, 255, 255, 0.12) !important;
        border-color: rgba(212, 175, 55, 0.8) !important;
        box-shadow: 0 12px 30px rgba(212, 175, 55, 0.3) !important;
        cursor: pointer;
    }
    
    .spiral-card a {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        text-decoration: none !important;
        outline: none;
    }
    
    .spiral-card-icon {
        font-size: 24px;
        color: #D4AF37;
        margin-bottom: 8px;
    }
    
    .spiral-card h5 {
        font-size: 16px;
        font-weight: 700;
        color: #ffffff !important;
        margin: 0 0 6px 0 !important;
        font-family: 'Poppins', sans-serif;
    }
    
    .spiral-card p {
        font-size: 12.5px;
        line-height: 1.5;
        color: #dddddd !important;
        margin: 0 !important;
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
        flex-grow: 1;
        display: flex;
        align-items: center;
    }
    
    .spiral-card-readmore {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 700;
        color: #D4AF37;
        text-transform: uppercase;
        margin-top: 10px;
    }
    
    .spiral-card-readmore .stm-amsterdam-arrow {
        display: inline-block;
        width: 12px;
        height: 8px;
        background: currentColor;
        clip-path: polygon(0 3px, 8px 3px, 5px 0, 12px 4px, 5px 8px, 8px 5px, 0 5px);
    }
    
    .spiral-philosophy-title {
        position: absolute;
        top: 40px;
        z-index: 10;
        text-align: center;
        width: 100%;
    }
    
    .spiral-philosophy-title h2 {
        font-size: 38px;
        color: #ffffff !important;
        font-weight: 700;
        font-family: 'Poppins', sans-serif;
        margin: 0;
        letter-spacing: -0.5px;
    }
    
    .spiral-philosophy-title h2 em {
        color: #D4AF37;
        font-style: normal;
    }

    @media screen and (max-width: 992px) {
        .spiral-card {
            width: 280px;
            height: 180px;
            margin-left: -140px;
            margin-top: -90px;
            padding: 20px;
        }
        .spiral-card h5 {
            font-size: 15px;
        }
        .spiral-card p {
            font-size: 12px;
        }
    }
    
    @media screen and (max-width: 768px) {
        .spiral-card {
            width: 220px;
            height: 150px;
            margin-left: -110px;
            margin-top: -75px;
            padding: 15px;
        }
        .spiral-card h5 {
            font-size: 13.5px;
            margin-bottom: 4px !important;
        }
        .spiral-card p {
            font-size: 11px;
            line-height: 1.4;
        }
        .spiral-card-icon {
            font-size: 18px;
            margin-bottom: 4px;
        }
        .spiral-card-readmore {
            font-size: 10px;
            margin-top: 6px;
        }
        .spiral-philosophy-title h2 {
            font-size: 28px;
        }
    }
`;
document.head.appendChild(style);

// 4. Setup Custom Cursor Tracking & Inertia (Desktops only)
if (!isTouchDevice) {
    const cursorCircle = document.createElement('div');
    cursorCircle.className = 'custom-cursor-circle';
    document.body.appendChild(cursorCircle);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let circleX = mouseX;
    let circleY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorCircle.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorCircle.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorCircle.style.opacity = '1';
    });

    // Inertia follow using RequestAnimationFrame
    function updateCursor() {
        circleX += (mouseX - circleX) * 0.13;
        circleY += (mouseY - circleY) * 0.13;
        cursorCircle.style.transform = `translate3d(${circleX}px, ${circleY}px, 0)`;

        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    // Hover state toggling on interactive elements using event delegation
    document.addEventListener('mouseover', (e) => {
        const target = e.target;
        if (!target) return;

        const isInteractive = target.closest('a, button, select, input, textarea, .price-btn, .vc_btn3, [role="button"], .services_item1, .price_table_1, .stm_testimonials .item, .prettyphoto, .vc_item, .vc_single_image-wrapper, .post_list_main, .widget_recent_entries li, .read-more-trigger, .spiral-card');
        
        if (isInteractive) {
            cursorCircle.classList.add('hovering');
        } else {
            cursorCircle.classList.remove('hovering');
        }
    });

    // Make circle scale down slightly on click for tactile response
    document.addEventListener('mousedown', () => {
        cursorCircle.style.transform += ' scale(0.85)';
    });
}

// 5. Setup IntersectionObserver for Scroll-Reveal
document.addEventListener('DOMContentLoaded', () => {
    const selectorList = [
        'h1', 'h2', 'h3',
        '.price_table_1',
        '.mega_team_case',
        '.stm_testimonials .item',
        '.widget_recent_entries li',
        '.wpb_text_column',
        '.vc_column_container'
    ];

    // Staggered reveal for rows
    const rows = document.querySelectorAll('.vc_row');
    rows.forEach(row => {
        const columns = row.querySelectorAll(':scope > .wpb_column');
        columns.forEach((col, idx) => {
            col.classList.add('reveal-element');
            if (idx > 0 && idx < 5) {
                col.classList.add(`reveal-delay-${idx}`);
            }
        });
    });

    // Staggered reveal for footer widgets
    const footerRows = document.querySelectorAll('.footer_widgets .row');
    footerRows.forEach(row => {
        const cols = row.querySelectorAll(':scope > div');
        cols.forEach((col, idx) => {
            col.classList.add('reveal-element');
            if (idx > 0 && idx < 5) {
                col.classList.add(`reveal-delay-${idx}`);
            }
        });
    });

    // Auto-mark other elements
    const elementsToReveal = document.querySelectorAll(selectorList.join(', '));
    elementsToReveal.forEach(el => {
        if (!el.classList.contains('wpb_column') && !el.closest('.footer_widgets')) {
            el.classList.add('reveal-element');
        }
    });

    // Observer setup
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealables = document.querySelectorAll('.reveal-element');
    revealables.forEach(el => observer.observe(el));

    // 6. Typewriter Heading Animation (Homepage Hero)
    const typewriterSpan = document.getElementById('typewriter');
    if (typewriterSpan) {
        const words = ["Wealth Creation", "Financial Freedom", "Capital Growth", "Investment Alpha"];
        let wordIndex = 0;
        let charIndex = 0;
        let typingSpeed = 120;

        function type() {
            const currentWord = words[wordIndex];
            
            // Type alphabet by alphabet
            if (charIndex < currentWord.length) {
                typewriterSpan.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                // Stay for 2.5 seconds
                setTimeout(() => {
                    // Disappear instantly
                    typewriterSpan.textContent = "";
                    charIndex = 0;
                    wordIndex = (wordIndex + 1) % words.length;
                    // Delay before typing next word
                    setTimeout(type, 500);
                }, 2500);
            }
        }
        // Start typing after a short delay
        setTimeout(type, 800);
    }

    // 7. Dynamic Circular Scroll-Down Badge (removed)

    // 8. Subtle Mouse Parallax on Hero Image
    if (!isTouchDevice) {
        const heroContainer = document.querySelector('.vc_custom_1765885650684');
        const heroImg = document.querySelector('.home-hero img');
        if (heroContainer && heroImg) {
            heroContainer.addEventListener('mousemove', (e) => {
                const rect = heroContainer.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const moveX = -(x * 0.035);
                const moveY = -(y * 0.035);
                heroImg.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.03)`;
                heroImg.style.transition = 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)';
            });

            heroContainer.addEventListener('mouseleave', () => {
                heroImg.style.transform = 'translate3d(0, 0, 0) scale(1)';
                heroImg.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            });
        }
    }

    // 9. Stacked Testimonials Card-Throw Scroll Animation
    const stackedSection = document.querySelector('.stacked-testimonials-section');
    const stackedCards = document.querySelectorAll('.testimonial-card');
    
    if (stackedSection && stackedCards.length > 0) {
        const totalCards = stackedCards.length;
        
        // Initialize cards stack layout
        stackedCards.forEach((card, idx) => {
            // Card 0 is the top card and should be on top
            card.style.zIndex = totalCards - idx;
            
            // Messy deck layout rotation (staggered slightly)
            const rot = (idx % 2 === 0 ? 1 : -1) * (idx * 0.8 + 0.5);
            // Stack depth offset using translateY and translateZ
            const transY = idx * 4;
            const transZ = -idx * 8;
            card.style.transform = `translate3d(0, ${transY}px, ${transZ}px) rotate(${rot}deg)`;
        });

        window.addEventListener('scroll', () => {
            const rect = stackedSection.getBoundingClientRect();
            const sectionHeight = rect.height;
            const windowHeight = window.innerHeight;
            
            // Toggle header visibility based on whether we are scrolled into the testimonials section
            const isTestimonialsActive = (rect.top <= 0 && rect.bottom >= windowHeight);
            const philosophySection = document.getElementById('philosophy-section');
            let isPhilosophyActive = false;
            if (philosophySection) {
                const philRect = philosophySection.getBoundingClientRect();
                isPhilosophyActive = (philRect.top <= 0 && philRect.bottom >= windowHeight);
            }
            
            if (isTestimonialsActive || isPhilosophyActive) {
                document.body.classList.add('header-hide');
            } else {
                document.body.classList.remove('header-hide');
            }
            
            // Calculate scroll progress (0 when section hits the stick point, 1 when track ends)
            const scrolled = -rect.top;
            const scrollRange = sectionHeight - windowHeight;
            
            if (scrollRange <= 0) return;
            
            let progress = scrolled / scrollRange;
            progress = Math.max(0, Math.min(1, progress));
            
            // We divide the progress range 0..1 into segments for throwing cards one by one
            const segmentCount = totalCards;
            
            stackedCards.forEach((card, idx) => {
                const startThresh = idx / segmentCount;
                const endThresh = (idx + 1) / segmentCount;
                
                if (progress <= startThresh) {
                    // Card is resting in the stack
                    const rot = (idx % 2 === 0 ? 1 : -1) * (idx * 0.8 + 0.5);
                    const transY = idx * 4;
                    const transZ = -idx * 8;
                    card.style.transform = `translate3d(0, ${transY}px, ${transZ}px) rotate(${rot}deg)`;
                    card.style.opacity = '1';
                    card.style.visibility = 'visible';
                } else if (progress > startThresh && progress < endThresh) {
                    // Card is currently being thrown away
                    const subProgress = (progress - startThresh) / (endThresh - startThresh);
                    
                    // Stagger throw directions: Card 0 up-left, Card 1 up-right, Card 2 up-left, etc.
                    let dirX = 1;
                    if (idx % 3 === 0) dirX = -1.2;
                    else if (idx % 3 === 1) dirX = 1.2;
                    else dirX = -0.3; // fly mostly up
                    
                    const flyX = dirX * subProgress * 1100; // Fly completely off the screen
                    const flyY = -subProgress * 550; // fly up
                    const flyRot = ((idx % 2 === 0 ? 1 : -1) * 12) + (subProgress * dirX * 45);
                    
                    card.style.transform = `translate3d(${flyX}px, ${flyY}px, 0) rotate(${flyRot}deg)`;
                    card.style.opacity = (1 - subProgress).toString();
                    card.style.visibility = 'visible';
                } else {
                    // Card is completely thrown away
                    card.style.opacity = '0';
                    card.style.visibility = 'hidden';
                }
            });
        });
    }

    // 10. 3D Spiral Philosophy Scroll Animation
    const philosophySection = document.getElementById('philosophy-section');
    const carousel = document.querySelector('.spiral-carousel');
    const spiralCards = document.querySelectorAll('.spiral-card');
    
    if (philosophySection && carousel && spiralCards.length > 0) {
        const totalSpiralCards = spiralCards.length;
        
        const getSpiralRadius = () => {
            return window.innerWidth <= 480 ? 150 : (window.innerWidth <= 768 ? 200 : 380);
        };
        
        const getSpiralYSpacingFactor = () => {
            return window.innerWidth <= 480 ? 0.75 : (window.innerWidth <= 768 ? 1.05 : 1.35);
        };
        
        // Helix track geometry constants
        const totalRange = 540;  // 1.5 full turns (540 degrees)
        const spacing = 60;     // 60 degrees spacing between cards (9 cards * 60 = 540)
        const startAngle = -270; // Track starts at -270 degrees and ends at +270 degrees
        
        let idleOffsetAngle = 0;
        let targetScrollOffsetAngle = 0;
        let currentScrollOffsetAngle = 0;
        
        window.addEventListener('scroll', () => {
            const rect = philosophySection.getBoundingClientRect();
            const sectionHeight = rect.height;
            const windowHeight = window.innerHeight;
            
            // Toggle header visibility based on whether we are scrolled into the philosophy section
            const isPhilosophyActive = (rect.top <= 0 && rect.bottom >= windowHeight);
            const stackedSection = document.querySelector('.stacked-testimonials-section');
            let isTestimonialsActive = false;
            if (stackedSection) {
                const stackRect = stackedSection.getBoundingClientRect();
                isTestimonialsActive = (stackRect.top <= 0 && stackRect.bottom >= windowHeight);
            }
            
            if (isPhilosophyActive || isTestimonialsActive) {
                document.body.classList.add('header-hide');
            } else {
                document.body.classList.remove('header-hide');
            }
            
            const scrolled = -rect.top;
            const scrollRange = sectionHeight - windowHeight;
            
            if (scrollRange > 0) {
                let progress = scrolled / scrollRange;
                progress = Math.max(0, Math.min(1, progress));
                
                // Scroll down rotates clockwise fast (moves cards upward by exactly one 540-deg cycle)
                targetScrollOffsetAngle = progress * 540;
            }
        });
        
        function animateSpiral() {
            // Idle rotation (slowly counter-clockwise, moving cards downward)
            idleOffsetAngle -= 0.05; 
            
            // Smooth lerp for scroll-driven rotation
            currentScrollOffsetAngle += (targetScrollOffsetAngle - currentScrollOffsetAngle) * 0.08;
            
            const baseAngle = idleOffsetAngle + currentScrollOffsetAngle;
            const radius = getSpiralRadius();
            const ySpacingFactor = getSpiralYSpacingFactor();
            
            // Loop through each card and compute its position along the fixed helix track
            spiralCards.forEach((card, idx) => {
                const angle = baseAngle + idx * spacing;
                
                // Wrap the angle to the repeating track range [-270, 270)
                let wrapped = (angle - startAngle) % totalRange;
                if (wrapped < 0) wrapped += totalRange;
                const trackAngle = startAngle + wrapped;
                
                // Fixed helix coordinates
                const rotY = trackAngle;
                const y = -trackAngle * ySpacingFactor; // Negative to make increasing angle translate card upward
                
                // Position card on the 3D spiral track
                card.style.transform = `rotateY(${rotY}deg) translateZ(${radius}px) translateY(${y}px)`;
                
                // 1. Fade out near boundaries (-270 and +270) to make wrapping invisible
                let boundaryOpacity = 1.0;
                const fadeWidth = 80; // degrees
                if (trackAngle < startAngle + fadeWidth) {
                    boundaryOpacity = (trackAngle - startAngle) / fadeWidth;
                } else if (trackAngle > (startAngle + totalRange - fadeWidth)) {
                    boundaryOpacity = (startAngle + totalRange - trackAngle) / fadeWidth;
                }
                boundaryOpacity = Math.max(0, Math.min(1, boundaryOpacity));
                
                // 2. Dim and blur cards in the background (facing away, 90 to 270 deg world rotation) for depth perspective
                let normAngle = rotY % 360;
                if (normAngle < 0) normAngle += 360;
                
                const isBackside = (normAngle > 90 && normAngle < 270);
                let finalOpacity = boundaryOpacity;
                let blurAmount = 0;
                
                if (isBackside) {
                    finalOpacity = boundaryOpacity * 0.22; // Dim background cards
                    blurAmount = 3.5;                      // Blur background cards
                }
                
                card.style.opacity = finalOpacity.toFixed(3);
                card.style.filter = blurAmount > 0 ? `blur(${blurAmount}px)` : 'none';
                
                // Hide cards only when they are fully faded out at the top/bottom boundaries
                if (boundaryOpacity < 0.08) {
                    card.style.visibility = 'hidden';
                    card.style.pointerEvents = 'none';
                } else {
                    card.style.visibility = 'visible';
                    card.style.pointerEvents = isBackside ? 'none' : 'auto';
                }
            });
            
            requestAnimationFrame(animateSpiral);
        }
        
        requestAnimationFrame(animateSpiral);

        // Bind click events on spiral cards to open our custom modal system
        const modals = document.querySelectorAll('.modal[id^="services_item"]');
        modals.forEach(modal => {
            // Add custom class and override styles
            modal.classList.add('custom-philosophy-modal');
            
            // Custom close button listener
            const closeBtn = modal.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    modal.classList.remove('active');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 400);
                });
            }
            
            // Background click close handler
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 400);
                }
            });
        });
        
        const spiralLinks = document.querySelectorAll('.spiral-card a');
        spiralLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = link.getAttribute('href');
                const targetModal = document.querySelector(modalId);
                if (targetModal) {
                    targetModal.style.display = 'flex';
                    void targetModal.offsetWidth; // Trigger layout reflow
                    targetModal.classList.add('active');
                }
            });
        });
    }
});
