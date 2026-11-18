export function setupModeSelection() {
  const buttonTruth = document.getElementById('buttonTruth');
  const buttonLie = document.getElementById('buttonLie');

  const divLieMode = document.getElementById('divLieMode')
  const divTruthMode = document.getElementById('divTruthMode')
  const sectionSelectProfile = document.getElementById('selectProfile')


  buttonTruth.addEventListener('click', () => {
    buttonTruth.classList.add('active');
    buttonLie.classList.remove('active');
    sectionSelectProfile.classList.remove('hidden');
    divLieMode.classList.add('hidden');
    divTruthMode.classList.remove('hidden');
  });

  buttonLie.addEventListener('click', () => {
    buttonLie.classList.add('active');
    buttonTruth.classList.remove('active');
    sectionSelectProfile.classList.remove('hidden');
    divLieMode.classList.remove('hidden');
    divTruthMode.classList.add('hidden');
  });
}