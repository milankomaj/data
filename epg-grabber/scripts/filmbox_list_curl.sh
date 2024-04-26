#!/bin/bash
#
echo -e "\033[31;1m filmbox chanells \033[0m"
date=$(date +%F)
curl -X GET \
  --no-progress-meter \
  --url "https://www.sledujfilmbox.sk/epg/data/?date=${date}" \
| jq -r '.data[] | ["filmbox-\(.order)", .tv_id, .tv_name,  .order, "https://c.sledujfilmbox.cz/files/epg/tv/\(.tv_id).png"] | join(",")' | sort -nt, -k2 > csv/filmbox_chanell.csv

#
awk -F ',' '{print "    <channel lang=\"cz\" xmltv_id=\""$1"\""" site_id=\""$2"\""" logo=\""$5"\""">"$3"</channel>"}' csv/filmbox_chanell.csv > channels/filmbox_chanell.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" channels/filmbox_chanell.xml
sed -i 2i"<site site=\"sledujfilmbox.sk\">" channels/filmbox_chanell.xml
sed -i 3i"\ \ <channels>" channels/filmbox_chanell.xml
echo "  </channels>" >> channels/filmbox_chanell.xml
echo "</site>" >> channels/filmbox_chanell.xml
sed -i 's/&/&amp;/g' channels/filmbox_chanell.xml
#
sed -i 1i"xmltv_id,site_id,name,channelNumber,logoUrl" csv/filmbox_chanell.csv