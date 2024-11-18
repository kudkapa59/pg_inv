#!/bin/bash

###################################
## AUTHOR:	Gabriel Afonso, ORDIX AG
## DATE:	05.10.2022
## VERSION:	1.0
## PURPOSE:	Manage (de)installation and build of the dashboard
###################################


usage() {
    echo "dashboard"
    echo
    echo "Options:"
    echo "-b build dashboard (nodejs, npm & internet connection necessary!)"
    echo "-d deinstall dashboard"
    echo "-i install dashboard"
    echo "-s start dashboard (only with sudo)"
    exit
}

build_dashboard() {
    source $NVM_DIR/nvm.sh
    nvm install 12.22.12
    npm i
    npm run build
    cp -r ./public ./.next/standalone/public
    cp -r ./.next/static ./.next/standalone/.next/static
    cp ./backend/server.js ./.next/standalone/server.js
    rm -r build || true
    mkdir build
    cd build
    tar -czvf dashboard.tar.gz -C ../.next ./standalone
    cd ..
    echo '================================'
    echo '        dashboard build         '
    echo '================================'
}

install_dashboard() {
    cd build
    tar -zxf dashboard.tar.gz
    rm -rf ./app
    mv ./standalone ./app
    cd ..
    sudo cp ../other_scripts/pginv.service /etc/systemd/system
    sudo systemctl enable pginv
    sudo systemctl daemon-reload
    sudo systemctl restart pginv
    echo '================================'
    echo '      dashboard installed       '
    echo '================================'
}

deinstall_dashboard() {
    cd build
    rm -rf ./app
    cd ..
    sudo systemctl stop pginv
    sudo rm -f /etc/systemd/system/pginv.service
    sudo rm -f /etc/systemd/system/multi-user.target.wants/pginv.service
    echo '================================'
    echo '     dashboard deinstalled      '
    echo '================================'
}

start_dashboard() {
    cd build/app
    node server.js
    cd ..
}

while getopts bdis opt
do
   case $opt in
	b)
	BUILD=TRUE
	;;
    d)
	DEINSTALLATION=TRUE
	;;
	i)
	INSTALLATION=TRUE
	;;
	s)
	START=TRUE
	;;
	*)
	usage
	;;
   esac
done

if [ -v $DEINSTALLATION ] && [ -v $INSTALLATION ] && [ -v $START ] && [ -v $BUILD ]; then
	usage
else
	if [ ! -v $BUILD ]; then
		build_dashboard
	fi
	if [ ! -v $DEINSTALLATION ]; then
		deinstall_dashboard
	fi
	if [ ! -v $INSTALLATION ]; then
		install_dashboard
	fi
	if [ ! -v $START ]; then
		start_dashboard
	fi
fi
