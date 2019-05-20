// GIS WORK ORDERS PROPERTIES

var gisWorkOrdersProperties = [{
  value: "WO_ID",
  label: "STID",
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
  value: "workordername",
  label: "WOID",
  table: {
    visible: true
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
  value: "spoke",
  label: "SPOKE",
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
  value: "totalmileage",
  label: "MILES",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "number",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal", "contains"],
    values: []
  }
}];


// GIS WorkOrders FIELDS

var gisWorkOrdersFields = gisWorkOrdersProperties.map(function(elem) {
  return elem.value;
}).join("%2C");


// GIS WorkOrders CONFIG

var gisWorkOrdersConfig = {
  geojson: "https://gis.tilsontech.com/arcgis/rest/services/SiteTracker/SLC_OneFiber/MapServer/0/query?where=objectid+IS+NOT+NULL&outFields=" + gisWorkOrdersFields + "&f=geojson&token=" + gis_token,
  layerName: "WorkOrders",
  hoverProperty: "workordername",
  sortProperty: "workordername",
  sortOrder: "ascend",
};


function gisWorkOrdersBuildConfig() {
  gisWorkOrdersTable = [];

  $.each(gisWorkOrdersProperties, function(index, value) {
    if (value.table) {
      gisWorkOrdersTable.push({
        data: "properties." + value.value,
        title: value.label
      });
      $.each(value.table, function(key, val) {
        if (gisWorkOrdersTable[index+1]) {
          gisWorkOrdersTable[index+1][key] = val;
        }
      });
    }
  });

  gisWorkOrdersBuildTable();
}




// GIS WorkOrders LAYER

var gisWorkOrdersLayer = L.geoJson(null, {
  style: function (feature, layer) {
    return {
      color: "#F4F4AA",
      weight: 4,
      opacity: 1
    };
  },
  onEachFeature: function (feature, layer) {
    layer.bindTooltip(feature.properties.workordername, {sticky: 'true', direction: 'top'});
    if (feature.properties) {
      layer.on({
        click: function (e) {
          gisSegmentsSidebar.hide();
          gisRoutesSidebar.hide();
          gisStructuresSidebar.hide();
          gisSplicesSidebar.hide();
          gisSitesSidebar.hide();
          fulcrumRoutesSidebar.hide();
          $("#gisWorkOrdersInfo_Title").html(feature.properties.WO_ID);
          gisWorkOrdersInfo(L.stamp(layer));
        }
      });
      $("#gisWorkOrders_feature-list tbody").append('<tr onclick= "gisWorkOrdersSearchClick(' +L.stamp(layer) + ')"><td class="gisWorkOrders_feature-name">' + layer.feature.properties.workordername + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
    }
  }
});


function gisWorkOrdersSearchClick(id) {
  var layer = gisWorkOrdersLayer.getLayer(id);
  var coords = layer.feature.geometry.coordinates
  var line = L.polygon(coords);
  map.fitBounds(line.getBounds(), {maxZoom: 16});
  highlightLayer.clearLayers();
  highlightLayer.addData(layer.toGeoJSON());
  layer.fire("click");

  if (document.body.clientWidth <= 767) {
    gisWorkOrdersSidebar.hide();
    map.invalidateSize();
  }
}


//GIS WorkOrders DATA

$.getJSON(gisWorkOrdersConfig.geojson, function (data) {
  gisWorkOrdersData = data;
  gisWorkOrdersFeatures = $.map(gisWorkOrdersData.features, function(feature) {
    return feature.properties;
  });
  gisWorkOrdersLayer.addData(data);
  gisWorkOrdersList = new List("gisWorkOrders_features", {valueNames: ["gisWorkOrders_feature-name"]});
  gisWorkOrdersList.sort("gisWorkOrders_feature-name", {order:"asc"});
  gisWorkOrdersBuildConfig()
}).error(function(jqXHR, textStatus, errorThrown) {
    console.log("error " + textStatus);
    console.log("incoming Text " + jqXHR.responseText);
    alert("error " + textStatus);
});



// GIS WorkOrders INFO

function gisWorkOrdersInfo(id) {
  
  var featureProperties = gisWorkOrdersLayer.getLayer(id).feature.properties;

  var content = "<table class='table table-striped table-bordered table-condensed'>";

  $.each(featureProperties, function(key, value) {
    if (!value) {
      value = "";
    }
    if (key == "WO_ID") {
      sessionStorage.setItem("WorkOrdersiteTrackerID", value);
    }
    $.each(gisWorkOrdersProperties, function(index, property) {
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
  $("#gisWorkOrders-Info_DATA").html(content);
  gisWorkOrdersSidebar.show();
};


// GIS WorkOrders HIGHLIGHT INFO

function gisWorkOrdersHighlightInfo(id) {
  
  var featureProperties = highlightLayer.getLayer(id).feature.properties;

  var content = "<table class='table table-striped table-bordered table-condensed'>";

  $.each(featureProperties, function(key, value) {
    if (!value) {
      value = "";
    }
    if (key == "WO_ID") {
      sessionStorage.setItem("WorkOrdersiteTrackerID", value);
    }
    $.each(gisWorkOrdersProperties, function(index, property) {
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
  $("#gisWorkOrders-Info_DATA").html(content);
  gisWorkOrdersSidebar.show();
};


$("#gisWorkOrdersClose-sidebarBTN").click(function(){
  gisWorkOrdersSidebar.hide();
});


// GIS WorkOrders TABLE

function gisWorkOrdersBuildTable() {
  var gisData = gisWorkOrdersData.features
    gisWorkOrdersDataTable = $('#gisWorkOrdersTable').DataTable({
    dom: 'Bfrtip',
    buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
    ],
    colReorder: true,
    data: gisData,
    "autoWidth": true,
    "deferRender": false,
    "info": true,
    "lengthChange": false,
    "ordering": true,
    "paging": false,
    "processing": true,
    "scrollX": true,
    "scrollY": "500px",
    "searching": true,
    "stateSave": true,    
    "scrollCollapse": true,
    "columns": gisWorkOrdersTable,
    "language": {
      "emptyTable": "Loading..."
    }
  });
}

// GIS WorkOrders OPEN TABLE

$("#gisWorkOrders_table-btn").click(function(){
  $("#map-container").hide();
  $("#gisSitesTable-container").hide();
  $("#gisSegmentsTable-container").hide();
  $("#gisRoutesTable-container").hide();
  $("#gisStructuresTable-container").hide();
  $("#gisSplicesTable-container").hide();
  $("#gisWorkOrdersTable-container").show();
  $(window).resize();
});