var map = null;
var selectControl, vasi, vasi_na, krajine, krajine_na, ledine, ledine_na, krizi, krizi_na, kmetije, kmetije_na,
	vrhovi, vrhovi_na, mlini, kmetijePod, kmetijePod_na, tericne, cerkve ;


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
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        units: "m",
        numZoomLevels: 20,
        maxResolution: maxResolution,
        maxExtent: maxExtent,
        restrictedExtent: restrictedExtent,
        controls:[]	//leer, da sie unten manuell custom-Controls aufgerufen werden
    };
    map = new OpenLayers.Map('map', options);

    //##################################### LABEL STYLES ########################################
    // Definition der Label-Styles
	
	// Die Styles werden als Objekte gespeichert um sie einfacher für die jeweiligen Klassen anpassen zu können
	var defaultStyle = {
		fill: false,
        label : "${GEONAME_MA}",
        labelHaloColor: "white",
        labelHaloWidth: "3",
        cursor: "pointer",
        labelXOffset: 0,
		labelYOffset: 0,
        fontColor: "black",
        fontSize: "24px",
        fontFamily: "calibripw",
        labelSelect: true,
        labelAlign: "cm",
        angle: "${Angle}"
	};
	var selectStyle = {
		cursor: "pointer",
	 	label : "${GEONAME_MA}",
        labelXOffset: 0,
		labelYOffset: 0,
        fontColor: "black",
        fontSize: "24px",
        fontFamily: "calibripw",
        labelSelect: true,
        labelAlign: "cm",
        angle: "${Angle}"
	};
	var temporaryStyle = {
		cursor: "pointer",
	 	label : "${GEONAME_MA}",
	 	labelHaloColor: "white",
        labelHaloWidth: "3",
        labelXOffset: 0,
		labelYOffset: 0,
        fontColor: "red",
        fontSize: "24px",
        fontFamily: "calibripw",
        labelSelect: true,
        labelAlign: "cm",
        angle: "${Angle}"
	};
	
	// Variable die den Inhalt für den Cluster definiert
	var cluster = {
    	context:{
    		
    		GEONAME_MA: function(feature) { 
    			feature.attributes.GEONAME_MA = feature.cluster[0].attributes.GEONAME_MA;
    			feature.attributes.Angle = feature.cluster[0].attributes.Angle;
    			feature.attributes.link = feature.cluster[0].attributes.link;
    			feature.attributes.img = feature.cluster[0].attributes.img;
    			feature.attributes.info_html = (feature.cluster[0].attributes.info_html != undefined) ? feature.cluster[0].attributes.info_html : "";
    			return feature.attributes.GEONAME_MA; 
    		},
    		Angle: function(feature) {
				return feature.attributes.Angle; 
			}
    			
    	}
    };
	
	//anpassen der Styles an die Klasse
	var dSVasi = clone(defaultStyle);
	var sSVasi = clone(selectStyle);
	var tSVasi = clone(temporaryStyle);
	tSVasi["fontSize"] = "25px";
	
	//definieren der StyleMap für die Klasse
    var vasiStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSVasi), // so sehen die Namen auf der Karte aus
    	'select': new OpenLayers.Style(sSVasi), 
    	'temporary': new OpenLayers.Style(tSVasi) // so sehen die Namen nach einem mouseOver aus
    });
    
    var dSVasi_na = clone(dSVasi);
    dSVasi_na["labelSelect"] = "false";
	var sSVasi_na = clone(sSVasi);
	sSVasi_na["labelSelect"] = "false";
	var tSVasi_na = clone(tSVasi);
	tSVasi_na["labelSelect"] = "false";
	
    var vasi_naStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSVasi_na), // so sehen die Namen auf der Karte aus
    	'select': new OpenLayers.Style(sSVasi_na), 
    	'temporary': new OpenLayers.Style(tSVasi_na) // so sehen die Namen nach einem mouseOver aus
    });
    
    var dSVasi_uradno = clone(dSVasi);
    dSVasi_uradno["label"] = "${GEONAME_SL} | ${GEONAME}";
    dSVasi_uradno["labelAlign"] = "ct";
    dSVasi_uradno["labelSelect"] = "false";
    dSVasi_uradno["fontSize"] = "14px";
	var sSVasi_uradno = clone(sSVasi);
	sSVasi_uradno["label"] = "${GEONAME_SL} | ${GEONAME}";
	sSVasi_uradno["labelSelect"] = "false";
	sSVasi_uradno["fontSize"] = "18px";
	var tSVasi_uradno = clone(tSVasi);
	tSVasi_uradno["label"] = "${GEONAME_SL} | ${GEONAME}";
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
    
    var dSKrajine_na = clone(dSKrajine);
    dSKrajine_na["labelSelect"] = "false";
    var sSKrajine_na = clone(sSKrajine);
    sSKrajine_na["labelSelect"] = "false";
    var tSKrajine_na = clone(tSKrajine);
    tSKrajine_na["labelSelect"] = "false";
    
    var krajine_naStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSKrajine_na),
    	'select': new OpenLayers.Style(sSKrajine_na),
    	'temporary': new OpenLayers.Style(tSKrajine_na)
    });
    
    var dSLedine = clone(defaultStyle);
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
    var dSLedine_na = clone(dSLedine);
    dSLedine_na["labelSelect"] = "false";
    var sSLedine_na = clone(sSLedine);
    sSLedine_na["labelSelect"] = "false";
    var tSLedine_na = clone(tSLedine);
    tSLedine_na["labelSelect"] = "false";
    
    var ledine_naStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSLedine_na,cluster),
    	'select': new OpenLayers.Style(sSLedine_na),
    	'temporary': new OpenLayers.Style(tSLedine_na)
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
    
    var dSKmetije_na = clone(dSKmetije);
    dSKmetije_na["labelSelect"] = "false";
    var sSKmetije_na = clone(sSKmetije);
    sSKmetije_na["labelSelect"] = "false";
    var tSKmetije_na = clone(tSKmetije);
    tSKmetije_na["labelSelect"] = "false";
    
    var kmetije_naStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSKmetije_na, cluster),
    	'select': new OpenLayers.Style(sSKmetije_na),
    	'temporary': new OpenLayers.Style(tSKmetije_na)
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
    
    var dSKmetijePod_na = clone(dSKmetije_na);
    dSKmetijePod_na["externalGraphic"] = "img/icn/hisica_pod.png";
    var sSKmetijePod_na = clone(sSKmetije_na);
    var tSKmetijePod_na = clone(tSKmetije_na);
    
    var kmetijePod_naStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSKmetijePod_na),
    	'select': new OpenLayers.Style(sSKmetijePod_na),
    	'temporary': new OpenLayers.Style(tSKmetijePod_na)
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
    
    var dSVrhovi_na = clone(dSVrhovi);
    dSVrhovi_na["labelSelect"] = "false";
    var sSVrhovi_na = clone(sSVrhovi);
    sSVrhovi_na["labelSelect"] = "false";
    var tSVrhovi_na = clone(tSVrhovi);
    tSVrhovi_na["labelSelect"] = "false";
    
    var vrhovi_naStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSVrhovi_na),
    	'select': new OpenLayers.Style(sSVrhovi_na),
    	'temporary': new OpenLayers.Style(tSVrhovi_na)
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
    
    var dSKrizi_na = clone(dSKrizi);
    dSKrizi_na["labelSelect"] = "false";
    var sSKrizi_na = clone(sSKrizi);
    sSKrizi_na["labelSelect"] = "false";
    var tSKrizi_na = clone(tSKrizi);
    tSKrizi_na["labelSelect"] = "false";
    
    var krizi_naStylemap = new OpenLayers.StyleMap({
    	'default': new OpenLayers.Style(dSKrizi_na),
    	'select': new OpenLayers.Style(sSKrizi_na),
    	'temporary': new OpenLayers.Style(tSKrizi_na)
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
        'graphicWidth': '14',
        'graphicHeight': '14',
        'graphicOpacity': '1'
   	});
    
    var cerkveStylemap = new OpenLayers.StyleMap({
    	'externalGraphic': 'img/icn/Church.png',
        'graphicWidth': '15',
        'graphicHeight': '15',
        'graphicOpacity': '1'
        });
    
    // jeder Layer braucht seine eigene Strategy (vll mit clone zu lösen?? aber wurscht, da eh nur eine Zeile)
    // var vasiStrategy = new OpenLayers.Strategy.BBOX();
    // var krajineStrategy = new OpenLayers.Strategy.BBOX();
    // var ledineStrategy = new OpenLayers.Strategy.Cluster();
    // var kmetijeStrategy = new OpenLayers.Strategy.BBOX();
    
    var vasiStrategy = new OpenLayers.Strategy.BBOX();
    var vasi_naStrategy = new OpenLayers.Strategy.BBOX();
    var vasi_uradnoStrategy = new OpenLayers.Strategy.BBOX();
	var krajineStrategy = new OpenLayers.Strategy.BBOX();
	var krajine_naStrategy = new OpenLayers.Strategy.BBOX();
    var ledineStrategy = new OpenLayers.Strategy.BBOX();
    var ledineClusterStrategy = new OpenLayers.Strategy.Cluster({distance: 40, threshold: 1});
    var ledine_naClusterStrategy = new OpenLayers.Strategy.Cluster({distance: 40, threshold: 1});
    var ledine_naStrategy = new OpenLayers.Strategy.BBOX();
    var kmetijeStrategy = new OpenLayers.Strategy.BBOX();
    var kmetijeClusterStrategy = new OpenLayers.Strategy.Cluster({distance: 40, threshold: 1});
    var kmetije_naClusterStrategy = new OpenLayers.Strategy.Cluster({distance: 40, threshold: 1});
    var kmetije_naStrategy = new OpenLayers.Strategy.BBOX();
    var kmetijePodStrategy = new OpenLayers.Strategy.BBOX();
    var kmetijePod_naStrategy = new OpenLayers.Strategy.BBOX();
    var vrhoviStrategy = new OpenLayers.Strategy.BBOX();
    var vrhovi_naStrategy = new OpenLayers.Strategy.BBOX();
    var kriziStrategy = new OpenLayers.Strategy.BBOX();
    var krizi_naStrategy = new OpenLayers.Strategy.BBOX();
    var mliniStrategy = new OpenLayers.Strategy.BBOX();
    var tericneStrategy = new OpenLayers.Strategy.BBOX();
    var cerkveStrategy = new OpenLayers.Strategy.BBOX();
    
    //##################################### LAYER ########################################
    // Definition und Aufruf der Layer
    
    var osm_tms = new OpenLayers.Layer.TMS( "osm_tms",
        "http://benjamin.preisig.at/mapcache/tms/",
        { layername: 'osm@g', type: "png", serviceVersion:"1.0.0",
          gutter:0,buffer:0,isBaseLayer:true,transitionEffect:'resize',
          tileOrigin: new OpenLayers.LonLat(-20037508.342789,-20037508.342789),
          resolutions:[156543.03392804099712520838,78271.51696402048401068896,39135.75848201022745342925,19567.87924100512100267224,9783.93962050256050133612,4891.96981025128025066806,2445.98490512564012533403,1222.99245256282006266702,611.49622628141003133351,305.74811314070478829308,152.87405657035250783338,76.43702828517623970583,38.21851414258812695834,19.10925707129405992646,9.55462853564703173959,4.77731426782351586979,2.38865713391175793490,1.19432856695587897633,0.59716428347793950593],
          zoomOffset:0,
          units:"m",
          maxExtent: new OpenLayers.Bounds(-20037508.342789,-20037508.342789,20037508.342789,20037508.342789),
          projection: new OpenLayers.Projection("EPSG:900913".toUpperCase()),
          sphericalMercator: true,
          isBaseLayer: true,
          identifier: "osm_tms",
          attribution: "(c) OpenStreetMap contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/'> CC-BY-SA</a>, Map data (c) OpenStreetMap contributors,<a href='http://creativecommons.org/licenses/by-sa/2.0/'> CC-BY-SA</a>"
     }
    );
    
    var geoimage = new OpenLayers.Layer.WMS(
    	"geoimage",
    	"http://gis.lebensministerium.at/wmsgw/?key=24dd6acc3549237fb5d46e3a90cab1c6&",
    	{layers:"Satellitenbild_30m,Luftbild_8m,Luftbild_1m,Luftbild_MR"},
    	{isBaseLayer:true, identifier: "geoimage", attribution: "Orthophoto by <a href='http://www.geoimage.at'>www.geoimage.at</a>(c)"}
    );	
    var hs = new OpenLayers.Layer.OSM(
        "Hillshade",
        "http://toolserver.org/~cmarqu/hill/${z}/${x}/${y}.png",
        {isBaseLayer:false, displayInLayerSwitcher:false, minScale:218000.0, maxScale:10000.0}
    );
    
    //am besten wenn alle Namen die mit einem Layer zu tun haben (variable, "name", .gml, im HTML-file, ...) gleich lauten: z.B. vasi
	vasi = new OpenLayers.Layer.Vector("vasi", {
	    styleMap: vasiStylemap,
	    strategies: [vasiStrategy],
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/vasi.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:30000.0
   	});
   	
   	vasi_na = new OpenLayers.Layer.Vector("vasi_na", {
	    styleMap: vasi_naStylemap,
	    strategies: [vasi_naStrategy],
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/vasi_na.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:30000.0
   	});
   	vasi_uradno = new OpenLayers.Layer.Vector("vasi_uradno", {
	    styleMap: vasi_uradnoStylemap,
	    strategies: [vasi_uradnoStrategy],
	    renderers: ["MySVG"],
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
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/krajine.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	krajine_na = new OpenLayers.Layer.Vector("krajine_na", {
	    styleMap: krajine_naStylemap,
	    strategies: [krajine_naStrategy],
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/krajine_na.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	ledine = new OpenLayers.Layer.Vector("ledine", {
	    styleMap: ledineStylemap,
	    strategies: [ledineStrategy, ledineClusterStrategy],
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/ledine.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	ledine_na = new OpenLayers.Layer.Vector("ledine_na", {
	    styleMap: ledine_naStylemap,
	    strategies: [ledine_naStrategy, ledine_naClusterStrategy],
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/ledine_na.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	kmetije = new OpenLayers.Layer.Vector("kmetije", {
	    styleMap: kmetijeStylemap,
	    strategies: [kmetijeStrategy, kmetijeClusterStrategy],
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/kmetije.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:7000.0
   	});
   	
   	kmetije_na = new OpenLayers.Layer.Vector("kmetije_na", {
	    styleMap: kmetije_naStylemap,
	    strategies: [kmetije_naStrategy, kmetije_naClusterStrategy],
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/kmetije_na.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:7000.0
   	});
   	
   	kmetijePod = new OpenLayers.Layer.Vector("kmetijePod", {
	    styleMap: kmetijePodStylemap,
	    strategies: [kmetijePodStrategy],
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/kmetijePod.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:7000.0
   	});
   	
   	kmetijePod_na = new OpenLayers.Layer.Vector("kmetijePod_na", {
	    styleMap: kmetijePod_naStylemap,
	    strategies: [kmetijePod_naStrategy],
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/kmetijePod_na.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:7000.0
   	});
   	
   	vrhovi = new OpenLayers.Layer.Vector("vrhovi", {
	    styleMap: vrhoviStylemap,
	    strategies: [vrhoviStrategy],
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/vrhovi.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	vrhovi_na = new OpenLayers.Layer.Vector("vrhovi_na", {
	    styleMap: vrhovi_naStylemap,
	    strategies: [vrhovi_naStrategy],
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/vrhovi_na.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	krizi = new OpenLayers.Layer.Vector("krizi", {
	    styleMap: kriziStylemap,
	    strategies: [kriziStrategy],
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/krizi.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	krizi_na = new OpenLayers.Layer.Vector("krizi_na", {
	    styleMap: krizi_naStylemap,
	    strategies: [krizi_naStrategy],
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/krizi_na.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	mlini = new OpenLayers.Layer.Vector("mlini", {
	    styleMap: mliniStylemap,
	    strategies: [mliniStrategy],
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/mlini.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	tericne = new OpenLayers.Layer.Vector("tericne", {
	    styleMap: tericneStylemap,
	    strategies: [tericneStrategy],
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/tericne.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	cerkve = new OpenLayers.Layer.Vector("cerkve", {
	    styleMap: cerkveStylemap,
	    strategies: [cerkveStrategy],
	    renderers: ["MySVG"],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "gml/cerkve.gml",
            format: new OpenLayers.Format.GML()
        }),
        isBaseLayer: false,
        minScale:15000.0
   	});
   	
   	map.addLayers([osm_tms, geoimage, hs]);
   	map.addLayers([cerkve, tericne, mlini, krizi_na, krizi, vrhovi_na, vrhovi, kmetijePod_na, kmetijePod, 
   							kmetije_na, kmetije, ledine_na, ledine, krajine_na, krajine, vasi_uradno, vasi_na, vasi]);

   	//##################################### EVENTS ########################################
    // Definition der Events für Pop-Ups und Hover
    
    //Events für Pop-Ups
   	vasi.events.register("featureselected", vasi, onFeatureSelect);
   	vasi.events.register("featureunselected", vasi, onFeatureUnselect);
   	krajine.events.register("featureselected", krajine, onFeatureSelect);
   	krajine.events.register("featureunselected", krajine, onFeatureUnselect);
   	ledine.events.register("featureselected", ledine, onFeatureSelect);
   	ledine.events.register("featureunselected", ledine, onFeatureUnselect);
   	kmetije.events.register("featureselected", kmetije, onFeatureSelect);
   	kmetije.events.register("featureunselected", kmetije, onFeatureUnselect);
   	kmetijePod.events.register("featureselected", kmetijePod, onFeatureSelect);
   	kmetijePod.events.register("featureunselected", kmetijePod, onFeatureUnselect);
   	vrhovi.events.register("featureselected", vrhovi, onFeatureSelect);
   	vrhovi.events.register("featureunselected", vrhovi, onFeatureUnselect);
   	krizi.events.register("featureselected", krizi, onFeatureSelect);
   	krizi.events.register("featureunselected", krizi, onFeatureUnselect);
   	mlini.events.register("featureselected", mlini, onFeatureSelect);
   	mlini.events.register("featureunselected", mlini, onFeatureUnselect);
   	
   	//Events für hover
   	var highlightCtrl = new OpenLayers.Control.SelectFeature(vasi, {
        hover: true,
        highlightOnly: true,
        renderIntent: "temporary"
    });
    map.addControl(highlightCtrl);
    highlightCtrl.activate();
    highlightCtrl.setLayer([vasi, krajine, ledine, kmetije, kmetijePod, vrhovi, krizi, mlini]);
    selectControl = new OpenLayers.Control.SelectFeature(vasi,
        {clickout: true}
    );
    map.addControl(selectControl);
	selectControl.activate();
	selectControl.setLayer([vasi, krajine, ledine, kmetije, kmetijePod, vrhovi, krizi, mlini]);
	
	//##################################### CONTROLS ########################################
    // Definition der custom Controls
    
    //zoom Controls über CSS in openlayers/theme/default/style.css und styles/style.css definiert
    var panel = new OpenLayers.Control.Panel();
	panel.addControls([ 
		new OpenLayers.Control.ZoomIn({title:'Zoom in'}),
		new OpenLayers.Control.ZoomOut({title:"Zoom out"}) 
	]); 
	
	map.addControl(new OpenLayers.Control.Attribution());
	map.addControl(new OpenLayers.Control.Navigation());
 	map.addControl(panel);
 	
    // map.addControl(new OpenLayers.Control.Scale());
	// map.addControl(new OpenLayers.Control.MousePosition());
	// map.addControl(new OpenLayers.Control.LayerSwitcher({roundedCorner: false}));
	map.setCenter(new OpenLayers.LonLat(1584428, 5870741),14);
	
    
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
		 var schwellwerte = {"vasi":28000.0, "krajine": 14000.0, "vrhovi": 14000.0, "ledine": 14000.0,
		 					 "krizi": 14000.0, "mlini": 14000.0, "tericne": 14000.0, "cerkve": 14000.0, "kmetije":7000.0};
		 var lay = object.layer.name;
		 var scale = map.getScale();
		 var url = "http://benjamin.preisig.at/gorjanci/img/layer/";
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
			changeVisibility(vasi_na);
			break;
		case "krajine":
			changeVisibility(krajine);
			changeVisibility(krajine_na);
			break;
		case "vrhovi":
			changeVisibility(vrhovi);
			changeVisibility(vrhovi_na);
			break;
		case "ledine":
			changeVisibility(ledine);
			changeVisibility(ledine_na);
			break;
		case "kmetije":
			changeVisibility(kmetije);
			changeVisibility(kmetije_na);
			changeVisibility(kmetijePod);
			changeVisibility(kmetijePod_na);
			break;
		case "krizi":
			changeVisibility(krizi);
			changeVisibility(krizi_na);
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
    
function selected (evt) {
    alert(evt.feature.id + " selected on " + this.name);
}

function onPopupClose(evt) {
    // 'this' is the popup.
    selectControl.unselect(this.feature);
}
function onFeatureSelect(evt) {
    feature = evt.feature;
    var htmlString = buildHTML(feature);
    popup = new OpenLayers.Popup.FramedCloud("featurePopup",
                             feature.geometry.getBounds().getCenterLonLat(),
                             new OpenLayers.Size(100,100),
                             htmlString,
                             null, true, onPopupClose);
    feature.popup = popup;
    popup.feature = feature;
    map.addPopup(popup);
}
function onFeatureUnselect(evt) {
    feature = evt.feature;
    if (feature.popup) {
        popup.feature = null;
        map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
    }
}

function buildHTML(feature){
	var name = (feature.attributes.GEONAME_MA == undefined) ? "" : feature.attributes.GEONAME_MA;
    var info_html = (feature.attributes.info_html == undefined) ? "" : feature.attributes.info_html;
    var link = (feature.attributes.link == undefined) ? "": "<audio controls='controls' autoplay='autoplay'><source src='"+
                             			feature.attributes.link+"ogg' type='audio/ogg' /><source src='"+feature.attributes.link+
                             			"mp3' type='audio/mp3' />Your browser does not support the audio tag.</audio><br />";
 	var img = (feature.attributes.img == undefined) ? "": "<a href=\""+feature.attributes.img +".jpg\" onclick='Shadowbox.open({content:\""+
 										feature.attributes.img +".jpg\", player:\"img\", title:\""+feature.attributes.GEONAME_MA +
 										"\"});return false' rel=\"shadowbox\" ><img height=\"100\" width= \"133\" src=\""+
 										feature.attributes.img+"_thumbs.png\"></a>";
	var string = "<h3>"+name + "</h3>"+info_html+"<hr/>"+link+img;
	return string;
                             			
}

//##################################### panToVas ########################################
    // Zoom auf die einzelnen Orte
function panToVas(name){
	switch (name) {
		case "kotmaravas":
			map.setCenter(new OpenLayers.LonLat(1584428, 5870741),16);
			break;
		case "cahorce":
			map.setCenter(new OpenLayers.LonLat(1583090, 5869555),16);
			break;
		case "vrde":
			map.setCenter(new OpenLayers.LonLat(1581233, 5872785),16);
			break;
		case "mostec":
			map.setCenter(new OpenLayers.LonLat(1580918, 5871882),16);
			break;
		case "crezdol":
			map.setCenter(new OpenLayers.LonLat(1580454, 5871170),16);
			break;
		case "novoselo":
			map.setCenter(new OpenLayers.LonLat(1579944, 5869881),16);
			break;
		case "smarjeta":
			map.setCenter(new OpenLayers.LonLat(1581234, 5870070),16);
			break;
		case "plesivec":
			map.setCenter(new OpenLayers.LonLat(1583666, 5872114),16);
			break;
		case "talir":
			map.setCenter(new OpenLayers.LonLat(1583899, 5869571),16);
			break;
		case "preblje":
			map.setCenter(new OpenLayers.LonLat(1585504, 5869237),16);
			break;
		case "sentkandolf":
			map.setCenter(new OpenLayers.LonLat(1585117, 5870441),16);
			break;
		case "gorje":
			map.setCenter(new OpenLayers.LonLat(1587505, 5869993),16);
			break;
		case "trabesinje":
			map.setCenter(new OpenLayers.LonLat(1586555, 5872100),16);
			break;
		case "humberk":
			map.setCenter(new OpenLayers.LonLat(1587653, 5868770),16);
			break;
		case "podgradom":
			map.setCenter(new OpenLayers.LonLat(1586517, 5868253),16);
			break;
		case "razpotje":
			map.setCenter(new OpenLayers.LonLat(1587770, 5869314),16);
			break;
		case "zvonina":
			map.setCenter(new OpenLayers.LonLat(1587474, 5872970),16);
			break;
		case "rocica":
			map.setCenter(new OpenLayers.LonLat(1588388, 5872626),16);
			break;
		case "ilovje":
			map.setCenter(new OpenLayers.LonLat(1589874, 5873901),16);
			break;
		case "hovc":
			map.setCenter(new OpenLayers.LonLat(1588722, 5872051),16);
			break;
		case "cezava":
			map.setCenter(new OpenLayers.LonLat(1588719, 5870455),16);
			break;
		case "medrejtre":
			map.setCenter(new OpenLayers.LonLat(1587600, 5871144),16);
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
