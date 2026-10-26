// Web Application State (Mirrors Java CustomHashTable, Queue, and Stacks)
const userHashTable = {
  "MH12AB1234": { reg: "MH12AB1234", pwd: "pass1", name: "Aman Sharma", phone: "9876543210", model: "Honda City" },
  "MH14CD5678": { reg: "MH14CD5678", pwd: "pass2", name: "Priya Patil", phone: "9823012345", model: "Tata Nexon" }
};

const pendingJobQueue = [
  { jobId: "JOB-1000", reg: "MH14CD5678", owner: "Priya Patil", type: "Periodic General Maintenance", date: new Date().toLocaleDateString() }
];

const historyStacks = {
  "MH12AB1234": [
    { jobId: "JOB-999", type: "Brake Pad Inspection & Replacement", status: "COMPLETED", notes: "Front pads replaced with OEM parts", date: "2026-10-15" }
  ],
  "MH14CD5678": []
};

let currentAuthenticatedUser = null;

function switchRole(role) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));

  event.target.classList.add('active');
  document.getElementById(role + '-view').classList.add('active');

  if (role === 'mechanic') renderMechanicQueue();
  if (role === 'admin') renderAdminStats();
}

function toggleAuth(showRegister) {
  document.getElementById('login-box').classList.toggle('hidden', showRegister);
  document.getElementById('register-box').classList.toggle('hidden', !showRegister);
}

function handleCustomerLogin() {
  const reg = document.getElementById('cust-reg').value.trim().toUpperCase();
  const pwd = document.getElementById('cust-pwd').value.trim();

  // O(1) Hashed lookup check
  if (!userHashTable[reg]) {
    alert("No registered vehicle found with number: " + reg + "\nPlease create an account.");
    toggleAuth(true);
    return;
  }

  if (userHashTable[reg].pwd !== pwd) {
    alert("Invalid credentials. Please verify your password.");
    return;
  }

  currentAuthenticatedUser = userHashTable[reg];
  document.getElementById('user-profile-banner').innerHTML = 
    `<strong>Active:</strong> ${currentAuthenticatedUser.name} | ${currentAuthenticatedUser.model} [${currentAuthenticatedUser.reg}]`;
  
  const dash = document.getElementById('cust-dashboard');
  dash.style.opacity = '1';
  dash.style.pointerEvents = 'auto';

  renderCustomerHistory(reg);
}

function handleCustomerRegister() {
  const reg = document.getElementById('reg-no').value.trim().toUpperCase();
  const name = document.getElementById('reg-name').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const model = document.getElementById('reg-model').value.trim();
  const pwd = document.getElementById('reg-pwd').value.trim();

  if (!reg || !name || !pwd) {
    alert("Please fill all mandatory fields.");
    return;
  }

  if (userHashTable[reg]) {
    alert("Vehicle number already exists in hash table! Please log in.");
    toggleAuth(false);
    return;
  }

  userHashTable[reg] = { reg, pwd, name, phone, model };
  historyStacks[reg] = [];
  alert("Vehicle registered successfully in the system database!");
  toggleAuth(false);
  document.getElementById('cust-reg').value = reg;
}

function handleBookService() {
  if (!currentAuthenticatedUser) return;

  const type = document.getElementById('service-package').value;
  const jobId = "JOB-" + Math.floor(1001 + Math.random() * 9000);

  // Enqueue to FIFO queue
  pendingJobQueue.push({
    jobId,
    reg: currentAuthenticatedUser.reg,
    owner: currentAuthenticatedUser.name,
    type,
    date: new Date().toLocaleDateString()
  });

  alert(`Service booked! Ticket: ${jobId} added to the workshop FIFO queue.`);
}

function renderCustomerHistory(reg) {
  const stack = historyStacks[reg] || [];
  const container = document.getElementById('history-stack-display');

  if (stack.length === 0) {
    container.innerHTML = '<div class="empty-state">No prior service records.</div>';
    return;
  }

  // Display LIFO order
  container.innerHTML = stack.slice().reverse().map(item => `
    <div class="stack-item">
      <strong>${item.type}</strong> (${item.jobId})<br>
      <small style="color: #94a3b8;">${item.date} | ${item.status} - ${item.notes}</small>
    </div>
  `).join('');
}

function renderMechanicQueue() {
  const container = document.getElementById('active-job-area');
  const countBadge = document.getElementById('queue-count-badge');
  countBadge.innerText = `${pendingJobQueue.length} Pending Orders`;

  if (pendingJobQueue.length === 0) {
    container.innerHTML = '<div class="empty-state">No jobs pending in queue.</div>';
    return;
  }

  const topJob = pendingJobQueue[0];
  const userHistory = historyStacks[topJob.reg] || [];
  const lastRepair = userHistory.length > 0 ? userHistory[userHistory.length - 1] : null;

  container.innerHTML = `
    <div style="background: #0f172a; padding: 1.25rem; border-radius: 8px; border: 1px solid #334155;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
        <h4 style="color: #38bdf8;">${topJob.jobId} - ${topJob.reg}</h4>
        <span style="font-size: 0.8rem; color: #f59e0b;">Queue Position: Head (1)</span>
      </div>
      <p style="font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>Owner:</strong> ${topJob.owner} | <strong>Order:</strong> ${topJob.type}</p>
      
      <div style="background: #1e293b; padding: 0.75rem; border-radius: 6px; margin: 0.75rem 0; font-size: 0.85rem;">
        <strong>Customer's Prior Repair (Stack Peek):</strong> 
        ${lastRepair ? `${lastRepair.type} [${lastRepair.notes}]` : 'First-time service visit'}
      </div>

      <div class="form-group" style="margin-top: 1rem;">
        <label>Technician Notes / Parts Replaced</label>
        <input type="text" id="tech-notes" placeholder="e.g. Completed filter change, oil refilled">
      </div>
      <button class="btn btn-success" onclick="completeCurrentJob()">Mark Job as COMPLETED & Push to Stack</button>
    </div>
  `;
}

function completeCurrentJob() {
  if (pendingJobQueue.length === 0) return;

  const completed = pendingJobQueue.shift(); // Dequeue FIFO
  const notes = document.getElementById('tech-notes').value.trim() || "Service executed";

  if (!historyStacks[completed.reg]) historyStacks[completed.reg] = [];
  
  // Push to LIFO Stack
  historyStacks[completed.reg].push({
    jobId: completed.jobId,
    type: completed.type,
    status: "COMPLETED",
    notes: notes,
    date: new Date().toISOString().split('T')[0]
  });

  alert(`Job ${completed.jobId} completed and archived to vehicle history stack.`);
  renderMechanicQueue();
}

function renderAdminStats() {
  const registeredCount = Object.keys(userHashTable).length;
  const pendingCount = pendingJobQueue.length;
  
  let completedCount = 0;
  const serviceStats = {};

  Object.values(historyStacks).forEach(stack => {
    completedCount += stack.length;
    stack.forEach(job => {
      serviceStats[job.type] = (serviceStats[job.type] || 0) + 1;
    });
  });

  document.getElementById('stat-fleet').innerText = registeredCount;
  document.getElementById('stat-queue').innerText = pendingCount;
  document.getElementById('stat-completed').innerText = completedCount;
  
  const totalOrders = completedCount + pendingCount;
  document.getElementById('stat-eff').innerText = totalOrders > 0 ? Math.round((completedCount / totalOrders) * 100) + '%' : '100%';

  const listContainer = document.getElementById('service-analytics-list');
  const types = Object.keys(serviceStats);
  if (types.length === 0) {
    listContainer.innerHTML = '<div class="empty-state">No historical job logs found.</div>';
  } else {
    listContainer.innerHTML = types.map(t => `
      <div class="analytics-row">
        <span>${t}</span>
        <strong>${serviceStats[t]} orders fulfilled</strong>
      </div>
    `).join('');
  }
}
