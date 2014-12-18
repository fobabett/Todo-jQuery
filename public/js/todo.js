$(function() {

  // on page load, get all todos
  
  $.get('/items', function (docs) {
    
    // render items
    
    docs.forEach(function (doc) {
      
      $('ul#todo_list').append( buildTodoItem( doc ) )

    })

  });
  // on press enter, save new todo
  $( "#target" ).keydown(function(event) {
    if( event.which == 13 ) {
      createNewTodo();
      $('img#marker').fadeIn('fast', function() {
        $('img#marker').animate({
          marginLeft: '300px'
        },1000, function() {
          $('img#marker').animate({
            marginLeft: '-300px'
          },100, function() {
            $('img#marker').fadeOut();
          });
        });
      });
    }
  });

  function buildTodoItem ( todo_doc ) {
    
    var list_item = $('<li>',{
      class : "list_items",
      "data-object-id" : todo_doc._id
    });

    var list_checkbox = $('<input>', {
      type : "checkbox",
      change : change_completed_status
    });

    var list_label = $('<span>', {
      text : todo_doc.title
    });

    var list_delete = $('<button>', {
      id: 'delete',
      text : "[x]",
      click : click_delete_item_handler
    });

    if(todo_doc.completed === "true") {
      list_checkbox.attr("checked","checked");
    }

    list_item
      .append( list_checkbox )
      .append( list_label )
      .append( list_delete );
    
    return list_item;
  }

  //
  function createNewTodo () {
    
    var user_input = $('#target').val();
    
    // RESETS TO PLACEHOLDER
    $('input').val('');

    var post_data = {
      new_item : {
        title : user_input,
        checked : false
      }
    }

    $.post('/items', post_data, function (new_todo_id){
      
      post_data.new_item._id = new_todo_id;
      $('ul#todo_list').append( buildTodoItem( post_data.new_item ) );

    });

  }
  // http DELETE then delete it's parent li
  function click_delete_item_handler (e) {

    var button = $(e.currentTarget);
    var parent_li = button.closest("li");
    var object_id = parent_li.data("object-id");

    $('img#eraser').fadeIn('fast', function() {
      $('img#eraser').animate({
        marginLeft: '300px'
      },1000, function() {
        $.ajax( '/items/' + object_id ,
          {
            type : "DELETE",
            success : function (data) {
              parent_li.remove();
              console.log('data',data);
            }
          }
        );
        $('img#eraser').animate({
          marginLeft: '-300px'
        },100, function() {
          $('img#eraser').fadeOut();
        });
      });
    });

  }

  // http PUT to update completed status
  function change_completed_status (e) {
    var checkbox = $( e.currentTarget );
    var parent_li = checkbox.closest("li");
    var object_id = parent_li.data("object-id");
    
    $.ajax('/items/' + object_id + '/' + checkbox.prop("checked"),
      {
        type : "PUT",
        success : function (data) {
          console.log('data', data);
        }
      }
    );

  }
  // CROSS OUT LIST ITEM IF BOX CHECKED
  $('ul').on('change', 'input[type=checkbox]', function() {
    if(this.checked) {
      $(this).siblings().css('text-decoration', 'line-through');
    } else {
      console.log("uncheck");
      $(this).siblings().css('text-decoration', 'none');
    }
  });
});