#!/bin/bash

version=$(git describe --tags $(git rev-list --tags --max-count=1))

echo "Project: DatePoll-Frontend"
echo "Type: Release"
echo "Version: $version"

rm -rf ./dist/*

echo "Building... "
ng build --prod
echo -e "\e[32mDone.\e[0m"


cd dist/

echo -en "Creating tar.xz... "
tar cfJ "DatePoll-Frontend-${version}.tar.xz" ./DatePoll-Frontend >> /dev/null
echo -e "\e[32mdone\e[0m"

echo -en "Creating DatePoll-Frontend-$version.zip ... "
zip -r "DatePoll-Frontend-${version}.zip" ./DatePoll-Frontend >> /dev/null
echo -e "\e[32mdone\e[0m"

echo -en "Copying DatePoll-Frontend-$version.zip to DatePoll-Frontend-latest.zip ... "
cp "DatePoll-Frontend-${version}.zip" DatePoll-Frontend-latest.zip
echo -e "\e[32mdone\e[0m"

ls

FILE=./deploy.sh
if [[ -f "$FILE" ]]; then
	echo "Deploy.sh exists... Executing it!"
	./deploy.sh
fi

echo "> Finished"


