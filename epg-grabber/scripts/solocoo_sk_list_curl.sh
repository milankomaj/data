#!/bin/bash
echo "${{ env.token_CZ }}"
curl -X GET \
 --no-progress-meter \
 --connect-timeout 10 \
 --max-time 10 \
 --url 'https://tvapi.solocoo.tv/v1/bouquet' \
 -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0' \
 -H 'Accept: application/json, text/plain, */*' \
 -H 'Accept-Language: sk,en-US;q=0.5' \
 -H 'Accept-Encoding: gzip, deflate, br' \
 -H "Authorization: Bearer ${{ env.token_CZ }}"\
 -H 'Origin: https://livetv.skylink.sk' \
 -H 'DNT: 1' \
 -H 'Sec-GPC: 1' \
 -H 'Connection: keep-alive' \
 -H 'Referer: https://livetv.skylink.sk/' \
 -H 'Sec-Fetch-Dest: empty' \
 -H 'Sec-Fetch-Mode: cors' \
 -H 'Sec-Fetch-Site: cross-site' \
 -H 'TE: trailers' \
| jq -r '.channels[] | ["skylink_sk-\(.assetInfo.params.lcn)", .assetInfo.id, .assetInfo.title, .assetInfo.params.lcn, .assetInfo.images[0].url]'
