// GIS SEGMENTS PROPERTIES

var gisSegmentsProperties = [{

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
  value: "cabletype",
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
  value: "fibercount",
  label: "STRANDS",
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
  value: "calculatedlength",
  label: "ENG FT",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "integer",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal"],
    values: []
  }
},
{
  value: "real_length",
  label: "ACT FT",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "integer",
    vertical: true,
    multiple: true,
    operators: ["equal", "not_equal"],
    values: []
  }
},
{
  value: "cableplacedplanned",
  label: "CABLE PLACED (F)",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    value: "date",
    type: "string",
    vertical: true,
    multiple: true,
    operators: ["is_not_null"],
    values: []
  }
},
{
  value: "oofdatecableplaced",
  label: "CABLE PLACED (A)",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    value: "date",
    type: "string",
    vertical: true,
    multiple: true,
    operators: ["is_not_null"],
    values: []
  }
}];


// GIS SEGMETNS FIELDS

var gisSegmentsFields = gisSegmentsProperties.map(function(elem) {
  return elem.value;
}).join("%2C");


// GIS SEGMENTS CONFIG

var gisSegmentsConfig = {
  geojson: "https://gis.tilsontech.com/arcgis/rest/services/SiteTracker/SLC_OneFiber/MapServer/3/query?where=objectid+IS+NOT+NULL&outFields=" + gisSegmentsFields + "&f=geojson&token=" + gis_token,
  layerName: "Segments",
  hoverProperty: "fqn_id",
  sortProperty: "fqn_id",
  sortOrder: "ascend",
};


function gisSegmentsBuildConfig() {
  gisSegmentsTable = [];

  $.each(gisSegmentsProperties, function(index, value) {
    if (value.table) {
      gisSegmentsTable.push({
        data: "properties." + value.value,
        title: value.label
      });
      $.each(value.table, function(key, val) {
        if (gisSegmentsTable[index+1]) {
          gisSegmentsTable[index+1][key] = val;
        }
      });
    }
  });

  gisSegmentsBuildTable();
}




// GIS SEGMENTS LAYER

var gisSegmentsLayer = L.geoJson(null, {
  style: function (feature, layer) {
    if (feature.properties.oofstatus == "Spliced & Tested" || feature.properties.oofstatus == "Cable Placed") {
      return {
        color: "#87d30f",
        weight: 5,
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
    if (feature.properties.fqn_id) {
      if (feature.properties.fqn_id.toLowerCase().indexOf("fib:bur") === 0) {
        layer.bindTooltip(feature.properties.fqn_id + "-- Underground", {sticky: 'false', direction: 'top'});
      } else if (feature.properties.fqn_id.toLowerCase().indexOf("fib:aer") === 0) {
        layer.bindTooltip(feature.properties.fqn_id + "-- Aerial", {sticky: 'false', direction: 'top'});
      };
    } else {
      layer.bindTooltip("NO FQNID -- Aerial", {sticky: 'false', direction: 'top'});
    }
    
    if (feature.properties) {
      layer.on({
        click: function (e) {
          $("#gisSegmentsInfo_Title").html(feature.properties.fqn_id);
          gisSegmentsInfo(L.stamp(layer));
        },
        mouseover: function (e) {
          if (document.body.clientWidth > 767) {
            $(".info-control").html(feature.properties[gisSegmentsConfig.hoverProperty]);
            $(".info-control").show();
            highlightLayer.clearLayers();
            highlightLayer.addData(gisSegmentsLayer.getLayer(L.stamp(layer)).toGeoJSON());
          }
        }
      });
      $("#gisSegments_feature-list tbody").append('<tr onclick= "gisSegmentsSearchClick(' +L.stamp(layer) + ')"><td class="gisSegments_feature-name">' + layer.feature.properties.fqn_id + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
    }
  }
});


function gisSegmentsSearchClick(id) {
  var layer = gisSegmentsLayer.getLayer(id);
  var coords = layer.feature.geometry.coordinates
  var geom = coords.map(function (pt) {return [pt[1], pt[0]]})
  var line = L.polyline(geom);
  map.fitBounds(line.getBounds(), {maxZoom: 16});
  highlightLayer.clearLayers();
  highlightLayer.addData(layer.toGeoJSON());
  layer.fire("click");

  if (document.body.clientWidth <= 767) {
      
  }
}


//GIS SEGMENTS DATA

$.getJSON(gisSegmentsConfig.geojson, function (data) {
  gisSegmentsData = data;
  gisSegmentsFeatures = $.map(gisSegmentsData.features, function(feature) {
    return feature.properties;
  });
  gisSegmentsLayer.addData(data);
  gisSegmentsList = new List("gisSegments_features", {valueNames: ["gisSegments_feature-name"]});
  gisSegmentsList.sort("gisSegments_feature-name", {order:"asc"});
  gisSegmentsBuildConfig()
}).error(function(jqXHR, textStatus, errorThrown) {
    console.log("error " + textStatus);
    console.log("incoming Text " + jqXHR.responseText);
    alert("error " + textStatus);
});



// GIS SEGMENTS INFO

function gisSegmentsInfo(id) {
  
  var featureProperties = gisSegmentsLayer.getLayer(id).feature.properties;

  var content = "<table class='table table-striped table-bordered table-condensed'>";

  $.each(featureProperties, function(key, value) {
    if (!value) {
      value = "";
    }
    if (key == "sitetracker_id") {
      sessionStorage.setItem("segmentSiteTrackerID", value);
    }
    if (key == "fqn_id") {
      sessionStorage.setItem("fqn_id", value);
    }
    $.each(gisSegmentsProperties, function(index, property) {
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
  $("#gisSegments-Info_DATA").html(content);
  sidebar.open("details");
  $('#details .modal-body .nav-tabs a:eq(1)').tab('show');
};


// GIS SEGMENTS HIGHLIGHT INFO

function gisSegmentsHighlightInfo(id) {
  
  var featureProperties = highlightLayer.getLayer(id).feature.properties;

  var content = "<table class='table table-striped table-bordered table-condensed'>";

  $.each(featureProperties, function(key, value) {
    if (!value) {
      value = "";
    }
    if (key == "sitetracker_id") {
      sessionStorage.setItem("segmentSiteTrackerID", value);
    }
    if (key == "fqn_id") {
      sessionStorage.setItem("fqn_id", value);
    }
    $.each(gisSegmentsProperties, function(index, property) {
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
  $("#gisSegments-Info_DATA").html(content);
  sidebar.open("details");
};


$("#gisSegmentsClose-sidebarBTN").click(function(){
  sidebar.close("details");
});


// GIS SEGMENTS TABLE

function gisSegmentsBuildTable() {
  var gisData = gisSegmentsData.features
    gisSegmentsDataTable = $('#gisSegmentsTable').DataTable({
    dom: 'Bfrtip',
    buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
    ],
    colReorder: true,
    columnDefs: [{
      targets: [9,10],
      render: $.fn.dataTable.render.moment('x', 'MM/DD/YYYY')
    }],
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
    "columns": gisSegmentsTable,
    "language": {
      "emptyTable": "Loading..."
    }
  });
}

// GIS SEGMENTS OPEN TABLE

$("#gisSegments_table-btn").click(function(){
  $("#map-container").hide();
  $("#gisSitesTable-container").hide();
  $("#gisSegmentsTable-container").show();
  $(window).resize();
});