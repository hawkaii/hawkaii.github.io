---
title: "Building Food Finder: An AI-Powered Nutrition App for India"
date: "2026-06-07"
tags:
  - project
  - ai
  - india
  - food
draft: false
---


# Building Food Finder: An AI-Powered Nutrition App for India

Every Indian who's tried to track their nutrition knows the pain. MyFitnessPal and Cronometer work great if you eat packaged Western food with barcodes. But what happens when your lunch is a plate of idli, sambar, and podi from the local tiffin center? Or when the packaged snack you bought has a label in Hindi, English, and Tamil with a calorie count buried somewhere tiny?

The apps don't handle it. So I built one that does.

## The Problem

India has one of the most diverse food landscapes in the world:
- Regional cuisines (South Indian, North Indian, Bengali, Gujarati, etc.) with minimal overlap
- A massive unorganized food sector — street food, local restaurants, tiffin services
- Packaged foods with inconsistent labeling standards
- Complex dishes where "one cup" means completely different things depending on the ingredient (is that a measurement cup? A steel tumbler? The specific vessel grandma uses?)

Existing nutrition apps are built for the US/European market. They assume barcodes, standardized portions, and a limited set of recognizable ingredients with USDA database entries. When you try to log a dosa, you get "1 crepe (90g)" from a database that's guessing — and the nutritional estimate is often wrong because the fermentation process, the type of rice, and the urad dal ratio all change the macros.

## What I Built

**Food Finder** is a three-layer system:

### 1. OCR Layer — Read Indian Food Labels

The app uses Gemini Vision to read Indian packaged food labels — the multilingual ones where serving sizes are in grams *and* ml, where ingredients lists switch languages mid-sentence, and where "Contains added colours" is a permanent fixture.

Upload a photo of the label, and the app extracts:
- Serving size and servings per pack
- Calories, macros, fiber, sodium
- Ingredients list (normalized)
- Any health claims ("Heart healthy," "Natural source of protein")

The trickiest part wasn't OCR — it was normalizing units. Indian labels express energy in kcal (good), but protein in g, B12 in mcg, iron in mg, and sometimes calcium in mg% (percent of RDA per 100g, not per serving). The app has to understand the unit context for each field and normalize everything to a consistent schema.

### 2. LangGraph Agent — Context-Aware Nutrition

The AI layer is built on LangGraph, and it does something most nutrition apps don't: it understands Indian cooking.

When you type "breakfast: 2 idli, 1 small bowl sambar, podi with til oil," the agent:
1. Recognizes each item (idli, sambar, podi, til oil)
2. Understands preparation context (idli is fermented and steamed, not fried)
3. Estimates portion sizes based on Indian serving norms (2 idli = standard breakfast portion, not "2 pieces)
4. Cross-references with curated Indian food nutrition data
5. Returns a structured meal entry with macros

The graph has specialized nodes for:
- **Entity recognition** — identifying Indian dishes and ingredients from free-text
- **Portion estimation** — mapping Indian serving descriptions ("small katori," "1 full plate," "2 roti") to gram estimates
- **Dish decomposition** — breaking composite dishes (biryani, thali) into ingredient components
- **Confidence scoring** — flagging estimates where the model is uncertain vs. where we have reliable data

### 3. Shopping Integration — From Tracking to Action

This is where it gets interesting. Food Finder connects nutrition tracking to actual shopping:

- Scan the barcode (or photo) of packaged items → auto-log them
- Get a shopping list generated from your meal plan
- Discover healthier alternatives to your regular purchases
- See nutrition breakdowns of local Indian brands (Parle, Britannia, MTR, Mother Dairy, local brands)

### A Note on Indian Food Data

Building the nutrition database was the hardest part. USDA data is useless here. The Indian Food Composition Tables (IFCT 2017, by the National Institute of Nutrition) are more relevant, but the data is sparse and formatted for researchers, not developers.

The approach I took:
- **Base layer**: IFCT 2017 data for common Indian ingredients (rice varieties, lentils, vegetables, spices)
- **Recipe layer**: Decomposed popular Indian recipes into ingredient-level data
- **Packaged foods**: Brand-specific data built from OCR scans and manual curation
- **Estimation layer**: ML-based estimation for dishes where we don't have exact data

It's not perfect. But it's better than pretending a dosa is a "corn tortilla" (like MyFitnessPal suggests) and calling it a day.

## Architecture

```
React (frontend) → FastAPI (backend) → PostgreSQL
                    ↓
            LangGraph Agent
              ├── OCR Node (Gemini Vision)
              ├── Entity Recognition
              ├── Portion Estimation
              └── Dish Decomposition
                    ↓
            Nutrition Database (IFCT + curated)
```

The FastAPI layer handles auth, user data, meal logging, and shopping lists. LangGraph handles the AI workflows as stateful graphs — each meal log goes through the graph pipeline and returns structured nutritional data.

## What I Learned

**Indian food is hard to model.** A dish like dal khichdi can be made 50 different ways across 50 Indian homes, and every variation changes the macros slightly. The solution isn't perfect precision — it's giving users a good-enough estimate with clear confidence indicators, then letting them refine.

**OCR on Indian labels is a real engineering problem.** Labels use multiple fonts, languages, and have inconsistent layouts. Some brands print nutrition info rotated 90 degrees. Some bury it under the "marketed by" text. The Gemini Vision approach handles this well, but it's not 100% — I built a manual correction flow for edge cases.

**The Indian market wants AI that works for them, not adapted from the West.** Every user I've shown this to immediately tries to log something specific to their diet — Gujarati thali, Kerala-style beef fry, Kolkata biryani, Anda paratha from a specific dhaba. The app doesn't need to know every dish perfectly; it needs to handle the most common 200-300 dishes well, and have a graceful fallback for everything else.

## What's Next

The app is still in private beta (pre-release, Indian market focus). Next on the roadmap:

- Integration with Indian grocery delivery services (Zepto, Blinkit, Instamart) for one-tap reordering
- Meal planning with regional variety (never two similar thalis in a row)
- Community-curated dish database with a Wikipedia-like moderation system
- Bilingual UI (English + Hindi/Tamil as a start)

---

*Food Finder is a work-in-progress. If you're building food/health tech for India and want to chat, reach out.*
