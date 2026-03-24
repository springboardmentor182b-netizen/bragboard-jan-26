import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, user } = response.data;
      login(user, access_token);
      if (user.role === 'admin') navigate('/admin-dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        ::placeholder { color: #9CA3AF; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .left-panel { display: none !important; }
        .mobile-logo { display: flex !important; }
        @media(min-width:768px){
          .left-panel { display: flex !important; }
          .mobile-logo { display: none !important; }
        }
      `}</style>

      {/* LEFT PANEL */}
      <div className="left-panel" style={{
        flex: 1, background: 'linear-gradient(145deg,#4F46E5 0%,#7C3AED 55%,#0EA5E9 100%)',
        padding: '48px 44px', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute',top:-100,right:-100,width:380,height:380,borderRadius:'50%',background:'rgba(255,255,255,0.05)' }}/>
        <div style={{ position:'absolute',bottom:-60,left:-60,width:260,height:260,borderRadius:'50%',background:'rgba(255,255,255,0.05)' }}/>
        <div style={{ position:'absolute',top:'35%',right:60,width:140,height:140,borderRadius:'50%',background:'rgba(255,255,255,0.04)' }}/>

        <div style={{ display:'flex',alignItems:'center',gap:12,position:'relative',zIndex:1 }}>
          <div style={{ width:44,height:44,background:'rgba(255,255,255,0.2)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24 }}>🏆</div>
          <span style={{ color:'#fff',fontWeight:800,fontSize:22 }}>BragBoard</span>
        </div>

        <div style={{ position:'relative',zIndex:1 }}>
          <div style={{ fontSize:56,marginBottom:16,animation:'float 3s ease-in-out infinite' }}>🎉</div>
          <h2 style={{ color:'#fff',fontSize:38,fontWeight:800,lineHeight:1.15,margin:'0 0 16px' }}>
            Recognise.<br/>Appreciate.<br/>Celebrate.
          </h2>
          <p style={{ color:'rgba(255,255,255,0.8)',fontSize:15,lineHeight:1.7,margin:'0 0 36px' }}>
            Build a culture where every win gets noticed — big or small.
          </p>
          {[
            { icon:'👏', text:'Give shout-outs to teammates instantly' },
            { icon:'⭐', text:'React with likes, claps & stars' },
            { icon:'📊', text:'Leaderboards & department analytics' },
            { icon:'🛡️', text:'Admin moderation & reporting tools' },
          ].map((f,i) => (
            <div key={i} style={{ display:'flex',alignItems:'center',gap:12,marginBottom:14 }}>
              <div style={{ width:36,height:36,borderRadius:10,background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>{f.icon}</div>
              <span style={{ color:'rgba(255,255,255,0.9)',fontSize:14,fontWeight:500 }}>{f.text}</span>
            </div>
          ))}
        </div>

        <div style={{ background:'rgba(255,255,255,0.12)',backdropFilter:'blur(10px)',borderRadius:16,padding:'20px 24px',position:'relative',zIndex:1,border:'1px solid rgba(255,255,255,0.2)' }}>
          <p style={{ color:'rgba(255,255,255,0.9)',fontSize:14,lineHeight:1.6,margin:'0 0 12px',fontStyle:'italic' }}>
            "BragBoard transformed how our team appreciates each other. Engagement jumped in the first week!"
          </p>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <div style={{ width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#F59E0B,#EF4444)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:13 }}>S</div>
            <div>
              <p style={{ color:'#fff',fontSize:13,fontWeight:700,margin:0 }}>Sarah K.</p>
              <p style={{ color:'rgba(255,255,255,0.6)',fontSize:11,margin:0 }}>HR Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width:'100%',maxWidth:480,display:'flex',flexDirection:'column',justifyContent:'center',padding:'48px 40px',background:'#F8FAFC',overflowY:'auto' }}>
        <div className="mobile-logo" style={{ marginBottom:28,alignItems:'center',gap:10 }}>
          <div style={{ width:40,height:40,background:'linear-gradient(135deg,#4F46E5,#6366F1)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22 }}>🏆</div>
          <span style={{ fontWeight:800,fontSize:20,color:'#111827' }}>BragBoard</span>
        </div>

        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:30,fontWeight:800,color:'#111827',margin:'0 0 6px' }}>Welcome back 👋</h1>
          <p style={{ fontSize:15,color:'#6B7280',margin:0 }}>Sign in to your account to continue</p>
        </div>

        <div style={{ background:'#fff',borderRadius:20,padding:'32px',boxShadow:'0 4px 24px rgba(0,0,0,0.07)',border:'1px solid #E5E7EB' }}>
          {error && (
            <div style={{ marginBottom:20,padding:'12px 16px',background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,color:'#991B1B',fontSize:13,display:'flex',alignItems:'center',gap:8 }}>
              <span>⚠️</span>{error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6 }}>Email Address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="your.email@company.com"
                style={{ width:'100%',height:46,padding:'0 14px',border:'1.5px solid #E5E7EB',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box',background:'#FAFBFC',color:'#111827',transition:'all 0.2s' }}
                onFocus={e=>{e.target.style.borderColor='#4F46E5';e.target.style.boxShadow='0 0 0 3px rgba(79,70,229,0.1)';e.target.style.background='#fff';}}
                onBlur={e=>{e.target.style.borderColor='#E5E7EB';e.target.style.boxShadow='none';e.target.style.background='#FAFBFC';}}/>
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6 }}>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Enter your password"
                style={{ width:'100%',height:46,padding:'0 14px',border:'1.5px solid #E5E7EB',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box',background:'#FAFBFC',color:'#111827',transition:'all 0.2s' }}
                onFocus={e=>{e.target.style.borderColor='#4F46E5';e.target.style.boxShadow='0 0 0 3px rgba(79,70,229,0.1)';e.target.style.background='#fff';}}
                onBlur={e=>{e.target.style.borderColor='#E5E7EB';e.target.style.boxShadow='none';e.target.style.background='#FAFBFC';}}/>
            </div>
            <div style={{ textAlign:'right',marginBottom:24 }}>
              <Link to="/forgot-password" style={{ color:'#4F46E5',fontSize:13,fontWeight:500,textDecoration:'none' }}
                onMouseEnter={e=>e.target.style.textDecoration='underline'} onMouseLeave={e=>e.target.style.textDecoration='none'}>
                Forgot password?
              </Link>
            </div>
            <button type="submit" disabled={loading} style={{ width:'100%',height:48,borderRadius:12,border:'none',background:loading?'#9CA3AF':'linear-gradient(135deg,#4F46E5,#6366F1)',color:'#fff',fontSize:15,fontWeight:700,cursor:loading?'default':'pointer',boxShadow:loading?'none':'0 4px 14px rgba(79,70,229,0.35)',transition:'all 0.2s' }}
              onMouseEnter={e=>{if(!loading)e.currentTarget.style.transform='translateY(-1px)';}}
              onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';}}>
              {loading?(
                <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                  <svg style={{ animation:'spin 0.8s linear infinite',width:18,height:18 }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                  </svg>Signing in...
                </span>
              ):'Sign In →'}
            </button>
          </form>
          <div style={{ margin:'24px 0',height:1,background:'#F3F4F6' }}/>
          <p style={{ textAlign:'center',fontSize:14,color:'#6B7280',margin:0 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'#4F46E5',fontWeight:700,textDecoration:'none' }}
              onMouseEnter={e=>e.target.style.textDecoration='underline'} onMouseLeave={e=>e.target.style.textDecoration='none'}>
              Create one →
            </Link>
          </p>
        </div>

        <div style={{ display:'flex',gap:12,marginTop:24 }}>
          {[{value:'10K+',label:'Shout-outs given'},{value:'500+',label:'Teams onboarded'},{value:'98%',label:'Satisfaction'}].map((s,i)=>(
            <div key={i} style={{ flex:1,background:'#fff',borderRadius:12,padding:'14px 10px',textAlign:'center',border:'1px solid #E5E7EB' }}>
              <p style={{ fontSize:18,fontWeight:800,color:'#4F46E5',margin:'0 0 2px' }}>{s.value}</p>
              <p style={{ fontSize:11,color:'#9CA3AF',margin:0,fontWeight:500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Login;
