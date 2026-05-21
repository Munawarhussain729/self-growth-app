# Growth Compass

A private Expo SDK 54 mobile app for self-growth: daily lessons, journaling, AI coaching, weekly reviews, and copyright-safe book summaries.

## Run

```bash
npm install
npm run start
```

## Build APK

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

The `preview` profile creates an installable APK.

## AI

The app works without AI. Add an OpenAI API key in Settings to use Coach and AI Weekly Review. Keep the model as `gpt-5-nano` and set a real budget cap in the OpenAI dashboard for hard spending protection.

## Privacy

Data is stored locally with AsyncStorage. Journal entries are sent to OpenAI only when you explicitly use AI features.
