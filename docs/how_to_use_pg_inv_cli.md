# PG_INV CLI

With this CLI common administration tasks of the inventory can be done. The CLI is divided into several scripts, which are located in the corresponding folders. However, only the main script in the top folder is needed for execution (pg_inv.sh).

## Table of contents
- Command overview
- How to install the application
- How to uninstall the application

## Command overview
When calling the CLI, parameters and options can be specified. The following parameters are available:
- database
- dashboard
- data_loading
- install
- dev (only for development, no administration)
- copy_repository (only for development, no administration)

Each parameter can be executed without options to get a list + explanation of all possible options.

## How to install the application
After the entire application folder has been copied to the target system, the *.env* file must be created at the top level. The *.env.example* file can be used for this purpose.

The next step is to install the application. This is done in three steps:
1. install the database schema\
*./pg_inv.sh database -i*
2. install the data_loading (creates the cronjobs)\
*./pg_inv.sh data_loading -i*
3. install the dashboards\
*./pg_inv.sh dashboard -i*\
The dashboard is also started here directly as systemd service (pginv)!

These three steps can also be done in one step with the following command/
*./pg_inv.sh install -i*\

For testing the data_loading can also be started manually. But the cronjob also starts it automatically at 11pm:\
*./pg_inv.sh data_loading -s*

## How to uninstall the application
Uninstalling is done in three steps:
1. uninstall the database schema\
*./pg_inv.sh database -d*
2. uninstall the data_loading (removes the cronjobs)\
*./pg_inv.sh data_loading -d*
3. uninstalling the dashboards\
*./pg_inv.sh dashboard -i*\
The systemd service (pginv) is also stopped and removed here!

These three steps can also be done in one step with the following command/
*./pg_inv.sh install -d*\
