## 2024-10-25 - Caps Lock Detection
**Learning:** `getModifierState('CapsLock')` is the most reliable way to detect Caps Lock state across keydown/keyup events, providing immediate feedback for users in case-sensitive contexts like typing practice.
**Action:** Consider applying this pattern to login forms and other text-heavy inputs where case matters.
