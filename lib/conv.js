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
