#! /bin/bash

function check() {
	if [ ${?} != "0" ]; then
		echo "error.";
		exit 1;
	fi
}

APP_DIR=$(dirname $0)"/";

if [ -e ${APP_DIR}"manifest.json" ]; then
	rm ${APP_DIR}"manifest.json";
	check ${1};
fi

case ${1} in
	"firefox") 
		cp ${APP_DIR}"manifest.firefox.json" ${APP_DIR}"manifest.json";
		check ${?};
		;;
	"chrome") 
		cp ${APP_DIR}"manifest.chrome.json" ${APP_DIR}"manifest.json";
		check ${?};
		;;
	"opera") 
		cp ${APP_DIR}"manifest.opera.json" ${APP_DIR}"manifest.json";
		check ${?};
		;;
	"edge") 
		cp ${APP_DIR}"manifest.edge.json" ${APP_DIR}"manifest.json";
		check ${?};
		;;
esac

ls -l ${APP_DIR};
exit ;
