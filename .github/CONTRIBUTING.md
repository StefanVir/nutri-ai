# Contributing to NutriAI

Thank you for your interest in contributing to NutriAI!

## 🛠️ Development Workflow

1. **Fork & Clone:**
   ```bash
   git clone https://github.com/StefanVir/nutri-ai.git
   cd nutri-ai
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Verify Types & Build before Submitting:**
   ```bash
   npm run build
   ```

## 📋 Code Conventions

- **Strict TypeScript:** No `any` where specific interfaces can be defined.
- **Design Consistency:** Follow the Obsidian Athletic Dark design system tokens in `src/styles/tokens.css`.
- **Zero AI-Slop:** Keep UI copy direct, clear, and functional.
- **Commit Messages:** Follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
