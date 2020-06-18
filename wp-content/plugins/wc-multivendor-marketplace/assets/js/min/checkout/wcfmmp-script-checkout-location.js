jQuery(document).ready(function(o){var e=geocoder=marker=map_marker=infowindow="";function t(e,t,a,n){n&&("google"==wcfm_maps.lib?document.getElementById("wcfmmp_user_location").value=e:(o("#wcfmmp_user_location").val(e),o("#leaflet_wcfmmp_user_location").find(".search-input").val(e))),document.getElementById("wcfmmp_user_location_lat").value=t,document.getElementById("wcfmmp_user_location_lng").value=a,o(document.body).trigger("update_checkout")}function a(o,t,a){google.maps.event.addListener(t,"click",function(){o.setContent(a),o.open(e,t)})}$wcfmmp_user_location_lat=jQuery("#wcfmmp_user_location_lat").val(),$wcfmmp_user_location_lng=jQuery("#wcfmmp_user_location_lng").val(),jQuery("#wcfmmp_user_location_lat").length>0&&setTimeout(function(){!function(){if("google"==wcfm_maps.lib){var n=new google.maps.LatLng(wcfmmp_checkout_map_options.default_lat,wcfmmp_checkout_map_options.default_lng,13);e=new google.maps.Map(document.getElementById("wcfmmp-user-locaton-map"),{center:n,mapTypeId:google.maps.MapTypeId.ROADMAP,zoom:parseInt(wcfmmp_checkout_map_options.default_zoom)});var r={url:wcfmmp_checkout_map_options.store_icon,scaledSize:new google.maps.Size(wcfmmp_checkout_map_options.icon_width,wcfmmp_checkout_map_options.icon_height),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(0,0)};marker=new google.maps.Marker({map:e,position:n,animation:google.maps.Animation.DROP,icon:r,draggable:!0});var m=document.getElementById("wcfmmp_user_location");geocoder=new google.maps.Geocoder;var i=new google.maps.places.Autocomplete(m);i.bindTo("bounds",e),infowindow=new google.maps.InfoWindow,i.addListener("place_changed",function(){infowindow.close(),marker.setVisible(!1);var o=i.getPlace();o.geometry?(o.geometry.viewport?e.fitBounds(o.geometry.viewport):(e.setCenter(o.geometry.location),e.setZoom(parseInt(wcfmmp_checkout_map_options.default_zoom))),marker.setPosition(o.geometry.location),marker.setVisible(!0),t(o.formatted_address,o.geometry.location.lat(),o.geometry.location.lng(),!1),infowindow.setContent(o.formatted_address),infowindow.open(e,marker),a(infowindow,marker,o.formatted_address)):window.alert("Autocomplete returned place contains no geometry")}),google.maps.event.addListener(marker,"dragend",function(){geocoder.geocode({latLng:marker.getPosition()},function(o,n){n==google.maps.GeocoderStatus.OK&&o[0]&&(t(o[0].formatted_address,marker.getPosition().lat(),marker.getPosition().lng(),!0),infowindow.setContent(o[0].formatted_address),infowindow.open(e,marker),a(infowindow,marker,o[0].formatted_address))})})}else{o("#wcfmmp_user_location").replaceWith('<div id="leaflet_wcfmmp_user_location"></div><input type="hidden" class="wcfm_custom_hide" name="wcfmmp_user_location" id="wcfmmp_user_location" />'),$wcfmmp_user_location_lat&&$wcfmmp_user_location_lng?((e=new L.Map("wcfmmp-user-locaton-map",{zoom:parseInt(wcfmmp_checkout_map_options.default_zoom),center:new L.latLng([$wcfmmp_user_location_lat,$wcfmmp_user_location_lng])})).addLayer(new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")),map_marker=L.marker([$wcfmmp_user_location_lat,$wcfmmp_user_location_lng],{draggable:"true"}).addTo(e).on("click",function(){window.open("https://www.openstreetmap.org/?mlat="+$wcfmmp_user_location_lat+"&mlon="+$wcfmmp_user_location_lng+"#map=14/"+$wcfmmp_user_location_lat+"/"+$wcfmmp_user_location_lng,"_blank")})):((e=new L.Map("wcfmmp-user-locaton-map",{zoom:parseInt(wcfmmp_checkout_map_options.default_zoom),center:new L.latLng([wcfmmp_checkout_map_options.default_lat,wcfmmp_checkout_map_options.default_lng])})).addLayer(new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")),map_marker=L.marker([0,0],{draggable:"true"})),map_marker.on("dragend",function(e){var a=map_marker.getLatLng(),n="http://nominatim.openstreetmap.org/reverse?format=json&lat="+a.lat+"&lon="+a.lng+"&zoom=18&addressdetails=1",r="";o.getJSON(n).done(function(o){o.address.road?r+=o.address.road+", ":o.address.pedestrian?r+=o.address.pedestrian+", ":r="",o.address.house_number&&(r+=o.address.house_number+", "),o.address.city_district&&(r+=o.address.city_district+", "),o.address.city&&(r+=o.address.city+", "),o.address.postcode&&(r+=o.address.postcode),t(r,a.lat,a.lng,!0);var e=r;map_marker.bindPopup(e).openPopup()})});var s=new L.Control.Search({container:"leaflet_wcfmmp_user_location",url:"https://nominatim.openstreetmap.org/search?format=json&q={s}",jsonpParam:"json_callback",propertyName:"display_name",propertyLoc:["lat","lon"],marker:map_marker,moveToLocation:function(o,e,a){t(e,o.lat,o.lng,!0),a.setView(o,parseInt(wcfmmp_checkout_map_options.default_zoom))},initial:!1,collapsed:!1,autoType:!1,minLength:2});e.addControl(s),setTimeout(function(){e.invalidateSize()},3e3)}}(),navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(n){$current_location_fetched=!0,console.log(n.coords.latitude,n.coords.longitude),"google"==wcfm_maps.lib?geocoder.geocode({location:{lat:n.coords.latitude,lng:n.coords.longitude}},function(o,r){if("OK"===r){t(o[0].formatted_address,n.coords.latitude,n.coords.longitude,!0);var m=new google.maps.LatLng(n.coords.latitude,n.coords.longitude);marker.setPosition(m),marker.setVisible(!0),infowindow.setContent(o[0].formatted_address),infowindow.open(e,marker),a(infowindow,marker,o[0].formatted_address)}}):o.get("https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat="+n.coords.latitude+"&lon="+n.coords.longitude,function(o){t(o.address.road,n.coords.latitude,n.coords.longitude,!0),map_marker.bindPopup(o.address.road).openPopup()})})},1e3)});