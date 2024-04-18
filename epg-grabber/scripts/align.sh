#!/bin/bash
# awk -F',' 'NR==FNR && FNR>1 {ids[$2]; next} $3 in ids' ids.csv data.csv > out.csv
# ...cca
echo -e "\033[31;1m align \033[0m"

firmware=$(echo $(basename $(pwd)/samsungTV-Q/*/))
echo ${firmware}

for chanells in {solocoo.tv_cz.chanell,solocoo.tv_sk.chanell}
do
echo "${chanells}"

sed -i "s/;/,/g" samsungTV-Q/*/*.txt

awk -F',' 'NR==FNR{ids[tolower($2)]; next} tolower($3) in ids' samsungTV-Q/*/dvbs-satelit-*-.txt csv/${chanells}.csv > samsungTV-Q/align-${chanells}-${firmware}.csv
sed -i 1i"xmltv_id,site_id,name,channelNumber,logoUrl" samsungTV-Q/align-${chanells}-${firmware}.csv
done
echo "done"