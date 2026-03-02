const quiz = document.getElementById('quiz');
const resultEl = document.getElementById('result');
const resetBtn = document.getElementById('resetBtn');


const quizCard = document.querySelector('.quiz-card');
if (quizCard) {
  quizCard.hidden = true;
}
// ensure result and reset button start hidden
if (resultEl) resultEl.hidden = true;
if (resetBtn) resetBtn.setAttribute('aria-hidden','true');


const heroCta = document.querySelector('.hero-cta');
if (heroCta) {
  heroCta.addEventListener('click', (ev) => {
    ev.preventDefault();
    if (quizCard) {
      quizCard.hidden = false;
      // animate quiz card in
      quizCard.classList.add('enter');
      // remove the enter class on next frame to trigger transition
      requestAnimationFrame(() => quizCard.classList.remove('enter'));
      const firstInput = quiz.querySelector('input[type="radio"]');
      quizCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => { firstInput?.focus(); }, 450);
    }
  });
}

const animals = {
  tigre: { name: 'Tigre', emoji: '�', desc: 'Independente, corajoso e ágil — segue o seu próprio caminho.' },
  leao: { name: 'Leão', emoji: '�', desc: 'Confiante e natural líder — protege e inspira os outros.' },
  lince: { name: 'Lince', emoji: '🐈‍⬛', desc: 'Observador e discreto — age com precisão e calma.' },
  zebra: { name: 'Zebra', emoji: '🦓', desc: 'Único e sociável — aprecia pertencer a um grupo colorido.' },
  urso: { name: 'Urso', emoji: '�', desc: 'Forte e paciente — cúmplice e protetor nos momentos importantes.' },
  avestruz: { name: 'Avestruz', emoji: '🦤', desc: 'Pragmático e rápido nas decisões — evita complicações.' },
  arara: { name: 'Arara', emoji: '�', desc: 'Expressivo e comunicativo — adora atenção e cor.' },
  capivara: { name: 'Capivara', emoji: '🐹', desc: 'Tranquilo e sociável — fácil de conviver e acolhedor.' },
  flamingo: { name: 'Flamingo', emoji: '🦩', desc: 'Elegante e gracioso — equilibrado e sociável.' }
};

quiz.addEventListener('submit', function (e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const counts = { tigre:0, leao:0, lince:0, zebra:0, urso:0, avestruz:0, arara:0, capivara:0, flamingo:0 };
  for (const [key, value] of data.entries()) {
    if (counts.hasOwnProperty(value)) counts[value]++;
  }


  const priority = ['tigre','leao','lince','zebra','urso','avestruz','arara','capivara','flamingo'];
  let winner = priority[0];
  let best = -1;
  for (const k of Object.keys(counts)) {
    const v = counts[k];
    if (v > best) { best = v; winner = k; }
    else if (v === best) {
      const currIdx = priority.indexOf(winner);
      const candIdx = priority.indexOf(k);
      if (candIdx < currIdx) winner = k;
    }
  }

  showResult(winner, counts);
});

resetBtn.addEventListener('click', () => {
  // reset form and return to the quiz so user can retake (with smooth animations)
  quiz.reset();
  resetBtn.setAttribute('aria-hidden', 'true');

  // if the result is visible, animate it out, then reveal the quiz
  if (resultEl && !resultEl.hidden) {
    // add hide class to animate up/fade
    resultEl.classList.add('result--hide');

    // use a timeout fallback matching the CSS transition duration to ensure the
    // flow continues even if transitionend doesn't fire in some environments
    const TRANS_MS = 380; // slightly longer than CSS .32s/.36s durations

    // ensure layout, then start hide animation
    void resultEl.offsetWidth;

    setTimeout(() => {
      // fully hide and clean classes
      resultEl.hidden = true;
      resultEl.classList.remove('result--center', 'result--hide');

      // reveal the quiz with an entrance animation
      if (quizCard) {
        quizCard.hidden = false;
        quizCard.classList.add('enter');
        requestAnimationFrame(() => quizCard.classList.remove('enter'));
        quizCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          const firstInput = quiz.querySelector('input[type="radio"]');
          firstInput?.focus();
          // move reset button back into the quiz form actions so the DOM is restored
          const actions = quiz.querySelector('.actions');
          if (actions && resetBtn) actions.appendChild(resetBtn);
        }, 450);
      }
    }, TRANS_MS);
  } else {
    // fallback: show quiz immediately
    if (quizCard) {
      quizCard.hidden = false;
      quizCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => { const firstInput = quiz.querySelector('input[type="radio"]'); firstInput?.focus(); }, 350);
    }
  }
});

function showResult(animalKey, counts) {
  const info = animals[animalKey];
  console.log('[quiz] showResult called for', animalKey);
  // hide the quiz card and show a centered result panel (animate in)
  if (quizCard) quizCard.hidden = true;
  // start with the result in a hidden/offset state, then remove the hide class
  resultEl.classList.add('result--center', 'result--hide');
  resultEl.hidden = false;
  // allow the browser to register the class, then remove the hide class to trigger transition
  requestAnimationFrame(() => {
    // small timeout to ensure layout applied
    setTimeout(() => {
      resultEl.classList.remove('result--hide');
      console.log('[quiz] result show animation started (removed result--hide)');
    }, 16);
  });

  // create image element and map certain animal keys to the exact filenames in /imagens/
  const img = document.createElement('img');
  img.id = 'result-img';
  img.className = 'result-img';
  img.alt = info.name;

  const fileMap = {
    flamingo: 'flamingo.jpeg',
    avestruz: 'avestruz.jpeg',
    lince: 'lince.jpeg',
    tigre: 'tigre.jpeg',
    urso: 'urso.jpeg',
    zebra: 'zebra.jpeg',
    arara: 'arara.jpeg',
    capivara: 'capivara.jpeg', 
    leao: 'leão.jpeg',
  };

  // prefer explicit mapping when available
  if (fileMap[animalKey]) {
    img.src = `imagens/${fileMap[animalKey]}`;
  } else {
    // try common extensions for other animals
    img.src = `imagens/${animalKey}.jpg`;
  }

  // try fallback extensions (.jpeg, .png) before hiding the image
  img.onerror = () => {
    if (img.src && img.src.endsWith('.jpg')) {
      img.src = `imagens/${animalKey}.jpeg`;
    } else if (img.src && img.src.endsWith('.jpeg')) {
      img.src = `imagens/${animalKey}.png`;
    } else if (fileMap[animalKey] && img.src && img.src.endsWith('.jpeg')) {
      img.src = `imagens/${animalKey}.png`;
    } else {
      img.style.display = 'none';
    }
  };

  resultEl.innerHTML = '';
  const inner = document.createElement('div');
  inner.className = 'result-inner';
  const title = document.createElement('h2');
  // show the animal name (image used instead of emoji)
  title.textContent = info.name;
  const desc = document.createElement('p');
  desc.className = 'result-desc';
  desc.textContent = info.desc;

  inner.appendChild(img);
  inner.appendChild(title);
  inner.appendChild(desc);

  // show a short invitation text instead of the detailed points breakdown
  const invite = document.createElement('div');
  invite.className = 'result-invite';
  invite.textContent = 'Este animal e muitos outros podem ser visitados no Zoo da Maia';
  inner.appendChild(invite);

  // move the reset button from the form into the result area so the user can
  // click "Refazer" while the quiz card is hidden
  if (resetBtn && resetBtn.parentNode) {
    inner.appendChild(resetBtn);
    console.log('[quiz] moved resetBtn into result area');
  }

  resultEl.appendChild(inner);

  resetBtn.removeAttribute('aria-hidden');
  // scroll after the element is visible so the animation is noticed
  setTimeout(() => {
    console.log('[quiz] scrolling result into view');
    resultEl.scrollIntoView({behavior:'smooth', block:'center'});
  }, 60);
  // focus the reset button after the show animation completes
  setTimeout(() => {
    resetBtn.focus();
    console.log('[quiz] resetBtn focused');
  }, 420);
}
