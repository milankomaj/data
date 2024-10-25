#!/bin/bash
#
echo -e "\033[31;1m filmbox chanells \033[0m"
curl -X POST \
  --no-progress-meter \
  --url "https://gateway-api.prod.iprima.cz/json-rpc/" \
  -H 'Alt-Used: gateway-api.prod.iprima.cz' \
  -H 'Content-Type: application/json' \
  --data-raw '{"id":"web-1","jsonrpc":"2.0","method":"epg.channel.list","params":{}}' \
| jq -r '.result.data[] | [.playId, .id, .title, .playId, .additionals.logoColorPng] | join(",")' | sort -t, -k 1.6,1.7  > csv/iprima.cz.chanell.csv

#
awk -F ',' '{print "    <channel lang=\"cz\" xmltv_id=\""$1"\""" site_id=\""$2"\""" logo=\""$5"\""">"$3"</channel>"}' csv/iprima.cz.chanell.csv > channels/iprima_chanell.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" channels/iprima_chanell.xml
sed -i 2i"<site site=\"iprima.cz\">" channels/iprima_chanell.xml
sed -i 3i"\ \ <channels>" channels/iprima_chanell.xml
echo "  </channels>" >> channels/iprima_chanell.xml
echo "</site>" >> channels/iprima_chanell.xml
sed -i 's/&/&amp;/g' channels/iprima_chanell.xml
#
sed -i 1i"xmltv_id,site_id,name,playId,logoUrl" csv/iprima.cz.chanell.csv
