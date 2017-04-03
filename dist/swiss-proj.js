(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var wgsToCh = require('./conv/wgs-ch')
var chToWgs = require('./conv/ch-wgs')

exports.wgsToLv03 = function(pt, rnd) {
	var r = wgsToCh.toLv03(pt)
	if(rnd) { return simplCH(r) }
	else { return r }
}

exports.wgsToLv95 = function(pt, rnd) {
	var r = wgsToCh.toLv95(pt)
	if(rnd) { return simplCH(r) }
	else { return r }
}

exports.lv03ToWgs = function(pt, rnd) {
	var r = chToWgs.fromLv03(pt)
	if(rnd) { return simplW(r) }
	else { return r }
}

exports.lv03ToLv95 = function(pt, rnd) {
	var r = [pt[0] + 2000000, pt[1] + 1000000]
	if(rnd) { return simplCH(r) }
	else { return r }
}

exports.lv95ToWgs = function(pt, rnd) {
	var r = chToWgs.fromLv95(pt)
	if(rnd) { return simplW(r) }
	else { return r }
}

exports.lv95ToLv03 = function(pt, rnd) {
	var r = [pt[0] - 2000000, pt[1] - 1000000]
	if(rnd) { return simplCH(r) }
	else { return r }
}

function simplCH(pt) {
	return [Math.round(pt[0]), Math.round(pt[1])]
}

function simplW(pt) {
	return [
		Math.round(pt[0] * 1000000)/1000000,
		Math.round(pt[1] * 1000000)/1000000
	]
}

},{"./conv/ch-wgs":2,"./conv/wgs-ch":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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



},{}],4:[function(require,module,exports){
var lv03 = require('./lv03')
var lv95 = require('./lv95')
var wgs = require('./wgs')
var ch = {}
ch.lv03 = lv03
ch.lv95 = lv95
ch.wgs = wgs
window.ch = ch

},{"./lv03":6,"./lv95":9,"./wgs":12}],5:[function(require,module,exports){
module.exports = function(geo, rnd, conv, n) {
	var notValid = 'ERROR: First argument needs to be a "Feature" or a "FeatureCollection"'
	if(geo.type) {
		if(geo.type === 'FeatureCollection') {
			var collection = col(geo, rnd, conv)
			addCrs(collection, n)
			return collection
		} else if(geo.type === 'Feature') {
			var feature = feat(geo, rnd, conv)
			addCrs(feature, n)
			return feature
		} else {
			console.log(notValid)
		}
	} else { console.log(notValid) }
}

function col(collection, rnd, conv) {
	var feats = []
	collection.features.forEach(function(f) {
		var newF = feat(f, rnd, conv)
		if(newF) { feats.push(newF) }
	})
	return {
		type: 'FeatureCollection',
		features: feats
	}
}

function feat(f, rnd, conv) {
	if(isGeom(f)) {
		var c = f.geometry.coordinates
		var t = f.geometry.type
		var p = f.properties
		return feature(p, t, convCoords(c, rnd, conv))
	} else {
		return null
	} 
}

function convCoords(c, rnd, conv) {
	if(c.constructor === Array && !isNaN(c[0])) { return conv(c, rnd) }
	else if(c[0].constructor === Array && !isNaN(c[0][0])) {
		var cc = []
		c.forEach(function(pt) { cc.push(conv(pt, rnd)) })
		return cc
	} 
	else if(c[0][0].constructor === Array && !isNaN(c[0][0][0])) {
		var ccc = []
		c.forEach(function(coords0) {
			var cc = []
			coords0.forEach(function(pt) { cc.push(conv(pt, rnd)) }) 
			ccc.push(cc) 
		})
		return ccc
	} 
	else if(c[0][0][0].constructor === Array && !isNaN(c[0][0][0][0])) {
		var cccc = []
		c.forEach(function(coords0) {
			var ccc = []
			coords0.forEach(function(coords1) { 
				var cc = []
				coords1.forEach(function(pt) {
					cc.push(conv(pt, rnd))
				})
				ccc.push(cc)
			}) 
			cccc.push(ccc) 
		})
		return cccc
	}
}

function isGeom(f) {
	if(f) {
		if(f.geometry) {
			if(f.geometry.type && f.geometry.coordinates) {
				return true
			} else { return false }
		} else { return false }
	} else { return null }
}

function feature(properties, geoType, coords) {
	return {
		type: 'Feature',
		properties: properties,
		geometry: {
			type: geoType,
			coordinates: coords
		}
	}
}

function addCrs(geo, n) {
	var code = { 'lv03': '21781', 'lv95': '2056', 'wgs': '4326' }
	geo.crs = {
		type: 'name',
		properties: {
			name: 'urn:ogc:def:crs:EPSG::' + code[n]
		}
	}
}


},{}],6:[function(require,module,exports){
var toWGS = require('./lv03/toWGS84')
var toLV95 = require('./lv03/toLV95')
exports.toWgs = toWGS
exports.toLv95 = toLV95

},{"./lv03/toLV95":7,"./lv03/toWGS84":8}],7:[function(require,module,exports){
var conv = require('../conv').lv03ToLv95
var geojson = require('../geojson')

exports.point = function(pt, rnd) {
	return conv(pt, rnd)
}

exports.GeoJSON = function(geo, rnd) {
	return geojson(geo, rnd, conv, 'lv95')
}

},{"../conv":1,"../geojson":5}],8:[function(require,module,exports){
var conv = require('../conv').lv03ToWgs
var geojson = require('../geojson')

exports.point = function(pt, rnd) {
	return conv(pt, rnd)
}

exports.GeoJSON = function(geo, rnd) {
	return geojson(geo, rnd, conv, 'wgs')
}


},{"../conv":1,"../geojson":5}],9:[function(require,module,exports){
var toWGS = require('./lv95/toWGS84')
var toLV03 = require('./lv95/toLV03')
exports.toWgs = toWGS
exports.toLv03 = toLV03

},{"./lv95/toLV03":10,"./lv95/toWGS84":11}],10:[function(require,module,exports){
var conv = require('../conv').lv95ToLv03
var geojson = require('../geojson')

exports.point = function(pt, rnd) {
	return conv(pt, rnd)
}

exports.GeoJSON = function(geo, rnd) {
	return geojson(geo, rnd, conv, 'lv03')
}

},{"../conv":1,"../geojson":5}],11:[function(require,module,exports){
var conv = require('../conv').lv95ToWgs
var geojson = require('../geojson')

exports.point = function(pt, rnd) {
	return conv(pt, rnd)
}

exports.GeoJSON = function(geo, rnd) {
	return geojson(geo, rnd, conv, 'wgs')
}


},{"../conv":1,"../geojson":5}],12:[function(require,module,exports){
var toLV03 = require('./wgs/toLV03')
var toLV95 = require('./wgs/toLV95')
exports.toLv03 = toLV03
exports.toLv95 = toLV95

},{"./wgs/toLV03":13,"./wgs/toLV95":14}],13:[function(require,module,exports){
var conv = require('../conv').wgsToLv03
var geojson = require('../geojson')

exports.point = function(pt, rnd) {
	return conv(pt, rnd)
}

exports.GeoJSON = function(geo, rnd) {
	return geojson(geo, rnd, conv, 'lv03')
}

},{"../conv":1,"../geojson":5}],14:[function(require,module,exports){
var conv = require('../conv').wgsToLv95
var geojson = require('../geojson')

exports.point = function(pt, rnd) {
	return conv(pt, rnd)
}

exports.GeoJSON = function(geo, rnd) {
	return geojson(geo, rnd, conv, 'lv95')
}

},{"../conv":1,"../geojson":5}]},{},[4]);
