import data from '../data/fake_profiles.json'  with { type: 'json' };
import { setupQuestionForm } from './question_form.js';

export function setupProfileSelection() {
    const buttonFemale = document.getElementById('femaleProfileCard');
    const buttonMale = document.getElementById('maleProfileCard');

    const buttonStartTruth = document.getElementById('buttonStartTruth');
    const buttonStartLie = document.getElementById('buttonStartLie');

    var selectedProfile = null;

    buttonFemale.addEventListener('click', () => {
        buttonFemale.classList.add('selected');
        buttonMale.classList.remove('selected');
        selectedProfile = selectProfile('female');
    });

    buttonMale.addEventListener('click', () => {
        buttonFemale.classList.remove('selected');
        buttonMale.classList.add('selected');
        selectedProfile = selectProfile('male');
    });

    buttonStartTruth.addEventListener('click', () => {
        showQuestionForm()
        setupQuestionForm('truth', selectedProfile)
    });

    buttonStartLie.addEventListener('click', () => {
        showQuestionForm()
        setupQuestionForm('lie', selectedProfile)
    });

}

function selectProfile(gender) {
    const profileInfoBox = document.getElementById('selectedProfileInfo');
    const profileInfoDetails = document.getElementById('profileInfoDetails');

    const profile = data[gender];
    profileInfoDetails.innerHTML = ``
    for (const [key, value] of Object.entries(profile)) {
        profileInfoDetails.innerHTML += `
        <div class="info-item">
          <div class="info-label">${value['label']}</div>
          <div class="info-value">${value['value']}</div>
        </div>
        `
    }

    profileInfoBox.classList.remove('hidden');
    return profile;
}

function showQuestionForm() {
    const profileInfoBox = document.getElementById('selectedProfileInfo');
    const selectMode = document.getElementById('selectMode');
    const selectProfile = document.getElementById('selectProfile');
    const questionForm = document.getElementById('questionForm');

    profileInfoBox.classList.add('hidden');
    selectMode.classList.add('hidden');
    selectProfile.classList.add('hidden');
    questionForm.classList.remove('hidden');
}