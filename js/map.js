//////////////////////////////////////////////////////////////////////////////
/**
 * Copyright (C) 2012  Benjamin Preisig
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNES
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 * 
 * ///////////////////////////////////////////////////////////////////////////
 * 
 * If you want to use my TMS please contact me at maps@preisig.at
 */
//////////////////////////////////////////////////////////////////////////////


var map = null;
var selectControl, popup, vasi, vasi_na, krajine, krajine_na, ledine, ledine_na, krizi, krizi_na, kmetije, kmetije_na,
	vrhovi, vrhovi_na, gorsko, gorskoPod, vodotoki, mlini, kmetijePod, kmetijePod_na, tericne, izkopanine, cerkve, poso;


function setBase(identifier){
    			var lyrs = map.getLayersBy("identifier", identifier);
    			var lyr;
    			if (lyrs && lyrs.length && lyrs.length === 1) {
    				lyr = lyrs[0];
    				map.setBaseLayer(lyr);
    			}
    		}

// increase reload attempts 
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;

function init(){
    var maxExtent = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508),
        restrictedExtent = maxExtent.clone(),
        maxResolution = 156543.0339;
    
    var options = {
        projection: new OpenLayers.Projection("EPSG:900913"),
        // displayProjection: new OpenLayers.Projection("EPSG:4326"),
        units: "m",
        numZoomLevels: 20,
        maxResolution: maxResolution,
        maxExtent: maxExtent,
        restrictedExtent: restrictedExtent,
        controls:[]	//leer, da sie unten manuell mit den custom-Controls aufgerufen werden
    };
    map = new OpenLayers.Map('map', options);

    //##################################### LABEL STYLES ########################################
    // Definition der Label-Styles
	
	// Die Styles werden als Objekte gespeichert um sie einfacher für die jeweiligen Klassen anpassen zu können
	var defaultStyle = {
		fill: false,
        label : "${name_diale}",
        labelHaloColor: "white",
        labelHaloWidth: "3",
        cursor: "pointer",
        labelXOffset: 0,
		labelYOffset: 0,
        fontColor: "black",
        fontSize: "24px",
        fontFamily: "open_sansbregular",
        labelSelect: true,
        labelAlign: "cm",
        angle: "${Angle}"
	};
	var selectStyle = {
		cursor: "pointer",
	 	label : "${name_diale}",
        labelXOffset: 0,
		labelYOffset: 0,
        fontColor: "black",
        fontSize: "24px",
        fontFamily: "open_sansbregular",
        labelSelect: true,
        labelAlign: "cm",
        angle: "${Angle}"
	};
	var temporaryStyle = {
		cursor: "pointer",
	 	label : "${name_diale}",
	 	labelHaloColor: "white",
        labelHaloWidth: "3",
        labelXOffset: 0,
		labelYOffset: 0,
        fontColor: "red",
        fontSize: "24px",
        fontFamily: "open_sansbregular",
        labelSelect: true,
        labelAlign: "cm",
        angle: "${Angle}"
	};
	
	// Variable die den Inhalt für den Cluster definiert
	var cluster = {
    	context:{
    		
    		name_diale: function(feature) { 
    			feature.attributes.name_diale = feature.cluster[0].attributes.name_diale;
    			feature.attributes.Angle = feature.cluster[0].attributes.Angle;
    			feature.attributes.audio = feature.cluster[0].attributes.audio;
    			feature.attributes.img = feature.cluster[0].attributes.img;
    			feature.attributes.origin_slo = (feature.cluster[0].attributes.origin_slo != undefined) ? feature.cluster[0].attributes.origin_slo : "";
    			feature.attributes.origin_de = (feature.cluster[0].attributes.origin_de != undefined) ? feature.cluster[0].attributes.origin_de : "";
    			return feature.attributes.name_diale; 
    		},
    		Angle: function(feature) {
				return feature.attributes.Angle; 
			}
    			
    	}
    };
	
	//anpassen der Styles an die Klasse
	var dSVasi = clone(defaultStyle);
	dSVasi["labelAlign"] = "cb";
	var sSVasi = clone(selectStyle);
	sSVasi["labelAlign"] = "cb";
	var tSVasi = clone(temporaryStyle);
	tSVasi["labelAlign"] = "cb";
	tSVasi["fontSize"] = "25px";
	
	//definieren der StyleMap für die Klasse
    var vasiStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSVasi), // so sehen die Namen auf der Karte aus
    	'select': new OpenLayers.Style(sSVasi), 
    	'temporary': new OpenLayers.Style(tSVasi) // so sehen die Namen nach einem mouseOver aus
    });
       
    var dSVasi_uradno = clone(dSVasi);
    dSVasi_uradno["label"] = "${GEONAME_MA}";
    dSVasi_uradno["labelAlign"] = "ct";
    dSVasi_uradno["labelSelect"] = "false";
    dSVasi_uradno["fontSize"] = "14px";
	var sSVasi_uradno = clone(sSVasi);
	sSVasi_uradno["label"] = "${GEONAME_MA}";
	sSVasi_uradno["labelSelect"] = "false";
	sSVasi_uradno["fontSize"] = "18px";
	var tSVasi_uradno = clone(tSVasi);
	tSVasi_uradno["label"] = "${GEONAME_MA}";
	tSVasi_uradno["labelSelect"] = "false";
	tSVasi_uradno["fontSize"] = "18px";
	
    var vasi_uradnoStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSVasi_uradno), // so sehen die Namen auf der Karte aus
    	'select': new OpenLayers.Style(sSVasi_uradno), 
    	'temporary': new OpenLayers.Style(tSVasi_uradno) // so sehen die Namen nach einem mouseOver aus
    });

    var dSKrajine = clone(defaultStyle);
    dSKrajine["fontColor"] = "green";
    dSKrajine["fontSize"] = "20px";
    var sSKrajine = clone(selectStyle);
    sSKrajine["fontColor"] = "green";
    sSKrajine["fontSize"] = "20px";
    var tSKrajine = clone(temporaryStyle);
    tSKrajine["fontSize"] = "21px";
    
    var krajineStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSKrajine),
    	'select': new OpenLayers.Style(sSKrajine),
    	'temporary': new OpenLayers.Style(tSKrajine)
    });
    
    var dSLedine = clone(defaultStyle);
    dSLedine["label"] = "${name_diale}";
    dSLedine["fontColor"] = "brown";
    dSLedine["fontSize"] = "14px";
    var sSLedine = clone(selectStyle);
    sSLedine["fontColor"] = "brown";
    sSLedine["fontSize"] = "14px";
    var tSLedine = clone(temporaryStyle);
    tSLedine["fontSize"] = "15px";
    
    var ledineStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSLedine,cluster),
    	'select': new OpenLayers.Style(sSLedine),
    	'temporary': new OpenLayers.Style(tSLedine)
    });
    
    var dSKmetije = clone(defaultStyle);
    dSKmetije["externalGraphic"] = "img/icn/hisica.png";
    dSKmetije["graphicWidth"] = "7";
    dSKmetije["graphicHeight"] = "7";
    dSKmetije["graphicOpacity"] = "1";
    dSKmetije["graphicName"] = "square";
    dSKmetije["labelXOffset"] = "5";
    dSKmetije["labelYOffset"] = "5";
    dSKmetije["fontSize"] = "14px";
    dSKmetije["labelAlign"] = "lb";
    dSKmetije["angle"] = "0";
    var sSKmetije = clone(selectStyle);
    sSKmetije["labelXOffset"] = "5";
    sSKmetije["labelYOffset"] = "5";
    sSKmetije["fontSize"] = "14px";
    sSKmetije["labelAlign"] = "lb";
    sSKmetije["angle"] = "0";
    var tSKmetije = clone(temporaryStyle);
    tSKmetije["labelXOffset"] = "5";
    tSKmetije["labelYOffset"] = "5";
    tSKmetije["fontSize"] = "15px";
    tSKmetije["labelAlign"] = "lb";
    tSKmetije["angle"] = "0";
    
    var kmetijeStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSKmetije, cluster),
    	'select': new OpenLayers.Style(sSKmetije),
    	'temporary': new OpenLayers.Style(tSKmetije)
    });
    
    var dSKmetijePod = clone(dSKmetije);
    dSKmetijePod["externalGraphic"] = "img/icn/hisica_pod.png";
    var sSKmetijePod = clone(sSKmetije);
    var tSKmetijePod = clone(tSKmetije);
    
    var kmetijePodStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSKmetijePod),
    	'select': new OpenLayers.Style(sSKmetijePod),
    	'temporary': new OpenLayers.Style(tSKmetijePod)
    });
     
    var dSVrhovi = clone(defaultStyle);
    dSVrhovi["fontColor"] = "grey";
    dSVrhovi["fontSize"] = "16px";
    var sSVrhovi = clone(selectStyle);
    sSVrhovi["fontColor"] = "grey";
    sSVrhovi["fontSize"] = "16px";
    var tSVrhovi = clone(temporaryStyle);
    tSVrhovi["fontSize"] = "17px";
    
    var vrhoviStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSVrhovi),
    	'select': new OpenLayers.Style(sSVrhovi),
    	'temporary': new OpenLayers.Style(tSVrhovi)
    });
    
    
    var dSGorsko = clone(defaultStyle);
    dSGorsko["fontColor"] = "slategrey";
    dSGorsko["fontSize"] = "20px";
    var sSGorsko = clone(selectStyle);
    sSGorsko["fontColor"] = "slategrey";
    sSGorsko["fontSize"] = "20px";
    var tSGorsko = clone(temporaryStyle);
    tSGorsko["fontSize"] = "21px";
    
    var gorskoStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSGorsko),
    	'select': new OpenLayers.Style(sSGorsko),
    	'temporary': new OpenLayers.Style(tSGorsko)
    });
    
    var dSGorskoPod = clone(defaultStyle);
    dSGorskoPod["fontColor"] = "slategrey";
    dSGorskoPod["fontSize"] = "18px";
    var sSGorskoPod = clone(selectStyle);
    sSGorskoPod["fontColor"] = "slategrey";
    sSGorskoPod["fontSize"] = "18px";
    var tSGorskoPod = clone(temporaryStyle);
    tSGorskoPod["fontSize"] = "19px";
    
    var gorskoPodStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSGorskoPod),
    	'select': new OpenLayers.Style(sSGorskoPod),
    	'temporary': new OpenLayers.Style(tSGorskoPod)
    });

	var dSVodotoki = clone(defaultStyle);
    dSVodotoki["fontColor"] = "blue";
    dSVodotoki["fontSize"] = "11px";
    var sSVodotoki = clone(selectStyle);
    sSVodotoki["fontColor"] = "blue";
    sSVodotoki["fontSize"] = "11px";
    var tSVodotoki = clone(temporaryStyle);
    tSVodotoki["fontSize"] = "12px";
    
    var vodotokiStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSVodotoki),
    	'select': new OpenLayers.Style(sSVodotoki),
    	'temporary': new OpenLayers.Style(tSVodotoki)
    });

    var dSKrizi = clone(defaultStyle);
    dSKrizi["externalGraphic"] = "img/icn/Christianity.png";
    dSKrizi["graphicWidth"] = "13";
    dSKrizi["graphicHeight"] = "13";
    dSKrizi["graphicOpacity"] = "1";
    dSKrizi["labelXOffset"] = "8";
    dSKrizi["labelYOffset"] = "-5";
    dSKrizi["fontSize"] = "11px";
    dSKrizi["labelAlign"] = "lb";
    var sSKrizi = clone(selectStyle);
    sSKrizi["labelXOffset"] = "8";
    sSKrizi["labelYOffset"] = "-5";
    sSKrizi["fontSize"] = "11px";
    sSKrizi["labelAlign"] = "lb";
    var tSKrizi = clone(temporaryStyle);
    tSKrizi["labelXOffset"] = "8";
    tSKrizi["labelYOffset"] = "-5";
    tSKrizi["fontSize"] = "12px";
    tSKrizi["labelAlign"] = "lb";
    
    var kriziStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSKrizi),
    	'select': new OpenLayers.Style(sSKrizi),
    	'temporary': new OpenLayers.Style(tSKrizi)
    });
     
    var dSMlini = clone(dSKrizi);
    dSMlini["externalGraphic"] = "img/icn/Earth.png";
    dSMlini["graphicWidth"] = "9";
    dSMlini["graphicHeight"] = "9";
    dSMlini["labelYOffset"] = "-4";
    var sSMlini = clone(sSKrizi);
    sSMlini["labelYOffset"] = "-4";
    var tSMlini = clone(tSKrizi);
    tSMlini["labelYOffset"] = "-4";
    
    var mliniStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSMlini),
    	'select': new OpenLayers.Style(sSMlini),
    	'temporary': new OpenLayers.Style(tSMlini)
    });
    
    var tericneStylemap = new OpenLayers.StyleMap({
    	'externalGraphic': 'img/icn/Campfire_red.png',
    	'labelSelect': true,
        'graphicWidth': '14',
        'graphicHeight': '14',
        'graphicOpacity': '1'
   	});
   	
   	var izkopanineStylemap = new OpenLayers.StyleMap({
    	'externalGraphic': 'img/icn/izkopanine_icon.png',
    	'labelSelect': true,
        'graphicWidth': '14',
        'graphicHeight': '14',
        'graphicOpacity': '1'
   	});
    
    var dSCerkev = clone(dSKrizi);
    dSCerkev["externalGraphic"] = "img/icn/Church.png";
    dSCerkev["graphicWidth"] = "15";
    dSCerkev["graphicHeight"] = "15";
    dSCerkev["labelYOffset"] = "-4";
    var sSCerkev = clone(sSKrizi);
    sSCerkev["labelYOffset"] = "-4";
    var tSCerkev = clone(tSKrizi);
    tSCerkev["labelYOffset"] = "-4";
    
    var cerkveStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSCerkev),
    	'select': new OpenLayers.Style(sSCerkev),
    	'temporary': new OpenLayers.Style(tSCerkev)
        });
        
    var dSPoso = clone(dSKmetije);
    dSPoso["externalGraphic"] = "img/icn/poso.png";
    dSPoso["graphicWidth"] = "13";
    dSPoso["graphicHeight"] = "13";
    dSPoso["labelXOffset"] = "7";
    dSPoso["labelYOffset"] = "7";
    var sSPoso = clone(sSKmetije);
    var tSPoso = clone(tSKmetije);
    
    var posoStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSPoso),
    	'select': new OpenLayers.Style(sSPoso),
    	'temporary': new OpenLayers.Style(tSPoso)
    });
    
    // jeder Layer braucht seine eigene Strategy
    var vasiStrategy = new OpenLayers.Strategy.BBOX();
    var vasi_uradnoStrategy = new OpenLayers.Strategy.BBOX();
	var krajineStrategy = new OpenLayers.Strategy.BBOX();
    var ledineStrategy = new OpenLayers.Strategy.BBOX();
    var ledineClusterStrategy = new OpenLayers.Strategy.Cluster({distance: 40, threshold: 1});
    var kmetijeStrategy = new OpenLayers.Strategy.BBOX();
    var kmetijeClusterStrategy = new OpenLayers.Strategy.Cluster({distance: 40, threshold: 1});
    var kmetijePodStrategy = new OpenLayers.Strategy.BBOX();
    var vrhoviStrategy = new OpenLayers.Strategy.BBOX();
    var gorskoStrategy = new OpenLayers.Strategy.BBOX();
    var gorskoPodStrategy = new OpenLayers.Strategy.BBOX();
    var vodotokiStrategy = new OpenLayers.Strategy.BBOX();
    var kriziStrategy = new OpenLayers.Strategy.BBOX();
    var mliniStrategy = new OpenLayers.Strategy.BBOX();
    var tericneStrategy = new OpenLayers.Strategy.BBOX();
    var izkopanineStrategy = new OpenLayers.Strategy.BBOX();
    var cerkveStrategy = new OpenLayers.Strategy.BBOX();
    var posoStrategy = new OpenLayers.Strategy.BBOX();
    
    //##################################### LAYER ########################################
    // Definition und Aufruf der Layer

    // var osm_tms = new OpenLayers.Layer.TMS( "osm_tms",
    //     "http://benjamin.preisig.at/mapcache/tms/",
    //     { layername: 'osm@g', type: "png", serviceVersion:"1.0.0",
    //       gutter:0,buffer:0,isBaseLayer:true,transitionEffect:'resize',
    //       tileOrigin: new OpenLayers.LonLat(-20037508.342789,-20037508.342789),
    //       resolutions:[156543.03392804099712520838,78271.51696402048401068896,39135.75848201022745342925,19567.87924100512100267224,9783.93962050256050133612,4891.96981025128025066806,2445.98490512564012533403,1222.99245256282006266702,611.49622628141003133351,305.74811314070478829308,152.87405657035250783338,76.43702828517623970583,38.21851414258812695834,19.10925707129405992646,9.55462853564703173959,4.77731426782351586979,2.38865713391175793490,1.19432856695587897633,0.59716428347793950593],
    //       serverResolutions:[156543.03392804099712520838,78271.51696402048401068896,39135.75848201022745342925,19567.87924100512100267224,9783.93962050256050133612,4891.96981025128025066806,2445.98490512564012533403,1222.99245256282006266702,611.49622628141003133351,305.74811314070478829308,152.87405657035250783338,76.43702828517623970583,38.21851414258812695834,19.10925707129405992646,9.55462853564703173959,4.77731426782351586979,2.38865713391175793490,1.19432856695587897633,0.59716428347793950593],
    //       zoomOffset:0,
    //       units:"m",
    //       maxExtent: new OpenLayers.Bounds(-20037508.342789,-20037508.342789,20037508.342789,20037508.342789),
    //       projection: new OpenLayers.Projection("EPSG:900913".toUpperCase()),
    //       sphericalMercator: true,
    //       isBaseLayer: true,
    //       identifier: "osm_tms",
    //       attribution: "(c) OpenStreetMap contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/'> CC-BY-SA</a>, Map data (c) OpenStreetMap contributors,<a href='http://creativecommons.org/licenses/by-sa/2.0/'> CC-BY-SA</a>"
    //  }
    // );

    var osm_tms = new OpenLayers.Layer.XYZ("My Map Layer",
        [
            "http://a.tiles.mapbox.com/v4/prebm.e540e59f/${z}/${x}/${y}.png?access_token=pk.eyJ1IjoicHJlYm0iLCJhIjoienBEMzRGNCJ9.aRunTx_yN6sagfBfcHYvGw",
            "http://b.tiles.mapbox.com/v4/prebm.e540e59f/${z}/${x}/${y}.png?access_token=pk.eyJ1IjoicHJlYm0iLCJhIjoienBEMzRGNCJ9.aRunTx_yN6sagfBfcHYvGw",
            "http://c.tiles.mapbox.com/v4/prebm.e540e59f/${z}/${x}/${y}.png?access_token=pk.eyJ1IjoicHJlYm0iLCJhIjoienBEMzRGNCJ9.aRunTx_yN6sagfBfcHYvGw",
            "http://d.tiles.mapbox.com/v4/prebm.e540e59f/${z}/${x}/${y}.png?access_token=pk.eyJ1IjoicHJlYm0iLCJhIjoienBEMzRGNCJ9.aRunTx_yN6sagfBfcHYvGw"
        ], 
        {
            sphericalMercator: true,
            wrapDateLine: true,
            isBaseLayer:true,
            identifier: "osm_tms",
            zoomOffset: 0,
            units: "m",
            maxExtent: new OpenLayers.Bounds(-20037508.342789,-20037508.342789,20037508.342789,20037508.342789),
            attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"
    });
    
    /*var geoimage = new OpenLayers.Layer.WMS(
    	"geoimage",
    	"http://gis.lebensministerium.at/wmsgw/?key=24dd6acc3549237fb5d46e3a90cab1c6&",
    	{layers:"Satellitenbild_30m,Luftbild_8m,Luftbild_1m,Luftbild_MR"},
    	{isBaseLayer:true, identifier: "geoimage", attribution: "Orthophoto by <a href='http://www.geoimage.at'>www.geoimage.at</a>(c)"}
    );*/	
    
    var geoimage = new OpenLayers.Layer.OSM(
        "Basemap Orthofoto",
        //"http://toolserver.org/~cmarqu/hill/${z}/${x}/${y}.png",
        'http://maps1.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/${z}/${y}/${x}.jpeg',
        {isBaseLayer:true, identifier: "geoimage", attribution:"Datenquelle: <a href='http://www.basemap.at' target='_blank'>basemap.at</a>"}
    ); 
    
    var hs = new OpenLayers.Layer.OSM(
        "Hillshade",
        //"http://toolserver.org/~cmarqu/hill/${z}/${x}/${y}.png",
        'http://tiles.wmflabs.org/hillshading/${z}/${x}/${y}.png',
        {isBaseLayer:false, displayInLayerSwitcher:false, minScale:218000.0, maxScale:10000.0}
    );
    
    //am besten wenn alle Namen die mit einem Layer zu tun haben (variable, "name", .gml, im HTML-file, ...) gleich lauten: z.B. vasi
	vasi = new OpenLayers.Layer.Vector("vasi", {
	    styleMap: vasiStylemap,
	    strategies: [vasiStrategy],
	    renderers: ["MySVG", "VML"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/vasi.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:70000.0 // 30000.0
   	});
   	
   	vasi_uradno = new OpenLayers.Layer.Vector("vasi_uradno", {
	    styleMap: vasi_uradnoStylemap,
	    strategies: [vasi_uradnoStrategy],
	    renderers: ["MySVG", "VML"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/vasi_uradno.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:30000.0,
        maxScale:25000.0
   	});
   	
   	krajine = new OpenLayers.Layer.Vector("krajine", {
	    styleMap: krajineStylemap,
	    strategies: [krajineStrategy],
	    renderers: ["MySVG", "VML"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/krajine.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	ledine = new OpenLayers.Layer.Vector("ledine", {
	    styleMap: ledineStylemap,
	    strategies: [ledineStrategy, ledineClusterStrategy],
	    renderers: ["MySVG", "VML"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/ledine.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	kmetije = new OpenLayers.Layer.Vector("kmetije", {
	    styleMap: kmetijeStylemap,
	    strategies: [kmetijeStrategy, kmetijeClusterStrategy],
	    renderers: ["MySVG", "VML"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/kmetije.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:7000.0
   	});
   	
   	kmetijePod = new OpenLayers.Layer.Vector("kmetijePod", {
	    styleMap: kmetijePodStylemap,
	    strategies: [kmetijePodStrategy],
	    renderers: ["MySVG", "VML"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/podrto.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:7000.0
   	});
   	
   	vrhovi = new OpenLayers.Layer.Vector("vrhovi", {
	    styleMap: vrhoviStylemap,
	    strategies: [vrhoviStrategy],
	    renderers: ["MySVG", "VML"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/vrh.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	gorsko = new OpenLayers.Layer.Vector("gorsko", {
	    styleMap: gorskoStylemap,
	    strategies: [gorskoStrategy],
	    renderers: ["MySVG", "VML"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/gorovje.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	gorskoPod = new OpenLayers.Layer.Vector("gorskoPod", {
	    styleMap: gorskoPodStylemap,
	    strategies: [gorskoPodStrategy],
	    renderers: ["MySVG", "VML"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/podgorovje.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});

	vodotoki = new OpenLayers.Layer.Vector("vodotoki", {
	    styleMap: vodotokiStylemap,
	    strategies: [vodotokiStrategy],
	    renderers: ["MySVG", "VML"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/vodotoki.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:7000.0
   	});

   	krizi = new OpenLayers.Layer.Vector("krizi", {
	    styleMap: kriziStylemap,
	    strategies: [kriziStrategy],
	    renderers: ["MySVG", "VML"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/kriz.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	mlini = new OpenLayers.Layer.Vector("mlini", {
	    styleMap: mliniStylemap,
	    strategies: [mliniStrategy],
	    renderers: ["MySVG", "VML"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/mlin.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});

   	tericne = new OpenLayers.Layer.Vector("tericne", {
	    styleMap: tericneStylemap,
	    strategies: [tericneStrategy],
	    renderers: ["MySVG", "VML"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/tericne.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
 	
 	izkopanine = new OpenLayers.Layer.Vector("izkopanine", {
	    styleMap: izkopanineStylemap,
	    strategies: [izkopanineStrategy],
	    renderers: ["MySVG", "VML"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/izkopanine.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
 	
   	cerkve = new OpenLayers.Layer.Vector("cerkve", {
	    styleMap: cerkveStylemap,
	    strategies: [cerkveStrategy],
	    renderers: ["MySVG", "VML"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/cerkev.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	poso = new OpenLayers.Layer.Vector("poso", {
	    styleMap: posoStylemap,
	    strategies: [posoStrategy],
	    renderers: ["MySVG", "VML"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/poso.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	map.addLayers([osm_tms, geoimage, hs]);
   	map.addLayers([poso, cerkve, izkopanine, tericne, mlini, krizi, vodotoki, vrhovi, gorskoPod, gorsko, kmetijePod, kmetije, ledine, krajine, vasi_uradno, vasi]);

   	//##################################### EVENTS ########################################
    // Definition der Events für Pop-Ups und Hover
   	
   	//Events für hover
   	var highlightCtrl = new OpenLayers.Control.SelectFeature(vasi, {
        hover: true,
        highlightOnly: true,
        renderIntent: "temporary"
    });
    map.addControl(highlightCtrl);
    highlightCtrl.activate();
    highlightCtrl.setLayer([vasi, ledine, kmetije, tericne, izkopanine, mlini, krizi, vodotoki, vrhovi, gorskoPod, gorsko, kmetijePod, krajine, cerkve, poso]);
    
    selectControl = new OpenLayers.Control.SelectFeature(vasi,
        {clickout: true,onSelect: onFeatureSelect, onUnselect:onFeatureUnselect}
    );
    map.addControl(selectControl);
	selectControl.activate();
	selectControl.setLayer([vasi, ledine, kmetije, tericne, izkopanine, mlini, krizi, vodotoki, vrhovi, gorskoPod, gorsko, kmetijePod, krajine, cerkve, poso]);
	
	//##################################### CONTROLS ########################################
    // Definition der custom Controls
    
    //zoom Controls über CSS in openlayers/theme/default/style.css und styles/style.css definiert
    //variable to save the zoom plus one, assigned in the zoomend event
    var zoomplus=0;
    map.events.register('zoomend',this, function(){zoomplus=map.getZoom()+1;});
    var panel = new OpenLayers.Control.Panel();	//in my case i am using a panel and showing only the zoomin and zoomout button
	panel.addControls([ 
		new OpenLayers.Control.ZoomIn({
				title:'Zoom in',
				//overwrite default trigger
				trigger: function(){
					       	//osm_tms is my layer with max zoom level: 18, geoimage is with max zoom level: 20
					        if (this.map.baseLayer==osm_tms&&zoomplus==19){this.map.setBaseLayer(this.map.getLayersByName("geoimage")[0]);}
					        this.map.zoomIn();
					    }
			}),
		new OpenLayers.Control.ZoomOut({title:"Zoom out"}) 
	]); 
	map.addControl(panel);
	
	map.addControl(new OpenLayers.Control.Navigation());
 	map.addControl(new OpenLayers.Control.Attribution());
 	map.addControl(new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }}));
     // map.addControl(new OpenLayers.Control.Scale());
	// map.addControl(new OpenLayers.Control.MousePosition());
	// map.addControl(new OpenLayers.Control.LayerSwitcher({roundedCorner: false}));
	map.setCenter(new OpenLayers.LonLat(1569427, 5876315),14);
	
    
	/**
	 * Event für die Bildsteuerung in der Legende
	 * 
	 * changelayer triggered after a layer name change, order change, opacity change, params change, 
	 * visibility change (due to resolution thresholds) or attribution change (due to extent change).  
	 * Listeners will receive an event object with layer and property properties.  The layer property 
	 * will be a reference to the changed layer.  The property property will be a key to the changed 
	 * property (name, order, opacity, params, visibility or attribution).
	 */
	map.events.register('changelayer', this, layersVisible);
	// map.events.register('zoomend',this, changeToOrto);

	
}

//##################################### LAYER VISIBILITY ########################################
    // Funktionen, die die Layer Visibility steuern
    
/**
 * ändert den Button, wenn die Visibility eines Layers geändert wird
 * _u = unvisible, _v = visible, _o = off
 */
function layersVisible(object){
	if (document.images[object.layer.name]==undefined){return;}
	else{
		 var schwellwerte = {"vasi":28000.0, "krajine": 14000.0, "vrhovi": 14000.0, "gorsko": 14000.0, "gorskoPod": 14000.0, "ledine": 14000.0,
		 					 "krizi": 14000.0, "mlini": 14000.0, "tericne": 14000.0, "izkopanine": 14000.0, "cerkve": 14000.0, "poso": 14000.0, "kmetije":7000.0, "vodotoki":7000.0};
		 var lay = object.layer.name;
		 var scale = map.getScale();
		 var url = "http://benjamin.preisig.at/skofice/img/layer/";
		 // var url = "http://www.gorjanci.at/zemljevid/img/layer/";
		 var visi = object.layer.getVisibility();
		 // alert("lay: "+lay+" scale: "+scale+" visi: "+visi);
		 if((document.images[lay].src == url+lay+"_u.png" || document.images[lay].src == url+lay+"_o.png") && scale < schwellwerte[lay] && visi){
		 	document.images[lay].src = "img/layer/"+lay+"_v.png";
		 }
		 else if((document.images[lay].src == url+lay+"_v.png" || document.images[lay].src == url+lay+"_o.png") && scale > schwellwerte[lay]){
		 	document.images[lay].src = "img/layer/"+lay+"_u.png";
		 }
		 else{
		 	document.images[lay].src = "img/layer/"+lay+"_o.png";
		 }
	}
}
/**
 * löst den Namens-string auf und startet "changeVisibility()" mit dem richtigen Layer
 */
function resolveLayer(name){
	switch (name) {
		case "vasi":
			changeVisibility(vasi);
			break;
		case "krajine":
			changeVisibility(krajine);
			break;
		case "vrhovi":
			changeVisibility(vrhovi);
			break;
		case "gorsko":
			changeVisibility(gorsko);
			break;
		case "gorskoPod":
			changeVisibility(gorskoPod);
			break;
		case "vodotoki":
			changeVisibility(vodotoki);
			break;
		case "ledine":
			changeVisibility(ledine);
			break;
		case "kmetije":
			changeVisibility(kmetije);
			changeVisibility(kmetijePod);
			break;
		case "krizi":
			changeVisibility(krizi);
			break;
		case "mlini":
			changeVisibility(mlini);
			break;
		// case "tericne":
			// changeVisibility(tericne);
			// break;
		// case "cerkve":
			// changeVisibility(cerkve);
			// break;
		default:
			alert("Not possible to resolve Layer!");
			break;
	}
}
/**
 * ändert die Visibility eines Layers, nachdem der Button in der Legende gedrückt wurde
 */
function changeVisibility(name){
	
	if(map.getScale()<=name.minScale&&name.getVisibility()){
		name.setVisibility(false);
		return true;
	}
	else if(map.getScale()<=name.minScale&&!(name.getVisibility())){
		name.setVisibility(true);
		return true;
	}
	else{return;}
}

//##################################### POP-UP ########################################
    // Funktionen für die Pop-Ups

function buildHTML(feature){
	var name = (feature.attributes.name_diale == undefined) ? "" : feature.attributes.name_diale;
    var origin_slo = (feature.attributes.origin_slo == undefined) ? "" : feature.attributes.origin_slo;
    var origin_de = (feature.attributes.origin_de == undefined) ? "" : "<i>"+feature.attributes.origin_de+"</i>";
    var audio = (feature.attributes.audio == undefined) ? "": "<audio controls='controls' autoplay='autoplay' preload='auto'><source src='"+
                             			feature.attributes.audio+"ogg' type='audio/ogg' /><source src='"+feature.attributes.audio+
                             			"mp3' type='audio/mp3' />Your browser does not support the audio tag.</audio><br />";
 	var img = (feature.attributes.img == undefined) ? "": "<a href=\"img/"+feature.attributes.img +".jpg\" onclick='Shadowbox.open({content:\"img/"+
 										feature.attributes.img +".jpg\", player:\"img\", title:\""+feature.attributes.name_diale +
 										"\"});return false' rel=\"shadowbox\" ><img height=\"100\" width= \"133\" src=\"img/"+
 										feature.attributes.img+"_thumbs.png\"></a>";
	var string = "<h3>"+name + "</h3>"+origin_slo+"<br/ >"+origin_de+"<hr/>"+audio+img;
	return string;
                             			
}

function onFeatureSelect(feature) {
	if (feature.popup != null){
		map.addPopup(feature.popup);
	}
	else{
		var htmlString = buildHTML(feature);
		popup = new OpenLayers.Popup.FramedCloud("chicken", 
								 feature.geometry.getBounds().getCenterLonLat(),
								 null,
								 htmlString,
								 null, true, function(event){
									 map.removePopup(feature.popup);//damit das richtige Popup geschlossen wird
									 selectControl.unselect(feature);
								 });
		feature.popup = popup;
		popup.feature = feature;
		map.addPopup(feature.popup);
	}
}
function onFeatureUnselect(feature) {
    if (feature.popup) {
        popup.feature = null;
        map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
    }
}

//##################################### panToVas ########################################
    // Zoom auf die einzelnen Orte
function panToVas(name){
	switch (name) {
		case "dob":
			map.setCenter(new OpenLayers.LonLat(1563973, 5875770),16);
			break;
		case "dobajna":
			map.setCenter(new OpenLayers.LonLat(1573424, 5872572),16);
			break;
		case "gorice":
			map.setCenter(new OpenLayers.LonLat(1571841, 5878954),16);
			break;
		case "gorincice":
			map.setCenter(new OpenLayers.LonLat(1566328, 5872036),16);
			break;
		case "holbice":
			map.setCenter(new OpenLayers.LonLat(1570912, 5875622),16);
			break;
		case "klopce":
			map.setCenter(new OpenLayers.LonLat(1569784, 5874435),16);
			break;
		case "log":
			map.setCenter(new OpenLayers.LonLat(1569333, 5879179),16);
			break;
		case "logavas":
			map.setCenter(new OpenLayers.LonLat(1565557, 5877039),16);
			break;
		case "nagori":
			map.setCenter(new OpenLayers.LonLat(1573785, 5877323),16);
			break;
		case "nagori2":
			map.setCenter(new OpenLayers.LonLat(1569446, 5870311),16);
			break;
		case "otoz":
			map.setCenter(new OpenLayers.LonLat(1568121, 5871095),16);
			break;
		case "paprace":
			map.setCenter(new OpenLayers.LonLat(1568917, 5876496),16);
			break;
		case "pinjavas":
			map.setCenter(new OpenLayers.LonLat(1571729, 5877203),16);
			break;
		case "podjerberk":
			map.setCenter(new OpenLayers.LonLat(1566713, 5874741),16);
			break;
		case "ravne":
			map.setCenter(new OpenLayers.LonLat(1565841, 5873628),16);
			break;
		case "roda":
			map.setCenter(new OpenLayers.LonLat(1572589, 5876525),16);
			break;
		case "rove":
			map.setCenter(new OpenLayers.LonLat(1566803, 5872995),16);
			break;
		case "sentilj":
			map.setCenter(new OpenLayers.LonLat(1565705, 5873317),16);
			break;
		case "skofice":
			map.setCenter(new OpenLayers.LonLat(1569261, 5877703),16);
			break;
		case "suha":
			map.setCenter(new OpenLayers.LonLat(1570778, 5877626),16);
			break;
		case "trebinje":
			map.setCenter(new OpenLayers.LonLat(1566468, 5870882),16);
			break;
		case "zgornjedole":
			map.setCenter(new OpenLayers.LonLat(1571669, 5880239),16);
			break;
		
		default:
			alert("Not possible to resolve Village!");
			break;
	}
}
//##################################### Duplicate ########################################

/**
 * Funktion um Objekte (hier die Styles) zu duplizieren
 * http://stackoverflow.com/questions/728360/copying-an-object-in-javascript
 */
function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // // Handle Date
    // if (obj instanceof Date) {
        // var copy = new Date();
        // copy.setTime(obj.getTime());
        // return copy;
    // }
// 
    // // Handle Array
    // if (obj instanceof Array) {
        // var copy = [];
        // for (var i = 0, var len = obj.length; i < len; ++i) {
            // copy[i] = clone(obj[i]);
        // }
        // return copy;
    // }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
