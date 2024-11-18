#!/bin/bash

###################################
## AUTHOR:	Dustin Schulz & Afonso Gabriel ORDIX AG
## DATE:	20.10.2022
## VERSION:	1.0
## PURPOSE:	Manage (de)installation of database, data_loading and dashboard together
###################################

usage() {
    echo "dev"
    echo
    echo "Options:"
    echo "-s start up dev"
    echo "-d start up dev with dashboard"
    echo "-e shut down dev"
    exit
}

start_dev() {
	echo "start_dev"
    export PGHOST=localhost
    export PGUSER=postgres
    export PGPASSWORD=postgres
    export PGDATABASE=postgres
    docker-compose -f $SCRIPTPATH/other_scripts/docker-compose.yml -f $SCRIPTPATH/other_scripts/docker-compose-dashboard.yml down
    docker build -t custom_postgres ../database
    # docker build -t pg_inv_dashboard ../dashboard
    docker-compose -f $SCRIPTPATH/other_scripts/docker-compose.yml up -d
    echo '============================================='
    echo '            PG_INV DEV ENVIRONMENT           '
    echo '                                             '
    echo '       Postgres:            localhost:5432   '
    echo '        pgAdmin:     http://localhost:5050   '
    echo '   pgAdmin user:           admin@admin.com   '
    echo '    pgAdmin pwd:                      root   '
    echo '============================================='
    }

start_dev_with_dashboard() {
	echo "start_dev_with_dashboard"
    export PGHOST=localhost
    export PGUSER=postgres
    export PGPASSWORD=postgres
    export PGDATABASE=postgres
    docker-compose -f $SCRIPTPATH/other_scripts/docker-compose.yml -f $SCRIPTPATH/other_scripts/docker-compose-dashboard.yml down
    docker build -t custom_postgres ../database
    docker build -t pg_inv_dashboard ../dashboard
    docker-compose -f $SCRIPTPATH/other_scripts/docker-compose.yml -f $SCRIPTPATH/other_scripts/docker-compose-dashboard.yml up -d
    echo '============================================='
    echo '            PG_INV DEV ENVIRONMENT           '
    echo '                                             '
    echo '      Dashboard:     http://localhost:8080   '
    echo '       Postgres:            localhost:5432   '
    echo '        pgAdmin:     http://localhost:5050   '
    echo '   pgAdmin user:           admin@admin.com   '
    echo '    pgAdmin pwd:                      root   '
    echo '============================================='
    }

stop_dev() {
	echo "stop_dev"
    docker-compose -f $SCRIPTPATH/other_scripts/docker-compose.yml -f $SCRIPTPATH/other_scripts/docker-compose-dashboard.yml down
}

while getopts esd opt
do
   case $opt in
	e)
	STOPDEV=TRUE
	;;
    s)
	STARTDEV=TRUE
	;;
    d)
	STARTDASHBOARD=TRUE
	;;
	*)
	usage
	;;
   esac
done

if [ -v $STARTDEV ] && [ -v $STOPDEV ] && [ -v $STARTDASHBOARD ]; then
	usage
else
	if [ ! -v $STOPDEV ]; then
		stop_dev
	fi
	if [ ! -v $STARTDEV ]; then
        start_dev
	fi
    if [ ! -v $STARTDASHBOARD ]; then
        start_dev_with_dashboard
	fi
fi
