# casino_mobile

cd ~/gold365_android/frontend

npm run build

npm run android:sync

cd android

./gradlew installDebug

adb -s 127.0.0.1:6555 shell am force-stop \
com.gold365.casino

adb -s 127.0.0.1:6555 shell am start \
-W \
-n com.gold365.casino/.MainActivity