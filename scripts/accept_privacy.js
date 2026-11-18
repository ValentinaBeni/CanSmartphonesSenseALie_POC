export const setupAcceptPrivacy = () => {
    const checkboxPrivacyRead = document.getElementById('checkboxPrivacyRead');
    const checkboxPrivacyConsent = document.getElementById('checkboxPrivacyConsent');
    const buttonPrivacyContinue = document.getElementById('buttonPrivacyContinue');

    const sectionAcceptPrivacy = document.getElementById('acceptPrivacy');
    const sectionSelectProfile = document.getElementById('selectMode');

    const updateContinueState = () => {
        buttonPrivacyContinue.disabled = !(checkboxPrivacyRead.checked && checkboxPrivacyConsent.checked);
    };

    checkboxPrivacyRead.addEventListener('change', function () {
        updateContinueState()
    });

    checkboxPrivacyConsent.addEventListener('change', function () {
        updateContinueState()
    });

    buttonPrivacyContinue.addEventListener('click', function () {
        sectionAcceptPrivacy.classList.add('hidden');
        sectionSelectProfile.classList.remove('hidden');
    })
}