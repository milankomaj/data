#!/bin/bash
curl -s https://datasets.imdbws.com/title.ratings.tsv.gz | gunzip >> data.tsv
awk 'length($3) >= 6' data.tsv > numVotes_6+.csv 
awk '($2) >= 9.0' numVotes_6+.csv >  numVotes_6+averageRating_9+.csv 
awk 'length($3) >= 5&&($2) >= 9.5' data.tsv > imdb.csv
wc -l imdb.csv

