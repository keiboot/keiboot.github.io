/* ==============================================
   KIETOSTUDY — JS PUNK (2026)
   Stop motion + motion graphics.
   Todo es opcional: si falla, la página sigue usable.
   ============================================== */
(function () {
    'use strict';

    var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ------------------------------------------
       1. MENÚ MÓVIL
       ------------------------------------------ */
    function initMenuMovil() {
        var boton = document.querySelector('.boton-menu');
        var nav = document.querySelector('.nav-principal');
        if (!boton || !nav) return;

        function cerrar() {
            nav.classList.remove('abierto');
            boton.setAttribute('aria-expanded', 'false');
        }

        boton.addEventListener('click', function () {
            var abierto = nav.classList.toggle('abierto');
            boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
        });

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
       2. HEADER AL HACER SCROLL
       ------------------------------------------ */
    function initHeaderScroll() {
        var header = document.querySelector('.encabezado-sitio');
        if (!header) return;

        var ticking = false;
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
       3. TIMELINE DE SCROLL (playhead superior)
       ------------------------------------------ */
    function initTimelineScroll() {
        var relleno = document.querySelector('[data-timeline-scroll]');
        if (!relleno) return;

        var ticking = false;
        function actualizar() {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
            // steps de 40 => el playhead salta como fotograma
            var fotograma = Math.round(pct * 0.4) / 0.4;
            relleno.style.width = Math.min(fotograma, 100) + '%';
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
       4. TIPOGRAFÍA CINÉTICA (letra por letra)
       ------------------------------------------ */
    function initKinetico() {
        var elementos = document.querySelectorAll('[data-kinetico]');
        if (!elementos.length) return;

        Array.prototype.forEach.call(elementos, function (el) {
            var texto = el.textContent;
            el.setAttribute('aria-label', texto.trim());
            el.textContent = '';

            var indice = 0;
            texto.split('').forEach(function (car) {
                if (car === ' ') {
                    el.appendChild(document.createTextNode(' '));
                    return;
                }
                var span = document.createElement('span');
                span.className = 'letra';
                span.textContent = car;
                span.setAttribute('aria-hidden', 'true');
                // Retardo escalonado: cada letra entra en su propio fotograma
                span.style.animationDelay = (indice * 0.04) + 's';
                el.appendChild(span);
                indice++;
            });
        });
    }

    /* ------------------------------------------
       5. TÍTULO RANSOM NOTE (hero)
       Colores y rotaciones asignados por JS para
       que el HTML quede limpio y accesible.
       ------------------------------------------ */
    function initRansom() {
        var contenedores = document.querySelectorAll('[data-ransom]');
        if (!contenedores.length) return;

        var tonos = ['lr-rojo', 'lr-crema', 'lr-acido', 'lr-rosa', 'lr-tinta'];

        Array.prototype.forEach.call(contenedores, function (el) {
            var texto = el.textContent;
            el.setAttribute('aria-label', texto.trim());
            el.textContent = '';

            var i = 0;
            texto.split('').forEach(function (car) {
                var span = document.createElement('span');
                span.setAttribute('aria-hidden', 'true');
                span.style.animationDelay = (0.15 + i * 0.05) + 's';

                if (car === ' ') {
                    span.className = 'letra-ransom lr-vacio';
                    span.innerHTML = '&nbsp;';
                } else {
                    // rotacion de color pseudoaleatoria pero estable por posicion
                    span.className = 'letra-ransom ' + tonos[(i * 3 + car.charCodeAt(0)) % tonos.length];
                    span.textContent = car;
                }
                el.appendChild(span);
                i++;
            });
        });
    }

    /* ------------------------------------------
       6. REVELAR AL SCROLL
       ------------------------------------------ */
    function initScrollReveal() {
        var elementos = document.querySelectorAll('.revelar');
        if (!elementos.length) return;

        if (sinMovimiento || !('IntersectionObserver' in window)) {
            Array.prototype.forEach.call(elementos, function (el) { el.classList.add('visible'); });
            return;
        }

        var observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('visible');
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        Array.prototype.forEach.call(elementos, function (el) { observador.observe(el); });
    }

    /* ------------------------------------------
       7. BARRAS DE HABILIDADES (en fotogramas)
       ------------------------------------------ */
    function initBarrasHabilidades() {
        var barras = document.querySelectorAll('.habilidad-barra-progreso');
        if (!barras.length) return;

        function rellenar(barra) {
            barra.style.width = barra.dataset.ancho || '0%';
        }

        if (!('IntersectionObserver' in window)) {
            Array.prototype.forEach.call(barras, rellenar);
            return;
        }

        var observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    rellenar(entrada.target);
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.35 });

        Array.prototype.forEach.call(barras, function (b) { observador.observe(b); });
    }

    /* ------------------------------------------
       8. CONTADORES (cuentan por fotogramas)
       ------------------------------------------ */
    function initContadores() {
        var contadores = document.querySelectorAll('[data-contador]');
        if (!contadores.length) return;

        function animar(el) {
            var objetivo = parseInt(el.dataset.contador, 10) || 0;
            if (sinMovimiento) { el.textContent = String(objetivo); return; }

            var fotogramas = 10;
            var paso = Math.max(1, Math.round(objetivo / fotogramas));
            var actual = 0;

            var intervalo = setInterval(function () {
                actual += paso;
                if (actual >= objetivo) {
                    actual = objetivo;
                    clearInterval(intervalo);
                }
                el.textContent = String(actual);
            }, 70);
        }

        if (!('IntersectionObserver' in window)) {
            Array.prototype.forEach.call(contadores, animar);
            return;
        }

        var observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    animar(entrada.target);
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.5 });

        Array.prototype.forEach.call(contadores, function (c) { observador.observe(c); });
    }

    /* ------------------------------------------
       9. LÍDER DE PELÍCULA (cuenta atrás 8→2)
       ------------------------------------------ */
    function initLeader() {
        var contenedor = document.querySelector('[data-leader]');
        var numero = document.querySelector('[data-leader-num]');
        if (!contenedor || !numero || sinMovimiento) return;

        var valor = 8;
        var intervalo = setInterval(function () {
            valor--;
            if (valor < 2) {
                clearInterval(intervalo);
                contenedor.style.display = 'none';
                return;
            }
            numero.textContent = String(valor);
        }, 900);

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) clearInterval(intervalo);
        });
    }

    /* ------------------------------------------
       10. OSD VHS (timecode en vivo)
       ------------------------------------------ */
    function initVhsOsd() {
        var osd = document.querySelector('[data-vhs-time]');
        if (!osd || sinMovimiento) return;

        var inicio = Date.now();
        var intervalo = setInterval(function () {
            var s = Math.floor((Date.now() - inicio) / 1000);
            var min = String(Math.floor(s / 60)).padStart(2, '0');
            var seg = String(s % 60).padStart(2, '0');
            var fot = String(Math.floor(Math.random() * 25)).padStart(2, '0');
            osd.textContent = '00:' + min + ':' + seg + ':' + fot;
        }, 120);

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) clearInterval(intervalo);
        });
    }

    /* ------------------------------------------
       11. GLITCH AUTOMÁTICO en títulos de sección
       ------------------------------------------ */
    function initGlitchAuto() {
        if (sinMovimiento) return;
        var titulos = document.querySelectorAll('.titulo-seccion[data-glitch]');
        if (!titulos.length) return;

        var indice = 0;
        setInterval(function () {
            var el = titulos[indice % titulos.length];
            indice++;
            if (!el.isConnected) return;
            el.classList.add('glitch-activo');
            setTimeout(function () { el.classList.remove('glitch-activo'); }, 350);
        }, 2600);
    }

    /* ------------------------------------------
       12. FAQ ACORDEÓN
       ------------------------------------------ */
    function initFaq() {
        var preguntas = document.querySelectorAll('.faq-question');
        if (!preguntas.length) return;

        Array.prototype.forEach.call(preguntas, function (boton) {
            boton.addEventListener('click', function () {
                var item = boton.closest('.faq-item');
                var respuesta = item.querySelector('.faq-answer');
                var estabaAbierto = item.classList.contains('abierto');

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

        var temporizador;
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
       13. FILTROS DE PROYECTOS
       ------------------------------------------ */
    function initFiltros() {
        var botones = document.querySelectorAll('.btn-filtro');
        if (!botones.length) return;

        var secciones = document.querySelectorAll('.seccion-proyectos');

        Array.prototype.forEach.call(botones, function (boton) {
            boton.addEventListener('click', function () {
                var categoria = boton.dataset.filtro;

                Array.prototype.forEach.call(botones, function (b) {
                    b.setAttribute('aria-pressed', String(b === boton));
                });

                Array.prototype.forEach.call(secciones, function (seccion) {
                    var coincide = categoria === 'todos' || seccion.dataset.categoria === categoria;
                    seccion.hidden = !coincide;
                });
            });
        });
    }

    /* ------------------------------------------
       14. MODAL DE VIDEO
       ------------------------------------------ */
    function initModalVideo() {
        var modal = document.getElementById('videoModal');
        if (!modal) return;

        var contenido = modal.querySelector('.modal-content');
        var iframe = modal.querySelector('iframe');
        var botonCerrar = modal.querySelector('.cerrar-modal');
        var ultimoFoco = null;

        function abrir(tarjeta) {
            var id = tarjeta.dataset.video;
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
            // about:blank en vez de cadena vacía: '' recarga la propia página dentro del iframe en algunos navegadores
            iframe.src = 'about:blank';
            if (ultimoFoco) {
                ultimoFoco.focus();
                ultimoFoco = null;
            }
        }

        document.querySelectorAll('.video-card').forEach(function (tarjeta) {
            tarjeta.addEventListener('click', function () { abrir(tarjeta); });
        });

        botonCerrar.addEventListener('click', cerrar);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) cerrar();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('activo')) cerrar();
        });
    }

    /* ------------------------------------------
       15. PARALLAX SUAVE EN STICKERS
       ------------------------------------------ */
    function initParallaxStickers() {
        if (sinMovimiento) return;
        var stickers = document.querySelectorAll('.hero-decor .sticker');
        if (!stickers.length) return;

        var ticking = false;
        function actualizar() {
            var y = window.scrollY;
            Array.prototype.forEach.call(stickers, function (s, i) {
                var factor = (i % 2 === 0) ? 0.06 : -0.05;
                s.style.translate = '0 ' + (y * factor) + 'px';
            });
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(actualizar);
                ticking = true;
            }
        }, { passive: true });
    }

    /* ------------------------------------------
       16. AÑO DINÁMICO
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
        initTimelineScroll();
        initRansom();
        initKinetico();
        initScrollReveal();
        initBarrasHabilidades();
        initContadores();
        initLeader();
        initVhsOsd();
        initGlitchAuto();
        initFaq();
        initFiltros();
        initModalVideo();
        initParallaxStickers();
        initAnio();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
