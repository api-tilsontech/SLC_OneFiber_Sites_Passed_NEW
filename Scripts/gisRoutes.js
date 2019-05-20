// GIS ROUTES PROPERTIES

var gisRoutesProperties = [{

  value: "sitetracker_id",
  label: "STID",
  table: {
    visible: true
  },
  filter: {
    type: "string",
    vertical: true,
    multiple: true,
    operators: ["equal"],
    values: []
  }
},
{
  value: "objectid",
  label: "GISID",
  table: {
    visible: true
  },
  filter: {
    type: "string",
    vertical: true,
    multiple: true,
    operators: ["equal"],
    values: []
  }
},
{
  value: "fqn_id",
  label: "FQNID",
  table: {
    visible: false,
    sortable: false
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
  value: "oofstatus",
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
  value: "workorderid",
  label: "WOID",
  table: {
    visible: false,
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
    visible: false,
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
  value: "constructiontype",
  label: "TYPE",
  table: {
    visible: true
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
  value: "calculatedlength",
  label: "ENG FT",
  table: {
    visible: true
  },
  filter: {
    type: "integer",
    vertical: true,
    multiple: true,
    operators: ["between"],
    values: []
  }
},
{
  value: "cableplacedfootage",
  label: "ACT FT",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "integer",
    vertical: false,
    multiple: true,
    operators: ["between"],
    values: []
  }
},
{
  value: "fibercable_fqnid",
  label: "SEG ID 1",
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
  value: "cable_fqnid_2",
  label: "SEG ID 2",
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
  value: "cable_fqnid_3",
  label: "SEG ID 3",
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
  value: "cable_fqnid_4",
  label: "SEG ID 4",
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
  value: "centroid_x",
  label: "LAT",
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
  value: "centroid_y",
  label: "LONG",
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
}];


// GIS SEGMETNS FIELDS

var gisRoutesFields = gisRoutesProperties.map(function(elem) {
  return elem.value;
}).join("%2C");


// GIS SEGMENTS CONFIG

var gisRoutesConfig = {
  geojson: "https://gis.tilsontech.com/arcgis/rest/services/SiteTracker/SLC_OneFiber/MapServer/4/query?where=objectid+IS+NOT+NULL&outFields=" + gisRoutesFields + "&f=geojson&token=" + gis_token,
  layerName: "Routes",
  hoverProperty: "fqn_id",
  sortProperty: "fqn_id",
  sortOrder: "ascend",
};


function gisRoutesBuildConfig() {
  gisRoutesTable = [];

  $.each(gisRoutesProperties, function(index, value) {
    if (value.table) {
      gisRoutesTable.push({
        data: "properties." + value.value,
        title: value.label,
      });
      $.each(value.table, function(key, val) {
        if (gisRoutesTable[index+1]) {
          gisRoutesTable[index+1][key] = val;
        }
      });
    }
  });

  gisRoutesBuildTable();
}




// GIS ROUTES LAYER

var gisRoutesLayer = L.geoJson(null, {
  style: function (feature, layer) {
    if (feature.properties.oofstatus == "Cable Placed") {
      return {
        color: "#87d30f",
        weight: 4,
        opacity: 1.0
      };
    } else if (feature.properties.oofstatus == "Construction Completed (Un-Signed)" || feature.properties.oofstatus == "Construction Completed (Signed)") {
      return {
        color: "#ffd300",
        weight: 4,
        opacity: 1.0
      };
    } else if (feature.properties.oofstatus == "Construction Underway") {
      return {
        color: "#da0796",
        weight: 4,
        opacity: 1.0
      };
    } else if (feature.properties.oofstatus == "Proofing Completed") {
      return {
        color: "#da0796",
        weight: 4,
        opacity: 1.0
      };
    } else if (feature.properties.oofstatus == "Permits Received") {
      return {
        color: "#1891c9",
        weight: 4,
        opacity: 1.0
      };
    } else if (feature.properties.oofstatus == "Permits Submitted") {
      return {
        color: "#ff8819",
        weight: 4,
        opacity: 1.0
      };
    } else {
      return {
        color: "#242424",
        weight: 4,
        opacity: 1.0
      };
    }
  },
  onEachFeature: function (feature, layer) {
    layer.bindTooltip(feature.properties.fqn_id + " -- " + feature.properties.oofstatus, {sticky: 'true', direction: 'top'});

    if (feature.properties) {
      layer.on({
        click: function (e) {
          $("#gisRoutesInfo_Title").html(feature.properties.fqn_id);
          gisRoutesInfo(L.stamp(layer));
        },
        mouseover: function (e) {
          if (document.body.clientWidth > 767) {
            highlightLayer.clearLayers();
            highlightLayer.addData(gisRoutesLayer.getLayer(L.stamp(layer)).toGeoJSON());
          }
        }
      });
      $("#gisRoutes_feature-list tbody").append('<tr onclick= "gisRoutesSearchClick(' +L.stamp(layer) + ')"><td class="gisRoutes_feature-name">' + layer.feature.properties.fqn_id + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
    }
  }
});


function gisRoutesSearchClick(id) {
  var layer = gisRoutesLayer.getLayer(id);
  var coords = layer.feature.geometry.coordinates
  var geom = coords.map(function (pt) {return [pt[1], pt[0]]})
  var line = L.polyline(geom);
  map.fitBounds(line.getBounds(), {maxZoom: 16});
  highlightLayer.clearLayers();
  highlightLayer.addData(layer.toGeoJSON());
  layer.fire("click");

  if (document.body.clientWidth <= 767) {
    gisRoutesSidebar.hide();
    map.invalidateSize();
  }
}


//GIS SEGMENTS DATA

$.getJSON(gisRoutesConfig.geojson, function (data) {
  gisRoutesData = data;
  gisRoutesFeatures = $.map(gisRoutesData.features, function(feature) {
    return feature.properties;
  });
  gisRoutesLayer.addData(data);
  gisRoutesList = new List("gisRoutes_features", {valueNames: ["gisRoutes_feature-name"]});
  gisRoutesList.sort("gisRoutes_feature-name", {order:"asc"});
  gisRoutesBuildConfig()
  $("#loading-mask").hide();
}).error(function(jqXHR, textStatus, errorThrown) {
    console.log("error " + textStatus);
    console.log("incoming Text " + jqXHR.responseText);
    alert("error " + textStatus);
});



// GIS ROUTES INFO

function gisRoutesInfo(id) {

  var featureProperties = gisRoutesLayer.getLayer(id).feature.properties;

  var content = "<table class='table table-striped table-bordered table-condensed'>";

  $.each(featureProperties, function(key, value) {
    if (!value) {
      value = "";
    }
    if (key == "sitetracker_id") {
      sessionStorage.setItem("routeSiteTrackerID", value);
    }
    if (key == "centroid_x") {
      sessionStorage.setItem("routeLong", value);
    }
    if (key == "centroid_y") {
      sessionStorage.setItem("routeLat", value);
    }
    if (key == "fqn_id") {
      sessionStorage.setItem("fqn_id", value);
    }
    if (key == "fibercable_fqnid") {
      sessionStorage.setItem("routeSegmentFQNID1", value);
    }
    if (key == "cable_fqnid_2") {
      sessionStorage.setItem("routeSegmentFQNID2", value);
    }
    if (key == "cable_fqnid_3") {
      sessionStorage.setItem("routeSegmentFQNID3", value);
    }
    if (key == "cable_fqnid_4") {
      sessionStorage.setItem("routeSegmentFQNID4", value);
    }


    $.each(gisRoutesProperties, function(index, property) {
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
  $("#gisRoutes-Info_DATA").html(content);
  gisRoutesSidebar.show();
};


// GIS ROUTES HIGHLIGHT INFO

function gisRoutesHighlightInfo(id) {

  var featureProperties = highlightLayer.getLayer(id).feature.properties;

  var content = "<table class='table table-striped table-bordered table-condensed'>";

  $.each(featureProperties, function(key, value) {
    if (!value) {
      value = "";
    }
    if (key == "sitetracker_id") {
      sessionStorage.setItem("routeSiteTrackerID", value);
    }
    if (key == "centroid_x") {
      sessionStorage.setItem("routeLong", value);
    }
    if (key == "centroid_y") {
      sessionStorage.setItem("routeLat", value);
    }
    if (key == "fqn_id") {
      sessionStorage.setItem("fqn_id", value);
    }
    if (key == "fibercable_fqnid") {
      sessionStorage.setItem("routeSegmentFQNID1", value);
    }
    if (key == "cable_fqnid_2") {
      sessionStorage.setItem("routeSegmentFQNID2", value);
    }
    if (key == "cable_fqnid_3") {
      sessionStorage.setItem("routeSegmentFQNID3", value);
    }
    if (key == "cable_fqnid_4") {
      sessionStorage.setItem("routeSegmentFQNID4", value);
    }


    $.each(gisRoutesProperties, function(index, property) {
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
  $("#gisRoutes-Info_DATA").html(content);
  gisRoutesSidebar.show();
};


$("#gisRoutesClose-sidebarBTN").click(function(){
  gisRoutesSidebar.hide();
});


// GIS SEGMENTS TABLE

function gisRoutesBuildTable() {
  var gisData = gisRoutesData.features
    gisRoutesDataTable = $('#gisRoutesTable').DataTable({ // Change table element ID here
    dom: 'Bfrtip', // Add this to enable export buttons
    buttons: [ // Add this to choose which buttons to display
        'copy', 'csv', 'excel', 'pdf', 'print'
    ],
    colReorder: true,
    data: gisData,
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
    "columns": gisRoutesTable,
    "language": {
      "emptyTable": "Loading..."
    }
  });
}

// GIS SEGMENTS OPEN TABLE

$("#gisRoutes_table-btn").click(function(){
  $("#map-container").hide();
  $("#gisSitesTable-container").hide();
  $("#gisSegmentsTable-container").hide();
  $("#gisRoutesTable-container").show();
  $("#gisStructuresTable-container").hide();
  $("#gisSplicesTable-container").hide();
  $("#gisWorkOrdersTable-container").hide();
  $(window).resize();
});



// FULCRUM ROUTES PRODUCTION

function gisRoutesEdit() {
  var routeFQNID = sessionStorage.getItem("fqn_id");
  var routeSiteTrackerID = sessionStorage.getItem("routeSiteTrackerID");
  var routeLat = sessionStorage.getItem("routeLat");
  var routeLong = sessionStorage.getItem("routeLong");
  var routeSegmentFQNID1 = sessionStorage.getItem("routeSegmentFQNID1");
  var routeSegmentFQNID2 = sessionStorage.getItem("routeSegmentFQNID2");
  var routeSegmentFQNID3 = sessionStorage.getItem("routeSegmentFQNID3");
  var routeSegmentFQNID4 = sessionStorage.getItem("routeSegmentFQNID4");

  $.ajax({
    type: "GET",
    url: 'https://api.fulcrumapp.com/api/v2/query/?token=d34d8164e635540faf1e1e2c7d2c8bc70d4fdeb7d4cee2a8eabe498800e5850c&format=json&q=SELECT%20fqnid,_record_id%20FROM%20%22SLC%20OneFiber%20Construction%22%20WHERE%20fqnid=%27' + routeFQNID + '%27',
    success: function (data) {
      var recordID = data.rows[0]._record_id;
      if (recordID) {
        var url = "'https://www.fulcrumapp.com/action/#edit-record?form_id=5904bbea-bf3f-4c79-8275-23f30d96f407d&record_id=" + recordID + "&fqnid=" + routeFQNID + "&sitetracker_id=" + routeSiteTrackerID + "&latitude=" + routeLat + "&longitude=" + routeLong + "&fiber_fqnid_1=" + routeSegmentFQNID1 + "&fiber_fqnid_2=" + routeSegmentFQNID2 + "&fiber_fqnid_3=" + routeSegmentFQNID3 + "&fiber_fqnid_4=" + routeSegmentFQNID4 + "'"
        if (document.body.clientWidth > 767) {
          var content = '<object width="850" height="450" type="text/html" data=' + url + '></object>';
          $("#gisRoutesProduction_FULCRUM").html(content);
          $("#gisRoutesProductionSidebar").modal("show");
          gisRoutesSidebar.hide();
          $(".navbar-collapse.in").collapse("hide");
        } else {
          window.open(url);
        }
        } else {
          alert("No Record Found");
        }
    }
  });
};


$("#gisRoutesEdit-btn").click(function() {
  gisRoutesEdit();
});


$("#gisRoutesProductionSidebarClose").click(function(){
  $("#gisRoutesProductionSidebar").modal("hide");
  gisRoutesSidebar.show();
  $(".navbar-collapse.in").collapse("hide");
  return false;
});