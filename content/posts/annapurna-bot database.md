---
title: annapurna-bot database
date: 2025-08-11
tags:
  - sapling
  - technical
---
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