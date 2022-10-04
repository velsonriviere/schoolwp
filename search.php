<?php
get_header();
pageBanner(array(
    'title' => 'Search Results',
    'subtitle' => 'You searched for &ldquo;'.esc_html(get_search_query('false')).'&rdquo;' // extra security, udemy ch 17 lec 84 for more elaboration
));
?>



    <div class="container container--narrow page-section">
        <?php

        if(have_posts()) {

            while(have_posts()) {
                the_post();
                get_template_part('template-parts/content', get_post_type()); //will get content from:  i.e template-parts/content-professor and/or template-parts/content-program
            }

            ?>

        <?php

        echo paginate_links();

        }else{
            echo '<h2 class="headline headline--small-plus">No match found</h2>';}

        get_search_form(); //will look in searchform.php
        ?>



    </div>
<?php
get_footer();

?>