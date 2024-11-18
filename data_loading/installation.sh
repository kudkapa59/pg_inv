#!/bin/bash

###################################
## AUTHOR:	Dustin Schulz, ORDIX AG
## DATE:	21.09.2022
## VERSION:	1.0
## PURPOSE:	Manage (de)installation of cronjobs & starts data loading
###################################

usage() {
    echo "data_loading"
    echo
    echo "Options:"
    echo "-d deinstall cronjobs"
    echo "-i install cronjobs"
    echo "-s starts data_loading"
    exit
}

install_cronjobs() {
	CURRENT_DIRECTORY=$(dirname $(pwd))
	#echo $CURRENT_DIRECTORY
	(crontab -l 2>/dev/null; echo "$CRONTAB $CURRENT_DIRECTORY/pg_inv.sh data_loading -s > $CURRENT_DIRECTORY/data_loading/log/data_loading_\$(date +\"\\%Y\\%m\\%d\\%H\\%M\").log") | iconv -f utf-8 -t ascii//translit | crontab 
	(crontab -l 2>/dev/null; echo "$CRONTAB $CURRENT_DIRECTORY/pg_inv.sh database -o > $CURRENT_DIRECTORY/data_loading/log/delete_old_logs_\$(date +\"\\%Y\\%m\\%d\\%H\\%M\").log") | iconv -f utf-8 -t ascii//translit | crontab 
	echo "Cronjobs added (Use 'crontab -e' to edit)" 
}

deinstall_cronjobs() {
	crontab -l 2>/dev/null | grep -v 'pg_inv.sh' | crontab && echo "Cronjob deleted"
}

start_data_loading() {
    echo "start data-loading"
    rm -f tmp/* # clears tmp directory
    TIMESTAMP=$(psql -t -c "select current_timestamp") # gets current timestamp
    # loading data
    mkdir log 2> /dev/null
    mkdir tmp 2> /dev/null
    ./load_instances.sh -t "$TIMESTAMP" 2> tmp/error.log
    ./load_users.sh -a -t "$TIMESTAMP" 2> tmp/error.log
    ./load_databases.sh -a -t "$TIMESTAMP" 2> tmp/error.log
    echo "[\"99-01-01\", \"99-01-02\", \"99-01-03\", \"99-01-04\", \"99-01-05\"]" > tmp/coria_ids2.json # only needed for dev 
    ./load_applications.sh -t "$TIMESTAMP" 2> tmp/error.log
    echo "end data-loading"	
}

while getopts dis opt
do
   case $opt in
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

if [ -v $DEINSTALLATION ] && [ -v $INSTALLATION ] && [ -v $START ]; then
	usage
else
	if [ ! -v $DEINSTALLATION ]; then
		deinstall_cronjobs
	fi
	if [ ! -v $INSTALLATION ]; then
		install_cronjobs
	fi
	if [ ! -v $START ]; then
		start_data_loading
	fi
fi
