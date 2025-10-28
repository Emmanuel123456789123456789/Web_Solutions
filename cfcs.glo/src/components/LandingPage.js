import React from 'react';

const LandingPage = ({ onEnterApp }) => {

    // Placeholder data for the new sections
    const testimonials = [
        { id: 1, quote: "CFCS revolutionized how we track tithes. The reports are a blessing!", author: "Elder John, Finance Committee" },
        { id: 2, quote: "Simple, secure, and transparent. The Viewer Mode has been fantastic for our board meetings.", author: "Pastor Lena M., Head of Ministry" },
        { id: 3, quote: "I can easily manage weekly offerings and see the balance grow. Highly recommended!", author: "Kate, System Administrator" },
    ];

    const impactStats = [
        { label: "Total Transactions Recorded", value: "2,500+" },
        { label: "Hours Saved on Reporting", value: "100+" },
        { label: "Compliance Score", value: "99.9%" },
    ];

  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1 className="landing-title">
          ⛪ Church Financial Control System (CFCS)
        </h1>
        <p className="landing-subtitle">
          Secure, Transparent, and Simplified Financial Management
        </p>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="hero-content">
            <h2>Empower Your Ministry with Clarity</h2>
            <p>
              CFCS provides Church leaders and finance teams with a dedicated tool to track
              contributions, manage expenses, and generate transparent financial reports with ease.
            </p>
            
            {/* Call to Action Button */}
            <button 
              onClick={onEnterApp} 
              className="landing-cta-btn"
            >
              Go to Secure Login
            </button>
          </div>
          <div className="hero-image">
            <span role="img" aria-label="Finance icon" style={{ fontSize: '100px', color: '#007bff' }}>
              📈
            </span>
          </div>
        </section>

        {/* 💡 NEW FEATURE 1: Impact Counter */}
        <section className="impact-counter-section">
            {impactStats.map((stat, index) => (
                <div key={index} className="impact-stat-card">
                    <p className="impact-value">{stat.value}</p>
                    <p className="impact-label">{stat.label}</p>
                </div>
            ))}
        </section>
        
        {/* --- */}

        <section className="landing-features">
          <h3>Key System Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <h4>Transparency</h4>
              <p>Generate instant, read-only reports for church leadership review (Viewer Mode).</p>
            </div>
            <div className="feature-card">
              <h4>Compliance</h4>
              <p>Maintain clear, chronological records of all tithes, offerings, and expenditures.</p>
            </div>
            <div className="feature-card">
              <h4>Security</h4>
              <p>Role-based access ensures only authorized personnel can enter or modify data.</p>
            </div>
          </div>
        </section>

        {/* --- */}

        {/* 💡 NEW FEATURE 2: Testimonials Slider */}
        <section className="testimonials-section">
            <h3>Hear From Our Users</h3>
            <div className="testimonials-scroll-wrapper">
                {testimonials.map((t) => (
                    <div key={t.id} className="testimonial-card">
                        <p className="testimonial-quote">"{t.quote}"</p>
                        <p className="testimonial-author">- {t.author}</p>
                    </div>
                ))}
            </div>
        </section>
        
      </main>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} CFCS | Dedicated to Financial Stewardship</p>
      </footer>
    </div>
  );
};

export default LandingPage;