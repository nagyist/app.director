var ShowView;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
ShowView = (function() {
  __extends(ShowView, Spine.Controller);
  ShowView.prototype.elements = {
    '#views .views': 'views',
    '.galleriesHeader': 'galleriesHeaderEl',
    '.albumsHeader': 'albumsHeaderEl',
    '.photosHeader': 'photosHeaderEl',
    '.photoHeader': 'photoHeaderEl',
    '.header': 'albumHeader',
    '.optOverview': 'btnOverview',
    '.optEditGallery': 'btnEditGallery',
    '.optGallery .ui-icon': 'btnGallery',
    '.optAlbum .ui-icon': 'btnAlbum',
    '.optPhoto .ui-icon': 'btnPhoto',
    '.optUpload .ui-icon': 'btnUpload',
    '.optQuickUpload': 'btnQuickUpload',
    '.optFullScreen': 'btnFullScreen',
    '.optSlideshow': 'btnSlideshow',
    '.toolbarOne': 'toolbarOneEl',
    '.toolbarTwo': 'toolbarTwoEl',
    '.props': 'propsEl',
    '.galleries': 'galleriesEl',
    '.albums': 'albumsEl',
    '.photos': 'photosEl',
    '.photo': 'photoEl',
    '.slideshow': 'slideshowEl',
    '.slider': 'slider',
    '.close': 'btnClose'
  };
  ShowView.prototype.events = {
    'click .optQuickUpload:not(.disabled)': 'toggleQuickUpload',
    'click .optOverview:not(.disabled)': 'showOverview',
    'click .optPrevious:not(.disabled)': 'showPrevious',
    'click .optShowSlideshow:not(.disabled)': 'showSlideshow',
    'click .optSlideshowPlay:not(.disabled)': 'slideshowPlay',
    'click .optFullScreen:not(.disabled)': 'toggleFullScreen',
    'click .optCreatePhoto:not(.disabled)': 'createPhoto',
    'click .optDestroyPhoto:not(.disabled)': 'destroyPhoto',
    'click .optShowPhotos:not(.disabled)': 'showPhotos',
    'click .optCreateAlbum:not(.disabled)': 'createAlbum',
    'click .optShowAllAlbums:not(.disabled)': 'showAllAlbums',
    'click .optDestroyAlbum:not(.disabled)': 'destroyAlbum',
    'click .optEditGallery:not(.disabled)': 'editGallery',
    'click .optCreateGallery:not(.disabled)': 'createGallery',
    'click .optDestroyGallery:not(.disabled)': 'destroyGallery',
    'click .optGallery:not(.disabled)': 'toggleGalleryShow',
    'click .optAlbum:not(.disabled)': 'toggleAlbumShow',
    'click .optPhoto:not(.disabled)': 'togglePhotoShow',
    'click .optUpload:not(.disabled)': 'toggleUploadShow',
    'click .optAllGalleries:not(.disabled)': 'allGalleries',
    'click .optAllAlbums:not(.disabled)': 'allAlbums',
    'click .optAllPhotos:not(.disabled)': 'allPhotos',
    'click .optSelectAll:not(.disabled)': 'selectAll',
    'click .optClose:not(.disabled)': 'toggleDraghandle',
    'click .optShowModal:not(.disabled)': 'showModal',
    'click .optSlideshowStop:not(.disabled)': 'slideshowStop',
    'dblclick .draghandle': 'toggleDraghandle',
    'click .items': 'deselect',
    'slidestop .slider': 'sliderStop',
    'slidestart .slider': 'sliderStart'
  };
  function ShowView() {
    this.sliderStop = __bind(this.sliderStop, this);
    this.sliderSlide = __bind(this.sliderSlide, this);
    this.sliderStart = __bind(this.sliderStart, this);
    this.initSlider = __bind(this.initSlider, this);
    this.deselect = __bind(this.deselect, this);    ShowView.__super__.constructor.apply(this, arguments);
    this.silent = true;
    this.toolbarOne = new ToolbarView({
      el: this.toolbarOneEl
    });
    this.toolbarTwo = new ToolbarView({
      el: this.toolbarTwoEl
    });
    this.photoHeader = new PhotoHeader({
      el: this.photoHeaderEl
    });
    this.photosHeader = new PhotosHeader({
      el: this.photosHeaderEl
    });
    this.albumsHeader = new AlbumsHeader({
      el: this.albumsHeaderEl
    });
    this.galleriesHeader = new GalleriesHeader({
      el: this.galleriesHeaderEl
    });
    this.galleriesView = new GalleriesView({
      el: this.galleriesEl,
      className: 'items',
      header: this.galleriesHeader,
      parent: this
    });
    this.albumsView = new AlbumsView({
      el: this.albumsEl,
      className: 'items',
      header: this.albumsHeader,
      parent: this,
      parentModel: 'Gallery'
    });
    this.photosView = new PhotosView({
      el: this.photosEl,
      className: 'items',
      header: this.photosHeader,
      parent: this,
      parentModel: 'Album'
    });
    this.photoView = new PhotoView({
      el: this.photoEl,
      className: 'items',
      header: this.photoHeader,
      parent: this,
      parentModel: 'Photo'
    });
    this.slideshowView = new SlideshowView({
      el: this.slideshowEl,
      className: 'items',
      header: false,
      parent: this,
      parentModel: 'Photo',
      subview: true
    });
    Spine.bind('change:canvas', this.proxy(this.changeCanvas));
    Gallery.bind('change', this.proxy(this.changeToolbarOne));
    Album.bind('change', this.proxy(this.changeToolbarOne));
    Photo.bind('change', this.proxy(this.changeToolbarOne));
    Spine.bind('change:toolbarOne', this.proxy(this.changeToolbarOne));
    Spine.bind('change:toolbarTwo', this.proxy(this.changeToolbarTwo));
    Spine.bind('change:selectedAlbum', this.proxy(this.refreshToolbars));
    this.bind('toggle:view', this.proxy(this.toggleView));
    this.current = this.albumsView;
    this.slideshowMode = App.SILENTMODE;
    this.sOutValue = 74;
    this.thumbSize = 240;
    if (this.activeControl) {
      this.initControl(this.activeControl);
    } else {
      throw 'need initial control';
    }
    this.edit = this.editGallery;
    this.canvasManager = new Spine.Manager(this.galleriesView, this.albumsView, this.photosView, this.photoView, this.slideshowView);
    this.canvasManager.change(this.current);
    this.headerManager = new Spine.Manager(this.galleriesHeader, this.albumsHeader, this.photosHeader, this.photoHeader);
    this.headerManager.change(this.albumsHeader);
    this.defaultToolbarTwo = this.toolbarTwo.change(['Slideshow']);
  }
  ShowView.prototype.changeCanvas = function(controller) {
    console.log('ShowView::changeCanvas');
    if (!this.current.subview) {
      this.previous = this.current;
    }
    this.current = controller;
    this.el.data({
      current: controller.el.data().current.record,
      className: controller.el.data().current.className
    });
    this.canvasManager.change(controller);
    return this.headerManager.change(controller.header);
  };
  ShowView.prototype.changeToolbarOne = function(list) {
    this.toolbarOne.change(list);
    this.toolbarTwo.refresh();
    return this.refreshElements();
  };
  ShowView.prototype.changeToolbarTwo = function(list) {
    this.toolbarTwo.change(list);
    return this.refreshElements();
  };
  ShowView.prototype.refreshToolbars = function() {
    console.log('ShowView::refreshToolbars');
    this.toolbarOne.refresh();
    return this.toolbarTwo.refresh();
  };
  ShowView.prototype.renderViewControl = function(controller, controlEl) {
    var active;
    active = controller.isActive();
    return $('.options .opt').each(function() {
      if (this === controlEl) {
        return $(this).toggleClass('active', active);
      } else {
        return $(this).removeClass('active');
      }
    });
  };
  ShowView.prototype.showGallery = function() {
    return App.contentManager.change(App.showView);
  };
  ShowView.prototype.showAlbums = function(e) {
    App.contentManager.change(App.showView);
    return Spine.trigger('show:albums');
  };
  ShowView.prototype.showAllAlbums = function() {
    return Spine.trigger('show:allAlbums');
  };
  ShowView.prototype.showPhotos = function(e) {
    return Spine.trigger('show:photos');
  };
  ShowView.prototype.showOverview = function(e) {
    return Spine.trigger('show:overview');
  };
  ShowView.prototype.showSlideshow = function(e) {
    this.slideshowMode = App.SILENTMODE;
    App.sidebar.toggleDraghandle({
      close: true
    });
    return Spine.trigger('show:slideshow');
  };
  ShowView.prototype.showPrevious = function() {
    App.sidebar.toggleDraghandle();
    return this.previous.show();
  };
  ShowView.prototype.showModal = function() {
    this.modalView.render({
      header: 'Neuer Header',
      body: 'Neuer Body',
      footer: 'Neuer Footer'
    });
    return this.modalView.show();
  };
  ShowView.prototype.createGallery = function(e) {
    return Spine.trigger('create:gallery');
  };
  ShowView.prototype.createPhoto = function(e) {
    return Spine.trigger('create:photo');
  };
  ShowView.prototype.createAlbum = function(e) {
    return Spine.trigger('create:album');
  };
  ShowView.prototype.editGallery = function(e) {
    return Spine.trigger('edit:gallery');
  };
  ShowView.prototype.editAlbum = function(e) {
    return Spine.trigger('edit:album');
  };
  ShowView.prototype.destroyGallery = function(e) {
    Spine.trigger('destroy:gallery');
    return this.deselect();
  };
  ShowView.prototype.destroyAlbum = function(e) {
    Spine.trigger('destroy:album');
    return this.deselect();
  };
  ShowView.prototype.destroyPhoto = function(e) {
    Spine.trigger('destroy:photo');
    return this.deselect();
  };
  ShowView.prototype.animateView = function() {
    var hasActive, height;
    hasActive = function() {
      if (App.hmanager.hasActive()) {
        return App.hmanager.enableDrag();
      }
      return false;
    };
    height = function() {
      App.hmanager.currentDim;
      if (hasActive()) {
        return parseInt(App.hmanager.currentDim) + 'px';
      } else {
        return '18px';
      }
    };
    return this.views.animate({
      height: height()
    }, 400);
  };
  ShowView.prototype.toggleGalleryShow = function(e) {
    this.trigger('toggle:view', App.gallery, e.target);
    return e.preventDefault();
  };
  ShowView.prototype.toggleGallery = function(e) {
    return this.changeToolbarOne(['Gallery']);
  };
  ShowView.prototype.toggleAlbumShow = function(e) {
    this.trigger('toggle:view', App.album, e.target);
    return e.preventDefault();
  };
  ShowView.prototype.toggleAlbum = function(e) {
    return this.changeToolbarOne(['Album']);
  };
  ShowView.prototype.togglePhotoShow = function(e) {
    this.trigger('toggle:view', App.photo, e.target);
    return e.preventDefault();
  };
  ShowView.prototype.togglePhoto = function(e) {
    return this.changeToolbarOne(['Photos', 'Slider']);
  };
  ShowView.prototype.toggleUploadShow = function(e) {
    this.trigger('toggle:view', App.upload, e.target);
    return e.preventDefault();
  };
  ShowView.prototype.toggleUpload = function(e) {
    return this.changeToolbarOne(['Upload']);
  };
  ShowView.prototype.toggleFullScreen = function() {
    this.slideshowView.toggleFullScreen();
    return this.toolbarTwo.change();
  };
  ShowView.prototype.toggleSlideshow = function() {
    var active;
    active = this.btnSlideshow.toggleClass('active').hasClass('active');
    return this.slideshowView.slideshowMode(active);
  };
  ShowView.prototype.toggleView = function(controller, control) {
    var isActive;
    isActive = controller.isActive();
    if (isActive) {
      App.hmanager.trigger('change', false);
    } else {
      this.activeControl = $(control);
      App.hmanager.trigger('change', controller);
    }
    this.propsEl.find('.ui-icon').removeClass('ui-icon-carat-1-s');
    $(control).toggleClass('ui-icon-carat-1-s', !isActive);
    this.renderViewControl(controller, control);
    return this.animateView();
  };
  ShowView.prototype.toggleDraghandle = function() {
    return this.activeControl.click();
  };
  ShowView.prototype.toggleQuickUpload = function() {
    var active;
    this.refreshElements();
    active = this.btnQuickUpload.find('i').toggleClass('icon-ok icon-').hasClass('icon-ok');
    this.quickUpload(active);
    return active;
  };
  ShowView.prototype.quickUpload = function(active) {
    return App.uploader.fileupload('option', {
      autoUpload: active
    });
  };
  ShowView.prototype.isQuickUpload = function() {
    return this.btnQuickUpload.find('i').hasClass('icon-ok');
  };
  ShowView.prototype.slideshowable = function() {
    return $('[rel="gallery"]', this.current.el);
  };
  ShowView.prototype.play = function() {
    var res;
    if (this.slideshowMode === App.SILENTMODE) {
      return;
    }
    res = this.slideshowable();
    if (res.length) {
      $(res[0]).click();
      return this.slideshowMode = App.SILENTMODE;
    } else {
      Spine.trigger('show:photos');
      return Spine.trigger('change:selectedAlbum', Album.record, true);
    }
  };
  ShowView.prototype.slideshowPlay = function() {
    this.slideshowMode = App.SLIDESHOWMODE;
    return this.play();
  };
  ShowView.prototype.slideshowStop = function() {
    var slideshow;
    slideshow = $('#modal-gallery').data('modal');
    if (slideshow) {
      return slideshow.stopSlideShow();
    }
  };
  ShowView.prototype.initControl = function(control) {
    if (Object.prototype.toString.call(control) === '[object String]') {
      return this.activeControl = this[control];
    } else {
      return this.activeControl = control;
    }
  };
  ShowView.prototype.deselect = function(e) {
    var className, item;
    item = this.el.data().current;
    className = this.el.data().className;
    switch (className) {
      case 'Photo':
        (function() {});
        break;
      case 'Album':
        Spine.Model['Album'].emptySelection();
        Spine.trigger('photo:activate');
        break;
      case 'Gallery':
        Spine.Model['Gallery'].emptySelection();
        Spine.trigger('album:activate');
        break;
      case 'Slideshow':
        (function() {});
        break;
      default:
        (function() {});
    }
    this.changeToolbarOne();
    return this.current.items.deselect();
  };
  ShowView.prototype.selectAll = function() {
    var _ref;
    this.current.items.children().each(function(index, el) {
      return $(el).item().addRemoveSelection(true);
    });
    if ((_ref = this.current.list) != null) {
      _ref.activate();
    }
    return this.changeToolbarOne();
  };
  ShowView.prototype.uploadProgress = function(e, coll) {};
  ShowView.prototype.uploadDone = function(e, coll) {};
  ShowView.prototype.sliderInValue = function(val) {
    val = val || this.sOutValue;
    return this.sInValue = (val / 2) - 20;
  };
  ShowView.prototype.sliderOutValue = function(value) {
    var val;
    val = value || this.slider.slider('value');
    return this.sOutValue = (val + 20) * 2;
  };
  ShowView.prototype.initSlider = function() {
    var inValue;
    inValue = this.sliderInValue();
    this.refreshElements();
    return this.slider.slider({
      orientation: 'horizonatal',
      value: inValue,
      slide: __bind(function(e, ui) {
        return this.sliderSlide(ui.value);
      }, this)
    });
  };
  ShowView.prototype.showSlider = function() {
    this.initSlider();
    this.sliderOutValue();
    return this.sliderInValue();
  };
  ShowView.prototype.sliderStart = function() {
    return Spine.trigger('slider:start');
  };
  ShowView.prototype.sliderSlide = function(val) {
    var newVal;
    newVal = this.sliderOutValue(val);
    Spine.trigger('slider:change', newVal);
    return newVal;
  };
  ShowView.prototype.sliderStop = function() {};
  ShowView.prototype.allGalleries = function() {
    return Spine.trigger('show:galleries');
  };
  ShowView.prototype.allAlbums = function() {
    return Spine.trigger('show:allAlbums');
  };
  ShowView.prototype.allPhotos = function() {
    return Spine.trigger('show:allPhotos');
  };
  return ShowView;
})();
