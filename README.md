# TODO

## High priority

- [-] App crashes on API 35
- [x] Notification vibrations don't work

## Medium high priority

- [ ] Migrate to new architecture

## Medium priority

- [x] Change password flow
- [x] Forgot password flow
- [ ] Change email flow
- [ ] Add proper inputs for time select to timer settings
- [ ] Make a loading skeleton account page
- [ ] Separate Date input components to Android and iOS
- [ ] Add user description to account page
- [ ] Improve country select performance
- [ ] Fix keyboard and submit button layout
- [ ] Add dark mode to code input
- [ ] Add App Settings option to account page (to enable dark mode)
- [ ] Add input validation for City input field
- [ ] Deleting account - delete local data as well?
- [ ] Add an option to clear all data without deleting the account
- [ ] How to handle errors in React Native? What if a page throws an error? Need this for ClerkProvider loading Clerk key

- [ ] Replace screen header for screen with scroll (Edit User screen for example)

## Low priority

- [ ] Improve error handling
  - [ ] Highlight incorrect fields in signup process

# Build

Build APK with `eas build -p android --profile preview --local`

# Clear cache

```bash
rm -rf node_modules
npm cache clean --force
npm install
watchman watch-del-all
del %localappdata%Temphaste-map-*
del %localappdata%Tempmetro-cache
npx expo start --clear
```

# Decompile APK

```bash
apktool d build-1734809939620.apk
```

./gradlew assembleRelease
