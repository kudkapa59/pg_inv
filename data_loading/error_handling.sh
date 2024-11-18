#!/bin/bash

###################################
## AUTHOR:	Dustin Schulz, ORDIX AG
## DATE:	21.09.2022
## VERSION:	1.0
## PURPOSE:	Manage the emerging errors of scripts from data loading
###################################

echo "start $0"
echo "error: $1 $2 $3"
# setting parameters into variables
TIMESTAMP=$1
AFFECTED_ELEMENT="Error occurs in script: $2, line: $3"
DESCRIPTION_PART1=$(cat tmp/error.log) # gets the error
DESCRIPTION_PART2=$(env | grep "PG_INV_SCRIPTS_" | sed 's/PG_INV_SCRIPTS_//') # gets the current variable values when an error occurs without the prefix 'PG_INV_SCRIPTS_'
DESCRIPTION=$(echo -e "$DESCRIPTION_PART1 \\n===============================\\nVARIABLE VALUES AT THAT MOMENT\\n===============================\\n$DESCRIPTION_PART2")
echo $DESCRIPTION_PART1 >> tmp/error_history.log
#echo $DESCRIPTION
#echo $AFFECTED_ELEMENT
#echo $TIMESTAMP

if test -s "tmp/error.log"; then # if file is not empty
    truncate -s 0 tmp/error.log # clear file
    psql -c "insert into log_infos.logging (level, affected_element, description, scan_date, timestamp) values ('ERROR', '$AFFECTED_ELEMENT', '${DESCRIPTION//\'/\'\'}', '$TIMESTAMP', current_timestamp)" # insert error
    logger "LEVEL: ERROR, AFFECTED ELEMENT: $AFFECTED_ELEMENT, DESCRIPTION: ${DESCRIPTION_PART1//\'/\'\'}, VARIABLES: $DESCRIPTION_PART2, SCAN_DATE: $TIMESTAMP"
else
    # every error is passed through to the top level. But only deepest level should be reported. Higher levels will be ignored
    echo "error.log ist leer -> Folgefehler"
fi

unset $(compgen -v | grep "PG_INV_SCRIPTS_") # unsets the current variable values
env | grep "PG_INV_SCRIPTS_"
echo "end $0"
