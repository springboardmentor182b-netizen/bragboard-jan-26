import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function Register() {
  const [formData, setFormData] = useState({ name:'',email:'',password:'',department:'',security_question:'',security_answer:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredName, setRegisteredName] = useState('');
  const navigate = useNavigate();

  const securityQuestions = [
    "What is your first pet's name?","What is your mother's maiden name?",
    "What city were you born in?","What is your favorite book?","What was the name of your first school?"
  ];

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.register(formData);
      setRegisteredName(formData.name.split(' ')[0]);
      setRegistered(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width:'100%',height:44,padding:'0 14px',border:'1.5px solid #E5E7EB',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box',background:'#FAFBFC',color:'#111827',transition:'all 0.2s' };
  const onFocus = e => { e.target.style.borderColor='#4F46E5'; e.target.style.boxShadow='0 0 0 3px rgba(79,70,229,0.1)'; e.target.style.background='#fff'; };
  const onBlur  = e => { e.target.style.borderColor='#E5E7EB'; e.target.style.boxShadow='none'; e.target.style.background='#FAFBFC'; };

  if (registered) {
    return (
      <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#F8FAFC',fontFamily:"'Inter',sans-serif",padding:24 }}>
        <div style={{ maxWidth:460,width:'100%' }}>
          <div style={{ textAlign:'center',marginBottom:28 }}>
            <div style={{ width:44,height:44,background:'linear-gradient(135deg,#4F46E5,#6366F1)',borderRadius:12,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:24,marginBottom:12 }}>🏆</div>
            <h1 style={{ fontSize:22,fontWeight:800,color:'#111827',margin:0 }}>BragBoard</h1>
          </div>
          <div style={{ background:'#fff',borderRadius:20,padding:'40px 36px',boxShadow:'0 4px 24px rgba(0,0,0,0.08)',textAlign:'center' }}>
            <div style={{ width:72,height:72,borderRadius:'50%',background:'linear-gradient(135deg,#10B981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 4px 16px rgba(16,185,129,0.3)',fontSize:32 }}>✓</div>
            <h2 style={{ fontSize:22,fontWeight:800,color:'#111827',margin:'0 0 8px' }}>You're registered, {registeredName}!</h2>
            <p style={{ fontSize:14,color:'#6B7280',margin:'0 0 28px',lineHeight:1.6 }}>
              Your account is <strong style={{ color:'#D97706' }}>pending admin approval</strong>.<br/>
              An admin will review and grant access.
            </p>
            <div style={{ background:'#F9FAFB',borderRadius:12,padding:20,marginBottom:28,textAlign:'left' }}>
              <p style={{ fontSize:11,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.5px',margin:'0 0 14px' }}>What happens next</p>
              {[{icon:'📬',text:'Your registration is now in the admin queue'},{icon:'👀',text:'An admin will review your account'},{icon:'✅',text:'Once approved, you can sign in and start recognising colleagues'}].map((s,i)=>(
                <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:12,marginBottom:i<2?12:0 }}>
                  <span style={{ fontSize:18,flexShrink:0,marginTop:1 }}>{s.icon}</span>
                  <p style={{ fontSize:13,color:'#374151',margin:0,lineHeight:1.5 }}>{s.text}</p>
                </div>
              ))}
            </div>
            <button onClick={()=>navigate('/login')} style={{ width:'100%',height:48,borderRadius:12,border:'none',background:'linear-gradient(135deg,#4F46E5,#6366F1)',color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',boxShadow:'0 4px 12px rgba(79,70,229,0.3)',transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';}} onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';}}>
              Back to Sign In
            </button>
          </div>
        </div>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');*{font-family:'Inter',-apple-system,sans-serif;}`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh',display:'flex',fontFamily:"'Inter',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{font-family:'Inter',-apple-system,sans-serif;}::placeholder{color:#9CA3AF;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .reg-left{display:none !important;}.reg-mobile-logo{display:flex !important;}
        @media(min-width:900px){.reg-left{display:flex !important;}.reg-mobile-logo{display:none !important;}}
      `}</style>

      {/* LEFT PANEL */}
      <div className="reg-left" style={{ flex:'0 0 380px',background:'linear-gradient(160deg,#4F46E5 0%,#7C3AED 60%,#0EA5E9 100%)',padding:'44px 40px',flexDirection:'column',justifyContent:'space-between',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',top:-80,right:-80,width:300,height:300,borderRadius:'50%',background:'rgba(255,255,255,0.06)' }}/>
        <div style={{ position:'absolute',bottom:40,left:-50,width:220,height:220,borderRadius:'50%',background:'rgba(255,255,255,0.05)' }}/>

        <div style={{ display:'flex',alignItems:'center',gap:12,position:'relative',zIndex:1 }}>
          <div style={{ width:44,height:44,background:'rgba(255,255,255,0.2)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22 }}>🏆</div>
          <span style={{ color:'#fff',fontWeight:800,fontSize:20 }}>BragBoard</span>
        </div>

        <div style={{ position:'relative',zIndex:1 }}>
          <h2 style={{ color:'#fff',fontSize:32,fontWeight:800,lineHeight:1.2,margin:'0 0 14px' }}>Join your team today 🚀</h2>
          <p style={{ color:'rgba(255,255,255,0.8)',fontSize:14,lineHeight:1.7,margin:'0 0 32px' }}>Start recognising the people who make your workplace great.</p>
          {[
            {icon:'🎯',title:'Quick to set up',desc:'Register in under 2 minutes'},
            {icon:'🔒',title:'Secure & private',desc:'JWT auth + admin-approved access'},
            {icon:'🤝',title:'Built for teams',desc:'Multi-recipient shout-outs & tags'},
          ].map((c,i)=>(
            <div key={i} style={{ display:'flex',gap:14,marginBottom:20 }}>
              <div style={{ width:40,height:40,borderRadius:10,background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0 }}>{c.icon}</div>
              <div>
                <p style={{ color:'#fff',fontWeight:700,fontSize:14,margin:'0 0 2px' }}>{c.title}</p>
                <p style={{ color:'rgba(255,255,255,0.7)',fontSize:12,margin:0 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:'rgba(255,255,255,0.1)',borderRadius:14,padding:'16px 18px',position:'relative',zIndex:1,border:'1px solid rgba(255,255,255,0.2)' }}>
          <p style={{ color:'rgba(255,255,255,0.85)',fontSize:13,margin:'0 0 10px',fontStyle:'italic' }}>
            "The onboarding was smooth and the team loved it from day one."
          </p>
          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
            <div style={{ width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#F59E0B,#EF4444)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:12 }}>A</div>
            <span style={{ color:'rgba(255,255,255,0.8)',fontSize:12,fontWeight:600 }}>Alex M. · Team Lead</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:'40px 36px',background:'#F8FAFC',overflowY:'auto' }}>
        <div className="reg-mobile-logo" style={{ marginBottom:24,alignItems:'center',gap:10 }}>
          <div style={{ width:36,height:36,background:'linear-gradient(135deg,#4F46E5,#6366F1)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20 }}>🏆</div>
          <span style={{ fontWeight:800,fontSize:18,color:'#111827' }}>BragBoard</span>
        </div>

        <div style={{ marginBottom:24 }}>
          <h1 style={{ fontSize:26,fontWeight:800,color:'#111827',margin:'0 0 6px' }}>Create your account</h1>
          <p style={{ fontSize:14,color:'#6B7280',margin:0 }}>Fill in the details below to get started</p>
        </div>

        <div style={{ background:'#fff',borderRadius:20,padding:'28px 28px',boxShadow:'0 4px 24px rgba(0,0,0,0.07)',border:'1px solid #E5E7EB' }}>
          <div style={{ marginBottom:20,padding:'11px 14px',background:'#EEF2FF',border:'1px solid #C7D2FE',borderRadius:10,display:'flex',alignItems:'flex-start',gap:10 }}>
            <span style={{ fontSize:15,flexShrink:0 }}>ℹ️</span>
            <p style={{ fontSize:12,color:'#4338CA',margin:0,lineHeight:1.5,fontWeight:500 }}>
              After registering, your account requires <strong>admin approval</strong> before you can log in.
            </p>
          </div>

          {error && (
            <div style={{ marginBottom:20,padding:'12px 16px',background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,color:'#991B1B',fontSize:13 }}>⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* two-column row for name + dept */}
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:16 }}>
              <div>
                <label style={{ display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6 }}>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required minLength="2" placeholder="John Doe" style={inputStyle} onFocus={onFocus} onBlur={onBlur}/>
              </div>
              <div>
                <label style={{ display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6 }}>Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} required placeholder="e.g. Engineering" style={inputStyle} onFocus={onFocus} onBlur={onBlur}/>
              </div>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6 }}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your.email@company.com" style={inputStyle} onFocus={onFocus} onBlur={onBlur}/>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6 }}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" placeholder="At least 8 characters" style={inputStyle} onFocus={onFocus} onBlur={onBlur}/>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6 }}>Security Question</label>
              <select name="security_question" value={formData.security_question} onChange={handleChange} required
                style={{ ...inputStyle, cursor:'pointer', color:formData.security_question?'#1F2937':'#9CA3AF' }} onFocus={onFocus} onBlur={onBlur}>
                <option value="">Select a question…</option>
                {securityQuestions.map((q,i)=><option key={i} value={q}>{q}</option>)}
              </select>
            </div>

            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6 }}>Security Answer</label>
              <input type="text" name="security_answer" value={formData.security_answer} onChange={handleChange} required minLength="2" placeholder="Your answer (for password recovery)" style={inputStyle} onFocus={onFocus} onBlur={onBlur}/>
              <p style={{ fontSize:11,color:'#9CA3AF',margin:'5px 0 0' }}>💡 Remember this — needed if you forget your password</p>
            </div>

            <button type="submit" disabled={loading} style={{ width:'100%',height:48,borderRadius:12,border:'none',background:loading?'#9CA3AF':'linear-gradient(135deg,#4F46E5,#6366F1)',color:'#fff',fontSize:15,fontWeight:700,cursor:loading?'default':'pointer',boxShadow:loading?'none':'0 4px 14px rgba(79,70,229,0.35)',transition:'all 0.2s' }}
              onMouseEnter={e=>{if(!loading)e.currentTarget.style.transform='translateY(-1px)';}} onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';}}>
              {loading?(
                <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                  <svg style={{ animation:'spin 0.8s linear infinite',width:18,height:18 }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                  </svg>Creating account...
                </span>
              ):'Create Account →'}
            </button>
          </form>

          <div style={{ margin:'20px 0',height:1,background:'#F3F4F6' }}/>
          <p style={{ textAlign:'center',fontSize:14,color:'#6B7280',margin:0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#4F46E5',fontWeight:700,textDecoration:'none' }}
              onMouseEnter={e=>e.target.style.textDecoration='underline'} onMouseLeave={e=>e.target.style.textDecoration='none'}>
              Sign in here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Register;
