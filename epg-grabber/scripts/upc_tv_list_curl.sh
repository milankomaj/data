#!/bin/bash
echo -e "\033[31;1m upctv chanells \033[0m"
curl -X GET \
  --no-progress-meter \
  --connect-timeout 10 \
  --max-time 10 \
  --url "https://spark-prod-sk.gnp.cloud.upctv.sk/slk/web/linear-service/v2/channels?cityId=5&language=sk&productClass=Orion-DASH" \
| jq -r '.[] | ["upctv-\(.id)", .id, .name, .logicalChannelNumber, .logo.focused] | join(",")' | sort -t, -k3 > csv/upc.tv_sk.chanell.csv
#
sed -i 's/&/&amp;/g' csv/upc.tv_sk.chanell.csv
awk -F ',' '{print "    <channel lang=\"sk\" xmltv_id=\""$1"\""" site_id=\""$2"\""" logo=\""$5"\""">"$3"</channel>"}' csv/upc.tv_sk.chanell.csv > channels/upc.tv_sk.channels.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" channels/upc.tv_sk.channels.xml
sed -i 2i"<site site=\"upctv.sk\">" channels/upc.tv_sk.channels.xml
sed -i 3i"\ \ <channels>" channels/upc.tv_sk.channels.xml
echo "  </channels>" >> channels/upc.tv_sk.channels.xml
echo "</site>" >> channels/upc.tv_sk.channels.xml
#
sed -i 1i"xmltv_id,site_id,name,channelNumber,logoUrl" csv/upc.tv_sk.chanell.csv
echo "done"