import './nav-sidebar.html';
import './nav-sidebar.less';


Template.App_navSidebar.onCreated(function() {
    //Session.set( "SidebarOpen", true );
    this.sidebarOpen = new ReactiveVar( true );
})
Template.App_navSidebar.onRendered(function() {

	var template = Template.instance();

    function toggleNavbar(toggle, show, width, display) {
        $(".radim button.navbar-toggle").each(function() {
            eval('$(this.getAttribute("data-target")).' + toggle + 'Class("radim-small")'), $(".radim.navbar").css("width", width + "px"), eval('$(".radim .navbar-collapse").' + show + "()"), $(".container-radim").css("margin-left", width + "px"), $(".radim .navbar-brand").css("display", display)
                //Session.set("SidebarOpen",  $('div.collapse.navbar-collapse.navbar-ex1-collapse.radim-small').length === 0);
            template.sidebarOpen.set($('div.collapse.navbar-collapse.navbar-ex1-collapse.radim-small').length === 0);
        })
    }

    function windowResize() {
        $(".radim button.navbar-toggle").each(window.innerWidth >= 992 ? function() {
            //toggleNavbar("remove", "show", "227.656", "block")
            toggleNavbar("remove", "show", "183", "block")
        } : window.innerWidth >= 480 ? function() {
            toggleNavbar("add", "show", "53", "none")
        } : function() {
            toggleNavbar("remove", "hide", "0", "block")
        })
    }
    if (parseInt($(".radim.navbar").css("height"), 10) < parseInt($('body').css('height'), 10)) {
        $(".radim.navbar").css("height", "calc(" + $("body").css("height") + ")");
    } else {
        $(".radim.navbar").css("height", "auto");
    }
    $(".radim .dropdown>a").on("click", function(a) {
        a.stopPropagation(), $(this).parent("li.dropdown.open").length > 0 ? $(this).parent("li.dropdown").removeClass("open") : $(this).parents("li.dropdown").addClass("open"), $(this).parent("li.dropdown").find("li.dropdown").removeClass("open")
    }), $(".radim").on("click", '.navbar-form [type="submit"]', function(a) {
        return 0 == $(".radim-small").length ? !0 : void(0 == $(this).parents(".dropdown").length && (a.preventDefault(), toggleNavbar("remove", "show", 183, "block")))
    }), $(".radim button.navbar-toggle").click(function(a) {
        $(".radim li.dropdown").removeClass("open"), window.innerWidth >= 480 ? 0 == $(".navbar .radim-small").length ? toggleNavbar("add", "show", "53", "none") : toggleNavbar("remove", "show", "183", "block") : 0 == $(".navbar .radim-small").length ? toggleNavbar("add", "show", "53", "none") : toggleNavbar("remove", "hide", "0", "block"), a.stopImmediatePropagation()
    });
    var radimW = $(window).width();
    $(window).resize(function() {
        radimW != $(window).width() && (windowResize(), radimW = $(window).width())
    }), windowResize()
});

Template.App_navSidebar.helpers({
    isSidebarOpen: function() {
        return Template.instance().sidebarOpen.get();
    }
});

Template.App_navSidebar.events({
    'click': function(event, template) {
        console.log("HERE");
        //return Template.instance().showExtraFields.get();
    }
})
