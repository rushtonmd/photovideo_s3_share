const Clusters = new Mongo.Collection('clusters');
Clusters.allow({ update: function (userId, task) { console.log(task); return true; } });
Clusters.allow({ insert: function (userId, task) { return false; } });
Clusters.allow({ remove: function (userId, task) { return false; } });
// Types.allow({
//   insert: () => true,
//   update: () => true,
//   remove: () => true
// });

Clusters.deny({
  insert: () => false,
  update: () => false,
  remove: () => false
});

if (Meteor.isServer) {
    Meteor.methods({
        'clusters.verify': function(clusterID) {
            return (typeof Clusters.findOne(clusterID) != 'undefined');
        }
    });
}


export default Clusters;