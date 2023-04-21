#!/bin/bash
#
echo -e "\033[31;1m o2 chanells \033[0m"
curl -X GET \
  --no-progress-meter \
  --url "https://api.o2tv.cz/unity/api/v1/epg/depr/?forceLimit=true&limit=500" \
| jq -r '.epg.items[] | ["o2-\(.channel.weight)", .channel.channelKey, .channel.name, .channel.weight, "https://assets.o2tv.cz\(.channel.logoUrl)"] | join(",")' | sort -t, -k3 > csv/o2_chanell.csv
#
awk -F ',' '{print "    <channel lang=\"cz\" xmltv_id=\""$1"\""" site_id=\""$2"\""" logo=\""$5"\""">"$3"</channel>"}' csv/o2_chanell.csv  > channels/o2_chanell_.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" channels/o2_chanell_.xml
sed -i 2i"<site site=\"o2tv.tv\">" channels/o2_chanell_.xml
sed -i 3i"\ \ <channels>" channels/o2_chanell_.xml
echo "  </channels>" >> channels/o2_chanell_.xml
echo "</site>" >> channels/o2_chanell_.xml
#
sed -i 1i"xmltv_id,site_id,name,channelNumber,logoUrl" csv/o2_chanell.csv
echo "done"
