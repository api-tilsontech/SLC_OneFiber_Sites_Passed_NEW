// GIS SPLICES PROPERTIES

var gisSplicesProperties = [{
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
  value: "splice_name",
  label: "NAME",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    input: "radio",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal"],
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
    input: "radio",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal"],
    values: []
  }
},
{
  value: "splicetype",
  label: "TYPE",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    input: "radio",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal"],
    values: []
  }
},
{
  value: "splicecount",
  label: "COUNT",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "integer",
    input: "radio",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal"],
    values: []
  }
},
{
  value: "splicingcomplete",
  label: "INSTALL (A)",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    value: "date",
    type: "string",
    vertical: true,
    multiple: true,
    operators: ["is_not_empty"],
    values: []
  }
}];



// GIS Splices FIELDS

var gisSplicesFields = gisSplicesProperties.map(function(elem) {
  return elem.value;
}).join("%2C");


// GIS Splices REST URL

var gisSplicesConfig = {
  geojson: "https://gis.tilsontech.com/arcgis/rest/services/SiteTracker/SLC_OneFiber/MapServer/9/query?where=objectid+IS+NOT+NULL&outFields=" + gisSplicesFields + "&f=geojson&token=" + gis_token,
  layerName: "Splices",
  hoverProperty: "fqn_id"
};


// GIS Splices BUILD CONFIG


function gisSplicesBuildConfig() {
  gisSplicesTable = [];

  $.each(gisSplicesProperties, function(index, value) {
    if (value.table) {
      gisSplicesTable.push({
        data: "properties." + value.value,
        title: value.label
      });
      $.each(value.table, function(key, val) {
        if (gisSplicesTable[index+1]) {
          gisSplicesTable[index+1][key] = val;
        }
      });
    }
  });

  gisSplicesBuildTable()
}




// GIS Splices LAYER

var gisSplicesLayer = L.geoJson(null, {
  onEachFeature: function (feature, layer) {
    layer.bindTooltip(feature.properties.fqn_id + " -- " + feature.properties.splicetype, {sticky: 'true', direction: 'top'});

    if (feature.properties) {
      var title = feature.properties.fqn_id;
      var content = "<table class='table table-striped table-bordered table-condensed'>";
      content += "<table>";
      layer.on({
        click: function (e) {
          gisSegmentsSidebar.hide();
          gisRoutesSidebar.hide();
          gisStructuresSidebar.hide();
          gisSitesSidebar.hide();
          gisWorkOrdersSidebar.hide();
          fulcrumRoutesSidebar.hide();
          $("#gisSplicesInfo_Title").html(feature.properties.fqn_id);
          gisSplicesInfo(L.stamp(layer));
          activeRecord = feature.properties.fqn_id;
          highlightLayer.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            stroke: false,
            fillColor: "#FF0000",
            fillOpacity: 1,
            radius: 10
          }));
        }
      });
      $("#gisSplices_feature-list tbody").append('<tr onclick= "gisSplicesSearchClick(' + L.stamp(layer) + ')"><td class="gisSplices_feature-name">' + layer.feature.properties.fqn_id + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
    }
    if (feature.properties.splicetype === "MCA") {
      layer.setIcon(
        L.icon({
          iconUrl: "pictures/MCA.png",
          iconSize: [15, 25],
        })
      );
    } else if (feature.properties.splicetype === "Reel End" && (feature.properties.c510spliceribbon === 864 || feature.properties.c500spliceloose === 864)) {
      layer.setIcon(
        L.icon({
          iconUrl: "pictures/Reel-End2.png",
          iconSize: [15, 25],
        })
      );
    } else if (feature.properties.splicetype === "Reel End") {
      layer.setIcon(
        L.icon({
          iconUrl: "pictures/Reel-End.png",
          iconSize: [15, 25],
        })
      );
    } else {
      layer.setIcon(
        L.icon({
          iconUrl: "pictures/Virtual.png",
          iconSize: [15, 25],
        })
      );
    } 
  }
});


function gisSplicesSearchClick(id) {
  var layer = gisSplicesLayer.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 16);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    gisSplicesSidebar.hide();
    map.invalidateSize();
  }
}


//GIS Splices DATA

$.getJSON(gisSplicesConfig.geojson, function (data) {
  gisSplicesData = data;
  gisSplicesFeatures = $.map(gisSplicesData.features, function(feature) {
    return feature.properties;
  });
  gisSplicesLayer.addData(data);
  gisSplicesList = new List("gisSplices_features", {valueNames: ["gisSplices_feature-name"]});
  gisSplicesList.sort("gisSplices_feature-name", {order:"asc"});
  gisSplicesBuildConfig()
}).error(function(jqXHR, textStatus, errorThrown) {
    console.log("error " + textStatus);
    console.log("incoming Text " + jqXHR.responseText);
    alert("error " + textStatus);
});



// GIS Splices INFO

function gisSplicesInfo(id) {
  
  var featureProperties = gisSplicesLayer.getLayer(id).feature.properties;

  var content = "<table class='table table-striped table-bordered table-condensed'>";

  $.each(featureProperties, function(key, value) {
    if (!value) {
      value = "";
    }
    if (key == "fqn_id") {
      sessionStorage.setItem("fqn_id", value);
    }

    $.each(gisSplicesProperties, function(index, property) {
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
  $("#gisSplices-Info_DATA").html(content);
  gisSplicesSidebar.show();
};



// GIS Splices TABLE

function gisSplicesBuildTable() {

    gisSplicesDataTable = $('#gisSplicesTable').DataTable({ // Change table element ID here
    dom: 'Bfrtip', // Add this to enable export buttons
    buttons: [ // Add this to choose which buttons to display
        'copy', 'csv', 'excel', 'pdf', 'print'
    ],
    colReorder: true,
    data: gisSplicesData.features,
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
    "columns": gisSplicesTable,
    "language": {
      "emptyTable": "Loading..."
    }
  });
}

// GIS Splices OPEN TABLE

$("#gisSplices_table-btn").click(function(){
  $("#map-container").hide();
  $("#gisSitesTable-container").hide();
  $("#gisSegmentsTable-container").hide();
  $("#gisRoutesTable-container").hide();
  $("#gisStructuresTable-container").hide();
  $("#gisSplicesTable-container").show();
  $("#gisWorkOrdersTable-container").hide();
  $(window).resize();
});