import './MainPage.css';
import React, { useState, useEffect } from 'react';
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
  `
};

function MainPage() {
  const [activeSection, setActiveSection] = useState<'profile' | 'work' | 'Ask_Me'>('profile');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  useEffect(() => {
    localStorage.removeItem('chatHistory');
  }, []);

  useEffect(() => {
      const savedMessages = localStorage.getItem('chatHistory');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        console.log('Loaded messages from localStorage:', parsed);
        setMessages(parsed);
      }
    }, []);

  const updateMessages = (newMessages: { sender: string; text: string }[]) => {
    setMessages(newMessages);
    localStorage.setItem('chatHistory', JSON.stringify(newMessages));
  };

  return (
    <div className="page-container">
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

      {activeSection === 'profile' && (
        <div className='frame' >
          <div className="text-box">
            <Typewriter
              options={{
                strings: content.profile,
                autoStart: true,
                delay: 42,
                loop: false,
                cursor: '_',
              }}
            />
          </div>
        </div>
      )}

      {activeSection === 'work' && (
        <div className='frame' >
          <div className="text-box-work">
            <div dangerouslySetInnerHTML={{ __html: content.work }} />
          </div>
        </div>
      )}

      {activeSection === 'Ask_Me' && (
        <div className="askme-frame">
          <div className="askme-content">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-bubble ${msg.sender === 'user' ? 'user-message' : 'agent-message'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="input-wrapper">
            <div className="chat-input-container">
              <textarea
                className="chat-box"
                placeholder="Ask me something..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                  const target = e.currentTarget;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 72)}px`;
                }}
              />
              <button
                className="send-button"
                aria-label="Send message"
                onClick={async () => {
                  if (!inputValue.trim()) return;

                  const userMessage = { sender: 'user', text: inputValue };
                  const updatedMessages = [...messages, userMessage];
                  updateMessages(updatedMessages);

                  // Convert messages to OpenAI/LLM style format
                  const formattedHistory = updatedMessages.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.text
                  }));
                  

                  setInputValue('');

                  try {
                    const response = await fetch('http://localhost:3001/api/chat', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ model: 'llama3.2', messages: formattedHistory }),
                    });

                    const data = await response.json();
                    const agentMessage = { sender: 'agent', text: data.response };
                    updateMessages([...updatedMessages, agentMessage]);
                  } catch (error) {
                    const errorMsg = { sender: 'agent', text: '⚠️ Failed to get response from agent.' };
                    updateMessages([...updatedMessages, errorMsg]);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
