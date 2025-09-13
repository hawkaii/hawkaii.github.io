---
title: Making Annapurna-bot
date: 2025-08-11
tags:
  - technical
  - sapling
  - hackathon
---
# Annapurna: The AI Kitchen Assistant That Lives in Your Pocket (and How I Deployed Her to Railway)

---

## Meet Annapurna: Your WhatsApp Kitchen Genie 🤖

Picture this: It’s 7pm, your stomach is rumbling, and your fridge is a cryptic puzzle of leftovers and mystery veggies. What if you could just text a bot, snap a photo of your grocery bill, and—voilà!—get healthy recipes, track your nutrition, and manage your pantry, all from WhatsApp?

Enter **Annapurna**, my AI-powered kitchen assistant, built with love, Python, and a dash of Puch AI magic. She’s not just a bot—she’s your culinary sidekick, nutritionist, and inventory manager, all rolled into one.

## What Can Annapurna Do? (Spoiler: A Lot!)

- **Scan Grocery Bills:** Snap a pic, and Annapurna’s Azure-powered OCR reads your bill, updating your pantry in seconds. read more about it at  [[posts/azure_ai_ocr|how i used Azure for OCR]]
- **Smart Inventory:** Never forget what’s in your kitchen. Annapurna keeps your inventory fresh and accurate.
- **AI Recipe Suggestions:** “What can I cook with these?” Just ask! Gemini AI whips up creative, healthy recipes based on your real ingredients.
- **Nutrition Tracker:** Log your meals, get instant nutrition facts, and see your daily scoreboard—calories, protein, carbs, and fat, all tracked in PostgreSQL.
- **WhatsApp Integration:** No new apps. No logins. Just chat with Annapurna on WhatsApp, like texting a friend.
- **Secure & Scalable:** Bearer token authentication and PostgreSQL keep your data safe and sound.

---
### Demo

<iframe width="560" height="315" src="https://www.youtube.com/embed/uxZUkDU_gno" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


---
### The Tech Behind the Magic ✨

- **Backend:** Python 3.11+, FastMCP (Model Context Protocol)
- **Database:** PostgreSQL (async SQLAlchemy ORM)
- **AI Services:** Google Gemini (for nutrition & recipes), Azure AI Vision (for OCR)
- **Authentication:** Bearer token (Puch-compatible)
- **Deployment:** Railway (with a sprinkle of Docker and Alembic for migrations)
## From Photo to Database: The Complete Data Journey 📸➡️📦

Let me walk you through the magic that happens when you snap a grocery bill photo. It's a beautiful dance of AI, OCR, and database operations that would make any data engineer weep tears of joy:

### Step 1: WhatsApp Image → Azure OCR
When you send a photo to Annapurna via WhatsApp:
```
User sends image → Puch AI → MCP Server → Azure AI Vision
```
Azure's OCR engine extracts every line item from your grocery bill with scary-good accuracy. We're talking "reads your doctor's handwriting" level precision.
[[azure_ai_ocr|read this chapter for a more detailed overview]]
### Step 2: Text Parsing → Structured Data
The raw OCR text gets parsed into clean, structured data:
```python
# Raw OCR: "Organic Bananas    $3.99"
# Becomes: {"item": "Organic Bananas", "price": 3.99, "quantity": 1}
```
This is inherently done by puch.ai , though i later plan to implement my own server (watchout for this)
### Step 3: PostgreSQL Magic ✨
Here's where Railway's PostgreSQL becomes the hero. My database schema is beautifully simple yet powerful:

#### Core Tables:
- **Users:** Each WhatsApp user gets a unique profile
- **NutritionLog:** Every food item logged with complete nutrition facts
- **NutritionTotals:** Real-time daily nutrition summaries

#### The Database Schema That Just Works:
```sql
-- Users table: Simple and scalable
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR UNIQUE NOT NULL  -- WhatsApp user ID
);

-- Nutrition log: Every meal, every bite
CREATE TABLE nutrition_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    food VARCHAR NOT NULL,
    amount FLOAT NOT NULL,
    calories FLOAT NOT NULL,
    protein FLOAT NOT NULL,
    carbs FLOAT NOT NULL,
    fat FLOAT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Daily totals: Lightning-fast nutrition summaries
CREATE TABLE nutrition_totals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE,
    calories FLOAT DEFAULT 0.0,
    protein FLOAT DEFAULT 0.0,
    carbs FLOAT DEFAULT 0.0,
    fat FLOAT DEFAULT 0.0
);
```

### Step 4: AI-Powered Nutrition Analysis
When grocery items are identified, Annapurna doesn't just add them to inventory—she asks Gemini AI for complete nutrition facts:

```
"Organic Bananas, 1 bunch" → Gemini AI → 
{
  "calories": 105,
  "protein": 1.3,
  "carbs": 27,
  "fat": 0.4,
  "serving_size": "1 medium banana"
}
```

### Step 5: Async Database Operations (Lightning Fast!)
Thanks to SQLAlchemy's async capabilities and PostgreSQL's performance, every operation is non-blocking:

```python
# User logs a meal → Database update in milliseconds
async def log_nutrition(user_id: str, food_data: dict):
    async with AsyncSessionLocal() as session:
        # Insert nutrition log
        log_entry = NutritionLog(**food_data)
        session.add(log_entry)
        
        # Update daily totals (atomic operation)
        await update_daily_totals(session, user_id, food_data)
        
        await session.commit()
    # Total time: ~50ms including network latency
```

### Why This Setup is Chef's Kiss 👨‍🍳

1. **Railway's PostgreSQL:** Zero-config, production-ready database in seconds
2. **Async Everything:** No blocking operations, handles hundreds of users simultaneously  
3. **Atomic Updates:** Nutrition totals stay consistent even under heavy load
4. **Scalable Schema:** Easy to add new features (meal planning, anyone?)
5. **Real-time Accuracy:** Every grocery scan updates your pantry and nutrition instantly

### The Result: Seamless User Experience
From the user's perspective, they just:
1. Send a photo
2. Get a list of ingredients available
3. Ask "get nutrition" and see if it fits your diet
4. Log meals and see nutrition update in real-time

But behind the scenes, there's a symphony of Azure OCR, Gemini AI, async PostgreSQL operations, and Railway's rock-solid infrastructure making it all possible.


---
## How I Deployed Annapurna on Railway 🚂

![[Pasted image 20250811183433.png]]
Deploying to Railway was smoother than a perfectly blended smoothie. Here’s my recipe for success:

### 1. Containerize the App

I wrote a `Dockerfile` to package the MCP server, nutrition tracker, and all dependencies. (Pro tip: Don’t forget to copy your `.env.example` and set up secrets in Railway’s dashboard!)

### 2. Set Up PostgreSQL (Easier Than Making Toast!)

Here's where Railway truly shines. Setting up a production-ready PostgreSQL database took me literally 3 clicks:

1. **Add PostgreSQL Plugin:** In Railway's dashboard, I clicked "New" → "Database" → "Add PostgreSQL"
2. **Instant Database:** Railway spun up a PostgreSQL 15 instance in seconds, complete with automatic backups
3. **Grab the Connection String:** Railway auto-generated a `DATABASE_URL` that looks like:
   ```
   postgresql://postgres:password@db.railway.internal:5432/railway
   ```

But here's the magic—Railway automatically converts this to the async format my SQLAlchemy setup needs. No manual URL parsing, no connection headaches. Just pure, seamless database bliss.

### 3. Configure Environment Variables

In Railway’s dashboard, I added all the secrets:
- `AUTH_TOKEN`
- `VISION_KEY` & `VISION_ENDPOINT`
- `GEMINI_API_KEY`
- `DATABASE_URL`
- ...and any other secret sauces.

### 4. Deploy!

I connected my GitHub repo, hit “Deploy,” and watched the logs like a proud parent. When I saw:

```
🚀 Starting MCP server on http://0.0.0.0:8086
```

I knew Annapurna was alive in the cloud!

### 5. Connect to Puch AI

I used `/mcp connect https://my-railway-app.up.railway.app/mcp <my_secret_token>` in WhatsApp, and Annapurna was ready to chat.

---

Annapurna started as a weekend project and blossomed into a full-fledged AI kitchen companion. She’s already helping users eat healthier, waste less, and have more fun in the kitchen. Next up: web and mobile apps, smarter meal planning, and maybe even voice assistant integration (Alexa, watch out!).

If you want to build your own AI assistant, check out the [repo](https://github.com/hawkaii/annapurna) . And if you deploy on Railway, let me know—maybe Annapurna and her cousins can swap recipes!

## 🚀 Future Scope & Updates

Annapurna is just getting started! Here’s what’s coming soon:

- **Web & Mobile Apps:** A beautiful dashboard and companion app for tracking, planning, and exploring recipes
- **Smarter Meal Planning:** Personalized meal plans based on your pantry, nutrition goals, and dietary preferences
- **Voice Assistant Integration:** Chat with Annapurna using Alexa, Google Assistant, or Siri
- **Barcode Scanning:** Instantly add groceries by scanning barcodes
- **Community Features:** Share recipes, meal plans, and pantry hacks with other Annapurna users
- **More Integrations:** Connect with fitness trackers, health apps, and more
- **Continuous AI Improvements:** Smarter OCR, better nutrition analysis, and more creative recipes

Stay tuned for updates and sneak peeks on the [official website](https://annapurna.hawkaii.me)!

also take a look at the [twitter-thread](https://x.com/hawkaiimello/status/1954613390045073568)

[[tags/hackathon|hackathon]]
**Bon appétit, and happy hacking! 🍽️🤖**

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/lEdfl5?referralCode=MkczYC)


