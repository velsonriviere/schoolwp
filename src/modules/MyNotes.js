import $ from 'jquery';

class MyNotes {
    constructor(){
        this.events();
    }

    events(){
        //set on click event with 2 parameters this way method functions works with new notes that are created
     $('#my-notes').on('click', ".delete-note", this.deleteNote);
     $('#my-notes').on('click','.edit-note', this.editNote.bind(this));
     $('#my-notes').on('click','.update-note', this.updateNote.bind(this));
     $('.submit-note').on('click', this.createNote.bind(this));
    }

    //methods
    editNote(e){
        var thisNote = $(e.target).parents("li");
        if(thisNote.data('state') =='editable'){//condition for swap

            this.makeNoteReadOnly(thisNote);

        } else{
            this.makeNoteEditable(thisNote);
        }


    }
   //toggling between the form to edit to non edit phase (read only) basically setting code to do the opposite
    makeNoteEditable(thisNote){
        thisNote.find('.edit-note').html('<i class="fa fa-times" aria-hidden="true"></i> Cancel');
        thisNote.find(".note-title-field, .note-body-field").removeAttr('readonly').addClass('note-active-field');
        thisNote.find(".update-note").addClass("update-note--visible");
        thisNote.data('state','editable'); //trigger condition
    }

    makeNoteReadOnly(thisNote){
        thisNote.find('.edit-note').html('<i class="fa fa-pencil" aria-hidden="true"></i> Edit');
        thisNote.find(".note-title-field, .note-body-field").attr('readonly','readonly' ).removeClass('note-active-field');
        thisNote.find(".update-note").removeClass("update-note--visible");
        thisNote.data("state","cancel"); //trigger condition

    }

    deleteNote(e){
        var thisNote = $(e.target).parents("li");
     $.ajax({
         beforeSend: (xhr) => {
             xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
         },
         url:universityData.root_url + '/wp-json/wp/v2/note/'+ thisNote.data('id'), //because its data-id an html element only need to put 'id' instead of 'data-id'
         type: 'DELETE',
         success: (response) => {
             thisNote.slideUp();
             console.log('congrats');
             console.log(response);

             if(response.userNoteCount < 5){

                 $(".note-limit-message").removeClass('active');

             }
         },
         error: (response) => {
             console.log('sorry');
             console.log(response);
         }

     });

    }

    updateNote(e){
        var thisNote = $(e.target).parents("li");

        var ourUpdatedPost = {
            'title': thisNote.find('.note-title-field').val(),
            'content': thisNote.find('.note-body-field').val()
        }

        $.ajax({
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
            },
            url:universityData.root_url + '/wp-json/wp/v2/note/'+ thisNote.data('id'), //because its data-id an html element only need to put 'id' instead of 'data-id'
            type: 'POST',
            data: ourUpdatedPost,
            success: (response) => {
                this.makeNoteReadOnly(thisNote)
                console.log('congrats');
                console.log(response);
            },
            error: (response) => {
                console.log('sorry');
                console.log(response);
            }

        });

    }

    createNote(e){

        var ourNewPost = {
            'title': $(".new-note-title").val(),
            'content': $(".new-note-body").val(),
            'status' : 'publish'
        }

        $.ajax({
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
            },
            url:universityData.root_url + '/wp-json/wp/v2/note/', //url to create new entry post. if new post or event change 'note' to 'post' or 'event', etc
            type: 'POST',
            data: ourNewPost,
            success: (response) => {
                $('.new-note-title, .new-note-body').val('');//clear forms
                $(`
                  <li data-id="${response.id}">
                   <input readonly class="note-title-field" value="${response.title.raw}">
                   <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
                   <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
                   <textarea readonly class="note-body-field">${response.content.raw}</textarea>
                   <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"> Save</i></span>
               </li>
                `).prependTo('#my-notes').hide().slideDown();
                console.log('congrats');
                console.log(response);
            },
            error: (response) => {

                if(response.responseText =="You have reached your note limit"){

                   $(".note-limit-message").addClass('active');
                }
                console.log('sorry');
                console.log(response);
            }

        });

    }
}

export default MyNotes; //to be able to pull it in main and other js files