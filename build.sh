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
		web-ext lint --ignore-files \
			${APP_DIR}"material" \
			${APP_DIR}"chrome-artifacts" \
			${APP_DIR}"manifest.firefox.json" \
			${APP_DIR}"manifest.chrome.json" \
			${APP_DIR}"*.sh";
		check ${?};
		web-ext build --ignore-files \
			${APP_DIR}"material" \
			${APP_DIR}"chrome-artifacts" \
			${APP_DIR}"manifest.firefox.json" \
			${APP_DIR}"manifest.chrome.json" \
			${APP_DIR}"*.sh";
		check ${?};
		;;
	"chrome")
		cp ${APP_DIR}"manifest.chrome.json" ${APP_DIR}"manifest.json";
		check ${?};
		version=$( grep "\"version\"" "manifest.json" );
		check ${?};
		version=$( echo ${version} | sed -r "s/^\"version\"\s*:\s*\"(.*)\".*/\1/" );
		check ${?};
		filename=${APP_DIR}"chrome-artifacts/"${version}".zip";
		echo ${filename};
		if [ -e ${filename} ]; then
			echo "already exists.";
			exit 1;
		fi
		zip -r ${filename} ${APP_DIR} -x \
			${APP_DIR}".git*" \
			${APP_DIR}"material" \
			${APP_DIR}"web-ext-artifacts/*" \
			${APP_DIR}"chrome-artifacts/*" \
			${APP_DIR}"manifest.firefox.json" \
			${APP_DIR}"manifest.chrome.json" \
			${APP_DIR}"BUILD.md" \
			${APP_DIR}"*.sh";
		check ${?};
		;;
esac

if [ -e ${APP_DIR}"manifest.json" ]; then
	rm ${APP_DIR}"manifest.json";
	check ${1};
fi

ls -l ${APP_DIR};
exit ;
