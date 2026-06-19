/* DESIGN SYSTEM & VARIABLES */
:root {
  --bg-dark: #09090e;
  --bg-surface: rgba(255, 255, 255, 0.03);
  --accent-glow: #6366f1; /* Vibrant Indigo */
  --text-primary: #f3f4f6;
  --text-secondary: #9ca3af;
  --border-color: rgba(255, 255, 255, 0.08);
  --transition-smooth: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* GLOBAL RESETS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-dark);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  padding: 6rem 2rem;
}

/* HERO SECTION */
.hero {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 6rem auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -0.05em;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #ffffff, var(--text-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  color: var(--text-secondary);
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

/* INTERACTIVE MAGNET BUTTON */
.btn-interactive {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.9rem 2.2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.btn-interactive:hover {
  border-color: var(--accent-glow);
  box-shadow: 0 0 25px rgba(99, 102, 241, 0.45);
  transform: scale(1.03);
  background-color: rgba(99, 102, 241, 0.05);
}

/* RESPONSIVE LAYOUT GRID */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

/* GLASSMORPHISM CARD */
.project-card {
  background: var(--bg-surface);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2.5rem;
  position: relative;
  transition: var(--transition-smooth);
  
  /* Initial hidden states for the JS reveal scroll engine */
  opacity: 0;
  transform: translateY(40px);
}

.project-card:hover {
  transform: translateY(-8px) scale(1.01);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.15);
}

.card-badge {
  display: inline-block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent-glow);
  margin-bottom: 1.25rem;
  font-weight: 600;
}

.project-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.85rem;
  letter-spacing: -0.02em;
}

.project-card p {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.tech-stack {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tech-tag {
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  color: var(--text-secondary);
  border: 1px solid rgba(255, 255, 255, 0.03);
}

/* CLASS TOGGLED BY INTERSECTION OBSERVER */
.project-card.reveal {
  opacity: 1;
  transform: translateY(0);
}
