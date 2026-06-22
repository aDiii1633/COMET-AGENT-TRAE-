import type { OrchestratorOutput } from "./orchestrator.ts";

function renderList(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function renderContentList(items: Array<{ content: string }>) {
  return renderList(items.map((item) => item.content));
}

function renderTechStack(
  items: Array<{ name: string; category: string; url?: string }>
) {
  return renderList(items.map((item) => `${item.name} (${item.category})`));
}

function renderFeatureList(
  items: Array<{ name: string; description: string }>
) {
  return renderList(items.map((item) => `${item.name}: ${item.description}`));
}

function renderTimeline(
  items: Array<{ phase: string; duration: string; goal: string }>
) {
  return renderList(
    items.map((item) => `${item.phase} (${item.duration}): ${item.goal}`)
  );
}

export function buildStartupPlanMarkdown(
  prompt: string,
  results: OrchestratorOutput
) {
  return `# startup-plan

## Prompt
${prompt}

## Research Results
### Competitors
${renderList(results.research.competitors)}

### Target Audience
${renderList(results.research.targetAudience)}

### Market Opportunity
${results.research.marketOpportunity}

### Industry Trends
${renderList(results.research.industryTrends)}

### Challenges
${renderList(results.research.challenges)}

### Recommendations
${renderList(results.research.recommendations)}

## Strategy Results
### Business Name
${results.strategy.businessName}

### Tagline
${results.strategy.tagline}

### USP
${results.strategy.usp}

### Revenue Model
${renderList(results.strategy.revenueModel)}

### Pricing Strategy
${results.strategy.pricingStrategy}

### Growth Strategy
${renderList(results.strategy.growthStrategy)}

### Launch Plan
${renderList(results.strategy.launchPlan)}

## Content Results
### Blog Ideas
${renderContentList(results.content.blogIdeas)}

### LinkedIn Posts
${renderContentList(results.content.linkedinPosts)}

### Twitter Posts
${renderContentList(results.content.twitterPosts)}

### Newsletter Topics
${renderContentList(results.content.newsletterTopics)}

### YouTube Ideas
${renderContentList(results.content.youtubeIdeas)}

## Development Results
### Product Architecture
${results.development.productArchitecture}

### Tech Stack
${renderTechStack(results.development.techStack)}

### MVP Features
${renderFeatureList(results.development.mvpFeatures)}

### Development Timeline
${renderTimeline(results.development.developmentTimeline)}

## Pitch Results
### Problem
${results.pitch.problem}

### Solution
${results.pitch.solution}

### Market
${results.pitch.market}

### Business Model
${results.pitch.businessModel}

### Competitive Advantage
${results.pitch.competitiveAdvantage}

### Future Vision
${results.pitch.futureVision}
`;
}
