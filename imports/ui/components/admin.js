import './admin.html';
import './admin.less';

import './crop-uploader.js';

import MediaItems from '../../api/media-items.js';


Template.mediaItemsUploader.helpers({
    uploaderOptions: function() {
        let options = {};
        options.name = "teamRushtonUploads";
        options.allowedFileTypes = ["image/png", "image/jpeg", "image/gif", "video/mp4", "video/quicktime"];
        options.maxSize = 1000; // 1 GB max
        options.folder = "uploads";
        options.canCrop = false;

        return options;
    },
    uploadCallback: function() {
        return function(downloadUrl) {

            //console.log("Finished upload!");

            Meteor.call('mediaItems.addMediaItem', { url: downloadUrl });

        };
    },
    cancelCallback: function() {
        return function() {
            $('#profilePhotoUploadModal').modal('hide');
        };
    }
});

Template.adminComponentTemplate.events({


});

Template.adminComponentTemplate.onRendered(function() {

});

Template.mediaItemTemplate.events({
    'click button.edit-media-item-modal': function(event, template) {
        Session.set('currentMediaEdit', this);
        $('#mediaItemEditModal').modal('show');
    }
});

Template.mediaItemsContainerTemplate.helpers({
    mediaItems: function() {
        return MediaItems.find({}, { sort: { createdDate: -1 } });
    },
    fullUrl: function() {
        //console.log(this);
        return this.fullUrl;
    }
});

Template.mediaItemTemplate.helpers({
    imageType: function() {
        //console.log("TYPE " + this.domainlessUrl);
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

Template.mediaItemEditModalTemplate.helpers({
    currentMediaEdit: function() {
        return Session.get('currentMediaEdit');
    },
    imageType: function() {
        //console.log("TYPE " + this.mimeType + " : " + this.deleted);
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

Template.mediaItemEditModalTemplate.onCreated(function() {
    //let instance = Template.instance();
    //instance.dateTimePicker = new ReactiveVar();
});

Template.mediaItemEditModalTemplate.onRendered(function() {
    //let instance = Template.instance();
    //console.log("FOUND");
    //console.log($(instance.find('.datetimepicker')));
    //$(instance.find('.datetimepicker')).datetimepicker();

});

Template.mediaItemEditModalTemplate.events({

});

Template.datePickerTemplate.onRendered(function() {

    let instance = Template.instance();

    let dPicker = $(instance.find('.datetimepicker')).datetimepicker({ format: 'MM/DD/YYYY' });

    Tracker.autorun(function() {
        console.log("AUTORUN");

        // Unbind the events from the date time picker
        dPicker.off('dp.change');

        let itemDate = moment(Session.get('currentMediaEdit').createdDate);

        //console.log(itemDate);
        //console.log($(instance.find('.datetimepicker')).data("DateTimePicker").date());

        if (typeof($(instance.find('.datetimepicker')).data("DateTimePicker") || {}).date !== 'function') return;

        $(instance.find('.datetimepicker')).data("DateTimePicker").date(itemDate);

        dPicker.on("dp.change", function(e) {

            if (!e.date) return;

            let newDate = e.date.valueOf();

            if (Session.get('currentMediaEdit') === e.date.valueOf()) return;

            Meteor.call('mediaItems.updateMediaItemDate', { _id: Session.get('currentMediaEdit')._id, createdDate: newDate });

        });

    });
});

Template.datePickerTemplate.events({

});

Template.datePickerTemplate.helpers({

});

Template.checkboxSliderTemplate.onRendered(function() {

    let instance = Template.instance();

    Tracker.autorun(function() {

        console.log("Checked Autorun");

        let currentMediaEdit = Session.get('currentMediaEdit');

        let label = instance.data.label;
        let field = instance.data.field;
        let currentValue = currentMediaEdit[field];
        let input = $(instance.find('.tag-input'));
        input.prop("checked", currentValue);

    });
});

Template.checkboxSliderTemplate.helpers({
    label: function() {
        let instance = Template.instance();
        return instance.data.label;
    },
    checkboxStyle: function() {
        let instance = Template.instance();
        if (instance.data.checkboxStyle === 'danger') return "checkbox-slider-danger";
    }

});

Template.checkboxSliderTemplate.events({
    'click input.tag-input': function(event, template) {
        //var x = template.$(event.target).is(":checked").val();
        let isChecked = event.target.checked;
        let tagName = event.target.value;
        let field = template.data.field;
        if (field === 'deleted') {
            Meteor.call('mediaItems.deleteMediaItem', { _id: this._id, isChecked: isChecked });
        } else {
            Meteor.call('mediaItems.updateMediaItemTag', { _id: this._id, tagName: tagName, isChecked: isChecked });
        }

    }
});
