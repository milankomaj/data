#!/bin/bash
echo -e "\033[31;1m horizon chanells \033[0m"
curl -X GET \
  --no-progress-meter \
  --connect-timeout 10 \
  --max-time 10 \
  --url "https://legacy-dynamic.oesp.horizon.tv/oesp/v4/SK/slk/web/channels" \
| jq -r '.channels[] | ["horizon-\(.stationSchedules[0].station.serviceId)", .stationSchedules[0].station.id, .title, .channelNumber, (.stationSchedules[0].station.images | map(select(.assetType | contains ("station-logo-medium"))) | .[] .url)] | join(",")' | sort -t, -k3 > csv/horizon.tv_sk.chanell.csv
#
sed -i 's/&/&amp;/g' csv/horizon.tv_sk.chanell.csv
awk -F ',' '{print "    <channel lang=\"sk\" xmltv_id=\""$1"\""" site_id=\""$2"\""" logo=\""$5"\""">"$3"</channel>"}' csv/horizon.tv_sk.chanell.csv > channels/horizon.tv_sk.channels.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" channels/horizon.tv_sk.channels.xml
sed -i 2i"<site site=\"horizon.tv\">" channels/horizon.tv_sk.channels.xml
sed -i 3i"\ \ <channels>" channels/horizon.tv_sk.channels.xml
echo "  </channels>" >> channels/horizon.tv_sk.channels.xml
echo "</site>" >> channels/horizon.tv_sk.channels.xml
#
sed -i 1i"xmltv_id,site_id,name,channelNumber,logoUrl" csv/horizon.tv_sk.chanell.csv
echo "done"