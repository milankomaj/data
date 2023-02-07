#!/bin/bash
#
#
echo -e "\033[31;1m r-chanells \033[0m"
for Rchanells in {horizon,o2,mujtvprogram}
do
echo "r-${Rchanells}"

curl -X GET \
  --connect-timeout 20 \
  --max-time 20 \
  --no-progress-meter \
  --url $(echo $env_var/r-${Rchanells}) \
| jq '.[] | del(.prefix)  | join(",")'  | tr -d $'\r' | sort -t, -k3  > r-${Rchanells}.tsv

sed -i 's/\"//g' r-${Rchanells}.tsv
sed -i 's/&/and/g' r-${Rchanells}.tsv
sed -i '/^[[:space:]]*$/d' r-${Rchanells}.tsv
awk -F ',' '{print "    <channel lang=\"sk\" xmltv_id=\""$1"\""" site_id=\""$2"\""" logo=\""$5"\""">"$3"</channel>"}' r-${Rchanells}.tsv > channels/r-${Rchanells}.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" channels/r-${Rchanells}.xml
sed -i 2i"<site site=\"${Rchanells}.tv\">" channels/r-${Rchanells}.xml
sed -i 3i"\ \ <channels>" channels/r-${Rchanells}.xml
echo "  </channels>" >> channels/r-${Rchanells}.xml
echo "</site>" >> channels/r-${Rchanells}.xml
awk -F ',' '{print $1","$2","$3","$4","$5}' r-${Rchanells}.tsv > csv/r-${Rchanells}.csv
sed -i 1i"xmltv_id,site_id,name,channelNumber,logoUrl" csv/r-${Rchanells}.csv
done
echo "done"