---
title: Azure Ai Vison OCR
date: 2025-08-11
tags:
  - sapling
  - technical
---
# How I Used Azure AI Vision for OCR in My WhatsApp Kitchen Assistant

## Introduction

When building Annapurna, my WhatsApp-based kitchen assistant, I wanted users to simply snap a photo of their grocery bill and have their pantry inventory update automatically. The magic behind this feature? **Azure AI Vision’s OCR (Optical Character Recognition)** service. In this post, I’ll walk you through exactly how I integrated Azure, the challenges I faced, and how the whole process works—from image to inventory.

---

## Why Azure AI Vision?

There are many OCR solutions out there, but Azure’s Computer Vision API stood out for its:

- **Accuracy:** Handles messy receipts, various fonts, and even handwritten text.
- **Speed:** Returns results in seconds, perfect for a chat-based experience.
- **Ease of Integration:** Simple REST API, great Python SDK, and generous free tier.

---

## How to Get Your Azure Computer Vision API Key

1. **Sign in to the [Azure Portal](https://portal.azure.com/).**
2. **Create a Resource:**
   - Click “Create a resource.”
   - Search for “Computer Vision” and select it.
   - Click “Create.”
3. **Configure the Resource:**
   - Choose your subscription and resource group.
   - Enter a unique resource name.
   - Select a region (choose one close to your users).
   - Click “Review + create,” then “Create.”
4. **Get Your Keys and Endpoint:**
   - Once deployment is complete, go to your new Computer Vision resource.
   - In the left sidebar, click “Keys and Endpoint.”
   - Copy one of the keys (Key 1 or Key 2) and the endpoint URL.
5. **Add to Your Environment:**
   - Set these values in your `.env` or Railway environment variables:
     ```
     VISION_KEY=your_azure_vision_key
     VISION_ENDPOINT=your_azure_vision_endpoint
     ```

---

## The End-to-End Process: From Photo to Pantry

Let’s break down the journey of a grocery bill through Annapurna:

### 1. User Uploads a Grocery Bill

- The user sends a photo of their grocery bill via WhatsApp.
- Puch AI forwards the image to my MCP server.

### 2. Image Sent to Azure AI Vision

- The backend receives the image (as a URL or binary data).
- Using the Azure Computer Vision SDK, I send the image to the OCR endpoint:
  ```python
  from azure.cognitiveservices.vision.computervision import ComputerVisionClient
  from msrest.authentication import CognitiveServicesCredentials

  client = ComputerVisionClient(
      endpoint=VISION_ENDPOINT,
      credentials=CognitiveServicesCredentials(VISION_KEY)
  )
  ocr_result = client.read_in_stream(image_stream, raw=True)
  ```

### 3. Extracting Text from the Response

- Azure processes the image and returns a structured response with detected text lines and words.
- I parse the response to extract item names and quantities, handling common receipt quirks (like “2x Apple” or “Banana 1kg”).

### 4. Smart Parsing & Cleaning

- Not all receipts are created equal! I use regular expressions and fuzzy matching to:
  - Ignore prices, totals, and store info.
  - Normalize item names (e.g., “TOMATOES” → “tomato”).
  - Extract quantities and units.

### 5. Inventory Update

- Parsed items are matched against the user’s existing inventory in PostgreSQL.
- New items are added, quantities are updated, and the user gets a confirmation message on WhatsApp.

---

## Challenges & Solutions

- **Messy Receipts:** Some receipts are crumpled, faded, or in odd layouts. Azure’s OCR is robust, but I added post-processing to handle edge cases.
- **Multiple Languages:** Azure supports many languages, so users can upload bills in their local language.
- **Speed:** For a snappy user experience, I run OCR and parsing asynchronously and send a “processing” message if needed.

---

## Code Snippet: The Core OCR Call

```python
def scan_grocery_bill(image_stream):
    client = ComputerVisionClient(
        endpoint=VISION_ENDPOINT,
        credentials=CognitiveServicesCredentials(VISION_KEY)
    )
    poller = client.read_in_stream(image_stream, raw=True)
    result = poller.result()
    lines = []
    for read_result in result.analyze_result.read_results:
        for line in read_result.lines:
            lines.append(line.text)
    return lines
```

---

## Final Thoughts

Integrating Azure AI Vision’s OCR turned a tedious task—manually logging groceries—into a magical, one-snap experience. Users love the convenience, and I love how easy Azure made it to add real-world intelligence to my bot.

If you’re building anything that needs to “see” and understand images, give Azure’s Computer Vision API a try. It’s the secret sauce behind Annapurna’s smart kitchen magic!

read the full implementation at [[posts/making_annapurna_bot|Annapurna-bot blog]]


---