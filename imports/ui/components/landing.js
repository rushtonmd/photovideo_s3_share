import './landing.html';
import './landing.less';

import MediaItems from '../../api/media-items.js';

Template.landingTemplate.onCreated(function() {

});

Template.landingTemplate.onRendered(function() {

});

var updateLayout = _.debounce(function() {
    console.log("Updating Layout!");
    $('.landing-template .grid').isotope({
            itemSelector: '.grid-item',
            sortBy: 'original-order',
            masonry: {
                columnWidth: '.grid-sizer'
            }
        });
}, 200);

Template.landingMediaItemsTemplate.onRendered(function() {
    let instance = Template.instance();


    var $container = $(instance.find('.grid')).imagesLoaded(function() {
        console.log("Isotoped!");
        updateLayout();
    });

});

Template.landingMediaItemTemplate.onRendered(function() {
    //Session.set("touch", new Date().getTime());
    let instance = Template.instance();
    $(instance.find('img')).unveil(300, function() {
        console.log("Unveiling!");
        $(this).load(function() {
            $(this).addClass('unveiled');
            updateLayout();
        });

    });
})

Template.landingMediaItemsTemplate.helpers({
    mediaItems: function() {
        return MediaItems.find({ deleted: false }, { sort: { createdDate: -1 } });
    }
});

Template.landingMediaDisplayTemplate.helpers({
    imageType: function() {
        return this.mimeType === "image";
    },
    imageUrl: function() {
        return this.thumbnailUrl || this.fullUrl;
    },
    videoMimeType: function() {
        if (this.mimeType === "video/mp4") {
            return 'video/mp4';
        }

        return "";
    }
});


