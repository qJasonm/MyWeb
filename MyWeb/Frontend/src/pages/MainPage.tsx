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
    </div>
  `,
};

type Msg = { sender: 'user' | 'agent'; text: string };

function MainPage() {
  const [activeSection, setActiveSection] =
    useState<'profile' | 'work' | 'Ask_Me'>('profile');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrePrompt, setShowPrePrompt] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll on messages
  useEffect(() => {
    const el = chatContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    if (showPrePrompt) setShowPrePrompt(false);

    const userMsg: Msg = { sender: 'user', text: inputValue };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const formattedHistory = newHistory.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    try {
      const resp = await fetch('https://api.qjasonma.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'JMA', messages: formattedHistory }),
      });

      const data = await resp.json();
      const agentMsg: Msg = { sender: 'agent', text: data.response };
      setMessages([...newHistory, agentMsg]);
    } catch (err) {
      setMessages([
        ...newHistory,
        { sender: 'agent', text: '⚠️ Failed to get response from agent.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
            {showPrePrompt && (
              <div className="message-row agent-row">
                <img src="/me.png" alt="Agent Avatar" className="avatar" />
                <div className="message-bubble agent-message">
                  Hi, feel free to ask me anything. (Content will be removed after refresh)
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message-row ${msg.sender === 'user' ? 'user-row' : 'agent-row'}`}
              >
                {msg.sender === 'agent' && (
                  <img src="/me.png" alt="Agent Avatar" className="avatar" />
                )}
                <div
                  className={`message-bubble ${msg.sender === 'user' ? 'user-message' : 'agent-message'}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message-row agent-row">
                <img src="/me.png" alt="Agent Avatar" className="avatar" />
                <div className="message-bubble agent-message loading">
                  <span className="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* input */}
          <div className="input-wrapper">
            <div className="chat-input-container">
              <textarea
                ref={textareaRef}
                className="chat-box"
                placeholder="Ask me something."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
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
                onClick={handleSend}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
