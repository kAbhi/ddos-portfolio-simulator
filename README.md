# Live DDoS Attack & Defense Playground

An interactive, visual web-traffic simulator built with **Next.js 16 (App Router)**, **strict TypeScript**, **Tailwind CSS v4**, and a **60fps HTML5 `<canvas>`** animation engine[cite: 19].

**Live Demo:** [https://ddos-portfolio-simulator.vercel.app/](https://ddos-portfolio-simulator.vercel.app/)

Designed to be **immediately fun and understandable for recruiters and non-technical visitors** (using everyday storefront analogies), while still powered by **real queuing theory and senior-level frontend engineering** under the hood[cite: 19].

---

## Try the 3 Built-In Missions
1. **Black Friday Rush:** Thousands of real shoppers arrive at once—scale up your servers without accidentally blocking real customers[cite: 19].
2. **Bot Army Attack:** 35,000 fake bots spam your pages—combine **Fast-Lane Cache (CDN)** + **Are You Human? (JS Check)** to survive[cite: 19].
3. **Sneaky Table Hoggers (Slowloris):** Bots quietly hold open connections without doing much work—use **Kick Idle Bots & Add Servers** to clear the jam[cite: 19].

---

## Under the Hood

### Dual-Loop Client-Side Engine
- **250ms Deterministic Simulation Loop:** Pure TypeScript engine (`src/lib/simulationEngine.ts`) computes traffic absorption, CPU load, socket pool saturation, auto-scaling warm-up ticks, and non-linear p99 latency[cite: 19].
- **60fps HTML5 Canvas Renderer:** Reads telemetry snapshots via a mutable `useRef` so hundreds of traffic particles animate smoothly at 60fps with zero React re-render overhead[cite: 19].

### Queuing Theory Model ($L = \lambda W$)
Page load time scales non-linearly as server utilization ($\rho$) approaches 100%, modeled via an $M/M/c$ queuing approximation[cite: 19]:

$$W_{\text{p99}} = W_{\text{base}} + \frac{W_{\text{service}}}{1 - \min(\rho, 0.985)} + W_{\text{challenge}}$$

---

## Author
**Abhishek Sharma**[cite: 19]
- GitHub: [https://github.com/kAbhi](https://github.com/kAbhi)[cite: 19]
- LinkedIn: [https://www.linkedin.com/in/abhishek-sharma-surat/](https://www.linkedin.com/in/abhishek-sharma-surat/)[cite: 19]