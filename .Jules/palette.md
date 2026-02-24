## 2024-10-25 - Caps Lock Detection
**Learning:** `getModifierState('CapsLock')` is the most reliable way to detect Caps Lock state across keydown/keyup events, providing immediate feedback for users in case-sensitive contexts like typing practice.
**Action:** Consider applying this pattern to login forms and other text-heavy inputs where case matters.

## 2025-02-17 - AI Generated Image Accessibility
**Learning:** Generated images are often purely visual, but their prompt is the perfect `alt` text. Using "Generated image" as `alt` text is a missed opportunity for screen reader users to understand the content.
**Action:** Always use the generation prompt as the `alt` text for AI-generated images.
