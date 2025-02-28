// ./js/modules/ui/search.js

export const initSearch = () => {
  const searchInput = document.querySelector('.form-control')
  const searchButton = document.querySelector('.btn-outline-success')

  searchButton.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase()
    const blogPosts = document.querySelectorAll('.blog-post')

    blogPosts.forEach(post => {
      const title = post
        .querySelector('.blog-post-title')
        .textContent.toLowerCase()
      const content = post.querySelector('p').textContent.toLowerCase()

      if (title.includes(query) || content.includes(query)) {
        post.style.display = 'block'
      } else {
        post.style.display = 'none'
      }
    })
  })
}
