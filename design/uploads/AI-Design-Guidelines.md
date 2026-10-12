# AI Design Guidelines: Avoiding the "AI Slop" Look

> Based on the ideas in *"Stop AI slop and making stuff look vibe coded"* by Oliur Online
> (https://www.youtube.com/watch?v=soZgjJi7xNw). This is a summary in my own words, not a transcript.

## Why AI designs look generic

AI models produce the **average** of everything they've seen. Average design looks like every
other AI-built site. AI can get you about **80%** of the way there fast. The last **20%**,
the refinement, is where a design starts to look like yours. It takes the most time, and it's the
part most people skip.

---

## What other people say "AI slop" is

### The definition
- **AI slop** is content made with generative AI that people see as low-effort, low-quality or
  meaningless, often produced in bulk for clicks, money or to mislead. [1][2]
- "Slop" originally meant watery pig feed. It later came to mean junk media. The AI sense started
  around 2022 on forums like 4chan, Hacker News and YouTube comments. Programmer Simon Willison
  helped make it mainstream in 2024. [1]
- Merriam-Webster named "slop" its 2025 word of the year. [1]

### Why it happens in UI design
Designers and developers broadly agree on the cause: AI picks the **statistical middle** of its
training data. The middle of the web is a Tailwind/shadcn-style page, so every AI builder
ends up producing the same look. One common way to put it is "LLMs don't have taste." [3][4][5]

### The "vibe coded" look, according to others
These are the tells people mention most often, in addition to the ones in the video:

- **Purple-to-blue (indigo) gradients**, especially as gradient headline text. [3][4][5]
- **Inter or Geist** as the only font, with no typeface chosen to fit the product. [4][5][6]
- **The same hero layout:** a centered headline, then a row of three rounded feature cards. [4][5]
- **Untouched component-library defaults** (shadcn/ui, Lucide icons on every card). [3][4]
- **Glassmorphism:** frosted, blurred, semi-transparent panels everywhere. [3][4]
- **Icons in small colored rounded squares**, repeated on every feature. [3]
- **Mushy color:** several close shades of one hue stacked together (for example, a cyan icon in a
  blue box on a slightly different blue card). [3]
- **Pill buttons and rounded corners on everything.** [3]
- **Flat hierarchy:** identical padding, radius and card heights, so nothing stands out. [6]
- **Generic copy:** polished but vague headlines ("Scale without limits") that could describe
  any product. [3][6]
- **Only the happy path is designed:** no empty, loading or error states. [6]
- **Motion with no purpose:** everything fades in the same way, or nothing moves at all. [6]
- **Everything shown at once** instead of showing features only when people need them. [6]
- **Repeated badges** and decorative labels. [3]

### The tells under the surface
Others point out that AI-built sites often look finished but skip the basics. [7]

- Missing image alt text and broken heading order (for example, an H1 followed directly by an H4).
- Missing social preview tags, a default favicon and an outdated copyright year.
- Weak mobile support: no viewport tag, and touch targets that are too small.
- Unoptimized images and slow loading.
- Leftover builder badges ("Edit with Lovable", "Made in Bolt", "Built with v0"). [3]

### Fixes others recommend
- **Change the font first.** Choose a typeface that fits the product's personality. [6]
- **Use color for meaning** (primary action, success, warning), not decoration. [6]
- **Write in your own voice,** with specific details about what the product actually does. [6]
- **Vary size and weight on purpose** so the important elements stand out. [6]
- **Design the empty, loading and error states.** [6]
- **Give the AI direction:** your brand, a named visual style and an explicit list of defaults to
  avoid. A better model alone won't fix it. [4][5]

---

## The 3-step process

### 1. Build first, design later
- Let the AI build the feature or app the way it wants.
- Focus on how it **works**, not how it looks.
- Don't spend effort on visuals at this stage.

### 2. Apply design prompts or skills
- Use ready-made design prompts or skills to change what the AI built.
- Apply them **one area at a time**, so you can see the effect of each:
  1. **Typography:** consistent sizes, readable fonts, unified text colors.
  2. **Spacing & layout:** consistent padding, margins and rhythm.
- **Tip:** Ask the AI to keep the current version and build the new one beside it
  (v1 vs. v2) so you can compare them.
- Treat a prompt's output as a **foundation**, not the final answer. Override anything you
  don't like (for example, scaling fonts back down after a spacing pass made them too big).

### 3. Refine by hand
- Spend time on small, specific tweaks. This is what makes the design look polished.
- Make one clear change per request so you can judge each one.

---

## Common AI design tells to remove

| AI habit | What to do instead |
|---|---|
| **Emojis** used as icons or decoration | Remove them. Use a proper icon set, or nothing. |
| **Borders everywhere** (cards, buttons, inputs) | Remove most borders. Separate elements with spacing, background or shadow. |
| **Default purple** accents and gradients | Remove the purple. Pick an accent color that fits your brand, or use a neutral palette. |
| **Oversized elements** (headers, badges, banners) | Scale them down. Not everything needs to stand out. |
| **Random decorations** (diamonds, dividers, ornaments) | Remove anything that has no purpose. |
| **UPPERCASE labels** | Use sentence case unless there's a reason not to. |
| **Large icons** | Make icons smaller and quieter than the text they go with. |
| **Misaligned icons** (centered on a whole block) | Align icons with the line of text they label (for example, the item name). |
| **Inconsistent or excessive gaps** | Tighten the space between related groups (for example, nav and content). |
| **Rigid rows with empty gaps** | Consider a masonry layout for lists or cards of uneven height. |
| **Cards for everything** (every section, stat and list item boxed) | Use cards only for items that stand alone or can be clicked. Group other content with spacing and type instead. Never nest cards inside cards. |
| **Subheadings everywhere** (a heading over every short block) | Remove headings that only repeat what the content already says. Use a heading only when it helps people scan or navigate. |

---

## Principles

- **Fit the design to the content.** A directory or data-heavy site should be compact,
  readable and dense. Let the content do the work instead of decoration.
- **Restraint looks classy.** A neutral palette (blacks, grays) with one optional accent color
  often looks better than a lot of colors.
- **Design is subjective.** Guidelines are references, not hard rules. If you prefer gaps over
  masonry, or color over grayscale, that's a valid choice.
- **Match your brand.** Every product should look like *its own* brand, not like the AI's
  default style.

---

## Build your own taste

- **Collect inspiration.** Save UI elements, sites, images and videos you like in a reference
  library (for example, the Eagle app, or just a folder or board).
- **Use references when you prompt.** Point the AI at specific examples instead of saying
  "make it look good."
- **Learn the basics.** A UI design course helps, but most of the principles (typography,
  spacing, hierarchy, alignment) are available free online.
- Over time, your references and tweaks become a **personal style** you can apply again and again.

---

## Quick checklist before shipping

- [ ] No emojis used as UI elements
- [ ] Borders only where they serve a purpose
- [ ] No default purple or unexplained gradients
- [ ] Type scale is consistent and suits how dense the content is
- [ ] Spacing is consistent; related items are grouped closely
- [ ] Icons are small, consistent and aligned with their labels
- [ ] Cards only where they group a standalone or clickable item; no nested cards
- [ ] Subheadings only where they help people scan
- [ ] No leftover decorative elements
- [ ] Text uses sentence case
- [ ] Layout suits the content (grid, list or masonry)
- [ ] Colors match the brand (or a deliberate neutral palette)
- [ ] No gradient headline text, glass panels or untouched component-library defaults
- [ ] Font chosen on purpose (not just Inter or Geist by default)
- [ ] Hero isn't the default "centered headline + three feature cards"
- [ ] Clear hierarchy: the important elements are visibly bigger or bolder
- [ ] Copy is specific to this product
- [ ] Empty, loading and error states are designed
- [ ] Alt text, heading order, favicon, social preview tags and mobile viewport are all set
- [ ] No leftover AI-builder badges
- [ ] Compared against at least one saved reference you like

---

## Sources

1. [AI slop — Wikipedia](https://en.wikipedia.org/wiki/AI_slop)
2. [AI slop — Britannica](https://www.britannica.com/technology/AI-slop)
3. [How to Tell if a Website Is Vibe Coded (7 Signs) — vibe0](https://www.vibe0.com.au/blog/how-to-tell-if-a-website-is-vibe-coded),
   [Signs of vibe coded UI — Yuwen Lu on X](https://x.com/yuwen_lu_/article/2041187936738447565),
   [Check if Website Was Vibe Coded — TechBullion](https://techbullion.com/check-if-website-was-vibe-coded-how-to-spot-ai-built-websites/)
4. [Why AI Websites Look the Same and How to Fix It — Techarion](https://techarion.com/blog/why-ai-websites-look-the-same-how-to-make-claude-design-better),
   [AI Slop Design: Why AI-Generated UI Looks Generic — VibeCodeKit](https://vibecodekit.dev/ai-slop-design)
5. [Why Every AI-Built Website Looks the Same (Blame Tailwind's Indigo-500) — DEV Community](https://dev.to/alanwest/why-every-ai-built-website-looks-the-same-blame-tailwinds-indigo-500-3h2p),
   [Ole Lehmann on X](https://x.com/itsolelehmann/status/2037215657649983917),
   [Manish Kumar on X](https://x.com/Manixh02/status/2012387306683146646)
6. [Spot the Slop: A UI Designer's Guide to Fixing AI Defaults — Mania Design](https://www.mania.design/blog/spot-the-slop-a-ui-designers-guide-to-fixing-ai-defaults/)
7. [I Analyzed 100 Vibe Coded Websites — DEV Community](https://dev.to/kaplich/i-analyzed-100-vibe-coded-websites-and-found-these-common-mistakes-5275)
