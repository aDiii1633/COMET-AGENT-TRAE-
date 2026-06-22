# Comet Agent - Development & AI Agent Log

This log documents the design, architecture, and development process of **Comet Agent**, an AI-powered workforce platform built to assist solo founders in launching their ventures. It highlights the collaborative development workflow between the human engineer and the AI Agent.

---

## 1. Project Overview

**Comet Agent** is an automated, multi-agent AI workforce dashboard designed specifically for founders. Instead of managing siloed AI conversations, Comet Agent acts as a central orchestrator that coordinates a squad of specialized virtual specialists:

*   **Research Agent:** Analyzes category signals, buyer demands, and identifies market opportunities.
*   **Strategy Agent:** Converts raw insights into target ICP positioning and 30-day priorities.
*   **Content Agent:** Crafts landing page narratives, messaging systems, and social assets.
*   **Development Agent:** Scopes MVP architecture, slices features, and lays out dev milestones.
*   **Pitch Agent:** Structures traction, market proof, and investor slides into a cohesive narrative.

---

## 2. AI Assistant & Tools Utilized

The application was built leveraging advanced AI programming agents to accelerate design, frontend development, and backend logic.

### AI Capabilities Used:
1. **Glassmorphism & Premium UI/UX Styling:** Used modern styling guidelines (Tailwind CSS, clean HSL palettes, smooth micro-animations, and glassmorphic panels) to elevate the visual hierarchy of the platform.
2. **State Management & UI Synchronization:** Built an interactive playground and orchestrator switch logic using React state, providing step-by-step loading animations to mimic asynchronous agent runs.
3. **API Integration & Prompt Engineering:** Configured dynamic backend APIs using `next/server` calling the Gemini API to orchestrate actual text outputs for different agents, while maintaining static fallback data.

---

## 3. High-Level Agent Prompts Used

Below are the key prompts and instructions provided to the AI Agent during development:

### Prompt 1: UI Restructuring & App Shell Alignment
> *"Reorganize the main page layout to use a premium dashboard design. Implement a persistent sidebar listing all five agents (Research, Strategy, Content, Development, Pitch) alongside their current status (Queued, Running, or Completed). Create a top header that contains a Mode Switcher allowing the user to seamlessly toggle between the 'Business Orchestrator' mode and the 'Agent Playground' mode."*

### Prompt 2: Orchestration Page & Status Animations
> *"Refine the 'Business Orchestrator' page. It should feature a clean input textarea for the startup prompt, along with checkboxes for selecting which agents to run. When the user clicks 'Run Squad', trigger an animated workflow that sequences through the selected agents one-by-one, updating their sidebar status indicator (loading spinner to checkmark), and call the Gemini API endpoint to retrieve the structured output cards."*

### Prompt 3: Playground Interaction
> *"Build an 'Agent Playground' view. When in playground mode, clicking an agent on the sidebar should display a custom terminal-like playground for that specific agent. The user should be able to prompt that agent individually and see its dedicated output, streaming text, or options."*

### Prompt 4: Production-Ready Linting & Next.js Best Practices
> *"Inspect the codebase for any TS/ESLint warnings. Fix any unsafe types, unused imports, or incorrect Lucide icon usages. Ensure that the app compiles cleanly, ready for Vercel deployment."*

---

## 4. Technical Architecture

*   **Framework:** Next.js (App Router), React, TypeScript.
*   **Styling:** Tailwind CSS with a curated slate & sky HSL color scheme.
*   **Icons:** Lucide React for consistent visual metaphors.
*   **Deployment:** Vercel for continuous integration and serverless function deployment.
