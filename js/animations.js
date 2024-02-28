//document.addEventListener('DOMContentLoaded', () => {
//  const numberOfTexts = 50; // Adjust this for performance
//  for (let i = 0; i < numberOfTexts; i++) {
//    createAndAnimateText();
//  }
//});
//
//function createAndAnimateText() {
//  const textElement = document.createElement('div');
//  textElement.textContent = 'Wisaa Spider';
//  textElement.style.position = 'absolute';
//  textElement.style.color = getRandomColor();
//  textElement.style.fontSize = `${Math.random() * 20 + 10}px`;
//  textElement.style.left = `${Math.random() * 100}%`;
//  textElement.style.top = `${Math.random() * 100}%`;
//
//  document.body.appendChild(textElement);
//
//  animateText(textElement);
//}
//
//function animateText(element) {
//  const keyframes = [
//    { transform: 'translate(0, 0)' },
//    { transform: `translate(${Math.random() * 500 - 250}px, ${Math.random() * 500 - 250}px)` }
//  ];
//  const options = {
//    duration: Math.random() * 5000 + 5000,
//    iterations: Infinity
//  };
//  element.animate(keyframes, options);
//}
//
//function getRandomColor() {
//  const letters = '0123456789ABCDEF';
//  let color = '#';
//  for (let i = 0; i < 6; i++) {
//    color += letters[Math.floor(Math.random() * 16)];
//  }
//  return color;
//}
