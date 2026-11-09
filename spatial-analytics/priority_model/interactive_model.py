import config
import geopandas as gpd
import folium

def create_interactive_map(gdf=None, gdf_path=None, output_path=config.MAPS_OUT + "chicago_interactive_map.html"):
    print("Creating interactive model map")
    # Load data
    if gdf is not None:
        print("Using provided GeoDataFrame") 
    elif gdf_path is not None:
        gdf = gpd.read_file(gdf_path)
    else:
        raise ValueError('Must provide either \'gdf\' (GeoDataFrame) or a valid \'gdf_path\' (string).')

    # Set CRS to EPSG:4326 
    if gdf.crs != "EPSG:4326":
        gdf = gdf.to_crs("EPSG:4326")

    # Initialize Base Map in Chicago
    m = folium.Map(location=[41.8781, -87.6298], zoom_start=11, tiles=None)

    # Base Tile Layer (Esri Light Gray Base)
    folium.TileLayer(
        tiles="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        attr="Esri, HERE, Garmin, USGS",
        name="Light Base",
        control=False
    ).add_to(m)

    # GeoJSON Layer
    columns = ["GEOID", "CoL", "LoL", "Model_Score"]
    aliases = ["Block Group ID:", "Cost of Lead:", "Likelihood of Lead:", "Final Priority Score:"]
    
    geojson_layer = folium.GeoJson(
        gdf,
        name="Chicago Priority Data",
        style_function=lambda x: {
            "fillColor": "#fee08b",
            "color": "#333333",
            "weight": 0.5,
            "fillOpacity": 0.7,
        },
        tooltip=folium.GeoJsonTooltip(
            fields=columns,
            aliases=aliases,
            localize=True,
            sticky=False,
            labels=True,
            style="background-color: #F0EFEF; border: 2px solid black; border-radius: 3px;"
        ),
        popup=folium.GeoJsonPopup(
            fields=columns,
            aliases=aliases,
            localize=True,
            labels=True,
            style="background-color: white; color: #333; font-family: sans-serif; font-size: 12px; padding: 10px;"
        )
    ).add_to(m)

    # Reference Labels Layer. Adds a light gray reference layer with labels on top of the base map.
    folium.TileLayer(
        tiles="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        attr="Esri, OpenStreetMap",
        name="Labels",
        overlay=True,
        control=False
    ).add_to(m)

    # Get Leaflet variable name for GeoJSON layer
    layer_var = geojson_layer.get_name()

    # Dropdown + Slider HTML & Script
    # Creates filter slider and dropdown for selecting metric layer and filtering by minimum threshold.
    control_ui_html = f'''
    <div id="filterControlCard" style="
        position: fixed; 
        top: 80px; 
        right: 20px; 
        z-index: 99999; 
        background: white; 
        padding: 14px 16px; 
        border-radius: 8px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.25); 
        font-family: Arial, sans-serif; 
        width: 220px;">
        
        <label for="metricSelect" style="font-size: 12px; font-weight: bold; color: #333; display: block; margin-bottom: 4px;">
            Metric Layer:
        </label>
        <select id="metricSelect" style="width: 100%; padding: 6px; margin-bottom: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px;">
            <option value="Model_Score" selected>Final Priority Score</option>
            <option value="LoL">Likelihood of Lead (LoL)</option>
            <option value="CoL">Cost of Lead (CoL)</option>
        </select>

        <label for="scoreSlider" style="font-size: 12px; font-weight: bold; color: #333; display: block; margin-bottom: 4px;">
            Min Threshold: <span id="sliderVal" style="color: #d73027; font-size: 13px;">0.00</span>
        </label>
        <input type="range" id="scoreSlider" style="width: 100%; cursor: pointer;">
    </div>

    <script>
        window.addEventListener('load', function() {{
            var metricSelect = document.getElementById("metricSelect");
            var slider = document.getElementById("scoreSlider");
            var sliderVal = document.getElementById("sliderVal");
            var targetLayer = {layer_var};

            function getColor(val, min, max) {{
                if (max === min) return "#fee08b";
                var ratio = Math.max(0, Math.min(1, (val - min) / (max - min)));
                var r = 255;
                var g = Math.round(255 * (1 - ratio * 0.75));
                var b = Math.round(191 * (1 - ratio));
                return "rgb(" + r + "," + g + "," + b + ")";
            }}

            function updateDisplay() {{
                var selectedMetric = metricSelect.value;
                var min = Infinity;
                var max = -Infinity;

                // 1. Determine min and max for active metric
                targetLayer.eachLayer(function(layer) {{
                    var val = parseFloat(layer.feature.properties[selectedMetric]);
                    if (!isNaN(val)) {{
                        if (val < min) min = val;
                        if (val > max) max = max < val ? val : max;
                    }}
                }});

                // 2. Adjust slider bounds when metric changes
                if (slider.dataset.activeMetric !== selectedMetric) {{
                    slider.min = min;
                    slider.max = max;
                    slider.step = (max - min) / 100 || 0.01;
                    slider.value = min;
                    slider.dataset.activeMetric = selectedMetric;
                }}

                var threshold = parseFloat(slider.value);
                sliderVal.innerText = threshold.toFixed(2);

                // 3. Update styling and layer visibility
                targetLayer.eachLayer(function(layer) {{
                    var val = parseFloat(layer.feature.properties[selectedMetric]);
                    var element = layer.getElement();
                    
                    if (val >= threshold) {{
                        if (element) element.style.display = '';
                        layer.setStyle({{
                            fillColor: getColor(val, min, max),
                            fillOpacity: 0.7
                        }});
                    }} else {{
                        if (element) element.style.display = 'none';
                    }}
                }});
            }}

            metricSelect.addEventListener("change", updateDisplay);
            slider.addEventListener("input", updateDisplay);

            // Trigger initial render
            setTimeout(updateDisplay, 200);
        }});
    </script>
    '''
    
    # Add the control UI HTML to the map
    m.get_root().html.add_child(folium.Element(control_ui_html))

    m.save(output_path)
    print(f"Map successfully updated and saved to {output_path}")