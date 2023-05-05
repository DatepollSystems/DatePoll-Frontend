#!/usr/bin/env bash
main () {
 node ./node_modules/dfx-translate/translation/generateTranslation.js https://translate.dafnik.me/translate de en
 node ./node_modules/dfx-translate/translation/generateTranslation.js https://translate.dafnik.me/translate de fr
 node ./node_modules/dfx-translate/translation/generateTranslation.js https://translate.dafnik.me/translate de es
 node ./node_modules/dfx-translate/translation/generateTranslation.js https://translate.dafnik.me/translate de it
 node ./node_modules/dfx-translate/translation/generateTranslation.js https://translate.dafnik.me/translate de pt

 prettier --config ./.prettierrc --write ./src/assets/i18n

 printf "\nFinished!"
}
time main
