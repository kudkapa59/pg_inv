#!/bin/bash

###################################
## AUTHOR:	Dustin Schulz, ORDIX AG
## DATE:	21.09.2022
## VERSION:	1.0
## PURPOSE:	Loads database data from gcloud command
###################################

set -E
echo "start $0"
trap 'error_handling $LINENO' err

error_handling() {
    export PG_INV_SCRIPTS_INSTANCE_NAME=$INSTANCE_NAME
    export PG_INV_SCRIPTS_PROJECT_ID=$PROJECT_ID
    export PG_INV_SCRIPTS_LOAD_ALL=$LOAD_ALL
    ./error_handling.sh "$TIMESTAMP" $0 $1
}

usage() {
    echo "load_databases.sh gets the database data of an specific instance"
    echo
    echo "Options:"
    echo "-t set the timestamp"
    echo "-i set the instance name"
    echo "-p set the project ID"
    echo "-a load all databases"
    exit
}

load_database() {
    rm -f tmp/databases.json
    gcloud sql databases list --instance="$INSTANCE_NAME" --project="$PROJECT_ID" --format=json > tmp/databases.json # load data into file

    if test -s "tmp/databases.json"; then # if file is not empty
        jq -c '.[]' tmp/databases.json | while read i; do # goes through each database
	        DATABASE_NAME=$(echo $i|jq -r '.name') # save database name into variable
            psql -c "insert into detail_infos.json_data_databases (project, instance_name, database_name, json, scan_date) values ('$PROJECT_ID', '$INSTANCE_NAME', '$DATABASE_NAME', '$i', '$TIMESTAMP')" # insert data into database
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
        load_database
        done
    else
        psql -c "insert into log_infos.logging (level, affected_element, description, scan_date, timestamp) values ('ERROR', 'script: ./load_databases.sh', 'No instance data found in the database to get the database details', '$TIMESTAMP', current_timestamp)" # log error
	logger "LEVEL: ERROR, AFFECTED ELEMENT: script: ./load_databases.sh, DESCRIPTION: No instance data found in the database to get the database details, SCAN_DATE: $TIMESTAMP"
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
    load_database
else
    usage
fi
echo "end $0"
