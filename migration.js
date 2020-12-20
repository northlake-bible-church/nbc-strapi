var models = {
    
        "Announcement": {
          "collection": "announcements",
          "files": {
            "AnnouncementsImage": "single"
          }
        },
        "Article": {
          "collection": "articles",
          "files": {}
        },
        "Banner": {
          "collection": "banners",
          "files": {}
        },
        "Biblebook": {
          "collection": "biblebook",
          "files": {}
        },
        "Feature": {
          "collection": "features",
          "files": {}
        },
        "LiveStream": {
          "collection": "live_streams",
          "files": {}
        },
        "LivestreamEvent": {
          "collection": "livestream_events",
          "files": {}
        },
        "MessageType": {
          "collection": "message_types",
          "files": {}
        },
        "Message": {
          "collection": "message",
          "files": {
            "MessageSlides": "single",
            "MessageAudio": "single",
            "MessageVideo": "single"
          }
        },
        "ModalAlert": {
          "collection": "modal_alerts",
          "files": {}
        },
        "Navprimary": {
          "collection": "navprimary",
          "files": {}
        },
        "Navsecondary": {
          "collection": "navsecondary",
          "files": {}
        },
        "Page": {
          "collection": "page",
          "files": {
            "Image": "single"
          }
        },
        "Seriesset": {
          "collection": "seriesset",
          "files": {}
        },
        "Sitesetting": {
          "collection": "sitesetting",
          "files": {}
        },
        "Sitesettingtype": {
          "collection": "sitesettingtype",
          "files": {}
        },
        "Slide": {
          "collection": "slides",
          "files": {
            "SlideImage": "single"
          }
        },
        "Teacher": {
          "collection": "teacher",
          "files": {
            "Picture": "single"
          }
        },
        "TextColor": {
          "collection": "text_colors",
          "files": {}
        },
        "Video": {
          "collection": "videos",
          "files": {}
        },
        "UploadFile": {
          "collection": "upload_file",
          "files": {}
        },
        "UsersPermissionsPermission": {
          "collection": "users-permissions_permission",
          "files": {}
        },
        "UsersPermissionsRole": {
          "collection": "users-permissions_role",
          "files": {}
        },
        "UsersPermissionsUser": {
          "collection": "users-permissions_user",
          "files": {}
        }
      
  };
  
  for (var i in models) {
    var model = models[i];
    var update = {};
    var keyCount = 0;
  
    for (var key in model.files) {
      keyCount += 1;
      update[key] = '';
    }
  
    if (keyCount > 0) {
      db.getCollection(model.collection).update({}, { $unset: update }, { multi: true });
    }
  }
  
  var fileCursor = db.getCollection('upload_file').find({});
  
  while (fileCursor.hasNext()) {
    var el = fileCursor.next();
    el.related.forEach(function(fileRef) {
      var model = models[fileRef.kind];
  
      if (!model) {
        return;
      }
  
      var fieldType = model.files && model.files[fileRef.field];
  
      // stop if the file points to a field the user didn't specify
      if (!fieldType) {
        return;
      }
  
      if (fieldType === 'single') {
        db.getCollection(model.collection).updateOne(
          { _id: fileRef.ref },
          { $set: { [fileRef.field]: el._id } }
        );
      } else if (fieldType === 'multiple') {
        db.getCollection(model.collection).updateOne(
          { _id: fileRef.ref },
          { $push: { [fileRef.field]: el._id } }
        );
      }
    });
  
    if (el.name) {
      var splitName = el.name.split('.');
      var name = splitName[0];
      var ext = splitName[1];
      if (ext) {
        db.getCollection('upload_file').updateOne({ _id: el._id }, { $set: { name: name } });
      }
    }
  }