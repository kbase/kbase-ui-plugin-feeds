export default class GlobalFeed {
    constructor(refreshFn) {
        this.refreshFn = refreshFn;
        this.element = document.createElement('div');
        this.element.classList.add('card');
        this.element.innerHTML = `
            <div class="card-header">Global notifications</div>
            <div class="card-body"></div>
        `;
    }

    remove() {
        this.element.querySelector('.card-body').innerHTML = '';
    }
}