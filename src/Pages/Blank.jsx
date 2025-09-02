import React from 'react'

const Blank = () => {
  return (
    <div>
              <section class="error_page">
        <h1 class="title"><span>!</span>404</h1>
        <p class="error-text">The page you requested does not exist.</p>
        <a class="btn btn-primary" style={{backgroundColor:"#48B7FF", border:"none"}} href="/">
          <i class="material-icons">chevron_left</i>Continue shopping
        </a>
      </section>
    </div>
  )
}

export default Blank