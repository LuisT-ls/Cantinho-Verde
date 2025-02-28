/**
 * Cantinho Verde - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize components
  initNavbar()
  initAnimations()
  initServiceWorker()
})

/**
 * Initialize Navbar functionality
 */
function initNavbar() {
  const header = document.querySelector('.header')
  const navbarToggler = document.querySelector('.navbar-toggler')
  const navbarNav = document.querySelector('#navbarNav')

  // Navbar scroll effect
  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      header.classList.add('scrolled')
    } else {
      header.classList.remove('scrolled')
    }
  })

  // Close navbar when clicking outside
  document.addEventListener('click', function (event) {
    const isNavbarOpen = navbarNav.classList.contains('show')
    const isClickInsideNavbar = navbarNav.contains(event.target)
    const isClickOnToggler = navbarToggler.contains(event.target)

    if (isNavbarOpen && !isClickInsideNavbar && !isClickOnToggler) {
      new bootstrap.Collapse(navbarNav).hide()
    }
  })

  // Add active class to current page link
  const currentLocation = location.pathname
  const navLinks = document.querySelectorAll('.nav-link')

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentLocation) {
      link.classList.add('active')
    }
  })
}

/**
 * Initialize animations
 */
function initAnimations() {
  // Simple animation for blog posts
  const blogPosts = document.querySelectorAll('.blog-post')

  // Create intersection observer for animations
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1
    }
  )

  // Observe blog posts
  blogPosts.forEach((post, index) => {
    post.style.opacity = '0'
    setTimeout(() => {
      observer.observe(post)
    }, index * 100)
  })

  // Sidebar animation
  const sidebarItems = document.querySelectorAll('.sidebar .card')
  sidebarItems.forEach((item, index) => {
    item.style.opacity = '0'
    setTimeout(() => {
      item.classList.add('slide-up')
      item.style.opacity = '1'
    }, 300 + index * 200)
  })
}

/**
 * Initialize Service Worker
 */
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').then(
        function (registration) {
          console.log(
            'ServiceWorker registration successful with scope: ',
            registration.scope
          )
        },
        function (err) {
          console.log('ServiceWorker registration failed: ', err)
        }
      )
    })
  }
}
