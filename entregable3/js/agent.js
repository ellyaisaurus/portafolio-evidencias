/* js/agent.js - VERSION OPTIMIZADA Y COMPLETA */

const GROQ_API_KEY = "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";
const AI_MODEL = "groq/compound"; // Modelo más estable y potente

// --- CONTEXTO EMPRESARIAL COMPLETO ---
const BUSINESS_CONTEXT = `
IDENTIDAD: Eres ELIAN, el asistente de ventas, soporte y consultoría de "¡QUÉ BOTÓN!".

MISIÓN:
1. Educar a prospectos sobre chatbots IA y su valor comercial
2. Guiar hacia la compra detectando señales de interés
3. Resolver dudas técnicas con profundidad
4. Escalar casos complejos a especialistas humanos cuando sea necesario

SITIO WEB - PÁGINAS DISPONIBLES:
- inicio.html: Página principal, propuesta de valor, socios tecnológicos (Microsoft, Oracle, Salesforce, HubSpot)
- soluciones.html: Casos de uso verticales (E-commerce, Salud, Inmobiliario, Banca), capacidades técnicas (NLP, Omnicanalidad, Sentiment Analysis)
- tecnologia.html: Stack técnico (Vue.js 3, Node.js, WebSockets), integración en 2 minutos, script de 14kb
- planes.html: Planes predefinidos (Starter $49, Business $199, Enterprise Custom) y cotizador interactivo a medida

PLANES Y PRECIOS:
1. STARTER KIT - $49/mes
   - 1,000 mensajes/mes
   - Chatbot basado en reglas (sin IA generativa)
   - Widget web personalizable
   - Ideal para: Landing pages, sitios informativos pequeños

2. BUSINESS AI - $199/mes ⭐ RECOMENDADO
   - 10,000 mensajes/mes
   - GPT-4 Turbo integrado
   - Conexión a base de datos
   - Dashboard de analítica
   - Ideal para: E-commerce, SaaS, servicios profesionales

3. ENTERPRISE - Precio Custom
   - Mensajes ilimitados
   - Entrenamiento en servidor privado
   - SLA 99.99% garantizado
   - Account Manager dedicado
   - Ideal para: Corporativos, bancos, clínicas con HIPAA

COTIZADOR A MEDIDA (planes.html):
- Modelos IA: Reglas ($29 base), NLP ($79 base), GPT-4 ($149 base)
- Costo por volumen: $5 USD por cada 1,000 mensajes adicionales
- Integraciones extras:
  * WhatsApp: +$50/mes
  * Instagram DM: +$30/mes
  * CRM Sync (Salesforce/HubSpot): +$40/mes

CAPACIDADES TÉCNICAS:
- NLP Avanzado: Entiende regionalismos, errores ortográficos, contexto complejo
- Omnicanalidad: Web, WhatsApp, Instagram, Telegram, Facebook Messenger
- Sentiment Analysis: Detecta frustración y escala a humano automáticamente
- Integraciones: Salesforce, HubSpot, SAP, Oracle, APIs REST/GraphQL
- Voz a texto: Transcripción y procesamiento de notas de voz
- Dashboard en vivo: Métricas CSAT, retención, volumen en tiempo real

TECNOLOGÍA:
- Widget ligero de 14kb
- Vue.js 3 con reactividad nativa
- Backend Node.js (10k req/s)
- WebSockets seguros (WSS://)
- Edge caching en 140 ciudades
- Latencia <120ms de respuesta
- Cumplimiento GDPR/CCPA
- Encriptación end-to-end
- Datos nunca entrenan modelos públicos

CASOS DE USO EXITOSOS:
1. E-commerce: Personal shopper 24/7, +35% ticket promedio, -60% devoluciones
2. Salud: Triaje clínico, agendamiento inteligente, recordatorios post-consulta
3. Inmobiliario: Calificación de leads (presupuesto, zona, crédito), filtro Hot Leads
4. Banca: Soporte L1 (bloqueo tarjetas, consultas saldo), detección de fraude

PARTNERS TECNOLÓGICOS:
- Microsoft (Azure Cloud)
- Oracle (Database)
- Salesforce (CRM Integration)
- HubSpot (Marketing Automation)

PROCESO DE IMPLEMENTACIÓN:
1. Ingeniería de Prompt: Análisis de FAQs, manuales, tono de marca (1-2 días)
2. Conexión de APIs: Integración segura con BD/CRM (2-3 días)
3. Despliegue & Tuning: Lanzamiento controlado, ajustes semanales (ongoing)
4. Implementación total: Menos de 24 horas para despliegue inicial
`;

// --- SISTEMA DE COMANDOS ---
const COMMANDS_GUIDE = `
COMANDOS DISPONIBLES (usa para ejecutar acciones):

NAVEGACIÓN:
{{CMD:NAV|inicio.html}} - Ir a página principal
{{CMD:NAV|soluciones.html}} - Ver casos de uso
{{CMD:NAV|tecnologia.html}} - Detalles técnicos
{{CMD:NAV|planes.html}} - Ver planes y cotizador

COMPRA DIRECTA:
{{CMD:ADD|STARTER}} - Añadir plan Starter al carrito
{{CMD:ADD|BUSINESS}} - Añadir plan Business al carrito

COTIZADOR:
{{CMD:FILL_QUOTE|{"model":"gpt4","volume":5000}}} - Pre-llenar cotizador personalizado
Modelos válidos: "reglas", "nlp", "gpt4"
Volumen: número de mensajes/mes

ACCIONES ESPECIALES:
{{CMD:ACTION|OPEN_CART}} - Abrir carrito de compras
{{CMD:ACTION|OPEN_DOSSIER}} - Abrir formulario de soporte especializado

CUÁNDO USAR CADA COMANDO:
- Usuario dice "quiero comprar Business" → {{CMD:ADD|BUSINESS}}
- Usuario pregunta "cuánto cuesta para 5000 mensajes con GPT-4" → {{CMD:FILL_QUOTE|{"model":"gpt4","volume":5000}}}
- Usuario dice "necesito hablar con un experto" → {{CMD:ACTION|OPEN_DOSSIER}}
- Usuario dice "quiero cotizar un plan enterprise o tengo x/y requerimientos" → {{CMD:ACTION|OPEN_DOSSIER}}
- Usuario dice "muéstrame los planes" → {{CMD:NAV|planes.html}}
- Usuario pregunta "cómo funciona técnicamente" → {{CMD:NAV|tecnologia.html}}
- Usuario pregunta "qué casos de éxito tienen" → {{CMD:NAV|soluciones.html}}
- Usuario pregunta "quiénes son sus partners" → {{CMD:NAV|inicio.html}}
- Usuario dice "cómo lo integro" → {{CMD:NAV|tecnologia.html}}
- Usuario pregunta "cuánto tarda la implementación" → Responder "menos de 24 horas" + {{CMD:NAV|tecnologia.html}}
- Usuario pregunta por industria específica (salud, banca, etc) → {{CMD:NAV|soluciones.html}}
`;

// --- PROMPT DEL SISTEMA OPTIMIZADO ---
const SYSTEM_PROMPT = `
${BUSINESS_CONTEXT}

${COMMANDS_GUIDE}

PERSONALIDAD Y ESTILO:
- Tono profesional pero accesible, como un consultor senior
- Respuestas ULTRA BREVES: máximo 2-3 oraciones cortas
- Usa emojis estratégicamente (✅ ⚡ 🚀 💡) para destacar beneficios
- Sé proactivo: Si detectas interés de compra, ofrece añadir al carrito INMEDIATAMENTE
- Si detectas dudas técnicas complejas, ofrece el formulario de dossier

REGLA DE ORO - BREVEDAD EXTREMA:
- Responde SOLO lo necesario, nada más
- Si la pregunta es simple, respuesta de 1 línea + comando
- Si requiere explicación, máximo 2 oraciones + comando
- NO repitas información innecesaria
- Ve DIRECTO al punto, sin preámbulos

REGLAS DE DETECCIÓN DE INTENCIONES:

1. COMPRA DIRECTA:
   - Palabras clave: "quiero comprar", "necesito el plan", "me interesa", "cómo adquirir"
   - Acción: Confirmar precio + {{CMD:ADD|PLAN}}

2. COTIZACIÓN PERSONALIZADA:
   - Palabras clave: "cuánto cuesta", "precio para X mensajes", "necesito más volumen"
   - Acción: Si da números → {{CMD:FILL_QUOTE|...}} con cálculo breve
   - Si no da números → Recomendar Business + {{CMD:NAV|planes.html}}

3. CONSULTA TÉCNICA SIMPLE:
   - Palabras clave: "cómo funciona", "cómo se integra", "es compatible"
   - Acción: Respuesta de 1 línea + {{CMD:NAV|tecnologia.html}}

4. CONSULTA TÉCNICA COMPLEJA:
   - Palabras clave: "integración con mi sistema", "cumplimiento legal", "migración de datos", "SLA", "HIPAA", "servidor privado"
   - Acción: "Requiere Enterprise personalizado" + {{CMD:ACTION|OPEN_DOSSIER}}

5. EXPLORACIÓN GENERAL:
   - Palabras clave: "qué incluye", "casos de uso", "para qué sirve"
   - Acción: 1 oración explicativa + {{CMD:NAV|pagina.html}}

6. COMPARACIÓN DE PLANES:
   - Acción: Diferencia clave en 1 línea + recomendar Business + {{CMD:NAV|planes.html}}

EJEMPLOS DE RESPUESTAS CORRECTAS (BREVES):

Usuario: "Cuánto cuesta para un e-commerce con 8000 mensajes al mes"
Elian: "Business AI $199/mes incluye 10k mensajes con GPT-4 y conecta con tu catálogo ⚡ {{CMD:NAV|planes.html}}"

Usuario: "Quiero el plan Business"
Elian: "¡Perfecto! Business AI $199/mes con GPT-4 y 10k mensajes. ¿Lo añado? {{CMD:ADD|BUSINESS}}"

Usuario: "Necesito migrar 500k registros de clientes y cumplir GDPR"
Elian: "Eso requiere Enterprise con servidor privado y certificación GDPR. Te conecto con un especialista 🚀 {{CMD:ACTION|OPEN_DOSSIER}}"

Usuario: "Cómo se integra en mi sitio"
Elian: "Copias un script de 14KB en tu HTML y listo. Funciona en cualquier plataforma 💡 {{CMD:NAV|tecnologia.html}}"

Usuario: "Qué incluye el plan Business"
Elian: "10k mensajes/mes, GPT-4 Turbo, conexión a BD y analytics por $199. {{CMD:NAV|planes.html}}"

Usuario: "Diferencia entre Starter y Business"
Elian: "Starter usa reglas simples ($49), Business tiene GPT-4 que entiende contexto ($199). Te recomiendo Business ⭐ {{CMD:NAV|planes.html}}"

Usuario: "Tienen casos de éxito"
Elian: "Sí, en E-commerce (+35% ventas), Salud, Banca e Inmobiliario. {{CMD:NAV|soluciones.html}}"

Usuario: "Cuánto tarda la implementación"
Elian: "Menos de 24 horas. Nosotros configuramos todo ⚡ {{CMD:NAV|tecnologia.html}}"

Usuario: "Funciona en WhatsApp"
Elian: "Sí, integración WhatsApp Business API por +$50/mes. {{CMD:NAV|planes.html}}"

Usuario: "Cuánto para 15000 mensajes con GPT-4"
Elian: "Business $199 + $25 extra = $224/mes. {{CMD:FILL_QUOTE|{"model":"gpt4","volume":15000}}}"

Usuario: "Necesito hablar con alguien"
Elian: "Te conecto con un especialista 🚀 {{CMD:ACTION|OPEN_DOSSIER}}"

Usuario: "Es seguro"
Elian: "Sí, encriptación end-to-end, cumplimiento GDPR/CCPA y datos privados. {{CMD:NAV|tecnologia.html}}"

Usuario: "Qué tan rápido responde"
Elian: "Latencia <120ms, imperceptible para el usuario ⚡"

Usuario: "Funciona para restaurantes"
Elian: "Sí, automatiza reservas y pedidos 24/7. {{CMD:NAV|soluciones.html}}"

PROHIBICIONES ESTRICTAS:
❌ Nunca inventes precios o funcionalidades
❌ No des explicaciones largas (máximo 3 oraciones)
❌ No repitas información ya mencionada
❌ No uses frases de relleno como "déjame explicarte", "por supuesto"
❌ No prometas integraciones sin confirmar
❌ No uses comandos incorrectos o inventados
❌ NO uses bloques de código formateados (triple backtick)
❌ NO formatees respuestas como terminal o código de programación

✅ SIEMPRE termina con un comando de acción
✅ Responde SOLO lo que preguntan
✅ Sé directo y conciso
✅ Ofrece siguiente paso claro
✅ Incita al usuario a interactuar con la página completa, pues hay integraciones de utilidad.

MANEJO DE ERRORES:
- Si no sabes algo: "Un especialista puede ayudarte con eso. {{CMD:ACTION|OPEN_DOSSIER}}"
- Si detectas frustración: "Te conecto directo con un experto. {{CMD:ACTION|OPEN_DOSSIER}}"

CIERRE DE VENTAS:
- Detecta interés de compra y ofrece {{CMD:ADD|PLAN}} inmediatamente
- Usa prueba social: "Más de 500 empresas confían en nosotros"
- Destaca velocidad: "Implementación en <24 horas"
- Siempre da siguiente paso concreto

TÉCNICAS DE PERSUASIÓN (úsalas naturalmente):
🚀 Velocidad: "Menos de 24 horas"
💰 ROI: "+35% en ventas promedio"
⚡ Facilidad: "Script de 14KB, instalación en 2 minutos"
✅ Prueba social: "Más de 500 empresas"
⭐ Popularidad: "Plan más elegido"

MANEJO DE OBJECIONES (respuestas breves):

Usuario: "Es caro"
Elian: "Business AI automatiza trabajo de 2 personas 24/7, se paga solo en 1 mes. {{CMD:NAV|planes.html}}"

Usuario: "No sé si funciona para mi negocio"
Elian: "Trabajamos con +500 empresas en todas las industrias. {{CMD:NAV|soluciones.html}}"

Usuario: "Es complicado"
Elian: "Instalación en 2 minutos, nosotros te ayudamos gratis ⚡ {{CMD:NAV|tecnologia.html}}"

Usuario: "Necesito pensarlo"
Elian: "¡Claro! Te dejo el cotizador para explorar. {{CMD:NAV|planes.html}}"

RECUERDA: Tu objetivo es que el usuario tome acción (comprar, cotizar o contactar) en máximo 2-3 intercambios. Respuestas BREVES, DIRECTAS y con COMANDO al final.

AUTO-NAVEGACIÓN Y ACCIONES:
- Si el usuario quiere comprar o añadir un plan pero NO estás en planes.html:
  1) Primero navega a planes.html con el comando {{CMD:NAV|planes.html}}
  2) Después ejecuta el comando de carrito correspondiente ({{CMD:ADD|STARTER}} o {{CMD:ADD|BUSINESS}})
- Si el usuario pide ver detalles técnicos y NO estás en tecnologia.html:
  1) Ejecuta {{CMD:NAV|tecnologia.html}} automáticamente
- Si el usuario pide casos de uso o ejemplos por industria y NO estás en soluciones.html:
  1) Ejecuta {{CMD:NAV|soluciones.html}} automáticamente
- Evita decirle al usuario que “el carrito no está disponible en esta página”; en lugar de eso, navega tú mismo a la página correcta y realiza la acción.
- Tus respuestas deben seguir sonando cercanas y personales, usando frases como:
  "Te llevo directo a la sección de planes y te lo dejo listo en el carrito 😉"
  "Ya te moví a la página de tecnología para que veas el detalle técnico ⚙️"
`;

// --- CLASE PRINCIPAL DEL AGENTE ---
class ElianAgent {
    constructor() {
        // Recuperar estado de la ventana (Posición/Tamaño)
        this.windowState = JSON.parse(localStorage.getItem('elian_window_state')) || {
            width: 400,
            height: 600,
            top: null,
            left: null
        };

        

        this.resetHistoryIfCorrupt();
        this.history = JSON.parse(localStorage.getItem('elian_history'));
        this.isOpen = localStorage.getItem('elian_is_open') === 'true';
        this.init();
    }

    resetHistoryIfCorrupt() {
        const saved = localStorage.getItem('elian_history');
        if (!saved) {
            this.history = [{ role: "system", content: SYSTEM_PROMPT }];
            localStorage.setItem('elian_history', JSON.stringify(this.history));
            return;
        }
        // Actualizar prompt del sistema sin borrar el resto de la charla
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
            parsed[0].content = SYSTEM_PROMPT; 
            localStorage.setItem('elian_history', JSON.stringify(parsed));
        }
    }

    init() {
        this.injectInterface();
        setTimeout(() => {
            this.bindEvents();
            this.bindDossierEvents();
            this.bindWindowControls();
            
            if (this.isOpen) {
                this.toggleInterface(true);
            }
            
            this.renderHistory();
        }, 50);
    }

    injectInterface() {
        if (document.getElementById('elian-dock')) return;

        // NOTA: Se agrego 'flex-shrink-0' a los iconos circulares para evitar deformación en móvil
        const html = `
        <div class="elian-dock-wrapper collapsed" id="elian-dock">
            <div class="elian-interface" id="elian-ui">
                
                <!-- TRIGGER (Botón Flotante) CORREGIDO -->
                <div class="elian-trigger-content" id="elian-trigger">
                    <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0" style="width:36px; height:36px;">E</div>
                    <span class="fw-bold text-primary pe-2 text-nowrap">Hablar con Elian</span>
                </div>

                <!-- HEADER (Arrastrable) -->
                <div class="elian-header" id="elian-header-drag">
                    <div class="d-flex align-items-center gap-2" id="header-title-area">
                        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style="width:28px; height:28px;">E</div>
                        <div>
                            <h6 class="mb-0 fw-bold text-primary" style="font-size:0.9rem">Elian AI</h6>
                        </div>
                    </div>
                    
                    <!-- Header Dossier (Oculto por defecto) -->
                    <div class="d-none align-items-center gap-2" id="header-dossier-area">
                        <button class="elian-btn-back" id="btn-back-chat" style="background:none; border:none; color:var(--primary); font-weight:bold;">
                            ← Volver al Chat
                        </button>
                    </div>

                    <div class="d-flex gap-2">
                         <button class="btn btn-sm btn-light text-muted border-0" id="btn-clear" title="Reiniciar Chat">↻</button>
                         <button class="btn btn-sm btn-light text-muted border-0" id="btn-minimize" title="Minimizar">_</button>
                    </div>
                </div>

                <!-- CONTENEDOR DE VISTAS -->
                <div class="elian-view-container">
                    
                    <!-- VISTA 1: CHAT -->
                    <div class="elian-view view-active" id="view-chat">
                        <div class="elian-content" id="elian-messages">
                            <div class="msg msg-elian">
                                ¡Hola! 👋 Soy Elian, tu consultor de IA. <br><br>
                                ¿Buscas automatizar tu negocio, cotizar un plan personalizado o resolver dudas técnicas?
                            </div>
                        </div>
                        <div class="elian-input-area">
                            <input type="text" id="elian-input" class="form-control border-0 bg-light" placeholder="Escribe aquí..." autocomplete="off">
                            <button class="elian-btn-send btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center" id="btn-send" style="width:38px; height:38px;">➤</button>
                        </div>
                    </div>

                    <!-- VISTA 2: DOSSIER (FORMULARIO) -->
                    <div class="elian-view view-hidden-right" id="view-dossier">
                        <div class="dossier-content p-4 h-100 overflow-auto">
                            <h5 class="fw-bold mb-3 text-primary">Abrir Expediente</h5>
                            <p class="text-muted small mb-4">Un especialista revisará tu caso y te contactará en menos de 24h.</p>
                            
                            <form id="elian-dossier-form">
                                <div class="mb-3">
                                    <label class="elian-label small fw-bold text-muted">Nombre Completo</label>
                                    <input type="text" class="elian-form-control form-control" name="name" required placeholder="Tu nombre">
                                </div>
                                <div class="mb-3">
                                    <label class="elian-label small fw-bold text-muted">Correo Corporativo</label>
                                    <input type="email" class="elian-form-control form-control" name="email" required placeholder="nombre@empresa.com">
                                </div>
                                <div class="mb-3">
                                    <label class="elian-label small fw-bold text-muted">Motivo</label>
                                    <select class="elian-form-control form-select" id="dossier-reason" required>
                                        <option value="" selected disabled>Selecciona una opción...</option>
                                        <option value="demo">Solicitar Demo Personalizada</option>
                                        <option value="technical">Soporte Técnico Avanzado</option>
                                        <option value="sales">Hablar con Ventas (Enterprise)</option>
                                        <option value="integration">Consulta de Integración Compleja</option>
                                        <option value="migration">Migración de Datos</option>
                                        <option value="compliance">Cumplimiento Legal (GDPR/HIPAA)</option>
                                        <option value="other">Otro asunto</option>
                                    </select>
                                </div>
                                <div class="mb-3 d-none" id="dossier-other-group">
                                    <label class="elian-label small fw-bold text-muted">Especifique</label>
                                    <textarea class="elian-form-control form-control" name="details" rows="3" placeholder="Cuéntanos más sobre tu proyecto..."></textarea>
                                </div>
                                
                                <button type="submit" class="btn btn-primary w-100 fw-bold mt-2">Enviar Solicitud</button>
                            </form>
                        </div>
                    </div>

                </div>
                
                <!-- Resize Handle -->
                <div class="elian-resize-handle" id="elian-resize"></div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
    }

    // --- LÓGICA DE VENTANA (DRAG & RESIZE) ---
    bindWindowControls() {
        const dock = document.getElementById('elian-dock');
        const header = document.getElementById('elian-header-drag');
        const resizer = document.getElementById('elian-resize');

        // UX: Desactivar Drag & Drop en móviles (ancho < 768px)
        if (window.innerWidth < 768) return;

        // Mover Ventana
        let isDragging = false, startX, startY, initialLeft, initialTop;

        header.onmousedown = (e) => {
            if(e.target.closest('button')) return; 
            e.preventDefault();
            isDragging = true;
            
            const rect = dock.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            startX = e.clientX;
            startY = e.clientY;

            dock.style.transform = 'none';
            dock.style.left = `${initialLeft}px`;
            dock.style.top = `${initialTop}px`;
            dock.style.bottom = 'auto';

            document.onmousemove = (evt) => {
                if (!isDragging) return;
                const dx = evt.clientX - startX;
                const dy = evt.clientY - startY;
                dock.style.left = `${initialLeft + dx}px`;
                dock.style.top = `${initialTop + dy}px`;
            };

            document.onmouseup = () => {
                isDragging = false;
                document.onmousemove = null;
                this.saveWindowState();
            };
        };

        // Redimensionar
        let isResizing = false, startW, startH;
        resizer.onmousedown = (e) => {
            e.preventDefault(); e.stopPropagation();
            isResizing = true;
            startW = dock.offsetWidth;
            startH = dock.offsetHeight;
            startX = e.clientX;
            startY = e.clientY;

            document.onmousemove = (evt) => {
                if (!isResizing) return;
                const w = startW + (evt.clientX - startX);
                const h = startH + (evt.clientY - startY);
                if (w > 320) dock.style.width = `${w}px`;
                if (h > 450) dock.style.height = `${h}px`;
            };

            document.onmouseup = () => {
                isResizing = false;
                document.onmousemove = null;
                this.saveWindowState();
            };
        };
    }

    saveWindowState() {
        const dock = document.getElementById('elian-dock');
        if (dock.classList.contains('expanded')) {
            const state = {
                width: dock.offsetWidth,
                height: dock.offsetHeight,
                top: dock.style.top,
                left: dock.style.left
            };
            localStorage.setItem('elian_window_state', JSON.stringify(state));
        }
    }

    applyWindowState() {
        const dock = document.getElementById('elian-dock');
        if (this.windowState.width) dock.style.width = `${this.windowState.width}px`;
        if (this.windowState.height) dock.style.height = `${this.windowState.height}px`;
        
        // RESPONSIVE FIX:
        // Si es Tablet (576-992px) o Móvil (<576px), NO aplicar coordenadas guardadas.
        if (window.innerWidth < 992) {
            dock.style.top = '';
            dock.style.left = '';
            dock.style.transform = '';
            dock.style.width = '';
            dock.style.height = '';
            return; 
        }
        
        if (this.windowState.top && this.windowState.top !== 'auto' && this.windowState.left) {
            dock.style.top = this.windowState.top;
            dock.style.left = this.windowState.left;
            dock.style.bottom = 'auto';
            dock.style.transform = 'none';
        }
    }

    bindEvents() {
        const trigger = document.getElementById('elian-trigger');
        const minBtn = document.getElementById('btn-minimize');
        const clearBtn = document.getElementById('btn-clear');
        const sendBtn = document.getElementById('btn-send');
        const input = document.getElementById('elian-input');

        if (trigger) trigger.onclick = (e) => { e.preventDefault(); e.stopPropagation(); this.toggleInterface(true); };
        if (minBtn) minBtn.onclick = (e) => { e.stopPropagation(); this.toggleInterface(false); };
        
        if (clearBtn) clearBtn.onclick = (e) => {
            e.stopPropagation();
            if(!confirm('¿Reiniciar la conversación? Se perderá el historial.')) return;
            
            this.history = [{ role: "system", content: SYSTEM_PROMPT }];
            localStorage.setItem('elian_history', JSON.stringify(this.history));
            
            const container = document.getElementById('elian-messages');
            container.innerHTML = ''; 
            this.addMessageToUI('elian', "Conversación reiniciada. ¿En qué puedo ayudarte? 🚀");
            
            this.switchView('chat');
        };

        if (sendBtn) sendBtn.onclick = (e) => { e.stopPropagation(); this.handleUserMessage(); };
        if (input) input.onkeypress = (e) => { if (e.key === 'Enter') this.handleUserMessage(); };
    }

    bindDossierEvents() {
        const reasonSelect = document.getElementById('dossier-reason');
        const otherGroup = document.getElementById('dossier-other-group');
        const form = document.getElementById('elian-dossier-form');
        const backBtn = document.getElementById('btn-back-chat');

        if (reasonSelect) {
            reasonSelect.onchange = () => {
                if (reasonSelect.value === 'other') {
                    otherGroup.classList.remove('d-none');
                    otherGroup.querySelector('textarea').required = true;
                } else {
                    otherGroup.classList.add('d-none');
                    otherGroup.querySelector('textarea').required = false;
                }
            };
        }

        if (backBtn) {
            backBtn.onclick = (e) => {
                e.preventDefault();
                this.switchView('chat');
            };
        }

        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                
                btn.disabled = true;
                btn.innerText = "Enviando...";

                // Simular envío (en producción, aquí harías POST a tu backend)
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerText = originalText;
                    form.reset();
                    if(otherGroup) otherGroup.classList.add('d-none');
                    
                    this.switchView('chat');
                    this.addMessageToUI('elian', "✅ <strong>Solicitud recibida correctamente.</strong><br>Un especialista te contactará en menos de 24 horas al correo proporcionado. Gracias por confiar en nosotros 🚀");
                    this.saveHistory('assistant', "El usuario envió el formulario de dossier exitosamente.");
                }, 1500);
            };
        }
    }

    switchView(viewName) {
        const chatView = document.getElementById('view-chat');
        const dossierView = document.getElementById('view-dossier');
        const headerTitle = document.getElementById('header-title-area');
        const headerBack = document.getElementById('header-dossier-area');

        if (viewName === 'dossier') {
            chatView.classList.remove('view-active');
            chatView.classList.add('view-hidden-left');
            
            dossierView.classList.remove('view-hidden-right');
            dossierView.classList.add('view-active');

            headerTitle.classList.remove('d-flex');
            headerTitle.classList.add('d-none');
            headerBack.classList.remove('d-none');
            headerBack.classList.add('d-flex');
        } else {
            dossierView.classList.remove('view-active');
            dossierView.classList.add('view-hidden-right');
            
            chatView.classList.remove('view-hidden-left');
            chatView.classList.add('view-active');

            headerBack.classList.remove('d-flex');
            headerBack.classList.add('d-none');
            headerTitle.classList.remove('d-none');
            headerTitle.classList.add('d-flex');
        }
    }

    toggleInterface(open) {
        const dock = document.getElementById('elian-dock');
        if (!dock) return;

        if (open) {
            dock.classList.remove('collapsed');
            dock.classList.add('expanded');
            this.isOpen = true;
            localStorage.setItem('elian_is_open', 'true');
            this.applyWindowState();
            setTimeout(() => {
                this.scrollToBottom();
                document.getElementById('elian-input')?.focus();
            }, 300);
        } else {
            dock.classList.remove('expanded');
            dock.classList.add('collapsed');
            this.isOpen = false;
            localStorage.setItem('elian_is_open', 'false');
            
            dock.style.top = ''; 
            dock.style.left = '';
            dock.style.width = '';
            dock.style.height = '';
            dock.style.transform = '';
        }
    }

    async handleUserMessage(overrideText = null) {
        const input = document.getElementById('elian-input');
        const text = overrideText || input.value.trim();
        if (!text) return;

        input.value = '';
        this.addMessageToUI('user', text);
        this.saveHistory('user', text);

        this.addMessageToUI('elian', '<span class="typing-dots">Pensando...</span>', 'temp-typing');

        try {
            const rawResponse = await this.fetchGroqCompletion(text);
            const temp = document.getElementById('temp-typing');
            if(temp) temp.remove();

            const processed = this.processResponse(rawResponse);
            
            // Si el LLM devolvió texto visible, mostrarlo
            if(processed.cleanText) {
                this.addMessageToUI('elian', processed.cleanText);
            }
            
            // Si devolvió opciones visuales (retrocompatibilidad)
            if (processed.options.length > 0) this.renderOptions(processed.options);

            this.saveHistory('assistant', rawResponse);
            this.executeCommands(processed.commands);

        } catch (error) {
            console.error("Error en fetchGroqCompletion:", error);
            const temp = document.getElementById('temp-typing');
            if(temp) temp.remove();
            this.addMessageToUI('elian', "⚠️ Error de conexión con el modelo de IA. Por favor intenta nuevamente o abre un expediente para soporte humano.");
        }
    }

    processResponse(rawText) {
        let cleanText = rawText;
        const commands = [];
        const options = [];

        // 1. FORMATO ESTRICTO: {{CMD:TIPO|VALOR}}
        const strictRegex = /{{CMD:(.*?)\|(.*?)}}/g;
        let match;
        while ((match = strictRegex.exec(rawText)) !== null) {
            commands.push({ type: match[1], value: match[2] });
            cleanText = cleanText.replace(match[0], ''); 
        }

        // 2. FORMATO "ROTO" O "ALUCINADO" (SOLUCIÓN CRÍTICA PARA TU ERROR)
        // Busca patrones como CMDNAV|..., CMD:NAV|..., CMDACTION|...
        const brokenRegex = /CMD(NAV|ACTION|ADD|FILL_QUOTE):?\|([^\s\n<.,]+)/g;
        while ((match = brokenRegex.exec(cleanText)) !== null) {
            console.warn("⚠️ Detectado formato roto de comando, corrigiendo:", match[0]);
            commands.push({ type: match[1], value: match[2] });
            cleanText = cleanText.replace(match[0], '');
        }

        // 3. Extraer Opciones {{OPT:Label|Val}} (Retrocompatibilidad)
        const optRegex = /{{OPT:(.*?)\|(.*?)}}/g;
        while ((match = optRegex.exec(cleanText)) !== null) {
            options.push({ label: match[1], value: match[2] });
            cleanText = cleanText.replace(match[0], '');
        }

        // 4. Extraer Comandos legacy {{NAV:...}} 
        const legacyRegex = /{{(NAV|ADD|ACTION):(.*?)}}/g;
        while ((match = legacyRegex.exec(cleanText)) !== null) {
            commands.push({ type: match[1], value: match[2] });
            cleanText = cleanText.replace(match[0], ''); 
        }

        return { cleanText: cleanText.trim(), commands, options };
    }

    executeCommands(commands) {
        commands.forEach(cmd => {
            console.log("🔧 Ejecutando comando:", cmd);

            if (cmd.type === 'NAV') {
                // LOGICA MOVIL AÑADIDA: Si es móvil, cerrar interfaz antes de irse
                if (window.innerWidth < 992) {
                    this.toggleInterface(false);
                }
                setTimeout(() => { window.location.href = cmd.value; }, 800);
            }
            else if (cmd.type === 'ADD' || cmd.type === 'ADD_CART') {
                this.triggerAddToCart(cmd.value);
            }
            else if (cmd.type === 'ACTION') {
                if (cmd.value === 'OPEN_CART') {
                    const btn = document.querySelector('[data-bs-target="#offcanvasCart"]');
                    if(btn) btn.click();
                    else console.warn("⚠️ Botón de carrito no encontrado en DOM");
                } 
                else if (cmd.value === 'OPEN_DOSSIER' || cmd.value === 'OPENDOSSIER') {
                    setTimeout(() => this.switchView('dossier'), 600);
                }
            }
            else if (cmd.type === 'FILL_QUOTE') {
                 if (window.location.href.includes('planes.html')) {
                    try {
                        const data = JSON.parse(cmd.value);
                        console.log("📊 Llenando cotizador:", data);
                        
                        const modelEl = document.querySelector(`input[name="botModel"][value="${data.model}"]`);
                        if(modelEl) {
                            modelEl.checked = true;
                            modelEl.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        
                        const volEl = document.getElementById('volumenRange');
                        if(volEl) {
                            volEl.value = data.volume;
                            volEl.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        
                        setTimeout(() => {
                            document.getElementById('cotizador-section')?.scrollIntoView({ behavior: 'smooth' });
                        }, 500);
                        
                    } catch(e) {
                        console.error("Error parseando FILL_QUOTE:", e);
                    }
                 } else {
                     localStorage.setItem('pending_quote', cmd.value);
                     setTimeout(() => {
                         window.location.href = 'planes.html#cotizador-section';
                     }, 1000);
                 }
            }
        });
    }

    triggerAddToCart(productId) {
        if (typeof window.addToCart !== 'function') {
            console.warn("⚠️ Función addToCart no disponible en window");
            this.addMessageToUI('elian', "⚠️ <em>El sistema de carrito no está disponible en esta página. Navega a planes.html para añadir productos.</em>");
            return;
        }
        
        let product = null;
        if (productId === 'STARTER') {
            product = { name: 'Starter Kit', price: 49, details: 'Plan Starter - 1,000 mensajes/mes' };
        }
        else if (productId === 'BUSINESS') {
            product = { name: 'Business AI', price: 199, details: 'Plan Business - 10,000 mensajes/mes con GPT-4' };
        }
        
        if (product) {
            window.addToCart('static', product.name, product.price, product.details);
            this.addMessageToUI('elian', `✅ <strong>${product.name}</strong> añadido al carrito correctamente.`);
        } else {
            console.error("❌ Product ID inválido:", productId);
        }
    }

    renderOptions(options) {
        const container = document.getElementById('elian-messages');
        const btnContainer = document.createElement('div');
        btnContainer.className = 'elian-options-container';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'elian-option-btn';
            btn.innerText = opt.label;
            btn.onclick = () => {
                if (opt.value.includes('.html')) {
                    // LOGICA MOVIL AÑADIDA: Cerrar antes de navegar
                    if (window.innerWidth < 992) {
                        this.toggleInterface(false);
                    }
                    window.location.href = opt.value;
                }
                else this.handleUserMessage(opt.label);
            };
            btnContainer.appendChild(btn);
        });
        container.lastElementChild.appendChild(btnContainer);
        this.scrollToBottom();
    }

    async fetchGroqCompletion(userText) {
        const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${GROQ_API_KEY}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: AI_MODEL,
                messages: this.history,
                temperature: 0.4, // Balance entre creatividad y consistencia
                max_tokens: 400, // Aumentado para respuestas más completas
                top_p: 0.9,
                frequency_penalty: 0.3, // Reduce repeticiones
                presence_penalty: 0.2 // Fomenta variedad temática
            })
        });
        
        if (!resp.ok) {
            throw new Error(`Groq API Error: ${resp.status} ${resp.statusText}`);
        }
        
        const data = await resp.json();
        
        if (!data.choices || !data.choices[0]) {
            throw new Error("Respuesta de Groq vacía o malformada");
        }
        
        return data.choices[0].message.content;
    }

    addMessageToUI(role, text, id = null) {
        const container = document.getElementById('elian-messages');
        const div = document.createElement('div');
        div.className = `msg msg-${role}`;
        if(id) div.id = id;
        
        // CORRECCIÓN NEGRITAS: Renderizar markdown ANTES de reemplazar newlines
        // y usar Regex más robusto para saltos de linea internos
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italic*
            .replace(/\n/g, '<br>'); // saltos de línea
        
        div.innerHTML = formattedText;
        container.appendChild(div);
        this.scrollToBottom();
    }

    saveHistory(role, content) {
        const sys = this.history[0]; // Mantener system prompt
        const rest = this.history.slice(1);
        
        // Ventana deslizante de 16 mensajes (8 pares user-assistant)
        if (rest.length > 16) {
            this.history = [sys, ...rest.slice(-15)];
        }
        
        this.history.push({ role, content });
        localStorage.setItem('elian_history', JSON.stringify(this.history));
    }

    renderHistory() {
        const container = document.getElementById('elian-messages');
        if (this.history.length <= 1) return; 
        
        container.innerHTML = ''; 
        this.history.forEach(msg => {
            if (msg.role === 'system') return;
            
            // Procesar para quitar comandos ocultos del historial visual
            const processed = this.processResponse(msg.content);
            if(processed.cleanText) {
                this.addMessageToUI(msg.role === 'user' ? 'user' : 'elian', processed.cleanText);
            }
        });
        
        setTimeout(() => this.scrollToBottom(), 100);
    }

    scrollToBottom() {
        const container = document.getElementById('elian-messages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }
}


// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    window.elian = new ElianAgent();
    
    // Chequear si hay cotización pendiente desde otra página
    const pending = localStorage.getItem('pending_quote');
    if(pending && window.location.href.includes('planes.html')) {
        console.log("📋 Detectada cotización pendiente:", pending);
        setTimeout(() => {
            window.elian.executeCommands([{type: 'FILL_QUOTE', value: pending}]);
            localStorage.removeItem('pending_quote');
        }, 1200);
    }
});