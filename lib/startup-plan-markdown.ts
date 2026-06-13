import type { OrchestratorOutput } from "./orchestrator.ts";

function renderList(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
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
${renderList(results.content.blogIdeas)}

### LinkedIn Posts
${renderList(results.content.linkedinPosts)}

### Twitter Posts
${renderList(results.content.twitterPosts)}

### Newsletter Topics
${renderList(results.content.newsletterTopics)}

### YouTube Ideas
${renderList(results.content.youtubeIdeas)}

## Development Results
### Hero Headline
${results.development.heroHeadline}

### Hero Subheading
${results.development.heroSubheading}

### Features
${renderList(results.development.features)}

### CTA
${results.development.cta}

### Pricing Section
${results.development.pricingSection}

### Tech Stack
${renderList(results.development.techStack)}

### MVP Features
${renderList(results.development.mvpFeatures)}

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
