#!/bin/bash
# awk -F',' 'NR==FNR && FNR>1 {ids[$2]; next} $3 in ids' ids.csv data.csv > out.csv

for chanells in {solocoo.tv_cz.chanell,solocoo.tv_sk.chanell}
do
echo "${chanells}"

sed -i "s/;/,/g" *.txt
awk -F',' 'NR==FNR{ids[tolower($2)]; next} tolower($3) in ids' "samsungTV-Q/*/dvbs-satelit-*-.txt" csv/${chanells}.csv > samsungTV-Q/align-${chanells}.csv

done
echo "done"