# Administration Guide
This guide goes deeper into the installation and administration part of the pg_inv. It covers topics like installation, configuration, logging and serves as a help for administrators.

**Table of contents**

- Requirements
- Configuration
- Installation
- Logging

## Requirements

The following requirements are needed to be able to run the application landscape on the target system.

- Server Requirements:
    - Node.js 12.22.12
    - postges client
    - jq shell application
    - curl
    - A valid TLS/SSL certificate for the target domain (e.g. pginv.cloud.internal) using the *.pfx* format
- Database Requirements:
    - PostgreSQL database and db-user with password.
- Firewall Requirements:
    - The server needs to be able to fetch data from the following URLs:
    - access to the PosgreSQL database
    - https://tokenmanager.intranet.commerzbank.com
    - https://tokenmanager-dev.intranet.commerzbank.com
    - https://api-int.intranet.commerzbank.com/it-management-api/2/v1/software-products/
    - https://api-int-dev.intranet.commerzbank.com:8065/it-management-api/2/v1/software-products/
- User Requirements:
    - The User needs the following access rights:
    - Read permissions for tecfo-psql-blue-dev
    - Read permissions for tecfo-psql-blue-tuc
    - Read permissions for tecfo-psql-blue-tud
    - Read permissions for tecfo-psql-blue-prd
    - permissions to fetch data from Software Products API

> Info: The executing user needs sudo privilege to be able to start the frontend application which uses the port 443.

## Configuration
To be able to start the application landscape properly, we first have to configure it. The single most important file for configuration is the `.env` file inside the root directory of the project. This file contains all configuration options for the different parts of the software.

The `.env` file does not exist initially. Rather, an example file (`.env.example`) exists that contains the same configuration keys with example values. We have to make a copy of this file and adjust the values.
```bash
cp .env.example .env
```
We can then edit the `.env` file and set the correct values for our target environment.
```bash
vim .env
```
The file content is shown below.
```bash
#========================================
#       Environment parameters
#========================================
ENVIRONMENT=dev

#========================================
#         Database parameter
#========================================
PGUSER=postgres
PGDATABASE= postgres
PGPASSWORD= postgres
PGHOST=localhost
PGPORT=5432
PGOPTIONS=--client-min-messages=warning
CRONTAB=0 23 * * *

#========================================
#         Dashboard parameters
#========================================
PORT=443
PATH_TO_PFX_FILE=./example.pfx
PFX_PASSPHRASE=examplepass

#========================================
#    architecture app parameters
#========================================
# OAuth2 Client ID (can be found at https://developer.intranet.commerzbank.com/dashboard/projects/<YOUR_PROJECT>)
CLIENT_ID=
# OAuth2 Client Secret used to identify the client
CLIENT_SECRET_PROD=
CLIENT_SECRET_DEV=
# Technical user used to fetch Data from the Software Products REST API
USERNAME=
# Password of the technical user
PASSWORD=

#========================================
#     copy repository parameters
#========================================
APP_SERVER=pg-inv-app-dev-01
USER_ON_APP_SERVER=eh2szvw_ztb_icb_commerzbank_com
DESTINATION_ON_APP_SERVER=/home/eh2szvw_ztb_icb_commerzbank_com
DESTINATION_ON_CLOUDSHELL=/home/eh2szvw
PGINV_DIRECTORY_NAME=pginv_repository
```
Every section inside the file relates to a different part of the software landscape. The *copy repository* section is only necessary for local development environments like the cloud shell and can be ignored.

## Installation
To install the application, we first have to make sure all requirements are met and the previous configuration step is done. To install the application landscape, we can simply use the pg_inv CLI. The CLI has a command called `pg_inv.sh install -i` that installs the complete landscape as well as configures the cronjobs. Further information on how to use the CLI can be found under [How to use the pg_inv cli](./how_to_use_pg_inv_cli.md)

## Logging
The application landscape has three logging targets.
1. The dashboard part of the landscape is managed using systemd. To see the logs, the following command can be used:
```bash
sudo journalctl -u pginv
```
2. During installation, all scripts write into a special database table called `log_infos.logging`.
3. During installation, all scripts also write to the syslog if an error occurs. To see the logs, the following command can be used:
```bash
sudo less /var/log/syslog
```

> Info: During data loading it can happen that the following error occurs (HTTPError 400):  
`
Dec 23 11:40:42 pg-inv-app-prd-01 eh2vav4_ztb_icb_commerzbank_com: LEVEL: ERROR, AFFECTED ELEMENT: Error occurs in script: ./load_databases.sh, line: 34, DESCRIPTION: ERROR: (gcloud.sql.databases.list) HTTPError 400: Invalid request: Invalid request since instance is not running.#012./error_handling.sh: line 15: warning: command substitution: ignored null byte in input, VARIABLES: LOAD_ALL=TRUE#012PROJECT_ID=tecfo-psql-blue-tuc-4edf#012INSTANCE_NAME=pg-01-43-71-test-devtotuc-02, SCAN_DATE:  2022-12-23 11:37:58.043737+00
`  
The error describes that database (or db-user) information of a certain instance could not be loaded. This is not a problem as instances that are stopped can (obviously) not be reached and therefore no database and user information can be fetched from these instances. The script will ignore these instances and move on fetching data. To gather information for these stopped instances, you can restart the instances and run the data loading procedure again. The missing infos should then be picked up by the script. To run the procedure outside the cronjob time, use the following command: `./pg_inv.sh data_loading -s`