<?php
get_header();
pageBanner(array(
    'title' => 'Past Events',
    'subtitle' => 'A recap of our past events'
));
?>



    <div class="container container--narrow page-section">

        <?php
        $today =date('Ymd');
        $pastEvents = new WP_Query(array(
                'paged' => get_query_var('paged',1), //essential for custom query pagination
                'post_type' => 'event',
                'meta_key' => 'event_date',// what to look for in custom field
                'orderby'  => 'meta_value_num', //meta_value is another you can use
                'order' => 'ASC', //sort event day from upcoming to latest
                'meta_query' => array( //a deeper filter i.e inorder filter upcoming dates but do not get dates that passed
                    array(
                        'key' => 'event_date',
                        'compare' => '<', //greater than or equal to
                        'value' => $today,
                        'type' => 'numeric' // optional but helps wordpress filter even better knowing what its comparing


                    )
                )
            )

        );

        while($pastEvents->have_posts()){
            $pastEvents->the_post();
            get_template_part('template-parts/content-event');
        }

        echo paginate_links(array(
                'total' => $pastEvents->max_num_pages //clarified when using custom query
        ));
        ?>



    </div>
<?php
get_footer();

?>