// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Add event listener for form submission
    const form = document.getElementById('contact-form');
    const result = document.getElementById('result');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
        
        // Show loading message
        result.style.display = "block";
        result.innerHTML = "Please wait...";
    
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                result.innerHTML = "Message sent successfully!";
                result.style.color = "#4CAF50";
            } else {
                console.log(response);
                result.innerHTML = "Error: " + json.message;
                result.style.color = "#f44336";
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "Something went wrong! Please try again.";
            result.style.color = "#f44336";
        })
        .then(function() {
            form.reset();
            // Hide the result message after 5 seconds
            setTimeout(() => {
                result.style.display = "none";
            }, 5000);
        });
    });
    
    // Smooth scrolling for navigation links and buttons
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile: floating section label instead of top navbar
    (function setupMobileSectionLabel(){
        const isMobile = window.matchMedia('(max-width: 900px)').matches;
        if (!isMobile) return; // only activate on mobile-sized viewports

        const labelEl = document.getElementById('mobile-section-label') || (function(){
            const el = document.createElement('div');
            el.id = 'mobile-section-label';
            el.className = 'mobile-section-label hidden';
            el.setAttribute('aria-hidden','true');
            document.body.appendChild(el);
            return el;
        })();

        const sections = Array.from(document.querySelectorAll('section[id]'));
        if (!sections.length) return;

        // Helper to read a friendly heading for a section
        function getSectionLabel(section){
            const heading = section.querySelector('h2, h1, h3');
            if (heading && heading.textContent.trim()) return heading.textContent.trim();
            // fallback to id with capitalization
            return section.id.replace(/[-_]/g,' ').replace(/\b\w/g, c => c.toUpperCase());
        }

        let currentId = null;

        const observer = new IntersectionObserver((entries) => {
            // pick the entry with largest intersectionRatio and isIntersecting
            let best = null;
            for (const e of entries){
                if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
            }
            if (!best) return;
            if (best.isIntersecting){
                const id = best.target.id || best.target.getAttribute('id');
                if (id && id !== currentId){
                    currentId = id;
                    const label = getSectionLabel(best.target);
                    labelEl.textContent = label;
                    labelEl.classList.remove('hidden');
                    labelEl.classList.add('visible');
                    labelEl.setAttribute('aria-hidden','false');
                }
            }
        }, {
            root: null,
            rootMargin: '-40% 0% -40% 0%',
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
        });

        sections.forEach(s => observer.observe(s));

        // hide label when user scrolls to top quickly
        window.addEventListener('scroll', () => {
            if (window.scrollY < 60){
                labelEl.classList.remove('visible');
                labelEl.classList.add('hidden');
                labelEl.setAttribute('aria-hidden','true');
                currentId = null;
            }
        }, { passive: true });

        // Re-run if viewport changes (desktop <-> mobile)
        const mm = window.matchMedia('(max-width: 900px)');
        mm.addEventListener && mm.addEventListener('change', (ev) => {
            if (!ev.matches){
                // desktop: remove label and disconnect observer
                try{ observer.disconnect(); }catch(e){}
                labelEl.remove();
            } else {
                // reload page or re-init to be safe
                window.location.reload();
            }
        });
    })();
}); 