#!/bin/bash
echo -e "\033[31;1m canalplus chanells \033[0m"
curl -X GET \
  --no-progress-meter \
  --url "https://hodor.canalplus.pro/api/v2/canalplusczsk/page/235f9f488c7edc28b83b8e5be41c9727/138178.json?aegon=true" \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:159.0) Gecko/20100101 Firefox/159.0' \
  -H 'Alt-Used: hodor.canalplus.pro' \
  -H 'Accept-Language: sk,en-US;q=0.9' \
  -H 'Content-Type: application/json' \
| jq -r '.channels[] | [.name,.altText,.name,.zapNumber,.URLLogoChannel] | join(",")' | sort -t, -k1 > csv/canalplus_chanell.csv
#
awk -F ',' '{print "     <channel lang=\"sk\" xmltv_id=\""$1"\""" site_id=\""$2"\""" logo=\""$5"\""">"$1"</channel>"}' csv/canalplus_chanell.csv  > channels/canalplus_chanell_.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" channels/canalplus_chanell_.xml
sed -i 2i"<site site=\"o2tv.tv\">" channels/canalplus_chanell_.xml
sed -i 3i"\ \ <channels>" channels/canalplus_chanell_.xml
echo "  </channels>" >> channels/canalplus_chanell_.xml
echo "</site>" >> channels/canalplus_chanell_.xml
sed -i 's/&/&amp;/g' channels/canalplus_chanell_.xml
#
sed -i 1i"xmltv_id,site_id,name,channelNumber,logoUrl" csv/canalplus_chanell.csv
