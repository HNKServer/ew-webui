export class navigation {
    constructor(container, handleChange) {
        this.query = container;
        this.container = document.querySelector(container);
        this.handlePageChange = handleChange;
    }
    createPagination(totalPages) {
        this.container.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.dataset.page = i;
            button.textContent = i;
            button.addEventListener("click", () => {
                this.handlePageChange(i);
                this.setActiveButton(i);
            });
            this.container.appendChild(button);
        }
    }
    clearPagination() {
        this.container.innerHTML = "";
    }
    setActiveButton(page) {
        if (isNaN(page)) return;
        const buttons = document.querySelectorAll(`${this.query} button`);
        buttons.forEach(button => button.classList.remove("active"));

        const activeButton = document.querySelector(`${this.query} button[data-page="${page}"]`);
        if (activeButton) {
            activeButton.classList.add("active");
        }
    }
}
