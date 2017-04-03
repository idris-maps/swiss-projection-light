// https://www.swisstopo.admin.ch/content/swisstopo-internet/fr/online/calculation-services/_jcr_content/contentPar/tabs/items/documents_publicatio/tabPar/downloadlist/downloadItems/13_1467103515131.download/naeherung_f_st.pdf

// Formules approchées pour la conversion de coordonnées suisses de projection en coordonnées ellipsoïdales WGS84 

// Convertir les coordonnées de projection E (coordonnée est) et N (coordonnée nord) en MN95 (ou y / x en MN03) dans le système civil (Berne = 0 / 0) et exprimer dans l'unité [1000 km]
//EN
function from95toCivil(coord) {
	return [
		(coord[0] - 2600000) / 1000000,
		(coord[1] - 1200000) / 1000000

	]
}

function from03toCivil(coord) {
	return [
		(coord[0] - 600000) / 1000000,
		(coord[1] - 200000) / 1000000	
	]
}

// Calculer la longitude λ et la latitude φ dans l'unité [10000"]
function civilToLL(civil) {
	var y2 = civil[0]
	var x2 = civil[1]

	var λ2 = 2.6779094
		+ 4.728982 * y2
		+ 0.791484 * y2 * x2
		+ 0.1306   * y2 * Math.pow(x2,2)
		- 0.0436   * Math.pow(y2,3)

	var φ2 = 16.9023892
		+  3.238272 * x2
		-  0.270978 * Math.pow(y2,2)
		-  0.002528 * Math.pow(x2,2)
		-  0.0447   * Math.pow(y2,2) * x2
		-  0.0140   * Math.pow(x2,3)

// Convertir la longitude et la latitude dans l'unité [°] 

	var λ = λ2*100/36
	var φ = φ2*100/36

	return [λ, φ]
}

exports.fromLv03 = function(coord) {
	var civil = from03toCivil(coord)
	return civilToLL(civil)
}

exports.fromLv95 = function(coord) {
	var civil = from95toCivil(coord)
	return civilToLL(civil)
}
