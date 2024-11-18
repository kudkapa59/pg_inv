FROM postgres:14.3

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*;

WORKDIR /home/pg_inv

RUN mkdir postgres_scripts

COPY postgres_scripts postgres_scripts
COPY installation.sh installation.sh

RUN echo "/home/pg_inv/installation.sh -i -s" > /docker-entrypoint-initdb.d/set_up_database.sh
RUN chmod +x /docker-entrypoint-initdb.d/set_up_database.sh