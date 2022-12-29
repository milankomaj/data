#!/bin/bash
# 
echo -e "\033[31;1m horizon chanells \033[0m"
curl -X GET \
  --no-progress-meter \
  --url "https://legacy-dynamic.oesp.horizon.tv/oesp/v4/SK/slk/web/channels" \
| jq -r '.channels[] | ["horizon-\(.stationSchedules[0].station.serviceId)", .stationSchedules[0].station.id, .title, .channelNumber, (.stationSchedules[0].station.images | map(select(.assetType | contains ("station-logo-medium"))) | .[] .url)] | join(",")' > sites/horizon.tv_sk.chanell.csv
#
sed -i 's/&/and/g' sites/horizon.tv_sk.chanell.csv
awk -F ',' '{print "    <channel lang=\"sk\" xmltv_id=\""$1"\""" site_id=\"SK#slk#"$2"\""" logo=\""$5"\""">"$3"</channel>"}' sites/horizon.tv_sk.chanell.csv > sites/horizon.tv_sk.channels.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" sites/horizon.tv_sk.channels.xml
sed -i 2i"<site site=\"horizon.tv\">" sites/horizon.tv_sk.channels.xml
sed -i 3i"\ \ <channels>" sites/horizon.tv_sk.channels.xml
echo "  </channels>" >> sites/horizon.tv_sk.channels.xml
echo "</site>" >> sites/horizon.tv_sk.channels.xml
#
sed -i 1i"xmltv_id,site_id,name,channelNumber,logoUrl" sites/horizon.tv_sk.chanell.csv | sort -t, -nk4