import { setupAcceptPrivacy } from './accept_privacy.js';
import { setupModeSelection } from './select_mode.js';
import { setupProfileSelection } from './select_profile.js';


document.addEventListener('DOMContentLoaded', async function () {
    try {
        await loadComponent('acceptPrivacy', 'components/accept_privacy.html');
        await loadComponent('selectMode', 'components/select_mode.html');
        await loadComponent('selectProfile', 'components/select_profile.html');
        await loadComponent('questionForm', 'components/question_form.html');
        await loadComponent('waitingPage', 'components/waiting_page.html');
        await loadComponent('finalPage', 'components/final_page.html');
        setupAcceptPrivacy();
        setupModeSelection();
        setupProfileSelection();

    } catch (error) {
        console.error('Error loading the page:', error);
    }
});

const loadComponent = async (base, path) => {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const section = doc.querySelector('div');

    if (section) {
        const container = document.getElementById(base);
        if (container) {
            container.appendChild(section);
        } else {
            console.warn('Container not found');
        }
    } else {
        console.warn('No section found');
    }
};


