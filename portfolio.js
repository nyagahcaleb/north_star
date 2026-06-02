// portfolio.js - simple project storage in LocalStorage
(function(){
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  const addBtn = document.getElementById('addProjectBtn');
  const modal = document.getElementById('projectModal');
  const closeModalBtn = document.getElementById('closeModal');
  const cancelBtn = document.getElementById('cancelBtn');
  const form = document.getElementById('projectForm');
  const grid = document.getElementById('projectsGrid');

  addBtn && addBtn.addEventListener('click', ()=> openModal());
  closeModalBtn && closeModalBtn.addEventListener('click', closeModal);
  cancelBtn && cancelBtn.addEventListener('click', closeModal);
  form && form.addEventListener('submit', handleSubmit);

  function openModal(){
    modal.setAttribute('aria-hidden','false');
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    form.reset();
  }

  function loadProjects(){
    try{
      const raw = localStorage.getItem('telecom_projects');
      return raw ? JSON.parse(raw) : [];
    }catch(e){console.error(e); return []}
  }
  function saveProjects(projects){
    localStorage.setItem('telecom_projects', JSON.stringify(projects));
  }

  function renderProjects(){
    const projects = loadProjects();
    grid.innerHTML = '';
    if(!projects.length){
      grid.innerHTML = '<p class="muted">No projects yet — click "Add Project" to create one.</p>';
      return;
    }
    projects.forEach((p, idx)=>{
      const card = document.createElement('div');
      card.className = 'project-card';
      const img = document.createElement('img');
      img.src = p.image || 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%2270%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23021626%22/></svg>';
      img.alt = p.title;
      const body = document.createElement('div');
      body.className = 'project-body';
      const h4 = document.createElement('h4'); h4.textContent = p.title;
      const desc = document.createElement('p'); desc.textContent = p.description;
      const meta = document.createElement('div'); meta.className = 'project-meta';
      const tech = document.createElement('span'); tech.className = 'small'; tech.textContent = (p.tech || '').split(',').map(s=>s.trim()).filter(Boolean).join(' • ');
      const actions = document.createElement('div');
      actions.style.display='flex'; actions.style.gap='8px';
      if(p.link){
        const view = document.createElement('a'); view.className='btn'; view.href=p.link; view.target='_blank'; view.textContent='Open'; actions.appendChild(view);
      }
      const del = document.createElement('button'); del.className='btn outline'; del.textContent='Delete'; del.addEventListener('click', ()=>{ if(confirm('Delete this project?')) removeProject(idx)});
      actions.appendChild(del);

      meta.appendChild(tech);
      meta.appendChild(actions);

      body.appendChild(h4);
      body.appendChild(desc);
      body.appendChild(meta);

      card.appendChild(img);
      card.appendChild(body);

      grid.appendChild(card);
    });
  }

  function handleSubmit(e){
    e.preventDefault();
    const fd = new FormData(form);
    const title = fd.get('title').trim();
    const description = fd.get('description').trim();
    const tech = fd.get('tech') ? fd.get('tech').trim() : '';
    const link = fd.get('link') ? fd.get('link').trim() : '';
    const file = fd.get('image');

    if(!title || !description){ alert('Please provide title and description'); return; }

    if(file && file.size){
      const reader = new FileReader();
      reader.onload = function(ev){
        const image = ev.target.result;
        pushProject({title,description,tech,link,image});
        closeModal();
      };
      reader.readAsDataURL(file);
    }else{
      pushProject({title,description,tech,link,image:''});
      closeModal();
    }
  }

  function pushProject(project){
    const projects = loadProjects();
    projects.unshift(Object.assign({created:new Date().toISOString()}, project));
    saveProjects(projects);
    renderProjects();
  }

  function removeProject(idx){
    const projects = loadProjects();
    projects.splice(idx,1);
    saveProjects(projects);
    renderProjects();
  }

  // initial render
  renderProjects();
})();
function sendMessage(event) {
  event.preventDefault();
  const name = document.querySelector('[name="name"]').value;
  const email = document.querySelector('[name="email"]').value;
  const message = document.querySelector('[name="message"]').value;
  if (!name || !email || !message) {
    alert('Please fill in all fields');
    return;
  }
  fetch('https://web3forms.com/api/v1/f/68562935-caf1-416a-a83e-a3f333fe4b1b', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message, access_key: '68562935-caf1-416a-a83e-a3f333fe4b1b' })   })
  } then(response => {
    if (response.ok) {
      alert('Message sent successfully!');
    } else {
      alert('Something went wrong. Try again');
    }
  });