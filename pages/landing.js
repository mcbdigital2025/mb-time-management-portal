"use client";
import React from 'react';

const LandingPage = () => {
  return (
    <>
      {/* --- HERO SECTION --- */}
      <section className="hero-header-section">
        <div className="w-layout-blockcontainer top-hero-header-container w-container">
          <div className="green-tag-1">
            <div className="icon-embed-custom w-embed">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 10 10" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
                <circle cx="5" cy="5" r="5" fill="currentColor"></circle>
              </svg>
            </div>
            <div className="text-block-2">New Feature: AI Scheduling</div>
          </div>
          <h1 className="heading">All-in-one scheduling & workforce management</h1>
          <div className="text-hero">Built for care providers, security teams, and healthcare <br />clinics managing staff across multiple sites.</div>
          <div className="header-hero-button">
            <a href="#" className="green-button orange-background-colour w-inline-block">
              <div className="text-block">Book a Demo</div>
            </a>
            <a href="#" className="green-button white-background-colour white-button w-inline-block">
              <div className="text-block text-colour-black">See how it works</div>
              <div className="icon-embed-xxsmall w-embed">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.64645 1.64645C4.84171 1.45118 5.15829 1.45118 5.35355 1.64645L11.3536 7.64645C11.5488 7.84171 11.5488 8.15829 11.3536 8.35355L5.35355 14.3536C5.15829 14.5488 4.84171 14.5488 4.64645 14.3536C4.45118 14.1583 4.45118 13.8417 4.64645 13.6464L10.2929 8L4.64645 2.35355C4.45118 2.15829 4.45118 1.84171 4.64645 1.64645Z" fill="currentColor"></path>
                </svg>
              </div>
            </a>
          </div>
        </div>
        <div className="w-layout-blockcontainer image-hero-container w-container">
          <div className="image-hero-header-card">
            <div className="icon-embed-small w-embed">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 32 32" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
                <rect width="32" height="32" rx="16" fill="#D9F7BE"></rect>
                <path d="M16 23C12.134 23 9 19.866 9 16C9 12.134 12.134 9 16 9C19.866 9 23 12.134 23 16C23 19.866 19.866 23 16 23ZM16 24C20.4183 24 24 20.4183 24 16C24 11.5817 20.4183 8 16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24Z" fill="#389E0D"></path>
                <path d="M18.9697 12.9697C18.9626 12.9767 18.9559 12.9842 18.9498 12.9921L15.4774 17.4167L13.3839 15.3232C13.091 15.0303 12.6161 15.0303 12.3232 15.3232C12.0303 15.6161 12.0303 16.091 12.3232 16.3839L14.9697 19.0303C15.2626 19.3232 15.7374 19.3232 16.0303 19.0303C16.0368 19.0238 16.043 19.0169 16.0488 19.0097L20.041 14.0195C20.3232 13.7258 20.3196 13.259 20.0303 12.9697C19.7374 12.6768 19.2626 12.6768 18.9697 12.9697Z" fill="#389E0D"></path>
              </svg>
            </div>
            <div className="image-hero-card-div">
              <div className="light-grey-text">Shift Status</div>
              <div className="image-hero-card-text-bold">All Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="features-section">
        <div className="w-layout-blockcontainer features-container w-container">
          <div className="features-card-grid">
            <div className="feature-card">
              <div className="icon-embed-medium w-embed">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 48 48" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
                  <rect width="48" height="48" rx="24" fill="white"></rect>
                  <path d="M27.75 23.375C27.75 23.0298 28.0298 22.75 28.375 22.75H29.625C29.9702 22.75 30.25 23.0298 30.25 23.375V24.625C30.25 24.9702 29.9702 25.25 29.625 25.25H28.375C28.0298 25.25 27.75 24.9702 27.75 24.625V23.375Z" fill="#008080"></path>
                  <path d="M18.375 14C18.7202 14 19 14.2798 19 14.625V15.25H29V14.625C29 14.2798 29.2798 14 29.625 14C29.9702 14 30.25 14.2798 30.25 14.625V15.25H31.5C32.8807 15.25 34 16.3693 34 17.75V31.5C34 32.8807 32.8807 34 31.5 34H16.5C15.1193 34 14 32.8807 14 31.5V17.75C14 16.3693 15.1193 15.25 16.5 15.25H17.75V14.625C17.75 14.2798 18.0298 14 18.375 14ZM16.5 16.5C15.8096 16.5 15.25 17.0596 15.25 17.75V31.5C15.25 32.1904 15.8096 32.75 16.5 32.75H31.5C32.1904 32.75 32.75 32.1904 32.75 31.5V17.75C32.75 17.0596 32.1904 16.5 31.5 16.5H16.5Z" fill="#008080"></path>
                </svg>
              </div>
              <div className="text-heading white-text-colour">Smart Scheduling</div>
              <div className="text">Plan shifts and jobs across staff and sites with intelligent conflict detection.</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;