import $ from "jquery";

class Like {

    constructor() {

        this.events()
    }

    events(){
           $(".like-box").on("click", this.ourClickDispatcher.bind(this));

    }

    //methods
    ourClickDispatcher(e){
        var currentLikeBox = $(e.target).closest(".like-box");//closet method is use to make sure like box is selected even if click is not precisely on target

      if(currentLikeBox.attr("data-exists")=="yes"){

          this.deleteLike(currentLikeBox);
      }else {

          this.createLike(currentLikeBox);
      }


    }

    createLike(currentLikeBox){

        $.ajax({ //URL should match route you set up in register rest route api
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-WP-Nonce', universityData.nonce); //user logged in wont validate to true without nonce
            },
            url: universityData.root_url +'/wp-json/university/v1/manageLike',
            type: 'POST',
            data: {'professorId': currentLikeBox.data('professor')},
            success: (response) => {
                currentLikeBox.attr('data-exists', 'yes')//change the attribute on the html element so heart is colored in
                var likeCount = parseInt(currentLikeBox.find('.like-count').html(), 10);//has total amount stored, converted to int
                likeCount++; //add 1
                currentLikeBox.find('.like-count').html(likeCount); //Store and display new value
                currentLikeBox.attr('data-like', response ) //instantly update element to toggle LIKE
                console.log(response)
            },
            error: (response) => {
                console.log(response)
            }
        });

    }

    deleteLike(currentLikeBox){

        $.ajax({ //URL should match route you set up in register rest route api
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-WP-Nonce', universityData.nonce); //user logged in wont validate to true without nonce
            },
            url: universityData.root_url +'/wp-json/university/v1/manageLike',
            data: {'like': currentLikeBox.attr('data-like')},
            type: 'DELETE',
            success: (response) => {
                currentLikeBox.attr('data-exists', 'no')//change the attribute on the html element so heart is colored out
                var likeCount = parseInt(currentLikeBox.find('.like-count').html(), 10);//has total amount stored, converted to int
                likeCount--; //subtract 1
                currentLikeBox.find('.like-count').html(likeCount); //Store and display new value
                currentLikeBox.attr('data-like', '' ) //instantly update element to toggle LIKE
                console.log(response)
            },
            error: (response) => {
                console.log(response)
            }
        });
    }
}

export default Like;