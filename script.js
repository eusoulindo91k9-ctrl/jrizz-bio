document.addEventListener('DOMContentLoaded', () => {
    const cursorGlow = document.querySelector('.cursor-glow');
    const typingText = document.querySelector('.typing-text');
    const skillTags = document.querySelectorAll('.skill-tag');
    const stats = document.querySelectorAll('.stat-value');
    const sections = document.querySelectorAll('section');
    
    const phrases = [
        'Desenvolvedor',
        'Plugin Developer',
        'Game Developer',
        'Coder',
        'Tech Enthusiast'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    typeEffect();
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                if (entry.target.classList.contains('skills')) {
                    animateSkills();
                }
                
                if (entry.target.classList.contains('about')) {
                    animateStats();
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    function animateSkills() {
        skillTags.forEach((tag, index) => {
            setTimeout(() => {
                const level = tag.dataset.level;
                tag.style.setProperty('--level', level + '%');
                tag.style.animation = `skillPop 0.3s ease forwards`;
            }, index * 50);
        });
    }
    
    function animateStats() {
        stats.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current) + (target === 50 ? 'K+' : '+');
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + (target === 50 ? 'K+' : '+');
                }
            };
            
            updateCounter();
        });
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes skillPop {
            0% {
                transform: scale(0.8);
                opacity: 0;
            }
            50% {
                transform: scale(1.05);
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        section {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        section.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    const glitchElement = document.querySelector('.glitch');
    let glitchInterval;
    
    document.addEventListener('mousemove', (e) => {
        const distance = Math.sqrt(
            Math.pow(e.clientX - window.innerWidth / 2, 2) +
            Math.pow(e.clientY - window.innerHeight / 2, 2)
        );
        
        if (distance < 200 && !glitchInterval) {
            glitchInterval = setInterval(() => {
                glitchElement.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                setTimeout(() => {
                    glitchElement.style.transform = 'translate(0, 0)';
                }, 50);
            }, 100);
        } else if (distance >= 200 && glitchInterval) {
            clearInterval(glitchInterval);
            glitchInterval = null;
            glitchElement.style.transform = 'translate(0, 0)';
        }
    });
});
