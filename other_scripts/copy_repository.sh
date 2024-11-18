#!/bin/bash

###################################
## AUTHOR:	Dustin Schulz, ORDIX AG
## DATE:	20.10.2022
## VERSION:	1.0
## PURPOSE:	Manage (de)installation of database, data_loading and dashboard together
###################################

usage() {
    echo "copy_repository"
    echo
    echo "Options:"
    echo "-c copy repository from cloudshell to server"
    echo "-s copy repository from server to cloudshell"
    exit
}

cloud2server() {
	echo "cloud2server"
    # delete dependencies from dashboard so they are not send to the server reducing traffic
    rm -rf ./dashboard/.next
    rm -rf ./dashboard/node_modules
    # renew backup folder and delete current repository (remote)
    REMOTE_COMMAND="if [ -d "$DESTINATION_ON_APP_SERVER/$PGINV_DIRECTORY_NAME" ]; then rm -rf $DESTINATION_ON_APP_SERVER/${PGINV_DIRECTORY_NAME}_backup && mv -f $DESTINATION_ON_APP_SERVER/$PGINV_DIRECTORY_NAME $DESTINATION_ON_APP_SERVER/${PGINV_DIRECTORY_NAME}_backup; fi"
    #echo $REMOTE_COMMAND
    gcloud compute ssh eh2szvw_ztb_icb_commerzbank_com@pg-inv-app-dev-01 --zone europe-west3-c --project tecfo-psql-ops-blue-dev-c923 --command "$REMOTE_COMMAND"
    # copy to server
    gcloud compute scp --recurse --project tecfo-psql-ops-blue-dev-c923 $SCRIPTPATH $USER_ON_APP_SERVER@$APP_SERVER:$DESTINATION_ON_APP_SERVER/$PGINV_DIRECTORY_NAME --zone europe-west3-c --tunnel-through-iap

    # 1. so fertig machen (nur von der cloudshell aus)
    # 2. Was muss geändert an den Befehlen werden, wenn der build gelaufen ist?
    # 3. der initiale Schritt um alles in die cloudshell zu bekommen muss dokumentiert werden

    #nach server2cloud muss der benutzer aus dem Verzeichnis heraus und wieder erneut rein gehen
    #nach cloud2server muss auf dem server der benutzer aus dem Verzeichnis heraus und wieder erneut rein gehen, falls dieser angemeldet und in dem verzeichnis war

}

server2cloud() {
	echo "server2cloud"
    # renew backup folder and delete current repository (local)
    if [ -d "$DESTINATION_ON_CLOUDSHELL/$PGINV_DIRECTORY_NAME" ]; then
        rm -rf $DESTINATION_ON_CLOUDSHELL/${PGINV_DIRECTORY_NAME}_backup
        mv -f $DESTINATION_ON_CLOUDSHELL/$PGINV_DIRECTORY_NAME $DESTINATION_ON_CLOUDSHELL/${PGINV_DIRECTORY_NAME}_backup && rm -rf $DESTINATION_ON_CLOUDSHELL/$PGINV_DIRECTORY_NAME
    fi
    # copy to cloudshell
    gcloud compute scp --recurse --project tecfo-psql-ops-blue-dev-c923 $USER_ON_APP_SERVER@$APP_SERVER:$DESTINATION_ON_APP_SERVER/$PGINV_DIRECTORY_NAME $DESTINATION_ON_CLOUDSHELL --zone europe-west3-c --tunnel-through-iap
    # install correct node version
    source $NVM_DIR/nvm.sh
    nvm install 12.22.12
}

while getopts cs opt
do
   case $opt in
	c)
	CLOUD2SERVER=TRUE
	;;
	s)
	SERVER2CLOUD=TRUE
	;;
	*)
	usage
	;;
   esac
done

if [ -v $CLOUD2SERVER ] && [ -v $SERVER2CLOUD ]; then
	usage
else
	# check if env variables are set
    if [ ! -v $APP_SERVER ] && [ ! -v $USER_ON_APP_SERVER ] && [ ! -v $DESTINATION_ON_APP_SERVER ] && [ ! -v $DESTINATION_ON_CLOUDSHELL ] && [ ! -v $PGINV_DIRECTORY_NAME ]; then
        if [ ! -v $CLOUD2SERVER ]; then
		    cloud2server
	    fi
	    if [ ! -v $SERVER2CLOUD ]; then
		    server2cloud
	    fi
    else
        echo "Please set the following variables in .env file: APP_SERVER, USER_ON_APP_SERVER, DESTINATION_ON_APP_SERVER, DESTINATION_ON_CLOUDSHELL, PGINV_DIRECTORY_NAME"
    fi
fi