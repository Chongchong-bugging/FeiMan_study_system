import Icon from '../components/Icon.jsx';

const concepts = [
  { number: '01', icon: 'layers', title: '连接后端 API', text: '使用 Axios 向真实接口发送请求，并处理成功和错误结果。', tag: 'Axios' },
  { number: '02', icon: 'target', title: '共享登录状态', text: '通过 React Context 保存 Token，让页面之间共享认证状态。', tag: 'Context' },
  { number: '03', icon: 'book', title: '保护学习主页', text: '未登录时自动跳转到登录页；刷新后继续保持登录。', tag: 'Router' },
];

function ConceptCard({ number, icon, title, text, tag }) {
  return (
    <article className="concept-card">
      <div className="concept-top"><span className="concept-icon"><Icon name={icon} size={23} /></span><span className="concept-number">{number} / 03</span></div>
      <h3>{title}</h3>
      <p>{text}</p>
      <span className="concept-tag">{tag}</span>
    </article>
  );
}

function DashboardPage() {
  return (
    <div className="page dashboard-page">
      <div className="page-eyebrow"><span className="eyebrow-line" />你的学习空间 <span className="eyebrow-separator">/</span> OVERVIEW</div>
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-badge"><Icon name="spark" size={14} /> 已登录 · 欢迎回来</span>
          <h1>把复杂的知识，<br /><em>讲得明明白白。</em></h1>
          <p>账号已经连接到后端。注册、登录和状态管理组成了完整流程，你的学习空间现在只对已登录用户开放。</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit art-orbit-one" />
          <div className="art-orbit art-orbit-two" />
          <div className="art-card art-card-back"><span>INPUT</span><i /><i /><i /></div>
          <div className="art-card art-card-front"><span className="art-star">✳</span><strong>理解，是能用<br />自己的话说出来。</strong><span className="art-card-foot">LEARN · EXPLAIN · GROW <b>↗</b></span></div>
          <span className="art-float art-float-one">React</span>
          <span className="art-float art-float-two">F.</span>
        </div>
      </section>

      <section className="section concepts-section" aria-labelledby="concepts-title">
        <div className="section-heading"><div><span className="section-kicker">THE FOUNDATION</span><h2 id="concepts-title">本节课的三个关键词<span className="heading-period">.</span></h2></div><span className="section-side-note">从想法到界面 / 01—03</span></div>
        <div className="concept-grid">{concepts.map((concept) => <ConceptCard key={concept.number} {...concept} />)}</div>
      </section>

      <section className="next-section" aria-labelledby="next-title">
        <div className="next-icon"><Icon name="check" size={24} /></div>
        <div><span>你的下一步</span><h2 id="next-title">试着刷新页面，验证登录状态是否保留。</h2><p>也可以点击右上角退出登录，观察路由守卫如何保护学习主页。</p></div>
      </section>
    </div>
  );
}

export default DashboardPage;
