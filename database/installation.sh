#!/bin/bash

###################################
## AUTHOR:	Dustin Schulz, ORDIX AG
## DATE:	21.09.2022
## VERSION:	1.0
## PURPOSE:	Manage (de)installation & sample data for database
###################################

usage() {
    echo "database"
    echo
    echo "Options:"
    echo "-d deinstall database schemata"
    echo "-i install database schemata"
    echo "-s insert sample data"
    echo "-o delete logs older than 30 days"
    exit
}

install_schemata() {
    psql -f postgres_scripts/ddl/ddl_instances.plpgsql
    psql -f postgres_scripts/ddl/ddl_applications.plpgsql
    psql -f postgres_scripts/ddl/ddl_details.plpgsql
    psql -f postgres_scripts/ddl/ddl_logs.plpgsql
    psql -f postgres_scripts/package/provide_json_elements.plpgsql
    psql -f postgres_scripts/package/restructure_data.plpgsql
    psql -f postgres_scripts/package/insert_application_data.plpgsql
    psql -f postgres_scripts/package/insert_database_data.plpgsql
    psql -f postgres_scripts/package/insert_instance_data.plpgsql
    psql -f postgres_scripts/package/insert_user_data.plpgsql
    psql -f postgres_scripts/ddl/trigger.pgplsql
}

sample_data() {
    psql -f postgres_scripts/sample_data/sample_data_instance.plpgsql
    psql -f postgres_scripts/sample_data/sample_data_applications.plpgsql
    psql -f postgres_scripts/sample_data/sample_data_applications2.plpgsql
    psql -f postgres_scripts/sample_data/sample_data_databases.plpgsql
    psql -f postgres_scripts/sample_data/sample_data_users.plpgsql
    echo "sample data is inserted"
}

clean_database() {
    psql -c "drop schema log_infos cascade"
    psql -c "drop schema instance_infos cascade"
    psql -c "drop schema detail_infos cascade"
    psql -c "drop schema application_infos cascade"
    psql -c "drop schema data_processing_pkg cascade"
}

delete_logs() {
    psql -c "call log_infos.delete_old_logs()"
}

while getopts diso opt
do
   case $opt in
	d)
	DEINSTALLATION=TRUE
	;;
	i)
	INSTALLATION=TRUE
	;;
	s)
	SAMPLE_DATA=TRUE
	;;
	o)
	DELETE_LOGS=TRUE
	;;
	*)
	usage
	;;
   esac
done

if [ -v $DEINSTALLATION ] && [ -v $INSTALLATION ] && [ -v $SAMPLE_DATA ] && [ -v $DELETE_LOGS ]; then
	usage
else
	if [ ! -v $DEINSTALLATION ]; then
		#echo deinstallation
		clean_database
	fi

	if [ ! -v $INSTALLATION ]; then
		#echo installation
		install_schemata
	fi

	if [ ! -v $SAMPLE_DATA ]; then
		#echo sample_data
		sample_data
	fi

	if [ ! -v $DELETE_LOGS ]; then
		delete_logs
	fi
fi
