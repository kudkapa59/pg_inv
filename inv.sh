#!/bin/bash

#./pg_inv.sh install -i
./pg_inv.sh dashboard -bs
#install the database schema
#./pg_inv.sh database -i
#install the data_loading (creates the cronjobs)
#./pg_inv.sh data_loading -i
#install the dashboards
# ./pg_inv.sh dashboard -i
#testing the data_loading
#./pg_inv.sh data_loading -s


#./pg_inv.sh dev -s
