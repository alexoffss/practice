import {Component} from '../core/component'
import {apiService} from "../services/api.service"
import {TransformService} from "../services/transform.service";

export class PostsComponent extends Component {
    constructor(id, {loader}) {
        super(id) ;
        this.loader = loader
    }

    init() {
        this.$el.addEventListener('click', buttonHandler.bind(this))
    }

    async onShow(){
        this.loader.show()
        const data = await apiService.fetchPosts()
        const posts = TransformService.fbObjectToArray(data)
        const html = posts.map(post => renderPost(post)).join(' ')
        this.loader.hide()
        this.$el.insertAdjacentHTML('afterbegin', html)
    }

    onHide() {
        this.$el.innerHTML = ''
    }
}

function renderPost(post){
    const tag = post.type === 'news'
        ? '<li class="tag tag-blue tag-rounded">Новость</li>'
        : '<li class="tag tag-red tag-rounded">Акция</li>'

    const button = (JSON.parse(localStorage.getItem('favorites')) || []).includes(post.id)
        ? `<button class="button-round button-small button-danger" data-id="${post.id}">Удалить</button>`
        : `<button class="button-round button-small button-primary" data-id="${post.id}">Сохранить</button>`

    return `
        <div class="panel">
            <div class="panel-head">
                <p class="panel-title">${post.title}</p>
                <ul class="tags">
                    ${tag}
                </ul>
            </div>
            <div class="panel-body">
                <p class="multi-line">${post.fulltext}</p>
            </div>
            <div class="panel-footer w-panel-footer">
                <small>${post.date}</small>
                ${button}
            </div>
        </div>
    `
}

function buttonHandler(event){
    const $el = event.target
    const id = $el.dataset.id

    if(id){
        let favorites = JSON.parse(localStorage.getItem('favorites')) || []

        if(favorites.includes(id)){
            $el.textContent = 'Сохранить'
            $el.classList.add('button-primary')
            $el.classList.remove('button-danger')
            favorites = favorites.filter(fId => fId !== id)
        } else {
            $el.textContent = 'Удалить'
            $el.classList.remove('button-primary')
            $el.classList.add('button-danger')
            favorites.push(id)
        }

        localStorage.setItem('favorites', JSON.stringify(favorites))
    }
}
