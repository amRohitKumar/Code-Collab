function insertDecorationCSS(userId: string, color: string) {
  var style = document.createElement("style");
  style.id = `user${userId}`;
  style.innerHTML = `
      .cursor${userId} {
        border: 1px solid ${color};
        border-radius: 0.5rem;
        box-shadow: 0 0 0 1px black; 
      }
      .selection${userId} {
        background-color: ${color};
        opacity: 0.5;
      }
    `;
  document.getElementsByTagName("head")[0].appendChild(style);
}

export default insertDecorationCSS;
