# 忍 Especificación Técnica Canónica — Shinobi Duel (React Clean Architecture & DDD)

Este documento constituye la especificación de ingeniería de software, arquitectura matemática, diseño guiado por el dominio (DDD) y auditoría de reglas canónicas para **Shinobi Duel**, una adaptación táctica de alta fidelidad de *Pokémon Duel* (*Pokémon Comaster* / *Very Good Games* / *HEROZ*) ambientada en el universo de *Naruto*.

---

## 1. Auditoría Canónica y Matriz de Discrepancias Resueltas

Tras la auditoría de manuales técnicos y bases de datos oficiales de figuras (*Very Good Games / The Pokémon Company*), se han erradicado las simplificaciones comunes, restaurando el balance y las fórmulas canónicas del motor original:

| Subsistema de Reglas | Error Común / Borrador Previo | Regla Canónica Pokémon Duel / Shinobi Duel Implementada |
| :--- | :--- | :--- |
| **Distribución de Colores** | Figuras generalistas con porcentajes de todos los colores. | **Especialización Asimétrica Pura:** Ninguna figura contiene los 5 colores. Se aplican restricciones canónicas (p. ej., Rock Lee tiene $0\%$ Morado y $0\%$ Azul; Gaara tiene $0\%$ Dorado; Minato tiene $0\%$ Morado). |
| **Métrica del Disco** | Base porcentual arbitraria (100 puntos). | **Invariante Angulado de 96 Segmentos ($\sum_{i=1}^k S_i = 96$):** A Nivel 1, la circunferencia se subdivide de manera exacta en 96 unidades discretas. |
| **Subida de Nivel (Lv. 1 a 5)** | Aumento porcentual global o genérico. | **Transferencia Unitaria ($\Delta = \text{Lv} - 1$):** Se añaden hasta $+4$ segmentos al sector no-Rojo objetivo a expensas directas de decrementar el Fallo Rojo ($S_{\text{red}} \ge 4$). |
| **Nivel de Cadena (CLv 0 a 10)** | Daño extra general o porcentual. | **Desempate Quirúrgico Unitario ($+1\text{ a }+10\text{ DMG}$):** Puntos individuales asignados a un ataque Blanco o Dorado específico para resolver choques de idéntico valor base ($101\text{ vs } 100$). |
| **Quemadura (`burned`)** | Penalización genérica de $-20\text{ DMG}$. | **Regla Canónica Oficial:** $-10\text{ DMG}$ a todos los ataques físicos/dorados y transformación del sector de menor tamaño no-Rojo en **Fallo Rojo**. (El decremento de $-20$ queda reservado para *Veneno*). |
| **Parálisis (`paralyzed`)** | Pérdida estática de turno. | **Mutación de Sector Menor:** Transforma el sector no-Rojo de menor tamaño en **Fallo Rojo** sin alterar el daño numérico. |
| **Sellado / Congelado / Sueño** | Inmovilización genérica. | **Fallo Absoluto ($100\%$ Rojo):** La unidad no actúa y, al ser atacada, toda su ruleta muta a **Fallo Rojo**. Se revierte mediante toque de asistencia (*tagging*) al desplazar un aliado a un nodo adyacente. |
| **Evolución / Despertar UX** | Activación tras cualquier victoria. | **Condición Canónica:** Se dispara exclusivamente al **noquear a un rival o desplazarlo de su nodo con un Jutsu Morado**, otorgando $+10\text{ DMG}$ a ataques físicos/dorados y $+1\star$ a Jutsus Morados. |
| **Prisión Fuinjutsu** | Muerte permanente o descarte simple. | **Cola FIFO de Capacidad 2:** Al ingresar una 3.ª figura noqueda, la más antigua es liberada al banquillo con condición de **Espera 2** (`wait = 2`). |
| **Restricción Primer Turno** | Movimiento estándar. | **Handicap Inicial Canónico:** La figura desplegada por el Jugador 1 en el turno 1 sufre una penalización temporal de $-1\text{ MP}$ ($\text{MP}_{\text{eff}} = \max(1, \text{MP}_{\text{base}} - 1)$). |

---

## 2. Diagrama de Clean Architecture (Inversión de Dependencias)

El sistema obedece a una separación concéntrica y estricta en 4 capas. El núcleo algorítmico y matemático (Dominio) no contiene dependencias de infraestructura ni bibliotecas externas (React, Web Audio o DOM).

```
+---------------------------------------------------------------------------------------+
| 🎨 CAPA 4: PRESENTATION LAYER (React UI, Coordenadas SVG, Paneles Makimono)           |
|    - ChuninArenaSVG (Renderizado del grafo interactivo multicapa de 28 nodos)         |
|    - ChakraDiskSVG (Geometría polar SVG de arcos de 96 segmentos)                     |
|    - ChakraDuelModal (Cinemática visual, giros desacelerados y re-giro Sharingan)     |
|    - BingoInspectorScroll (Auditoría visual de sectores, forja Lv/CLv y mazos)       |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
| ⚙️ CAPA 3: APPLICATION LAYER (Casos de Uso, FSM e Inmutabilidad)                       |
|    - gameReducer (Reductor puro de transiciones y máquina de estados finita)          |
|    - useShinobiDuel (Hook de orquestación, temporizadores de IA y ciclo de vida)     |
|    - Decisiones de IA Táctica Akatsuki (Orquestación del turno del bot)               |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
| 🧠 CAPA 2: DOMAIN LAYER (Entidades y Servicios Puros — Cero Dependencias de Framework) |
|    - ShinobiFigure (Modelo canónico de 96 segmentos, Lv 1-5, CLv 0-10 y mutaciones)   |
|    - BoardGraph (Topología $G=(V, E)$ de 28 nodos, BFS y reglas de colisión)          |
|    - CombatResolver (Matriz de resolución de jerarquía de colores y choques Mew)      |
|    - SurroundService (Detección de Rodeo Fuinjutsu y buffer FIFO de 2 plazas)         |
|    - AiTacticalEngine (Función de utilidad multiobjetivo para el árbol de juego)      |
+---------------------------------------------------------------------------------------+
                                           ^
                                           |
+---------------------------------------------------------------------------------------+
| 🏛️ CAPA 1: INFRASTRUCTURE LAYER (Adaptadores Aislados de Plataforma)                  |
|    - ShinobiAudioEngine (Síntesis procedural Web Audio API sin ficheros estáticos)    |
|    - animeAssets (Resolución resiliente CDN con fallback determinista en SVG Data URI)|
+---------------------------------------------------------------------------------------+
```

---

## 3. Dominio Matemático y Estructuras de Datos

### 3.1. Formalización de la Ruleta Canónica de 96 Segmentos

El disco de datos de cada figura se modela como un conjunto ordenado de $k$ sectores circulares contiguos:

$$\mathcal{W} = \{S_1, S_2, \dots, S_k\}$$

donde cada sector $S_i$ queda definido por la tupla:

$$S_i = \langle \text{name}_i, \, \text{color}_i, \, P_i, \, \text{Stars}_i, \, \text{size}_i, \, \text{effect}_i \rangle$$

con las siguientes restricciones de dominio:
* $\text{color}_i \in \{\text{white}, \text{gold}, \text{purple}, \text{blue}, \text{red}\}$
* $P_i \in \mathbb{N}_0$ (Daño numérico, aplicable exclusivamente a `white` y `gold`)
* $\text{Stars}_i \in \{0, 1, 2, 3\}$ (Rango estelar, aplicable exclusivamente a `purple`)
* **Invariante Fundamental de la Ruleta:**
  $$\sum_{i=1}^{k} \text{size}_i = 96, \quad \forall \, \text{size}_i \in \mathbb{N}_{\ge 4}$$

#### Conversión a Coordenadas Polares y Renderizado SVG
Para cada sector $S_i$, el ángulo central subtendido $\theta_i$ y su arco acumulado $[\alpha_i, \beta_i]$ se computan como:

$$\theta_i = \left( \frac{\text{size}_i}{96} \right) \cdot 360^\circ$$

$$\alpha_i = \sum_{j=1}^{i-1} \theta_j, \quad \beta_i = \alpha_i + \theta_i, \quad \text{con } \alpha_1 = 0^\circ$$

Las coordenadas cartesianas de los vértices del arco en un plano de radio $R$ y centro $(C_x, C_y)$ son:

$$\mathbf{p}_{\text{start}} = \left( C_x + R \cos\left(\frac{\beta_i - 90^\circ}{180^\circ} \pi\right), \; C_y + R \sin\left(\frac{\beta_i - 90^\circ}{180^\circ} \pi\right) \right)$$

$$\mathbf{p}_{\text{end}} = \left( C_x + R \cos\left(\frac{\alpha_i - 90^\circ}{180^\circ} \pi\right), \; C_y + R \sin\left(\frac{\alpha_i - 90^\circ}{180^\circ} \pi\right) \right)$$

El comando SVG generado es:
$$\text{path } d = \text{M } C_x, C_y \;\; \text{L } \mathbf{p}_{\text{end}}.x, \mathbf{p}_{\text{end}}.y \;\; \text{A } R, R \;\; 0, \mathbb{I}(\theta_i > 180^\circ), 0 \;\; \mathbf{p}_{\text{start}}.x, \mathbf{p}_{\text{start}}.y \;\; \text{Z}$$

#### Fórmulas de Progresión (Leveling y Chain Level)
1. **Nivel ($\text{Lv} \in [1, 5]$):** La subida de nivel transfiere $\Delta_{\text{Lv}} = \text{Lv} - 1$ segmentos desde el sector de Fallo Rojo ($S_{\text{red}}$) hacia el sector objetivo ($S_{\text{target}}$):
   $$S'_{\text{red}} = \max\left(4, \, S_{\text{red}} - (\text{Lv} - 1)\right)$$
   $$S'_{\text{target}} = S_{\text{target}} + (S_{\text{red}} - S'_{\text{red}})$$
   $$\sum_{i=1}^k S'_i = 96 \quad (\text{Invariante preservado})$$

2. **Nivel de Cadena ($\text{CLv} \in [0, 10]$) y Evolución ($\text{Evo}$):**
   $$P'_i = P_i + \mathbb{I}(i = \text{clvTarget}) \cdot \text{CLv} + \mathbb{I}(\text{evolved}) \cdot 10$$
   $$\text{Stars}'_i = \text{Stars}_i + \mathbb{I}(\text{evolved}) \cdot 1$$

---

### 3.2. Catálogo Canónico de Arquetipos Asimétricos

Cada figura encarna un arquetipo puro sin mezcla uniforme de colores:

```
[Minato Namikaze - EX]   Dorado: 48/96 (50%) | Blanco: 24/96 (25%) | Azul: 20/96 (20.8%) | Rojo: 4/96 (4.2%)
                         * 0% MORADO * -> Especialista anti-Jutsu y corredor de 3 MP (Estilo Mew).

[Rock Lee - R]           Blanco: 48/96 (50%) | Dorado: 28/96 (29.2%) | Rojo: 20/96 (20.8%)
                         * 0% MORADO y 0% AZUL * -> Taijutsu puro de impacto (110/140 DMG) con Espera por desgaste.

[Itachi Uchiha - EX]     Morado: 60/96 (62.5%) | Blanco: 16/96 (16.7%) | Azul: 12/96 (12.5%) | Rojo: 8/96 (8.3%)
                         * 0% DORADO * -> Controlador Genjutsu de estado y K.O. directo (Tsukuyomi ★★★).

[Gaara - EX]             Azul: 36/96 (37.5%) | Blanco: 32/96 (33.3%) | Morado: 16/96 (16.7%) | Rojo: 12/96 (12.5%)
                         * 0% DORADO * -> Tanque de 1 MP inmune a Rodeo y bloqueador de paso.

[Naruto Uzumaki - EX]    Blanco: 60/96 (62.5%) | Dorado: 24/96 (25%) | Rojo: 12/96 (12.5%)
                         * 0% AZUL y 0% MORADO * -> Atacante frontal de alto daño bruto (130/90 DMG).

[Sasuke Uchiha - EX]     Blanco: 56/96 (58.3%) | Morado: 24/96 (25%) | Dorado: 8/96 (8.3%) | Rojo: 8/96 (8.3%)
                         * 0% AZUL * -> Asesino táctico mixto (140 Kirin / Chidori parálisis).
```

---

### 3.3. Álgebra de Mutación por Estados Alterados (`getComputedFigureSegments`)

Cuando una unidad sufre un estado alterado, su disco base $\mathcal{W}$ experimenta una transformación funcional pura:

$$\mathcal{T}_{\text{status}}(\mathcal{W}) \to \mathcal{W}'$$

1. **Quemadura (`burned`):**
   * Reduce el daño de todos los ataques Blancos y Dorados en $-10\text{ DMG}$:
     $$P'_i = \max(0, P_i - 10), \quad \forall i \text{ tal que } \text{color}_i \in \{\text{white}, \text{gold}\}$$
   * Localiza el sector no-Rojo de menor tamaño:
     $$m = \arg\min_{i} \{ \text{size}_i \mid \text{color}_i \neq \text{red} \}$$
   * Muta dicho sector a Fallo Rojo:
     $$\text{color}'_m = \text{red}, \quad P'_m = 0, \quad \text{Stars}'_m = 0, \quad \text{name}'_m = \text{name}_m + \text{ " (Quemado)"}$$

2. **Parálisis (`paralyzed`):**
   * Preserva el daño numérico ($P'_i = P_i$).
   * Transforma el sector no-Rojo de menor tamaño $m$ a Fallo Rojo:
     $$\text{color}'_m = \text{red}, \quad P'_m = 0, \quad \text{Stars}'_m = 0$$

3. **Confusión (`confused`):**
   * La estructura de sectores permanece inalterada, pero la función de puntero angular tras el giro añade un desfase canónico de $+1$ sector en sentido horario:
     $$\text{selectedSegmentIndex} = (\text{landedIndex} + 1) \pmod k$$

4. **Sellado de Arena / Congelado (`frozen`):**
   * Convierte la totalidad del disco en un único sector de fallo absoluto de 96 segmentos:
     $$\mathcal{W}' = \left\{ \langle \text{"Sellado en Arena"}, \, \text{red}, \, 0, \, 0, \, 96, \, \text{null} \rangle \right\}$$
   * La unidad no puede declarar movimientos ni combates. Si un aliado llega a un nodo adyacente $\text{Adj}(u.\text{nodeId})$, se activa la acción de toque (*tagging*) que restablece $\mathcal{W}' = \mathcal{W}$.

---

### 3.4. Topología del Tablero y Algoritmo de Trayectoria BFS

El tablero táctico se modela como un grafo no dirigido:

$$G = (V, E), \quad |V| = 28, \quad |E| = 38$$

```
   (0: Entry P2) ----- (1) ----- [2: Base P2] ----- (3) ----- (4: Entry P2)
        |               |              |              |               |
       (5)             (18) -------- (19) -------- (20)              (9)
        |               |              |              |               |
       (6) ----------- (21)                         (23) ---------- (10)
        |               |      [PATIO SAGRADO]        |               |
       (7) ----------- (22)                         (24) ---------- (11)
        |               |              |              |               |
       (8)             (25) -------- (26) -------- (27)             (12)
        |               |              |              |               |
  (13: Entry P1) ---- (14) ----- [15: Base P1] ---- (16) ---- (17: Entry P1)
```

#### Nodos Notables
* **Bases / Metas Hokage ($V_{\text{goal}}$):** Nodo `#2` (Akatsuki / J2) y Nodo `#15` (Konoha / J1).
* **Puntos de Infiltración ($V_{\text{entry}}$):** Nodos `#0`, `#4` (J2) y `#13`, `#17` (J1).
* **Anillo Exterior Perimetral:** Nodos `0` al `17`.
* **Anillo Interior Táctico:** Nodos `18` al `27`.

#### Algoritmo Breadth-First Search (BFS) con Poda y Colisión
Dado un ninja $u$, su posición de origen $v_0$, y sus puntos de movimiento efectivos:

$$\text{MP}_{\text{eff}} = \max\left(1, \, u.\text{baseMp} - \mathbb{I}(\text{turn} = 1 \land u.\text{owner} = 1)\right) + \mathbb{I}(u.\text{baseMp} \le 2) \cdot \text{buff}_{\text{mp}}$$

El conjunto de nodos alcanzables $\mathcal{R}(u)$ se obtiene mediante exploración en anchura con vector de costo óptimo acumulado $\mathbf{D}$:

```
Entrada: Unidad u, Grafo G, Figuras en campo F, MP_eff
Salida: Mapa de rutas alcanzables R: nodeId -> Ruta

1. Inicializar cola Q <- [], Mapa R <- {}, Diccionario de poda visitBest <- {}
2. Si u.location == 'bench':
     Para cada entryNode en V_entry(u.owner):
       Si entryNode no está ocupado en F:
         R[entryNode] <- [entryNode]
         Si MP_eff - 1 > 0:
           Q.push({ node: entryNode, remSteps: MP_eff - 1, path: [entryNode] })
           visitBest[entryNode] <- MP_eff - 1
3. Si u.location == 'board':
     Q.push({ node: u.nodeId, remSteps: MP_eff, path: [u.nodeId] })
     visitBest[u.nodeId] <- MP_eff

4. Mientras Q no esté vacía:
     Extraer { currNode, remSteps, path } <- Q.pop()
     Si remSteps == 0: continuar

     Para cada neighbor en Adj(currNode):
       occ <- obtenerFiguraEn(F, neighbor)
       
       # Regla de Colisión y Salto Espacial
       Si occ != null:
         Si !(u.canPassThrough == true Y occ.blocksPassThrough == false):
           continuar # Bloqueo de paso infranqueable

       nuevoRem <- remSteps - 1
       Si visitBest[neighbor] != undefined Y visitBest[neighbor] >= nuevoRem:
         continuar # Poda de camino subóptimo
       
       visitBest[neighbor] <- nuevoRem
       nuevoPath <- path + [neighbor]

       # Solo se puede aterrizar en un nodo si está desocupado
       Si occ == null:
         R[neighbor] <- nuevoPath

       Si nuevoRem > 0:
         Q.push({ node: neighbor, remSteps: nuevoRem, path: nuevoPath })

5. Retornar R
```

---

### 3.5. Servicio de Rodeo (Surround K.O.) y Buffer FIFO de Prisión

Tras la resolución de cualquier desplazamiento, recolocación o empuje, se evalúa la invariante de rodeo para cada unidad $w$ desplegada sobre el tablero:

$$\text{Surrounded}(w) \iff \neg w.\text{immuneToSurround} \;\land\; \forall v \in \text{Adj}(w.\text{nodeId}), \; \exists z \in V_{\text{board}} \text{ tal que } z.\text{nodeId} = v \land z.\text{owner} \neq w.\text{owner}$$

#### Buffer FIFO de Prisión Fuinjutsu
La prisión de cada jugador $\mathcal{Q}_{\text{ko}}[\text{owner}]$ posee una capacidad estricta de $C = 2$:

1. Al ser rodeado o derrotado, $w$ se transfiere a la prisión:
   $$w.\text{location} \leftarrow \text{'ko'}, \quad w.\text{nodeId} \leftarrow \text{null}, \quad w.\text{wait} \leftarrow 0$$
   $$\mathcal{Q}_{\text{ko}}[w.\text{owner}].\text{push}(w.\text{id})$$

2. Si $|\mathcal{Q}_{\text{ko}}[w.\text{owner}]| > 2$:
   $$u_{\text{released}} \leftarrow \mathcal{Q}_{\text{ko}}[w.\text{owner}].\text{shift}()$$
   $$u_{\text{released}}.\text{location} \leftarrow \text{'bench'}, \quad u_{\text{released}}.\text{wait} \leftarrow 2$$

---

### 3.6. Motor de Resolución de Combate (`CombatResolver`)

El enfrentamiento entre un sector atacante $A$ y un sector defensor $D$ se evalúa según el orden jerárquico canónico:

```
                      +-------------------+
                      |   AZUL (Esquiva)  | ---> Invalida cualquier ataque rival.
                      +-------------------+
                                |
                                v
        +-----------------------------------------------+
        | DORADO (Prioridad) vs MORADO (Jutsu Estelar) | ---> Dorado destruye a Morado.
        +-----------------------------------------------+
                                |
                                v
        +-----------------------------------------------+
        | MORADO (Jutsu Estelar) vs BLANCO (Físico)     | ---> Morado gana sin importar daño.
        +-----------------------------------------------+
                                |
                                v
        +-----------------------------------------------+
        | BLANCO/DORADO vs BLANCO/DORADO                | ---> Comparación de Daño (P_A vs P_D).
        +-----------------------------------------------+
                                |
                                v
                      +-------------------+
                      |   ROJO (Fallo)    | ---> Pierde contra cualquier color.
                      +-------------------+
```

#### Regla Canónica de Supervivencia Estilo Mew
Si Minato Namikaze gira su sector *Hiraishin no Jutsu* (`effect: 'survive_100_plus'`, $50\text{ DMG}$ Dorado) frente a un ataque físico o dorado donde el rival obtiene $P_{\text{rival}} \ge 100\text{ DMG}$:
$$\text{Resultado} = \text{Supervivencia Neutralizada} \implies \text{Ninguna unidad es noqueada}$$

---

### 3.7. Motor Heurístico de IA Akatsuki (`AiTacticalEngine`)

La IA evalúa el espacio de decisiones en cada turno seleccionando la tupla óptima $(\text{figura } u^*, \text{nodo } v^*)$:

$$(u^*, v^*) = \arg\max_{u \in \text{Figures}_{P2}, \, v \in \mathcal{R}(u)} U(u, v)$$

La función de evaluación multicriterio $U(u, v)$ pondera el balance táctico:

$$U(u, v) = \omega_1 \cdot \mathbb{I}(v = 15) + \omega_2 \cdot \Phi_{\text{def}}(v) + \omega_3 \cdot \Phi_{\text{surround}}(u, v) - \omega_4 \cdot \Phi_{\text{trap}}(u, v) + \omega_5 \cdot \Phi_{\text{infil}}(v) + \omega_6 \cdot (12 - d_{\text{BFS}}(v, 15)) + \epsilon$$

**Pesos Calibrados:**
* $\omega_1 = 10000$ (Victoria instantánea en el Monumento Hokage, nodo `#15`).
* $\omega_2 = 720$ (Defensa crítica de la Base Akatsuki `#2` si existe amenaza en $d_{\text{BFS}} \le 2$).
* $\omega_3 = 920$ (Ejecución de Rodeo Fuinjutsu contra un rival).
* $\omega_4 = 1050$ (Penalización severa si el nodo $v$ causa que la unidad quede rodeada).
* $\omega_5 = 210$ (Bloqueo de esquinas de infiltración `#13` y `#17`).
* $\omega_6 = 20$ (Gradiente de atracción hacia el objetivo enemigo).
* $\epsilon \sim \mathcal{U}(0, 10)$ (Factor estocástico para romper simetrías de evaluación).

---

## 4. Arquitectura de la Aplicación y Máquina de Estados (FSM)

El reductor inmutable (`gameReducer.js`) gestiona formalmente las transiciones del grafo de estados del juego:

$$\Sigma = \langle \mathcal{S}, \, \mathcal{A}, \, \delta \rangle$$

* **Conjunto de Estados $\mathcal{S}$:**
  $$\mathcal{S} = \{ \text{SELECT}, \, \text{SWAP\_1}, \, \text{SWAP\_2}, \, \text{GOAL\_BLOCK}, \, \text{HEAL}, \, \text{REVIVE}, \, \text{POST\_MOVE}, \, \text{BATTLE}, \, \text{GAMEOVER} \}$$

```
                           +--------------------------+
                           |          SELECT          |<-------------------------------+
                           +--------------------------+                                |
                             |            |          |                                 |
         (Activa Goal Block) |            |          | (Desplaza Unidad a v)           |
                             v            |          v                                 |
                  +--------------------+  |   +-------------------+                    |
                  | GOAL_BLOCK_SELECT  |  |   |     POST_MOVE     |                    |
                  +--------------------+  |   +-------------------+                    |
                             |            |     |        |                             |
      (Teletransporta a Base)|            |     |        | (Finaliza Turno)            |
                             v            |     |        +---------------------------->|
                        [FIN TURNO]       |     | (Selecciona Rival Adyacente)         |
                                          |     v                                      |
                                          |   +-------------------+                    |
                                          +-->|      BATTLE       |                    |
                                              +-------------------+                    |
                                                |        |                             |
                       (Re-giro Sharingan)      |        | (Confirmación de Resultado) |
                               +----------------+        v                             |
                               |                   [RESOLVE_DUEL]                      |
                               v                         |                             |
                        (Nuevo Spin)                     +-----------------------------+
                                                         | (Captura de Base #2 o #15)
                                                         v
                                              +-------------------+
                                              |     GAMEOVER      |
                                              +-------------------+
```

---

## 5. Implementación de Infraestructura y Resiliencia Visual

### 5.1. Audio Procedural sin Dependencias (`ShinobiAudioEngine.js`)
Para evitar fallos de CORS, latencia de red o descargas bloqueadas en entornos corporativos, todos los efectos sonoros son sintetizados en tiempo real mediante la **Web Audio API** nativa:

```
[Pulso Kunai]     Oscilador Triangular (680 Hz -> 1240 Hz en 60 ms) + Rampa exponencial de ganancia.
[Golpe Taiko]     Oscilador Senoidal grave (135 Hz -> 45 Hz en 240 ms) con decaimiento de percusión.
[Giro de Chakra]  Ráfaga modulada en frecuencia (320 Hz + 35*i Hz en trenes de onda cuadrada de 40 ms).
[Sello Fuinjutsu] Onda Diente de Sierra descendente (98 Hz -> 32 Hz en 480 ms) simulando impacto sordo.
[Fanfarria Hokage]Arpegio polifónico armónico en La Mayor (440 Hz, 554.37 Hz, 659.25 Hz, 880 Hz).
```

### 5.2. Diccionario de Resiliencia Visual SVG (Zero Broken Images)
Cada retrato y técnica dispone de una clave en `animeAssets.js`. Si la petición HTTP a la CDN de retratos oficiales (`MyAnimeList / Jikan`) es interceptada o el cliente opera *offline*, el componente conmuta de inmediato vía `onError` a un vector determinista empotrado en formato `data:image/svg+xml;utf8`, garantizando que la interfaz no exhiba cajas vacías ni artefactos visuales rotos.

---

## 6. Verificación de Integridad y Cobertura de Requisitos

* [x] **Invariante Angular:** $\sum_{i=1}^k S_i = 96$ estrictamente respetado en las 8 figuras y validado durante la subida de nivel.
* [x] **Asimetría de Colores:** Rock Lee ($0\%$ Morado, $0\%$ Azul), Minato ($0\%$ Morado), Gaara ($0\%$ Dorado), Naruto ($0\%$ Azul, $0\%$ Morado), Sasuke ($0\%$ Azul), Itachi ($0\%$ Dorado).
* [x] **Penalizaciones Canónicas:** Quemadura penaliza con $-10\text{ DMG}$ y transforma el sector de menor tamaño en Fallo Rojo.
* [x] **Capacidad de Mazo:** Capacidad de 6 figuras y límite de 6 puntos de coste para pergaminos tácticos (*Goal Block* $= 2$, *Max Revive* $= 2$, *Plates menores* $= 1$).
* [x] **Clean Architecture:** Capa de Dominio desacoplada de React y ejecutable en entornos puros de Node.js o CLI.