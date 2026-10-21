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
│   ├── services/
│   │   ├── BoardMovementService.ts       # Algoritmo BFS puro con poda de colisiones y MP
│   │   ├── SurroundService.ts            # Detección de Rodeo (Fuinjutsu KO) y buffer de prisión
│   │   ├── CombatResolver.ts             # Jerarquía de colores y resolución Mew-style
│   │   └── AiTacticalEngine.ts           # IA Akatsuki heurística
│   └── repositories/
│       └── IShinobiRepository.ts         # Contrato desacoplado para fuentes de datos
│
├── infrastructure/                       # Implementaciones concretas de I/O y datos
│   ├── repositories/
│   │   └── MockShinobiRepository.ts      # Repositorio mock (8 ninjas y pergaminos)
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

## 🎯 Reglas Resumidas del Juego

1. **Objetivo**: Llevar a cualquiera de tus figuras shinobi a la **Meta enemiga** o sellar a todas las figuras rivales en la prisión.
2. **Entrada al Tablero**: Las figuras se despliegan desde el banquillo a través de los puntos de entrada (*Spawn Nodes*). Si el rival bloquea tus dos entradas, no podrás desplegar más refuerzos.
3. **Turno 1 Handicap**: El jugador que inicia la partida tiene una penalización de `-1 MP` en su primer movimiento para balancear la ventaja de salida.
4. **Combate**: Cuando dos figuras enemigas quedan adyacentes, pueden batallar girando sus ruletas de chakra.
5. **Rodeo de Sellado**: Rodear todos los nodos adyacentes de un ninja enemigo lo envía directamente a la prisión sin librar combate.
6. **Prisión**: Capacidad máxima de 2 figuras por bando. Al entrar una tercera figura, la que más tiempo lleva encarcelada es liberada automáticamente al banquillo (FIFO).

---

## 📄 Licencia

Este proyecto está disponible bajo la licencia MIT.
