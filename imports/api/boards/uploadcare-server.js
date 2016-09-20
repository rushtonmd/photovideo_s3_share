if (Meteor.isServer) {
    import { HTTP } from 'meteor/http'

    Future = Npm && Npm.require('fibers/future');

    Meteor.methods({

        'users.storeProfilePhoto': function(userID) {

            let cdnUrl = Meteor.user(userID).photo;

            check(cdnUrl, String);

            this.unblock();

            let future = new Future();

            let uuid = cdnUrl.match(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/);

            HTTP.call(
                'POST',
                'https://api.uploadcare.com/files/', {
                    headers: {
                        Accept: 'application/json',
                        Date: new Date().toJSON(),
                        Authorization: 'Uploadcare.Simple ' + Meteor.settings.public.uploadcare.public_key + ':' + Meteor.settings.private.uploadcare.secret_key
                    },
                    data: {
                        target: Meteor.settings.private.uploadcare.target,
                        source: cdnUrl,
                        pattern: "profile-photos/${uuid}/${filename}${ext}"
                    }
                },
                function(err, res) {
                    if (err) {
                        future.throw(err);
                    } else {

                        let fut = future;

                        let targetLocation = res.headers && res.headers.location;

                        if (!targetLocation) fut.throw({ "error": "Unable to save profile image to storage." })

                        Meteor.users.update(userID, {
                            $set: {
                                photo: targetLocation
                            }
                        }, function(){
                        	fut.return("Successfully saved profile image to storage.")
                        });

                    }
                }
            );

            return future.wait();
        },

        removeFromMediaStorage: function(image) {

            // TODO Not sure if I want to implement a remove function
            return;

            check(image, String);

            this.unblock();

            let future = new Future();

            let uuid = image.match(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/);

            HTTP.call(
                'DELETE',
                'https://api.uploadcare.com/files/' + uuid + '/', {
                    headers: {
                        Accept: 'application/json',
                        Date: new Date().toJSON(),
                        Authorization: 'Uploadcare.Simple ' + Meteor.settings.public.uploadcare.publickey + ':' + Meteor.settings.private.uploadcare.secretkey
                    }
                },
                function(err, res) {
                    if (err) {
                        future.return(err);
                    } else {

                        let filesize = res.data.size;
                        future.return(filesize);

                    }
                }
            );

            return future.wait();

        }

    });
}
