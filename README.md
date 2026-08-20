# casino_mobile

cd ~/gold365_android/frontend

npm run build

npm run android:sync

cd android

./gradlew installDebug

adb -s emulator-5554 shell monkey \
-p com.gold365.casino \
-c android.intent.category.LAUNCHER 1