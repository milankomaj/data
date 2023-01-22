#!/bin/bash

jq 'map(del(.[][].h3[] | select
(
(contains("Meniny")) or
(contains("oslavuje")) or
(contains("Sviatok")) or
(contains("Pamiatka")) or
(contains("vianočný")) or
(contains("Slovenskej"))
|not)
))' namedays.json > tt.json


jq 'map(del(.[][].p[] | select
(
(index("Meno")) or
(index("Krstné")) or
(index("Žena")) or
(index("Ženské")) or
(index("Muž")) or
(index("Mužské")) or
(index("kameň")) or
(index("Pôvod")) or
(index("farby")) or
(index("farba")) or
(index("rastliny")) or
(index("Rastliny")) or
(index("ochranné")) or
(index("Ochranné")) or
(index("totemom")) or
(index("Klaudiov")) or
(index("Víťazoslavovia")) or
(index("Sviatok všetkých svätých")) or
(index("Deň vzniku samostatnej SR")) or
(index("Deň medzinárodnej solidarity pracujúcich")) or
(index("Prvý sviatok vianočný"))
|not)
))' tt.json > kk.json

jq 'map(del(.[][].p[] | select
(
(contains("albumy")) or
(contains("Preblahoslavenej")) and (contains("meno")|not) or
(contains("vydali")) and (contains("meno")|not) or
(contains("skupiny")) and (contains("meno")|not) or
(contains("omrel")) and (contains("men")|not) or
(contains("Narodil")) and (index("ské")|not) or
(contains("(")) and (index("ená")|not) and (index(",")|not) or
(contains("-")) and (index("ená")|not) and (index(",")|not) or
(contains("kameň")) and (index("ená")|not) and (contains("men")|not) and (contains("Klaudiov")|not) and (contains("Víťazoslavovia")|not) and (contains("Deň")|not) and (contains("Sviatok")|not) or
(contains("Narodil sa")) or
(contains("Deň sv. Patrika")) or
(contains("tučniak","pyramídu","hieroglyfy","výbušninami","Aces","Andách","feministickej","ministerstvo","poslancov","Killers","&","držbe","infarkt","kompilácia","bombového","bilancia"))
)
))' kk.json > ee.json

jq 'map(del(.[][].h3[] | select
(
(contains("Sviatok Obrátenia Pavla")) or
(contains("Sviatok hudby")) or
(contains("Meniny oslavuje Zuzana")) or
(contains("Deň vzniku Slovenskej národnej rady")) or
(contains("Sophia"))
)
))' ee.json > mm.json


jq 'del(..|select(. ==  "Meniny má"))' mm.json > gg.json

sed -i 's/\\\"/'\''/g' gg.json
sed -i 's/- nna/Na/g' gg.json
sed -i 's/"Dnes oslavuje Nadežda",//g' gg.json
sed -i 's/"Meniny má Meniny má Víťazoslav a Klaudius",//g' gg.json
sed -i 's/"Meniny má Meniny má Víťazoslav a Klaudius"/\"Meniny má Víťazoslav\",\"Meniny má Klaudius\"/g' gg.json
sed -i 's/Dnes oslavuje/Meniny má/g' gg.json
sed -i 's/Meniny má Meniny majú Ľuboslav a Ľuboslava/Meniny má Ľuboslav a Ľuboslava/g' gg.json
sed -i 's/Meniny majú Elena a Helena"/Meniny má Elena a Helena"/g' gg.json
sed -i 's/"Meniny má Ida a Liana"/"Meniny má Ida"/g' gg.json
sed -i 's/"Meniny má Ida a Liana"/"Meniny má Liana"/g' gg.json
sed -i 's/Meniny má Meniny má/Meniny má/g' gg.json
sed -i 's/Metód/Metod/g' gg.json
sed -i 's/ xxxxxxxxxxxxxxxxxxxxxxxxxxxx /\",\"/g' gg.json
sed -i 's/"Meniny má Patrik, Patrícia"/"Meniny má Patrik","Meniny má Patrícia"/g' gg.json
sed -i 's/ x x x x /\",\"/g' gg.json
sed -i 's/"Meniny má Drahomíra a Mário"/"Meniny má Drahomíra","Meniny má Mário"/g' gg.json
sed -i 's/"Meniny má Erika a Erik"/"Meniny má Erika","Meniny má Erik"/g' gg.json
sed -i 's/. x/./g' gg.json
sed -i 's/\"\./\"/g' gg.json

jq add gg.json > jj.json
jq '{month: .}' jj.json > names_days.json
jq -c . names_days.json > names_days_min.json
