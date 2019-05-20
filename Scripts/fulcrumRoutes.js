// FULCRUM ROUTES PROPERTIES

var fulcrumRoutesProperties = [{

  value: "fulcrum_id",
  label: "FLMID",
  table: {
    visible: false,
    sortable: true
  },
  filter: {
    type: "string",
    input: "radio",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal"],
    values: []
  },
  info: false
},
{
  value: "status_details",
  label: "STATUS",
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
  value: "fqnid",
  label: "FQNID",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    input: "text",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal", "contains"],
    values: []
  }
},
{
  value: "fiber_fqnid_1",
  label: "Fiber FQNID 1",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    input: "text",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal", "contains"],
    values: []
  }
},
{
  value: "fiber_fqnid_2",
  label: "Fiber FQNID 2",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    input: "text",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal", "contains"],
    values: []
  }
},
{
  value: "fiber_fqnid_3",
  label: "Fiber FQNID 3",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    input: "text",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal", "contains"],
    values: []
  }
},
{
  value: "fiber_fqnid_4",
  label: "Fiber FQNID 4",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    input: "text",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal", "contains"],
    values: []
  }
},
{
  value: "wpid",
  label: "WOID",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    input: "radio",
    vertical: false,
    multiple: true,
    operators: ["equal", "not_equal"],
    values: []
  }
},
{
  value: "construction_start_date_final",
  label: "Construction Start (A)",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "date",
    vertical: true,
    multiple: true,
    operators: ["is_not_null"],
    values: []
  }
},
{
  value: "construction_complete_date_final",
  label: "Construction Complete (A)",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "date",
    vertical: true,
    multiple: true,
    operators: ["is_not_null"],
    values: []
  }
},
{
  value: "cable_placement_complete_date_final",
  label: "Cable Placed (A)",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "date",
    vertical: true,
    multiple: true,
    operators: ["is_not_null"],
    values: []
  }
},
{
  value: "cable_placement_total_footage_final",
  label: "ACT FT",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "integer",
  },
}];



// FULCRUM ROUTES CONFIG

var fulcrumRoutesConfig = {
  geojson: "https://web.fulcrumapp.com/shares/5ad2e3a2c2465a9c.geojson",
  layerName: "Fulcrum Routes",
  hoverProperty: "status_details",
  sortProperty: "fqnid",
  sortOrder: "ascend",
};



function fulcrumRoutesBuildConfig() {
  fulcrumRoutesTable = [];

  $.each(fulcrumRoutesProperties, function(index, value) {
    if (value.table) {
      fulcrumRoutesTable.push({
        data: "properties." + value.value,
        title: value.label,
      });
      $.each(value.table, function(key, val) {
        if (fulcrumRoutesTable[index+1]) {
          fulcrumRoutesTable[index+1][key] = val;
        }
      });
    }
  });

  fulcrumRoutesBuildTable();
}




// FULCRUM ROUTES LAYER

var fulcrumRoutesLayer = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      title: feature.properties["status_title"],
      riseOnHover: true,
      icon: L.icon({
        iconUrl: "pictures/markers/cb0d0c.png",
        iconSize: [30, 40],
        iconAnchor: [15, 32]
      })
    });
  },
  onEachFeature: function (feature, layer) {
    layer.bindTooltip(feature.properties.fqnid + " -- " + feature.properties.status_details, {sticky: 'true', direction: 'top'});

    if (feature.properties) {
      layer.on({
        click: function (e) {
          $("#fulcrumRoutesInfo_Title").html(feature.properties.fqnid);
          fulcrumRoutesInfo(L.stamp(layer));
          fulcrumRoutesSidebar.show();
          gisSitesSidebar.hide();
          gisSegmentsSidebar.hide();
          gisRoutesSidebar.hide();
          gisStructuresSidebar.hide();
          gisWorkOrdersSidebar.hide();
          gisSplicesSidebar.hide();
        }
      });
      if (feature.properties["marker-color"]) {
        layer.setIcon(
          L.icon({
            iconUrl: "pictures/markers/" + feature.properties["marker-color"].replace("#",'').toLowerCase() + ".png",
            iconSize: [30, 40],
            iconAnchor: [15, 32]
          })
        );
      }
      $("#fulcrumRoutes_feature-list tbody").append('<tr onclick= "fulcrumRoutesSearchClick(' +L.stamp(layer) + ')"><td class="fulcrumRoutes_feature-name">' + layer.feature.properties.fqnid + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
    }
  }
});


// FULCRUM ROUTES SEARCH

function fulcrumRoutesSearchClick(id) {
  var layer = fulcrumRoutesLayer.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 16);
  layer.fire("click");

  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}


// FULCRUM ROUTES DATA

$.getJSON(fulcrumRoutesConfig.geojson, function (data) {
  fulcrumRoutesData = data;
  fulcrumRoutesFeatures = $.map(fulcrumRoutesData.features, function(feature) {
    return feature.properties;
  });
  fulcrumRoutesLayer.addData(data);
  fulcrumRoutesList = new List("fulcrumRoutes_features", {valueNames: ["fulcrumRoutes_feature-name"]});
  fulcrumRoutesList.sort("fulcrumRoutes_feature-name", {order:"asc"});
  fulcrumRoutesBuildConfig()
})



// FULCRUM ROUTES INFO

function fulcrumRoutesInfo(id) {

  var featureProperties = fulcrumRoutesLayer.getLayer(id).feature.properties;

  var content = "<table class='table table-striped table-bordered table-condensed'>";

  $.each(featureProperties, function(key, value) {
    if (!value) {
      value = "";
    }
    if (key == "fqnid") {
      sessionStorage.setItem("fqnid", value);
    }

    $.each(fulcrumRoutesProperties, function(index, property) {
      if (key == property.value) {
        if (property.info !== false) {
          content += "<tr><th>" + property.label + "</th><td>" + value + "</td></tr>";
        }
      }
    });
  });

  content += "<table>";
  $("#fulcrumRoutes-Info_DATA").html(content);
  fulcrumRoutesSidebar.show();
};


// FULCRUM ROUTES TABLE

function fulcrumRoutesBuildTable() {
  var fulcrumData = fulcrumRoutesData.features
    fulcrumRoutesDataTable = $('#fulcrumRoutesTable').DataTable({ // Change table element ID here
    dom: 'Bfrtip', // Add this to enable export buttons
    buttons: [ // Add this to choose which buttons to display
        'copy', 'csv', 'excel', 'pdf', 'print'
    ],
    colReorder: true,
    data: fulcrumData,
    "autoWidth": true, // Feature control DataTables' smart column width handling
    "deferRender": false, // Feature control deferred rendering for additional speed of initialisation.
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
    "columns": fulcrumRoutesTable,
    "language": {
      "emptyTable": "Loading..."
    }
  });
}

// FULCRUM ROUTES OPEN TABLE

$("#fulcrumRoutes_table-btn").click(function(){
  $("#map-container").hide();
  $("#gisSitesTable-container").hide();
  $("#gisSegmentsTable-container").hide();
  $("#gisRoutesTable-container").hide();
  $("#fulcrumRoutesTable-container").show();
  $("#gisStructuresTable-container").hide();
  $("#gisSplicesTable-container").hide();
  $("#gisWorkOrdersTable-container").hide();
  $(window).resize();
});