<?php
//NOTE: Did not need to create a separate file and require it but did it to stay organize so this page does not get too long
require get_theme_file_path('/inc/like-route.php');
require get_theme_file_path('/inc/search-route.php');


function university_custom_rest(){//add custom field to rest api
    register_rest_field('post', 'authorName',array(
            'get_callback' => function(){return get_the_author();}
    ));

    register_rest_field('note', 'userNoteCount',array(
        'get_callback' => function(){return count_user_posts(get_current_user_id(),'note');}
    ));
}

add_action('rest_api_init', 'university_custom_rest');
function pageBanner($args = NULL){//page banner for multiple pages; keeps code cleaner and more// organize
    //NOTE making parameters NULL allows it to be optional to pass values in functions i.e $args = NULL
  if(!$args['title']){ //set up deflaut title in case dynamic title do not exist
      $args['title'] = get_the_title();
  }

  if(!$args['subtitle']){ //set up deflaut subtitle in case dynamic subtitle do not exist
        $args['subtitle'] = get_field('page_banner_subtitle');
  }

  if (!$args['photo']) {
        if (get_field('page_banner_background_image') AND !is_archive() AND !is_home() ) {
            $args['photo'] = get_field('page_banner_background_image')['sizes']['pageBanner'];
        } else {
            $args['photo'] = get_theme_file_uri('/images/ocean.jpg');
        }
    }
    ?>
<div class="page-banner">
    <div class="page-banner__bg-image" style="background-image: url(<?php  echo $args['photo']; ?>)"></div>
    <div class="page-banner__content container container--narrow">
        <h1 class="page-banner__title"><?php echo $args['title']; ?></h1>
        <div class="page-banner__intro">
            <p>
                <?php echo $args['subtitle']; ?>  </p>
        </div>
    </div>
</div>
<?php }
function university_files(){
    //Will upload the style.css file 1st argument is just a nickname to give the file, 2nd argument is the location of the file wants to use. 
   // wp_enqueue_style('university_main_styles', get_stylesheet_uri()); //get_stylesheet_uri points to style.css file, main css file that wp recognizes

    //calling a js file ask for more arguements nickname, file location, dependcies or null, version number, load file in header (false) or bottom (true)
    //wp_enqueue_script('googleMaps', '//maps.googleapis.com/maps/api/js?key=PUT-KEY-HERE', NULL, '1.0', true);
    wp_enqueue_script('main_university_js', get_theme_file_uri('/build/index.js'), array('jquery'), '1.0', true); 
    wp_enqueue_style('google-custom-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i'); 
    wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'); 
    wp_enqueue_style('university_main_styles', get_theme_file_uri('/build/style-index.css')); 
    wp_enqueue_style('university_extra_styles', get_theme_file_uri('/build/index.css'));

    wp_localize_script('main_university_js', 'universityData', array(
      'root_url' => get_site_url(),
      'nonce' => wp_create_nonce('wp_rest') //needed for purposes like DELETE for ajax/ rest api. Creates unique number when logged in
    ));
}

add_action('wp_enqueue_scripts', 'university_files');


function university_features(){
   // register_nav_menu('HeaderMenuLocation','Header Menu Location');//register menus to be shown on wordpress appearance section
//    register_nav_menu('footerLocationOne','Footer Location Cne');
//    register_nav_menu('footerLocationTwo','Footer Location Two');
    add_theme_support('title-tag');//add each page own title to browser tabs, without it all pages will have same titles on browser tabs
    add_theme_support('post-thumbnails');//needed for featured image option on custom post/page, also thumbnails need to be added on MU plugs
    add_image_size('professorLandscape', 400, 260, true);
    add_image_size('professorPortrait', 480, 650, true);
    add_image_size('pageBanner', 1500, 350, true);
}
add_action('after_setup_theme', 'university_features');

function university_adjust_queries($query){ // a way to modify a url query page without having to create a new custom query.
    //This way makes it easier for coding and less complicated to paginate

    if(!is_admin() AND is_post_type_archive('campus') AND $query->is_main_query() ){

        $query->set('posts_per_page', -1);
    }

    if(!is_admin() AND is_post_type_archive('program') AND $query->is_main_query() ){

        $query->set('orderby','title');
        $query->set('order','ASC');
        $query->set('posts_per_page', -1);
    }

    if(!is_admin() AND is_post_type_archive('event') AND $query->is_main_query() ){//is main query adds extra safety measure to not affect custom query
       $today =date('Ymd');
       $query->set('meta_key','event_date');
       $query->set('orderby','meta_value_num');
       $query->set('order','ASC');
       $query->set('meta_query', array( //a deeper filter i.e inorder filter upcoming dates but do not get dates that passed
           array(
               'key' => 'event_date',
               'compare' => '>=', //greater than or equal to
               'value' => $today,
               'type' => 'numeric' // optional but helps wordpress filter even better knowning what its comparing


           )
       ));

    }

}

add_action('pre_get_posts', 'university_adjust_queries');

//for google maps
//function universityMapKey($api){
    //$api['key']='n/a';
   // return $api;
//}
//add_filter('acf/fields/google_map/api','universityMapKey');//for google Maps api

//redirect subscriber accounts out of admin and onto homepage
add_action('admin_init', 'redirectSubsToFrontend');

function redirectSubsToFrontend(){
$ourCurrentUser = wp_get_current_user();

if(count($ourCurrentUser->roles) == 1 AND  $ourCurrentUser->roles[0]=='subscriber'){

    wp_redirect(site_url('/'));
    exit;
}

}

add_action('wp_loaded', 'noSubsAdminBar');

function noSubsAdminBar(){
    $ourCurrentUser = wp_get_current_user();

    if(count($ourCurrentUser->roles) == 1 AND  $ourCurrentUser->roles[0]=='subscriber'){

       show_admin_bar(false);
    }

}

//customize log in screen
add_filter('login_headerurl', 'ourHeaderUrl');

function ourHeaderUrl(){

    return esc_url(site_url('/'));
}

add_action('login_enqueue_scripts', 'ourLoginCSS');

function ourLoginCSS(){

    wp_enqueue_style('google-custom-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
    wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('university_main_styles', get_theme_file_uri('/build/style-index.css'));
    wp_enqueue_style('university_extra_styles', get_theme_file_uri('/build/index.css'));
}

add_filter('login_headertitle', 'ourLoginTitle');

function ourLoginTitle(){

    return get_bloginfo('name');
}

//Force note posts to be private (extra layer of security beyond js api)
add_filter('wp_insert_post_data', 'makeNotePrivate', 10, 2);//10 reps the priority , 2 reps the parameter to give the function to give/access the $postarr data

function makeNotePrivate($data, $postarr){

    if($data['post_type']=='note'){

        if (count_user_posts(get_current_user_id(), 'note') > 4 AND !$postarr['ID'] ){ //also check postarr data for ID, long clever way so user is able to delete post even if reaches their post limit

            die('You have reached your note limit'); //exit out function


        }

        $data['post_content'] = sanitize_textarea_field($data['post_content']); //extra security trip any html elements
        $data['post_title'] = sanitize_text_field($data['post_title']); //extra security trip any html elements
    }

    if($data['post_type']=='note' AND $data['post_status'] !='trash'){

    $data['post_status'] = 'private';
  }
    return  $data;
}