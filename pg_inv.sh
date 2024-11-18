#!/bin/bash

###################################
## AUTHOR:	Dustin Schulz, ORDIX AG
## DATE:	21.09.2022
## VERSION:	1.0
## PURPOSE:	pg_inv CLI to manage every functionality
###################################

# Absolute path to this script, e.g. /home/user/bin/foo.sh
SCRIPT=$(readlink -f "$0")
# Absolute path this script is in, thus /home/user/bin
SCRIPTPATH=$(dirname "$SCRIPT")
export SCRIPTPATH
cd $SCRIPTPATH

usage() {
    echo "pg_inv.sh"
    echo
    echo "Parameters:"
    echo "database"
    echo "dashboard"
    echo "data_loading"
    echo "install"
    echo "dev (for cloudshell-development)"
    echo "copy_repository (for cloudshell-development)"
    echo
    echo "Enter 'pg_inv.sh [parameter]' to display options"
    #exit
}

load_env() {
    set -a
    # loading values from ".env" into environment
    source <(cat .env | sed -e '/^#/d;/^\s*$/d' -e "s/'/'\\\''/g" -e "s/=\(.*\)/='\1'/g") # regexp e.g. for filtering comment lines
    set +a
}

load_env 

if [ "$1" = "database" ]; then
	shift
	cd database && ./installation.sh $@
elif [ "$1" = "dashboard" ]; then
	shift
	cd dashboard && ./installation.sh $@
elif [ "$1" = "data_loading" ]; then
	shift
	cd data_loading && ./installation.sh $@
elif [ "$1" = "install" ]; then
	shift
	cd other_scripts && ./installation.sh $@
elif [ "$1" = "dev" ]; then
	shift
    cd other_scripts && ./manage_dev.sh $@
elif [ "$1" = "copy_repository" ]; then
    shift
	cd other_scripts && ./copy_repository.sh $@    
else
	usage
fi
