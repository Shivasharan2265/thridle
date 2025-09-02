import React from 'react'

const BlogLeftCol = () => {
  return (
    <div>
       <div id="mobile_top_menu_wrapper" class="hidden-lg-up" style={{display:"none"}}>
        <div id="top_menu_closer">
          <i class="material-icons"></i>
        </div>
        <div class="js-top-menu mobile" id="_mobile_top_menu"></div>
      </div>

      <div class="breadcrumb-container">
        <nav data-depth="2" class="breadcrumb container">
          <h1 class="h1 category-title breadcrumb-title">Blog</h1>
          <ul>
            <li>
              <a href="#">
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span>Blog Article</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

       <section id="wrapper">
        <div class="container">
          <div class="row">    
            <div id="_desktop_left_column" class="col-xs-12 col-sm-12 col-md-12 col-lg-3">
              <div id="left-column">
                <section class="blog-category">
                  <h3 class="h1 products-section-title block-title hidden-md-down">Top viewed</h3>
                  <div class="block-title clearfix  hidden-lg-up collapsed" data-target="#blogarticle-container" data-toggle="collapse">
                    <span class="products-section-title">Top viewed</span>
                    <span class="navbar-toggler collapse-icons">
                      <i class="material-icons add">&#xE313;</i>
                      <i class="material-icons remove">&#xE316;</i>
                    </span>
                  </div>
                  <div id="blogarticle-container" class="collapse data-toggler">
                    <div class="description clearfix">
                      <div class="blog-artical">
                        <a href="#" title="Upon of seasons earth dominion">
                          <img alt="Upon of seasons earth dominion" src="assets/images/blog/1.jpg"/>
                        </a>
                      </div>
                      <div class="blog-desc">
                        <p class='sdstitle_block'><a title="Upon of seasons earth dominion" href="#">Upon of seasons earth dominion</a></p>
                        <div class="smart-desc">
                          <div class="meta-likes">
                            <a href="#" class="touchsize-likes"><i class="fa fa-heart"></i><span> 6</span></a>
                          </div>
                          <div class="meta-date">
                            <span>August 16, 2018</span>
                          </div>                          
                        </div>
                      </div>
                    </div>
                    <div class="description clearfix">
                      <div class="blog-artical">
                        <a href="#" title="Upon of seasons earth dominion">
                          <img alt="Upon of seasons earth dominion" src="assets/images/blog/2.jpg"/>
                        </a>
                      </div>
                      <div class="blog-desc">
                        <p class='sdstitle_block'><a title="Upon of seasons earth dominion" href="#">Christmas Sale is here 7</a></p>
                        <div class="smart-desc">
                          <div class="meta-likes">
                            <a href="#" class="touchsize-likes"><i class="fa fa-heart"></i><span> 10</span></a>
                          </div>
                          <div class="meta-date">
                            <span>August 16, 2018</span>
                          </div>                          
                        </div>
                      </div>
                    </div>
                    <div class="description clearfix">
                      <div class="blog-artical">
                        <a href="#" title="Upon of seasons earth dominion">
                          <img alt="Upon of seasons earth dominion" src="assets/images/blog/4.jpg"/>
                        </a>
                      </div>
                      <div class="blog-desc">
                        <p class='sdstitle_block'><a title="Upon of seasons earth dominion" href="#">Viderer voluptatum te eum</a></p>
                        <div class="smart-desc">
                          <div class="meta-likes">
                            <a href="#" class="touchsize-likes"><i class="fa fa-heart"></i><span> 12</span></a>
                          </div>
                          <div class="meta-date">
                            <span>August 16, 2018</span>
                          </div>                          
                        </div>
                      </div>
                    </div>
                    <div class="description clearfix">
                      <div class="blog-artical">
                        <a href="#" title="Upon of seasons earth dominion">
                          <img alt="Upon of seasons earth dominion" src="assets/images/blog/8.jpg"/>
                        </a>
                      </div>
                      <div class="blog-desc">
                        <p class='sdstitle_block'><a title="Upon of seasons earth dominion" href="#">Lorem ipsum dolor sit amet</a></p>
                        <div class="smart-desc">
                          <div class="meta-likes">
                            <a href="#" class="touchsize-likes"><i class="fa fa-heart"></i><span> 8</span></a>
                          </div>
                          <div class="meta-date">
                            <span>August 16, 2018</span>
                          </div>                          
                        </div>
                      </div>
                    </div>
                    <div class="description clearfix">
                      <div class="blog-artical">
                        <a href="#" title="Upon of seasons earth dominion">
                          <img alt="Upon of seasons earth dominion" src="assets/images/blog/6.jpg"/>
                        </a>
                      </div>
                      <div class="blog-desc">
                        <p class='sdstitle_block'><a title="Upon of seasons earth dominion" href="#">Scelerisque vestibulum urna</a></p>
                        <div class="smart-desc">
                          <div class="meta-likes">
                            <a href="#" class="touchsize-likes"><i class="fa fa-heart"></i><span> 4</span></a>
                          </div>
                          <div class="meta-date">
                            <span>August 16, 2018</span>
                          </div>                          
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <div id="ishileftbanners" class="clearfix">
                  <div id="ishileftbanners_1" class="ishileftbanners-container">
                    <div class="image-container">
                      <a class="ishi-customhover-fadeinflip" href="#">  
                        <img src="assets/images/leftbanner.jpg" alt="leftbanner1"/>
                      </a>
                    </div>
                  </div>
                </div>
                <section class="popular-blog clearfix mt-3"> 
                  <h3 class="h1 block-title hidden-md-down">Popular Tag</h3>
                  <div class="block-title clearfix  hidden-lg-up collapsed" data-target="#tag-container" data-toggle="collapse">
                    <span class="products-section-title">Popular Tag</span>
                    <span class="navbar-toggler collapse-icons">
                      <i class="material-icons add">&#xE313;</i>
                      <i class="material-icons remove">&#xE316;</i>
                    </span>
                  </div>
                  <div id="tag-container" class="collapse data-toggler">
                    <ul>
                      <li><a href="#">Home</a></li>
                      <li><a href="#">Top</a></li>
                      <li><a href="#">Blouses</a></li>
                      <li><a href="#">Dress</a></li>
                      <li><a href="#">Outfits</a></li>
                      <li><a href="#">Accessories</a></li>
                      <li><a href="#">Blog</a></li>
                    </ul>
                  </div>
                </section>
              </div>
            </div>                    
            <div id="content-wrapper" class="col-xs-12 col-sm-12 col-md-12 col-lg-9"> 
              <div id="smartblogcat" class="block">
                <div class="sdsarticleCat clearfix row">
                  <div class="articleContent col-xl-6 col-lg-6 col-md-12">
                    <a href="#" title="Upon of seasons earth dominion">
                      <img alt="Upon of seasons earth dominion" src="assets/images/blog/1.jpg"/>
                    </a>
                  </div>
                  <div class="smartblog-desc col-xl-6 col-lg-6 col-md-12">
                    &nbsp;
                    <span class="author"><i class="fa fa-user"></i>&nbsp;&nbsp;Posted by: Admin Admin</span>&nbsp;&nbsp;
                    <div class="sdsarticleHeader">
                      <p class='sdstitle_block'><a title="Upon of seasons earth dominion" href="#">Upon of seasons earth dominion</a></p>
                    </div>
                    <span class="blogdetail">       
                      <span class="articleSection"><a href="#"><i class="fa fa-tags"></i>&nbsp;&nbsp;Uncategories</a></span>&nbsp;&nbsp;
                      <span class="blogcomment"><a title="0 Comments" href="#"><i class="fa fa-comments"></i>&nbsp;&nbsp;0  Comments</a></span>
                      &nbsp;
                      <span class="viewed"><i class="fa fa-eye"></i>&nbsp;&nbsp; views (0)</span>
                    </span>
                    <div class="sdsarticle-des">
                      <div class="clearfix">
                        <div class="lipsum">
                          Nascetur ridiculus mus upon of seasons earth dominion. Gathering brought light, creeping there saying. The lesser appear without very darkness seasons saw be. Dry cattle. Man very third.
                        </div>
                      </div>
                    </div>
                    <div class="sdsreadMore">
                      <span class="more">
                        <a title="Upon of seasons earth dominion" href="#" class="r_more btn-primary">Read more</a>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="sdsarticleCat clearfix row">
                  <div class="articleContent col-xl-6 col-lg-6 col-md-12">
                    <a href="#" title="Christmas Sale is here 7" class="imageFeaturedLink">
                      <img  alt="Christmas Sale is here 7" src="assets/images/blog/2.jpg" class="imageFeatured"/>
                    </a>
                  </div>
                  <div class="smartblog-desc col-xl-6 col-lg-6 col-md-12">
                    &nbsp;
                    <span class="author"><i class="fa fa-user"></i>&nbsp;&nbsp;Posted by: Admin Admin</span>&nbsp;&nbsp;
                    <div class="sdsarticleHeader">
                      <p class='sdstitle_block'><a title="Christmas Sale is here 7" href="#">Christmas Sale is here 7</a></p>
                    </div>
                    <span class="blogdetail">       
                      <span class="articleSection" itemprop="articleSection"><a href="#"><i class="fa fa-tags"></i>&nbsp;&nbsp;Uncategories</a></span>&nbsp;&nbsp;
                      <span class="blogcomment"><a title="0 Comments" href="#"><i class="fa fa-comments"></i>&nbsp;&nbsp;0 Comments</a></span>
                      &nbsp;
                      <span class="viewed"><i class="fa fa-eye"></i>&nbsp;&nbsp; views (0)</span>
                    </span>
                    <div class="sdsarticle-des">
                      <div class="clearfix">
                        <div class="lipsum">
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type an
                        </div>
                      </div>
                    </div>
                    <div class="sdsreadMore">
                      <span class="more">
                        <a title="Christmas Sale is here 7" href="#" class="r_more btn-primary">Read more</a>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="sdsarticleCat clearfix row">
                  <div class="articleContent col-xl-6 col-lg-6 col-md-12">
                    <a href="#" title="Nostro expetenda voluptatum sit ex" class="imageFeaturedLink">
                      <img  alt="Nostro expetenda voluptatum sit ex" src="assets/images/blog/3.jpg" class="imageFeatured"/>
                    </a>
                  </div>
                  <div class="smartblog-desc col-xl-6 col-lg-6 col-md-12">
                    &nbsp;
                    <span class="author"><i class="fa fa-user"></i>&nbsp;&nbsp;Posted by: Admin Admin</span>&nbsp;&nbsp;
                    <div class="sdsarticleHeader">
                      <p class='sdstitle_block'><a title="Nostro expetenda voluptatum sit ex" href="#">Nostro expetenda voluptatum sit ex</a></p>
                    </div>
                    <span class="blogdetail">       
                      <span class="articleSection"><a href="#"><i class="fa fa-tags"></i>&nbsp;&nbsp;Uncategories</a></span>&nbsp;&nbsp;
                      <span class="blogcomment"><a title="0 Comments" href="#"><i class="fa fa-comments"></i>&nbsp;&nbsp;0  Comments</a></span>
                      &nbsp;
                      <span class="viewed"><i class="fa fa-eye"></i>&nbsp;&nbsp; views (0)</span>
                    </span>
                    <div class="sdsarticle-des">
                      <div class="clearfix">
                        <div class="lipsum">
                          Doctus omittam intellegam duo in. Ius ne sint dicit accusamus, cu pri solum decore corpora. Mei melius audire ex. Nostrum ocurreret cum at. Ut apeirian invenire eleifend eos, mei velit vituperata at.
                        </div>
                      </div>
                    </div>
                    <div class="sdsreadMore">
                      <span class="more">
                        <a title="Nostro expetenda voluptatum sit ex" href="#" class="r_more btn-primary">Read more</a>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="sdsarticleCat clearfix row">
                  <div class="articleContent col-xl-6 col-lg-6 col-md-12">
                    <a href="#" title="Viderer voluptatum te eum" class="imageFeaturedLink">
                      <img  alt="Viderer voluptatum te eum" src="assets/images/blog/4.jpg" class="imageFeatured"/>
                    </a>
                  </div>
                  <div class="smartblog-desc col-xl-6 col-lg-6 col-md-12">
                    &nbsp;
                    <span class="author"><i class="fa fa-user"></i>&nbsp;&nbsp;Posted by: Admin Admin</span>&nbsp;&nbsp;
                    <div class="sdsarticleHeader">
                      <p class='sdstitle_block'><a title="Viderer voluptatum te eum" href="#">Viderer voluptatum te eum</a></p>
                    </div>
                    <span class="blogdetail">       
                      <span class="articleSection"><a href="#"><i class="fa fa-tags"></i>&nbsp;&nbsp;Uncategories</a></span>&nbsp;&nbsp;
                      <span class="blogcomment"><a title="0 Comments" href="#"><i class="fa fa-comments"></i>&nbsp;&nbsp;0  Comments</a></span>
                      &nbsp;
                      <span class="viewed"><i class="fa fa-eye"></i>&nbsp;&nbsp; views (0)</span>
                    </span>
                    <div class="sdsarticle-des">
                      <div class="clearfix">
                        <div class="lipsum">
                          Ei has mutat solum. Fugit atomorum efficiantur an vim, te mea diceret democritum referrentur, et altera aliquid mea. Sed illud dictas placerat ex, vel ea nihil recusabo consectetuer. Est et utamur sim
                        </div>
                      </div>
                    </div>
                    <div class="sdsreadMore">
                      <span class="more">
                        <a title="Viderer voluptatum te eum" href="#" class="r_more btn-primary">Read more</a>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="sdsarticleCat clearfix row">
                  <div class="articleContent col-xl-6 col-lg-6 col-md-12">
                    <a href="#" title="Nec intellegat deseruisse te" class="imageFeaturedLink">
                      <img  alt="Nec intellegat deseruisse te" src="assets/images/blog/5.jpg" class="imageFeatured"/>
                    </a>
                  </div>
                  <div class="smartblog-desc col-xl-6 col-lg-6 col-md-12">
                    &nbsp;
                    <span class="author"><i class="fa fa-user"></i>&nbsp;&nbsp;Posted by: Admin Admin</span>&nbsp;&nbsp;
                    <div class="sdsarticleHeader">
                      <p class='sdstitle_block'><a title="Nec intellegat deseruisse te" href="#">Nec intellegat deseruisse te</a></p>
                    </div>
                    <span class="blogdetail">       
                      <span class="articleSection"><a href="#"><i class="fa fa-tags"></i>&nbsp;&nbsp;Uncategories</a></span>&nbsp;&nbsp;
                      <span class="blogcomment"><a title="0 Comments" href="#"><i class="fa fa-comments"></i>&nbsp;&nbsp;0  Comments</a></span>
                      &nbsp;
                      <span class="viewed"><i class="fa fa-eye"></i>&nbsp;&nbsp; views (1)</span>
                    </span>
                    <div class="sdsarticle-des">
                      <div class="clearfix">
                        <div class="lipsum">
                          Mea stet putent sadipscing an. Per prima equidem cu, sit cu ullum democritum, tibique tacimates no usu. Falli audire ad vis, sea quando civibus placerat in. Cu utamur tritani argumentum pro, sed ne no
                        </div>
                      </div>
                    </div>
                    <div class="sdsreadMore">
                      <span class="more">
                        <a title="Nec intellegat deseruisse te" href="#" class="r_more btn-primary">Read more</a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="blog_pagination">
                <div class="pagination">
                  <div class="col-xl-4 col-lg-5 col-md-5 col-xs-12 pagination-desc">Showing 1 to 5 of 8 (1 Pages)</div>
                  <div class="col-xl-8 col-lg-7 col-md-7 col-xs-12 pagination-right">
                    <ul class="page-list clearfix">        
                      <li>
                        <a rel="prev" href="#" class="previous">
                          <i class="material-icons"></i><span class="pagination-lbl">Previous</span>
                        </a>
                      </li>                
                      <li class="current">
                        <a rel="nofollow" href="#" class="disabled js-search-link">1</a>
                      </li>                
                      <li>
                        <a rel="nofollow" href="#" class="js-search-link">2</a>
                      </li>                
                      <li>
                        <a rel="next" href="#" class="next js-search-link">
                          <span class="pagination-lbl">Next</span><i class="material-icons"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>          
          </div>
        </div>        
      </section>

  <div class="container">
        <div id="_mobile_left_column"></div>
        <div id="_mobile_right_column"></div>
        <div class="clearfix"></div>
      </div>

    </div>
  )
}

export default BlogLeftCol
