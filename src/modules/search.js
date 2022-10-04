import $ from 'jquery';

class Search{
    //1. Describe and create/initiate our object
    constructor() {
        this.addSearchHTML();//note: important this is at top before others because elements below exist in this element
        this.resultsDiv = $("#search-overlay__results").bind(this);
        this.openButton = $(".js-search-trigger");
        this.closeButton = $(".search-overlay__close");
        this.searchOverlay = $(".search-overlay");
        this.searchField  = $("#search-term");
        this.events();
        this.isOverlayOpen = false;
        this.isSpinnerVisible = false;
        this.previousValue;
        this.typingTimer;

    }
    //2. events
    events() {
        this.openButton.on("click", this.openOverlay.bind(this));
        this.closeButton.on("click", this.closeOverlay.bind(this));
        $(document).on("keyup", this.keyPressDispatcher.bind(this));
        this.searchField.on("keyup", this.typingLogic.bind(this));
    }
    //3. methods (i.e function, action)

    typingLogic(){

        if(this.searchField.val() != this.previousValue){
            clearTimeout(this.typingTimer);//allow code to execute once until timer runs completely or else it resets

            if(this.searchField.val()){//this way spinner only spins if theres value

                if(!this.isSpinnerVisible){
                    this.resultsDiv.html('<div class="spinner-loader"></div>');
                    this.isSpinnerVisible =true;

                }
                this.typingTimer = setTimeout(this.getResults.bind(this),750);
            } else {
                this.resultsDiv.html('');
                this.isSpinnerVisible = false;

            }


        }

        this.previousValue = this.searchField.val();
    }
    getResults(){

        $.getJSON(universityData.root_url +'/wp-json/university/v1/search?term='+this.searchField.val(),  (results) => {
            this.resultsDiv.html(`
            <div class="row">
            <div class="one-third">
            <h2 class="search-overlay__section-title">General Info</h2>
           ${results.generalInfo.length ? '<ul class="link-list min-list">' : '<p>No general information found</p>'}
           ${results.generalInfo.map(item =>`<li><a href="${item.permalink}">${item.title}</a> ${item.postType == 'post' ? `by ${item.authorName}`: ''}</li>`).join('')}
           ${results.generalInfo.length ? '</ul>' : ''}
             </div>
            <div class="one-third">
            <h2 class="search-overlay__section-title">Programs</h2>
            
           ${results.programs.length ? '<ul class="link-list min-list">' : `<p>No programs found. <a href="${universityData.root_url}/programs">View all programs</a></p>`}
           ${results.programs.map(item =>`<li><a href="${item.permalink}">${item.title}</a> </li>`).join('')}
           ${results.programs.length ? '</ul>' : ''}
            
            <h2 class="search-overlay__section-title">Professors</h2>
            
           ${results.professors.length ? '<ul class="professor-cards">' : `<p>No professors found. </p>`}
           ${results.professors.map(item =>`
           <li class="professor-card__list-item">
                   <a class="professor-card" href="${item.permalink}">
                       <img class="professor-card__image" src="${item.image}">
                       <span class="professor-card__name">${item.title}</span>

                   </a>
               </li>
           `).join('')}
           ${results.professors.length ? '</ul>' : ''}
            
           </div>
            <div class="one-third">
            <h2 class="search-overlay__section-title">Campuses</h2>
            
           ${results.campuses.length ? '<ul class="link-list min-list">' : `<p>No campus found. <a href="${universityData.root_url}/campuses">View all campuses</a></p>`}
           ${results.campuses.map(item =>`<li><a href="${item.permalink}">${item.title}</a> </li>`).join('')}
           ${results.campuses.length ? '</ul>' : ''}
            
            <h2 class="search-overlay__section-title">Events</h2>
            
           ${results.events.length ? '' : '<p>No events found <a href="${universityData.root_url}/events">View all events</a></p>'}
           ${results.events.map(item =>`
           <div class="event-summary">
    <a class="event-summary__date t-center" href="${item.permalink}">
                       <span class="event-summary__month">${item.month}</span>
        <span class="event-summary__day">${item.day} </span>
    </a>
    <div class="event-summary__content">
        <h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">${item.title}</a></h5>
        <p>${item.description}<a href="${item.permalink}" class="nu gray">Learn more</a></p>
    </div>
</div>
           `).join('')}
            
           </div>
            </div>
            
            `)
            this.isSpinnerVisible = false;
        });

        //*DO NOT DELETE SAVE FOR REFERENCE* just comment code out
        //NOTE using template literal `` to fit coding in html(), using map to loop, terniary condition use
        //So code can execute asynchronously
      //  $.when(
        //    $.getJSON(universityData.root_url +'/wp-json/wp/v2/posts?search='+this.searchField.val()),
        //    $.getJSON(universityData.root_url +'/wp-json/wp/v2/pages?search='+this.searchField.val())
        //   ).then( (posts, pages) => {
        //    var combinedResults = posts[0].concat(pages[0]);
        //    this.resultsDiv.html(`
        //   <h2 class="search-overlay__section-title">General Information</h2>
        //   ${combinedResults.length ? '<ul class="link-list min-list">' : '<p>No general information found</p>'}
        //   ${combinedResults.map(item =>`<li><a href="${item.link}">${item.title.rendered}</a> ${item.type == 'post' ? `by ${item.authorName}`: ''}</li>`).join('')}
        //   ${combinedResults.length ? '</ul>' : ''}
        //  `);
        //   this.isSpinnerVisible = false;
        // }, ()=> {//added 2nd parameter to then method to catch errors
        //        this.resultsDiv.html('<p>Unexpected error please try again</p>');
        // } );

    }
    keyPressDispatcher(e){
        console.log(e.keyCode);
       if(e.keyCode == 83 && !this.isOverlayOpen && !$('input, textarea').is(':focus')){//s btn will pop up search but not if s keypress is done in a text field
           this.openOverlay();
       }
       if(e.keyCode == 27 && this.isOverlayOpen && !$('input, textarea').is(':focus')){//esc btn will pop up search but not if s keypress is done in a text field
           this.closeOverlay();
        }
    }

    openOverlay(){
        this.searchOverlay.addClass("search-overlay--active");
        $("body").addClass("body-no-scroll");
        this.searchField.val('');
        setTimeout(() => this.searchField.focus(),301);//function shorthand with 1st parameter
        this.isOverlayOpen = true;
        return false; //this helps cancel out the page redirect so if js disabled on browser non js search can execute

    }

    closeOverlay(){
        this.searchOverlay.removeClass("search-overlay--active");
        $("body").removeClass("body-no-scroll");
        this.isOverlayOpen = false;
    }

    addSearchHTML(){
         //used template literal `` back ticks below
        $('body').append(`
            <div class="search-overlay ">
        <div class="search-overlay__top">
            <div class="container">
                <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
            <input type="text" class="search-term" placeholder="what are you looking for?" id="search-term">
                <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
            </div>


        </div>

        <div class="container">
            <div id="search-overlay__results">

            </div>
        </div>

    </div>
        `)
    }
}

export default Search;