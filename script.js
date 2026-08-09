/* ==============================================
   KIETOSTUDY — JS COMPARTIDO
   Todo es opcional: si falla, la página sigue usable.
   ============================================== */
(function () {
    'use strict';

    /* ------------------------------------------
       1. MENÚ MÓVIL
       ------------------------------------------ */
    function initMenuMovil() {
        const boton = document.querySelector('.boton-menu');
        const nav = document.querySelector('.nav-principal');
        if (!boton || !nav) return;

        function cerrar() {
            nav.classList.remove('abierto');
            boton.setAttribute('aria-expanded', 'false');
        }

        boton.addEventListener('click', function () {
            const abierto = nav.classList.toggle('abierto');
            boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
        });

        // Cerrar al pulsar un enlace o al salir de la vista móvil
        nav.addEventListener('click', function (e) {
            if (e.target.closest('a')) cerrar();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('abierto')) {
                cerrar();
                boton.focus();
            }
        });

        window.matchMedia('(min-width: 861px)').addEventListener('change', cerrar);
    }

    /* ------------------------------------------
       2. SOMBRA DEL HEADER AL HACER SCROLL
       ------------------------------------------ */
    function initHeaderScroll() {
        const header = document.querySelector('.encabezado-sitio');
        if (!header) return;

        let ticking = false;
        function actualizar() {
            header.classList.toggle('desplazado', window.scrollY > 8);
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(actualizar);
                ticking = true;
            }
        }, { passive: true });

        actualizar();
    }

    /* ------------------------------------------
       3. BARRAS DE HABILIDADES (animan al verse)
       ------------------------------------------ */
    function initBarrasHabilidades() {
        const barras = document.querySelectorAll('.habilidad-barra-progreso');
        if (!barras.length) return;

        function rellenar(barra) {
            barra.style.width = barra.dataset.ancho || '0%';
        }

        if (!('IntersectionObserver' in window)) {
            barras.forEach(rellenar);
            return;
        }

        const observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    rellenar(entrada.target);
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.35 });

        barras.forEach(function (b) { observador.observe(b); });
    }

    /* ------------------------------------------
       4. REVELAR ELEMENTOS AL HACER SCROLL
       ------------------------------------------ */
    function initScrollReveal() {
        const elementos = document.querySelectorAll('.revelar');
        if (!elementos.length) return;

        const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (sinMovimiento || !('IntersectionObserver' in window)) {
            elementos.forEach(function (el) { el.classList.add('visible'); });
            return;
        }

        const observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('visible');
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        elementos.forEach(function (el) { observador.observe(el); });
    }

    /* ------------------------------------------
       5. ACORDEÓN FAQ (accesible)
       ------------------------------------------ */
    function initFaq() {
        const preguntas = document.querySelectorAll('.faq-question');
        if (!preguntas.length) return;

        preguntas.forEach(function (boton) {
            boton.addEventListener('click', function () {
                const item = boton.closest('.faq-item');
                const respuesta = item.querySelector('.faq-answer');
                const estabaAbierto = item.classList.contains('abierto');

                // Cerrar el resto para mantenerlo limpio
                document.querySelectorAll('.faq-item.abierto').forEach(function (otro) {
                    if (otro === item) return;
                    otro.classList.remove('abierto');
                    otro.querySelector('.faq-answer').style.maxHeight = null;
                    otro.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });

                if (estabaAbierto) {
                    item.classList.remove('abierto');
                    respuesta.style.maxHeight = null;
                    boton.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('abierto');
                    respuesta.style.maxHeight = respuesta.scrollHeight + 'px';
                    boton.setAttribute('aria-expanded', 'true');
                }
            });
        });

        // Recalcular altura si cambia el ancho (el texto puede ocupar más líneas)
        let temporizador;
        window.addEventListener('resize', function () {
            clearTimeout(temporizador);
            temporizador = setTimeout(function () {
                document.querySelectorAll('.faq-item.abierto .faq-answer').forEach(function (r) {
                    r.style.maxHeight = r.scrollHeight + 'px';
                });
            }, 150);
        });
    }

    /* ------------------------------------------
       6. FILTROS DE PROYECTOS
       ------------------------------------------ */
    function initFiltros() {
        const botones = document.querySelectorAll('.btn-filtro');
        if (!botones.length) return;

        const secciones = document.querySelectorAll('.seccion-proyectos');

        botones.forEach(function (boton) {
            boton.addEventListener('click', function () {
                const categoria = boton.dataset.filtro;

                botones.forEach(function (b) {
                    b.setAttribute('aria-pressed', String(b === boton));
                });

                secciones.forEach(function (seccion) {
                    const coincide = categoria === 'todos' || seccion.dataset.categoria === categoria;
                    seccion.hidden = !coincide;
                });
            });
        });
    }

    /* ------------------------------------------
       7. MODAL DE VIDEO
       ------------------------------------------ */
    function initModalVideo() {
        const modal = document.getElementById('videoModal');
        if (!modal) return;

        const contenido = modal.querySelector('.modal-content');
        const iframe = modal.querySelector('iframe');
        const botonCerrar = modal.querySelector('.cerrar-modal');
        let ultimoFoco = null;

        function abrir(tarjeta) {
            const id = tarjeta.dataset.video;
            if (!id) return;

            ultimoFoco = tarjeta;
            contenido.classList.toggle('formato-vertical', tarjeta.dataset.tipo === 'corto');
            iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
            iframe.title = tarjeta.dataset.titulo || 'Video del portafolio';

            modal.classList.add('activo');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            botonCerrar.focus();
        }

        function cerrar() {
            modal.classList.remove('activo');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            // Cortar la reproducción en cuanto se cierra
            iframe.src = '';
            if (ultimoFoco) {
                ultimoFoco.focus();
                ultimoFoco = null;
            }
        }

        document.querySelectorAll('.video-card').forEach(function (tarjeta) {
            tarjeta.addEventListener('click', function () { abrir(tarjeta); });
        });

        botonCerrar.addEventListener('click', cerrar);

        // Clic en el fondo (no dentro del reproductor)
        modal.addEventListener('click', function (e) {
            if (e.target === modal) cerrar();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('activo')) cerrar();
        });
    }

    /* ------------------------------------------
       8. AÑO DINÁMICO EN EL PIE
       ------------------------------------------ */
    function initAnio() {
        document.querySelectorAll('[data-anio]').forEach(function (el) {
            el.textContent = String(new Date().getFullYear());
        });
    }

    /* ------------------------------------------
       ARRANQUE
       ------------------------------------------ */
    function init() {
        initMenuMovil();
        initHeaderScroll();
        initBarrasHabilidades();
        initScrollReveal();
        initFaq();
        initFiltros();
        initModalVideo();
        initAnio();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
