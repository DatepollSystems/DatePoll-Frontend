#!/usr/bin/env bash
main () {
 node ./translation/generateTranslation.js ./src/assets/i18n/de.json en
 node ./translation/generateTranslation.js ./src/assets/i18n/de.json fr
 node ./translation/generateTranslation.js ./src/assets/i18n/de.json es
 node ./translation/generateTranslation.js ./src/assets/i18n/de.json it
 node ./translation/generateTranslation.js ./src/assets/i18n/de.json pt

 printf "\nFinished!."
}
time main
