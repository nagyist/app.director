Spine ?= require("spine")
$      = Spine.$

class PhotoHeader extends Spine.Controller
  
  events:
    'click .closeView .gal'     : 'backToGalleries'
    'click .closeView .alb'     : 'backToAlbums'
    'click .closeView .pho'     : 'backToPhotos'

  template: (item) ->
    $("#headerPhotoTemplate").tmpl item

  constructor: ->
    super

  backToGalleries: ->
    Spine.trigger('album:exposeSelection')
    Spine.trigger('show:galleries')
    
  backToAlbums: ->
    Spine.trigger('gallery:exposeSelection', Gallery.record)
    Spine.trigger('show:albums')
    
  backToPhotos: ->
    Spine.trigger('show:photos')

  change: (item) ->
    console.log 'PhotoHeader::change'
    @current = item
    @render()
    
  render: ->
    @html @template @current
    
module?.exports = PhotoHeader