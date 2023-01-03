#!/bin/bash
echo -e "\033[31;1m skylink_balicky \033[0m"
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
sed -i 's/\ Pouze\>//g' ${balicky}-${lang[@]::2}.tsv
sed -i 's/ "//g' ${balicky}-${lang[@]::2}.tsv
sed -i 's/"//g' ${balicky}-${lang[@]::2}.tsv
awk -i inplace 'NR == 1; NR > 1 {print $0 | "sort -t, -k1"}' ${balicky}-${lang[@]::2}.tsv
done
done
paste -d '' *.tsv | awk -F, '{NF=4}1' OFS="," > csv/skylink_balicky.csv
echo "done"
