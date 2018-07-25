const citiesCsv = `
node	9002746	Charleroi	50.4120332	4.4436244
node	17807753	Paris	48.8566101	2.3514992
node	20626319	Lyon	45.7578137	4.8320114
node	26686463	Metz	49.1196964	6.1763552
node	26686468	Tours	47.3900474	0.6889268
node	26686473	Clermont-Ferrand	45.7774551	3.0819427
node	26686477	Reims	49.2577886	4.0319260
node	26686504	Dijon	47.3215806	5.0414701
node	26686508	Orléans	47.9027336	1.9086066
node	26686514	Amiens	49.8941708	2.2956951
node	26686518	Toulouse	43.6044622	1.4442469
node	26686524	Limoges	45.8354243	1.2644847
node	26686526	Rennes	48.1113387	-1.6800198
node	26686539	Saint-Étienne	45.4401467	4.3873058
node	26686548	Nantes	47.2186371	-1.5541362
node	26686554	Besançon	47.2379530	6.0243246
node	26686559	Le Mans	48.0078497	0.1997933
node	26686563	Strasbourg	48.5846140	7.7507127
node	26686568	Mulhouse	47.7494188	7.3399355
node	26686572	Angers	47.4739884	-0.5515588
node	26686577	Lille	50.6305089	3.0706414
node	26686582	Toulon	43.1257311	5.9304919
node	26686585	Nîmes	43.8374249	4.3600687
node	26686587	Rouen	49.4404591	1.0939658
node	26686589	Grenoble	45.1821510	5.7274722
node	26686593	Boulogne-Billancourt	48.8356649	2.2402060
node	26686595	Aix-en-Provence	43.5298424	5.4474738
node	26691769	Poitiers	46.5802596	0.3401960
node	26691842	Calais	50.9488000	1.8746800
node	26691955	Argenteuil	48.9479069	2.2481797
node	26692183	Dunkerque	51.0347708	2.3772525
node	26692216	Montreuil	48.8623357	2.4412184
node	26692268	Pau	43.2957547	-0.3685668
node	26692383	Saint-Denis	48.9357730	2.3580232
node	26692465	Annecy	45.9087950	6.1198672
node	26692561	Nancy	48.6937223	6.1834097
node	26692577	Troyes	48.2971626	4.0746257
node	26761400	Marseille	43.2961743	5.3699525
node	51341115	Ajaccio	41.9263991	8.7376029
node	412476714	Caen	49.1828008	-0.3690815
node	647953515	Villeurbanne	45.7733105	4.8869339
node	823582966	Brest	48.3905283	-4.4860088
node	1664142674	Perpignan	42.6953868	2.8844713
node	1691675873	Bordeaux	44.8412250	-0.5800364
node	1701090139	Nice	43.7009358	7.2683912
node	1768128336	Chartres	48.4470039	1.4866387
node	1836027948	Avignon	43.9493143	4.8060329
node	1909836591	Le Havre	49.4938975	0.1079732
node	26692095	Montélimar	44.5579391	4.7503180
`

export default () => {
  return citiesCsv.split('\n').map(line => line.split('\t'))
    .filter(line => parseFloat(line[3]) > 40 && parseFloat(line[3]) < 52 && parseFloat(line[4]) > -5 && parseFloat(line[4]) < 9)
    .reduce((acc, item) => {
      if(!item) return acc
      acc.features.push({
        "type": "Feature",
        "properties": {
          "@id": `${item[0]}/${item[1]}`,
          "place": "city",
          "name": item[2],
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            parseFloat(item[4]),
            parseFloat(item[3]),
          ]
        },
        "id": `${item[0]}/${item[1]}`
      })
      return acc
    }, {
      "type": "FeatureCollection",
      "features": []}
    )
  //console.log(cities)
}
