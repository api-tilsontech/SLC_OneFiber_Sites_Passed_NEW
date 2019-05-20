checkAuth();
bindUIActions();

function bindUIActions() {
  $("#login-btn").click(function() {
    login();
  });

  $("#login-modal").on("shown.bs.modal", function (e) {
    $(".modal-backdrop").css("opacity", "1");
  });

  $("#login-modal").on("hidden.bs.modal", function (e) {
    $(".modal-backdrop").css("opacity", "");
  });
};

function checkAuth() {
  if (!sessionStorage.getItem("gis_token") || sessionStorage.getItem("gis_token") ===  "ERROR") {
    $(document).ready(function() {
      $("#login-modal").modal("show");
    });
  } else {
    $("#login-modal").modal("hide");
    window.location.href = "main.html";
  }
};

function login() {
  var email = $("#email").val();
  var password = $("#password").val();

  $.ajax({
    type: "POST",
    url: "https://gis.tilsontech.com/portal/sharing/rest/generateToken",
    contentType: "application/x-www-form-urlencoded",
    data: {
        "f": "json",
        "username": email,
        "password": password,
        "client": "referer",
        "ip": "65.158.108.154",
        "referer": "arcgis.com",
        "expiration": "3600"
    },
    statusCode: {
      400: function() {
        alert("Incorrect credentials, please try again.");
      }
    },
    success: function (data) {
      var body = JSON.parse(data);

      if (body.token) {
        sessionStorage.setItem("gis_token", body.token);
        sessionStorage.setItem("user", email);
        checkAuth();
      } else {
        sessionStorage.setItem("gis_token", "ERROR");
        alert(body.error.details);
        checkAuth();
      }
    },
    error: function (data) {
      checkAuth();
      alert("No GIS Token Returned")
    }
  });
};
