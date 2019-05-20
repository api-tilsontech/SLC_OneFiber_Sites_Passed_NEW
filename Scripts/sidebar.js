var sidebar = L.control.sidebar("sidebar", {
    closeButton: false,
    position: "left",
    autoPan: false
}).addTo(map);

// GIS SITES INFO SIDEBAR

$("#gisSitesClose-sidebarBTN").click(function(){
  sidebar.close();
});

$("#gisSitesView-btn").click(function(){
  $("#map-container").hide();
  $("#gisSitesTable-container").show();
  $("#gisSegmentsTable-container").hide();
  gisSitesDataTable.search(sessionStorage.getItem("site_name")).draw();
  $(window).resize();
});

$("#gisSitesEdit-btn").click(function(){
  gisSitesEdit.show();
  gisSitesSidebar.hide();
});

$("#gisSitesPassed-Cancel").click(function(){
  gisSitesEdit.hide();
  gisSitesSidebar.show();
});

$("#gisSitesPassed-Submit").click(function(){
  var ST_ID = sessionStorage.getItem("siteSiteTrackerID")
  var GIS_ID = sessionStorage.getItem("objectid")
  var CF = sessionStorage.getItem("current_forecast")
  var CA = sessionStorage.getItem("current_actual")
  var SITE = sessionStorage.getItem("site_name")
  var SP_F = document.getElementById('sitePassedF').value
  var SP_A = document.getElementById('sitePassedA').value

  $.ajax({
    type: "POST",
    url: "https://hook.integromat.com/9r2patwgnkzyzvywg2y6bht89zalos6x",
    contentType: "application/x-www-form-urlencoded",
    data: {
      "Current Forecast": CF,
      "Current Actual": CA,
      "Forecast": SP_F,
      "Actual": SP_A,
      "API": ST_ID,
      "Email": sessionStorage.getItem("user"),
      "ObjectID": GIS_ID,
      "Name": SITE
    }
  });
    
  gisSitesEdit.hide();
  gisSitesSidebar.show();
    
  setTimeout(function(){
    $.getJSON(gisSitesConfig.geojson, function (data) {
      gisSitesData = data;
      gisSitesFeatures = $.map(gisSitesData.features, function(feature) {
        return feature.properties;
      });
      gisSitesLayer.clearLayers();
      gisSitesLayer.addData(data);
    }).error(function(jqXHR, textStatus, errorThrown) {
        console.log("error " + textStatus);
        console.log("incoming Text " + jqXHR.responseText);
        alert("error " + textStatus);
    });
  }, 7000);

  document.getElementById('sitePassedF').value = "";
  document.getElementById('sitePassedA').value = "";
});