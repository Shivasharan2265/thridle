import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
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
          <h1 class="h1 category-title breadcrumb-title">404</h1>
          <ul>
            <li>
              <a href="#">
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span>404 Not Found</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <section class="error_page">
        <h1 class="title"><span>!</span>404</h1>
        <p class="error-text">The page you requested does not exist.</p>
        <Link class="btn btn-primary" to="/">
          <i class="material-icons">chevron_left</i>Continue shopping
        </Link>
      </section>
    </div>
  )
}

export default ErrorPage
