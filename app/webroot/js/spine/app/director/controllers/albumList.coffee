Spine ?= require("spine")
$      = Spine.$

class Spine.AlbumList extends Spine.Controller
  
  elements:
    '.optCreateAlbum'         : 'btnCreateAlbum'

  events:
    "click .item"             : "click"
    "dblclick .item"          : "dblclick"
    'click .optCreateAlbum'   : 'create'
    
  selectFirst: true
    
  constructor: ->
    super
    @bind("change", @change)
    @record = Gallery.record
    
  template: -> arguments[0]
  
  change: ->
    console.log 'AlbumList::change'
    
    list = Gallery.selectionList() 
    @children().removeClass("active")
    if list
      for id in list
        item = Album.find(id) if Album.exists(id)
        @children().forItem(item).addClass("active")

      selected = Album.find(list[0]) if Album.exists(list[0])
      if selected and !selected.destroyed
        item = selected

    Spine.App.trigger('change:selectedAlbum', item)
      
      
  
  render: (items, newAlbum) ->
    console.log 'AlbumList::render'
    if items.length
      @html @template items
    else
      @html 'This Gallery has no Albums&nbsp;<button class="optCreateAlbum">CreateAlbum</button>'
      @refreshElements()

    newAlbum.addToSelection(Gallery) if newAlbum
    @change()
    @
  
  children: (sel) ->
    @el.children(sel)
    
  create: ->
    @preserveEditorOpen('album', App.albumsShowView.btnAlbum)
    album = new Album()
    album.save()

  click: (e) ->
    console.log 'AlbumList::click'
    item = $(e.target).item()
    
    if App.hmanager.hasActive()
      @preserveEditorOpen('album', App.albumsShowView.btnAlbum)
    
    item.addToSelection(Gallery, @isCtrlClick(e))
    @change item 

  dblclick: (e) ->
    @preserveEditorOpen('album', App.albumsShowView.btnAlbum)

  edit: (e) ->
    console.log 'AlbumList::edit'
    item = $(e.target).item()
    @change item

module?.exports = Spine.AlbumList