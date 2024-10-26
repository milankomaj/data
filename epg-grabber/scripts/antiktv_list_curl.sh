#!/bin/bash

curl 'https://api.webtv.sk/channels' --compressed -X POST \
 --no-progress-meter \
 -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0' \
 -H 'Content-Type: application/json' \
 -H 'Sec-Fetch-Site: cross-site' \
 --data-raw '{"type":"TV","channels_content":null}'\
| jq -r '.data[] | select(.meta.epg == true) | [.id, .id_content, .name, .seq, .logo] | join(",")' | sort -t, -k3 > csv/antiktv_sk.chanell.csv
#
awk -F ',' '{print "    <channel lang=\"sk\" xmltv_id=\""$1"\""" site_id=\""$2"\""" logo=\""$5"\""">"$3"</channel>"}' csv/antiktv_sk.chanell.csv > channels/antiktv.sk.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" channels/antiktv.sk.xml
sed -i 2i"<site site=\"antiktv.sk\">" channels/antiktv.sk.xml
sed -i 3i"\ \ <channels>" channels/antiktv.sk.xml
echo "  </channels>" >> channels/antiktv.sk.xml
echo "</site>" >> channels/antiktv.sk.xml
sed -i 's/&/&amp;/g' channels/antiktv.sk.xml
#
sed -i 1i"xmltv_id,site_id,name,channelNumber,logoUrl" csv/antiktv_sk.chanell.csv