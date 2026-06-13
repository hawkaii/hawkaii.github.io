---
title: Test Sync Post
date: "2026-06-07"
tags:
  - technical
  - test
draft: false
---


# Test Sync Post

This is a test post to verify the vault → Quartz sync workflow.

## What this tests

- Frontmatter transformation (vault format → Quartz format)
- Wikilink preservation
- Draft filtering
- Category detection

## Wikilinks

Here's a link to [notes/how-to-use](/notes/how-to-use) to test wikilink preservation.

And here's an aliased link: [Quick Ref](/notes/quick-reference).

## Code block

```python
def hello():
    print("Hello from the blog!")
```

## Conclusion

If this post appears at `blog.hawkaii.me/posts/test-sync-post`, the sync works!
