#!/bin/bash

###################################
## AUTHOR:	Dustin Schulz, ORDIX AG
## DATE:	21.09.2022
## VERSION:	1.0
## PURPOSE:	Loads user data from gcloud command
###################################

set -E
echo "start $0"
trap 'error_handling $LINENO' err

error_handling() {
    export PG_INV_SCRIPTS_INSTANCE_NAME=$INSTANCE_NAME
    export PG_INV_SCRIPTS_PROJECT_ID=$PROJECT_ID
    export PG_INV_SCRIPTS_LOAD_ALL=$LOAD_ALL
    ./error_handling.sh "$TIMESTAMP" $0 $1 2>> tmp/error_handling.log
}

usage() {
    echo "load_users.sh gets the user data of an specific instance"
    echo
    echo "Options:"
    echo "-t set the timestamp"
    echo "-i set the instance name"
    echo "-p set the project ID"
    echo "-a load all users"
    exit
}

load_user() {
    rm -f tmp/users.json
    gcloud sql users list --instance="$INSTANCE_NAME" --project="$PROJECT_ID" --format=json 1> tmp/users.json # load data into file

    if test -s "tmp/users.json"; then # if file is not empty
        jq -c '.[]' tmp/users.json | while read i; do # goes through each user
	        USER_NAME=$(echo $i|jq -r '.name') # save user name into variable
            psql -c "insert into detail_infos.json_data_users (project, instance_name, user_name, json, scan_date) values ('$PROJECT_ID', '$INSTANCE_NAME', '$USER_NAME', '$i', '$TIMESTAMP')" # insert data into database
        done
    fi
}

load_all() {
    psql -t -c "
                select json_agg(json_build_object(
                            'instance_name', (instance_name),
                            'project', (project)
                        ))
                from instance_infos.sql_instances_latest
		" -o tmp/instances.json # save instance_name & project as JSON into file
    
    if cat tmp/instances.json | grep -q "\{"; then # check if file contains any JSON
        jq -c '.[]' tmp/instances.json | while read i; do # go through each JSON object
        PROJECT_ID=$(echo $i|jq -r '.project') # load project into variable
        INSTANCE_NAME=$(echo $i|jq -r '.instance_name') # load instance name into variable
	    load_user
        done
    else
        psql -c "insert into log_infos.logging (level, affected_element, description, scan_date, timestamp) values ('ERROR', 'script: ./load_users.sh', 'No instance data found in the database to get the user details', '$TIMESTAMP', current_timestamp)" # log error
	logger "LEVEL: ERROR, AFFECTED ELEMENT: script: ./load_users.sh, DESCRIPTION: No instance data found in the database to get the user details, SCAN_DATE: $TIMESTAMP"
    fi
}

while getopts i:p:at: opt
do
   case $opt in
       i) 
       INSTANCE_NAME=${OPTARG}
       ;;
       p)
       PROJECT_ID=${OPTARG}
       ;;
       a)
       LOAD_ALL=TRUE
       ;;
       t)
       TIMESTAMP=${OPTARG}
       ;;
       *)
       usage
       ;;
   esac
done

if [ -z "$TIMESTAMP" ]; then
    usage
elif [ ! -z "$LOAD_ALL" ]; then
    load_all
elif [ ! -z "$INSTANCE_NAME" ] && [ ! -z "$PROJECT_ID" ]; then
    load_user
else
    usage
fi
echo "end $0"
