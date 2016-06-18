#!/usr/bin/env bash

mongoimport -j 16 -d wdm -c movies dump-postgres-mongodb/movies.json