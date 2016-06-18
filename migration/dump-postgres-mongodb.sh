#!/usr/bin/env bash
echo "Data Migration: Postgres to MongoDB"

#dataId=1
#dataNum=1356171
#dataNum = 10

# Retrieve json from Postgres
#sourceURL="http://127.0.0.1:3000/dump/mongodb/movies/$dataId"
#echo $sourceURL

parallel -j 50 -k curl -s -H 'Accept: application/json' "http://127.0.0.1:3000/dump/mongodb/movies/{}" ::: $(seq 1 1 100)

#for i in $(seq 1 10); do
#   curl -s -H 'Accept: application/json' "http://127.0.0.1:3000/dump/mongodb/movies/"$i >> dump-postgres-mongodb/movies.json

#done

#200000

#for i in $(seq 1 200000) ; do echo $i ; done |
 #   (
   #     xargs -I{} -P 4 curl -s -H 'Accept: application/json' "http://127.0.0.1:3000/dump/mongodb/movies/{}"
  #  )

echo "DONE!!"

#echo $dataJSON
#echo "RETRIEVED"
# Send json to MOngoDB
#destinationURL="http://127.0.0.1:3100/movies"
#echo $destinationURL
#responseJSON=$(curl -H 'Content-Type: application/json' -X PUT -d "$dataJSON" "$destinationURL")

#echo "SENT"

#item=30
#total=70
#percent=$(awk "BEGIN { pc=100*${item}/${total}; i=int(pc); print (pc-i<0.5)?i:i+1 }")

#echo $percent
