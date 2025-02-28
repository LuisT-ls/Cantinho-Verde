// ./js/modules/ui/routing.js

export const initRouting = () => {
  const navLinks = document.querySelectorAll('.nav-link')
  const blogLinks = document.querySelectorAll('.blog-post a')

  // Navegação entre páginas
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()
      const path = link.getAttribute('href')
      window.location.href = path
    })
  })

  // Navegação para posts do blog
  blogLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()
      const postId = link.getAttribute('href')
      // Implementar lógica para carregar o post específico
      console.log('Carregar post:', postId)
    })
  })
}
