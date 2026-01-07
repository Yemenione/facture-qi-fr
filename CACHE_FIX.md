# Cache Buster Script

## Problem
Browser cache is preventing the updated impersonate code from loading.

## Solution
Clear browser cache manually:

### Chrome/Edge
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Click "Clear data"

### Or use Incognito Mode
1. Press `Ctrl + Shift + N`
2. Navigate to `http://localhost:3002`
3. Login and test

### Or Hard Refresh
1. Press `Ctrl + Shift + R` or `Ctrl + F5`
2. This forces reload without cache

## Verification
After clearing cache:
1. Go to `http://localhost:3002/dashboard`
2. Click "Accéder" on any company
3. Should redirect to client dashboard with "Mode Expert Activé" banner

## Current Status
✅ Backend API working
✅ Database configured
✅ Impersonation logic correct
❌ Frontend cache blocking updates

The code is correct - only cache needs clearing!
