// Sets drop shadow to nav bar on scroll //

window.onscroll = function() {navDropShadow()};

function navDropShadow() {
  if (document.body.scrollTop > 1 || document.documentElement.scrollTop > 1) {
    document.getElementById("main-nav-bar").style.boxShadow = "5px 0 10px 3px rgba(0,0,0,0.2)";
  } else {
    document.getElementById("main-nav-bar").style.boxShadow = "none";
  }
}

// Opens and closes the slide out nav menu //
function closeNav() {
  document.getElementById("slide-out-nav-menu").classList.add('slide-out-top');
  document.getElementById("slide-out-nav-menu").classList.remove('slide-in-top');

}
function openNav() {
document.getElementById("slide-out-nav-menu").classList.add('slide-in-top');
  document.getElementById("slide-out-nav-menu").classList.remove('slide-out-top');
  document.getElementById("slide-out-nav-menu").style.display = "flex";
}

