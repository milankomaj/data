#!/bin/bash
# jq -r '.channels[].stationSchedules[0].station | [.id, .title] | join(",")' > chanell.csv
# jq -r '.channels[] | [.stationSchedules[0].station.serviceId, .stationSchedules[0].station.id, .title, .channelNumber, (.stationSchedules[0].station.images | map(select(.assetType | contains ("station-logo-medium"))) | .[] .url)] | @csv' > chanell.csv
curl -X GET \
  --no-progress-meter \
  --url "https://legacy-dynamic.oesp.horizon.tv/oesp/v4/SK/slk/web/channels" \
| jq -r '.channels[] | [.stationSchedules[0].station.serviceId, .stationSchedules[0].station.id, .title, .channelNumber, (.stationSchedules[0].station.images | map(select(.assetType | contains ("station-logo-medium"))) | .[] .url)] | join(",")' > sites/horizon.tv_sk.chanell.csv
#
sed -i 's/&/and/g' sites/horizon.tv_sk.chanell.csv
awk -F ',' '{print "    <channel lang=\"sk\" xmltv_id=\""$1"\""" site_id=\"SK#slk#"$2"\""" logo=\""$5"\""">"$3"</channel>"}' sites/horizon.tv_sk.chanell.csv > sites/horizon.tv_sk.channels.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" sites/horizon.tv_sk.channels.xml
sed -i 2i"<site site=\"horizon.tv\">" sites/horizon.tv_sk.channels.xml
sed -i 3i"\ \ <channels>" sites/horizon.tv_sk.channels.xml
echo "  </channels>" >> sites/horizon.tv_sk.channels.xml
echo "</site>" >> sites/horizon.tv_sk.channels.xml
#
sed -i 1i"serviceId,id,title,channelNumber,station-logo-medium" sites/horizon.tv_sk.chanell.csv | sort -t, -nk1