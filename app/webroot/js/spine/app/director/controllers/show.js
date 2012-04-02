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
    '.close': 'btnClose',
    '.optAlbum': 'btnAlbum',
    '.optGallery': 'btnGallery',
    '.optPhoto': 'btnPhoto',
    '.optUpload': 'btnUpload'
  };
  ShowView.prototype.events = {
    'click .optQuickUpload:not(.disabled)': 'toggleQuickUpload',
    'click .optOverview:not(.disabled)': 'showOverview',
    'click .optPrevious:not(.disabled)': 'showPrevious',
    'click .optShowModal:not(.disabled)': 'showModal',
    'click .optFullScreen:not(.disabled)': 'toggleFullScreen',
    'click .optCreateGallery:not(.disabled)': 'createGallery',
    'click .optCreateAlbum:not(.disabled)': 'createAlbum',
    'click .optCreatePhoto:not(.disabled)': 'createPhoto',
    'click .optDestroyGallery:not(.disabled)': 'destroyGallery',
    'click .optDestroyAlbum:not(.disabled)': 'destroyAlbum',
    'click .optDestroyPhoto:not(.disabled)': 'destroyPhoto',
    'click .optEditGallery:not(.disabled)': 'editGallery',
    'click .optGallery:not(.disabled)': 'toggleGalleryShow',
    'click .optAlbum:not(.disabled)': 'toggleAlbumShow',
    'click .optPhoto:not(.disabled)': 'togglePhotoShow',
    'click .optUpload:not(.disabled)': 'toggleUploadShow',
    'click .optShowAllAlbums:not(.disabled)': 'showAllAlbums',
    'click .optShowAllPhotos:not(.disabled)': 'showAllPhotos',
    'click .optSlideshowAutoStart:not(.disabled)': 'toggleSlideshowAutoStart',
    'click .optShowSlideshow:not(.disabled)': 'showSlideshow',
    'click .optSlideshowPlay:not(.disabled)': 'slideshowPlay',
    'click .optClose:not(.disabled)': 'toggleDraghandle',
    'click .optSelectAll:not(.disabled)': 'selectAll',
    'click .draghandle': 'toggleDraghandle',
    'click .draghandle.optClose': 'closeDraghandle',
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
      assocControl: 'optGallery',
      header: this.galleriesHeader,
      parent: this
    });
    this.albumsView = new AlbumsView({
      el: this.albumsEl,
      className: 'items',
      header: this.albumsHeader,
      parentModel: 'Gallery',
      parent: this
    });
    this.photosView = new PhotosView({
      el: this.photosEl,
      className: 'items',
      header: this.photosHeader,
      parentModel: 'Album',
      parent: this
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
    this.bind('canvas', this.proxy(this.canvas));
    this.bind('change:toolbarOne', this.proxy(this.changeToolbarOne));
    this.bind('change:toolbarTwo', this.proxy(this.changeToolbarTwo));
    this.bind('toggle:view', this.proxy(this.toggleView));
    this.toolbarOne.bind('refresh', this.proxy(this.refreshToolbar));
    Gallery.bind('change', this.proxy(this.changeToolbarOne));
    Album.bind('change', this.proxy(this.changeToolbarOne));
    Photo.bind('change', this.proxy(this.changeToolbarOne));
    Spine.bind('change:selectedAlbum', this.proxy(this.refreshToolbars));
    Spine.bind('show:allPhotos', this.proxy(this.showAllPhotos));
    Spine.bind('show:allAlbums', this.proxy(this.showAllAlbums));
    this.current = this.albumsView;
    this.slideshowMode = App.SILENTMODE;
    this.sOutValue = 74;
    this.thumbSize = 240;
    this.slideshowAutoStart = true;
    this.edit = this.editGallery;
    this.canvasManager = new Spine.Manager(this.galleriesView, this.albumsView, this.photosView, this.photoView, this.slideshowView);
    this.canvasManager.change(this.current);
    this.headerManager = new Spine.Manager(this.galleriesHeader, this.albumsHeader, this.photosHeader, this.photoHeader);
    this.headerManager.change(this.albumsHeader);
  }
  ShowView.prototype.canvas = function(controller) {
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
  ShowView.prototype.refreshToolbar = function(toolbar, lastControl) {};
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
  ShowView.prototype.toggleSlideshowAutoStart = function() {
    var x;
    x = this.slideshowAutoStart = !this.slideshowAutoStart;
    this.refreshToolbars();
    return x;
  };
  ShowView.prototype.toggleDraghandle = function() {
    var UI;
    UI = App.hmanager.externalUI();
    if (UI.hasClass('disabled')) {
      UI.removeClass('disabled').click().addClass('disabled');
    } else {
      UI.click();
    }
    return false;
  };
  ShowView.prototype.closeDraghandle = function() {
    return this.toggleDraghandle();
  };
  ShowView.prototype.toggleQuickUpload = function() {
    var active;
    this.refreshElements();
    active = this.btnQuickUpload.find('i').toggleClass('icon-ok icon-').hasClass('icon-ok');
    this.quickUpload(active);
    return active;
  };
  ShowView.prototype.toggleView = function(controller, control) {
    var isActive;
    isActive = controller.isActive();
    if (isActive) {
      App.hmanager.trigger('change', false);
    } else {
      this.activeControl = App.hmanager.externalUI();
      App.hmanager.trigger('change', controller);
    }
    this.propsEl.find('.ui-icon').removeClass('ui-icon-carat-1-s');
    $(control).toggleClass('ui-icon-carat-1-s', !isActive);
    this.renderViewControl(controller, control);
    return this.animateView();
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
  ShowView.prototype.quickUpload = function(active) {
    return App.uploader.fileupload('option', {
      autoUpload: active
    });
  };
  ShowView.prototype.isQuickUpload = function() {
    return this.btnQuickUpload.find('i').hasClass('icon-ok');
  };
  ShowView.prototype.slideshowable = function() {
    return $('[rel="gallery"]', this.current.el).length;
  };
  ShowView.prototype.play = function(e) {
    var el, elFromCanvas, elFromSelection;
    elFromSelection = __bind(function() {
      var el, id, item, list, root;
      list = Album.selectionList();
      if (list.length) {
        id = list[0];
        if (Photo.exists(id)) {
          item = Photo.find(id);
        }
        root = this.current.el.children('.items');
        el = root.children().forItem(item);
        return $('[rel="gallery"]', el);
      }
    }, this);
    elFromCanvas = __bind(function() {
      var firstEl;
      return firstEl = $('[rel="gallery"]', this.current.el).first();
    }, this);
    if (this.slideshowable()) {
      el = elFromSelection() || elFromCanvas();
      if ($('.modal-backdrop').length) {
        return;
      }
      if (this.slideshowAutoStart || (e != null ? e.type : void 0)) {
        return el.click();
      }
    } else {
      if (!Gallery.selectionList().length) {
        return;
      }
      Spine.trigger('show:photos');
      return Spine.trigger('change:selectedAlbum', Album.record, true);
    }
  };
  ShowView.prototype.pause = function(e) {
    var isShown, modal;
    modal = $('#modal-gallery').data('modal');
    isShown = modal != null ? modal.isShown : void 0;
    if (!isShown) {
      this.play(e);
    } else {
      $('#modal-gallery').data('modal').toggleSlideShow();
    }
    return false;
  };
  ShowView.prototype.slideshowPlay = function(e) {
    return this.play(e);
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
  ShowView.prototype.selectAll = function(e) {
    var root, _ref;
    root = this.current.el.children('.items');
    root.children().each(function(index, el) {
      var item;
      item = $(this).item();
      return item.addRemoveSelection(true);
    });
    if ((_ref = this.current.list) != null) {
      _ref.select();
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
  ShowView.prototype.showAllPhotos = function() {
    Spine.trigger('show:photos');
    Gallery.emptySelection();
    Album.emptySelection();
    return Album.current();
  };
  ShowView.prototype.showAllAlbums = function() {
    Spine.trigger('show:albums');
    return Gallery.current();
  };
  return ShowView;
})();
