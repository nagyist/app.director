Spine       = require("spine")
$           = Spine.$
Gallery     = require('models/gallery')
Gallery     = require('models/gallery')
Album       = require('models/album')
Photo       = require('models/photo')
AlbumsPhoto = require('models/albums_photo')

class PhotosHeader extends Spine.Controller
  
  events:
    'click .gal'                      : 'backToGalleries'
    'click .alb'                      : 'backToAlbums'

  template: (item) ->
    $("#headerPhotosTemplate").tmpl item

  constructor: ->
    super
    Gallery.bind('create update destroy', @proxy @render)
    Album.bind('change', @proxy @render)
    Photo.bind('change', @proxy @render)
    Photo.bind('refresh', @proxy @render)
    Spine.bind('change:selectedGallery', @proxy @render)
    Spine.bind('change:selectedAlbum', @proxy @render)
    
  backToGalleries: (e) ->
    console.log 'PhotosHeader::backToGalleries'
#    Spine.trigger('show:galleries')
    @navigate '/galleries/'
    e.stopPropagation()
    e.preventDefault()
    
  backToAlbums: (e) ->
    console.log 'PhotosHeader::backToAlbums'
    @navigate '/gallery', Gallery.record?.id or ''
    e.stopPropagation()
    e.preventDefault()
    
  change:  ->
    @render()
    
  render: ->
    return unless @isActive()
    @html @template
      gallery: Gallery.record
      album: Album.record
      photo: Photo.record
      count:  @count()
    
  count: ->
    if Album.record
      AlbumsPhoto.filter(Album.record.id, key: 'album_id').length
    else
      Photo.count()
    
  activated: ->
    @render()

module?.exports = PhotosHeader