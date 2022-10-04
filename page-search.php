<?php
get_header();

while(have_posts()){

    the_post();
    pageBanner(array(
        'title' => 'Search',
    ));
    ?>

    <div class="container container--narrow page-section">
        <?php
        $TheParent=wp_get_post_parent_id(get_the_ID());
        if($TheParent){ ?>
            <div class="metabox metabox--position-up metabox--with-home-link">
                <p>
                    <a class="metabox__blog-home-link" href="<?php echo get_permalink($TheParent); ?>"><i class="fa fa-home" aria-hidden="true"></i> Back to <?php echo get_the_title($TheParent); ?></a> <span class="metabox__main"><?php the_title(); ?></span>
                </p>
            </div>
        <?php } ?>

        <?php
        $testArray = get_pages(array(
            'child_of' => get_the_ID()
        ));
        If($TheParent or $testArray){
            ?>
            <div class="page-links">
                <h2 class="page-links__title"><a href="<?php echo get_permalink($TheParent); ?>"><?php echo get_the_title($TheParent); ?></a></h2>
                <ul class="min-list">
                    <?php
                    if($TheParent){

                        $findChildrenOf = $TheParent;
                    } else{

                        $findChildrenOf = get_the_ID();
                    }

                    wp_list_pages(array(
                        'title_li' => NULL,
                        'child_of' => $findChildrenOf,
                        'sort_column' => 'menu_order'
                    ))
                    ?>
                </ul>
            </div>
        <?php } ?>
        <div class="generic-content">
          <?php   get_search_form(); //will look in searchform.php ?>
        </div>
    </div>

<?php }

get_footer();
?>