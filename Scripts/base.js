// VERIFY USER

verifyUser();

function verifyUser() {
  if (!sessionStorage.getItem("gis_token") || sessionStorage.getItem("gis_token") === null || sessionStorage.getItem("gis_token") === "ERROR") {
    $("#map-container").hide();
    $("#about_BTN").hide();
    $("#refresh_BTN").hide();
    $(".navbar-collapse").css("opacity", "0");
    window.confirm
    if (window.confirm('Click OK to go to Login Page')) {
      window.location.href='index.html';
    };
  };
};


// GIS TOKEN

var gis_token = sessionStorage.getItem("gis_token")


// FORMAT CLICKABLE LINKS

function urlFormatter (value, row, index) {
  if (typeof value == "string" && (value.indexOf("http") === 0 || value.indexOf("https") === 0)) {
    return "<a href='"+value+"' target='_blank'>"+value+"</a>";
  }
}