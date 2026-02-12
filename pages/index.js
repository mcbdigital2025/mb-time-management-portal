// pages/index.js
"use client";

const HomePageContent = () => {
  return (
    <>
      {/* --- HERO SECTION --- */}
      <section className="hero-header-ssection">
        <div className="w-layout-blockcontainer top-hero-header-container w-container">
          <div className="green-tag-1">
            <div className="icon-embed-custom w-embed">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 10 10" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
                <circle cx="5" cy="5" r="5" fill="currentColor"></circle>
              </svg>
            </div>
            <div className="text-block-2">New Feature: AI Scheduling</div>
          </div>
          <h1 className="heading">All-in-one scheduling &amp;<br />workforce management</h1>
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
        <div class="image-hero-header-card image-hero-card-div-bttm">
                <div class="icon-embed-small w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 32 32" fill="none" preserveaspectratio="xMidYMid meet" aria-hidden="true" role="img">
                    <rect width="32" height="32" rx="16" fill="#D9F7BE"></rect>
                    <path d="M16 23C12.134 23 9 19.866 9 16C9 12.134 12.134 9 16 9C19.866 9 23 12.134 23 16C23 19.866 19.866 23 16 23ZM16 24C20.4183 24 24 20.4183 24 16C24 11.5817 20.4183 8 16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24Z" fill="#389E0D"></path>
                    <path d="M18.9697 12.9697C18.9626 12.9767 18.9559 12.9842 18.9498 12.9921L15.4774 17.4167L13.3839 15.3232C13.091 15.0303 12.6161 15.0303 12.3232 15.3232C12.0303 15.6161 12.0303 16.091 12.3232 16.3839L14.9697 19.0303C15.2626 19.3232 15.7374 19.3232 16.0303 19.0303C16.0368 19.0238 16.043 19.0169 16.0488 19.0097L20.041 14.0195C20.3232 13.7258 20.3196 13.259 20.0303 12.9697C19.7374 12.6768 19.2626 12.6768 18.9697 12.9697Z" fill="#389E0D"></path>
                  </svg></div>
                <div class="image-hero-card-div">
                  <div class="light-grey-text">Shift Status</div>
                  <div class="image-hero-card-text-bold">All Covered</div>
                </div>
              </div>
      </section>
 <section class="features-section">
    <div class="w-layout-blockcontainer features-container w-container">
      <div class="features-card-grid">
        <div class="feature-card">
          <div class="icon-embed-medium w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 48 48" fill="none" preserveaspectratio="xMidYMid meet" aria-hidden="true" role="img">
              <rect width="48" height="48" rx="24" fill="white"></rect>
              <g clip-path="url(#clip0_128_88)">
                <rect width="20" height="20" transform="translate(14 14)" fill="white" fill-opacity="0.01"></rect>
                <path d="M27.75 23.375C27.75 23.0298 28.0298 22.75 28.375 22.75H29.625C29.9702 22.75 30.25 23.0298 30.25 23.375V24.625C30.25 24.9702 29.9702 25.25 29.625 25.25H28.375C28.0298 25.25 27.75 24.9702 27.75 24.625V23.375Z" fill="#008080"></path>
                <path d="M18.375 14C18.7202 14 19 14.2798 19 14.625V15.25H29V14.625C29 14.2798 29.2798 14 29.625 14C29.9702 14 30.25 14.2798 30.25 14.625V15.25H31.5C32.8807 15.25 34 16.3693 34 17.75V31.5C34 32.8807 32.8807 34 31.5 34H16.5C15.1193 34 14 32.8807 14 31.5V17.75C14 16.3693 15.1193 15.25 16.5 15.25H17.75V14.625C17.75 14.2798 18.0298 14 18.375 14ZM16.5 16.5C15.8096 16.5 15.25 17.0596 15.25 17.75V31.5C15.25 32.1904 15.8096 32.75 16.5 32.75H31.5C32.1904 32.75 32.75 32.1904 32.75 31.5V17.75C32.75 17.0596 32.1904 16.5 31.5 16.5H16.5Z" fill="#008080"></path>
                <path d="M17.125 19C17.125 18.6548 17.4048 18.375 17.75 18.375H30.25C30.5952 18.375 30.875 18.6548 30.875 19V20.25C30.875 20.5952 30.5952 20.875 30.25 20.875H17.75C17.4048 20.875 17.125 20.5952 17.125 20.25V19Z" fill="#008080"></path>
              </g>
              <defs>
                <clippath id="clip0_128_88">
                  <rect width="20" height="20" fill="white" transform="translate(14 14)"></rect>
                </clippath>
              </defs>
            </svg></div>
          <div class="text-heading white-text-colour">Smart Scheduling</div>
          <div class="text">Plan shifts and jobs across staff and sites with intelligent conflict detection.</div>
        </div>
        <div class="feature-card">
          <div class="icon-embed-medium w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 48 48" fill="none" preserveaspectratio="xMidYMid meet" aria-hidden="true" role="img">
              <rect width="48" height="48" rx="24" fill="white"></rect>
              <g clip-path="url(#clip0_128_88)">
                <rect width="20" height="20" transform="translate(14 14)" fill="white" fill-opacity="0.01"></rect>
                <path d="M27.75 23.375C27.75 23.0298 28.0298 22.75 28.375 22.75H29.625C29.9702 22.75 30.25 23.0298 30.25 23.375V24.625C30.25 24.9702 29.9702 25.25 29.625 25.25H28.375C28.0298 25.25 27.75 24.9702 27.75 24.625V23.375Z" fill="#008080"></path>
                <path d="M18.375 14C18.7202 14 19 14.2798 19 14.625V15.25H29V14.625C29 14.2798 29.2798 14 29.625 14C29.9702 14 30.25 14.2798 30.25 14.625V15.25H31.5C32.8807 15.25 34 16.3693 34 17.75V31.5C34 32.8807 32.8807 34 31.5 34H16.5C15.1193 34 14 32.8807 14 31.5V17.75C14 16.3693 15.1193 15.25 16.5 15.25H17.75V14.625C17.75 14.2798 18.0298 14 18.375 14ZM16.5 16.5C15.8096 16.5 15.25 17.0596 15.25 17.75V31.5C15.25 32.1904 15.8096 32.75 16.5 32.75H31.5C32.1904 32.75 32.75 32.1904 32.75 31.5V17.75C32.75 17.0596 32.1904 16.5 31.5 16.5H16.5Z" fill="#008080"></path>
                <path d="M17.125 19C17.125 18.6548 17.4048 18.375 17.75 18.375H30.25C30.5952 18.375 30.875 18.6548 30.875 19V20.25C30.875 20.5952 30.5952 20.875 30.25 20.875H17.75C17.4048 20.875 17.125 20.5952 17.125 20.25V19Z" fill="#008080"></path>
              </g>
              <defs>
                <clippath id="clip0_128_88">
                  <rect width="20" height="20" fill="white" transform="translate(14 14)"></rect>
                </clippath>
              </defs>
            </svg></div>
          <div class="text-heading white-text-colour">Smart Scheduling</div>
          <div class="text">Plan shifts and jobs across staff and sites with intelligent conflict detection.</div>
        </div>
        <div class="feature-card">
          <div class="icon-embed-medium w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 48 48" fill="none" preserveaspectratio="xMidYMid meet" aria-hidden="true" role="img">
              <rect width="48" height="48" rx="24" fill="white"></rect>
              <g clip-path="url(#clip0_128_88)">
                <rect width="20" height="20" transform="translate(14 14)" fill="white" fill-opacity="0.01"></rect>
                <path d="M27.75 23.375C27.75 23.0298 28.0298 22.75 28.375 22.75H29.625C29.9702 22.75 30.25 23.0298 30.25 23.375V24.625C30.25 24.9702 29.9702 25.25 29.625 25.25H28.375C28.0298 25.25 27.75 24.9702 27.75 24.625V23.375Z" fill="#008080"></path>
                <path d="M18.375 14C18.7202 14 19 14.2798 19 14.625V15.25H29V14.625C29 14.2798 29.2798 14 29.625 14C29.9702 14 30.25 14.2798 30.25 14.625V15.25H31.5C32.8807 15.25 34 16.3693 34 17.75V31.5C34 32.8807 32.8807 34 31.5 34H16.5C15.1193 34 14 32.8807 14 31.5V17.75C14 16.3693 15.1193 15.25 16.5 15.25H17.75V14.625C17.75 14.2798 18.0298 14 18.375 14ZM16.5 16.5C15.8096 16.5 15.25 17.0596 15.25 17.75V31.5C15.25 32.1904 15.8096 32.75 16.5 32.75H31.5C32.1904 32.75 32.75 32.1904 32.75 31.5V17.75C32.75 17.0596 32.1904 16.5 31.5 16.5H16.5Z" fill="#008080"></path>
                <path d="M17.125 19C17.125 18.6548 17.4048 18.375 17.75 18.375H30.25C30.5952 18.375 30.875 18.6548 30.875 19V20.25C30.875 20.5952 30.5952 20.875 30.25 20.875H17.75C17.4048 20.875 17.125 20.5952 17.125 20.25V19Z" fill="#008080"></path>
              </g>
              <defs>
                <clippath id="clip0_128_88">
                  <rect width="20" height="20" fill="white" transform="translate(14 14)"></rect>
                </clippath>
              </defs>
            </svg></div>
          <div class="text-heading white-text-colour">Smart Scheduling</div>
          <div class="text">Plan shifts and jobs across staff and sites with intelligent conflict detection.</div>
        </div>
        <div class="feature-card">
          <div class="icon-embed-medium w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 48 48" fill="none" preserveaspectratio="xMidYMid meet" aria-hidden="true" role="img">
              <rect width="48" height="48" rx="24" fill="white"></rect>
              <g clip-path="url(#clip0_128_88)">
                <rect width="20" height="20" transform="translate(14 14)" fill="white" fill-opacity="0.01"></rect>
                <path d="M27.75 23.375C27.75 23.0298 28.0298 22.75 28.375 22.75H29.625C29.9702 22.75 30.25 23.0298 30.25 23.375V24.625C30.25 24.9702 29.9702 25.25 29.625 25.25H28.375C28.0298 25.25 27.75 24.9702 27.75 24.625V23.375Z" fill="#008080"></path>
                <path d="M18.375 14C18.7202 14 19 14.2798 19 14.625V15.25H29V14.625C29 14.2798 29.2798 14 29.625 14C29.9702 14 30.25 14.2798 30.25 14.625V15.25H31.5C32.8807 15.25 34 16.3693 34 17.75V31.5C34 32.8807 32.8807 34 31.5 34H16.5C15.1193 34 14 32.8807 14 31.5V17.75C14 16.3693 15.1193 15.25 16.5 15.25H17.75V14.625C17.75 14.2798 18.0298 14 18.375 14ZM16.5 16.5C15.8096 16.5 15.25 17.0596 15.25 17.75V31.5C15.25 32.1904 15.8096 32.75 16.5 32.75H31.5C32.1904 32.75 32.75 32.1904 32.75 31.5V17.75C32.75 17.0596 32.1904 16.5 31.5 16.5H16.5Z" fill="#008080"></path>
                <path d="M17.125 19C17.125 18.6548 17.4048 18.375 17.75 18.375H30.25C30.5952 18.375 30.875 18.6548 30.875 19V20.25C30.875 20.5952 30.5952 20.875 30.25 20.875H17.75C17.4048 20.875 17.125 20.5952 17.125 20.25V19Z" fill="#008080"></path>
              </g>
              <defs>
                <clippath id="clip0_128_88">
                  <rect width="20" height="20" fill="white" transform="translate(14 14)"></rect>
                </clippath>
              </defs>
            </svg></div>
          <div class="text-heading white-text-colour">Smart Scheduling</div>
          <div class="text">Plan shifts and jobs across staff and sites with intelligent conflict detection.</div>
        </div>
      </div>
    </div>
  </section>
  <section class="how-it-works-section">
    <div class="w-layout-blockcontainer w-container">
      <h2>How MaboCore Works</h2>
      <div class="text black-text-colour centre-text">Streamline your entire operation in three simple steps.</div>
    </div>
    <div class="w-layout-blockcontainer bttm-container-features w-container">
      <div class="features-grid">
        <div class="steps-features-div">
          <div class="icon-embed-custom-4 w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 96 96" fill="none" preserveaspectratio="xMidYMid meet" aria-hidden="true" role="img">
              <rect x="3" y="3" width="90" height="90" rx="45" fill="white"></rect>
              <rect x="3" y="3" width="90" height="90" rx="45" stroke="#F0F0F0" stroke-width="6"></rect>
              <path d="M46.3203 45.4609V49.1523C46.3203 50.7539 46.1494 52.1357 45.8076 53.2979C45.4658 54.4502 44.9727 55.3975 44.3281 56.1396C43.6934 56.8721 42.9365 57.4141 42.0576 57.7656C41.1787 58.1172 40.2021 58.293 39.1279 58.293C38.2686 58.293 37.4678 58.1855 36.7256 57.9707C35.9834 57.7461 35.3145 57.3994 34.7188 56.9307C34.1328 56.4619 33.625 55.8711 33.1953 55.1582C32.7754 54.4355 32.4531 53.5762 32.2285 52.5801C32.0039 51.584 31.8916 50.4414 31.8916 49.1523V45.4609C31.8916 43.8594 32.0625 42.4873 32.4043 41.3447C32.7559 40.1924 33.249 39.25 33.8838 38.5176C34.5283 37.7852 35.29 37.248 36.1689 36.9062C37.0479 36.5547 38.0244 36.3789 39.0986 36.3789C39.958 36.3789 40.7539 36.4912 41.4863 36.7158C42.2285 36.9307 42.8975 37.2676 43.4932 37.7266C44.0889 38.1855 44.5967 38.7764 45.0166 39.499C45.4365 40.2119 45.7588 41.0664 45.9834 42.0625C46.208 43.0488 46.3203 44.1816 46.3203 45.4609ZM42.0869 49.709V44.8896C42.0869 44.1182 42.043 43.4443 41.9551 42.8682C41.877 42.292 41.7549 41.8037 41.5889 41.4033C41.4229 40.9932 41.2178 40.6611 40.9736 40.4072C40.7295 40.1533 40.4512 39.9678 40.1387 39.8506C39.8262 39.7334 39.4795 39.6748 39.0986 39.6748C38.6201 39.6748 38.1953 39.7676 37.8242 39.9531C37.4629 40.1387 37.1553 40.4365 36.9014 40.8467C36.6475 41.2471 36.4521 41.7842 36.3154 42.458C36.1885 43.1221 36.125 43.9326 36.125 44.8896V49.709C36.125 50.4805 36.1641 51.1592 36.2422 51.7451C36.3301 52.3311 36.457 52.834 36.623 53.2539C36.7988 53.6641 37.0039 54.001 37.2383 54.2646C37.4824 54.5186 37.7607 54.7041 38.0732 54.8213C38.3955 54.9385 38.7471 54.9971 39.1279 54.9971C39.5967 54.9971 40.0117 54.9043 40.373 54.7188C40.7441 54.5234 41.0566 54.2207 41.3105 53.8105C41.5742 53.3906 41.7695 52.8438 41.8965 52.1699C42.0234 51.4961 42.0869 50.6758 42.0869 49.709ZM59.4746 36.6279V58H55.2559V41.4912L50.1875 43.1025V39.7773L59.0205 36.6279H59.4746Z" fill="#08979C"></path>
            </svg></div>
          <div class="progress-bar"></div>
          <div class="text-heading">Create schedules</div>
          <div class="text light-grey-text">Drag and drop shifts, assign staff, and publish to their mobile app instantly.</div>
        </div>
        <div class="steps-features-div">
          <div class="icon-embed-custom-4 w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 96 96" fill="none" preserveaspectratio="xMidYMid meet" aria-hidden="true" role="img">
              <rect x="3" y="3" width="90" height="90" rx="45" fill="white"></rect>
              <rect x="3" y="3" width="90" height="90" rx="45" stroke="#F0F0F0" stroke-width="6"></rect>
              <path d="M46.3203 45.4609V49.1523C46.3203 50.7539 46.1494 52.1357 45.8076 53.2979C45.4658 54.4502 44.9727 55.3975 44.3281 56.1396C43.6934 56.8721 42.9365 57.4141 42.0576 57.7656C41.1787 58.1172 40.2021 58.293 39.1279 58.293C38.2686 58.293 37.4678 58.1855 36.7256 57.9707C35.9834 57.7461 35.3145 57.3994 34.7188 56.9307C34.1328 56.4619 33.625 55.8711 33.1953 55.1582C32.7754 54.4355 32.4531 53.5762 32.2285 52.5801C32.0039 51.584 31.8916 50.4414 31.8916 49.1523V45.4609C31.8916 43.8594 32.0625 42.4873 32.4043 41.3447C32.7559 40.1924 33.249 39.25 33.8838 38.5176C34.5283 37.7852 35.29 37.248 36.1689 36.9062C37.0479 36.5547 38.0244 36.3789 39.0986 36.3789C39.958 36.3789 40.7539 36.4912 41.4863 36.7158C42.2285 36.9307 42.8975 37.2676 43.4932 37.7266C44.0889 38.1855 44.5967 38.7764 45.0166 39.499C45.4365 40.2119 45.7588 41.0664 45.9834 42.0625C46.208 43.0488 46.3203 44.1816 46.3203 45.4609ZM42.0869 49.709V44.8896C42.0869 44.1182 42.043 43.4443 41.9551 42.8682C41.877 42.292 41.7549 41.8037 41.5889 41.4033C41.4229 40.9932 41.2178 40.6611 40.9736 40.4072C40.7295 40.1533 40.4512 39.9678 40.1387 39.8506C39.8262 39.7334 39.4795 39.6748 39.0986 39.6748C38.6201 39.6748 38.1953 39.7676 37.8242 39.9531C37.4629 40.1387 37.1553 40.4365 36.9014 40.8467C36.6475 41.2471 36.4521 41.7842 36.3154 42.458C36.1885 43.1221 36.125 43.9326 36.125 44.8896V49.709C36.125 50.4805 36.1641 51.1592 36.2422 51.7451C36.3301 52.3311 36.457 52.834 36.623 53.2539C36.7988 53.6641 37.0039 54.001 37.2383 54.2646C37.4824 54.5186 37.7607 54.7041 38.0732 54.8213C38.3955 54.9385 38.7471 54.9971 39.1279 54.9971C39.5967 54.9971 40.0117 54.9043 40.373 54.7188C40.7441 54.5234 41.0566 54.2207 41.3105 53.8105C41.5742 53.3906 41.7695 52.8438 41.8965 52.1699C42.0234 51.4961 42.0869 50.6758 42.0869 49.709ZM63.7812 54.7041V58H49.1914V55.1875L56.0908 47.79C56.7842 47.0186 57.3311 46.3398 57.7314 45.7539C58.1318 45.1582 58.4199 44.626 58.5957 44.1572C58.7812 43.6787 58.874 43.2246 58.874 42.7949C58.874 42.1504 58.7666 41.5986 58.5518 41.1396C58.3369 40.6709 58.0195 40.3096 57.5996 40.0557C57.1895 39.8018 56.6816 39.6748 56.0762 39.6748C55.4316 39.6748 54.875 39.8311 54.4062 40.1436C53.9473 40.4561 53.5957 40.8906 53.3516 41.4473C53.1172 42.0039 53 42.6338 53 43.3369H48.7666C48.7666 42.0674 49.0693 40.9053 49.6748 39.8506C50.2803 38.7861 51.1348 37.9414 52.2383 37.3164C53.3418 36.6816 54.6504 36.3643 56.1641 36.3643C57.6582 36.3643 58.918 36.6084 59.9434 37.0967C60.9785 37.5752 61.7598 38.2686 62.2871 39.1768C62.8242 40.0752 63.0928 41.1494 63.0928 42.3994C63.0928 43.1025 62.9805 43.791 62.7559 44.4648C62.5312 45.1289 62.209 45.793 61.7891 46.457C61.3789 47.1113 60.8809 47.7754 60.2949 48.4492C59.709 49.123 59.0596 49.8213 58.3467 50.5439L54.6406 54.7041H63.7812Z" fill="#08979C"></path>
            </svg></div>
          <div class="text-heading">Create schedules</div>
          <div class="text light-grey-text">Drag and drop shifts, assign staff, and publish to their mobile app instantly.</div>
          <div class="progress-bar"></div>
        </div>
        <div class="steps-features-div">
          <div class="icon-embed-custom-4 w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 96 96" fill="none" preserveaspectratio="xMidYMid meet" aria-hidden="true" role="img">
              <rect x="3" y="3" width="90" height="90" rx="45" fill="white"></rect>
              <rect x="3" y="3" width="90" height="90" rx="45" stroke="#F0F0F0" stroke-width="6"></rect>
              <path d="M46.3203 45.4609V49.1523C46.3203 50.7539 46.1494 52.1357 45.8076 53.2979C45.4658 54.4502 44.9727 55.3975 44.3281 56.1396C43.6934 56.8721 42.9365 57.4141 42.0576 57.7656C41.1787 58.1172 40.2021 58.293 39.1279 58.293C38.2686 58.293 37.4678 58.1855 36.7256 57.9707C35.9834 57.7461 35.3145 57.3994 34.7188 56.9307C34.1328 56.4619 33.625 55.8711 33.1953 55.1582C32.7754 54.4355 32.4531 53.5762 32.2285 52.5801C32.0039 51.584 31.8916 50.4414 31.8916 49.1523V45.4609C31.8916 43.8594 32.0625 42.4873 32.4043 41.3447C32.7559 40.1924 33.249 39.25 33.8838 38.5176C34.5283 37.7852 35.29 37.248 36.1689 36.9062C37.0479 36.5547 38.0244 36.3789 39.0986 36.3789C39.958 36.3789 40.7539 36.4912 41.4863 36.7158C42.2285 36.9307 42.8975 37.2676 43.4932 37.7266C44.0889 38.1855 44.5967 38.7764 45.0166 39.499C45.4365 40.2119 45.7588 41.0664 45.9834 42.0625C46.208 43.0488 46.3203 44.1816 46.3203 45.4609ZM42.0869 49.709V44.8896C42.0869 44.1182 42.043 43.4443 41.9551 42.8682C41.877 42.292 41.7549 41.8037 41.5889 41.4033C41.4229 40.9932 41.2178 40.6611 40.9736 40.4072C40.7295 40.1533 40.4512 39.9678 40.1387 39.8506C39.8262 39.7334 39.4795 39.6748 39.0986 39.6748C38.6201 39.6748 38.1953 39.7676 37.8242 39.9531C37.4629 40.1387 37.1553 40.4365 36.9014 40.8467C36.6475 41.2471 36.4521 41.7842 36.3154 42.458C36.1885 43.1221 36.125 43.9326 36.125 44.8896V49.709C36.125 50.4805 36.1641 51.1592 36.2422 51.7451C36.3301 52.3311 36.457 52.834 36.623 53.2539C36.7988 53.6641 37.0039 54.001 37.2383 54.2646C37.4824 54.5186 37.7607 54.7041 38.0732 54.8213C38.3955 54.9385 38.7471 54.9971 39.1279 54.9971C39.5967 54.9971 40.0117 54.9043 40.373 54.7188C40.7441 54.5234 41.0566 54.2207 41.3105 53.8105C41.5742 53.3906 41.7695 52.8438 41.8965 52.1699C42.0234 51.4961 42.0869 50.6758 42.0869 49.709ZM53.5127 45.5049H55.7686C56.4912 45.5049 57.0869 45.3828 57.5557 45.1387C58.0244 44.8848 58.3711 44.5332 58.5957 44.084C58.8301 43.625 58.9473 43.0928 58.9473 42.4873C58.9473 41.9404 58.8398 41.457 58.625 41.0371C58.4199 40.6074 58.1025 40.2754 57.6729 40.041C57.2432 39.7969 56.7012 39.6748 56.0469 39.6748C55.5293 39.6748 55.0508 39.7773 54.6113 39.9824C54.1719 40.1875 53.8203 40.4756 53.5566 40.8467C53.293 41.2178 53.1611 41.667 53.1611 42.1943H48.9277C48.9277 41.0225 49.2402 40.002 49.8652 39.1328C50.5 38.2637 51.3496 37.585 52.4141 37.0967C53.4785 36.6084 54.6504 36.3643 55.9297 36.3643C57.375 36.3643 58.6396 36.5986 59.7236 37.0674C60.8076 37.5264 61.6523 38.2051 62.2578 39.1035C62.8633 40.002 63.166 41.1152 63.166 42.4434C63.166 43.1172 63.0098 43.7715 62.6973 44.4062C62.3848 45.0312 61.9355 45.5977 61.3496 46.1055C60.7734 46.6035 60.0703 47.0039 59.2402 47.3066C58.4102 47.5996 57.4775 47.7461 56.4424 47.7461H53.5127V45.5049ZM53.5127 48.7129V46.5303H56.4424C57.6045 46.5303 58.625 46.6621 59.5039 46.9258C60.3828 47.1895 61.1201 47.5703 61.7158 48.0684C62.3115 48.5566 62.7607 49.1377 63.0635 49.8115C63.3662 50.4756 63.5176 51.2129 63.5176 52.0234C63.5176 53.0195 63.3271 53.9082 62.9463 54.6895C62.5654 55.4609 62.0283 56.1152 61.335 56.6523C60.6514 57.1895 59.8506 57.5996 58.9326 57.8828C58.0146 58.1562 57.0137 58.293 55.9297 58.293C55.0312 58.293 54.1475 58.1709 53.2783 57.9268C52.4189 57.6729 51.6377 57.2969 50.9346 56.7988C50.2412 56.291 49.6846 55.6562 49.2646 54.8945C48.8545 54.123 48.6494 53.21 48.6494 52.1553H52.8828C52.8828 52.7021 53.0195 53.1904 53.293 53.6201C53.5664 54.0498 53.9424 54.3867 54.4209 54.6309C54.9092 54.875 55.4512 54.9971 56.0469 54.9971C56.7207 54.9971 57.2969 54.875 57.7754 54.6309C58.2637 54.377 58.6348 54.0254 58.8887 53.5762C59.1523 53.1172 59.2842 52.585 59.2842 51.9795C59.2842 51.1982 59.1426 50.5732 58.8594 50.1045C58.5762 49.626 58.1709 49.2744 57.6436 49.0498C57.1162 48.8252 56.4912 48.7129 55.7686 48.7129H53.5127Z" fill="#08979C"></path>
            </svg></div>
          <div class="text-heading">Create schedules</div>
          <div class="text light-grey-text">Drag and drop shifts, assign staff, and publish to their mobile app instantly.</div>
        </div>
      </div>
    </div>
  </section>
  <section class="testimonial-section">
    <div class="w-layout-blockcontainer top-testimonial-container w-container">
      <div class="text light-grey-text centre">Trusted by service teams across Australia</div>
      <div class="text-heading centre">Used by hundreds of managers daily</div>
    </div>
    <div class="w-layout-blockcontainer bttm-testimonial-container w-container">
      <div class="testimonial-grid">
        <div class="testimonial-card">
          <div class="text black-text-colour semi-bold">Sarah Chen</div>
          <div class="text light-grey-text _12-px-text-size">Operations Manager, HomeFirst Care</div>
          <div class="text light-grey-text">&quot;Cut scheduling time in half. Our team loves the mobile app.&quot;</div>
        </div>
        <div class="testimonial-card">
          <div class="text black-text-colour semi-bold">Sarah Chen</div>
          <div class="text light-grey-text _12-px-text-size">Operations Manager, HomeFirst Care</div>
          <div class="text light-grey-text">&quot;Cut scheduling time in half. Our team loves the mobile app.&quot;</div>
        </div>
        <div class="testimonial-card">
          <div class="text black-text-colour semi-bold">Sarah Chen</div>
          <div class="text light-grey-text _12-px-text-size">Operations Manager, HomeFirst Care</div>
          <div class="text light-grey-text">&quot;Cut scheduling time in half. Our team loves the mobile app.&quot;</div>
        </div>
        <div class="testimonial-card">
          <div class="text black-text-colour semi-bold">Sarah Chen</div>
          <div class="text light-grey-text _12-px-text-size">Operations Manager, HomeFirst Care</div>
          <div class="text light-grey-text">&quot;Cut scheduling time in half. Our team loves the mobile app.&quot;</div>
        </div>
      </div>
    </div>
  </section>
  <section class="industry-section">
    <div class="w-layout-blockcontainer top-industry-container w-container">
      <div class="text green-text-colour">Industries</div>
      <div class="text black-text-colour semi-bold">Built for your specific needs</div>
    </div>
    <div class="w-layout-blockcontainer bttm-industry-container w-container">
      <div class="industry-grid">
        <div data-w-id="1a8859fe-fe03-91a5-e7a2-ee7c209f63d5" class="industry-card">
          <div class="icon-embed-medium w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 48 48" fill="none" preserveaspectratio="xMidYMid meet" aria-hidden="true" role="img">
              <rect width="48" height="48" rx="12" fill="#FFF1F0"></rect>
              <g clip-path="url(#clip0_128_116)">
                <rect width="24" height="24" transform="translate(12 12)" fill="white" fill-opacity="0.01"></rect>
                <path d="M24 16.1221L22.9249 15.017C20.3984 12.4201 15.7712 13.3165 14.1005 16.5793C13.3767 17.9929 13.1697 19.9842 14.2624 22.5H12.6454C9.45296 13.9543 18.8918 9.25531 23.7365 13.7146C23.8259 13.797 23.9138 13.8824 24 13.971C24.0862 13.8824 24.1741 13.797 24.2635 13.7146C29.1082 9.2553 38.547 13.9543 35.3546 22.5H33.7376C34.8303 19.9842 34.6233 17.9929 33.8995 16.5793C32.2288 13.3165 27.6016 12.4201 25.0751 15.017L24 16.1221Z" fill="#CF1322"></path>
                <path d="M15.3181 27H17.2904C18.8896 28.7749 21.077 30.6868 24 32.6919C26.923 30.6868 29.1104 28.7749 30.7096 27H32.6819C30.784 29.3497 27.9725 31.8751 24 34.5C20.0275 31.8751 17.216 29.3497 15.3181 27Z" fill="#CF1322"></path>
                <path d="M27.6964 16.9715C27.5772 16.6737 27.282 16.4846 26.9617 16.501C26.6414 16.5174 26.367 16.7356 26.2789 17.044L23.8816 25.4345L21.6964 19.9715C21.5929 19.7129 21.3547 19.5329 21.0777 19.504C20.8006 19.4752 20.5305 19.6022 20.376 19.834L17.5986 24H12.75C12.3358 24 12 24.3358 12 24.75C12 25.1642 12.3358 25.5 12.75 25.5H18C18.2508 25.5 18.4849 25.3747 18.624 25.166L20.8332 21.8523L23.3036 28.0285C23.4228 28.3263 23.718 28.5154 24.0383 28.499C24.3586 28.4826 24.633 28.2644 24.7211 27.956L27.1184 19.5655L29.3036 25.0285C29.4175 25.3133 29.6933 25.5 30 25.5H35.25C35.6642 25.5 36 25.1642 36 24.75C36 24.3358 35.6642 24 35.25 24H30.5078L27.6964 16.9715Z" fill="#CF1322"></path>
              </g>
              <defs>
                <clippath id="clip0_128_116">
                  <rect width="24" height="24" fill="white" transform="translate(12 12)"></rect>
                </clippath>
              </defs>
            </svg></div>
          <div class="image-hero-card-text-bold">Care Providers</div>
          <div>Manage home visits, care plans, and compliance effortlessly.</div>
          <a href="#" class="learn-more-link w-inline-block">
            <div>Learn More</div>
            <div class="icon-embed-custom-5 w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 7 13" fill="none" preserveaspectratio="xMidYMid meet" aria-hidden="true" role="img">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.146447 0.146447C0.341709 -0.0488155 0.658291 -0.0488155 0.853553 0.146447L6.85355 6.14645C7.04882 6.34171 7.04882 6.65829 6.85355 6.85355L0.853553 12.8536C0.658291 13.0488 0.341709 13.0488 0.146447 12.8536C-0.0488155 12.6583 -0.0488155 12.3417 0.146447 12.1464L5.79289 6.5L0.146447 0.853553C-0.0488155 0.658291 -0.0488155 0.341709 0.146447 0.146447Z" fill="currentColor"></path>
              </svg></div>
          </a>
        </div>
        <div data-w-id="e88f9e91-9cc5-2c4d-05a2-a5e18dd285df" class="industry-card">
          <div class="icon-embed-medium w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 48 48" fill="none" preserveaspectratio="xMidYMid meet" aria-hidden="true" role="img">
              <rect width="48" height="48" rx="12" fill="#FFF1F0"></rect>
              <g clip-path="url(#clip0_128_116)">
                <rect width="24" height="24" transform="translate(12 12)" fill="white" fill-opacity="0.01"></rect>
                <path d="M24 16.1221L22.9249 15.017C20.3984 12.4201 15.7712 13.3165 14.1005 16.5793C13.3767 17.9929 13.1697 19.9842 14.2624 22.5H12.6454C9.45296 13.9543 18.8918 9.25531 23.7365 13.7146C23.8259 13.797 23.9138 13.8824 24 13.971C24.0862 13.8824 24.1741 13.797 24.2635 13.7146C29.1082 9.2553 38.547 13.9543 35.3546 22.5H33.7376C34.8303 19.9842 34.6233 17.9929 33.8995 16.5793C32.2288 13.3165 27.6016 12.4201 25.0751 15.017L24 16.1221Z" fill="#CF1322"></path>
                <path d="M15.3181 27H17.2904C18.8896 28.7749 21.077 30.6868 24 32.6919C26.923 30.6868 29.1104 28.7749 30.7096 27H32.6819C30.784 29.3497 27.9725 31.8751 24 34.5C20.0275 31.8751 17.216 29.3497 15.3181 27Z" fill="#CF1322"></path>
                <path d="M27.6964 16.9715C27.5772 16.6737 27.282 16.4846 26.9617 16.501C26.6414 16.5174 26.367 16.7356 26.2789 17.044L23.8816 25.4345L21.6964 19.9715C21.5929 19.7129 21.3547 19.5329 21.0777 19.504C20.8006 19.4752 20.5305 19.6022 20.376 19.834L17.5986 24H12.75C12.3358 24 12 24.3358 12 24.75C12 25.1642 12.3358 25.5 12.75 25.5H18C18.2508 25.5 18.4849 25.3747 18.624 25.166L20.8332 21.8523L23.3036 28.0285C23.4228 28.3263 23.718 28.5154 24.0383 28.499C24.3586 28.4826 24.633 28.2644 24.7211 27.956L27.1184 19.5655L29.3036 25.0285C29.4175 25.3133 29.6933 25.5 30 25.5H35.25C35.6642 25.5 36 25.1642 36 24.75C36 24.3358 35.6642 24 35.25 24H30.5078L27.6964 16.9715Z" fill="#CF1322"></path>
              </g>
              <defs>
                <clippath id="clip0_128_116">
                  <rect width="24" height="24" fill="white" transform="translate(12 12)"></rect>
                </clippath>
              </defs>
            </svg></div>
          <div class="image-hero-card-text-bold">Care Providers</div>
          <div>Manage home visits, care plans, and compliance effortlessly.</div>
          <a href="#" class="learn-more-link w-inline-block">
            <div>Learn More</div>
            <div class="icon-embed-custom-5 w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 7 13" fill="none" preserveaspectratio="xMidYMid meet" aria-hidden="true" role="img">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.146447 0.146447C0.341709 -0.0488155 0.658291 -0.0488155 0.853553 0.146447L6.85355 6.14645C7.04882 6.34171 7.04882 6.65829 6.85355 6.85355L0.853553 12.8536C0.658291 13.0488 0.341709 13.0488 0.146447 12.8536C-0.0488155 12.6583 -0.0488155 12.3417 0.146447 12.1464L5.79289 6.5L0.146447 0.853553C-0.0488155 0.658291 -0.0488155 0.341709 0.146447 0.146447Z" fill="currentColor"></path>
              </svg></div>
          </a>
        </div>
        <div data-w-id="68dbc269-85bd-57ce-b156-eeedaa2790ff" class="industry-card">
          <div class="icon-embed-medium w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 48 48" fill="none" preserveaspectratio="xMidYMid meet" aria-hidden="true" role="img">
              <rect width="48" height="48" rx="12" fill="#FFF1F0"></rect>
              <g clip-path="url(#clip0_128_116)">
                <rect width="24" height="24" transform="translate(12 12)" fill="white" fill-opacity="0.01"></rect>
                <path d="M24 16.1221L22.9249 15.017C20.3984 12.4201 15.7712 13.3165 14.1005 16.5793C13.3767 17.9929 13.1697 19.9842 14.2624 22.5H12.6454C9.45296 13.9543 18.8918 9.25531 23.7365 13.7146C23.8259 13.797 23.9138 13.8824 24 13.971C24.0862 13.8824 24.1741 13.797 24.2635 13.7146C29.1082 9.2553 38.547 13.9543 35.3546 22.5H33.7376C34.8303 19.9842 34.6233 17.9929 33.8995 16.5793C32.2288 13.3165 27.6016 12.4201 25.0751 15.017L24 16.1221Z" fill="#CF1322"></path>
                <path d="M15.3181 27H17.2904C18.8896 28.7749 21.077 30.6868 24 32.6919C26.923 30.6868 29.1104 28.7749 30.7096 27H32.6819C30.784 29.3497 27.9725 31.8751 24 34.5C20.0275 31.8751 17.216 29.3497 15.3181 27Z" fill="#CF1322"></path>
                <path d="M27.6964 16.9715C27.5772 16.6737 27.282 16.4846 26.9617 16.501C26.6414 16.5174 26.367 16.7356 26.2789 17.044L23.8816 25.4345L21.6964 19.9715C21.5929 19.7129 21.3547 19.5329 21.0777 19.504C20.8006 19.4752 20.5305 19.6022 20.376 19.834L17.5986 24H12.75C12.3358 24 12 24.3358 12 24.75C12 25.1642 12.3358 25.5 12.75 25.5H18C18.2508 25.5 18.4849 25.3747 18.624 25.166L20.8332 21.8523L23.3036 28.0285C23.4228 28.3263 23.718 28.5154 24.0383 28.499C24.3586 28.4826 24.633 28.2644 24.7211 27.956L27.1184 19.5655L29.3036 25.0285C29.4175 25.3133 29.6933 25.5 30 25.5H35.25C35.6642 25.5 36 25.1642 36 24.75C36 24.3358 35.6642 24 35.25 24H30.5078L27.6964 16.9715Z" fill="#CF1322"></path>
              </g>
              <defs>
                <clippath id="clip0_128_116">
                  <rect width="24" height="24" fill="white" transform="translate(12 12)"></rect>
                </clippath>
              </defs>
            </svg></div>
          <div class="image-hero-card-text-bold">Care Providers</div>
          <div>Manage home visits, care plans, and compliance effortlessly.</div>
          <a href="#" class="learn-more-link w-inline-block">
            <div>Learn More</div>
            <div class="icon-embed-custom-5 w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 7 13" fill="none" preserveaspectratio="xMidYMid meet" aria-hidden="true" role="img">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.146447 0.146447C0.341709 -0.0488155 0.658291 -0.0488155 0.853553 0.146447L6.85355 6.14645C7.04882 6.34171 7.04882 6.65829 6.85355 6.85355L0.853553 12.8536C0.658291 13.0488 0.341709 13.0488 0.146447 12.8536C-0.0488155 12.6583 -0.0488155 12.3417 0.146447 12.1464L5.79289 6.5L0.146447 0.853553C-0.0488155 0.658291 -0.0488155 0.341709 0.146447 0.146447Z" fill="currentColor"></path>
              </svg></div>
          </a>
        </div>
      </div>
    </div>
  </section>
  <section class="cta-section">
    <div class="w-layout-blockcontainer cta-container w-container">
      <div class="centre white-text-colour">Join thousands of managers who save 15+ hours a week with MaboCore.</div>
      <div class="cta-button-div">
        <a href="#" class="cta-button w-inline-block">
          <div class="text-block-3">Start free trial</div>
        </a>
        <a href="#" class="cta-button transperant-background w-inline-block">
          <div class="text-block-3">Book a Demo</div>
        </a>
      </div>
    </div>
  </section>
    </>
  );
};

export default HomePageContent;