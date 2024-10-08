#!/bin/bash
# rm guide/units.guide.xml
echo -e "\033[31;1m units \033[0m"


timestamp=$(date +"%Y%m%d")
head="<?xml version=\"1.0\" encoding=\"UTF-8\"?><tv date=\"$timestamp\">"

for guide in {unit2.guide.xml,unit1.guide.xml,unit3.guide.xml}
do
string=\<channel
echo "${guide} - ${string}"
grep -E $string guide/$guide >> guide/units.guide.xml
done


for guide in {unit2.guide.xml,unit1.guide.xml,unit3.guide.xml}
do
string=\<programme
echo "${guide} - ${string}"
grep -E $string guide/$guide >> guide/units.guide.xml
done

sed -i 1i"$head" guide/units.guide.xml
echo "</tv>" >> guide/units.guide.xml
sed -i 's/http\:/https\:/g' guide/units.guide.xml

echo "done"