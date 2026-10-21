import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';

const concepts = [
  { number: '01', icon: 'layers', title: '组件化思维', text: '把页面拆成可复用的积木，让每个部分只负责一件事。', tag: 'React' },
  { number: '02', icon: 'target', title: '数据驱动界面', text: '数据发生变化，视图就跟着更新；不再手动寻找 DOM。', tag: 'useState' },
  { number: '03', icon: 'book', title: '页面自由切换', text: '使用客户端路由，在一套应用里流畅地切换页面。', tag: 'Router' },
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
          <span className="hero-badge"><Icon name="spark" size={14} /> 前端学习，从这里开始</span>
          <h1>把复杂的知识，<br /><em>讲得明明白白。</em></h1>
          <p>费曼学习平台的第一步已经搭好。用组件组织内容，用状态记录输入，让每个想法都有清晰的落点。</p>
          <div className="hero-actions">
            <Link to="/register" className="button button-primary">创建学习账号 <Icon name="arrow" size={18} /></Link>
            <Link to="/login" className="button button-light">已有账号？登录</Link>
          </div>
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
        <div><span>你的下一步</span><h2 id="next-title">先创建账号页面，再让想法继续生长。</h2><p>本次展示的是前端界面；注册、登录与后端接口将在下一次课接通。</p></div>
        <Link className="text-link" to="/register">查看注册表单 <Icon name="arrow" size={17} /></Link>
      </section>
    </div>
  );
}

export default DashboardPage;
