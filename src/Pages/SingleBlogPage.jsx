import React from 'react'

const SingleBlogPage = () => {
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
              <a href="index.html">
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span>Blog Post</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

       <section id="wrapper">
        <div class="container">
          <div class="row">          
            <div id="content-wrapper" class="left-column col-xs-12 col-sm-12 col-md-12 col-lg-9"> 
              <div id="content" class="block">
                <div id="sdsblogArticle" class="blog-post">
                    <div class="articleBody">
                        <div id="lipsum" class="articleContent">
                          <div class="single-blogpost-img">
                            <a id="post_images" href="javascript:void(0)">
                                <img src="assets/images/blog/blogpost-1.jpg" alt="Nostro expetenda"/>
                            </a>
                          </div>
                            <div class="page-item-title">
                              <p class="h3">Toy</p>
                                <h2>Nostro expetenda </h2>
                            </div>
                            <ul class="post-info">
                              <li> 
                               <time datetime="2018-09-10">september 10 , 2018</time>
                              </li>
                              <li>
                                <a href="#">
                                  <i class="fa fa-user"></i>
                                  by Ishi Themes
                                </a>
                              </li>
                              <li>
                                <i class="fa fa-comment"></i>2 
                              </li>
                              <li>
                                <a href="#">
                                  <i class="fa fa-bookmark"></i>Toy 
                                </a>
                              </li>
                           </ul>
                            <div class="sdsarticle-des">
                              <p>
                                Doctus omittam intellegam duo in. Ius ne sint dicit accusamus, cu pri solum decore corpora. Mei melius audire ex. Nostrum ocurreret cum at. Ut apeirian invenire eleifend eos, mei velit vituperata at.
                              </p>
                              <p class="h4">
                                «Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna»
                              </p>
                              <div class="small-desc">
                                <p>
                                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                                </p>
                              </div>
                            </div>
                        </div> 
                        <div class="sdsarticleBottom">   
                          <div class="smartblogcomments">
                            <p class="h2">comments</p>
                            <ul class="comment-list">
                              <li>
                                <div class="comment-content">
                                  <div class="avatar"><img src="assets/images/avatar.jpg" alt="avatar"/></div>
                                  <div class="comment-text">
                                    <time datetime="2018-05-24">May 24.2018</time>
                                    <p class="h3">alexander</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure</p>
                                  </div>
                                </div>
                              </li>
                            </ul>
                            <div id="smartblogcomments">
                              <form action="#" class="commentform">
                                <p class="h2">add a comment</p>
                                <textarea name="comment" placeholder="Your comment" required="" class="form-control inputContent"></textarea>
                                <input placeholder="Name" required="" type="text" class="form-control"/>
                                <input placeholder="E-mail" required="" type="email" class="form-control"/>
                                <button type="submit" class="btn btn-primary">comment</button>
                              </form>
                            </div>
                          </div>
                        </div>  
                    </div>
                </div>
              </div>
            </div> 
            <div id="_desktop_right_column" class="col-xs-12 col-sm-12 col-md-12 col-lg-3">
              <div id="right-column">
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
          </div>
        </div>        
      </section>
    </div>
  )
}

export default SingleBlogPage
