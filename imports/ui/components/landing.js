import './landing.html';
import './landing.less';

import MediaItems from '../../api/media-items.js';

Template.landingTemplate.onCreated(function() {

    $(window).resize(function(evt) {
        Session.set("touch", new Date().getTime());
    });

});

Template.landingTemplate.onRendered(function() {
    let instance = Template.instance();

    Session.set("touch", new Date().getTime());

    Tracker.autorun(_.debounce(function() {
        let touched = Session.get('touch');
        console.log("Resized!");
        return;

        let $iso = $(instance.find('.grid')).isotope({
            itemSelector: '.grid-item',
            masonry: {
                columnWidth: '.grid-sizer'
            }
        });

        $iso.imagesLoaded().progress(function() {
            console.log("Images Loaded!");
            $iso.isotope('layout');

        });

    }));
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

    // var unveilImages;
    // (unveilImages = function() {
    //     $('img').unveil(0, function() {
    //         $(this).load(function() {
    //             // need to respawn the layout

    //             //$(this).addClass('unveiled');
    //         });
    //     });
    // }).call();

    var $container = $(instance.find('.grid')).imagesLoaded(function() {
        console.log("Isotoped!");
        updateLayout();
        // $container.isotope({
        //     itemSelector: '.grid-item',
        //     sortBy: 'original-order',
        //     masonry: {
        //         columnWidth: '.grid-sizer'
        //     }
        //});//.progress(updateLayout);
        // $container.isotope('on', 'layoutComplete', function(isoInstance, laidOutItems) {
        //     console.log("Unveil!");
        //     unveilImages();
        // });
    });

    // let $iso = $(instance.find('.grid')).isotope({
    //     itemSelector: '.grid-item',
    //     masonry: {
    //         columnWidth: '.grid-sizer'
    //     }
    // });

    // $iso.imagesLoaded().progress(_.throttle(function() {
    //     console.log("Images Loaded!!");
    //     $iso.isotope('layout');
    //     $('img').unveil(0, function() {
    //         console.log("Unveiled!")
    //     });
    // }, 200));

});

Template.landingMediaItemTemplate.onRendered(function() {
    //Session.set("touch", new Date().getTime());
    let instance = Template.instance();
    $(instance.find('img')).unveil(200, function() {
        console.log("Unveiling!");
        $(this).load(function() {
            $(this).addClass('unveiled');
            updateLayout();
        });

    });
})

Template.landingMediaItemsTemplate.helpers({
    mediaItems: function() {
        console.log(MediaItems.find({}).fetch());
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




// (function(brinx, $, undefined) {
//     var currentPosition = 0;
//     var scrollAmount = 1;
//     var scrollSpeed = 30;
//     var pauseDuration = 4E3;
//     var pauseThisTime = pauseDuration;
//     var currentWidth = 0;
//     var initialPause = true;
//     brinx.imageList = [];
//     $(function() {
//         brinx.retrieveImagesListAPI();
//         scrollWindow()
//     });
//     $(window).resize(function() {
//         if (hasWidthChanged()) {
//             var imageRowDiv = $("#image-container").empty();
//             loadAllImages(brinx.imageList)
//         }
//     });
//     function hasWidthChanged() {
//         var imageRowDiv = $("#image-container").eq(0);
//         var targetWidth = imageRowDiv.innerWidth();
//         if (currentWidth != targetWidth) {
//             currentWidth = targetWidth;
//             return true
//         }
//     }
//     function scrollWindow() {
//         if (initialPause || window.pageYOffset != currentPosition) {
//             pauseThisTime = pauseDuration;
//             currentPosition = window.pageYOffset
//         } else {
//             window.scroll(0, currentPosition + scrollAmount);
//             currentPosition = currentPosition + scrollAmount;
//             pauseThisTime = 0
//         }
//         initialPause = false;
//         setTimeout(function() {
//             scrollWindow()
//         }, scrollSpeed + pauseThisTime)
//     }
//     brinx.retrieveImagesListAPI = function() {
//         $.getJSON("//admin.brinkleyrushton.com/api/media-items", function(data) {
//             var items = [];
//             $.each(data.mediaItems, function(key, val) {
//                 var imageEntry = {};
//                 imageEntry.url_n = "//admin.brinkleyrushton.com" + val.thumbnailUrl;
//                 imageEntry.url_n_master = "//admin.brinkleyrushton.com" + val.masterUrl;
//                 imageEntry.width_n = val.width;
//                 imageEntry.height_n = val.height;
//                 imageEntry.caption_n = val.description;
//                 brinx.imageList.push(imageEntry)
//             });
//             loadAllImages(brinx.imageList)
//         })
//     }
//     ;
//     brinx.retrieveImageList = function(root) {
//         var feed = root.feed;
//         var entries = feed.entry || [];
//         var html = ["<ul>"];
//         var rowCount = 0;
//         for (var i = 0; i < entries.length; i = i + 4) {
//             var image_url = entries[i];
//             var image_width = entries[i + 1];
//             var image_height = entries[i + 2];
//             var image_caption = entries[i + 3];
//             var imageEntry = {};
//             imageEntry.url_n = image_url.content.$t;
//             imageEntry.width_n = image_width.content.type == "html" ? image_width.content.$t : escape(image_width.content.$t);
//             imageEntry.height_n = image_height.content.type == "html" ? image_height.content.$t : escape(image_height.content.$t);
//             imageEntry.caption_n = image_caption.content.$t
//         }
//     }
//     ;
//     function loadAllImages(iList) {
//         if (iList.length <= 0)
//             return;
//         currentImage = 0;
//         brinx.loadImageInterval = setInterval(function() {
//             getImageCountForRow()
//         }, 2E3)
//     }
//     var currentImage = 0;
//     var targetHeight = getRandomInt(250, 350);
//     function getImageCountForRow() {
//         if (currentImage >= brinx.imageList.length) {
//             clearInterval(brinx.loadImageInterval);
//             return
//         }
//         var imageRowDiv = $("#image-container").eq(0);
//         var targetWidth = imageRowDiv.innerWidth();
//         var totalImageWidth = 0;
//         var imageCount = 0;
//         for (var i = currentImage; i < brinx.imageList.length; i++) {
//             var photo = brinx.imageList[i];
//             totalImageWidth += photo.width_n * targetHeight / photo.height_n;
//             imageCount++;
//             if (totalImageWidth > targetWidth)
//                 i = brinx.imageList.length
//         }
//         addXImageToRow(imageCount)
//     }
//     function getRandomInt(min, max) {
//         return Math.floor(Math.random() * (max - min + 1)) + min
//     }
//     function addXImageToRow(imageCount) {
//         var iWidth = 0;
//         var iHeight = 0;
//         var imageContainer = $("#image-container");
//         var imageRowDiv = $("<div/>", {
//             "class": "photo-row"
//         });
//         imageContainer.append(imageRowDiv);
//         var targetWidth = imageContainer.innerWidth();
//         var totalImageWidth = 0;
//         var totalWidthDelta = 0;
//         for (var i = 0; i < imageCount; i++) {
//             var photo = brinx.imageList[currentImage + i];
//             totalImageWidth += photo.width_n * targetHeight / photo.height_n
//         }
//         totalWidthDelta = targetWidth - totalImageWidth;
//         for (var i = 0; i < imageCount; i++) {
//             var photo = brinx.imageList[currentImage + i];
//             var imageWidthDelta = photo.width_n * targetHeight / photo.height_n / totalImageWidth * totalWidthDelta;
//             var multiplier = (targetHeight / photo.height_n * photo.width_n + imageWidthDelta) / photo.width_n;
//             (function() {
//                 var imgDiv = $("<div/>", {
//                     "class": "delayImageDiv",
//                     width: photo.width_n * multiplier,
//                     height: photo.height_n * multiplier
//                 });
//                 var img = $("<img/>", {
//                     "class": "delayImg",
//                     target: "_blank",
//                     src2: "",
//                     src: photo.url_n,
//                     width: photo.width_n * multiplier,
//                     height: photo.height_n * multiplier
//                 });
//                 var url = photo.url_n;
//                 img.popover({
//                     title: "Notes...",
//                     content: photo.caption_n + '<br/> <a href="' + photo.url_n_master + '">(full size)</a>',
//                     placement: "top",
//                     html: true
//                 });
//                 img.click(function() {
//                     setTimeout(function() {
//                         img.popover("hide")
//                     }, 5E3)
//                 });
//                 imgDiv.append(img);
//                 imageRowDiv.append(imgDiv)
//             })()
//         }
//         currentImage += imageCount;
//         setTimeout(function() {
//             imageRowDiv.animate({
//                 opacity: 1
//             }, 2E3)
//         }, 1E3)
//     }
// })(window.brinx = window.brinx || {}, jQuery);
