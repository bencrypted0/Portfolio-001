/**
 * Glare Effect & Modal Handler
 * handles the 3D tilt effect for cards and opening/closing details modals.
 */

document.addEventListener('DOMContentLoaded', () => {
    initGlareCards();
    initModals();
});

function initGlareCards() {
    const cards = document.querySelectorAll('.glare-card');

    cards.forEach(card => {
        // State for each card
        const state = {
            glare: { x: 50, y: 50 },
            background: { x: 50, y: 50 },
            rotate: { x: 0, y: 0 }
        };

        let isPointerInside = false;

        const updateStyles = () => {
            card.style.setProperty('--m-x', `${state.glare.x}%`);
            card.style.setProperty('--m-y', `${state.glare.y}%`);
            card.style.setProperty('--r-x', `${state.rotate.x}deg`);
            card.style.setProperty('--r-y', `${state.rotate.y}deg`);
            card.style.setProperty('--bg-x', `${state.background.x}%`);
            card.style.setProperty('--bg-y', `${state.background.y}%`);
        };

        card.addEventListener('pointermove', (event) => {
            const rotateFactor = 0.4;
            const rect = card.getBoundingClientRect();
            const position = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
            const percentage = {
                x: (100 / rect.width) * position.x,
                y: (100 / rect.height) * position.y
            };
            const delta = {
                x: percentage.x - 50,
                y: percentage.y - 50
            };

            state.background.x = 50 + percentage.x / 4 - 12.5;
            state.background.y = 50 + percentage.y / 3 - 16.67;
            state.rotate.x = -(delta.x / 3.5) * rotateFactor;
            state.rotate.y = (delta.y / 2) * rotateFactor;
            state.glare.x = percentage.x;
            state.glare.y = percentage.y;

            updateStyles();
        });

        card.addEventListener('pointerenter', () => {
            isPointerInside = true;
            setTimeout(() => {
                if (isPointerInside) {
                    card.style.setProperty('--duration', '0s');
                }
            }, 300);
        });

        card.addEventListener('pointerleave', () => {
            isPointerInside = false;
            card.style.removeProperty('--duration');
            card.style.setProperty('--r-x', '0deg');
            card.style.setProperty('--r-y', '0deg');
        });
    });
}

function initModals() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const cards = document.querySelectorAll('.glare-card');

    if (!modalOverlay || !modalClose) return;

    // Elements to update in modal
    const mImage = modalOverlay.querySelector('.modal-image');
    const mTitle = modalOverlay.querySelector('.modal-title');
    const mDesc = modalOverlay.querySelector('.modal-description');
    const mDetails = modalOverlay.querySelector('.modal-details');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Get data from data attributes
            const title = card.dataset.title;
            const desc = card.dataset.description;
            const imgSrc = card.querySelector('.card-image').src;
            const detailsHtml = card.querySelector('.card-details-hidden').innerHTML; // Hidden div in card holding details

            // Populate modal
            if (mImage) mImage.src = imgSrc;
            if (mTitle) mTitle.textContent = title;
            if (mDesc) mDesc.innerHTML = desc; // Use innerHTML to allow basic formatting if needed
            if (mDetails) mDetails.innerHTML = detailsHtml;

            // Open modal
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Re-trigger animations if any
            requestAnimationFrame(() => {
                const modal = modalOverlay.querySelector('.modal-card');
                modal.style.transform = 'scale(1) translateY(0)';
                modal.style.opacity = '1';
            });
        });
    });

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';

        // Reset transform for next open animation
        const modal = modalOverlay.querySelector('.modal-card');
        modal.style.transform = 'scale(0.9) translateY(30px)';
        modal.style.opacity = '0';
    };

    modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}
