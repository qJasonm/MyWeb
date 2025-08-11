import './MainPage.css';
import React, { useState, useEffect, useRef } from 'react';
import Typewriter from 'typewriter-effect';


const content = {
  profile: `Hi! I’m Qijian Ma, I also go by Jason! <br><br>I am a current Computer Science student at the University of Colorado Denver.<br><br>This site is my personal space to experiment, learn, and share what I’ve been working on.<br><br>Thanks for visiting!!!!!!!!! <br><br> (@_@)`,
  work: `
  <div class="work-text">
    <div class="job-block">
      <strong style="color:Gold;">Technology Officer</strong> — <span style="color:yellow;">AI Student Association </span>(02/2025 – Present)
      <ul>
        <li>Built and maintained the organization’s official site using React and Node.js.</li>
        <li>Organized technical workshops and led outreach efforts.</li>
      </ul>
    </div>
    <hr />

    <div class="job-block">
      <strong style="color:Gold;">DevOps Technician</strong> — <span style="color:#d4382c;">Red Rocks Community College</span> (07/2023 – 01/2025)
      <ul>
        <li>Configured and deployed Virtual Desktop Infrastructure (VDI) using VMware and thin clients.</li>
        <li>Monitored and analyzed network infrastructure with Cisco Meraki and Meraki API.</li>
        <li>Managed Papercut print services and implemented system upgrades.</li>
        <li>Automated tasks and kiosk setups via Jira and Jira API.</li>
      </ul>
    </div>
    <hr />

    <div class="job-block">
      <strong style="color:Gold;">IT Help Desk Assistant</strong> — <span style="color:#d4382c;">Red Rocks Community College</span> (02/2022 – 07/2023)
      <ul>
        <li>Provided remote and in-person technical support for staff and students.</li>
        <li>Maintained classroom systems and performed Windows imaging with SCCM.</li>
        <li>Handled account management using Active Directory.</li>
      </ul>
    </div>
    <!-- Work Experience content -->
  </div>
  `
  `,
};

function MainPage() {
  const [activeSection, setActiveSection] =
    useState<'profile' | 'work' | 'Ask_Me'>('profile');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  /* one-time setup ---------------------------------------------------------------- */
  useEffect(() => {
    localStorage.removeItem('chatHistory');
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  /*  ALWAYS scroll to bottom when messages or loader change */
  useEffect(() => {
    const el = chatContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const updateMessages = (newMsgs: { sender: string; text: string }[]) => {
    setMessages(newMsgs);
    localStorage.setItem('chatHistory', JSON.stringify(newMsgs));
  };

  return (
    <div className="page-container">
      {/* navigation */}
      <div className="button-row">
        <button
          className={`profile-button ${activeSection === 'profile' ? 'selected-button' : ''}`}
          onClick={() => setActiveSection('profile')}
        >
          Profile
        </button>
        <button
          className={`profile-button ${activeSection === 'work' ? 'selected-button' : ''}`}
          onClick={() => setActiveSection('work')}
        >
          Work Experience
        </button>
        <button
          className={`profile-button ${activeSection === 'Ask_Me' ? 'selected-button' : ''}`}
          onClick={() => setActiveSection('Ask_Me')}
        >
          Ask Me! (My Agent)
        </button>
      </div>

      {/* profile */}
      {activeSection === 'profile' && (
        <div className="frame">
          <div className="text-box">
            <Typewriter
              options={{ strings: content.profile, autoStart: true, delay: 42, cursor: '_' }}
            />
          </div>
        </div>
      )}

      {/* work */}
      {activeSection === 'work' && (
        <div className="frame">
          <div className="text-box-work" dangerouslySetInnerHTML={{ __html: content.work }} />
        </div>
      )}

      {/* chat */}
      {activeSection === 'Ask_Me' && (
        <div className="askme-frame">
          <div className="askme-content" ref={chatContainerRef}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message-bubble ${msg.sender === 'user' ? 'user-message' : 'agent-message'}`}
              >
                {msg.text}
              </div>
            ))}

            {isLoading && (
              <div className="message-bubble agent-message loading">
                <span className="loading-dots">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              </div>
            )}
          </div>

          {/* input */}
          <div className="input-wrapper">
            <div className="chat-input-container">
              <textarea
                className="chat-box"
                placeholder="Ask me something."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onInput={(e) => {
                  const t = e.currentTarget;
                  t.style.height = 'auto';
                  t.style.height = `${Math.min(t.scrollHeight, 72)}px`;
                }}
              />

              <button
                className={`send-button ${isLoading ? 'disabled' : ''}`}
                aria-label="Send message"
                disabled={isLoading}
                onClick={async () => {
                  if (!inputValue.trim() || isLoading) return;

                  const userMsg = { sender: 'user', text: inputValue };
                  const newHistory = [...messages, userMsg];
                  updateMessages(newHistory);
                  setInputValue('');
                  setIsLoading(true);

                  const formattedHistory = newHistory.map((m) => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.text,
                  }));

                  try {
                    const resp = await fetch('http://192.168.0.109:3001/api/chat', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ model: 'JMA', messages: formattedHistory }),
                    });

                    const data = await resp.json();
                    const agentMsg = { sender: 'agent', text: data.response };
                    updateMessages([...newHistory, agentMsg]);
                  } catch (err) {
                    updateMessages([
                      ...newHistory,
                      { sender: 'agent', text: '⚠️ Failed to get response from agent.' },
                    ]);
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
