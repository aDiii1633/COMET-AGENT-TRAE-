import { generateText } from "./gemini.ts";
import type { StrategyAgentOutput } from "./strategy-agent.ts";

export type ContentItem = {
  content: string;
  hashtags: string[];
  engagementScore: number;
  characterCount: number;
  postReelIdea?: string;
  hook?: string;
  cta?: string;
};

export type ContentAgentOutput = {
  blogIdeas: ContentItem[];
  linkedinPosts: ContentItem[];
  twitterPosts: ContentItem[];
  newsletterTopics: ContentItem[];
  instagramIdeas: ContentItem[];
  youtubeIdeas: ContentItem[];
  facebookPosts: ContentItem[];
};

type ContentAgentInput = {
  businessIdea: string;
  strategyOutput: StrategyAgentOutput;
};

const contentAgentSystemPrompt = `You are a world-class content marketer specializing in HIGH TRENDING viral content.

Generate content for these platforms:
- 5 blog ideas
- 5 LinkedIn posts
- 5 Twitter/X posts
- 5 newsletter topics
- 5 Instagram ideas
- 5 YouTube video ideas
- 5 Facebook posts

STRICT REQUIREMENTS - YOU MUST NEVER SKIP ANY OF THESE:
1. Each platform MUST have UNIQUE hashtags. Instagram hashtags must NOT appear in LinkedIn. LinkedIn hashtags must NOT appear in Instagram. Facebook hashtags must be unique from both. Every platform's hashtags should be platform-specific and trending. NEVER SKIP HASHTAGS.
2. Each item MUST include: content (the actual post/caption), hashtags (unique to platform), engagementScore (0-100), characterCount, hook (a trending attention-grabbing opening line), and cta (a clear call to action).
3. For Instagram and YouTube, also include postReelIdea (visual description).
4. NEVER SKIP CAPTIONS (the 'content' field). Ensure every single post has a full, engaging caption written out.
5. NEVER SKIP CTA (the 'cta' field). Every post must tell the user what to do next.
6. DOMAIN SPECIFICITY: You must tailor ALL captions and hashtags directly and specifically to the user's business idea and domain. For example, if the user's input/idea is about a GYM, fitness, personal training, workouts, or wellness, you MUST generate gym-specific captions (focused on workouts, fitness goals, health tips, gym motivation, training routines) and gym-specific hashtags (like #GymMotivation, #FitnessGoals, #WorkoutRoutine, #FitLife, #GymTime, #CrossFit, #Bodybuilding, #FitnessCoach, #GymLife, #HealthJourney, #PersonalTrainer, etc.) for ALL platforms (LinkedIn, X/Twitter, Instagram, Facebook, YouTube, Blog, Newsletter).
7. CONCISENESS: Keep every single caption, hook, CTA, and visual description extremely short, brief, and punchy (1-2 sentences max). Keep hashtags to 2-3 per post. This ensures the output is highly readable and fits within technical limits.

Return JSON only.`;

const emptyContentAgentOutput: ContentAgentOutput = {
  blogIdeas: [],
  linkedinPosts: [],
  twitterPosts: [],
  newsletterTopics: [],
  instagramIdeas: [],
  youtubeIdeas: [],
  facebookPosts: [],
};

function stripCodeFences(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export function parseContentAgentResponse(raw: string): ContentAgentOutput {
  try {
    const normalized = stripCodeFences(raw);
    const parsed = JSON.parse(normalized);

    const ensureContentArray = (arr: unknown) => Array.isArray(arr) ? arr : [];

    return {
      blogIdeas: ensureContentArray(parsed.blogIdeas),
      linkedinPosts: ensureContentArray(parsed.linkedinPosts),
      twitterPosts: ensureContentArray(parsed.twitterPosts),
      newsletterTopics: ensureContentArray(parsed.newsletterTopics),
      instagramIdeas: ensureContentArray(parsed.instagramIdeas),
      youtubeIdeas: ensureContentArray(parsed.youtubeIdeas),
      facebookPosts: ensureContentArray(parsed.facebookPosts),
    };
  } catch (error) {
    console.error("Failed to parse content output:", error);
    return emptyContentAgentOutput;
  }
}

export function createContentAgentPrompt({
  businessIdea,
  strategyOutput,
}: ContentAgentInput) {
  const normalizedIdea = businessIdea.trim();

  if (!normalizedIdea) {
    throw new Error("Business idea is required.");
  }

  return `Business Idea:
${normalizedIdea}

Strategy Output:
${JSON.stringify(strategyOutput, null, 2)}

IMPORTANT: Each platform MUST have completely UNIQUE hashtags. Do NOT reuse any hashtag across platforms.

Return only valid JSON in this exact format, with 5 items in each array:
{
  "blogIdeas": [ { "content": "", "hashtags": ["unique_blog_tag"], "engagementScore": 80, "characterCount": 100, "hook": "Attention grabbing opening", "cta": "Read more..." } ],
  "linkedinPosts": [ { "content": "", "hashtags": ["unique_linkedin_tag"], "engagementScore": 85, "characterCount": 200, "hook": "Professional hook", "cta": "Comment below..." } ],
  "twitterPosts": [ { "content": "", "hashtags": ["unique_twitter_tag"], "engagementScore": 90, "characterCount": 140, "hook": "Viral hook", "cta": "RT if you agree" } ],
  "newsletterTopics": [ { "content": "", "hashtags": ["unique_newsletter_tag"], "engagementScore": 70, "characterCount": 50, "hook": "Subject line hook", "cta": "Subscribe now" } ],
  "instagramIdeas": [ { "content": "", "hashtags": ["unique_ig_tag"], "engagementScore": 95, "characterCount": 80, "hook": "Stop scrolling hook", "cta": "Save this post", "postReelIdea": "Visual description..." } ],
  "youtubeIdeas": [ { "content": "", "hashtags": ["unique_yt_tag"], "engagementScore": 98, "characterCount": 60, "hook": "Clickbait hook", "cta": "Subscribe and hit the bell", "postReelIdea": "Video flow..." } ],
  "facebookPosts": [ { "content": "", "hashtags": ["unique_fb_tag"], "engagementScore": 75, "characterCount": 150, "hook": "Community hook", "cta": "Share with friends" } ]
}`;
}

export async function runContentAgent(
  input: ContentAgentInput
): Promise<ContentAgentOutput> {
  const prompt = createContentAgentPrompt(input);
  const rawResponse = await generateText(prompt, {
    systemInstruction: contentAgentSystemPrompt,
  });

  return parseContentAgentResponse(rawResponse);
}

export function createEmptyContentAgentOutput(): ContentAgentOutput {
  return { ...emptyContentAgentOutput };
}
