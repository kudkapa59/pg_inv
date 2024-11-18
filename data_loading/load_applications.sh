#!/bin/bash

###################################
## AUTHOR:	Dustin Schulz, ORDIX AG
## DATE:	21.09.2022
## VERSION:	1.0
## PURPOSE:	Loads application data from Architecture-App
###################################

set -E
echo "start $0"
trap 'error_handling $LINENO' err

error_handling() {
    export PG_INV_SCRIPTS_JSON=$JSON
    export PG_INV_SCRIPTS_PRODUCT_NR=$PRODUCT_NR
    export PG_INV_SCRIPTS_JWT=$JWT
    export PG_INV_SCRIPTS_i=$i
    ./error_handling.sh "$TIMESTAMP" $0 $1
}

usage() {
    echo "load_applications.sh gets the data of all relevant applications"
    echo
    echo "Options:"
    echo "-t set the timestamp"
    exit
}

get_token() {
    if [ $ENVIRONMENT = prod ]; then
        curl --fail --insecure \
        https://tokenmanager.intranet.commerzbank.com/auth/realms/internal/protocol/openid-connect/token \
        --header "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=password" \
        -d "client_id=$CLIENT_ID" \
        -d "client_secret=$CLIENT_SECRET_PROD" \
        -d "username=$USERNAME" \
        -d "password=$PASSWORD" > tmp/token

        PATH_TO_FILE_WITH_CORIA_IDS=tmp/coria_ids.json # real data in this file for prod
    else
        curl --fail --insecure \
        https://tokenmanager-dev.intranet.commerzbank.com/auth/realms/internal/protocol/openid-connect/token \
        --header "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=password" \
        -d "client_id=$CLIENT_ID" \
        -d "client_secret=$CLIENT_SECRET_DEV" \
        -d "username=$USERNAME" \
        -d "password=$PASSWORD" > tmp/token

        PATH_TO_FILE_WITH_CORIA_IDS=tmp/coria_ids2.json # test data in this file for dev
    fi
    export JWT=$(jq -r ."access_token" tmp/token) # save token into variable "JWT"
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

# check if env variables are set
if [ ! -v $CLIENT_ID ] && ([ ! -v $CLIENT_SECRET_PROD ] || [ ! -v $CLIENT_SECRET_DEV ]) && [ ! -v $USERNAME ] && [ ! -v $PASSWORD ]; then
    get_token

    psql -t -o tmp/coria_ids.json -c "with coria_ids as (select distinct user_labels->>'coba_coria' as coria from instance_infos.sql_instances_latest where user_labels->>'coba_coria' is not null) select json_agg(substring(coria,1,2) || '-' || substring(coria,3,2) || '-' || substring(coria,5,2)) from coria_ids;" # save coria id's to file

    if test -s $PATH_TO_FILE_WITH_CORIA_IDS; then # if file is not empty
        jq -c -r '.[]' $PATH_TO_FILE_WITH_CORIA_IDS | while read -r i; do # goes through each Coria ID
            # reset files and variables
            rm -f tmp/application_infos.json
            unset JSON
            unset PRODUCT_NR
            if [ $ENVIRONMENT = prod ]; then
                curl --fail --insecure \
                https://api-int.intranet.commerzbank.com/it-management-api/2/v1/software-products/$i?showUserDetails=true \
                --header "Authorization: Bearer $JWT" > tmp/application_infos.json # save data to json file
            else
                curl --fail --insecure \
                https://api-int-dev.intranet.commerzbank.com:8065/it-management-api/2/v1/software-products/$i?showUserDetails=true \
                --header "Authorization: Bearer $JWT" > tmp/application_infos.json # save data to json file
            fi
	    if test -s "tmp/application_infos.json"; then # if file is not empty
            	# set variables with JSON data
            	JSON=$(cat tmp/application_infos.json)
            	PRODUCT_NR=$(echo $JSON | jq -r '.id')
            	psql -c "insert into application_infos.json_data (product_nr, json, scan_date) values ('$PRODUCT_NR', '$JSON', '$TIMESTAMP')" # insert data into database
            fi
	    sleep 65
	    get_token
        done
        sleep 65
    else
        psql -c "insert into log_infos.logging (level, affected_element, description, scan_date, timestamp) values ('ERROR', 'instance_infos.json_data', 'Could not find coria IDs in json file tmp/coria_ids.json', '$TIMESTAMP', current_timestamp)" # log error
	logger "LEVEL: ERROR, AFFECTED ELEMENT: instance_infos.json_data, DESCRIPTION: Could not find coria IDs in json file tmp/coria_ids.json, SCAN_DATE: $TIMESTAMP"
    fi
else
    echo "Please set the following variables in .env file: CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD"
fi

echo "end $0"
