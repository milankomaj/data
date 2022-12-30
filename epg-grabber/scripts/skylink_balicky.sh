#!/bin/bash
for lang in {sk/televizia-cez-satelit,cz/televize-pres-satelit}
do
for balicky in {multi,komplet}
do
echo "${lang}"
echo "${lang[@]::2}"
echo "${balicky}"

curl -X GET \
  --no-progress-meter \
  --url "https://web.scraper.workers.dev/?url=https://www.skylink."${lang}"/balicky/"${balicky}"&selector=.kanal&scrape=text&spaced=true&pretty=true" \
| jq -r '.result[]' > ${balicky}-${lang[@]::2}.tsv




sed -i '$ d' ${balicky}-${lang[@]::2}.tsv

sed -i "1s/.*/${balicky^^}-${lang[@]::2},/" ${balicky}-${lang[@]::2}.tsv
sed -i '/3sat HD/,$d' ${balicky}-${lang[@]::2}.tsv
sed -i 's/^[ \t]*//' ${balicky}-${lang[@]::2}.tsv
sed -i 's/\Iba Live TV\>//g' ${balicky}-${lang[@]::2}.tsv
sed -i 's/\Live TV\>//g' ${balicky}-${lang[@]::2}.tsv
sed -i 's/ "//g' ${balicky}-${lang[@]::2}.tsv
sed -i 's/"//g' ${balicky}-${lang[@]::2}.tsv
done
done
paste -d '' *.tsv > skylink.csv
