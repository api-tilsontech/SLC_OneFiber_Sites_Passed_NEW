// GIS STRUCTURES PROPERTIES

var gisStructuresProperties = [{
  value: "objectid",
  label: "GISID",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal", "contains"],
    values: []
  }
},
{
  value: "fqn_id",
  label: "FQNID",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal", "contains"],
    values: []
  }
},
{
  value: "workorderid",
  label: "WOID",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal", "contains"],
    values: []
  }
},
{
  value: "sitespannfid",
  label: "NFID",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal", "contains"],
    values: []
  }
},
{
  value: "label_id_text",
  label: "TYPE",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal"],
    values: []
  }
},
{
  value: "vaultsize",
  label: "SIZE",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal"],
    values: []
  }
},
{
  value: "material",
  label: "MATERIAL",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal"],
    values: []
  }
},
{
  value: "slack_loop",
  label: "SLACK",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal"],
    values: []
  }
},
{
  value: "openingtype",
  label: "LID",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal"],
    values: []
  }
},
{
  value: "installationdate",
  label: "INSTALL (A)",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "date",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal"],
    values: []
  }
}];



// GIS Structures FIELDS

var gisStructuresFields = gisStructuresProperties.map(function(elem) {
  return elem.value;
}).join("%2C");


// GIS Structures REST URL

var gisStructuresConfig = {
  geojson: "https://gis.tilsontech.com/arcgis/rest/services/SiteTracker/SLC_OneFiber/MapServer/8/query?where=objectid+IS+NOT+NULL&outFields=" + gisStructuresFields + "&f=geojson&token=" + gis_token,
  layerName: "Structures",
  hoverProperty: "fqn_id"
};


// GIS Structures BUILD CONFIG


function gisStructuresBuildConfig() {
  gisStructuresTable = [];

  $.each(gisStructuresProperties, function(index, value) {
    if (value.table) {
      gisStructuresTable.push({
        data: "properties." + value.value,
        title: value.label
      });
      $.each(value.table, function(key, val) {
        if (gisStructuresTable[index+1]) {
          gisStructuresTable[index+1][key] = val;
        }
      });
    }
  });

  gisStructuresBuildTable()
}




// GIS Structures LAYER

var gisStructuresLayer = L.geoJson(null, {
  onEachFeature: function (feature, layer) {
    layer.bindTooltip(feature.properties.fqn_id + " -- " + feature.properties.label_id_text, {sticky: 'true', direction: 'top'});

    if (feature.properties) {
      var title = feature.properties.fqn_id;
      var content = "<table class='table table-striped table-bordered table-condensed'>";
      content += "<table>";
      layer.on({
        click: function (e) {
          gisSegmentsSidebar.hide();
          gisRoutesSidebar.hide();
          gisSitesSidebar.hide();
          gisSplicesSidebar.hide();
          gisWorkOrdersSidebar.hide();
          fulcrumRoutesSidebar.hide();
          $("#gisStructuresInfo_Title").html(feature.properties.fqn_id);
          gisStructuresInfo(L.stamp(layer));
          activeRecord = feature.properties.fqn_id;
          highlightLayer.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            stroke: false,
            fillColor: "#FF0000",
            fillOpacity: 1,
            radius: 10
          }));
        }
      });
      $("#gisStructures_feature-list tbody").append('<tr onclick= "gisStructuresSearchClick(' + L.stamp(layer) + ')"><td class="gisStructures_feature-name">' + layer.feature.properties.fqn_id + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
    }
    if (feature.properties.label_id_text !== "EXISTING") {
      layer.setIcon(
        L.icon({
          iconUrl: "pictures/structures/place.png",
          iconSize: [14, 14],
        })
      );
    } else if (feature.properties.label_id_text === "EXISTING") {
      layer.setIcon(
        L.icon({
          iconUrl: "pictures/structures/existing.png",
          iconSize: [14, 14],
        })
      );
    } 
  }
});


function gisStructuresSearchClick(id) {
  var layer = gisStructuresLayer.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 16);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    gisStructuresSidebar.hide();
    map.invalidateSize();
  }
}


//GIS Structures DATA

$.getJSON(gisStructuresConfig.geojson, function (data) {
  gisStructuresData = data;
  gisStructuresFeatures = $.map(gisStructuresData.features, function(feature) {
    return feature.properties;
  });
  gisStructuresLayer.addData(data);
  gisStructuresList = new List("gisStructures_features", {valueNames: ["gisStructures_feature-name"]});
  gisStructuresList.sort("gisStructures_feature-name", {order:"asc"});
  gisStructuresBuildConfig()
}).error(function(jqXHR, textStatus, errorThrown) {
    console.log("error " + textStatus);
    console.log("incoming Text " + jqXHR.responseText);
    alert("error " + textStatus);
});



// GIS Structures INFO

function gisStructuresInfo(id) {
  
  var featureProperties = gisStructuresLayer.getLayer(id).feature.properties;

  var content = "<table class='table table-striped table-bordered table-condensed'>";

  $.each(featureProperties, function(key, value) {
    if (!value) {
      value = "";
    }
    if (key == "sitetracker_id") {
      sessionStorage.setItem("structuresiteTrackerID", value);
    }
    if (key == "fqn_id") {
      sessionStorage.setItem("fqn_id", value);
    }

    $.each(gisStructuresProperties, function(index, property) {
      if (key == property.value) {
        if (value && property.filter.value == "date") {
          date = new Date(value);
          value = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        }
        if (property.info !== false) {
          content += "<tr><th>" + property.label + "</th><td>" + value + "</td></tr>";
        }
      }
    });
  });
  content += "<table>";
  $("#gisStructures-Info_DATA").html(content);
  gisStructuresSidebar.show();
};



// GIS Structures TABLE

function gisStructuresBuildTable() {

    gisStructuresDataTable = $('#gisStructuresTable').DataTable({ // Change table element ID here
    dom: 'Bfrtip', // Add this to enable export buttons
    buttons: [ // Add this to choose which buttons to display
        'copy', 'csv', 'excel', 'pdf', 'print'
    ],
    colReorder: true,
    data: gisStructuresData.features,
    "autoWidth": true, // Feature control DataTables' smart column width handling
    "deferRender": true, // Feature control deferred rendering for additional speed of initialisation.
    "info": true, // Display info about table including filtering
    "lengthChange": false, // If pagination is enabled, allow the page length to be changed by user
    "ordering": true, // Toggle user ordering of table columns
    "paging": false, // Toggle table paging
    "processing": true, // Toggle "processing" indicator useful when loading large table/filter
    "scrollX": true, // Left/right scrolling option, in pixels or false to disable
    "scrollY": "500px", // Table height in pixels before up/down scrolling, or false to disable scrolling
    "searching": true, // Toggle search all columns field
    "stateSave": true, // If true, table will restore to user filtered state when page is reopened     
    "scrollCollapse": true, // If true, the table will be collapsed if the height of the records is < the scrollY option; prevents footer from floating
    "columns": gisStructuresTable,
    "language": {
      "emptyTable": "Loading..."
    }
  });
}

// GIS Structures OPEN TABLE

$("#gisStructures_table-btn").click(function(){
  $("#map-container").hide();
  $("#gisSitesTable-container").hide();
  $("#gisSegmentsTable-container").hide();
  $("#gisRoutesTable-container").hide();
  $("#gisStructuresTable-container").show();
  $("#gisSplicesTable-container").hide();
  $("#gisWorkOrdersTable-container").hide();
  $(window).resize();
});