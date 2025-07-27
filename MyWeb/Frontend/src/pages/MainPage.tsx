import './MainPage.css';
import React, { useState } from 'react';
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
    <div className="chat-input-container">
      <textarea
        className="chat-box"
        placeholder="Ask me something..."
        onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
          const target = e.currentTarget;
          target.style.height = 'auto';
          target.style.height = `${Math.min(target.scrollHeight, 72)}px`;
        }}
      />
      <button className="send-button" aria-label="Send message" />
    </div>
  </div>
)}



        
      </div>

  );
}

export default MainPage;
