#!/bin/bash
echo -e "\033[31;1m upctv chanells \033[0m"
curl -X GET \
  --no-progress-meter \
  --connect-timeout 10 \
  --max-time 10 \
  --url "https://spark-prod-sk.gnp.cloud.upctv.sk/slk/web/linear-service/v2/channels?cityId=5&language=sk&productClass=Orion-DASH" \
| jq -r '.[] | ["upctv-\(.id)", .id, .name, .logicalChannelNumber, .logo.focused] | join(",")' | sort -t, -k3 > upctv.csv
#
sed -i 's/&/&amp;/g' csv/upctv.tv_sk.chanell.csv
awk -F ',' '{print "    <channel lang=\"sk\" xmltv_id=\""$1"\""" site_id=\""$2"\""" logo=\""$5"\""">"$3"</channel>"}' csv/upctv.tv_sk.chanell.csv > channels/upctv.tv_sk.channels.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" channels/upctv.tv_sk.channels.xml
sed -i 2i"<site site=\"upctv.tv\">" channels/upctv.tv_sk.channels.xml
sed -i 3i"\ \ <channels>" channels/upctv.tv_sk.channels.xml
echo "  </channels>" >> channels/upctv.tv_sk.channels.xml
echo "</site>" >> channels/upctv.tv_sk.channels.xml
#
sed -i 1i"xmltv_id,site_id,name,channelNumber,logoUrl" csv/upctv.tv_sk.chanell.csv
echo "done"