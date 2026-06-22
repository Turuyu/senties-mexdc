document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       0. LIGHT / DARK THEME TOGGLE
       ========================================================================== */
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // We default to light theme (as requested), but honor system/saved preferences
    if (savedTheme === 'dark' || (savedTheme === null && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    } else {
        document.body.classList.remove('dark-theme');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggleBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        });
    }

    /* ==========================================================================
       1. CUSTOM PREMIUM CURSOR
       ========================================================================== */
    const cursor = document.getElementById('customCursor');
    
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Hover effect for interactive elements
        const hoverables = document.querySelectorAll('a, button, select, input, textarea, .accordion-trigger, [role="button"]');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    /* ==========================================================================
       2. MOBILE MENU NAVIGATION
       ========================================================================== */
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', isOpen);
            
            // Toggle hamburger icon animation
            const bars = mobileToggle.querySelectorAll('.bar');
            if (isOpen) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
                const bars = mobileToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    /* ==========================================================================
       3. HEADER SCROLL EFFECT & ACTIVE NAVIGATION LINKS
       ========================================================================== */
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const menuLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header translucency
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Highlight active section link in navigation
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 160;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       4. SCROLL REVEAL (INTERSECTION OBSERVER FALLBACK)
       ========================================================================== */
    const reveals = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Trigger counters if it's the hero section or stats container
                    if (entry.target.classList.contains('hero-content') || entry.target.classList.contains('hero-graphics')) {
                        triggerCounters();
                    }
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        reveals.forEach(el => el.classList.add('revealed'));
        triggerCounters();
    }

    /* ==========================================================================
       5. COUNTER ANIMATION FOR STATS
       ========================================================================== */
    let countersActive = false;
    
    function triggerCounters() {
        if (countersActive) return;
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const stepTime = 30; // ms
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = (target >= 1000 ? '+' + (target/1000) + 'k' : '+' + target);
                    if (target === 15) counter.textContent = '15'; // Exact for states
                    clearInterval(timer);
                } else {
                    counter.textContent = '+' + Math.floor(current);
                }
            }, stepTime);
        });
        countersActive = true;
    }

    /* ==========================================================================
       6. INTERACTIVE BONDING WIZARD & CALCULATOR
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.wizard-panel');
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sector = btn.getAttribute('data-sector');
            
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            panels.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            document.getElementById(`panel-${sector}`).classList.add('active');
        });
    });

    // Handle card click anchors to pre-select wizard tabs
    window.selectWizardTab = function(sector) {
        const targetBtn = document.querySelector(`.tab-btn[data-sector="${sector}"]`);
        if (targetBtn) {
            targetBtn.click();
            document.getElementById('wizard').scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Live calculations formatting as MXN currency
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(val);
    };

    // Calculate Infraestructura & EPC
    const inputInfra = document.getElementById('montoInfraestructura');
    const valInfra = document.getElementById('valGarantiaInfra');
    const tipoFianzaEPC = document.getElementById('tipoFianzaEPC');

    const updateInfraCalculation = () => {
        const val = parseFloat(inputInfra.value);
        if (isNaN(val) || val <= 0) {
            valInfra.textContent = '-';
            return;
        }
        
        let percentage = 0.1; // Default 10%
        if (tipoFianzaEPC.value === 'anticipo_cumplimiento') percentage = 0.4; // 30% anticipo + 10% cumplimiento
        if (tipoFianzaEPC.value === 'vicios') percentage = 0.1;
        
        valInfra.textContent = formatCurrency(val * percentage);
    };

    if (inputInfra) {
        inputInfra.addEventListener('input', updateInfraCalculation);
        tipoFianzaEPC.addEventListener('change', updateInfraCalculation);
    }

    // Calculate Suministro Misión Crítica
    const inputSum = document.getElementById('montoSuministro');
    const valGarantiaSum = document.getElementById('valGarantiaSum');
    const origenEquipos = document.getElementById('origenEquipos');
    
    const updateSuministroCalculation = () => {
        const val = parseFloat(inputSum.value);
        if (isNaN(val) || val <= 0) {
            valGarantiaSum.textContent = '-';
            return;
        }
        valGarantiaSum.textContent = formatCurrency(val * 0.10); // Standard 10% compliance
    };

    if (inputSum) {
        inputSum.addEventListener('input', updateSuministroCalculation);
        if (origenEquipos) {
            origenEquipos.addEventListener('change', updateSuministroCalculation);
        }
    }

    // Calculate Energía & Conectividad
    const inputEne = document.getElementById('montoEnergia');
    const valGarantiaEne = document.getElementById('valGarantiaEne');
    const tipoConvenio = document.getElementById('tipoConvenio');
    
    const updateEnergiaCalculation = () => {
        const val = parseFloat(inputEne.value);
        if (isNaN(val) || val <= 0) {
            valGarantiaEne.textContent = '-';
            return;
        }
        valGarantiaEne.textContent = formatCurrency(val);
    };

    if (inputEne) {
        inputEne.addEventListener('input', updateEnergiaCalculation);
        if (tipoConvenio) {
            tipoConvenio.addEventListener('change', updateEnergiaCalculation);
        }
    }

    // Wizard CTAs scrolling to contact and filling fields
    const btnQuote = document.getElementById('btnRequestQuote');
    const selectSector = document.getElementById('formSector');
    const inputMessage = document.getElementById('formMensaje');

    if (btnQuote) {
        btnQuote.addEventListener('click', () => {
            const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-sector');
            
            // Set select option in contact form
            if (selectSector) {
                selectSector.value = activeTab;
            }
            
            // Generate tailored message based on calculator input
            let customMsg = '';
            if (activeTab === 'infraestructura' && inputInfra.value) {
                customMsg = `Hola Lázaro. Requiero asesoría para estructurar fianzas de Infraestructura & EPC. El valor total estimado de la obra es de ${formatCurrency(inputInfra.value)} con requerimiento de garantía: ${tipoFianzaEPC.options[tipoFianzaEPC.selectedIndex].text}.`;
            } else if (activeTab === 'suministro' && inputSum.value) {
                customMsg = `Hola Lázaro. Solicito información sobre fianzas de Suministro para Equipamiento de Misión Crítica. El monto de la procura estimada es de ${formatCurrency(inputSum.value)} (${origenEquipos.options[origenEquipos.selectedIndex].text}).`;
            } else if (activeTab === 'energia' && inputEne.value) {
                customMsg = `Hola Lázaro. Requiero estructurar una fianza para un convenio de Energía/Conectividad. El monto de la fianza solicitado es de ${formatCurrency(inputEne.value)} para: ${tipoConvenio.options[tipoConvenio.selectedIndex].text}.`;
            } else {
                customMsg = `Hola Lázaro. Me interesa recibir una evaluación de pliegos de licitación y capacidad de afianzamiento para un proyecto de infraestructura de misión crítica / data center.`;
            }

            if (inputMessage) {
                inputMessage.value = customMsg;
            }

            // Scroll to contact form
            document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       7. ONLINE FIANZA VALIDATOR SIMULATOR
       ========================================================================== */
    const frmValidator = document.getElementById('frmValidator');
    const valFeedback = document.getElementById('validationFeedback');
    const valSpinner = document.getElementById('valSpinner');
    const valContent = document.getElementById('valFeedbackContent');

    if (frmValidator) {
        frmValidator.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const folio = document.getElementById('valFolio').value.trim();
            const rfc = document.getElementById('valRFC').value.trim().toUpperCase();

            // Set state to loading
            valFeedback.className = 'validation-feedback loading';
            valSpinner.style.display = 'block';
            valContent.innerHTML = '';

            // Simulate server query checking CNSF records
            setTimeout(() => {
                valSpinner.style.display = 'none';
                
                // Simple validation check simulation
                const isRFCValid = /^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfc);
                
                if (folio.length > 5 && isRFCValid) {
                    valFeedback.className = 'validation-feedback success';
                    valContent.innerHTML = `
                        <h5><i class="fa-solid fa-circle-check"></i> Documento Verificado</h5>
                        <p><strong>Folio:</strong> ${folio}</p>
                        <p><strong>Fiado RFC:</strong> ${rfc}</p>
                        <p><strong>Estado:</strong> VIGENTE y REGISTRADA</p>
                        <p><strong>Emisor Autorizado:</strong> Lázaro Cruz Vázquez - Agente 28945-CNSF</p>
                        <p style="font-size:0.75rem; margin-top:8px; opacity:0.8;">La póliza cuenta con respaldo financiero real bajo el contrato de reaseguro CNSF vigente.</p>
                    `;
                } else {
                    valFeedback.className = 'validation-feedback error';
                    valContent.innerHTML = `
                        <h5><i class="fa-solid fa-triangle-exclamation"></i> Error de Validación</h5>
                        <p>No se encontró un registro coincidente para los datos ingresados. Verifique el número de folio o el RFC del fiado e intente nuevamente, o comuníquese a nuestras oficinas para asistencia inmediata.</p>
                    `;
                }
            }, 1800);
        });
    }

    /* ==========================================================================
       8. FAQ ACCORDION TRIGGER
       ========================================================================== */
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const isOpen = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
            });
            
            // Toggle current item
            if (!isOpen) {
                item.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ==========================================================================
       9. CONTACT FORM HANDLING
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btnSubmit = document.getElementById('btnSubmitContact');
            const originalBtnText = btnSubmit.innerHTML;
            
            // Button loading state
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = 'Enviando... <i class="fa-solid fa-spinner fa-spin"></i>';
            formFeedback.style.display = 'none';

            // Simulate form submission
            setTimeout(() => {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalBtnText;
                
                // Show success message
                formFeedback.className = 'form-feedback success';
                formFeedback.innerHTML = `
                    <strong>¡Solicitud enviada con éxito!</strong><br>
                    Nos hemos puesto en contacto con nuestro equipo. Un especialista liderado por Lázaro Cruz se comunicará con usted al teléfono proporcionado en menos de 2 horas hábiles.
                `;
                
                // Reset form
                contactForm.reset();
            }, 1500);
        });
    }
});
