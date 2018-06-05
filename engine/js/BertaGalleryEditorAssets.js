var BertaGalleryUploader = new Class({


  initialize: function(galleryEditor) {
    this.galleryEditor = galleryEditor;
    this.selectFiles = this.galleryEditor.container.getElement('.xEntryAddImagesLink');
    this.uploadUrl = this.selectFiles.getAttribute('href');
    this.fileInput = this.selectFiles.getPrevious();

    this.addUploader();
  },


  addUploader: function() {
    this.selectFiles.addEvent('click', function(e) {
      e.preventDefault();
      this.fileInput.click();
    }.bindWithEvent(this));

    this.fileInput.addEvent('change', function() {
      this.startUpload();
    }.bindWithEvent(this));
  },


  startUpload: function() {
    var files = $$(this.fileInput)[0].files;
    if (files.length) {

      this.galleryEditor.isUploading = true;
      this.galleryEditor.strip.addClass('processing');
      this.galleryEditor.sortingDeactivate();
      this.galleryEditor.sortingChanged = true;

      var uploadPromises = [];
      for (var i = 0; i < files.length; i++) {
        uploadPromises.push(this.uploadFile(files[i]));
      }

      Promise.all(uploadPromises).then(function() {
        this.uploadComplete();
      }.bind(this));
    }
  },


  uploadFile: function(file) {
    var uploadPromise = new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      var formData = new FormData();

      var uploadItemInfo = new Element('span', {'class': 'file-info'});
      var uploadItem = new Element('li', {'class': 'file'}).adopt(
        new Element('span', {'class': 'file-name', 'html': this.name}),
        uploadItemInfo
      ).inject(this.galleryEditor.strip);

      uploadItem.store('FXProgressBar', new Fx.ProgressBar(uploadItem));
      uploadItem.retrieve('FXProgressBar').cancel().set(0);

      formData.append('Filedata', file, file.name);

      xhr.upload.addEventListener('progress', function(e) {
        if (e.lengthComputable) {
          uploadItem.retrieve('FXProgressBar').start(e.loaded, e.total);
        }
      }, false);

      xhr.addEventListener('load', function() {
        var data = $H(JSON.decode(xhr.responseText, true) || {});

        if (xhr.status == 401) {
          window.location.reload();

        } else if (data.status > 0) {
          uploadItem.retrieve('FXProgressBar').start(100).chain(function() {
            // clear the LI element
            uploadItem.getChildren().each(function(child) { child.destroy(); });
            // render
            this.galleryEditor.addUploadedElement(uploadItem, data);
          }.bind(this));
          resolve();

        } else {
          uploadItem.retrieve('FXProgressBar').start(100).chain(function() {
            uploadItem.addClass('file-failed');
            uploadItemInfo.set('html', data.get('error'));
            setTimeout(function(){
              uploadItem.fade('out').retrieve('tween').chain(uploadItem.destroy());
            }, 5000);
          });
          resolve();
        }

      }.bindWithEvent(this), false);

      xhr.open('POST', this.uploadUrl, true);
      xhr.send(formData);

    }.bind(this));
    return uploadPromise;
  },


  uploadComplete: function() {
    this.galleryEditor.isUploading = false;
    this.galleryEditor.strip.removeClass('processing');
    this.galleryEditor.sortingActivate();
  }

});



var BertaPosterUploader = new Class({


  initialize: function(galleryEditor, selectFileLink, videoSrc) {
    this.galleryEditor = galleryEditor;
    this.selectFile = selectFileLink;
    this.item = this.selectFile.getParent('li');
    this.uploadUrl = this.galleryEditor.container.getElement('.xEntryAddImagesLink').getAttribute('href') + '&poster_for=' + videoSrc;
    this.fileInput = this.selectFile.getPrevious();

    this.addUploader();
  },


  addUploader: function() {
    this.selectFile.addEvent('click', function(e) {
      e.preventDefault();
      this.fileInput.click();
    }.bindWithEvent(this));

    this.fileInput.addEvent('change', function() {
      this.startUpload();
    }.bindWithEvent(this));
  },


  startUpload: function() {
    var files = $$(this.fileInput)[0].files;
    if (files.length) {

      this.galleryEditor.isUploading = true;
      this.galleryEditor.strip.addClass('processing');
      this.galleryEditor.sortingDeactivate();
      this.galleryEditor.sortingChanged = true;

      var uploadPromises = [];
      for (var i = 0; i < files.length; i++) {
        uploadPromises.push(this.uploadFile(files[i]));
      }

      Promise.all(uploadPromises).then(function() {
        this.uploadComplete();
      }.bind(this));
    }
  },


  uploadFile: function(file) {
    var uploadPromise = new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      var formData = new FormData();

      formData.append('Filedata', file, file.name);

      xhr.addEventListener('load', function() {
        var data = $H(JSON.decode(xhr.responseText, true) || {});

        if (xhr.status == 401) {
          window.location.reload();

        } else if (data.status > 0) {
          var placeHolder = this.item.getElement('div.placeholderContainer');
          placeHolder.setStyle('background-image', 'url(' + data.get('smallthumb_path') + '?no_cache=' + Math.random() + ')');
          this.selectFile.set('html', 'change poster frame');
          resolve();

        } else {
          console.error(data.get('error'));
          resolve();
        }

      }.bindWithEvent(this), false);

      xhr.open('POST', this.uploadUrl, true);
      xhr.send(formData);

    }.bind(this));
    return uploadPromise;
  },


  uploadComplete: function() {
    this.galleryEditor.isUploading = false;
    this.galleryEditor.strip.removeClass('processing');
    this.galleryEditor.sortingActivate();
  }

});
