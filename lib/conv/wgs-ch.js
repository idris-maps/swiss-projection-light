//https://www.swisstopo.admin.ch/content/swisstopo-internet/fr/online/calculation-services/_jcr_content/contentPar/tabs/items/documents_publicatio/tabPar/downloadlist/downloadItems/13_1467103515131.download/naeherung_f_st.pdf

// Formules approchées pour la conversion de coordonnées ellipsoïdales WGS84 en coordonnées suisses de projection 

function toLV95(coord) {
	var lat = coord[1]
	var lng = coord[0]

	// Convertir les latitudes φ et les longitudes λ en secondes sexagésimales ["] 

	function toSexa(angle) {
		var d = parseInt(angle)
		var m = parseInt((angle-d)*60)
		var s = (((angle-d)*60)-m)*60   
		return s + m*60.0 + d*3600.0 
	}
	var φ = toSexa(lat)
	var λ = toSexa(lng)

	// Calculer les grandeurs auxiliaires (les écarts en latitude et en longitude par rapport à Berne sont exprimés dans l'unité [10000"])

	var φ2 = (φ - 169028.66)/10000
	var λ2 = (λ - 26782.5)/10000

	// Calculer les coordonnées de projection en MN95 (E, N)

	var E = 2600072.37
		+ 211455.93 * λ2
		- 10938.51 * λ2 * φ2
		- 0.36 * λ2 * Math.pow(φ2,2)
		- 44.54 * Math.pow(λ2, 3)

	var N = 1200147.07
		+ 308807.95 * φ2
		+ 3745.25 * Math.pow(λ2, 2)
		+ 76.63 * Math.pow(φ2, 2)
		- 194.56 * Math.pow(λ2, 2) * φ2
		+ 119.79 * Math.pow(φ2, 3)

	return [E, N]
}

function toLV03(coord) {
	var inLV95 = toLV95(coord)
	return [ inLV95[0] - 2000000, inLV95[1] - 1000000 ]
}

exports.toLv95 = function(coord) {
	var c = toLV95(coord)
	return c
}

exports.toLv03 = function(coord) {
	var c = toLV03(coord)
	return c
}


