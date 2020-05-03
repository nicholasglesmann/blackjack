export default class Animate {
    static modalDisplayLength = 1500;
    static isModalShown = false;

    static showModal() {
        document.getElementById('info-modal-background').classList.remove('clear-modal');
        document.getElementById('info-modal-text').classList.remove('clear-modal');
    }

    static hideModal() {
        document.getElementById('info-modal-background').classList.add('clear-modal');
        document.getElementById('info-modal-text').classList.add('clear-modal');
    }

    static modal() {
        Animate.showModal();
        Animate.isModalShown = true;
        window.setTimeout(() => {
            Animate.isModalShown = false;
            Animate.hideModal();
        }, Animate.modalDisplayLength);
    }
}