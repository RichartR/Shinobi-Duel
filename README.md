# 🥷 Shinobi Duel — Tablero Táctico Ninja

> Juego de tablero táctico ambientado en el universo de Naruto, inspirado en las mecánicas canónicas de *Pokémon Duel*. Desarrollado con **React 18**, **TypeScript**, **Tailwind CSS** y estructurado bajo los principios de **Clean Architecture** y **Domain-Driven Design (DDD)**.

---

## 📜 Características Principales

- **🏛️ Arquitectura Limpia (Clean Architecture)**: Desacoplamiento estricto en 4 capas (`domain`, `infrastructure`, `application`, `presentation`).
- **🗄️ Inversión de Dependencias (Repository Pattern)**: La lógica de figuras y pergaminos depende de `IShinobiRepository`, permitiendo migrar de mocks a base de datos (PostgreSQL, Supabase, Firebase) sin tocar el dominio ni la interfaz.
- **🎡 Ruleta Polar Canónica de 96 Segmentos**: Cada shinobi cuenta con una ruleta SVG de 96 segmentos con jerarquía de colores:
  - 🔵 **Azul**: Esquiva y teletransporte (gana a todos).
  - 🟡 **Oro**: Prioridad sobre técnicas púrpuras.
  - 🟣 **Púrpura**: Jutsus de rango (vence a ataques blancos).
  - ⚪ **Blanco**: Ataque físico numérico.
  - 🔴 **Rojo**: Fallo (*Miss*).
- **⛩️ Forja de Shinobis (Libro Bingo)**:
  - **Niveles 1 al 5**: Expansión de sectores a costa del Fallo rojo (invariante 96 siempre conservada).
  - **Nivel Carmín (CLv 0 al 10)**: Daño adicional (+1 DMG) para desempatar combates.
- **🥋 Mecánica de Rodeo (Fuinjutsu KO)**: Sellado de figuras enemigas al rodear todos sus nodos adyacentes sin necesidad de combate directo.
- **🌀 Prisión de Sellado FIFO**: Buffer canónico de 2 espacios para figuras capturadas.
- **🤖 IA Táctica Akatsuki**: Motor heurístico multi-objetivo para modo solitario contra el bot.
- **🎵 Audio Procedural Web Audio API**: Sonidos sintetizados en tiempo real (tambores Taiko, corte de kunai, acordes de sellos ninja, giro de ruleta).
- **♿ Accesibilidad & Anti-Slop**: Contraste auditado WCAG AA, soporte táctil responsivo y estética inspirada en pergaminos *Washi* y madera lacada.

---

## 🏛️ Estructura del Proyecto (Clean Architecture)

```
src/
├── domain/                               # Lógica pura de negocio (Sin React ni DOM)
│   ├── models/
│   │   ├── ShinobiFigure.ts              # Invariante 96 seg, estados alterados, Leveling & CLv
│   │   ├── BoardGraph.ts                 # Topología del grafo de 28 nodos, 38 aristas y metas
│   │   ├── TacticalScroll.ts             # Pergaminos tácticos (límite canónico de 6 puntos)
│   │   └── BattleResult.ts               # Interfaces y tipos de resolución de combate
│   ├── catalogs/
│   │   ├── ShinobiCatalog.ts             # Catálogo canónico de figuras ninja y ruedas de 96 segmentos
│   │   └── GachaBannersCatalog.ts        # Configuración de pergaminos, tasas y pity
│   ├── services/
│   │   ├── BoardMovementService.ts       # Algoritmo BFS puro con poda de colisiones y MP
│   │   ├── SurroundService.ts            # Detección de Rodeo (Fuinjutsu KO) y buffer de prisión
│   │   ├── CombatResolver.ts             # Jerarquía de colores y resolución Mew-style
│   │   ├── GachaService.ts               # Lógica de invocaciones, tasas y protección Pity
│   │   └── AiTacticalEngine.ts           # IA Akatsuki heurística
│   └── repositories/
│       └── IShinobiRepository.ts         # Contrato desacoplado para fuentes de datos
│
├── infrastructure/                       # Implementaciones concretas de I/O y datos
│   ├── repositories/
│   │   └── SupabaseShinobiRepository.ts  # Repositorio Supabase/Local (perfil, forja, mazos e inventario)
│   ├── audio/
│   │   └── ShinobiAudioEngine.ts         # Sintetizador procedural Web Audio API
│   └── assets/
│       └── animeAssets.ts                # Retratos SVG inline y cinemáticas jutsu
│
├── application/                          # Casos de uso y gestión de estado
│   ├── state/
│   │   ├── gameActions.ts                # Acciones tipadas (Discriminated Unions)
│   │   ├── gameInitialState.ts           # Estado inicial inmutable y mazos
│   │   └── gameReducer.ts                # Máquina de estados finita (FSM) pura
│   └── hooks/
│       └── useShinobiDuel.ts             # Hook orquestador de juego, audio y bot
│
└── presentation/                         # Interfaz gráfica modular y accesible
    ├── components/
    │   ├── menu/MainMenu.tsx             # Selector de modo, guía, catálogo e inspector
    │   ├── guide/ShinobiRulesGuide.tsx   # Guía interactiva de 5 pestañas
    │   ├── codex/ShinobiCodex.tsx        # Libro Bingo: Catálogo, Forja y Constructor de Mazo
    │   ├── board/ChuninArenaSVG.tsx      # Tablero interactivo de examen Chunin
    │   ├── wheel/ChakraDiskSVG.tsx       # Ruleta polar SVG de 96 segmentos
    │   ├── combat/ChakraDuelModal.tsx    # Modal de duelo, tirada y re-giros con Sharingan
    │   ├── scrolls/                      # Barras de mando, dossier e historial
    │   └── modals/                       # Modales de victoria e inspector de arquitectura
    └── styles/
        └── index.css                     # Sistema de diseño Washi y accesibilidad
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- **Node.js** (v18 o superior)
- **npm** o **pnpm**

### Pasos

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/RichartR/Shinobi-Duel.git
   cd Shinobi-Duel
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo local:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

4. Compilar para producción:
   ```bash
   npm run build
   ```

---

---

## 🎯 Manual y Reglamento Canónico del Juego

### 1. 🏆 Objetivo Principal y Condiciones de Victoria
- **Captura de la Base (Goal Win)**:
  - **Jugador 1** gana la partida inmediatamente al pisar la **Base del Rival (Nodo #2)** en el extremo opuesto.
  - **Jugador 2 / Oponente** gana la partida inmediatamente al pisar la **Base del Rival (Nodo #15)** en el extremo opuesto.
  - Ocupar la meta rival otorga la victoria **de forma inmediata**, sin importar la cantidad de figuras restantes en el tablero.
- **Capitulación por Sellado Absoluto**:
  - Si un jugador se queda sin figuras disponibles para actuar en el tablero y en el banquillo (todas atrapadas en la Prisión Fuinjutsu o inmovilizadas sin movimientos válidos), pierde por capitulación táctica.

---

### 2. 👣 Movimiento, Puntos MP, Colisiones y Despliegue
- **Puntos de Movimiento (MP - Movement Points)**:
  - **3 MP (Figuras Ágiles)**: Máxima velocidad (hasta 3 nodos por turno) para capturas rápidas y flanqueos (ej. Rock Lee, Minato).
  - **2 MP (Figuras Balanceadas)**: El estándar competitivo de combate de medio alcance (hasta 2 nodos por turno).
  - **1 MP (Figuras Defensivas)**: Movilidad contenida compensada por inmunidades tácticas o gran resistencia en duelos (ej. Gaara).
- **Despliegue desde el Banquillo**:
  - Las 6 figuras de cada jugador inician fuera del tablero (en el banquillo).
  - Para ingresar al campo de 28 nodos, deben pagar **1 MP** en uno de sus dos puntos de entrada propios:
    - **Jugador 1**: Nodos esquineros inferiores **#13** y **#17**.
    - **Jugador 2**: Nodos esquineros superiores **#0** y **#4**.
  - El MP restante se utiliza para seguir avanzando por el tablero en ese mismo turno (ej. una figura de 3 MP entra por #13 y avanza 2 nodos más).
- **Regla de Bloqueo de Paso (Collisions)**:
  - Las figuras **no pueden saltar ni atravesar aliados ni enemigos**. Un nodo ocupado bloquea la línea de paso.
  - *Excepción*: Figuras con habilidad pasiva de **Traspaso** (*Pass-Through*) pueden saltar por encima de figuras rivales si cuentan con MP para aterrizar en un nodo libre detrás de ellas.
- **Handicap de Turno 1 (-1 MP)**:
  - Para equilibrar la ventaja de la iniciativa de salida, el jugador que abre la partida sufre una penalización de **-1 MP** en su primer movimiento.
- **Bloqueo de Puntos de Entrada (Spawn Lock)**:
  - Si una figura enemiga se detiene sobre tu punto de entrada, este queda bloqueado. Si el rival ocupa tus **dos entradas simultáneamente**, no podrás desplegar refuerzos del banquillo hasta desalojar al menos una de ellas.

---

### 3. 🔄 Flujo del Turno Paso a Paso
1. **Inicio de Turno**: Se reduce en 1 el contador de sellos de **Espera (`Wait`)**. Las figuras con Espera > 0 no pueden actuar.
2. **Pergamino Táctico (Opcional)**: Puedes activar 1 pergamino por turno antes de mover.
3. **Selección y Movimiento**: Seleccionas una figura válida y te desplazas a cualquiera de los nodos resaltados en dorado (calculados mediante BFS puro).
4. **Toque de Asistencia**: Si aterrizas adyacente a un aliado bajo **Congelamiento / Petrificación**, rompes su sello de inmediato.
5. **Evaluación de Rodeo Fuinjutsu**: Si alguna figura queda rodeada en todos sus caminos adyacentes, es noqueada directamente a la prisión.
6. **Duelo Opcional**: Si terminas el movimiento adyacente a un rival, puedes pulsar **⚔️ ATACAR** para entrar en combate o pulsar **"Terminar Turno"** para asegurar tu posición.

---

### 4. ⚔️ Choque de Discos de Chakra: Ruleta de 96 Segmentos y Jerarquía de Colores
Toda figura posee una ruleta polar discretizada en **96 segmentos**. Cuando dos figuras combaten, ambas ruletas giran y se comparan según la jerarquía canónica:
- 🔵 **Azul (Esquiva / Desplazamiento)**: Invalida cualquier ataque rival. Nadie cae noqueado.
- 🟡 **Dorado (Ataque Veloz con Prioridad)**: **Destruye técnicas moradas**. Contra blanco/dorado, gana el de mayor daño (DMG).
- 🟣 **Morado (Técnicas Ninjutsu / Genjutsu Estelar ★)**: **Vence a cualquier Ataque Blanco** sin importar el daño del rival. Entre morados, gana quien tenga más estrellas (★★★ > ★★ > ★). Aplica efectos de estado alterados.
- ⚪ **Blanco (Ataque Físico Directo)**: Choque numérico directo. Mayor daño noquea al menor. Empate numérico = nadie cae.
- 🔴 **Rojo (Fallo / Miss)**: Pierde contra cualquier color.
- **Regla Especial de Supervivencia de Rango S**: Ciertas técnicas especiales con daño moderado sobreviven ante impactos masivos: si el rival ataca con un movimiento físico o dorado de **100 DMG o superior**, la figura esquiva el golpe crítico y no es noqueada.

---

### 5. 🌀 Rodeo de Sellado (Fuinjutsu KO) y Prisión FIFO
- **Rodeo (Surround KO)**: Ocupar todos los caminos conectados a una figura rival la envía directamente a la prisión sin librar combate (*figuras con inmunidad pasiva quedan exentas de esta regla*).
- **Prisión Fuinjutsu FIFO**: Almacena un máximo de 2 figuras por bando. Al entrar una tercera figura, la que más tiempo lleva encarcelada es **liberada automáticamente al banquillo** con un sello de **Espera 2 (Wait 2)**.

---

### 6. ☣️ Estados Alterados y Asistencia
- 炎 **Quemadura (Burn)**: -10 DMG a los ataques físicos/dorados y el sector no-rojo más pequeño muta a Fallo Rojo.
- 痺 **Parálisis (Paralysis)**: El sector no-rojo más pequeño muta a Fallo Rojo (sin penalización de daño).
- 幻 **Confusión (Confusion)**: El resultado de la ruleta se desplaza +1 sector en sentido horario.
- 砂 **Congelamiento / Petrificación (Frozen / Sealed)**: Inmóvil y ruleta 100% Fallo Rojo. Se cura cuando una figura aliada se posiciona en una casilla contigua (**Toque de Asistencia**).

---

### 7. ⛩️ Forja de Ninjas (Nivel 1 al 5 y Carmín CLv)
- **Nivel (Lv 1 al 5)**: Transfiere hasta 4 segmentos de probabilidad desde el Fallo Rojo hacia la técnica deseada (manteniendo el total invariante en 96 y el rojo en mínimo 4 segmentos).
- **Nivel Carmín (CLv 0 al 10)**: Otorga hasta **+10 DMG** (+1 por nivel) a un ataque físico o dorado para desempatar combates de idéntico valor base.

---

### 8. 📜 Pergaminos Tácticos (Plates de 6 Puntos)
- 守 **Goal Block (Coste 2)**: Teletransporta a un aliado del campo a tu Base vacía.
- 蘇 **Max Revive (Coste 2)**: Resucita a un aliado de la prisión al banquillo sin Espera.
- 眼 **Double Chance (Coste 1)**: Permite re-girar la ruleta de chakra en combate.
- 力 **X Attack (Coste 1)**: +30 DMG a todos los ataques físicos y dorados este turno.

---

## 📄 Licencia

Este proyecto está disponible bajo la licencia MIT.

