const wishlist = {
    clear() {
        this.element.querySelectorAll('li').forEach((li) => {
        this.element.removeChild(li);
        });
    },
    items : [],
    element: document.querySelector('#wishlist'),
    contains(id) {
        return this.items.some((item) => item.data.id === id);
    },
    add(item) {
        this.items.push(item);
        const li = document.createElement('li');
        li.textContent = item.name;
        this.element.appendChild(li);
    },
    render() {
        this.clear();
        this.items.forEach((item) => this.add(item));
    },
    remove(id){
        this.items = this.items.filter((item) => item.id !== id);
        this.render();
    }
};
  
document.querySelectorAll('.add-to-whislist').forEach((e) => {
    e.addEventListener('click', (ev) => {
        const element = ev.target;
        wishlist.add({
        id: element.dataset.id,
        name: element.dataset.name
        });
    })
});
