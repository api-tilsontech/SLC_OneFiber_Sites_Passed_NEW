$("#RefreshInterval_BTN").click(function() {	
	setInterval(function() { 

		var currentDate = new Date();

		var date = currentDate.getDate();
		var month = currentDate.getMonth(); //Be careful! January is 0 not 1
		var year = currentDate.getFullYear();

		var dateString = date + "-" +(month + 1) + "-" + year;

		gisSitesLayer.clearLayers();
		gisSegmentsLayer.clearLayers();

		$("#loading-mask").show();

		$('#gisSitesTable').DataTable().clear().draw();
		$('#gisSitesTable').DataTable().destroy();

		$('#gisSegmentsTable').DataTable().clear().draw();
		$('#gisSegmentsTable').DataTable().destroy();

		$.getJSON(gisSitesConfig.geojson, function (data) {
		  gisSitesData = data;
		  gisSitesFeatures = $.map(gisSitesData.features, function(feature) {
		    return feature.properties;
		  });
		  gisSitesLayer.addData(data);
		  gisSitesList = new List("gisSites_features", {valueNames: ["gisSites_feature-name"]});
		  gisSitesList.sort("gisSites_feature-name", {order:"asc"});
		  gisSitesBuildConfig()
		}).error(function(jqXHR, textStatus, errorThrown) {
		    console.log("error " + textStatus);
		    console.log("incoming Text " + jqXHR.responseText);
		    alert("error " + textStatus);
		});

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

		$(".navbar-collapse.in").collapse("hide");
		return false;
	}, 10*60000);
});

// REFRESH GIS DATA CLICK

$("#Refresh_BTN").click(function() {
  gisSitesLayer.clearLayers();
  gisSegmentsLayer.clearLayers();

  $("#loading-mask").show();

  $('#gisSitesTable').DataTable().clear().draw();
  $('#gisSitesTable').DataTable().destroy();

  $('#gisSegmentsTable').DataTable().clear().draw();
  $('#gisSegmentsTable').DataTable().destroy();

	$.getJSON(gisSitesConfig.geojson, function (data) {
	  gisSitesData = data;
	  gisSitesFeatures = $.map(gisSitesData.features, function(feature) {
	    return feature.properties;
	  });
	  gisSitesLayer.addData(data);
	  gisSitesList = new List("gisSites_features", {valueNames: ["gisSites_feature-name"]});
	  gisSitesList.sort("gisSites_feature-name", {order:"asc"});
	  gisSitesBuildConfig()
	}).error(function(jqXHR, textStatus, errorThrown) {
	    console.log("error " + textStatus);
	    console.log("incoming Text " + jqXHR.responseText);
	    alert("error " + textStatus);
	});

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

  $(".navbar-collapse.in").collapse("hide");
  return false;
});