#!/bin/bash

###################################
## AUTHOR:	Dustin Schulz, ORDIX AG
## DATE:	21.09.2022
## VERSION:	1.0
## PURPOSE:	Manage (de)installation of database, data_loading and dashboard together
###################################

usage() {
    echo "install"
    echo
    echo "Options:"
    echo "-d deinstall all"
    echo "-i install all"
    exit
}

install_all() {
	../pg_inv.sh database -i
	../pg_inv.sh data_loading -i
	../pg_inv.sh dashboard -i
}

deinstall_all() {
	../pg_inv.sh database -d
	../pg_inv.sh data_loading -d
	../pg_inv.sh dashboard -d
}

while getopts di opt
do
   case $opt in
	d)
	DEINSTALLATION=TRUE
	;;
	i)
	INSTALLATION=TRUE
	;;
	*)
	usage
	;;
   esac
done

if [ -v $DEINSTALLATION ] && [ -v $INSTALLATION ]; then
	usage
else
	if [ ! -v $DEINSTALLATION ]; then
		#echo deinstallation
		deinstall_all
	fi
	if [ ! -v $INSTALLATION ]; then
		install_all
	fi
fi
