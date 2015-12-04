OpenLayers.Renderer.CustomVML = OpenLayers.Class(OpenLayers.Renderer.VML, {
	
	
	/**
     * Constructor: OpenLayers.Renderer.VML
     * Create a new VML renderer.
     *
     * Parameters:
     * containerID - {String} The id for the element that contains the renderer
     */
    initialize: function(containerID) {
        if (!this.supported()) { 
            return; 
        }
        if (!document.namespaces.olv) {
            document.namespaces.add("olv", this.xmlns);
            var style = document.createStyleSheet();
            var shapes = ['shape','rect', 'oval', 'fill', 'stroke', 'imagedata', 'group','textbox','textpath','path']; 
            for (var i = 0, len = shapes.length; i < len; i++) {

                style.addRule('olv\\:' + shapes[i], "behavior: url(#default#VML); " +
                              "position: absolute; display: inline-block;");
            }                  
        }
        
        OpenLayers.Renderer.Elements.prototype.initialize.apply(this, 
                                                                arguments);
        this.offset = {x: 0, y: 0};
    },
    
	/**
     * Method: drawText
     * This method is only called by the renderer itself.
     * 
     * Parameters: 
     * featureId - {String}
     * style -
     * location - {<OpenLayers.Geometry.Point>}
     */
    drawText: function(featureId, style, location) {
        var label = this.nodeFactory(featureId + this.LABEL_ID_SUFFIX, "olv:shape");       
        this.textRoot.appendChild(label);
                
        // Get the style of the shape, then copy it to the label.
        var layer = this.map.getLayer(this.container.id);
        var feature = layer.getFeatureById(featureId);
        location = (feature.attributes.centroid ? feature.attributes.centroid : location);
        
        var geometry = feature.geometry;
        
        this.setNodeDimension(label, geometry);
        label.style.flip = "y";                
        
        // Get the path of shape to calulate the line needed for the shape here. 
        var resolution = this.getResolution();
    
        var vertices = [];
        var linearRing, i, j, len, ilen, comp, x, y;
        for (j = 0, len=geometry.components.length; j<len; j++) {
            linearRing = geometry.components[j];

            for (i=0, ilen=linearRing.components.length; i<ilen; i++) {
                comp = linearRing.components[i];
                x = comp.x / resolution - this.offset.x;
                y = comp.y / resolution - this.offset.y;
                vertices.push([parseInt(x.toFixed()), parseInt(y.toFixed())]);                
            }            
        }  
      
        var point1 = new Object();
        point1.x = (vertices[0][0] + vertices[1][0])/2;
        point1.y = (vertices[0][1] + vertices[1][1])/2;      
        
        var point2 = new Object();
        point2.x = (vertices[2][0] + vertices[3][0])/2;
        point2.y = (vertices[2][1] + vertices[3][1])/2;

        
        // Flip y        
        var y = label.coordorigin.y;
        
        var point1FlipY = new Object();          
        point1FlipY.y = y - (point1.y - y) + label.coordsize.y;
        
        var point2FlipY = new Object();        
        point2FlipY.y = y - (point2.y - y) + label.coordsize.y;        
        label.path = " m" + point1.x.toFixed() + "," + point1FlipY.y.toFixed() + " l" + point2.x.toFixed() + "," + point2FlipY.y.toFixed() + " e"; 	 
        		
        
        var path = this.nodeFactory(featureId + this.LABEL_ID_SUFFIX + "_path", "olv:path");
        path.textpathok = true;       
        label.appendChild(path);

		var textbox = this.nodeFactory(featureId + this.LABEL_ID_SUFFIX + "_textpath", "olv:textpath");
		textbox.string = style.label;
		textbox.on = true;		
		
		label.stroke.on = false;
        if (style.fontColor) {
            label.fillcolor = style.fontColor;                         
        }
        if (style.fontFamily) {
            textbox.style.fontFamily = style.fontFamily;
        }
        if (style.fontSize) {
            textbox.style.fontSize = style.fontSize;
        }
        if (style.fontWeight) {
            textbox.style.fontWeight = style.fontWeight;
        }
        
    	label.appendChild(textbox);
    },
    
	CLASS_NAME: "OpenLayers.Control.CustomVML"
});