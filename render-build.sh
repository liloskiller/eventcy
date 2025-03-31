#!/bin/bash
# Create case-sensitive symlinks for Linux (Render)
ln -sf components/ui/Card.tsx components/ui/card.tsx
ln -sf components/DarkModeToggle.tsx components/darkmodetoggle.tsx
# Add similar lines for other components

# Proceed with build
npm install --force
npm run build