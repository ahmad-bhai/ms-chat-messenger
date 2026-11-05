const $ = s => document.querySelector(s);
  
  // Load session from LocalStorage
  let currentEmail = localStorage.getItem('ms_api_email') || '';
  let currentKey = localStorage.getItem('ms_api_key') || '';
  let userKeys = [];

  const toast = (msg) => {
    const t = $('#ts');
    t.innerHTML = `<div class="tt">${msg}</div>`;
    clearTimeout(window._tt);
    window._tt = setTimeout(() => t.innerHTML = '', 2500);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast('Copied to clipboard!');
    } catch (e) {
      toast('Failed to copy');
    }
  };

  // Global Logout Function
  window.logout = () => {
    localStorage.removeItem('ms_api_email');
    localStorage.removeItem('ms_api_key');
    currentEmail = '';
    currentKey = '';
    location.reload(); // Refresh to show login screen
  };

  // Check on page load if already logged in
  window.onload = () => {
    if (currentEmail && currentKey) {
      $('#step-email').hidden = true;
      $('#step-otp').hidden = true;
      $('#step-dashboard').hidden = false;
      $('#user-email-display').textContent = currentEmail;
      $('#base-url').textContent = location.origin + '/api/ms-api/{token}/...';
      loadKeys();
    }
  };

  // Step 1: Send OTP
  $('#btn-send-otp').onclick = async () => {
    const email = $('#email').value.trim();
    if (!email) return toast('Please enter email');
    
    const btn = $('#btn-send-otp');
    btn.textContent = 'Sending OTP...';
    btn.disabled = true;

    try {
      const res = await fetch('/api/auth/api-key-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (data.err) throw new Error(data.err);
      
      currentEmail = email;
      localStorage.setItem('ms_api_email', currentEmail); // Save email
      
      $('#display-email').textContent = email;
      $('#step-email').hidden = true;
      $('#step-otp').hidden = false;
      toast('OTP sent to your email!');
    } catch (e) {
      toast(e.message);
    } finally {
      btn.textContent = 'Send OTP via Email';
      btn.disabled = false;
    }
  };

  // Step 2: Verify OTP
  $('#btn-verify-otp').onclick = async () => {
    const code = $('#otp').value.trim();
    if (!code) return toast('Please enter OTP');

    const btn = $('#btn-verify-otp');
    btn.textContent = 'Verifying...';
    btn.disabled = true;

    try {
      const res = await fetch('/api/auth/api-key-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, code })
      });
      const data = await res.json();
      
      if (data.err) throw new Error(data.err);
      
      // Show dashboard & save session token
      localStorage.setItem('ms_api_key', 'true'); 
      currentKey = 'true';
      
      $('#user-email-display').textContent = currentEmail;
      $('#step-otp').hidden = true;
      $('#step-dashboard').hidden = false;
      $('#base-url').textContent = location.origin + '/api/ms-api/{token}/...';
      
      loadKeys();
      
    } catch (e) {
      toast(e.message);
    } finally {
      btn.textContent = 'Verify & Continue';
      btn.disabled = false;
    }
  };

  // Load & Render Keys
  async function loadKeys() {
    const list = $('#keys-list');
    list.innerHTML = '<p style="text-align:center;opacity:0.6;padding:20px;">Loading keys...</p>';

    try {
      const res = await fetch(`/api/ap/token/${currentEmail}/list`);
      const data = await res.json();
      
      if (data.err) {
        if (data.err === 'User not found') logout();
        throw new Error(data.err);
      }
      
      userKeys = data.keys || [];
      
      if (userKeys.length === 0) {
        list.innerHTML = '<p style="text-align:center;opacity:0.6;padding:20px;">No API keys generated yet.</p>';
        $('#code-display').innerHTML = 'Generate an API key to view integration code.';
        return;
      }

      list.innerHTML = userKeys.map(k => `
        <div class="badge dev-card" style="margin-top: 8px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <b>API Key</b>
            <button class="copy-btn" onclick="copyToClipboard('${k}')">
              <svg class="i" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
              Copy
            </button>
          </div>
          <span class="key-val">${k}</span>
          <button class="del-btn" onclick="deleteKey('${k}')">Delete Key</button>
        </div>
      `).join('');

      // Auto-select first key for docs
      if (userKeys.length > 0) {
        renderCode(document.querySelector('#code-tabs .on').dataset.lang);
      }
    } catch (e) {
      list.innerHTML = `<p style="color:#ff5b5b; text-align:center; padding:20px;">${e.message}</p>`;
    }
  }

  // Generate New Key
  $('#btn-gen').onclick = async () => {
    if (userKeys.length >= 3) return toast('Max limit reached. Delete a key first.');
    
    try {
      const res = await fetch(`/api/ap/token/${currentEmail}/true`);
      const data = await res.json();
      if (data.err) throw new Error(data.err);
      
      toast('New Key Generated Successfully!');
      loadKeys();
    } catch (e) {
      toast(e.message);
    }
  };

  // Delete Key
  window.deleteKey = async (key) => {
    if (!confirm('Are you sure you want to delete this API key? Any app using it will stop working.')) return;
    try {
      const res = await fetch(`/api/ap/token/${currentEmail}/delete?token=${key}`);
      const data = await res.json();
      if (data.err) throw new Error(data.err);
      
      toast('Key Deleted');
      loadKeys();
    } catch (e) {
      toast(e.message);
    }
  };

  // Code Snippets
  const codes = {
    node: () => `const axios = require('axios');\n\nconst API_KEY = '${userKeys[0] || 'YOUR_KEY'}';\nconst BASE_URL = '${location.origin}/api/ms-api/' + API_KEY;\n\nasync function getChats() {\n  const res = await axios.get(BASE_URL + '/chats');\n  console.log(res.data);\n}\n\ngetChats();`,
    js: () => `const API_KEY = '${userKeys[0] || 'YOUR_KEY'}';\nconst BASE_URL = '${location.origin}/api/ms-api/' + API_KEY;\n\nasync function getChats() {\n  const res = await fetch(BASE_URL + '/chats');\n  const data = await res.json();\n  console.log(data);\n}\n\ngetChats();`,
    python: () => `import requests\n\nAPI_KEY = '${userKeys[0] || 'YOUR_KEY'}'\nBASE_URL = '${location.origin}/api/ms-api/' + API_KEY\n\ndef get_chats():\n    res = requests.get(BASE_URL + '/chats')\n    print(res.json())\n\nget_chats()`,
    php: () => `<?php\n$API_KEY = '${userKeys[0] || 'YOUR_KEY'}';\n$BASE_URL = '${location.origin}/api/ms-api/' . $API_KEY;\n\n$ch = curl_init($BASE_URL . '/chats');\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n$response = curl_exec($ch);\ncurl_close($ch);\n\necho $response;\n?>`,
    curl: () => `curl -X GET \\\n  "${location.origin}/api/ms-api/${userKeys[0] || 'YOUR_KEY'}/chats"`
  };

  function renderCode(lang) {
    const box = $('#code-display');
    box.innerHTML = `<pre>${escapeHTML(codes[lang]())}</pre>`;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
  }

  document.querySelectorAll('#code-tabs button').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('#code-tabs button').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      renderCode(btn.dataset.lang);
    };
  });
