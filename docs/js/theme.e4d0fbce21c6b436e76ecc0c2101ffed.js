!function(){const e="THEME",o=["dark","light"];function c(t){localStorage.setItem(e,t),o.forEach(t=>document.body.classList.remove(t)),document.body.classList.add(t)}var t=localStorage.getItem(e);t&&c(t),o.forEach(t=>{const e=document.getElementById(`use-${t}-theme`);e.addEventListener("click",()=>c(t))})}();