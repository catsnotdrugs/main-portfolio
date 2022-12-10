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
//
// function blueTeal() {
//   document.documentElement.style.setProperty('--background', '#071E3D');
//     document.documentElement.style.setProperty('--service-div-background', '#131f3460');
//     document.documentElement.style.setProperty('--button-outline', '#21E6C1');
//     document.documentElement.style.setProperty('--text', '#21E6C1');
//     document.documentElement.style.setProperty('--text-light', '#21E6C1');
//     document.documentElement.style.setProperty('--accent-color', '#21E6C1');
//     document.documentElement.style.setProperty('--accent-color-2', '#278EA5');
//     document.documentElement.style.setProperty('--accent-color-3', '#1F4287');
// }