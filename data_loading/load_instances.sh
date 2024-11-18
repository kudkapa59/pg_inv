#!/bin/bash

###################################
## AUTHOR:	Dustin Schulz, ORDIX AG
## DATE:	21.09.2022
## VERSION:	1.0
## PURPOSE:	Loads instance data from bigquery
###################################

set -E
echo "start $0"
trap 'error_handling $LINENO' err

error_handling() {
    export PG_INV_SCRIPTS_INSTANCE_NAME=$INSTANCE_NAME
    export PG_INV_SCRIPTS_PROJECT_ID=$PROJECT_ID
    ./error_handling.sh "$TIMESTAMP" $0 $1
}

usage() {
    echo "load_instances.sh gets the data of an specific instance"
    echo
    echo "Options:"
    echo "-t set the timestamp"
    echo "-i set the instance name"
    echo "-p set the project ID"
    exit
}

while getopts t: opt
do
   case $opt in
       t)
       TIMESTAMP=${OPTARG}
       ;;
       *)
       usage
       ;;
   esac
done

### OLD VERSION WITH BIGQUERY ###
#bq query --nouse_legacy_sql --format=prettyjson 'SELECT resource.data FROM service-monitoring-prd.asset_export_014371.view_asset_export_014371 where asset_type="sqladmin.googleapis.com/Instance";' > tmp/instances_from_bq.json # load instances from bigquery into file

#if test -s "tmp/instances_from_bq.json"; then # if file is not empty
#    jq -c '.[]' tmp/instances_from_bq.json | while read -r i; do # goes through each instance
#        INSTANCE_NAME=$(echo $i | jq -r '.data | fromjson | .name') # save instance name into variable
#        PROJECT_ID=$(echo $i | jq -r '.data | fromjson | .project') # save project ID into variable
#        JSON=$(echo $i | jq '.data | fromjson') # save user name into variable
#        psql -c "insert into instance_infos.json_data (instance_name, project, json, scan_date) values ('$INSTANCE_NAME', '$PROJECT_ID', '$JSON', '$TIMESTAMP')" # insert data into database
#    done
#else
#    psql -c "insert into log_infos.logging (level, affected_element, description, scan_date, timestamp) values ('ERROR', 'instance_infos.json_data', 'Could not find instance-data in json file', '$TIMESTAMP', current_timestamp)" # log error
#fi
######

for instances in tecfo-psql-blue-dev-2397 tecfo-psql-blue-tuc-4edf tecfo-psql-blue-tud-412e tecfo-psql-blue-prd-825b; do
	gcloud sql instances list --project $instances --format="json" > tmp/instances_from_gcloud_$instances.json # load instances from gcloud

	if test -s "tmp/instances_from_gcloud_$instances.json"; then # if file is not empty
		jq -c '.[]' tmp/instances_from_gcloud_$instances.json | while read -r i; do # goes through each instance
			INSTANCE_NAME=$(echo $i | jq -r '.name') # save instance name into variable
			PROJECT_ID=$(echo $i | jq -r '.project') # save project ID into variable
			JSON=$(echo $i) # save user name into variable
			psql -c "insert into instance_infos.json_data (instance_name, project, json, scan_date) values ('$INSTANCE_NAME', '$PROJECT_ID', '$JSON', '$TIMESTAMP')" # insert data into database
		done
	else
    		psql -c "insert into log_infos.logging (level, affected_element, description, scan_date, timestamp) values ('ERROR', 'instance_infos.json_data', 'Could not find instance-data in json file', '$TIMESTAMP', current_timestamp)" # log error
		logger "LEVEL: ERROR, AFFECTED ELEMENT: instance_infos.json_data, DESCRIPTION: Could not find instance-data in json file, SCAN_DATE: $TIMESTAMP"
	fi
done

echo "end $0"
