Spine = require('spine')
$               = Spine.$
Controller      = Spine.Controller
Drag            = require("plugins/drag")
User            = require("models/user")
Album           = require('models/album')
Gallery         = require('models/gallery')
GalleriesAlbum  = require('models/galleries_album')
AlbumsPhoto     = require('models/albums_photo')
Info            = require('controllers/info')
AlbumsList      = require('controllers/albums_list')
User            = require('models/user')
Extender        = require("plugins/controller_extender")

require("plugins/tmpl")

class AlbumsAddView extends Spine.Controller

  @extend Extender

  events:
    'click .item'                            : 'click'
    'click .opt-AddExecute:not(.disabled)'   : 'add'
    'click .opt-Selection:not(.disabled)'    : 'revertSelection'

  template: (items) ->
    $('#addTemplate').tmpl
      title: 'Add albums to your gallery'
      type: 'albums'
      disabled: true
      contains: !!items.length
    
  subTemplate: (items, options) ->
    $("#albumsTemplate").tmpl items, options
    
  footerTemplate: (selection) ->
    $('#footerTemplate').tmpl
      disabled: !selection.length
      contains: !!@items.length
    
  constructor: ->
    super
    @visible = false
    @modal = @el.modal
      show: @visible
      backdrop: true
    @modal.bind('show.bs.modal', @proxy @modalShow)
    @modal.bind('hide.bs.modal', @proxy @modalHide)
    
    @list = new AlbumsList
      template: @subTemplate
      
    Spine.bind('albums:add', @proxy @show)
      
  render: (items) ->
    @html @template @items = items
    @itemsEl = $('.items', @el)
    @list.el = @itemsEl
    @list.render items, 'add'
  
  renderFooter: (selection) ->
    @footer = $('.modal-footer', @el)
    @footer.html @footerTemplate selection
  
  show: ->
    @el.modal('show')
    list = GalleriesAlbum.albums(Gallery.record.id).toID()
    records = Album.filter list, func: 'idExcludeSelect'
    @render records
    
  hide: ->
    @el.modal('hide')
  
  modalShow: (e) ->
    @preservedList = Gallery.selectionList().slice(0)
    @selectionList = []
  
  modalHide: (e) ->
    
  click: (e) ->
    e.stopPropagation()
    e.preventDefault()
    
    item = $(e.currentTarget).item()
    @select(item.id, @isCtrlClick(e))
    
  select: (items = [], exclusive) ->
    unless Spine.isArray items
      items = [items]
      
    list = []
    for item in items
      list = @selectionList.addRemoveSelection(item)
      
    @renderFooter list
    @list.exposeSelection(list)
    
  selectAll: ->
    root = @itemsEl
    return unless root and root.children('.item').length
    list = []
    root.children('.item').each (index, el) ->
      item = $(@).item()
      list.unshift item.id
    @select(list)
    
  revertSelection: (e)->
    @selectAll()
    e.stopPropagation()
    e.preventDefault()
    
  add: ->
    Spine.trigger('albums:copy', @selectionList, Gallery.record)
    if @selectionList.length
      Album.trigger('activate', @selectionList)
    @hide()
    
  keyup: (e) ->
    code = e.charCode or e.keyCode
    
    console.log 'PhotosAddView:keyupCode: ' + code
    
    switch code
      when 65 #CTRL A
        if e.metaKey or e.ctrlKey
          @selectAll()
          e.stopPropagation()
          e.preventDefault()
    
module.exports = AlbumsAddView