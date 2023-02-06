#!/bin/bash
#
#
echo -e "\033[31;1m r-chanells \033[0m"
for Rchanells in {r-horizon,r-o2,r-mujtvprogram}
do
echo "${Rchanells}"
mask=$(echo ::add-mask::$env_var)

curl -X GET \
  --connect-timeout 20 \
  --max-time 20 \
  --no-progress-meter \
  --url $(echo $mask/${Rchanells}) \
| jq '.[] | del(.prefix)  | join(",")'  | tr -d $'\r' | sort -t, -k3  > ${Rchanells}.tsv

sed -i 's/\"//g' ${Rchanells}.tsv
sed -i 's/&/and/g' ${Rchanells}.tsv
sed -i '/^[[:space:]]*$/d' ${Rchanells}.tsv
awk -F ',' '{print "    <channel lang=\"sk\" xmltv_id=\""$1"\""" site_id=\""$2"\""" logo=\""$5"\""">"$3"</channel>"}' ${Rchanells}.tsv > channels/${Rchanells}.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" channels/${Rchanells}.xml
sed -i 2i"<site site=\"${Rchanells}.tv\">" channels/${Rchanells}.xml
sed -i 3i"\ \ <channels>" channels/${Rchanells}.xml
echo "  </channels>" >> channels/${Rchanells}.xml
echo "</site>" >> channels/${Rchanells}.xml
sed 1i"xmltv_id,site_id,name,channelNumber,logoUrl" ${Rchanells}.tsv > csv/${Rchanells}.csv
done
