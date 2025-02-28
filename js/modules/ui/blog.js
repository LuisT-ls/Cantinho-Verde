// ./js/modules/ui/blog.js

export const initBlog = () => {
  const blogContainer = document.querySelector('.blog-posts')
  const categoryButtons = document.querySelectorAll('.btn-group .btn')
  const categorySelect = document.querySelector('.form-select')
  const pagination = document.querySelector('.pagination')
  const searchInput = document.querySelector('.form-control')
  const searchButton = document.querySelector('.btn-outline-success')

  // Configurações de paginação
  const postsPerPage = 3 // Número de posts por página
  let currentPage = 1
  let filteredPosts = [] // Posts filtrados por categoria ou pesquisa
  let allPosts = [] // Todos os posts carregados do JSON

  // Carrega os posts do JSON
  const loadPosts = async () => {
    try {
      const response = await fetch('../assets/data/blogs.json')
      allPosts = await response.json()
      filteredPosts = allPosts // Inicialmente, todos os posts estão visíveis
      renderPosts()
      updateCategoryCounts()
      updatePagination()
    } catch (error) {
      console.error('Erro ao carregar os posts:', error)
    }
  }

  // Renderiza os posts na tela
  const renderPosts = () => {
    const start = (currentPage - 1) * postsPerPage
    const end = start + postsPerPage
    const postsToShow = filteredPosts.slice(start, end)

    console.log('Posts a serem exibidos:', postsToShow)

    blogContainer.innerHTML = postsToShow
      .map(
        post => `
        <article class="blog-post card mb-4">
          <div class="card-body">
            <h2 class="blog-post-title">${post.title}</h2>
            <p class="blog-post-meta text-muted">
              ${post.date} por <a href="#">${post.author}</a> |
              <span class="badge bg-success">${post.category}</span>
            </p>
            <div class="row">
              <div class="col-md-4 mb-3 mb-md-0">
                <img src="${post.image}" alt="${post.title}" class="img-fluid rounded" />
              </div>
              <div class="col-md-8">
                <p>${post.content}</p>
                <a href="#" class="btn btn-primary">Leia mais</a>
              </div>
            </div>
          </div>
        </article>
      `
      )
      .join('')
  }

  // Filtra os posts por categoria
  const normalizeCategory = category => {
    return category
      .trim()
      .toLowerCase()
      .normalize('NFD') // Remove acentos
      .replace(/[\u0300-\u036f]/g, '') // Remove caracteres especiais
  }

  const filterPostsByCategory = category => {
    const normalizedCategory = normalizeCategory(category)
    console.log('Categoria selecionada:', normalizedCategory)

    if (normalizedCategory === 'todas') {
      filteredPosts = allPosts
    } else {
      filteredPosts = allPosts.filter(post => {
        const postCategory = normalizeCategory(post.category)
        console.log(
          'Categoria do post:',
          postCategory,
          'Comparando com:',
          normalizedCategory
        )
        return postCategory === normalizedCategory
      })
    }

    console.log('Posts filtrados:', filteredPosts)
    currentPage = 1
    renderPosts()
    updatePagination()
  }

  // Atualiza a contagem de posts por categoria
  const updateCategoryCounts = () => {
    const counts = {
      suculentas: allPosts.filter(
        post => normalizeCategory(post.category) === 'suculentas'
      ).length,
      orquideas: allPosts.filter(
        post => normalizeCategory(post.category) === 'orquideas'
      ).length,
      ornamentais: allPosts.filter(
        post => normalizeCategory(post.category) === 'ornamentais'
      ).length,
      adubacao: allPosts.filter(
        post => normalizeCategory(post.category) === 'adubacao'
      ).length
    }

    // Atualiza os contadores na sidebar
    document.querySelectorAll('.list-group-item .badge').forEach(badge => {
      const category = normalizeCategory(
        badge.previousElementSibling.textContent
      )
      badge.textContent = counts[category] || 0
    })
  }

  // Seleciona todos os links de categoria na sidebar
  const categoryLinks = document.querySelectorAll('.category-link')

  // Adiciona event listeners aos links de categoria
  categoryLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault() // Evita o comportamento padrão do link
      const selectedCategory = link.getAttribute('data-category') // Obtém a categoria selecionada
      filterPostsByCategory(selectedCategory) // Filtra os posts pela categoria selecionada
    })
  })

  // Atualiza a paginação
  const updatePagination = () => {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
    const paginationList = pagination.querySelector('ul')
    const previousButton = paginationList.querySelector(
      '.page-item:first-child'
    )
    const nextButton = paginationList.querySelector('.page-item:last-child')

    // Limpa as páginas existentes (exceto os botões "Anterior" e "Próxima")
    const existingPages = paginationList.querySelectorAll(
      '.page-item:not(:first-child):not(:last-child)'
    )
    existingPages.forEach(page => page.remove())

    // Adiciona as páginas dinamicamente
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement('li')
      pageItem.classList.add('page-item')
      if (i === currentPage) {
        pageItem.classList.add('active')
      }

      const pageLink = document.createElement('a')
      pageLink.classList.add('page-link')
      pageLink.href = '#'
      pageLink.textContent = i

      pageItem.appendChild(pageLink)
      paginationList.insertBefore(pageItem, nextButton)
    }

    // Atualiza o estado dos botões "Anterior" e "Próxima"
    previousButton.classList.toggle('disabled', currentPage === 1)
    nextButton.classList.toggle('disabled', currentPage === totalPages)
  }

  // Event listeners para botões de categoria (desktop)
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove a classe 'active' de todos os botões
      categoryButtons.forEach(btn => btn.classList.remove('active'))
      // Adiciona a classe 'active' ao botão clicado
      button.classList.add('active')
      // Obtém a categoria do botão clicado
      const selectedCategory = button.getAttribute('data-category')
      // Filtra os posts pela categoria selecionada
      filterPostsByCategory(selectedCategory)
    })
  })

  // Event listener para select de categoria (mobile)
  categorySelect.addEventListener('change', e => {
    const selectedCategory = e.target.value
    filterPostsByCategory(selectedCategory)
  })

  // Event listener para pesquisa
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase()
    filteredPosts = allPosts.filter(
      post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
    )
    currentPage = 1 // Resetar para a primeira página após pesquisar
    renderPosts()
    updatePagination()
  })

  // Event listener para paginação
  document.addEventListener('DOMContentLoaded', () => {
    const pagination = document.querySelector('.pagination')

    if (!pagination) {
      console.error('Elemento .pagination não encontrado no DOM.')
      return
    }

    // Event listener para paginação
    pagination.addEventListener('click', e => {
      e.preventDefault()

      // Verifica se o clique foi em um link de paginação
      const pageLink = e.target.closest('.page-link')
      if (!pageLink) return // Ignora cliques fora dos links de paginação

      const pageText = pageLink.textContent.toLowerCase()

      // Lógica de navegação
      if (pageText === 'anterior' && currentPage > 1) {
        currentPage--
      } else if (
        pageText === 'próxima' &&
        currentPage < Math.ceil(filteredPosts.length / postsPerPage)
      ) {
        currentPage++
      } else if (!isNaN(pageText)) {
        const pageNumber = parseInt(pageText)
        if (
          pageNumber >= 1 &&
          pageNumber <= Math.ceil(filteredPosts.length / postsPerPage)
        ) {
          currentPage = pageNumber
        }
      }

      // Atualiza a interface
      renderPosts()
      updatePagination()
    })
  })

  // Inicializa o blog
  loadPosts()
}
