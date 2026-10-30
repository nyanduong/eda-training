function swipedetect(el, callback) {
  var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 50, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 1000, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function (swipedir) {};

  touchsurface.addEventListener(
    "touchstart",
    function (e) {
      var touchobj = e.changedTouches[0];
      swipedir = "none";
      dist = 0;
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime(); // record time when finger first makes contact with surface
      e.preventDefault();
    },
    false
  );

  touchsurface.addEventListener('mousedown', function (e) {
		var touchobj = e
		swipedir = 'none'
		dist = 0
		startX = touchobj.pageX
		startY = touchobj.pageY
		startTime = new Date().getTime() // record time when finger first makes contact with surface
		e.preventDefault()
	}, false)

  touchsurface.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault(); // prevent scrolling when inside DIV
    },
    false
  );

  touchsurface.addEventListener(
    "touchend",
    function (e) {
      var touchobj = e.changedTouches[0];
      distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
      distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
      elapsedTime = new Date().getTime() - startTime; // get time elapsed
      //console.log({ elapsedTime, allowedTime });
      if (elapsedTime <= allowedTime) {
        // first condition for awipe met
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
          // 2nd condition for horizontal swipe met
          swipedir = distX < 0 ? "left" : "right"; // if dist traveled is negative, it indicates left swipe
        } else if (
          Math.abs(distY) >= threshold &&
          Math.abs(distX) <= restraint
        ) {
          // 2nd condition for vertical swipe met
          swipedir = distY < 0 ? "up" : "down"; // if dist traveled is negative, it indicates up swipe
        }
      }
      handleswipe(swipedir);
      // e.preventDefault()
    },
    false
  );

  touchsurface.addEventListener('mouseup', function (e) {
		console.log('mouseup', e);
		var touchobj = e;
		distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
		distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
		elapsedTime = new Date().getTime() - startTime // get time elapsed
		console.log('1', touchobj.pageX, startX)
		console.log({elapsedTime, allowedTime})
		if (elapsedTime <= allowedTime) { // first condition for awipe met
			if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
				swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
			}
			else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
				swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
			}
		}
		handleswipe(swipedir)
		// e.preventDefault()
	}, false)
}

var node;
var rotation = 0;
var gestureStartRotation = 0;
var gestureStartScale = 0;
var scale = 1;
var posX = 0;
var posY = 0;
var startX;
var startY;

var node = document.querySelector("#container");

// var render = () => {

//   window.requestAnimationFrame(() => {
//     var val = `translate3D(${posX}px, ${posY}px, 0px) rotate(0deg) scale(${scale})`
//     node.style.transform = val
//   })
// }

window.addEventListener("wheel", (e) => {
  e.preventDefault();

  if (e.ctrlKey) {
    scale -= e.deltaY * 0.01;
  } else {
    posX -= e.deltaX * 2;
    posY -= e.deltaY * 2;
  }

  // render();
});

window.addEventListener("gesturestart", function (e) {
  e.preventDefault();
  startX = e.pageX - posX;
  startY = e.pageY - posY;
  gestureStartRotation = rotation;
  gestureStartScale = scale;
});

window.addEventListener("gesturechange", function (e) {
  e.preventDefault();

  rotation = gestureStartRotation + e.rotation;
  scale = gestureStartScale * e.scale;

  posX = e.pageX - startX;
  posY = e.pageY - startY;

  // render();
});

window.addEventListener("gestureend", function (e) {
  e.preventDefault();
});

var env = "local", //local, live
  player = "Browser",
  sharedPath = "./pdfs/",
  disableSwipe = true,
  refScroller = null,
  currentSlide,
  prevSlide;

if (env == "live") {
  player = "Veeva";
}

$(document).ready(function () {
  prevSlide = localStorage.getItem("prev-slide") || "";
  currentSlide = localStorage.getItem("current-slide") || "";

  $("#container").on("touchstart touchmove touchend", function (e) {
    //console.log("disabled swipe!");
    if (disableSwipe) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  $(".navi li").on("touchend click", function (e) {
    var id = $(this).data("id");
    window.goToSlide(id);
  });

  window.check = function (url, callback) {
    $.ajax({
      type: "HEAD",
      url: url,
      success: function () {
        if (callback) callback(true);
      },
      error: function () {
        if (callback) callback(false);
      },
    });
  };

  window.goToSlide = function (slideId) {
    var me = this,
      slideName = "Train-01-";
    if (slideId) {
      if (slideId !== "006") {
        localStorage.setItem("prev-slide", slideId);
      }

      slideName += slideId;

      if (player == "Browser") {
        var urlFormat = "../" + slideName + "/index.html";
        window.check(urlFormat, function (isExisted) {
          if (isExisted) document.location.href = urlFormat;
          else {
            //console.log("Can't find the path!");
          }
        });
      } else if (player == "Veeva") {
        var args = arguments;
        args[0] = slideName + ".zip";
        com.veeva.clm.gotoSlide.apply(com.veeva.clm, args);
      }
    }
  };

  $(".icon-home").on("touchend click", function () {
    window.goToSlide("001");
  });

  $(".icon-sitemap").on("touchend click", function () {
    window.goToSlide("006");
  });

  if ($(".ref-container").length > 0) {
    $(".icon-ref").on("touchend click", function () {
      $(".ref-container").show();

      $(".icon-ref").addClass("active");
    });
  } else {
    const iconElements = document.querySelectorAll(".bg-icon");
    iconElements.forEach((iconElement) => {
      const hasIconRef = iconElement.querySelector(".icon-ref") !== null;
      if (hasIconRef) {
        iconElement.classList.add("ref-disable");
      }
    });
  }

  $(".ref-close").on("touchend click", function (e) {
    $(".ref-container").hide();
    var ref = document.getElementById("ref");
    ref.classList.remove("active");
  });
});
