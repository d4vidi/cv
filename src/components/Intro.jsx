import { PROFILE } from '../data/cv.js';

export default function Intro() {
  return (
    <div className="lead soft">
      <p style={{ margin: 0 }}>
        Accomplished software engineer with <strong>20+ years</strong> of cross-domain experience
          in <strong>frontend &amp; mobile development</strong> (focus on animations &amp; visual effects), mobile <strong>apps</strong>, mobile <strong>development tools</strong>, <strong>Android</strong>,&nbsp;
        <strong>React Native</strong>, backend and real-time embedded systems.
        Spent more than 10 years at <strong>Wix</strong>, leading&nbsp;
          <strong><a href="https://wix.github.io/Detox" target="_blank" rel="noopener" style={{ fontWeight: 700 }}>Detox</a></strong>:
        the company’s popular, flagship open-source project. Most recently directed animations &amp; visual effects
        initiatives within Wix’s Design Studio.
      </p>
    </div>
  );
}
