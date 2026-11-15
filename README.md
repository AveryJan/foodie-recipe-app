# Foodie — Recipe Discovery App

**Author:** Avery Deng Jan · **Platform:** Expo / React Native (Android, iOS, and Web)

Foodie is a complete recipe browser and personal cookbook designed for a 30-point, 12-task peer-reviewed mobile app capstone.

## Run in Expo Snack (peer reviewer instructions)

1. Open [Expo Snack](https://snack.expo.dev/).
2. Use **Import Git Repository** and enter this repository's public GitHub URL, if that option is available in your Snack interface.
3. Alternatively, create a Snack, copy `App.js` into its editor, and add these dependencies under **Dependencies**:
   - `@react-native-async-storage/async-storage`
   - `expo-image-picker`
4. Start the **Web** preview, or scan the QR code using **Expo Go**.

For a local environment:

```bash
npm install
npx expo start
```

> Images in the starter catalog are served from Unsplash and need an internet connection. Your added recipes and favorites are saved in local app storage. No backend or authentication is required.

## Rubric verification — 30/30 points available

| Task | What to test | Points |
|---|---|---:|
| 1 | Public GitHub repository with `App.js`, `package.json`, and `app.json`; import into Snack | 1 |
| 2 | Explore screen: horizontally scroll 14 categories including My Food | 5 |
| 3 | Open any recipe: ingredients, instructions, prep time, servings, calories, difficulty | 6 |
| 4 | Select Pasta, Seafood, etc. and observe category-specific results | 1 |
| 5 | Tap the ♡ on a recipe card or detail page, then tap ♥ to unfavorite | 2 |
| 6 | Favorite a recipe, then open Favorites from the bottom menu | 1 |
| 7 | Scroll categories to My Food; tap **＋ Add New Recipe** | 2 |
| 8 | Enter name, upload photo (or use URL), ingredients, instructions, then **Save Recipe** | 5 |
| 9 | Verify the new item appears in **My Recipes** | 1 |
| 10 | Open a personal recipe to see full name, image, ingredients, and instructions | 3 |
| 11 | Test Edit and Delete from the personal recipe list and detail view | 2 |
| 12 | Use **‹ Back** on detail and form screens | 1 |
| **Total** | | **30** |

## Suggested test recipe

- **Recipe name:** Avery's Lemon Pasta
- **Category:** Pasta
- **Ingredients:** `200 g pasta` and `1 lemon` (one item per line)
- **Instructions:** `Boil pasta.` and `Toss with lemon.` (one step per line)
- **Image:** Pick a photo or paste a public image URL

Save it, open its details, favorite it, edit its name, and then delete it. The Favorites and My Recipes lists update immediately.

## Notes

- Sample dishes are demonstration recipes; nutritional values are estimates.
- The app uses `AsyncStorage` for saved personal recipes and favorite IDs. Very large uploaded photos can exceed browser local-storage limits; choose a reasonably sized photo when testing web.
- The GitHub URL does **not** become live until you create a public repository and upload these files.
